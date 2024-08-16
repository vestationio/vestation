import "./styles/global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "~/query";

import PageLayout from "./components/PageLayout";
import NotMatchPage from "./components/NotMatchPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MyPositions from "./pages/MyPositions";
import Reward from "./pages/Reward";

import { DAppKitProvider } from "@vechain/dapp-kit-react";
import type { WalletConnectOptions } from "@vechain/dapp-kit-react";

const walletConnectOptions: WalletConnectOptions = {
  // Create your project here: https://cloud.walletconnect.com/sign-up
  projectId: "1695852f54e68f30bae73ffdaeea60ca",
  metadata: {
    name: "VeStation",
    description: "VeStation",
    url: window.location.origin,
    icons: [`${window.location.origin}/favicon.svg`]
  }
};

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
    <DAppKitProvider
      nodeUrl="https://mainnet.vechain.org/"
      genesis="main"
      usePersistence={true}
      walletConnectOptions={walletConnectOptions}
      themeMode="DARK"
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </DAppKitProvider>
  </React.StrictMode>
);
