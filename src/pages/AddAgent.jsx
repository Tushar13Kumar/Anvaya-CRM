import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddAgent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://anvaya-project-backend.vercel.app/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
      toast.success("Mubarak ho! Naya agent team mein shamil.");
      navigate("/agents"); // Wapas list pe bhej dega
    }
  };

  return (
    <div className="container p-4">
      <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <h4>Add New Sales Agent</h4>
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="mb-3">
            <label className="form-label">Agent Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Create Agent Button</button>
        </form>
      </div>
    </div>
  );
};

export default AddAgent;