import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./components/Toast/ToastProvider";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;