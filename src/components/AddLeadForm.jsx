import React, { useState } from 'react';

const AddLeadForm = ({ agents }) => {
  const [formData, setFormData] = useState({
    name: "",
    source: "Website",
    salesAgent: "",
    status: "New",
    priority: "Medium",
    timeToClose: 10
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://anvaya-project-backend.vercel.app/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("✅ Lead mast tarike se add ho gayi!");
        // Form khali karne ka jugaad
        setFormData({ name: "", source: "Website", salesAgent: "", status: "New", priority: "Medium", timeToClose: 10 });
      } else {
        setMessage("❌ Backend ne mana kar diya!");
      }
    } catch (err) {
      setMessage("❌ Bhai, network ka locha hai!");
    }
  };

  return (
    <div className="card p-4 shadow-sm border-0 mt-4" style={{ backgroundColor: '#f8f9fa' }}>
      <h4 className="mb-4">🚀 Nayi Lead Daalo</h4>
      {message && <div className="alert alert-info">{message}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Row 1: Name */}
        <div className="mb-3">
          <label className="form-label fw-bold">Client ka Naam</label>
          <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required placeholder="ex: Pappu Yadav" />
        </div>

        {/* Row 2: Source & Agent */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Source</label>
            <select name="source" className="form-select" value={formData.source} onChange={handleChange}>
              <option value="Website">Website</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Referral">Referral</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Sales Agent</label>
            <select name="salesAgent" className="form-select" value={formData.salesAgent} onChange={handleChange} required>
              <option value="">Agent Chuno...</option>
              {agents.map(agent => (
                <option key={agent._id} value={agent._id}>{agent.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Status & Priority (NAYA!) */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Lead Status</label>
            <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Priority</label>
            <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
              <option value="High">High (Garram)</option>
              <option value="Medium">Medium (Theek hai)</option>
              <option value="Low">Low (Thanda)</option>
            </select>
          </div>
        </div>

        {/* Row 4: Time to Close (NAYA!) */}
        <div className="mb-4">
          <label className="form-label fw-bold">Kitne din mein close hogi? (Time to Close)</label>
          <input type="number" name="timeToClose" className="form-control" value={formData.timeToClose} onChange={handleChange} />
          <small className="text-muted">Anumanit din (Estimated Days)</small>
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-bold py-2">Lead Create Kar Do! 💥</button>
      </form>
    </div>
  );
};

export default AddLeadForm;