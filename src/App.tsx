import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Homepage from "./pages/homepage";
import Nav from "./components/general/navigation/navigation";
import Auth from "./pages/auth";
import Calendar from "./pages/calendar";
import Focus from "./pages/focus_page";
import Profile from "./pages/profile";
import {
  useThemeContext,
  useAuthContext,
  useTrackContext,
} from "./utils/app_context/general";
import { useEffect } from "react";
import { ProtectedRouteProps, Popup } from "./utils/types/todo";
import AddTask from "./components/general/add-task";

function App() {
  const { darkMode, toggleDarkMode } = useThemeContext();
  const authenticated = useAuthContext();
  const { trackScreen } = useTrackContext();

  useEffect(() => {
    localStorage.setItem("token", "hello");
  }, [authenticated]);

  return (
    <main
      className={`${
        darkMode ? "dark-theme" : "light-theme"
      } w-screen min-h-screen`}
    >
      <Router>
        {authenticated && <Nav />}
        {authenticated &&
          trackScreen ===
            ("name" || "calendar" || "time" || "priority" || "category") && (
            <AddTask />
          )}
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute authenticated={authenticated} redirectTo="/auth">
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute authenticated={authenticated} redirectTo="/auth">
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/focus"
            element={
              <ProtectedRoute authenticated={authenticated} redirectTo="/auth">
                <Focus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute authenticated={authenticated} redirectTo="/auth">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </main>
  );
}

function ProtectedRoute({
  authenticated,
  redirectTo,
  children,
}: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) {
      navigate(redirectTo);
    }
  }, [authenticated, redirectTo, navigate]);

  return authenticated ? <>{children}</> : null;
}

export default App;
