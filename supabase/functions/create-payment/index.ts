import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  bookingId: string;
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

    const { bookingId }: PaymentRequest = await req.json();

    if (!bookingId) {
      throw new Error("Booking ID is required");
    }

    // Use service role for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseService
      .from("bookings")
      .select(`
        *,
        schedules(
          journey_date,
          departure_time,
          routes(from_city, to_city),
          buses(bus_number, operator)
        )
      `)
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single();

    if (bookingError || !booking) {
      throw new Error("Booking not found");
    }

    if (booking.payment_status === "paid") {
      throw new Error("Booking already paid");
    }

    if (booking.booking_status === "cancelled") {
      throw new Error("Booking is cancelled");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get user profile for customer details
    const { data: profile } = await supabaseService
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .single();

    // Check if Stripe customer exists
    const customers = await stripe.customers.list({ 
      email: user.email, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Bus Ticket - ${booking.schedules.routes.from_city} to ${booking.schedules.routes.to_city}`,
              description: `${booking.schedules.buses.operator} | ${booking.schedules.buses.bus_number} | ${booking.schedules.journey_date} | Seats: ${booking.seat_numbers.join(", ")}`,
            },
            unit_amount: Math.round(booking.total_amount * 100), // Convert to paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/booking-success?booking_id=${booking.id}`,
      cancel_url: `${req.headers.get("origin")}/booking/${booking.id}`,
      metadata: {
        booking_id: booking.id,
        user_id: user.id,
        booking_reference: booking.booking_reference,
      },
    });

    // Update booking with payment session ID
    await supabaseService
      .from("bookings")
      .update({ payment_id: session.id })
      .eq("id", booking.id);

    return new Response(
      JSON.stringify({ 
        url: session.url,
        session_id: session.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Payment error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});