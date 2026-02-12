import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import GoogleLoginButton from '../../components/GoogleLoginButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await login(email, password);

      // Redirect Logic based on Role
      if (user.role === 'ADMIN') {
        navigate('/dashboard/admin');
      } else {
        // If they were trying to access a specific page, go there, else go to dashboard
        navigate(from === '/' ? '/dashboard/user' : from);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-200">
        {/* Top Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-md overflow-hidden">
            <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain p-2" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Sign in to continue
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please sign in to start your rental application
          </p>
        </div>

        {/* Email form hidden as per request (Google-only auth) */}
        {/*
        <form className="space-y-4" onSubmit={handleSubmit}>
          ...
        </form>
        */}

        {/* Google Login */}
        <div className="py-4">
          <GoogleLoginButton />
        </div>

        <div className="text-sm text-center text-gray-400 mt-6">
          Official MPB Career Portal
        </div>
      </div>
    </div>
  );
};

export default Login;
