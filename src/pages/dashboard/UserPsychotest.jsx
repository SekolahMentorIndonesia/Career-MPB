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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Psikotes</h1>

      <div className="bg-white shadow-lg rounded-2xl p-8 mb-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          {status.icon} Status Tahapan Seleksi
        </h2>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="space-y-1">
            <p className="text-lg font-bold text-gray-900">{status.text}</p>
            <p className="text-gray-600 max-w-xl">{status.subtext}</p>
          </div>

          <div className="flex items-center">
            {data?.link ? (
              <a
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Mulai Psikotes <ExternalLink className="w-5 h-5" />
              </a>
            ) : (
              <span className="px-4 py-2 bg-gray-200 text-gray-500 font-bold rounded-lg text-sm">
                Akses Belum Tersedia
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Informasi Penting Psikotes</h3>
          <p className="text-sm text-gray-500 mb-4 font-medium italic">Mohon dibaca sebelum memulai tes:</p>
          <ul className="space-y-3 text-[13px] text-gray-600 leading-relaxed">
            <li className="flex gap-3">
              <span className="text-indigo-600 font-bold shrink-0">•</span>
              <span>Psikotes ini merupakan bagian dari proses seleksi rekrutmen.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-600 font-bold shrink-0">•</span>
              <span>Setiap peserta hanya dapat mengerjakan 1 (satu) kali.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-600 font-bold shrink-0">•</span>
              <span>Pastikan Anda berada dalam kondisi tenang, fokus, dan tanpa gangguan.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-600 font-bold shrink-0">•</span>
              <span>Gunakan perangkat pribadi (laptop/PC disarankan).</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-600 font-bold shrink-0">•</span>
              <span>Sistem akan mencatat aktivitas selama pengerjaan untuk menjaga keadilan dan integritas tes.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-600 font-bold shrink-0">•</span>
              <span>Hasil psikotes akan digunakan sebagai bahan evaluasi dan tidak dapat diubah setelah dikirim.</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-600 shadow-lg rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4">Butuh Bantuan?</h3>
          <p className="text-blue-100 text-sm mb-6">
            Jika mengalami kendala teknis saat mengerjakan psikotes, silakan hubungi tim IT Support kami.
          </p>
          <button
            onClick={() => window.open('https://wa.me/6283198291207', '_blank')}
            className="px-4 py-2 bg-white text-blue-600 font-bold rounded-lg text-sm hover:bg-blue-50 transition-colors"
          >
            Hubungi CS MPB
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPsychotest;
