import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trees, 
  Warehouse,
  TruckIcon,
  LogOut 
} from 'lucide-react';

function Sidebar() {
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/farms', icon: Warehouse, label: 'Fincas' },
    { path: '/crops', icon: Trees, label: 'Cultivos' },
    { path: '/shipments', icon: TruckIcon, label: 'Remisiones' },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      {/* Logo container with white background */}
      <div className="flex items-center justify-center space-x-2 px-4 bg-white bg-opacity-100 py-4 rounded-b-lg">
        <Trees className="h-8 w-8 text-gray-900" />
        <span className="text-2xl font-bold text-gray-900">Trazafrutas</span>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
                isActive 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full left-0 px-2 py-4">
        <button
          className="flex items-center space-x-2 text-gray-400 hover:text-white w-full py-2.5 px-4 rounded transition duration-200 hover:bg-gray-800"
          onClick={() => console.log('Logout clicked')}
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
