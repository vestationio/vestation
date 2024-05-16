import "./styles/global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PageLayout from "./components/PageLayout";
import NotMatchPage from "./components/NotMatchPage";
import LandingPage from "./pages/LandingPage";
import Lending from "./pages/Lending";
import VeSCA from "./pages/VeSCA";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    element: <PageLayout />,
    children: [
      {
        path: "/lending",
        element: <Lending />
      },
      {
        path: "/vesca",
        element: <VeSCA />
      }
    ]
  },
  {
    path: "*",
    element: <NotMatchPage />
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
