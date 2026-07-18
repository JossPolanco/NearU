import { supabaseClient } from "../../utils/supabase";

export async function getCurrentUserLocation() {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError) throw userError;

    const { data, error } = await supabaseClient
        .from("tbl_locations")
        .select("*")
        .eq("user_id", user.id);
    if (error) throw error;

    return data;
}

export async function getPartnerLocation() {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError) throw userError;

    const { data, error } = await supabaseClient
        .from("tbl_locations")
        .select("*")
        .neq("user_id", user.id);
    if (error) throw error;

    return data;
}

export async function getLocations() {
    const { data, error } = await supabaseClient
        .from("tbl_locations")
        .select("*");
    if (error) throw error;

    return data;
}

export async function setCurrentLocation({ latitude, longitude, accuracy_meters }) {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError) throw userError;

    console.log("DATA: ", latitude, longitude, accuracy_meters);
    const { data, error } = await supabaseClient
        .from("tbl_locations")
        .upsert(
            {
                user_id: user.id,
                latitude,
                longitude,
                accuracy_meters,
                recorded_at: new Date().toISOString()
            },
            { onConflict: "user_id" }
        )
        .select();

    if (error) throw error;

    console.log("UPDATED DATA: ", data);

    return data;
}