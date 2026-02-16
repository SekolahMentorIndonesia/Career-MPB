import { useState, useEffect, useContext } from 'react';
import { Search, MapPin, ChevronDown, Briefcase, Clock, Filter, Loader2, ArrowRight } from 'lucide-react';
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

  const isJobOpen = (job) => {
    if (!job.registration_start_date || !job.registration_end_date) return true;
    const today = new Date();
    const start = new Date(job.registration_start_date);
    const end = new Date(job.registration_end_date);
    end.setHours(23, 59, 59);
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
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
      };
    } else if (today > end) {
      return { label: 'Tutup', color: 'bg-red-100 text-red-700 border-red-200' };
    } else {
      return {
        label: `Sisa ${Math.ceil((end - today) / (1000 * 60 * 60 * 24))} Hari`,
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
      };
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = locationFilter ? job.location.includes(locationFilter) : true;
    const matchType = typeFilter ? job.type === typeFilter : true;
    return matchSearch && matchLocation && matchType;
  });

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari posisi pekerjaan..."
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative md:w-44">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <select
              className="w-full pl-8 pr-8 py-2 text-sm border rounded-lg appearance-none bg-white focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
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
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          <div className="relative md:w-44">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <select
              className="w-full pl-8 pr-8 py-2 text-sm border rounded-lg appearance-none bg-white focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Semua Tipe</option>
              {[...new Set(jobs.map(job => job.type.trim()))].sort().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Memuat lowongan...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={clsx(
                      "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider",
                      job.type === 'Full-time' ? "bg-blue-50 text-blue-600" :
                        job.type === 'Part-time' ? "bg-purple-50 text-purple-600" :
                          "bg-orange-50 text-orange-600"
                    )}>
                      {job.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${getJobStatus(job).color}`}>
                      {getJobStatus(job).label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{job.title}</h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {job.type}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <Link
                    to={`/jobs/${job.id}/details`}
                    className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
                  >
                    Detail
                  </Link>
                  {user?.role !== 'admin' && (
                    <Link
                      to={isJobOpen(job) ? `/apply/${job.id}` : '#'}
                      className={`inline-flex justify-center items-center px-5 py-1.5 text-xs font-bold rounded-lg transition-all ${isJobOpen(job)
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                        }`}
                    >
                      {isJobOpen(job) ? (
                        user ? 'Lamar Sekarang' : 'Login untuk Melamar'
                      ) : (
                        'Pendaftaran Tutup'
                      )}
                      {isJobOpen(job) && <ArrowRight className="ml-1.5 w-3.5 h-3.5" />}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Briefcase className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Lowongan tidak ditemukan.</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto mb-4">
              Coba gunakan filter lain atau cari dengan kata kunci berbeda.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setLocationFilter(''); setTypeFilter(''); }}
              className="text-blue-600 hover:text-blue-700 text-xs font-bold border-b border-blue-600 pb-0.5"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearchSection;
