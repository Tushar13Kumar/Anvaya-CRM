import React from 'react';
import { useLeads } from '../context/LeadContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';

const Reports = () => {
  const { leads, loading } = useLeads();

  if (loading) return <div className="p-5 text-center">Ruk ja bhai, data calculate ho raha hai...</div>;

  // --- DATA JUGAAD (Asli Khel yahan hai) ---

  // 1. Pie Chart: Pipeline vs Closed (Qualified leads ko 'Closed' maan rahe hain ya Proposal Sent ko)
  const pipelineData = [
    { name: 'In Pipeline', value: leads?.filter(l => l.status !== 'Qualified').length },
    { name: 'Closed', value: leads?.filter(l => l.status === 'Qualified').length },
  ];

  // 2. Bar Chart: Leads by Agent
  // Pehle ek object banate hain: { "AgentName": count }
 // Galti yahan ho sakti hai: leads.reduce tabhi chalao jab leads ho!
const agentCounts = (leads || []).reduce((acc, lead) => {
  // Yahan check kar ki lead.salesAgent hai bhi ya nahi
  const name = lead.salesAgent?.name || "Unassigned";
  acc[name] = (acc[name] || 0) + 1;
  return acc;
}, {});

  const agentData = Object.keys(agentCounts || {}).map(name => ({
    name,
    leads: agentCounts[name]
  }));

  // 3. Status Distribution (Sare statuses ka hisaab)
  const statusCounts = leads?.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts || {}).map(status => ({
    name: status,
    count: statusCounts[status]
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="container-fluid p-4">
      <div className="row">
        {/* Sidebar ka chota hissa jaise tune bola tha */}
        <div className="col-md-2 border-end">
          <h5 className="mb-4">Reports</h5>
          <Link to="/" className="btn btn-outline-secondary btn-sm w-100 mb-3">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Main Content */}
        <div className="col-md-10">
          <h2 className="mb-4">🚀 Anvaya CRM Reports</h2>
          <hr />

          <div className="row g-4">
            {/* Chart 1: Pipeline vs Closed */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3 border-0">
                <h5 className="text-center">Leads in Pipeline vs Closed</h5>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pipelineData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label>
                        {pipelineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 2: Leads by Status */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3 border-0">
                <h5 className="text-center">Lead Status Distribution</h5>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={statusData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 3: Agent Performance */}
            <div className="col-md-12 mt-4">
              <div className="card shadow-sm p-3 border-0">
                <h5 className="mb-4">Leads Handled by Sales Agents</h5>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={agentData} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="leads" fill="#00C49F" radius={[0, 5, 5, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;