import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import AddLeadForm from '../components/AddLeadForm';
import useFetch from '../hooks/useFetch';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { leads, loading, deleteLead } = useLeads();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgentFilter, setSelectedAgentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Priority");

  const { data: agents } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  // Logic
  const stats = {
    new: leads?.filter(l => l.status === "New").length || 0,
    contacted: leads?.filter(l => l.status === "Contacted").length || 0,
    qualified: leads?.filter(l => l.status === "Qualified").length || 0,
  };

  const priorityOrder = { High: 3, Medium: 2, Low: 1 };

  const finalLeads = leads
    ?.filter(lead => {
      const matchesStatus = activeFilter === "All" || lead.status === activeFilter;
      const matchesAgent = selectedAgentFilter === "All" || lead.salesAgent?._id === selectedAgentFilter;
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesAgent && matchesSearch;
    })
    ?.sort((a, b) => {
      if (sortBy === "Priority") return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      if (sortBy === "Time to Close") return (a.timeToClose || 0) - (b.timeToClose || 0);
      return 0;
    });

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-lg-11"> {/* Centers content and uses more width */}
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-dark m-0">Anvaya CRM Dashboard</h2>
            <span className="text-muted">Welcome back, Admin</span>
          </div>

          {/* Stats Cards */}
          <div className="row mb-4 g-3">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-3 bg-primary text-white">
                <small className="opacity-75">New Leads</small>
                <h3 className="m-0">{stats.new}</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-3 bg-warning text-dark">
                <small className="opacity-75">Contacted</small>
                <h3 className="m-0">{stats.contacted}</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-3 bg-success text-white">
                <small className="opacity-75">Qualified</small>
                <h3 className="m-0">{stats.qualified}</h3>
              </div>
            </div>
          </div>

          <div className="row">
            {/* LEFT SIDE: Leads Table */}
            <div className="col-xl-8 col-lg-7 mb-4">
              <div className="card border-0 shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="m-0 fw-bold">Recent Leads</h5>
                  <div className="btn-group">
                    {["All", "New", "Contacted", "Qualified"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setActiveFilter(status)}
                        className={`btn btn-sm ${activeFilter === status ? 'btn-dark' : 'btn-outline-secondary'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filters Row */}
                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      placeholder="Search by client name..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <select 
                      className="form-select form-select-sm" 
                      value={selectedAgentFilter}
                      onChange={(e) => setSelectedAgentFilter(e.target.value)}
                    >
                      <option value="All">All Agents</option>
                      {agents?.map(agent => (
                        <option key={agent._id} value={agent._id}>{agent.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select 
                      className="form-select form-select-sm" 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="Priority">Sort: Priority</option>
                      <option value="Time to Close">Sort: Closing Date</option>
                    </select>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Client Name</th>
                        <th>Status</th>
                        <th>Agent</th>
                        <th>Priority</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finalLeads?.map(lead => (
                        <tr key={lead._id}>
                          <td>
                            <Link to={`/lead/${lead._id}`} className="text-decoration-none fw-semibold text-primary">
                              {lead.name}
                            </Link>
                          </td>
                          <td>
                            <span className={`badge rounded-pill ${lead.status === 'New' ? 'bg-primary' : lead.status === 'Contacted' ? 'bg-warning text-dark' : 'bg-success'}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="text-muted">{lead.salesAgent?.name || "Unassigned"}</td>
                          <td>
                            <span className={`text-${lead.priority === 'High' ? 'danger' : lead.priority === 'Medium' ? 'warning' : 'info'} fw-bold`}>
                              {lead.priority}
                            </span>
                          </td>
                          <td className="text-end">
                            <button 
                              className="btn btn-link btn-sm text-danger p-0"
                              onClick={() => window.confirm("Delete this lead?") && deleteLead(lead._id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Add Lead Form */}
            <div className="col-xl-4 col-lg-5">
              <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: '20px', zIndex: 1 }}>
                <h5 className="fw-bold mb-3">🚀 Create New Lead</h5>
                <AddLeadForm agents={agents} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;