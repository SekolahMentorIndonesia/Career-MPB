import React, { useState, useEffect } from 'react';
import {
    Mail, Phone, Lock, Camera, CheckCircle2,
    AlertCircle, ShieldCheck, X, ArrowRight
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
        phone: user?.phone || '',
        isPhoneVerified: !!user?.phone_verified_at,
    });

    const [photoPreview, setPhotoPreview] = useState(user?.photo ? `http://${window.location.hostname}:8000${user.photo}` : null);

    const API_URL = `http://${window.location.hostname}:8000/api`;

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

        // API Call to request OTP
        try {
            const endpoint = otpType === 'phone' ? '/user/request-phone-otp' : '/user/request-email-otp'; // assuming email endpoint exists or similar
            // For now, based on UserController, only phone otp is explicit. 
            if (otpType === 'phone') {
                await fetch(`${API_URL}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ phone: account.phone })
                });
            }
            // If email, logic would go here
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

    // Password Change State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.new_password !== passwordData.confirm_password) {
            alert("Password baru dan konfirmasi tidak cocok");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/user/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(passwordData)
            });
            const result = await response.json();

            if (result.status === 'success') {
                alert("Password berhasil diubah");
                setIsPasswordModalOpen(false);
                setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
            } else {
                alert(result.message || "Gagal mengubah password");
            }
        } catch (error) {
            console.error("Change password error:", error);
            alert("Terjadi kesalahan saat mengubah password");
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyOtp = () => {
        if (otpType === 'email') setAccount(prev => ({ ...prev, isEmailVerified: true }));
        if (otpType === 'phone') setAccount(prev => ({ ...prev, isPhoneVerified: true }));
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
                        {/* EMAIL ROW */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <InputLabel label="Email Hubung" />
                                {account.isEmailVerified ? (
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200">
                                        <CheckCircle2 className="w-3 h-3" /> TERVERIFIKASI
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full border border-yellow-200">
                                        BELUM DIVERIFIKASI
                                    </span>
                                )}
                            </div>

                            <div className="relative">
                                <input
                                    type="email" value={account.email} readOnly
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed outline-none"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 flex items-start gap-1.5 leading-relaxed">
                                <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                <span>Email yang telah diverifikasi tidak dapat diubah demi keamanan akun.</span>
                            </p>
                        </div>

                        {/* PHONE ROW */}
                        <div className="space-y-2 pt-8 border-t border-gray-50">
                            <div className="flex items-center gap-2">
                                <InputLabel label="Nomor Telepon (WhatsApp)" />
                                {account.isPhoneVerified && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200">
                                        <CheckCircle2 className="w-3 h-3" /> TERVERIFIKASI
                                    </span>
                                )}
                            </div>

                            <div className="relative">
                                <input
                                    type="tel" value={account.phone || ''}
                                    onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                                    disabled={account.isPhoneVerified}
                                    className={clsx(
                                        "w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all outline-none",
                                        account.isPhoneVerified
                                            ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                                            : "bg-gray-50 border-gray-300 focus:ring-2 focus:ring-blue-500/20"
                                    )}
                                    placeholder="Contoh: 0812XXXXXXXX"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    {account.isPhoneVerified ? <Lock className="w-4 h-4 text-gray-400" /> : <Phone className="w-4 h-4 text-gray-400" />}
                                </div>
                            </div>

                            {!account.isPhoneVerified && (
                                <button
                                    onClick={() => openOtp('phone')}
                                    className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Kirim Kode Verifikasi <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* PASSWORD SECTION */}
                        <div className="pt-8 border-t border-gray-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Kata Sandi Akun</h3>
                                    <p className="text-sm text-gray-400 mt-0.5">Disarankan ganti kata sandi secara berkala demi keamanan.</p>
                                </div>
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all"
                                >
                                    <Lock className="w-4 h-4" /> Ubah Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PASSWORD CHANGE MODAL --- */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-blue-50 rounded-2xl">
                                <Lock className="w-8 h-8 text-blue-600" />
                            </div>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6">Ubah Password</h2>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Password Saat Ini</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Password Baru</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={passwordData.new_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Konfirmasi Password Baru</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={passwordData.confirm_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all mt-4"
                            >
                                {isSubmitting ? 'Menyimpan...' : 'SIMPAN PASSWORD BARU'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

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
                            <span className="font-bold text-gray-800"> {otpType === 'email' ? account.email : account.phone || '08123456789'}</span>
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
