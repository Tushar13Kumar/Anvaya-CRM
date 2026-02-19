import React from 'react';
import { useLeads } from '../context/LeadContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

const Reports = () => {
  const { leads, loading } = useLeads();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-muted fw-bold">Ruk ja bhai, data calculate ho raha hai...</p>
        </div>
      </div>
    );
  }

  // --- DATA PROCESSING ---
  const totalLeads = leads?.length || 0;
  const closedLeads = leads?.filter(l => l.status === 'Qualified').length || 0;
  const inPipelineLeads = totalLeads - closedLeads;

  const pipelineData = [
    { name: 'In Pipeline', value: inPipelineLeads },
    { name: 'Closed', value: closedLeads },
  ];

  const agentCounts = (leads || []).reduce((acc, lead) => {
    const name = lead.salesAgent?.name || "Unassigned";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const agentData = Object.keys(agentCounts).map(name => ({
    name,
    leads: agentCounts[name]
  })).sort((a, b) => b.leads - a.leads);

  const statusCounts = (leads || []).reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    count: statusCounts[status]
  }));

  const COLORS = ['#0d6efd', '#198754', '#ffc107', '#fd7e14', '#6f42c1'];

  return (
    <div className="d-flex w-100 min-vh-100 bg-light overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="bg-white border-end d-flex flex-column shadow-sm sticky-top vh-100" style={{ width: '260px', minWidth: '260px' }}>
        <div className="p-4 border-bottom bg-primary text-white">
          <h5 className="mb-0 fw-bold">Anvaya CRM</h5>
          <small className="opacity-75">Reporting Engine</small>
        </div>
        <div className="p-3">
          <Link to="/" className="btn btn-dark w-100 rounded-pill shadow-sm mb-4">
            <i className="bi bi-grid-fill me-2"></i>Dashboard
          </Link>
          <div className="list-group list-group-flush">
            <div className="list-group-item border-0 small text-uppercase fw-bold text-muted">Analytics</div>
            <a href="#" className="list-group-item list-group-item-action border-0 active rounded-3 mb-1">
              <i className="bi bi-bar-chart-line me-2"></i>Performance
            </a>
            <a href="#" className="list-group-item list-group-item-action border-0 rounded-3 mb-1">
              <i className="bi bi-pie-chart me-2"></i>Distributions
            </a>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow-1 d-flex flex-column vh-100 overflow-auto">
        
        {/* HEADER - BUTTON SHIFTED TO RIGHT CORNER */}
        <header className="bg-white border-bottom p-4 sticky-top shadow-sm w-100">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h3 className="fw-bold text-dark mb-1">🚀 System Analytics</h3>
              <p className="text-muted small mb-0">Real-time performance metrics and lead distribution</p>
            </div>
            
            <div className="d-flex align-items-center gap-4">
              {/* Stats Summary */}
              <div className="d-flex gap-3 me-3 d-none d-md-flex">
                <div className="text-center">
                  <div className="h4 mb-0 fw-bold text-primary">{totalLeads}</div>
                  <small className="text-uppercase x-small text-muted">Total Leads</small>
                </div>
                <div className="vr"></div>
                <div className="text-center">
                  <div className="h4 mb-0 fw-bold text-success">{closedLeads}</div>
                  <small className="text-uppercase x-small text-muted">Conversions</small>
                </div>
              </div>

              {/* SHIFTED BUTTON: Back to Dashboard */}
              <Link to="/" className="btn btn-outline-dark rounded-pill px-4 fw-bold shadow-sm transition">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        {/* CHARTS GRID */}
        <main className="p-4">
          <div className="row g-4">
            
            {/* Chart 1: Pipeline vs Closed */}
            <div className="col-xl-5 col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                <h6 className="fw-bold text-dark mb-4 border-start border-4 border-primary ps-2">Pipeline vs Conversion</h6>
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie 
                        data={pipelineData} 
                        cx="50%" cy="50%" 
                        innerRadius={70} 
                        outerRadius={100} 
                        paddingAngle={8} 
                        dataKey="value"
                      >
                        {pipelineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 2: Leads by Status */}
            <div className="col-xl-7 col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                <h6 className="fw-bold text-dark mb-4 border-start border-4 border-warning ps-2">Lead Status Distribution</h6>
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f8f9fa'}} />
                      <Bar dataKey="count" fill="#6f42c1" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 3: Agent Performance */}
            <div className="col-12 mt-2">
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h6 className="fw-bold text-dark mb-4 border-start border-4 border-success ps-2">Leads Handled by Sales Agents</h6>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <BarChart data={agentData} layout="vertical" margin={{ left: 40, right: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                      <XAxis type="number" axisLine={false} tickLine={false} hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        width={120}
                        tick={{fill: '#333', fontWeight: 'bold'}}
                      />
                      <Tooltip />
                      <Bar dataKey="leads" fill="#198754" radius={[0, 10, 10, 0]} barSize={30} label={{ position: 'right', fill: '#198754', fontWeight: 'bold' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;