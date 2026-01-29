import React from 'react';
import useFetch from '../hooks/useFetch';
import { Link } from 'react-router-dom';

const Agents = () => {
  // Backend se agents ki list utha li
  const { data: agents, loading, error } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  if (loading) return <div className="p-4">Ruk ja bhai, agents load ho rahe hain...</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Sales Agent Management</h2>
        {/* Ye button dabate hi naye agent wale page pe jayenge */}
        <Link to="/agents/add" className="btn btn-success shadow-sm">
          + Add New Agent
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Agent Name</th>
                <th>Email Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent._id}>
                  <td className="fw-bold text-primary">{agent.name}</td>
                  <td>{agent.email || "N/A"}</td>
                  <td>
                    <span className="badge bg-info text-dark">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Agents;