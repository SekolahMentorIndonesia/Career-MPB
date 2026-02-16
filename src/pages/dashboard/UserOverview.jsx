import React, { useState, useEffect } from 'react';
import { User, FileText, Briefcase, Loader2, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserOverview = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [latestJobs, setLatestJobs] = useState([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${window.API_BASE_URL}/api/user/dashboard-summary`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const result = await response.json();
        if (result.success) {
          setSummaryData(result.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const response = await fetch(`${window.API_BASE_URL}/api/jobs`);
        const result = await response.json();
        if (result.success) {
          setLatestJobs(result.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching latest jobs:', error);
      } finally {
        setIsJobsLoading(false);
      }
    };
    fetchLatestJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const { profile_percentage, is_profile_complete, is_document_uploaded, has_applied } = summaryData || {};

  const stats = [
    {
      name: 'Status Profil',
      stat: `${profile_percentage}%`,
      subtext: is_profile_complete ? 'Lengkap' : 'Belum Lengkap',
      icon: User,
      color: is_profile_complete ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600',
      link: '/dashboard/user/profile'
    },
    {
      name: 'Status Dokumen',
      stat: is_document_uploaded ? 'Tersedia' : 'Belum Ada',
      subtext: is_document_uploaded ? 'Sudah Diunggah' : 'Segera Lengkapi',
      icon: FileText,
      color: is_document_uploaded ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600',
      link: '/dashboard/user/documents'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 font-medium">Pantau perkembangan profil dan lamaran Anda.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {stats.map((item) => (
          <Link key={item.name} to={item.link} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 p-3 rounded-lg ${item.color}`}>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">{item.name}</dt>
                  <dd className="text-xl font-bold text-gray-900">{item.stat}</dd>
                  <p className="text-xs text-gray-400 font-medium">{item.subtext}</p>
                </div>
              </div>
              <div className="text-gray-300">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Latest Jobs Section - Basic Style */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Lowongan Terbaru</h2>
            <Link to="/dashboard/user/lowongan" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Lihat Semua
            </Link>
          </div>

          {isJobsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : latestJobs.length > 0 ? (
            <div className="space-y-3">
              {latestJobs.map((job) => (
                <Link key={job.id} to={`/jobs/${job.id}/details`} className="block bg-gray-50 hover:bg-white border hover:border-blue-200 rounded-lg p-4 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded border text-blue-600">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{job.title}</h3>
                        <p className="text-xs text-gray-500">{job.location} • {job.type}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Belum ada lowongan terbaru.</p>
          )}
        </div>

        {/* Steps Section - Simplified */}
        {(!is_profile_complete || !is_document_uploaded || !has_applied) && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" /> Langkah Selanjutnya
            </h2>
            <div className="space-y-3">
              {!is_profile_complete && (
                <Link to="/dashboard/user/profile" className="flex items-center gap-3 p-3 rounded-lg border border-orange-50 bg-orange-50/20 text-orange-700 hover:bg-white hover:border-orange-200 transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-medium">Lengkapi Data Diri</span>
                </Link>
              )}
              {!is_document_uploaded && (
                <Link to="/dashboard/user/documents" className="flex items-center gap-3 p-3 rounded-lg border border-blue-50 bg-blue-50/20 text-blue-700 hover:bg-white hover:border-blue-200 transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">Upload Dokumen Wajib</span>
                </Link>
              )}
              {!has_applied && (
                <Link to="/dashboard/user/lowongan" className="flex items-center gap-3 p-3 rounded-lg border border-green-50 bg-green-50/20 text-green-700 hover:bg-white hover:border-green-200 transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Mulai Melamar Pekerjaan</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOverview;
