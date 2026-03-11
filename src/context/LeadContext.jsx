import { createContext, useContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { toast } from 'react-toastify';

const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const { data, loading, error } = useFetch("https://anvaya-project-backend.vercel.app/leads", []);

  useEffect(() => {
    if (data) setLeads(data);
  }, [data]);

  // LeadContext.jsx mein deleteLead function update karo:
const deleteLead = async (id) => {
  if (window.confirm("Bhai pakka delete karna hai?")) {
    try {
      const response = await fetch(`https://anvaya-project-backend.vercel.app/leads/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Bina refresh kiye list se hatane ke liye:
        setLeads(prev => prev.filter(l => l._id !== id));
        toast.success("Lead khalaas!");
      }
    } catch (err) {
      toast.error("Network ka locha hai!");
    }
  }
};

const fetchLeads = async () => {
    const res = await fetch("https://anvaya-project-backend.vercel.app/leads");
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => { fetchLeads(); }, []);

  return (
    <LeadContext.Provider value={{ leads, loading, error, deleteLead, fetchLeads }}>
      {children}
    </LeadContext.Provider>
  );
};

// ISKO EKDUM ALAG LINE PE RAKHO
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadProvider");
  }
  return context;
};