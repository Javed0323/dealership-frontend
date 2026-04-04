import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { Providers } from "@/app/providers";
import { AppRouter } from "@/app/router";
import "./styles/global.css";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Providers>
      <AppRouter />
    </Providers>
  </QueryClientProvider>,
);
