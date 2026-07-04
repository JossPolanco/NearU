import { supabaseClient } from "../../utils/supabase";

export async function getDateTasks(dateId) {
    const { data, error } = await supabaseClient
        .from("tbl_date_tasks")
        .select("*")
        .eq("date_id", dateId)
        .eq("active", true)

    if (error) throw error
    return data
}

export async function createTask(dateId, title) {
    const { data, error } = await supabaseClient
        .from("tbl_date_tasks")
        .insert({ date_id: dateId, title: title })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateTask(id, completed) {
    const { data, error } = await supabaseClient
        .from("tbl_date_tasks")
        .update({ completed: completed })
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteTask(id) {
    const { error } = await supabaseClient
        .from("tbl_date_tasks")
        .update({ active: false })
        .eq("id", id)

    if (error) throw error
}

