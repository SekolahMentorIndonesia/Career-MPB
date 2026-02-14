import { useState, useEffect, useContext } from 'react';
import { Search, MapPin, ChevronDown, Briefcase, Clock, DollarSign, Filter, Loader2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { AuthContext } from '../context/AuthContext';

const JobSearchSection = () => {
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/jobs`);
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
            <label htmlFor="search-input" className="sr-only">Cari posisi pekerjaan</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="search-input"
              type="text"
              placeholder="Cari posisi pekerjaan..."
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative md:w-48">
            <label htmlFor="location-filter" className="sr-only">Filter lokasi</label>
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              id="location-filter"
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
            <label htmlFor="type-filter" className="sr-only">Filter tipe pekerjaan</label>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              id="type-filter"
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
              <div key={job.id} className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      job.type === 'Full-time' ? "bg-blue-50 text-blue-600" :
                        job.type === 'Part-time' ? "bg-purple-50 text-purple-600" :
                          "bg-orange-50 text-orange-600"
                    )}>
                      {job.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-opacity-50 ${getJobStatus(job).color}`}>
                      {getJobStatus(job).label}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{job.title}</h3>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {job.location}
                    </div>
                    {/* Salary removed */}
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {job.type}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <Link
                    to={`/jobs/${job.id}/details`}
                    className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                  >
                    Detail
                  </Link>
                  {user?.role !== 'admin' && (
                    <Link
                      to={isJobOpen(job) ? `/apply/${job.id}` : '#'}
                      className={`inline-flex justify-center items-center px-8 py-2.5 text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 ${isJobOpen(job)
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none pointer-events-none'
                        }`}
                    >
                      {isJobOpen(job) ? (
                        user ? (
                          <>Lamar Sekarang <ArrowRight className="ml-2 w-4 h-4" /></>
                        ) : (
                          <>Login untuk Melamar <ArrowRight className="ml-2 w-4 h-4" /></>
                        )
                      ) : (
                        'Pendaftaran Tutup'
                      )}
                    </Link>
                  )}
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
    </section>
  );
};

export default JobSearchSection;
