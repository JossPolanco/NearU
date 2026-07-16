import { supabaseClient } from "../../utils/supabase";

export async function getUserMood() {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    const result = await supabaseClient
        .from("tbl_profiles")
        .select("gender, mood")
        .eq("id", user.id)
        .single();

    if (result.error) {
        throw result.error;
    }

    return result.data;
}

export async function updateUserMood(mood) {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    const result = await supabaseClient
        .from("tbl_profiles")
        .update({ mood })
        .eq("id", user.id);

    if (result.error) {
        throw result.error;
    }

    return result.data;
}

export async function getPartnerMood() {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    const result = await supabaseClient
        .from("tbl_profiles")
        .select("mood")
        .neq("id", user.id)
        .single();

    if (result.error) {
        throw result.error;
    }

    return result.data;
}