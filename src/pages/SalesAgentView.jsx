import React, { useState, useEffect } from 'react';
import { useLeads } from '../context/LeadContext';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { toast } from 'react-toastify';

const SalesAgentView = () => {
  const { leads, loading: leadsLoading } = useLeads();
  const { data: agents, loading: agentsLoading } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  // States for filtering
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Time to Close");

  // Set first agent as default when data loads
  useEffect(() => {
    if (agents && agents.length > 0 && !selectedAgentId) {
      setSelectedAgentId(agents[0]._id);
    }
  }, [agents, selectedAgentId]);

  if (leadsLoading || agentsLoading) return <div className="p-4 text-center">Data taiyaar ho raha hai...</div>;

  // 1. Filter Leads by Selected Agent
  const agentLeads = leads?.filter(lead => lead.salesAgent?._id === selectedAgentId);

  // 2. Apply Status & Priority Filters
  const filteredLeads = agentLeads?.filter(lead => {
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || lead.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  // 3. Sort Logic
  const sortedLeads = [...(filteredLeads || [])].sort((a, b) => {
    if (sortBy === "Time to Close") {
      return (a.timeToClose || 0) - (b.timeToClose || 0);
    }
    return 0; // Default
  });

  const activeAgentName = agents.find(a => a._id === selectedAgentId)?.name || "Select an Agent";

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Leads by Sales Agent</h2>
        <Link to="/" className="btn btn-outline-secondary">← Back to Dashboard</Link>
      </div>

      <div className="row">
        {/* Left Sidebar: Agent Selection */}
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white fw-bold">Select Sales Agent</div>
            <div className="list-group list-group-flush">
              {agents.map(agent => (
                <button
                  key={agent._id}
                  className={`list-group-item list-group-item-action ${selectedAgentId === agent._id ? 'active' : ''}`}
                  onClick={() => setSelectedAgentId(agent._id)}
                >
                  {agent.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content: Lead List */}
        <div className="col-md-9">
          <h4 className="mb-3 text-secondary">Currently Viewing: <span className="text-dark">{activeAgentName}</span></h4>
          
          {/* Filter Bar */}
          <div className="card p-3 mb-3 bg-light border-0 shadow-sm">
            <div className="row g-2 align-items-end">
              <div className="col-md-3">
                <label className="small fw-bold">Status:</label>
                <select className="form-select form-select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="small fw-bold">Priority:</label>
                <select className="form-select form-select-sm" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                  <option value="All">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="small fw-bold">Sort by:</label>
                <select className="form-select form-select-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="Time to Close">Time to Close (Days)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leads Table */}
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Lead Name</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Days to Close</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeads.length > 0 ? (
                    sortedLeads.map(lead => (
                      <tr key={lead._id}>
                        <td className="fw-bold">
                          <Link to={`/lead/${lead._id}`} className="text-decoration-none">{lead.name}</Link>
                        </td>
                        <td>
                          <span className={`badge ${lead.status === 'New' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td>{lead.priority}</td>
                        <td>{lead.timeToClose} Days</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="text-center p-5 text-muted">Bhai, is agent ke paas abhi koi lead nahi hai filter ke hisaab se.</td></tr>
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

export default SalesAgentView;