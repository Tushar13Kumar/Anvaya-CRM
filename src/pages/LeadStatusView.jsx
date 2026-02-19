import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

const LeadStatusView = () => {
  const { leads, loading } = useLeads();
  const { data: agents } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  const [activeStatus, setActiveStatus] = useState("New");
  const [selectedAgent, setSelectedAgent] = useState("All");
  const [sortBy, setSortBy] = useState("Time to Close");

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100 bg-light text-primary">
        <div className="spinner-border me-2" role="status"></div>
        <span className="fw-bold">Leads load ho rahi hain...</span>
      </div>
    );
  }

  const filteredLeads = leads?.filter(lead => {
    const matchesStatus = lead.status === activeStatus;
    const matchesAgent = selectedAgent === "All" || lead.salesAgent?._id === selectedAgent;
    return matchesStatus && matchesAgent;
  });

  const sortedLeads = [...(filteredLeads || [])].sort((a, b) => {
    if (sortBy === "Time to Close") return (a.timeToClose || 0) - (b.timeToClose || 0);
    if (sortBy === "Priority") {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    }
    return 0;
  });

  return (
    <div className="d-flex w-100 min-vh-100 bg-light overflow-hidden">
      
      {/* 1. LEFT NAVIGATION SIDEBAR (Full Height) */}
      <div className="bg-white border-end d-flex flex-column shadow-sm sticky-top vh-100" style={{ width: '280px', minWidth: '280px' }}>
        <div className="p-4 border-bottom bg-primary text-white">
          <h5 className="mb-0 fw-bold">Anvaya CRM</h5>
          <small className="opacity-75">Status Management</small>
        </div>
        
        <div className="p-3 flex-grow-1 overflow-auto">
          <p className="small text-uppercase fw-bold text-muted mb-3 px-2">Filter by Status</p>
          <div className="nav flex-column nav-pills">
            {["New", "Contacted", "Qualified", "Proposal Sent"].map(status => (
              <button
                key={status}
                className={`nav-link text-start mb-2 py-3 px-4 border-0 rounded-3 fw-semibold ${activeStatus === status ? 'active shadow-sm' : 'text-dark bg-transparent hover-light'}`}
                onClick={() => setActiveStatus(status)}
                style={{ transition: 'all 0.2s' }}
              >
                <i className={`bi bi-circle-fill me-2 small ${activeStatus === status ? 'text-white' : 'text-primary'}`}></i>
                {status} Leads
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 border-top mt-auto">
          <Link to="/" className="btn btn-outline-dark w-100 rounded-pill fw-bold">
            <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
          </Link>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA (Fills Remaining Space) */}
      <div className="flex-grow-1 d-flex flex-column vh-100 overflow-auto">
        
        {/* HEADER AREA */}
        <header className="bg-white border-bottom p-4 sticky-top shadow-sm w-100">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">Leads by Status: <span className="text-primary">{activeStatus}</span></h2>
              <p className="text-muted mb-0 small">Viewing {sortedLeads.length} leads assigned to {selectedAgent === "All" ? "all agents" : "selected agent"}</p>
            </div>
            
            <div className="d-flex gap-3 align-items-center">
               <div className="bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-pill fw-bold">
                  Total {activeStatus}: {sortedLeads.length}
               </div>
            </div>
          </div>
        </header>

        {/* 3. FULL WIDTH CONTENT GRID */}
        <main className="p-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
            
            {/* FILTER BAR INSIDE CARD */}
            <div className="card-header bg-white border-bottom p-3">
              <div className="row g-3 align-items-center">
                <div className="col-auto">
                  <span className="fw-bold text-muted small"><i className="bi bi-funnel me-1"></i> Refine Results:</span>
                </div>
                <div className="col-md-3">
                  <select className="form-select border-0 bg-light fw-semibold" value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
                    <option value="All">All Agents</option>
                    {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <select className="form-select border-0 bg-light fw-semibold" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="Time to Close">Time to Close (Fastest)</option>
                    <option value="Priority">Priority (High to Low)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TABLE AREA - Edge to Edge */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light text-uppercase">
                  <tr style={{ fontSize: '12px', letterSpacing: '1px' }}>
                    <th className="ps-4 py-3 text-muted">Lead Information</th>
                    <th className="py-3 text-muted">Assigned Agent</th>
                    <th className="py-3 text-muted text-center">Priority</th>
                    <th className="py-3 text-muted text-center">Expected Closing</th>
                    <th className="pe-4 py-3 text-muted text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeads.length > 0 ? (
                    sortedLeads.map(lead => (
                      <tr key={lead._id}>
                        <td className="ps-4 py-3">
                          <Link to={`/lead/${lead._id}`} className="text-decoration-none d-block">
                            <span className="fw-bold text-dark d-block h6 mb-0">{lead.name}</span>
                            <span className="text-muted x-small">Lead ID: {lead._id.slice(-6)}</span>
                          </Link>
                        </td>
                        <td className="py-3">
                          <div className="d-flex align-items-center">
                             <div className="rounded-circle bg-secondary bg-opacity-25 p-2 me-2" style={{width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'}}>
                                {lead.salesAgent?.name?.charAt(0) || "U"}
                             </div>
                             <span className="fw-semibold">{lead.salesAgent?.name || "Unassigned"}</span>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`badge rounded-pill px-3 ${
                            lead.priority === 'High' ? 'bg-danger bg-opacity-10 text-danger' : 
                            lead.priority === 'Medium' ? 'bg-warning bg-opacity-10 text-warning' : 
                            'bg-info bg-opacity-10 text-info'
                          }`}>
                            {lead.priority}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <div className="fw-bold text-dark">{lead.timeToClose} Days</div>
                          <div className="progress mt-1" style={{ height: '4px' }}>
                            <div className="progress-bar bg-success" style={{ width: `${Math.max(100 - (lead.timeToClose * 2), 10)}%` }}></div>
                          </div>
                        </td>
                        <td className="pe-4 py-3 text-end">
                           <Link to={`/lead/${lead._id}`} className="btn btn-sm btn-light border rounded-circle">
                              <i className="bi bi-chevron-right"></i>
                           </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className="py-4">
                           <i className="bi bi-inbox text-muted display-4 mb-3 d-block"></i>
                           <h5 className="text-muted">No leads found matching your criteria.</h5>
                           <button className="btn btn-link text-decoration-none" onClick={() => {setSelectedAgent("All"); setSortBy("Time to Close")}}>Clear Filters</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadStatusView;