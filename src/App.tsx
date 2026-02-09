import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { GameProvider } from "@/contexts/GameContext";
import { GameLayout } from "@/components/layout/GameLayout";
import { WaitlistModal } from "@/components/home/WaitlistModal";
import Home from "./pages/Home";
import Academy from "./pages/Academy";
import Adventure from "./pages/Adventure";
import NotFound from "./pages/NotFound";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient();

const NAVIGATION_COUNT_KEY = 'navigation_count';
const NAVIGATION_THRESHOLD = 3;

function NavigationTracker() {
  const location = useLocation();
  const [showWaitlist, setShowWaitlist] = useState(false);

  useEffect(() => {
    // Get current navigation count from localStorage
    const currentCount = parseInt(localStorage.getItem(NAVIGATION_COUNT_KEY) || '0', 10);
    const newCount = currentCount + 1;

    // Update navigation count
    localStorage.setItem(NAVIGATION_COUNT_KEY, newCount.toString());

    // Show waitlist modal after 3 navigations
    if (newCount >= NAVIGATION_THRESHOLD) {
      setTimeout(() => {
        setShowWaitlist(true);
        // Reset counter after showing modal
        localStorage.setItem(NAVIGATION_COUNT_KEY, '0');
      }, 500); // Small delay for better UX
    }
  }, [location.pathname]);

  return (
    <WaitlistModal
      isOpen={showWaitlist}
      onClose={() => setShowWaitlist(false)}
    />
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <Analytics />
          <SpeedInsights />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <NavigationTracker />
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
  </HelmetProvider>
);

export default App;
