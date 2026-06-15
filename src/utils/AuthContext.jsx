import { useNavigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { supabaseClient } from "./supabase";

export default function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkSession() {
            const { data: { session }, } = await supabaseClient.auth.getSession();

            if (!session) {
                navigate("/");
            }

            setLoading(false);
        }

        checkSession();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <Outlet />;
}