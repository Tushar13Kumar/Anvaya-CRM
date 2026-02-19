import React, { useState, useEffect } from 'react';
import { useLeads } from '../context/LeadContext';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

const SalesAgentView = () => {
  const { leads, loading: leadsLoading } = useLeads();
  const { data: agents, loading: agentsLoading } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Time to Close");

  useEffect(() => {
    if (agents && agents.length > 0 && !selectedAgentId) {
      setSelectedAgentId(agents[0]._id);
    }
  }, [agents, selectedAgentId]);

  if (leadsLoading || agentsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const agentLeads = leads?.filter(lead => lead.salesAgent?._id === selectedAgentId);
  const filteredLeads = agentLeads?.filter(lead => {
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || lead.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const sortedLeads = [...(filteredLeads || [])].sort((a, b) => {
    if (sortBy === "Time to Close") return (a.timeToClose || 0) - (b.timeToClose || 0);
    return 0;
  });

  const activeAgentName = agents.find(a => a._id === selectedAgentId)?.name || "Select an Agent";

  const getPriorityBadge = (priority) => {
    const colors = { High: 'bg-danger text-white', Medium: 'bg-warning text-dark', Low: 'bg-info text-dark' };
    return <span className={`badge ${colors[priority] || 'bg-secondary'}`}>{priority}</span>;
  };

  return (
    /* Removed vw-100 to prevent horizontal overflow; using d-flex for full layout */
    <div className="d-flex min-vh-100 bg-light overflow-hidden" style={{ width: '100%' }}>
      
      {/* SIDEBAR - Fixed Width but responsive */}
      <div className="bg-white border-end d-flex flex-column shadow-sm sticky-top vh-100" style={{ width: '260px', minWidth: '260px' }}>
        <div className="p-4 border-bottom bg-primary text-white">
          <h5 className="mb-0 fw-bold">Anvaya CRM</h5>
          <small className="opacity-75">Sales Management</small>
        </div>
        
        <div className="p-3 bg-light border-bottom">
          <span className="text-uppercase x-small fw-bold text-muted">Select Sales Agent</span>
        </div>

        <div className="list-group list-group-flush overflow-auto flex-grow-1">
          {agents.map(agent => (
            <button
              key={agent._id}
              className={`list-group-item list-group-item-action py-3 px-4 border-0 small ${selectedAgentId === agent._id ? 'bg-primary-subtle text-primary border-start border-4 border-primary fw-bold' : ''}`}
              onClick={() => setSelectedAgentId(agent._id)}
            >
              <i className="bi bi-person-badge me-2"></i>{agent.name}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT - flex-grow-1 ensures it fills all remaining space without exceeding it */}
      <div className="flex-grow-1 d-flex flex-column vh-100 overflow-hidden">
        
        {/* HEADER - Occupies 100% of the main content width */}
        <header className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center shadow-sm">
          <div className="ms-2">
            <h4 className="fw-bold text-dark mb-0">Agent Performance View</h4>
            <p className="text-muted mb-0 x-small">Dashboard / Agents / <span className="text-primary fw-semibold">{activeAgentName}</span></p>
          </div>
          <Link to="/" className="btn btn-sm btn-dark rounded-pill px-4 shadow-sm">
            <i className="bi bi-grid-fill me-2"></i>Back to Dashboard
          </Link>
        </header>

        {/* PAGE BODY - scrollable internally so the whole page doesn't scroll */}
        <div className="p-4 flex-grow-1 overflow-auto">
          
          {/* STATS & FILTERS CARD */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-3">
              <div className="row g-3 align-items-center">
                <div className="col-lg-3 col-md-6">
                    <label className="x-small fw-bold text-muted mb-1 d-block">Filter Status</label>
                    <select className="form-select form-select-sm bg-light border-0" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="All">All Statuses</option>
                      <option value="New">New Leads</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                    </select>
                </div>
                <div className="col-lg-2 col-md-6">
                    <label className="x-small fw-bold text-muted mb-1 d-block">Priority Level</label>
                    <select className="form-select form-select-sm bg-light border-0" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                      <option value="All">All Priorities</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                </div>
                <div className="col-lg-3 col-md-6">
                    <label className="x-small fw-bold text-muted mb-1 d-block">Sort Results</label>
                    <select className="form-select form-select-sm bg-light border-0" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="Time to Close">Time to Close (Fastest)</option>
                    </select>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="p-2 bg-primary text-white rounded-3 d-flex justify-content-between align-items-center shadow-sm px-4">
                    <small className="text-uppercase fw-bold opacity-75">Active Leads</small>
                    <h3 className="mb-0 fw-bold">{sortedLeads.length}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th className="ps-4 py-3 border-0 small">Lead Name & Details</th>
                    <th className="border-0 small">Status</th>
                    <th className="border-0 small">Priority</th>
                    <th className="border-0 small text-nowrap">Expected Closing</th>
                    <th className="text-end pe-4 border-0 small">Operations</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {sortedLeads.length > 0 ? (
                    sortedLeads.map(lead => (
                      <tr key={lead._id}>
                        <td className="ps-4">
                          <div className="fw-bold text-dark small">{lead.name}</div>
                          <div className="text-muted x-small">Ref: {lead._id.slice(-8)}</div>
                        </td>
                        <td>
                          <span className="badge rounded-pill bg-light text-primary border border-primary-subtle px-3 py-1">
                            {lead.status}
                          </span>
                        </td>
                        <td>{getPriorityBadge(lead.priority)}</td>
                        <td>
                          <div className="d-flex align-items-center small fw-semibold text-dark">
                            <i className="bi bi-calendar-event me-2 text-primary"></i>
                            {lead.timeToClose} Days
                          </div>
                        </td>
                        <td className="text-end pe-4">
                          <Link to={`/lead/${lead._id}`} className="btn btn-sm btn-outline-primary px-3 rounded-pill x-small">
                            Details <i className="bi bi-arrow-right ms-1"></i>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className="py-4">
                          <i className="bi bi-inbox text-muted display-4 opacity-25"></i>
                          <p className="mt-3 text-muted">No leads found for your current selection.</p>
                          <button className="btn btn-sm btn-primary rounded-pill px-4" onClick={() => {setStatusFilter("All"); setPriorityFilter("All")}}>
                            Reset Filters
                          </button>
                        </div>
                      </td>
                    </tr>
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