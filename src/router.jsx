import AuthProvider from "./utils/AuthContext";
import { Register, DrawingPage, Home, TestingPage, NotFound, PasswordRegistration, Configuration } from "./pages";
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
        path: "*",
        element: <NotFound />
    },
    {
        path: "/register", element: (
            <Register />
        ),
    },
    {
        path: "/create-password",
        element: <PasswordRegistration />
    },
    {
        path: "/home", element: (
            <AuthProvider>
                <Layout>
                    <Home />
                </Layout>
            </AuthProvider>
        ),
    },
    {
        path: "/drawing",
        element: (
            <AuthProvider>
                <Layout>
                    <DrawingPage />
                </Layout>
            </AuthProvider>
        ),
    },
    {
        path: "/testing",
        element: (
            <AuthProvider>
                <Layout>
                    <TestingPage />
                </Layout>
            </AuthProvider>
        ),
    },
    {
        path: "/config",
        element: (
            <AuthProvider>
                <Layout>
                    <Configuration />
                </Layout>
            </AuthProvider>
        ),
    }
]);