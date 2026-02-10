import React from 'react';
import { useLeads } from '../context/LeadContext';
import AddLeadForm from '../components/AddLeadForm';
import useFetch from '../hooks/useFetch';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
const { leads, loading, deleteLead } = useLeads(); // Added deleteLead here  
  // States (Yahan engine fit kiya hai)
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgentFilter, setSelectedAgentFilter] = useState("All"); // ERROR SOLVED HERE!
  // NAYA: Sorting ke liye state (Default "Priority" rakhte hain)
const [sortBy, setSortBy] = useState("Priority");

  // Status counting logic
  const stats = {
    new: leads?.filter(l => l.status === "New").length,
    contacted: leads?.filter(l => l.status === "Contacted").length,
    qualified: leads?.filter(l => l.status === "Qualified").length,
  };

  // Filtering logic
  const filteredLeads = leads?.filter(lead => {
    const matchesStatus = activeFilter === "All" || lead.status === activeFilter;
    const matchesAgent = selectedAgentFilter === "All" || lead.salesAgent?._id === selectedAgentFilter;
    return matchesStatus && matchesAgent;
  });

  // Priority sorting logic
  // const priorityOrder = { High: 3, Medium: 2, Low: 1 };
  // const finalLeads = filteredLeads
  //   ?.filter(lead => lead.name.toLowerCase().includes(searchTerm.toLowerCase()))
  //   ?.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));

    // Priority ka order (High sabse upar)
const priorityOrder = { High: 3, Medium: 2, Low: 1 };

const finalLeads = filteredLeads
  ?.filter(lead => lead.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ?.sort((a, b) => {
    if (sortBy === "Priority") {
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    } else if (sortBy === "Time to Close") {
      // Jiska time kam bacha hai (kam days) wo upar aayega
      return (a.timeToClose || 0) - (b.timeToClose || 0);
    }
    return 0;
  });

  const { data: agents } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  // BAAKI KA RETURN WAHI RAHEGA...
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar - Baad mein alag component bana liyo */}
        {/* <nav className="col-md-2 bg-light sidebar vh-100">
          <ul className="nav flex-column mt-4">
            <li className="nav-item"><b>Leads</b></li>
            <li className="nav-item">Sales</li>
            <li className="nav-item">Agents</li>
          </ul>
        </nav> */}

        {/* Main Content */}
        <main className="col-md-10 p-4">
          <h2>Anvaya CRM Dashboard</h2>
          <hr />
          
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card p-3 bg-primary text-white">New: {stats.new}</div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 bg-warning">Contacted: {stats.contacted}</div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 bg-success text-white">Qualified: {stats.qualified}</div>
            </div>
          </div>

          {/* ... baaki code upar wala same rahega ... */}

<h4>Recent Leads</h4>

{/* 1. Naya Search Bar yahan add kar de */}
<div className="mb-3">
  <input 
    type="text" 
    className="form-control" 
    placeholder="Naam se dhundo (ex: Pappu Yadav)..." 
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

<div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
  {/* Agent Filter Dropdown */}
  <div className="d-flex align-items-center gap-2">
    <span>Agent:</span>
    <select 
      className="form-select form-select-sm" 
      style={{ width: '150px' }}
      value={selectedAgentFilter}
      onChange={(e) => setSelectedAgentFilter(e.target.value)}
    >
      <option value="All">Sabhi Agents</option>
      {agents.map(agent => (
        <option key={agent._id} value={agent._id}>{agent.name}</option>
      ))}
    </select>
  </div>
  {/* Sorting Dropdown */}
<div className="d-flex align-items-center gap-2">
  <span>Sort by:</span>
  <select 
    className="form-select form-select-sm" 
    style={{ width: '150px' }}
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
  >
    <option value="Priority">Priority (High to Low)</option>
    <option value="Time to Close">Time to Close (Soonest)</option>
  </select>
</div>

  {/* Status Filters */}
  <div className="btn-group">
    {["All", "New", "Contacted", "Qualified"].map((status) => (
      <button
        key={status}
        onClick={() => setActiveFilter(status)}
        className={`btn ${activeFilter === status ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
      >
        {status}
      </button>
    ))}
  </div>
</div>

<table className="table border">
  <thead>
    <tr>
      <th>Name</th>
      <th>Status</th>
      <th>Agent</th>
      <th>Priority</th>
    </tr>
  </thead>
  <tbody>
    {/* 2. ASLI KHEL YAHAN HAI: finalLeads use karo filteredLeads ki jagah */}
    {finalLeads?.map(lead => (
      <tr key={lead._id}>
        <td>
          <Link to={`/lead/${lead._id}`} style={{ textDecoration: 'none', fontWeight: 'bold' }}>
            {lead.name}
          </Link>
        </td>
        <td>
          <span className={`badge ${lead.status === 'New' ? 'bg-primary' : lead.status === 'Contacted' ? 'bg-warning text-dark' : 'bg-success'}`}>
            {lead.status}
          </span>
        </td>
        {/* Yahan agent ka naam sahi se dikhega */}
        <td>{lead.salesAgent?.name || "N/A"}</td>
        <td>{lead.priority}</td>
        <td>
          {/* Delete Button */}
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => {
              if(window.confirm("Pakka delete karna hai?")) {
                deleteLead(lead._id);
              }
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

{/* ... baaki code ... */}
   <div className="">
               {/* Naya Form yahan dikhega */}
               <AddLeadForm agents={agents} />
            </div>
        </main>
      </div>
    </div>
    
  );
};

export default Dashboard;