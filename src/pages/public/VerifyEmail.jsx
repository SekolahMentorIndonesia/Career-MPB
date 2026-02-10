import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { KeyRound, Loader2, ArrowLeft } from 'lucide-react';

const VerifyEmail = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { verifyEmail } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get('email');

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError('Please enter a 6-digit code');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            await verifyEmail(email, otp);
            setSuccess('Email verified successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || 'Verification failed. Please check the code.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-200">
                <div className="flex justify-center mb-2">
                    <div className="w-16 h-16 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                        <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain p-2" />
                    </div>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <KeyRound className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        We've sent a 6-digit verification code to <br />
                        <span className="font-semibold text-gray-900">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center border border-green-200">
                            {success}
                        </div>
                    )}

                    <div>
                        <input
                            type="text"
                            maxLength="6"
                            placeholder="000000"
                            className="w-full text-center text-3xl tracking-[1em] font-bold py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Account'}
                    </button>
                </form>

                <div className="text-center">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
