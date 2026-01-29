import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <nav className="bg-light sidebar vh-100 p-3 shadow-sm" style={{ width: '250px' }}>
      <h4 className="mb-4">Anvaya CRM</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          {/* NavLink use kar 'a' tag ki jagah, taaki page refresh na ho */}
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold text-primary' : 'text-dark'}`}>
            Leads (Dashboard)
          </NavLink>
        </li>
       <li className="nav-item mb-2">
  <NavLink to="/sales-agent-view" className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold text-primary' : 'text-dark'}`}>
    Sales (Agent View)
  </NavLink>
</li>
        <li className="nav-item mb-2">
          <NavLink to="/agents" className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold text-primary' : 'text-dark'}`}>
            Agents
          </NavLink>
        </li>
         <li className="nav-item mb-2">
          <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold text-primary' : 'text-dark'}`}>
            Reports
          </NavLink>
        </li>
        <li className="nav-item mb-2">
  <NavLink to="/status-view" className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold text-primary' : 'text-dark'}`}>
    Leads by Status
  </NavLink>
</li>
      </ul>
    </nav>
  );
};

export default Sidebar;