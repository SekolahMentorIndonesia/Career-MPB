import { useParams, Link } from 'react-router-dom';
import { UploadCloud, CheckCircle, AlertCircle, ArrowRight, User, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import checkDataCompleteness from '../../utils/dataCompletenessChecker';
import { useNotification } from '../../context/NotificationContext';

const Apply = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null); // 'none', 'applied', 'rejected_cooldown'
  const [cooldownMessage, setCooldownMessage] = useState('');

  const [fullUser, setFullUser] = useState(null);

  // Requirement status - use fullUser if available, otherwise fallback to auth user
  const { percentage, isProfileComplete, isDocumentUploaded } = checkDataCompleteness(fullUser || user);
  // Documents are now optional
  const canApply = isProfileComplete;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // 0. Fetch Full User Profile (to ensure we have detailed fields like ktp_rt, etc.)
        const profileResponse = await fetch(`${window.API_BASE_URL}/api/user/profile`, { headers });
        const profileResult = await profileResponse.json();
        if (profileResult.success) {
          setFullUser(profileResult.data);
        }

        // 1. Fetch user applications to check status
        const response = await fetch(`${window.API_BASE_URL}/api/user/applications`, { headers });
        const result = await response.json();

        if (result.success) {
          const existingApp = result.data.find(app => app.job_id == jobId);

          if (existingApp) {
            if (existingApp.status === 'Ditolak') {
              // Check cooldown
              const rejectedAt = new Date(existingApp.rejected_at);
              const now = new Date();
              const diffMs = now - rejectedAt;
              const cooldownMs = 24 * 60 * 60 * 1000; // 24 hours

              if (diffMs < cooldownMs) {
                setApplicationStatus('rejected_cooldown');
                const remainingMs = cooldownMs - diffMs;
                const hours = Math.floor(remainingMs / (1000 * 60 * 60));
                const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
                setCooldownMessage(`Anda baru saja ditolak. Harap tunggu ${hours} jam ${minutes} menit lagi sebelum melamar kembali.`);
              } else {
                setApplicationStatus('none'); // Cooldown expired, can apply again
              }
            } else {
              setApplicationStatus('applied');
            }
          } else {
            setApplicationStatus('none');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canApply || applicationStatus !== 'none') return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ job_id: jobId })
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        showNotification('success', 'Berhasil', 'Lamaran berhasil dikirim!');
      } else {
        showNotification('error', 'Gagal', result.message || 'Gagal mengirim lamaran');
      }
    } catch (error) {
      showNotification('error', 'Kesalahan', 'Terjadi kesalahan koneksi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Lamaran Terkirim!</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Terima kasih telah melamar. Tim HR kami akan mereview profil dan dokumen Anda. Pantau status lamaran di dashboard Anda.
        </p>
        <div className="flex gap-4">
          <Link to="/dashboard/user/overview" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Ke Dashboard
          </Link>
          <Link to="/" className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border hover:bg-gray-50 transition-all">
            Cari Lowongan Lain
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Konfirmasi Lamaran</h1>
          <p className="text-gray-600 mt-2">Pastikan data Anda sudah benar sebelum mengirim lamaran.</p>
        </div>
        <Link to="/" className="text-sm font-bold text-blue-600 hover:underline">Batal</Link>
      </div>

      {!canApply ? (
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-orange-100">
          <div className="bg-orange-500 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Lengkapi Persyaratan</h2>
            </div>
            <p className="text-orange-50/90 leading-relaxed">
              Maaf, Anda belum dapat melamar posisi ini. Silakan lengkapi data diri terlebih dahulu.
            </p>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-6 rounded-2xl border-2 transition-all ${isProfileComplete ? 'border-green-100 bg-green-50/50' : 'border-gray-100 bg-white'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${isProfileComplete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    <User className="w-6 h-6" />
                  </div>
                  {isProfileComplete ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-md">Wajib</span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Data Diri</h3>
                <p className="text-sm text-gray-500 mb-4">Biodata, Alamat, dan Pendidikan</p>
                {!isProfileComplete && (
                  <Link to="/dashboard/user/profile" className="inline-flex items-center text-sm font-bold text-blue-600 hover:gap-2 transition-all">
                    Lengkapi Sekarang <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              <div className={`p-6 rounded-2xl border-2 transition-all ${isDocumentUploaded ? 'border-green-100 bg-green-50/50' : 'border-gray-100 bg-white'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${isDocumentUploaded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  {isDocumentUploaded ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <span className="text-xs font-bold text-blue-500 bg-blue-100 px-2 py-1 rounded-md">Opsional</span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Dokumen Pendukung</h3>
                <p className="text-sm text-gray-500 mb-4">CV, Pas Foto, dan KTP</p>
                {!isDocumentUploaded && (
                  <Link to="/dashboard/user/documents" className="inline-flex items-center text-sm font-bold text-blue-600 hover:gap-2 transition-all">
                    Unggah Sekarang <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 italic">
                Aplikasi Anda akan otomatis terbuka setelah semua persyaratan di atas terpenuhi.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100 overflow-hidden relative">

          {applicationStatus === 'applied' && (
            <div className="mb-8 flex items-center gap-4 p-6 bg-green-50 rounded-2xl border border-green-100">
              <div className="p-3 bg-green-600 rounded-xl text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-green-900">Sudah Melamar</h3>
                <p className="text-sm text-green-700">Anda sudah mengirimkan lamaran untuk posisi ini. Silakan cek status di dashboard.</p>
              </div>
            </div>
          )}

          {applicationStatus === 'rejected_cooldown' && (
            <div className="mb-8 flex items-center gap-4 p-6 bg-red-50 rounded-2xl border border-red-100">
              <div className="p-3 bg-red-600 rounded-xl text-white">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-red-900">Belum Dapat Melamar Kembali</h3>
                <p className="text-sm text-red-700">{cooldownMessage}</p>
              </div>
            </div>
          )}

          {applicationStatus === 'none' && (
            <div className="mb-8 flex items-center gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="p-3 bg-blue-600 rounded-xl text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900">Profil & Dokumen Lengkap!</h3>
                <p className="text-sm text-blue-700">Data Anda akan diteruskan ke tim rekrutmen kami.</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Nama Lengkap</span>
                <span className="text-sm font-bold text-gray-900">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-bold text-gray-900">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Telepon</span>
                <span className="text-sm font-bold text-gray-900">{user?.phone}</span>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <p className="text-xs text-yellow-700 leading-relaxed">
                Dengan mengklik tombol di bawah, Anda menyatakan bahwa semua informasi yang diberikan adalah benar dan valid.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <button
              type="submit"
              disabled={isSubmitting || applicationStatus !== 'none'}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-200 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : applicationStatus === 'applied' ? "Sudah Melamar" :
                applicationStatus === 'rejected_cooldown' ? "Coba Lagi Nanti" :
                  "Kirim Lamaran Sekarang"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default Apply;
