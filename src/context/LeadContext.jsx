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
  try {
    const response = await fetch(`https://anvaya-project-backend.vercel.app/leads/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setLeads(prev => prev.filter(l => l._id !== id));
      toast.success("Lead delete ho gayi!"); // 👈 Mast alert
    }
  } catch (err) {
    toast.error("Server down hai shayad!"); 
  }
};

const fetchLeads = async () => {
    const res = await fetch("https://anvaya-project-backend.vercel.app/leads");
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => { fetchLeads(); }, []);

  return (
    <LeadContext.Provider value={{ leads, loading, error, deleteLead , fetchLeads }}>
      {children}
    </LeadContext.Provider>
  );
};

// THIS IS THE LINE CAUSING YOUR ERROR
export const useLeads = () => useContext(LeadContext);