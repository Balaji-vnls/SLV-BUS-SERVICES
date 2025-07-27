import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingRequest {
  scheduleId: string;
  seatNumbers: string[];
  passengerDetails: {
    name: string;
    age: number;
    gender: string;
    phone: string;
  }[];
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

    const { scheduleId, seatNumbers, passengerDetails }: BookingRequest = await req.json();

    // Validate input
    if (!scheduleId || !seatNumbers?.length || !passengerDetails?.length) {
      throw new Error("Invalid booking data");
    }

    if (seatNumbers.length !== passengerDetails.length) {
      throw new Error("Seat count must match passenger count");
    }

    // Use service role for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Start transaction-like operations
    // 1. Get schedule details and check availability
    const { data: schedule, error: scheduleError } = await supabaseService
      .from("schedules")
      .select(`
        *,
        buses(bus_number, operator, total_seats),
        routes(from_city, to_city)
      `)
      .eq("id", scheduleId)
      .eq("is_active", true)
      .single();

    if (scheduleError || !schedule) {
      throw new Error("Schedule not found or inactive");
    }

    if (schedule.available_seats < seatNumbers.length) {
      throw new Error("Not enough seats available");
    }

    // Check if journey date is not in the past
    const journeyDate = new Date(schedule.journey_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (journeyDate < today) {
      throw new Error("Cannot book for past dates");
    }

    // 2. Check if seats are already booked
    const { data: existingBookings } = await supabaseService
      .from("bookings")
      .select("seat_numbers")
      .eq("schedule_id", scheduleId)
      .in("booking_status", ["pending", "confirmed"]);

    const bookedSeats = existingBookings?.flatMap(b => b.seat_numbers) || [];
    const conflictingSeats = seatNumbers.filter(seat => bookedSeats.includes(seat));

    if (conflictingSeats.length > 0) {
      throw new Error(`Seats already booked: ${conflictingSeats.join(", ")}`);
    }

    // 3. Calculate total amount
    const totalAmount = schedule.price * seatNumbers.length;

    // 4. Generate booking reference
    const { data: bookingRef } = await supabaseService.rpc("generate_booking_reference");

    // 5. Create booking
    const { data: booking, error: bookingError } = await supabaseService
      .from("bookings")
      .insert({
        user_id: user.id,
        schedule_id: scheduleId,
        seat_numbers: seatNumbers,
        passenger_details: passengerDetails,
        total_amount: totalAmount,
        booking_reference: bookingRef,
        booking_status: "pending",
        payment_status: "pending"
      })
      .select()
      .single();

    if (bookingError) {
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    // Return booking details
    const response = {
      booking_id: booking.id,
      booking_reference: booking.booking_reference,
      total_amount: booking.total_amount,
      schedule: {
        journey_date: schedule.journey_date,
        departure_time: schedule.departure_time,
        arrival_time: schedule.arrival_time,
        from_city: schedule.routes.from_city,
        to_city: schedule.routes.to_city,
        bus_number: schedule.buses.bus_number,
        operator: schedule.buses.operator
      },
      seat_numbers: seatNumbers,
      passenger_details: passengerDetails
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Booking error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});