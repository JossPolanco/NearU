// import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import { Register, DrawingPage, Home, TestingPage } from "./pages";
import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import React from "react";
import App from "./App";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path: "/home", element: (
            <Layout>
                <Home />
            </Layout>
        ),
    },
    {
        path: "/register", element: (
            // <Layout>
            // </Layout>
                <Register />
        ),
    },
    {
        path: "/drawing",
        element: (
            <Layout>
                <DrawingPage />
            </Layout>
        ),
    },
    {
        path: "/testing",
        element: (
            <Layout>
                <TestingPage />
            </Layout>
        ),
    }
]);