import { createContext, useContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

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
    const res = await fetch(`https://anvaya-project-backend.vercel.app/leads/${id}`, {
      method: "DELETE"
    });
    if (res.ok) {
      // Local state update kar rahe hain
      setLeads(prevLeads => prevLeads.filter(l => l._id !== id));
    }
  } catch (err) {
    console.error("Delete failed", err);
  }
};

  return (
    <LeadContext.Provider value={{ leads, loading, error, deleteLead }}>
      {children}
    </LeadContext.Provider>
  );
};

// THIS IS THE LINE CAUSING YOUR ERROR
export const useLeads = () => useContext(LeadContext);