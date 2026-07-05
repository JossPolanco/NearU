import { supabaseClient } from "../../utils/supabase";

export async function getDateById(id) {
    const { data, error } = await supabaseClient
        .from("tbl_dates")
        .select("*, image_metadata(storage_path, bucket)")
        .eq("id", id)
        .eq("active", true)
        .single()

    if (error) throw error
    return data
}

export async function updateDateDescription({ id, description }) {
    const { data, error } = await supabaseClient
        .from("tbl_dates")
        .update({ description: description, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data
}