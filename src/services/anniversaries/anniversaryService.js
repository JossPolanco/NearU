import { supabaseClient } from "../../utils/supabase";

export async function createAnniversary({ title, description, eventDate, recurrenceType, reminderDaysBefore }) {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabaseClient
        .from("tbl_anniversaries")
        .insert({
            created_by: user.id,
            title,
            description,
            event_date: eventDate,
            recurrence_type: recurrenceType,
            reminder_days_before: reminderDaysBefore
        });

    if (error) throw error;

    return data;
}

export async function getAnniversaries() {
    const { data, error } = await supabaseClient
        .from("tbl_anniversaries")
        .select("*")
        .order("created_at", { ascending: false })
        .select();

    if (error) throw error;

    return data;
}

export async function getAnniversariesById(id) {
    const { data, error } = await supabaseClient
        .from("tbl_anniversaries")
        .select("*")
        .eq("id", id)
        .order("created_at", { ascending: false })
        .select();

    if (error) throw error;

    return data;
}

export async function updateAnniversary({ id, title, description, eventDate, recurrenceType, reminderDaysBefore }) {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabaseClient
        .from("tbl_anniversaries")
        .update({
            created_by: user.id,
            title,
            description,
            event_date: eventDate,
            recurrence_type: recurrenceType,
            reminder_days_before: reminderDaysBefore
        })
        .eq("id", id)
        .select();

    if (error) throw error;

    return data;
}

export async function deleteAnniversary(id) {
    const { data, error } = await supabaseClient
        .from("tbl_anniversaries")
        .delete()
        .eq("id", id);

    if (error) throw error;

    return data;
}