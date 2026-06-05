import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import DrawingPage from "./pages/DrawingPage";
import ReactDOM from "react-dom/client";
import Layout from "./Layout";
import React from "react";
import App from "./App";

const router = createBrowserRouter([
    {
        path: "/", element: (
            <Layout>
                <App />
            </Layout>
        ),
    },
    {
        path: "/drawing",
        element: (
            <Layout>
                <DrawingPage />
            </Layout>
        ),
    }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient()

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
);
