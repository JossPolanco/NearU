import { supabaseClient } from "../../utils/supabase";

export async function createDate({ title, shotDescription, realizationDate, coverId, status }) {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    const { data, error } = await supabaseClient
        .from("tbl_dates")
        .insert({ title: title, short_description: shotDescription, realization_date: realizationDate, cover_image_id: coverId, created_by: user.id, status: status })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateDate({ id, title, shotDescription, realizationDate, coverId, status }) {
    const { data, error } = await supabaseClient
        .from("tbl_dates")
        .update({ title: title, short_description: shotDescription, realization_date: realizationDate, cover_image_id: coverId, status: status })
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteDate(id) {
    const { error } = await supabaseClient
        .from("tbl_dates")
        .update({ active: false })
        .eq("id", id)

    if (error) throw error
}

export async function getDatesByStatus(status = "todas") {
    let query = supabaseClient
        .from("tbl_dates")
        .select("id, title, short_description, realization_date, cover_image_id, image_metadata(storage_path, bucket), status")
        .eq("active", true)
        .order("created_at", { ascending: false })

    if (status && status !== "todas") {
        query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
}