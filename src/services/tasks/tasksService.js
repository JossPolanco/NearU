import { supabaseClient } from "../../utils/supabase";

export async function createTask({ category_id, title, description }) {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError) throw userError

    const { data, error } = await supabaseClient
        .from('tbl_tasks')
        .insert({ category_id: category_id, created_by: user.id, title: title, description: description })

    if (error) throw error
    return data
}

export async function getTasks(category_id) {
    const { data, error } = await supabaseClient
        .from('tbl_tasks')
        .select(`
            id,
            category_id,
            title,
            description,
            completed,
            active
        `)
        .eq('category_id', category_id)
        .eq('active', true)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function updateTask({ id, category_id, title, description }) {
    const { data, error } = await supabaseClient
        .from('tbl_tasks')
        .update({ category_id: category_id, title: title, description: description })
        .eq('id', id)

    if (error) throw error
    return data
}

export async function deleteTask({ id }) {
    const { data, error } = await supabaseClient
        .from('tbl_tasks')
        .update({ active: false })
        .eq('id', id)

    if (error) throw error
    return data
}

export async function completeTask({ id, completed }) {
    const { data, error } = await supabaseClient
        .from('tbl_tasks')
        .update({ completed: completed, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw error
    return data
}