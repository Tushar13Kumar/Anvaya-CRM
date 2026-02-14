import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { toast } from 'react-toastify';

const LeadStatusView = () => {
  const { leads, loading } = useLeads();
  const { data: agents } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  // Filter States
  const [activeStatus, setActiveStatus] = useState("New");
  const [selectedAgent, setSelectedAgent] = useState("All");
  const [sortBy, setSortBy] = useState("Time to Close");

  if (loading) return <div className="p-4">Leads load ho rahi hain...</div>;

  // 1. Filter by Status and Agent
  const filteredLeads = leads?.filter(lead => {
    const matchesStatus = lead.status === activeStatus;
    const matchesAgent = selectedAgent === "All" || lead.salesAgent?._id === selectedAgent;
    return matchesStatus && matchesAgent;
  });

  // 2. Sort Logic
  const sortedLeads = [...(filteredLeads || [])].sort((a, b) => {
    if (sortBy === "Time to Close") {
      return (a.timeToClose || 0) - (b.timeToClose || 0);
    }
    if (sortBy === "Priority") {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    }
    return 0;
  });

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Leads by Status</h2>
        <Link to="/" className="btn btn-outline-secondary">← Back to Dashboard</Link>
      </div>

      <div className="row">
        {/* Left Sidebar for Status Selection */}
        <div className="col-md-3">
          <div className="list-group shadow-sm">
            {["New", "Contacted", "Qualified", "Proposal Sent"].map(status => (
              <button
                key={status}
                className={`list-group-item list-group-item-action ${activeStatus === status ? 'active' : ''}`}
                onClick={() => setActiveStatus(status)}
              >
                {status} Leads
              </button>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="col-md-9">
          <div className="card shadow-sm p-3 mb-3 bg-light">
            <div className="row g-3">
              <div className="col-md-5">
                <label className="small fw-bold">Filter by Agent:</label>
                <select className="form-select" value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
                  <option value="All">All Agents</option>
                  {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>
              <div className="col-md-5">
                <label className="small fw-bold">Sort by:</label>
                <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="Time to Close">Time to Close (Fastest)</option>
                  <option value="Priority">Priority (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Lead Name</th>
                    <th>Agent</th>
                    <th>Priority</th>
                    <th>Days to Close</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeads.length > 0 ? (
                    sortedLeads.map(lead => (
                      <tr key={lead._id}>
                        <td>
                          <Link to={`/lead/${lead._id}`} className="text-decoration-none fw-bold">
                            {lead.name}
                          </Link>
                        </td>
                        <td>{lead.salesAgent?.name || "N/A"}</td>
                        <td>
                          <span className={`badge ${lead.priority === 'High' ? 'bg-danger' : 'bg-info'}`}>
                            {lead.priority} 
                          </span>
                        </td>
                        <td>{lead.timeToClose} Days</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="text-center p-4">No leads found in this status.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadStatusView;    