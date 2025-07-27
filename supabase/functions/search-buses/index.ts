import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SearchRequest {
  fromCity: string;
  toCity: string;
  journeyDate: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fromCity, toCity, journeyDate }: SearchRequest = await req.json();

    // Validate input
    if (!fromCity || !toCity || !journeyDate) {
      throw new Error("From city, to city, and journey date are required");
    }

    // Validate date is not in the past
    const searchDate = new Date(journeyDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (searchDate < today) {
      throw new Error("Cannot search for past dates");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Search for available schedules
    const { data: schedules, error } = await supabaseClient
      .from("schedules")
      .select(`
        id,
        departure_time,
        arrival_time,
        price,
        available_seats,
        journey_date,
        buses(
          id,
          bus_number,
          bus_type,
          operator,
          total_seats,
          amenities
        ),
        routes(
          id,
          from_city,
          to_city,
          distance_km,
          duration_hours
        )
      `)
      .eq("journey_date", journeyDate)
      .eq("is_active", true)
      .eq("routes.from_city", fromCity)
      .eq("routes.to_city", toCity)
      .eq("routes.is_active", true)
      .eq("buses.is_active", true)
      .gt("available_seats", 0)
      .order("departure_time");

    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }

    // Transform the data for frontend consumption
    const results = schedules?.map(schedule => ({
      schedule_id: schedule.id,
      bus: {
        id: schedule.buses.id,
        bus_number: schedule.buses.bus_number,
        bus_type: schedule.buses.bus_type,
        operator: schedule.buses.operator,
        total_seats: schedule.buses.total_seats,
        amenities: schedule.buses.amenities
      },
      route: {
        id: schedule.routes.id,
        from_city: schedule.routes.from_city,
        to_city: schedule.routes.to_city,
        distance_km: schedule.routes.distance_km,
        duration_hours: schedule.routes.duration_hours
      },
      journey_date: schedule.journey_date,
      departure_time: schedule.departure_time,
      arrival_time: schedule.arrival_time,
      price: schedule.price,
      available_seats: schedule.available_seats
    })) || [];

    return new Response(
      JSON.stringify({
        results,
        total_count: results.length,
        search_params: {
          from_city: fromCity,
          to_city: toCity,
          journey_date: journeyDate
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Search error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});