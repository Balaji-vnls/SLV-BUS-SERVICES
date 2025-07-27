import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyPaymentRequest {
  sessionId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get user from auth token
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { sessionId }: VerifyPaymentRequest = await req.json();

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      throw new Error("Payment session not found");
    }

    // Use service role for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get booking from metadata
    const bookingId = session.metadata?.booking_id;

    if (!bookingId) {
      throw new Error("Booking ID not found in payment session");
    }

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabaseService
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single();

    if (bookingError || !booking) {
      throw new Error("Booking not found");
    }

    // Update booking based on payment status
    let updateData: any = {};

    if (session.payment_status === "paid") {
      updateData = {
        payment_status: "paid",
        booking_status: "confirmed",
        updated_at: new Date().toISOString()
      };
    } else if (session.payment_status === "unpaid" || session.status === "expired") {
      updateData = {
        payment_status: "failed",
        booking_status: "cancelled",
        updated_at: new Date().toISOString()
      };
    }

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabaseService
        .from("bookings")
        .update(updateData)
        .eq("id", bookingId);

      if (updateError) {
        throw new Error(`Failed to update booking: ${updateError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        booking_id: bookingId,
        payment_status: session.payment_status,
        booking_status: updateData.booking_status || booking.booking_status,
        session_status: session.status,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});