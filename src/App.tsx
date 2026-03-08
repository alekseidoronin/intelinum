import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import WritingStyle from "./pages/WritingStyle";
import VisualStyle from "./pages/VisualStyle";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import RailA from "./pages/RailA";
import RailB from "./pages/RailB";
import Result from "./pages/Result";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import ImageEditor from "./pages/ImageEditor";
import CarouselEditor from "./pages/CarouselEditor";
import Pricing from "./pages/Pricing";
import Education from "./pages/Education";
import Solutions from "./pages/Solutions";
import News from "./pages/News";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile/style" element={<WritingStyle />} />
            <Route path="/profile/visual" element={<VisualStyle />} />
            <Route path="/home" element={<Home />} />
            <Route path="/rail-a" element={<RailA />} />
            <Route path="/rail-b" element={<RailB />} />
            <Route path="/result" element={<Result />} />
            <Route path="/library" element={<Library />} />
            <Route path="/image-editor" element={<ImageEditor />} />
            <Route path="/carousel-editor" element={<CarouselEditor />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/education" element={<Education />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/news" element={<News />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
