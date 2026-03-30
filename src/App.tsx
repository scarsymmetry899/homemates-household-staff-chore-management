import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import AppLayout from "./components/layout/AppLayout";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import StaffDirectory from "./pages/StaffDirectory";
import StaffProfile from "./pages/StaffProfile";
import TasksPage from "./pages/TasksPage";
import PayrollPage from "./pages/PayrollPage";
import InsightsPage from "./pages/InsightsPage";
import ExpensesPage from "./pages/ExpensesPage";
import AlertsPage from "./pages/AlertsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("homemaker_auth") === "true";
  });

  const handleLogin = (name?: string) => {
    localStorage.setItem("homemaker_auth", "true");
    if (name) {
      localStorage.setItem("homemaker_owner_name", name);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("homemaker_auth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthPage onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/staff" element={<StaffDirectory />} />
                <Route path="/staff/:id" element={<StaffProfile />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/payroll" element={<PayrollPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/settings" element={<SettingsPage onLogout={handleLogout} />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
