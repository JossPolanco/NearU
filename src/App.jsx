import Login from "./pages/Login";
import { useEffect } from "react"

export default function App() {
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'valentine';

        document.documentElement.setAttribute(
            'data-theme',
            savedTheme
        );
    }, []);

    return (
        <Login />
    )
}