import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Loader2 } from 'lucide-react';

const GoogleLoginButton = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Initialize Google Sign-In
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-client-id.apps.googleusercontent.com',
                callback: handleGoogleResponse,
                auto_select: false,
            });

            // Render the button
            window.google.accounts.id.renderButton(
                document.getElementById('googleSignInButton'),
                {
                    theme: 'outline',
                    size: 'large',
                    width: '100%', // Use string '100%' for better responsiveness within container
                    text: 'continue_with',
                    shape: 'rectangular',
                }
            );
        }
    }, []);

    const handleGoogleResponse = async (response) => {
        setIsLoading(true);

        try {
            // Send credential to backend for verification
            const res = await fetch(`${window.API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credential: response.credential,
                }),
            });

            const data = await res.json();

            if (data.success) {
                // Store token and user data reactively
                setAuth(data.data.token, data.data.user);

                showNotification('success', 'Login Berhasil!', `Selamat datang, ${data.data.user.name}!`);

                // Match the redirection logic in Login.jsx
                const user = data.data.user;
                if (user.role?.toUpperCase() === 'ADMIN') {
                    navigate('/dashboard/admin');
                } else {
                    navigate('/dashboard/user');
                }
            } else {
                showNotification('error', 'Login Gagal', data.message || 'Terjadi kesalahan saat login dengan Google');
            }
        } catch (error) {
            console.error('Google login error:', error);
            showNotification('error', 'Kesalahan', 'Terjadi kesalahan koneksi. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-[calc(100vw-3rem)] mx-auto flex justify-center overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
            )}
            <div id="googleSignInButton" className="w-full min-h-[44px] flex justify-center"></div>
        </div>
    );
};

export default GoogleLoginButton;
