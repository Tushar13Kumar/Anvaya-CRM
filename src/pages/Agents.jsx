// Agents.jsx (Simplified example)
import React from 'react';
import useFetch from '../hooks/useFetch';
import { toast } from 'react-toastify';

const Agents = () => {
  // Yahan se data fetch ho raha hai
  const { data: agents, loading, error, setData } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  const deleteAgent = async (id) => {
    if (window.confirm("Kya sach mein is Agent ko nikalna hai?")) {
      try {
        const res = await fetch(`https://anvaya-project-backend.vercel.app/agents/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          // UI se turant hatane ke liye
          setData(agents.filter(agent => agent._id !== id));
          toast.info("Agent delete ho gaya!");
        }
      } catch (err) {
        toast.info("Delete nahi ho paaya, network check karo.");
      }
    }
  };

  if (loading) return <div>Loading agents...</div>;

  return (
    <div className="container mt-4">
      <h3>All Sales Agents</h3>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {agents.map(agent => (
            <tr key={agent._id}>
              <td>{agent.name}</td>
              <td>{agent.email}</td>
              <td>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => deleteAgent(agent._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Agents;