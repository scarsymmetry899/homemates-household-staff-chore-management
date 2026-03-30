import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import AppLayout from "./components/layout/AppLayout";
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

const queryClient = new QueryClient();

const App = () => (
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
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
