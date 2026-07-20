import {
    Register, DrawingPage, Home, TestingPage, NotFound, PasswordRegistration, Configuration, Diary, DiaryDetail,
    Login, Chat, StarredMessages, Anniversary, Tasks, TaskDetail, Dates, DateDetail, Notes, NotesGallery,
    Anniversaries, AnniversaryDetail, Geolocation, Games, Pinturillo, PintNewGame
} from "@/pages";
import { createBrowserRouter } from "react-router";
import AuthProvider from "./utils/AuthContext";
import Layout from "./Layout";

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
                    <Chat />
                )
            },
            {
                path: "/starred-messages",
                element: (
                    <StarredMessages />
                )
            },
            {
                path: "/tasks",
                element: (
                    <Layout>
                        <Tasks />
                    </Layout>
                )
            },
            {
                path: "/task/:id",
                element: (
                    <Layout>
                        <TaskDetail />
                    </Layout>
                )
            },
            {
                path: "/dates",
                element: (
                    <Layout>
                        <Dates />
                    </Layout>
                )
            },
            {
                path: "/date/:id",
                element: (
                    <Layout>
                        <DateDetail />
                    </Layout>
                )
            },
            {
                path: "/notes",
                element: (
                    <Layout>
                        <Notes />
                    </Layout>
                )
            },
            {
                path: "/notes-gallery",
                element: (
                    <Layout>
                        <NotesGallery />
                    </Layout>
                )
            },
            {
                path: "/diary",
                element: (
                    <Layout>
                        <Diary />
                    </Layout>
                )
            },
            {
                path: "/diary-detail/:currentDate",
                element: (
                    <Layout>
                        <DiaryDetail />
                    </Layout>
                )
            },
            {
                path: "/anniversaries",
                element: (
                    <Layout>
                        <Anniversaries />
                    </Layout>
                )
            },
            {
                path: "/anniversary-detail/:id",
                element: (
                    <Layout>
                        <AnniversaryDetail />
                    </Layout>
                )
            },
            {
                path: "/geolocation",
                element: (
                    <Layout>
                        <Geolocation />
                    </Layout>
                )
            },
            {
                path: "/games",
                element: (
                    <Layout>
                        <Games />
                    </Layout>
                )
            },
            {
                path: "/pinturillo",
                element: (
                    <Layout>
                        <Pinturillo />
                    </Layout>
                )
            },
            {
                path: "/pinturillo/newgame",
                element: (
                    <Layout>
                        <PintNewGame />
                    </Layout>
                )
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    },
    {
        path: "/anniversary",
        element: <Anniversary />
    }
], { basename: '/NearU' });