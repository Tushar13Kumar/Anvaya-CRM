import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch'; // Jo tune pehle banaya tha
import { toast } from 'react-toastify';

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [newComment, setNewComment] = useState("");
  
  // 1. Agent select karne ke liye state
  const [selectedAgent, setSelectedAgent] = useState("");

  // 2. Agents ki list fetch kar lo (Dropdown ke liye)
  const { data: agents } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  useEffect(() => {
    fetch(`https://anvaya-project-backend.vercel.app/leads/${id}`)
      .then(res => res.json())
      .then(data => setLead(data));
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
    toast.success("Status badal gaya!");
  }
};

  const handleAddComment = async () => {
    // 3. Check karo dono cheezein hain ya nahi
    if (!newComment || !selectedAgent) {
      return toast.warn("Bhai, comment likh aur Agent bhi toh chuno!");
    }

    const response = await fetch(`https://anvaya-project-backend.vercel.app/leads/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        text: newComment, 
        author: selectedAgent, // Ab ye dynamic hai!
        timestamp: new Date().toLocaleString() 
      }),
    });

    if (response.ok) {
      const updatedLead = await response.json();
      setLead(updatedLead);
      setNewComment(""); // Saaf kar do
      setSelectedAgent(""); // Dropdown bhi reset
    }
  };

  if (!lead) return <div>Ruk ja bhai, loading ho rahi hai...</div>;

  return (
    <div className="container p-4">
      {/* Lead Details Card yahan aayega... (pichle wala code) */}
      {/* // LeadDetails.jsx ke return mein "Comments" se upar ye daal de: */}
<div className="card p-4 shadow-sm mb-4">
  <div className="d-flex justify-content-between">
    <h2>{lead.name}</h2>
    <span className="badge bg-primary fs-6">{lead.status}</span>
  </div>
  <hr />
  <div className="row">
    <div className="col-md-6">
      <p><b>Agent:</b> {lead.salesAgent?.name || "Not Assigned"}</p>
      <p><b>Source:</b> {lead.source}</p>
    </div>
    <div className="col-md-6">
      <p><b>Priority:</b> {lead.priority}</p>
      <p><b>Time to Close:</b> {lead.timeToClose} Days</p>
    </div>
  </div>
</div>

      <div className="card p-4 shadow-sm bg-light mt-4">
        <h5>🍎 Comments & Updates</h5>
        
        {/* Comment List Render yahan... */}
        {/* Purane Comments dikhane ke liye */}
<div className="mt-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
  {lead.comments && lead.comments.length > 0 ? (
    lead.comments.map((c, index) => (
      <div key={index} className="p-3 mb-2 bg-white border rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="badge bg-secondary">{c.author}</span>
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>{c.timestamp}</small>
        </div>
        <p className="mb-0 text-dark" style={{ fontSize: '0.9rem' }}>{c.text}</p>
      </div>
    ))
  ) : (
    <p className="text-muted italic">Abhi tak koi baat-cheet nahi hui...</p>
  )}
</div>

        <hr />
        {/* YAHAN HAI ASLI KHEL: Dropdown + Input */}
        <div className="row g-2">
          <div className="col-md-4">
            <select 
              className="form-select" 
              value={selectedAgent} 
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              <option value="">Agent Chuno...</option>
              {agents.map(agent => (
                <option key={agent._id} value={agent.name}>{agent.name}</option>
              ))}
            </select>
          </div>
          
          <div className="col-md-6">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Kya baat hui?" 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleAddComment}>
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;