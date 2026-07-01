import { supabaseClient } from "../../utils/supabase";

export async function createTaskCategory({ title, description, icon }) {
    const { data, error } = await supabaseClient
        .from('tbl_tasks_category')
        .insert({ title: title, description: description, icon: icon })

    if (error) throw error
    return data
}

export async function updateTaskCategory({ id, title, description, icon }) {
    const { data, error } = await supabaseClient
        .from('tbl_tasks_category')
        .update({ title: title, description: description, icon: icon })
        .eq('id', id)

    if (error) throw error
    return data
}

export async function deleteTaskCategory({ id }) {
    const { data, error } = await supabaseClient
        .from('tbl_tasks_category')
        .update({ active: false })
        .eq('id', id)

    if (error) throw error
    return data
}

export async function getTaskCategories() {
    const { data, error } = await supabaseClient
        .from('tbl_tasks_category')
        .select(`
            id,
            title,
            description,
            icon,
            tbl_tasks (
                completed,
                active
            )
        `)
        .eq('active', true)
        .eq('tbl_tasks.active', true)

    if (error) throw error

    const mappedData = data.map(category => {
        const tasks = category.tbl_tasks || []
        const totalTask = tasks.length
        const completedTask = tasks.filter(t => t.completed).length
        return {
            id: category.id,
            title: category.title,
            description: category.description,
            icon: category.icon,
            totalTask,
            completedTask
        }
    })
    return mappedData
}

export async function getTaskCategory(id) {
    const { data, error } = await supabaseClient
        .from('tbl_tasks_category')
        .select('id, title, description')
        .eq('id', id)
        .eq('active', true)
        .single()

    if (error) throw error
    return data
}


