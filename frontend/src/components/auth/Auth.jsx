// frontend/src/components/auth/Auth.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import Login from '../LoginForm';
import Signup from '../SignupForm';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === '/login';
  const handleAuthSuccess = (user) => {
    console.log('Auth success callback called with user:', user);
    if (user.role === 'customer') {
      navigate('/dashboard');
    } else if (user.role === 'loan_officer') {
      navigate('/officer/dashboard');
    } else if (user.role === 'underwriter') {
      navigate('/underwriter/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return isLogin ? (
    <Login onSwitchToSignup={() => navigate('/signup')} onLoginSuccess={handleAuthSuccess} />
  ) : (
    <Signup onSwitchToLogin={() => navigate('/login')} onLoginSuccess={handleAuthSuccess} />
  );
}
