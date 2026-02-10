import React, { useState, useEffect } from 'react';
import checkDataCompleteness from '../../utils/dataCompletenessChecker';
import { Loader2, Briefcase } from 'lucide-react';

const UserApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/user/applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mapStatusToSteps = (status) => {
    const steps = [
      { step: 'Administrasi', icon: <FileText className="w-5 h-5" />, label: 'Seleksi Berkas', description: 'Review data diri dan dokumen pendukung' },
      { step: 'Psikotes', icon: <Award className="w-5 h-5" />, label: 'Tes Kompetensi', description: 'Ujian psikotes dan teknis (Online/Offline)' },
      { step: 'Interview', icon: <User className="w-5 h-5" />, label: 'Wawancara', description: 'Wawancara dengan tim HR dan User' },
      { step: 'Hasil Akhir', icon: <CheckCircle className="w-5 h-5" />, label: 'Keputusan', description: 'Pengumuman hasil akhir rekrutmen' },
    ];

    let currentStepIndex = 0;
    if (status === 'Administrasi') currentStepIndex = 0;
    else if (status === 'Tes Psikotes' || status === 'Psikotes') currentStepIndex = 1;
    else if (status === 'Interview') currentStepIndex = 2;
    else if (status === 'Diterima' || status === 'Ditolak') currentStepIndex = 3;

    return steps.map((s, index) => {
      let state = 'pending';
      if (index < currentStepIndex) state = 'completed';
      else if (index === currentStepIndex) {
        if (status === 'Ditolak') state = 'rejected';
        else if (status === 'Diterima') state = 'completed';
        else state = 'in_progress';
      }
      return { ...s, status: state };
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-lg">Berhasil</span>;
      case 'in_progress':
        return <span className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-lg animate-pulse">Sedang Proses</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-lg">Gagal</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold text-gray-400 bg-gray-50 rounded-lg">Menunggu</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Lamaran Saya</h1>
        <p className="text-gray-600 mb-8">Pantau status pendaftaran Anda secara real-time.</p>

        {isLoading ? (
          <div className="bg-white rounded-3xl shadow-sm p-20 flex flex-col items-center justify-center border border-gray-100">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-500 font-medium">Menyesuaikan status lamaran...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-16 flex flex-col items-center justify-center text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Briefcase className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Lamaran</h2>
            <p className="text-gray-500 max-w-sm mx-auto">Anda belum melamar posisi apapun. Mulai karir Anda bersama kami sekarang!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{app.job_title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-gray-500">MPB Corps</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{app.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Dilamar Pada</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(app.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {mapStatusToSteps(app.status).map((item, index) => (
                      <div key={index} className="relative group">
                        <div className="flex items-center gap-4 md:flex-col md:items-center md:text-center">
                          <div className={`
                            w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10
                            ${item.status === 'completed' ? 'bg-green-500 text-white shadow-lg shadow-green-100' :
                              item.status === 'in_progress' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 animate-pulse' :
                                item.status === 'rejected' ? 'bg-red-500 text-white shadow-lg shadow-red-100' :
                                  'bg-gray-100 text-gray-400'}
                          `}>
                            {item.icon}
                          </div>

                          <div className="flex-1">
                            <h3 className={`text-sm font-bold ${item.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>
                              {item.step}
                            </h3>
                            <p className="text-[10px] text-gray-500 font-medium">
                              {item.label}
                            </p>
                            <div className="mt-2 md:hidden">
                              {getStatusBadge(item.status)}
                            </div>
                          </div>
                        </div>

                        {/* Connection Line (Desktop) */}
                        {index < 3 && (
                          <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-gray-100 -z-0">
                            <div className={`h-full transition-all duration-1000 ${mapStatusToSteps(app.status)[index + 1].status !== 'pending' ? 'bg-green-500 w-full' : 'w-0'
                              }`}></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-50 hidden md:flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span>Tahapan Rekrutmen</span>
                    <span>Status: <span className={app.status === 'Ditolak' ? 'text-red-500' : 'text-blue-600'}>{app.status}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserApplications;
