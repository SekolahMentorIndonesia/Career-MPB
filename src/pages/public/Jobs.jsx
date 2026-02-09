import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Search, Briefcase, Filter } from 'lucide-react';

const MOCK_JOBS = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    slug: 'senior-frontend-developer',
    type: 'Full-time',
    location: 'Jakarta (Hybrid)',
    salary: 'IDR 15M - 25M',
    department: 'Engineering'
  },
  {
    id: 2,
    title: 'Product Designer (UI/UX)',
    slug: 'product-designer',
    type: 'Full-time',
    location: 'Remote',
    salary: 'IDR 12M - 20M',
    department: 'Design'
  },
  {
    id: 3,
    title: 'Backend Engineer (Go)',
    slug: 'backend-engineer-go',
    type: 'Contract',
    location: 'Bandung',
    salary: 'IDR 18M - 30M',
    department: 'Engineering'
  }
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Filter Logic
  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = locationFilter ? job.location.includes(locationFilter) : true;
    const matchType = typeFilter ? job.type === typeFilter : true;
    return matchSearch && matchLocation && matchType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-8">
        <Briefcase className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Pekerjaan Tersedia</h1>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
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

          {/* Location Filter */}
          <div className="relative md:w-48">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select 
              className="w-full pl-9 pr-8 py-2.5 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">Semua Lokasi</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Bandung">Bandung</option>
              <option value="Remote">Remote</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          {/* Type Filter */}
          <div className="relative md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select 
              className="w-full pl-9 pr-8 py-2.5 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Semua Tipe</option>
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 group">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                    {job.department}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" /> {job.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-gray-400" /> {job.salary}
                  </span>
                </div>
              </div>
              
              <Link 
                to={`/jobs/${job.slug}`}
                className="inline-flex justify-center items-center px-6 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all whitespace-nowrap"
              >
                Lihat Detail
              </Link>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada lowongan dibuka saat ini.</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Pantau terus halaman ini untuk informasi lowongan terbaru dari MPB Corps.
          </p>
          <button 
            onClick={() => {setSearchTerm(''); setLocationFilter(''); setTypeFilter('');}}
            className="mt-6 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Bersihkan Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
