import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import AuthProvider from "./utils/AuthContext";
import Layout from "./Layout";

// Lazy loaded page components
const Login = lazy(() => import("./pages/user/Login"));
const Register = lazy(() => import("./pages/user/Register"));
const PasswordRegistration = lazy(() => import("./pages/user/PasswordRegistration"));
const Configuration = lazy(() => import("./pages/user/Configuration"));
const Home = lazy(() => import("./pages/Home"));
const DrawingPage = lazy(() => import("./pages/drawer/DrawingPage"));
const TestingPage = lazy(() => import("./pages/TestingPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Chat = lazy(() => import("./pages/chat/Chat"));
const StarredMessages = lazy(() => import("./pages/chat/StarredMessages"));
const Tasks = lazy(() => import("./pages/tasks/Tasks"));
const TaskDetail = lazy(() => import("./pages/tasks/TaskDetail"));
const Dates = lazy(() => import("./pages/dates/Dates"));
const DateDetail = lazy(() => import("./pages/dates/DateDetail"));
const Notes = lazy(() => import("./pages/notes/Notes"));
const NotesGallery = lazy(() => import("./pages/notes/NotesGallery"));
const Diary = lazy(() => import("./pages/diary/Diary"));
const DiaryDetail = lazy(() => import("./pages/diary/DiaryDetail"));
const Anniversaries = lazy(() => import("./pages/anniversaries/Anniversaries"));
const AnniversaryDetail = lazy(() => import("./pages/anniversaries/AnniversaryDetail"));
const Anniversary = lazy(() => import("./pages/Anniversary"));
const Geolocation = lazy(() => import("./pages/geolocation/Geolocation"));
const Games = lazy(() => import("./pages/games/Games"));
const Pinturillo = lazy(() => import("./pages/games/pinturillo/Pinturillo"));
const PintNewGame = lazy(() => import("./pages/games/pinturillo/PintNewGame"));
const PinturilloGuess = lazy(() => import("./pages/games/pinturillo/PinturilloGuess"));

const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
);

const LazyPage = ({ children }) => (
    <Suspense fallback={<PageLoader />}>
        {children}
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LazyPage><Login /></LazyPage>
    },
    {
        path: "/register", element: (
            <LazyPage><Register /></LazyPage>
        ),
    },
    {
        element: <AuthProvider />,
        children: [
            {
                path: "/home", element: (
                    <Layout>
                        <LazyPage><Home /></LazyPage>
                    </Layout>
                ),
            },
            {
                path: "/create-password",
                element: <LazyPage><PasswordRegistration /></LazyPage>
            },
            {
                path: "/drawing",
                element: (
                    <Layout>
                        <LazyPage><DrawingPage /></LazyPage>
                    </Layout>
                ),
            },
            {
                path: "/testing",
                element: (
                    <Layout>
                        <LazyPage><TestingPage /></LazyPage>
                    </Layout>
                ),
            },
            {
                path: "/config",
                element: (
                    <Layout>
                        <LazyPage><Configuration /></LazyPage>
                    </Layout>
                ),
            },
            {
                path: "/chat",
                element: (
                    <LazyPage><Chat /></LazyPage>
                )
            },
            {
                path: "/starred-messages",
                element: (
                    <LazyPage><StarredMessages /></LazyPage>
                )
            },
            {
                path: "/tasks",
                element: (
                    <Layout>
                        <LazyPage><Tasks /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/task/:id",
                element: (
                    <Layout>
                        <LazyPage><TaskDetail /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/dates",
                element: (
                    <Layout>
                        <LazyPage><Dates /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/date/:id",
                element: (
                    <Layout>
                        <LazyPage><DateDetail /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/notes",
                element: (
                    <Layout>
                        <LazyPage><Notes /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/notes-gallery",
                element: (
                    <Layout>
                        <LazyPage><NotesGallery /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/diary",
                element: (
                    <Layout>
                        <LazyPage><Diary /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/diary-detail/:currentDate",
                element: (
                    <Layout>
                        <LazyPage><DiaryDetail /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/anniversaries",
                element: (
                    <Layout>
                        <LazyPage><Anniversaries /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/anniversary-detail/:id",
                element: (
                    <Layout>
                        <LazyPage><AnniversaryDetail /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/geolocation",
                element: (
                    <Layout>
                        <LazyPage><Geolocation /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/games",
                element: (
                    <Layout>
                        <LazyPage><Games /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/pinturillo",
                element: (
                    <Layout>
                        <LazyPage><Pinturillo /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/pinturillo/newgame",
                element: (
                    <Layout>
                        <LazyPage><PintNewGame /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "pinturillo/play/:id",
                element: (
                    <Layout>
                        <LazyPage><PinturilloGuess /></LazyPage>
                    </Layout>
                )
            }
        ]
    },
    {
        path: "*",
        element: <LazyPage><NotFound /></LazyPage>
    },
    {
        path: "/anniversary",
        element: <LazyPage><Anniversary /></LazyPage>
    }
], { basename: '/NearU' });