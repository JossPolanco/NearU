import { createBrowserRouter, useRouteError } from "react-router";
import { lazy, Suspense, useEffect } from "react";
import AuthProvider from "./utils/AuthContext";
import Layout from "./Layout";

// Helper para reintentar y recargar automáticamente la app si un chunk falló por despliegue de nueva versión
const lazyRetry = (importFn) =>
    lazy(async () => {
        try {
            return await importFn();
        } catch (error) {
            const isImportError =
                error?.message?.includes("dynamically imported module") ||
                error?.message?.includes("Failed to fetch") ||
                error?.message?.includes("Importing a module script failed");

            if (isImportError) {
                const lastReload = sessionStorage.getItem("chunk_reload_time");
                const now = Date.now();
                if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
                    sessionStorage.setItem("chunk_reload_time", now.toString());
                    window.location.assign(import.meta.env.BASE_URL || "/");
                    return new Promise(() => {}); // Espera la redirección
                }
            }
            throw error;
        }
    });

// Lazy loaded page components con protección de auto-recarga
const Login = lazyRetry(() => import("./pages/user/Login"));
// const Register = lazyRetry(() => import("./pages/user/Register"));
// const PasswordRegistration = lazyRetry(() => import("./pages/user/PasswordRegistration"));
const Configuration = lazyRetry(() => import("./pages/user/Configuration"));
const Home = lazyRetry(() => import("./pages/Home"));
const DrawingPage = lazyRetry(() => import("./pages/drawer/DrawingPage"));
const TestingPage = lazyRetry(() => import("./pages/TestingPage"));
const NotFound = lazyRetry(() => import("./pages/NotFound"));
const Chat = lazyRetry(() => import("./pages/chat/Chat"));
const StarredMessages = lazyRetry(() => import("./pages/chat/StarredMessages"));
const Tasks = lazyRetry(() => import("./pages/tasks/Tasks"));
const TaskDetail = lazyRetry(() => import("./pages/tasks/TaskDetail"));
const Dates = lazyRetry(() => import("./pages/dates/Dates"));
const DateDetail = lazyRetry(() => import("./pages/dates/DateDetail"));
const Notes = lazyRetry(() => import("./pages/notes/Notes"));
const NotesGallery = lazyRetry(() => import("./pages/notes/NotesGallery"));
const Diary = lazyRetry(() => import("./pages/diary/Diary"));
const DiaryDetail = lazyRetry(() => import("./pages/diary/DiaryDetail"));
const Anniversaries = lazyRetry(() => import("./pages/anniversaries/Anniversaries"));
const AnniversaryDetail = lazyRetry(() => import("./pages/anniversaries/AnniversaryDetail"));
const Anniversary = lazyRetry(() => import("./pages/Anniversary"));
const Geolocation = lazyRetry(() => import("./pages/geolocation/Geolocation"));
const Games = lazyRetry(() => import("./pages/games/Games"));
const Pinturillo = lazyRetry(() => import("./pages/games/pinturillo/Pinturillo"));
const PintNewGame = lazyRetry(() => import("./pages/games/pinturillo/PintNewGame"));
const PinturilloGuess = lazyRetry(() => import("./pages/games/pinturillo/PinturilloGuess"));
const GirlfriendsDay = lazyRetry(() => import("./pages/GirlfriendsDay"));
const Letters = lazyRetry(() => import("./pages/letters/Letters"));
const SixthMonth = lazyRetry(() => import("./pages/letters/SixthMonth"));

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

const RootErrorBoundary = () => {
    const error = useRouteError();
    console.error("Route error:", error);

    const errorMessage = error?.message || error?.statusText || "";
    const isChunkError =
        errorMessage.includes("dynamically imported module") ||
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("Importing a module script failed");

    useEffect(() => {
        if (isChunkError) {
            const lastReload = sessionStorage.getItem("chunk_error_redirect");
            const now = Date.now();
            if (!lastReload || now - parseInt(lastReload, 10) > 8000) {
                sessionStorage.setItem("chunk_error_redirect", now.toString());
                window.location.assign(import.meta.env.BASE_URL || "/");
            }
        }
    }, [isChunkError]);

    if (isChunkError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-base-100 text-base-content">
                <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                <h1 className="text-xl font-bold mb-1">Actualizando la app...</h1>
                <p className="text-xs opacity-70">
                    Se detectó una nueva versión de NearU. Redirigiéndote al inicio...
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-base-100 text-base-content">
            <h1 className="text-2xl font-bold mb-2">¡Ups! Algo salió mal.</h1>
            <p className="text-sm opacity-70 mb-4 max-w-sm">
                Ha ocurrido un problema temporal al cargar esta sección. Por favor, inténtalo nuevamente.
            </p>
            <button
                type="button"
                onClick={() => window.location.assign(import.meta.env.BASE_URL || "/")}
                className="btn btn-primary btn-sm rounded-xl font-semibold"
            >
                Volver al inicio
            </button>
        </div>
    );
};

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LazyPage><Login /></LazyPage>,
        errorElement: <RootErrorBoundary />
    },
    // {
    //     path: "/register",
    //     element: (
    //         <LazyPage><Register /></LazyPage>
    //     ),
    //     errorElement: <RootErrorBoundary />
    // },
    {
        element: <AuthProvider />,
        errorElement: <RootErrorBoundary />,
        children: [
            {
                path: "/home", element: (
                    <Layout>
                        <LazyPage><Home /></LazyPage>
                    </Layout>
                ),
            },
            // {
            //     path: "/create-password",
            //     element: <LazyPage><PasswordRegistration /></LazyPage>
            // },
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
            },
            {
                path: "/girlfriendsday",
                element: (
                    <Layout>
                        <LazyPage><GirlfriendsDay /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/letters",
                element: (
                    <Layout>
                        <LazyPage><Letters /></LazyPage>
                    </Layout>
                )
            },
            {
                path: "/letters/sixthmonth",
                element: (
                    <LazyPage><SixthMonth /></LazyPage>
                )
            }
        ]
    },
    {
        path: "*",
        element: <LazyPage><NotFound /></LazyPage>,
        errorElement: <RootErrorBoundary />
    },
    {
        path: "/anniversary",
        element: <LazyPage><Anniversary /></LazyPage>,
        errorElement: <RootErrorBoundary />
    }
], { basename: import.meta.env.BASE_URL });