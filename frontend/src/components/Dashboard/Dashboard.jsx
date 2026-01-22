import React from 'react';
import CustomerDashboard from './subcomponents/CustomerDashboard/CustomerDashboard';

function Dashboard() {
  // This will be based on the role of the logged in user
  return <CustomerDashboard />;
}

export default Dashboard;
