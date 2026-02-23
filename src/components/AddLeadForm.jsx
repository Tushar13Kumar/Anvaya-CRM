import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { toast } from 'react-toastify';

const AddLeadForm = ({ agents }) => {
  const [formData, setFormData] = useState({
    name: "",
    source: "Website",
    salesAgent: "",
    status: "New",
    priority: "Medium",
    timeToClose: 10
  });

  const { fetchLeads } = useLeads();

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
        await fetchLeads(); 
        
        // Corrected React-Toastify syntax
        toast.success("Lead created successfully!");
        
        setFormData({ 
          name: "", source: "Website", salesAgent: "", 
          status: "New", priority: "Medium", timeToClose: 10 
        });
      } else {
        toast.error("Failed to save lead. Please check your data.");
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit}>
        {/* Row 1: Name */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">Client Full Name</label>
          <input 
            type="text" 
            name="name" 
            className="form-control" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="e.g. John Doe" 
          />
        </div>

        {/* Row 2: Source & Agent */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold text-secondary">Lead Source</label>
            <select name="source" className="form-select" value={formData.source} onChange={handleChange}>
              <option value="Website">Website</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold text-secondary">Assigned Agent</label>
            <select name="salesAgent" className="form-select" value={formData.salesAgent} onChange={handleChange} required>
              <option value="">Select Agent...</option>
              {agents.map(agent => (
                <option key={agent._id} value={agent._id}>{agent.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Status & Priority */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold text-secondary">Pipeline Status</label>
            <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold text-secondary">Priority Level</label>
            <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Row 4: Time to Close */}
        <div className="mb-4">
          <label className="form-label fw-semibold text-secondary">Estimated Conversion (Days)</label>
          <input 
            type="number" 
            name="timeToClose" 
            className="form-control" 
            value={formData.timeToClose} 
            onChange={handleChange} 
            min="1"
          />
          <small className="text-muted">Expected timeframe to close this deal.</small>
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm">
          Create Lead Opportunity
        </button>
      </form>
    </div>
  );
};

export default AddLeadForm;