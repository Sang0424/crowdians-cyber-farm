import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { GameLayout } from "@/components/layout/GameLayout";
import Home from "./pages/Home";
import Academy from "./pages/Academy";
import Adventure from "./pages/Adventure";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GameLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/adventure" element={<Adventure />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </GameLayout>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
