import { createContext, useContext } from "react";
import useFetch from "../hooks/useFetch";

const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const { data: leads, loading, error } = useFetch("https://anvaya-project-backend.vercel.app/leads", []);

  return (
    <LeadContext.Provider value={{ leads, loading, error }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => useContext(LeadContext);