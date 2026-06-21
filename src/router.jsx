import AuthProvider from "./utils/AuthContext";
import { Register, DrawingPage, Home, TestingPage, NotFound, PasswordRegistration, Configuration, Login, ChatPage } from "./pages";
import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import React from "react";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/register", element: (
            <Register />
        ),
    },
    {
        element: <AuthProvider />,
        children: [
            {
                path: "/home", element: (
                    <Layout>
                        <Home />
                    </Layout>
                ),
            },
            {
                path: "/create-password",
                element: <PasswordRegistration />
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
            },
            {
                path: "/config",
                element: (
                    <Layout>
                        <Configuration />
                    </Layout>
                ),
            },
            {
                path: "/chat",
                element: (

                    <ChatPage />

                )
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    },
]);