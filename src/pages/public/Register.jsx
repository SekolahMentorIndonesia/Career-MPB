import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Loader2, Eye, EyeOff, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import GoogleLoginButton from '../../components/GoogleLoginButton';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, isAuthenticated } = useAuth();
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
      const data = await register(name, email, phone, password);
      // On success, redirect to verify email page with email in query param
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
            Sign up to continue
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please sign up to create your account
          </p>
        </div>

        {/* Registration form hidden (Google-only auth handles registration) */}
        {/*
        <form className="space-y-4" onSubmit={handleSubmit}>
          ...
        </form>
        */}

        {/* Google Login */}
        <div className="py-4">
          <GoogleLoginButton from={from} />
        </div>

        <div className="text-sm text-center text-gray-400 mt-6">
          Official MPB Career Portal
        </div>
      </div>
    </div>
  );
};

export default Register;
