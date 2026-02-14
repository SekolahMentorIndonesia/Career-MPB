import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, ArrowLeft, Loader2, Building2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const JobDetail = () => {
  const { slug } = useParams();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobDetail();
  }, [slug]);

  const fetchJobDetail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/jobs/${slug}`);
      const data = await response.json();
      if (data.success) {
        setJob(data.data);
      } else {
        showNotification('error', 'Gagal', data.message || 'Gagal memuat detail lowongan');
      }
    } catch (error) {
      console.error('Error fetching job detail:', error);
      showNotification('error', 'Kesalahan', 'Terjadi kesalahan koneksi ke server');
    } finally {
      setIsLoading(false);
    }
  };

  const isJobOpen = (job) => {
    if (!job?.registration_start_date || !job?.registration_end_date) return true;
    const today = new Date();
    const start = new Date(job.registration_start_date);
    const end = new Date(job.registration_end_date);
    end.setHours(23, 59, 59);
    return today >= start && today <= end;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Memuat detail lowongan...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lowongan tidak ditemukan</h2>
        <Link to="/" className="text-blue-600 hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
      </Link>

      <div className="bg-white rounded-2xl border shadow-sm p-8">
        <div className="border-b pb-8 mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            {job.type}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-6 text-gray-600">
            <span className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {job.location}</span>
            <span className="flex items-center gap-2 font-bold text-blue-600"><Building2 className="w-5 h-5" /> {job.company}</span>
            {job.registration_end_date && (
              <span className={`flex items-center gap-2 font-medium ${isJobOpen(job) ? 'text-emerald-600' : 'text-red-600'}`}>
                <Clock className="w-5 h-5" />
                {isJobOpen(job) ? `Dibuka sampai ${formatDate(job.registration_end_date)}` : 'Pendaftaran Ditutup'}
              </span>
            )}
          </div>
        </div>

        <div className="prose max-w-none text-gray-600 mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Pekerjaan</h3>
          <div className="whitespace-pre-line leading-relaxed">
            {job.description}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t items-center gap-4">
          {user?.role === 'admin' ? (
            <div className="text-center w-full py-4">
              <p className="text-gray-600 font-medium">
                <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                  👔 Anda adalah Admin/HR. Anda tidak dapat melamar pekerjaan karena Anda yang membuka lowongan ini.
                </span>
              </p>
            </div>
          ) : (
            <>
              {!isJobOpen(job) && <span className="text-red-500 font-medium">Masa pendaftaran telah berakhir.</span>}
              <Link
                to={isJobOpen(job) ? `/apply/${job.id}` : '#'}
                className={`px-8 py-4 font-bold rounded-lg transition-colors shadow-lg ${isJobOpen(job)
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none pointer-events-none'
                  }`}
              >
                {isJobOpen(job) ? (user ? 'Lamar Sekarang' : 'Login untuk Melamar') : 'Pendaftaran Tutup'}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
