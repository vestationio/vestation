import "./styles/global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PageLayout from "./components/PageLayout";
import NotMatchPage from "./components/NotMatchPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MyPositions from "./pages/MyPositions";
import Reward from "./pages/Reward";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    element: <PageLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/my-positions",
        element: <MyPositions />
      },
      {
        path: "/reward",
        element: <Reward />
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
