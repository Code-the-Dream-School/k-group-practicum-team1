import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CustomerDashboard from './subcomponents/CustomerDashboard/CustomerDashboard';
import LoanOfficerDashboard from './subcomponents/LoanOfficerDashboard/LoanOfficerDashboard';
import UnderwriterDashboard from './subcomponents/UnderwriterDashboard/UnderwriterDashboard';

function Dashboard() {
  const { user } = useAuth();
  if (!user) return <div>Loading...</div>;

  switch (user.role) {
    case 'customer':
      return <CustomerDashboard />;
    case 'loan_officer':
      return <LoanOfficerDashboard />;
    case 'underwriter':
      return <UnderwriterDashboard />;
    default:
      return <Navigate to="/" replace />;
  }
}

export default Dashboard;
