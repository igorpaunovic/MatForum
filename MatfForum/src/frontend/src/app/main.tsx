import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "@/app/router";
import { Providers } from "@/app/providers";
import { queryClient } from "@/shared/api/queryClient"; // ovo treba videti da li zelim ovako
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers router={router} client={queryClient} />
  </React.StrictMode>
);
