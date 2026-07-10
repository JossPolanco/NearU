import { supabaseClient } from "../../utils/supabase";

export async function createNote({ title, image_id, image_metadata_id }) {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError) throw userError;

    const { data, error } = await supabaseClient
        .from('tbl_notes')
        .insert({ 
            title: title, 
            image_id: image_id || image_metadata_id, 
            created_by: user.id 
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getNotes() {
    const { data, error } = await supabaseClient
        .from('tbl_notes')
        .select(`
            id,
            title,
            created_at,
            created_by,
            image_id,
            image_metadata (
                id,
                storage_path,
                bucket
            )
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function deleteNote(id) {
    const { error } = await supabaseClient
        .from('tbl_notes')
        .update({ active: false })
        .eq('id', id);

    if (error) throw error;
}

export async function getLast5Notes() {
    const { data, error } = await supabaseClient
        .from('tbl_notes')
        .select(`
            id,
            title,
            created_at,
            created_by,
            image_id,
            image_metadata (
                id,
                storage_path,
                bucket
            )
        `)
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) throw error;
    return data;
}