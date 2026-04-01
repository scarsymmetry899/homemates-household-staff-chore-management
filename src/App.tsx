import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
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
import NfcLogger from "./pages/NfcLogger";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthGuard>
              <AppProvider>
                <Routes>
                  <Route path="/nfc-terminal" element={<NfcLogger />} />
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/staff" element={<StaffDirectory />} />
                    <Route path="/staff/:id" element={<StaffProfile />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/payroll" element={<PayrollPage />} />
                    <Route path="/insights" element={<InsightsPage />} />
                    <Route path="/expenses" element={<ExpensesPage />} />
                    <Route path="/alerts" element={<AlertsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppProvider>
            </AuthGuard>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
