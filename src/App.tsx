import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { AIChatbot } from "@/components/AIChatbot";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import ListingDetail from "./pages/ListingDetail.tsx";
import ProfilePage from "./pages/Profile.tsx";
import CreatePost from "./pages/CreatePost.tsx";
import Chats from "./pages/Chats.tsx";
import ExternalSearch from "./pages/ExternalSearch.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import About from "./pages/About.tsx";
import Favorites from "./pages/Favorites.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/post/create" element={<CreatePost />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/search/external" element={<ExternalSearch />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
            <AIChatbot />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
