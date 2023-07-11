import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import World from "./worlds/World.tsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Header from "./Header.tsx";
import Worlds, { loader as worldsLoader } from "./worlds/Worlds.tsx";
import { loader as worldLoader } from "./worlds/World.tsx";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 15000,
            refetchOnWindowFocus: false,
        },
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <Header />
                <Toolbar />
                <Outlet />
            </>
        ),
        children: [
            { path: "/", element: <Worlds />, loader: worldsLoader(queryClient) },
            {
                path: "/world/:worldId",
                element: <World />,
                loader: worldLoader(queryClient),
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <RouterProvider router={router} />
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
