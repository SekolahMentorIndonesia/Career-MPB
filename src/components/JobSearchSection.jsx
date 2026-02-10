import { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Briefcase, Clock, DollarSign, Filter, Loader2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import ConfirmationModal from './ConfirmationModal';

const JobSearchSection = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [pendingJobId, setPendingJobId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/jobs`);
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('info', 'Login Diperlukan', 'Silakan login terlebih dahulu untuk melamar pekerjaan ini.');
      navigate('/login');
      return;
    }

    setPendingJobId(jobId);
    setIsApplyModalOpen(true);
  };

  const confirmApply = async () => {
    if (!pendingJobId) return;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://${window.location.hostname}:8000/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ job_id: pendingJobId })
      });

      const data = await response.json();
      if (data.success) {
        showNotification('success', 'Lamaran Terkirim!', 'Terima kasih! Lamaran Anda berhasil terkirim dan akan segera kami proses.');
        navigate('/dashboard/user/applications');
      } else {
        showNotification('error', 'Pengiriman Gagal', data.message || 'Gagal mengirim lamaran');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      showNotification('error', 'Kesalahan Sistem', 'Terjadi kesalahan koneksi. Silakan coba beberapa saat lagi.');
    } finally {
      setIsApplyModalOpen(false);
      setPendingJobId(null);
    }
  };

  // Helper to check if job is open
  const isJobOpen = (job) => {
    if (!job.registration_start_date || !job.registration_end_date) return true; // Assume open if no dates
    const today = new Date();
    const start = new Date(job.registration_start_date);
    const end = new Date(job.registration_end_date);
    end.setHours(23, 59, 59); // End of the day
    return today >= start && today <= end;
  };

  const getJobStatus = (job) => {
    if (!job.registration_start_date || !job.registration_end_date) return { label: 'Dibuka', color: 'bg-emerald-100 text-emerald-700' };

    const today = new Date();
    const start = new Date(job.registration_start_date);
    const end = new Date(job.registration_end_date);
    end.setHours(23, 59, 59);

    if (today < start) {
      return {
        label: `Dibuka ${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`,
        color: 'bg-yellow-100 text-yellow-700'
      };
    } else if (today > end) {
      return { label: 'Tutup', color: 'bg-red-100 text-red-700' };
    } else {
      return {
        label: `Sisa ${Math.ceil((end - today) / (1000 * 60 * 60 * 24))} Hari`,
        color: 'bg-emerald-100 text-emerald-700'
      };
    }
  };

  // Filter Logic
  const filteredJobs = jobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = locationFilter ? job.location.includes(locationFilter) : true;
    const matchType = typeFilter ? job.type === typeFilter : true;
    return matchSearch && matchLocation && matchType;
  });

  return (
    <section id="karir-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Pekerjaan Tersedia</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari posisi pekerjaan..."
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative md:w-48">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              className="w-full pl-9 pr-8 py-2.5 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">Semua Lokasi</option>
              {[...new Set(jobs.map(job =>
                job.location.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
              ))].sort().map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="relative md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              className="w-full pl-9 pr-8 py-2.5 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Semua Tipe</option>
              {[...new Set(jobs.map(job =>
                job.type.trim()
              ))].sort().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Memuat lowongan...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                        {job.company}
                      </span>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border border-opacity-50 ${getJobStatus(job).color}`}>
                        {getJobStatus(job).label}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" /> {job.type}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-gray-400" /> {job.target_audience}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/jobs/${job.id}/details`}
                    className="inline-flex justify-center items-center px-6 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all whitespace-nowrap"
                  >
                    Detail
                  </Link>
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={!isJobOpen(job)}
                    className={`inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-lg text-white transition-all whitespace-nowrap shadow-lg ${isJobOpen(job)
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                      : 'bg-gray-300 cursor-not-allowed shadow-none'
                      }`}
                  >
                    {isJobOpen(job) ? (
                      <>Lamar Sekarang <ArrowRight className="ml-2 w-4 h-4" /></>
                    ) : (
                      'Pendaftaran Tutup'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada lowongan dibuka saat ini.</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Pantau terus halaman ini untuk informasi lowongan terbaru dari MPB Corps.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setLocationFilter(''); setTypeFilter(''); }}
              className="mt-6 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Bersihkan Filter
            </button>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={isApplyModalOpen}
        title="Lamar Pekerjaan Ini?"
        message="Apakah Anda yakin ingin melamar posisi ini? Pastikan data profil dan dokumen Anda sudah lengkap."
        onConfirm={confirmApply}
        onCancel={() => {
          setIsApplyModalOpen(false);
          setPendingJobId(null);
        }}
        confirmText="Ya, Lamar"
        cancelText="Batal"
      />
    </section>
  );
};

export default JobSearchSection;
