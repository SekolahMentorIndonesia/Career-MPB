import { useParams, Link } from 'react-router-dom';
import { UploadCloud, CheckCircle, AlertCircle, ArrowRight, User, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import checkDataCompleteness from '../../utils/dataCompletenessChecker';
import { useNotification } from '../../context/NotificationContext';

const Apply = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Requirement status
  const { percentage, isProfileComplete, isDocumentUploaded } = checkDataCompleteness(user);
  // Documents are now optional
  const canApply = isProfileComplete;

  useEffect(() => {
    // Simulate loading to ensure user data is ready from context
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canApply) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/applications`, {
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
        addNotification('Lamaran berhasil dikirim!', 'success');
      } else {
        addNotification(result.message || 'Gagal mengirim lamaran', 'error');
      }
    } catch (error) {
      addNotification('Terjadi kesalahan koneksi', 'error');
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
          <div className="mb-8 flex items-center gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="p-3 bg-blue-600 rounded-xl text-white">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900">Profil & Dokumen Lengkap!</h3>
              <p className="text-sm text-blue-700">Data Anda akan diteruskan ke tim rekrutmen kami.</p>
            </div>
          </div>

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
              disabled={isSubmitting}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-200 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : "Kirim Lamaran Sekarang"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Apply;
