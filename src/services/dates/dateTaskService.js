import { supabaseClient } from "../../utils/supabase";

export async function getDateTasks(dateId) {
    const { data, error } = await supabaseClient
        .from("tbl_date_tasks")
        .select("*")
        .eq("date_id", dateId)
        .eq("active", true)
        .order("created_at", { ascending: true })

    if (error) throw error
    return data
}

export async function createDateTask({ dateId, title }) {
    const { data, error } = await supabaseClient
        .from("tbl_date_tasks")
        .insert({ date_id: dateId, title: title })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateDateTask({ id, title }) {
    const { data, error } = await supabaseClient
        .from("tbl_date_tasks")
        .update({ title: title, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function completeDateTask({ id, completed }) {
    const { data, error } = await supabaseClient
        .from("tbl_date_tasks")
        .update({ completed: completed, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteDateTask({ id }) {
    const { data, error } = await supabaseClient
        .from("tbl_date_tasks")
        .update({ active: false, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data
}
