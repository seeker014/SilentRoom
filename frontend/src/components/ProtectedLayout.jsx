// src/components/ProtectedLayout.jsx
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
        
        <Outlet />
      </div>
  );
};

export default ProtectedLayout;
