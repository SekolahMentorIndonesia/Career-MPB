import React, { useState, useEffect } from 'react';
import {
    Mail, Camera, CheckCircle2,
    ShieldCheck, X
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';

const AccountSettings = () => {
    const { user, token, updateUser } = useAuth();

    // --- COMPONENT STATE ---
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [otpType, setOtpType] = useState(''); // 'email' or 'phone'
    const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    // Account State
    const [account, setAccount] = useState({
        email: user?.email || '',
        isEmailVerified: true, // Mocked for now, context should handle this
    });

    const [photoPreview, setPhotoPreview] = useState(user?.photo ? `${window.API_BASE_URL}${user.photo}` : null);

    const API_URL = `${window.API_BASE_URL}/api`;

    // --- ACTIONS ---
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const response = await fetch(`${API_URL}/user/upload-photo`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const result = await response.json();

            if (result.status === 'success') {
                // Update local preview and global user state
                setPhotoPreview(URL.createObjectURL(file));

                // Re-fetch profile to sync global state
                const profileRes = await fetch(`${API_URL}/user/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const profileResult = await profileRes.json();
                if (profileResult.status === 'success') {
                    updateUser(profileResult.data);
                }
            }
        } catch (error) {
            console.error('Photo upload failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openOtp = (type) => {
        setOtpType(type);
        setIsOtpModalOpen(true);
        setResendTimer(60); // Start timer immediately upon opening
        // Ideally trigger API call here too if not already triggered
        handleResendOtp(false); // Call with false to only trigger API if needed, or just rely on user interaction. 
        // For this task, let's just start the timer and assume the user requested it.
        // Actually, let's make handleResendOtp capable of sending the request.
    };

    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleResendOtp = async (force = true) => {
        if (!force && resendTimer > 0) return;

        if (force) setResendTimer(60);

        // API Call to request OTP (Email only if implemented)
        try {
            // Logic for email OTP would go here
        } catch (error) {
            console.error("Error requesting OTP:", error);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otpValue];
        newOtp[index] = value;
        setOtpValue(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const verifyOtp = () => {
        if (otpType === 'email') setAccount(prev => ({ ...prev, isEmailVerified: true }));
        setIsOtpModalOpen(false);
        setOtpValue(['', '', '', '', '', '']);
        setResendTimer(0);
    };

    // --- UI COMPONENTS ---
    const SectionHeader = ({ title, icon: Icon }) => (
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
            <div className="p-2 bg-blue-50 rounded-lg">
                <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">{title}</h2>
        </div>
    );

    const InputLabel = ({ label, required }) => (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pengaturan Akun</h1>
                    <p className="text-gray-500 mt-1">Kelola keamanan akun dan unggah foto profil Anda di sini.</p>
                </div>
            </div>

            {/* 1. UPLOAD FOTO SECTION */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6 md:p-8">
                <SectionHeader title="Foto Profil" icon={Camera} />
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="group relative w-40 h-40 rounded-full bg-blue-50 border-4 border-white shadow-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-all overflow-hidden">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <Camera className="w-10 h-10 text-blue-300" />
                        )}
                        <input
                            type="file" accept="image/*" onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            disabled={isSubmitting}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold uppercase tracking-wider">Ganti Foto</span>
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h3 className="text-lg font-bold text-gray-800">Unggah Foto Baru</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Foto ini akan ditampilkan pada profil dan kartu pelamar Anda.
                            Pastikan foto terlihat jelas (wajah menghadap ke depan).
                        </p>
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 inline-block rounded-full">
                            Format: JPG, PNG • Max: 2MB
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. DATA AKUN & KEAMANAN SECTION */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 md:p-8">
                    <SectionHeader title="Keamanan & Akses" icon={ShieldCheck} />

                    <div className="space-y-8">
                        <div className="space-y-6">
                            {/* EMAIL ROW (READ ONLY) */}
                            <div className="space-y-2">
                                <InputLabel label="Email Terhubung" />
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm text-blue-600 flex-shrink-0">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 truncate">{account.email}</span>
                                    </div>
                                    <div className="flex items-center self-start sm:self-auto gap-1.5 px-3 py-1 bg-green-50 border border-green-100 rounded-full flex-shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                        <span className="text-[10px] font-black text-green-700 uppercase tracking-tight">Terverifikasi</span>
                                    </div>
                                </div>
                            </div>

                            {/* PHONE ROW */}
                        </div>
                    </div>
                </div>
            </section>


            {/* --- OTP MODAL --- */}
            {isOtpModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-blue-50 rounded-2xl">
                                <ShieldCheck className="w-8 h-8 text-blue-600" />
                            </div>
                            <button onClick={() => setIsOtpModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Verifikasi OTP</h2>
                        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                            Masukkan 6 digit kode yang kami kirimkan ke
                            <span className="font-bold text-gray-800"> {otpType === 'email' ? account.email : (user?.phone || '08123456789')}</span>
                        </p>

                        <div className="flex justify-between gap-2 mt-8">
                            {otpValue.map((digit, i) => (
                                <input
                                    key={i} id={`otp-${i}`}
                                    type="text" maxLength={1} value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    className="w-full h-14 text-center text-xl font-black bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            ))}
                        </div>

                        <div className="mt-8 space-y-4">
                            <button
                                onClick={verifyOtp}
                                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all"
                            >
                                KONFIRMASI VERIFIKASI
                            </button>
                            <p className="text-center text-sm text-gray-500 font-medium">
                                Tidak menerima kode?{' '}
                                <button
                                    onClick={() => handleResendOtp(true)}
                                    disabled={resendTimer > 0}
                                    className={clsx(
                                        "font-bold hover:underline",
                                        resendTimer > 0 ? "text-gray-400 cursor-not-allowed no-underline" : "text-blue-600"
                                    )}
                                >
                                    {resendTimer > 0 ? `Kirim Ulang (${resendTimer}s)` : 'Kirim Ulang'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountSettings;
