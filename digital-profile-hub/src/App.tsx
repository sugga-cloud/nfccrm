import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import PublicProfile from "./pages/PublicProfile";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Staff from "./pages/Staff";
import PlanDetail from "./pages/PlanDetail";
import ProductDetail from "./pages/ProductDetail";
import SubscriptionExpired from "./pages/SubscriptionExpired";
import AccountDeactivated from "./pages/AccountDeactivated";
import ProfileDisabled from "./pages/ProfileDisabled";
import CheckoutPage from "./pages/Checkout";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RoleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/subscription-expired" element={<SubscriptionExpired />} />
            <Route path="/profile-disabled" element={<ProfileDisabled />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/banned" element={<AccountDeactivated />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/:username" element={<PublicProfile />} />
            <Route path="/plans/:id" element={<PlanDetail />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </RoleProvider>
  </QueryClientProvider>
);

export default App;
