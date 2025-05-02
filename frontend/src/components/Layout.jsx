import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
   <div className="flex min-h-screen bg-gray-100">   
      {/* ✅ Sidebar pour Desktop */}
      <div className="hidden md:flex md:w-64 fixed inset-y-0 left-0 bg-blue-800">
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ✅ Sidebar pour Mobile (Overlay + Sidebar) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-blue-800 z-50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform md:hidden`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ✅ Contenu Principal */}
      <div className="flex flex-col flex-1 md:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
