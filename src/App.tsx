import { useState, useEffect, type ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import AppLayout from "./components/layout/AppLayout";
import HouseholdSetupWizard from "@/components/HouseholdSetupWizard";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import StaffDirectory from "./pages/StaffDirectory";
import StaffProfile from "./pages/StaffProfile";
import TasksPage from "./pages/TasksPage";
import PayrollPage from "./pages/PayrollPage";
import InsightsPage from "./pages/InsightsPage";
import ExpensesPage from "./pages/ExpensesPage";
import InventoryPage from "./pages/InventoryPage";
import HouseholdPage from "./pages/HouseholdPage";
import AlertsPage from "./pages/AlertsPage";
import SettingsPage from "./pages/SettingsPage";
import StaffWorkspace from "./pages/StaffWorkspace";
import NotFound from "./pages/NotFound";
import { onAuthStateChange, isFirebaseConfigured, signOutFirebase } from "@/lib/firebase";
import { useTelegramPolling } from "@/hooks/useTelegramPolling";
import { useNfcAttendance } from "@/hooks/useNfcAttendance";
import { useAppState } from "@/context/AppContext";
import NfcConfirmation from "@/components/NfcConfirmation";
import { registerSimulateTap } from "@/lib/nfcTestBridge";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

// Inner component that uses AppContext (so hooks that need it live here)
function AppInner({ onLogout }: { onLogout: () => void }) {
  const telegramEnabled = !!import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  useTelegramPolling(telegramEnabled);

  // Global NFC scanning — works on any screen, not just Settings.
  // Toggled from Settings via AppContext's nfcEnabled.
  const { appRole, nfcEnabled, staff, setupComplete } = useAppState();
  const { lastEvent, simulateTap } = useNfcAttendance(nfcEnabled && setupComplete);
  const ownerOnly = (page: ReactElement) => appRole === "owner" ? page : <Navigate to="/" replace />;

  // Expose simulateTap to SettingsPage via the module-level bridge
  useEffect(() => {
    registerSimulateTap(simulateTap);
  }, [simulateTap]);

  if (!setupComplete) {
    return <HouseholdSetupWizard />;
  }

  return (
    <>
      <NfcConfirmation event={lastEvent} staff={staff} />
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={appRole === "staff" ? <StaffWorkspace /> : <Index />} />
            <Route path="/my-day" element={<StaffWorkspace />} />
            <Route path="/staff" element={ownerOnly(<StaffDirectory />)} />
            <Route path="/staff/:id" element={ownerOnly(<StaffProfile />)} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/insights" element={ownerOnly(<InsightsPage />)} />
            <Route path="/expenses" element={ownerOnly(<ExpensesPage />)} />
            <Route path="/inventory" element={ownerOnly(<InventoryPage />)} />
            <Route path="/household" element={ownerOnly(<HouseholdPage />)} />
            <Route path="/alerts" element={ownerOnly(<AlertsPage />)} />
            <Route path="/settings" element={<SettingsPage onLogout={onLogout} />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </>
  );
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("homemaker_auth") === "true";
  });
  const [authChecked, setAuthChecked] = useState(!isFirebaseConfigured);

  // Listen to Firebase auth state if Firebase is configured
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let unsubscribe: (() => void) | null = null;
    onAuthStateChange((user) => {
      if (user) {
        localStorage.setItem("homemaker_auth", "true");
        if (user.displayName) localStorage.setItem("homemaker_owner_name", user.displayName);
        setIsAuthenticated(true);
      } else {
        // Only log out if Firebase says so (prevents clearing local-only sessions)
        if (isFirebaseConfigured) {
          localStorage.removeItem("homemaker_auth");
          setIsAuthenticated(false);
        }
      }
      setAuthChecked(true);
    }).then((unsub) => {
      unsubscribe = unsub;
    });
    return () => { unsubscribe?.(); };
  }, []);

  const handleLogin = (name?: string) => {
    localStorage.setItem("homemaker_auth", "true");
    if (name) localStorage.setItem("homemaker_owner_name", name);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await signOutFirebase();
    localStorage.removeItem("homemaker_auth");
    setIsAuthenticated(false);
  };

  // While Firebase resolves auth state, show nothing (or a brief splash)
  if (!authChecked) return null;

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
          <AppInner onLogout={handleLogout} />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
