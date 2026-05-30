import { createContext, useContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { toast } from 'react-toastify';

const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("prayas-token");
      const res = await fetch("https://anvaya-project-backend.vercel.app/leads", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const deleteLead = (id) => {
    toast.info(({ closeToast }) => (
      <div>
        <p style={{ marginBottom: "10px" }}>Delete this lead?</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={async () => { await proceedDelete(id); closeToast(); }}
            style={{ background: "#dc3545", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>
            Confirm!
          </button>
          <button onClick={closeToast}
            style={{ background: "#6c757d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    ), { position: "top-center", autoClose: false, closeOnClick: false, draggable: false });
  };

  const proceedDelete = async (id) => {
    try {
      const token = localStorage.getItem("prayas-token");
      const response = await fetch(`https://anvaya-project-backend.vercel.app/leads/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        setLeads(prev => prev.filter(l => l._id !== id));
        toast.success("Lead deleted!");
      }
    } catch (err) {
      toast.error("Network error!");
    }
  };

  // YE FUNCTION MISSING THA — ADD KIYA
  const updateLeadInState = (updatedLead) => {
    setLeads(prev => prev.map(lead => lead._id === updatedLead._id ? updatedLead : lead));
  };

  return (
    <LeadContext.Provider value={{ leads, loading, error, deleteLead, fetchLeads, updateLeadInState }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) throw new Error("useLeads must be used within a LeadProvider");
  return context;
};