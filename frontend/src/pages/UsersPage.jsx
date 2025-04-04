// src/pages/UsersPage.jsx
import React from 'react';
import UsersTable from '../components/UsersTable';

const UsersPage = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <UsersTable/>
    </div>
  );
};

export default UsersPage;