import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch'; 
import { toast } from 'react-toastify';

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");

  // Fetching Agents for the dropdown
  const { data: agents } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  useEffect(() => {
    fetch(`https://anvaya-project-backend.vercel.app/leads/${id}`)
      .then(res => res.json())
      .then(data => setLead(data))
      .catch(err => toast.error("Failed to load lead details."));
  }, [id]);

  const updateStatus = async (newStatus) => {
    const res = await fetch(`https://anvaya-project-backend.vercel.app/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setLead(updated);
      toast.success("Lead status updated successfully.");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedAgent) {
      return toast.warn("Please select an agent and enter a comment.");
    }

    const response = await fetch(`https://anvaya-project-backend.vercel.app/leads/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        text: newComment, 
        authorId: selectedAgent,
      }),
    });

    if (response.ok) {
      const updatedComments = await response.json();
      setLead(prev => ({ ...prev, comments: updatedComments }));
      setNewComment(""); 
      setSelectedAgent(""); 
      toast.success("Activity log updated.");
    } else {
      toast.error("Failed to add comment.");
    }
  };

  if (!lead) return (
    <div className="container p-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3 text-muted">Retrieving lead information...</p>
    </div>
  );

  return (
    <div className="container py-5">
      {/* Lead Information Header */}
      <div className="card p-4 shadow-sm mb-4 border-0 bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-1 fw-bold">{lead.name}</h2>
            <p className="text-muted mb-0">Lead ID: #{id.slice(-6).toUpperCase()}</p>
          </div>
          <div className="text-end">
            <span className="badge rounded-pill bg-primary px-3 py-2 fs-6">{lead.status}</span>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-md-3">
            <small className="text-uppercase text-muted fw-bold d-block">Assigned Agent</small>
            <p className="fs-5">{lead.salesAgent?.name || "Unassigned"}</p>
          </div>
          <div className="col-md-3">
            <small className="text-uppercase text-muted fw-bold d-block">Source</small>
            <p className="fs-5">{lead.source}</p>
          </div>
          <div className="col-md-3">
            <small className="text-uppercase text-muted fw-bold d-block">Priority</small>
            <p className={`fs-5 fw-bold ${lead.priority === 'High' ? 'text-danger' : 'text-dark'}`}>
              {lead.priority}
            </p>
          </div>
          <div className="col-md-3">
            <small className="text-uppercase text-muted fw-bold d-block">Est. Days to Close</small>
            <p className="fs-5">{lead.timeToClose} Days</p>
          </div>
        </div>
      </div>

      {/* Activity Log & Comments Section */}
      <div className="card p-4 shadow-sm bg-light border-0">
        <h5 className="mb-4 fw-bold text-secondary text-uppercase" style={{ letterSpacing: '1px' }}>
          Activity Log & Updates
        </h5>
        
        <div className="pe-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {lead.comments && lead.comments.length > 0 ? (
            lead.comments.map((c, index) => (
              <div key={index} className="p-3 mb-3 bg-white border-start border-4 border-primary rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-primary">
                      {c.author?.name || "System Record"}
                  </span>
                  <small className="text-muted">
                      {new Date(c.createdAt).toLocaleString()}
                  </small>
                </div>
                <p className="mb-0 text-secondary" style={{ whiteSpace: 'pre-wrap' }}>
                  {c.commentText}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <p className="text-muted mb-0 font-italic">No communication history has been logged for this lead.</p>
            </div>
          )}
        </div>

        <hr className="my-4" />

        {/* Input Section */}
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label small fw-bold text-muted">Reporting Agent</label>
            <select 
              className="form-select" 
              value={selectedAgent} 
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              <option value="">Select Agent...</option>
              {agents?.map(agent => (
                <option key={agent._id} value={agent._id}>{agent.name}</option>
              ))}
            </select>
          </div>
          
          <div className="col-md-6">
            <label className="form-label small fw-bold text-muted">Follow-up Note</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter details of the client interaction..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100 py-2 shadow-sm" onClick={handleAddComment}>
              Post Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;