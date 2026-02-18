import React, { useState, useEffect } from 'react';
import { Brain, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const UserPsychotest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchPsychotest = async () => {
      try {
        const response = await fetch(`${window.API_BASE_URL}/api/user/psychotest`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching psychotest:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychotest();
  }, []);

  const getStatusDisplay = () => {
    if (!data) return { icon: <Brain className="h-6 w-6 text-gray-500" />, text: 'Belum Ada Penjadwalan', subtext: 'Anda belum memiliki jadwal psikotes. Silakan tunggu update setelah lolos seleksi berkas.', color: 'gray' };

    // If status is still Administrasi or Ditolak, no link yet
    if (data.status === 'Administrasi' || data.status === 'Seleksi Administrasi') return { icon: <Clock className="h-6 w-6 text-yellow-500" />, text: 'Menunggu Review Berkas', subtext: 'Lamaran Anda sedang direview. Link psikotes akan muncul jika Anda lolos tahap administrasi.', color: 'orange' };
    if (data.status === 'Ditolak') return { icon: <CheckCircle className="h-6 w-6 text-red-500" />, text: 'Belum Beruntung', subtext: 'Maaf, lamaran Anda belum memenuhi kualifikasi kami untuk tahap selanjutnya.', color: 'red' };

    // If moved to Psikotes but link not yet assigned by admin
    if (!data.link) return { icon: <Clock className="h-6 w-6 text-blue-500" />, text: 'Terjadwal: Psikotes', subtext: 'Anda lolos ke tahap psikotes! Admin akan segera mengirimkan link pengerjaan di sini.', color: 'blue' };

    // If link assigned
    return { icon: <Brain className="h-6 w-6 text-indigo-500" />, text: 'Psikotes Tersedia', subtext: 'Link psikotes Anda sudah siap. Silakan klik tombol di bawah untuk mulai mengerjakan.', color: 'indigo' };
  };

  const status = getStatusDisplay();

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased p-6 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-indigo-900">Psikotes</h1>
            <p className="text-xs text-gray-400 font-medium">Rekrutmen MPB Corps</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white border-2 border-gray-50 rounded-[2rem] p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status Seleksi</h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                {status.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{status.text}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{status.subtext}</p>
              </div>
            </div>

            {data?.link && (
              <a
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 text-base"
              >
                Mulai Psikotes
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-500" />
              Informasi Penting
            </h3>
            <ul className="space-y-3">
              {[
                "Pengerjaan hanya dapat dilakukan 1 kali.",
                "Gunakan laptop/PC untuk pengalaman terbaik.",
                "Pastikan koneksi internet stabil.",
                "Sistem anti-cheat aktif secara otomatis."
              ].map((text, idx) => (
                <li key={idx} className="flex gap-3 text-xs text-gray-600 leading-relaxed">
                  <span className="text-indigo-300">•</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-xs text-gray-400 font-medium mb-4">Butuh bantuan teknis?</p>
            <button
              onClick={() => window.open('https://wa.me/6283198291207', '_blank')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline flex items-center gap-1"
            >
              Hubungi CS Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPsychotest;
