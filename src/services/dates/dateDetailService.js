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

export async function getDateTasks(id) {
    const { data, error } = await supabaseClient
        .from("tbl_date_tasks")
        .select("*")
        .eq("date_id", id)
        .eq("active", true)

    if (error) throw error
    return data
}

