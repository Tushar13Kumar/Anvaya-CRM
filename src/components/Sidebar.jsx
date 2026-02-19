import { NavLink } from "react-router-dom";
import { toast } from 'react-toastify';

const Sidebar = () => {
  return (
    <div
      className="bg-white border-end shadow-sm"
      style={{
        width: "250px",
        height: "100vh",
        position: "sticky",
        top: 0
      }}
    >

      <div className="p-3">

        <h4 className="mb-4 fw-bold">
          Anvaya CRM
        </h4>

        <ul className="nav flex-column">

          <li className="nav-item mb-2">
            <NavLink to="/" className="nav-link">
              Leads
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to="/sales-agent-view" className="nav-link">
              Sales
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to="/agents" className="nav-link">
              Agents
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink to="/reports" className="nav-link">
              Reports
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/status-view" className="nav-link">
              Leads by Status
            </NavLink>
          </li>

        </ul>

      </div>

    </div>
  );
};



export default Sidebar;