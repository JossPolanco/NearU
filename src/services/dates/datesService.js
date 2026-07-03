import { supabaseClient } from "../../utils/supabase";

export async function createDate({ title, shotDescription, realizationDate, coverId }) {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    const { data, error } = await supabaseClient
        .from("tbl_dates")
        .insert({ title: title, short_description: shotDescription, realization_date: realizationDate, cover_image_id: coverId, created_by: user.id })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateDate({ id, title, shotDescription, realizationDate, coverId }) {
    const { data, error } = await supabaseClient
        .from("tbl_dates")
        .update({ title: title, short_description: shotDescription, realization_date: realizationDate, cover_image_id: coverId })
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

export async function getAllDates() {
    const { data, error } = await supabaseClient
        .from("tbl_dates")
        .select("id, title, short_description, realization_date, cover_image_id, image_metadata(storage_path, bucket), status")
        .eq("active", true)
        .order("realization_date", { ascending: false })

    if (error) throw error
    return data
}