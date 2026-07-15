import { supabaseClient } from "../../utils/supabase";

export async function createDiaryEntry({ title, content, entryDate, mood = 'normal' }) {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    const { error } = await supabaseClient
        .from('tbl_diary_entries')
        .insert({
            title,
            content,
            entry_date: entryDate,
            mood,
            author_id: user.id
        });
    if (error) throw error;
    return true;
}

export async function getDiaryEntryByDate(date) {
    const { data, error } = await supabaseClient
        .from('tbl_diary_entries')
        .select('*')
        .eq('entry_date', date);

    if (error) throw error;

    return data || [];
}

export async function updateDiaryEntry({ id, title, content, entryDate, mood }) {
    const { error } = await supabaseClient
        .from('tbl_diary_entries')
        .update({ title, content, entry_date: entryDate, mood })
        .eq('id', id);
    if (error) throw error;
    return true;
}

export async function deleteDiaryEntry(id) {
    const { error } = await supabaseClient
        .from('tbl_diary_entries')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return true;
}