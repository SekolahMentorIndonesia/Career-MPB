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

    // Check if test is completed
    if (data.score !== null) return { icon: <CheckCircle className="h-6 w-6 text-green-500" />, text: 'Psikotes Selesai', subtext: 'Anda telah menyelesaikan tahap psikotes. Hasil pengerjaan sedang ditinjau oleh tim kami.', color: 'green' };

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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Psikotes</h1>
            <p className="text-xs text-gray-500">Rekrutmen MPB Corps</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 shadow-sm">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-50 pb-2">Status Seleksi</h2>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
              {React.cloneElement(status.icon, { className: "w-6 h-6 " + status.icon.props.className })}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{status.text}</p>
              <p className="text-xs text-gray-500 mt-0.5">{status.subtext}</p>
            </div>
          </div>

          {data?.link && data.score === null ? (
            <div className="pt-2">
              <a
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all active:scale-[0.99]"
              >
                <ExternalLink className="w-4 h-4" />
                Mulai Kerjakan Psikotes
              </a>
            </div>
          ) : data?.score !== null && data?.score !== undefined ? (
            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
              <p className="text-[11px] text-green-700 font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                Anda sudah selesai mengerjakan psikotes ini.
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
              <p className="text-[11px] text-gray-500 font-medium italic">
                {data?.status === 'Ditolak'
                  ? "Tahap seleksi Anda telah selesai."
                  : "Tombol pengerjaan akan muncul di sini jika link sudah dikirim oleh Admin."}
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-xs font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-indigo-600" />
            Informasi & Aturan Penting
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {[
              { text: "Pengerjaan hanya dapat dilakukan 1 kali.", bold: true },
              { text: "Wajib menggunakan Laptop/PC (Browser Desktop).", bold: false },
              { text: "Wajib menggunakan mode Fullscreen saat ujian.", bold: true },
              { text: "Pastikan koneksi internet stabil & baterai penuh.", bold: false },
              { text: "Dilarang pindah tab / membuka aplikasi lain.", bold: true },
              { text: "Sistem Anti-Cheat & Deteksi Wajah aktif otomatis.", bold: false },
              { text: "Pelanggaran 3x akan otomatis diskualifikasi.", bold: true },
              { text: "Gunakan environment yang tenang dan terang.", bold: false }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-2.5 text-[11px] text-gray-600 leading-relaxed">
                <span className="text-indigo-500 font-bold mt-0.5">•</span>
                <span className={item.bold ? "font-bold text-gray-900" : ""}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Help */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-gray-400 mb-1">Mengalami kendala teknis?</p>
          <a
            href="https://wa.me/6283198291207"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Hubungi CS Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserPsychotest;
