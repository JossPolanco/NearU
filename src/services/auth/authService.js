import { supabaseClient } from "../../utils/supabase";

export async function loginUser({ data }) {
    const email = data.email.trim();
    const password = data.password;
    // Add your login logic here
}

export async function registerUser({ email }) {
    console.log("data en registerUser:", email);
    const trimmedEmail = email.trim();

    const { data, error } = await supabaseClient.auth.signInWithOtp({
        email: trimmedEmail,
    });

    if (error) throw error;
    console.log("data en registerUser después de la llamada a supabase:", data);
    return data;
}