import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LeadProvider } from "./context/LeadContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import LeadDetails from "./pages/LeadDetails";
import Agents from "./pages/Agents";
import AddAgent from "./pages/AddAgent";
import Reports from "./pages/Reports";
import LeadStatusView from "./pages/LeadStatusView";
import SalesAgentView from "./pages/SalesAgentView";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./styles/layout.css";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const { token } = useAuth();

  return (
    <Router>
      <div className="app-layout">
        {token && <Sidebar />}
        <div className="main-content">
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route path="/signup" element={token ? <Navigate to="/" replace /> : <SignupPage />} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/lead/:id" element={<ProtectedRoute><LeadDetails /></ProtectedRoute>} />
            <Route path="/sales-agent-view" element={<ProtectedRoute><SalesAgentView /></ProtectedRoute>} />
            <Route path="/agents" element={<ProtectedRoute><Agents /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/status-view" element={<ProtectedRoute><LeadStatusView /></ProtectedRoute>} />
            <Route path="/agents/add" element={<ProtectedRoute><AddAgent /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <LeadProvider>
        <AppContent />
      </LeadProvider>
    </AuthProvider>
  );
}

export default App;