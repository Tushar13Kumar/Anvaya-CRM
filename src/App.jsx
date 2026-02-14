import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LeadProvider } from "./context/LeadContext"; //
import Dashboard from "./pages/Dashboard"; //   
import Sidebar from "./components/Sidebar"; // Naya component banayenge
import "bootstrap/dist/css/bootstrap.min.css"; //
// Pehle wala: import LeadDetails from "../pages/LeadDetails"; (GALAT HAI)
import LeadDetails from "./pages/LeadDetails"; // (SAHI HAI - ek dot '.' matlab current folder)
import Agents from "./pages/Agents";
import AddAgent from "./pages/AddAgent";
import Reports from "./pages/Reports";
import LeadStatusView from "./pages/LeadStatusView";
import SalesAgentView from "./pages/SalesAgentView";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <LeadProvider>
      <Router>
       <div className="container-fluid p-0">
  <div className="d-flex">
    <div style={{ minWidth: '250px', maxWidth: '250px' }}>
      <Sidebar />
    </div>
    <div className="flex-grow-1 bg-light min-vh-100 p-4">
            <Routes>
              {/* "/" pe Dashboard dikhega */}
              <Route path="/" element={<Dashboard />} />
              {/* Baaki pages ke liye dummy components ya pages bana liyo */}
              {/* Ye rahi nayi line. ':id' ka matlab hai ki yahan 
      kuch bhi dynamic ID aa sakti hai */}
  <Route path="/lead/:id" element={<LeadDetails />} />
             <Route path="/sales-agent-view" element={<SalesAgentView />} />
              <Route path="/agents" element={<Agents />} />
               <Route path="/reports" element={<Reports />} />
               <Route path="/status-view" element={<LeadStatusView />} /> {/* Add this line */}
              <Route path="/agents/add" element={<AddAgent />} />
             </Routes>
          </div>
        </div>
         </div>
      </Router>
    </LeadProvider>
  );
}

export default App;