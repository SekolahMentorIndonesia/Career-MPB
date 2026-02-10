import React, { useState, useEffect } from 'react';
import { Users, BrainCircuit, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const AdminOverview = () => {
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://${window.location.hostname}:8000/api/admin/dashboard-stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const result = await response.json();
        if (result.success) {
          setStatsData(result.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      name: 'Total Pelamar',
      stat: statsData?.total_applicants || 0,
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'Sedang Psikotes',
      stat: statsData?.in_psychotest || 0,
      icon: BrainCircuit,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      name: 'Lulus',
      stat: statsData?.passed || 0,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      name: 'Gagal',
      stat: statsData?.failed || 0,
      icon: XCircle,
      color: 'bg-red-100 text-red-600'
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-5 flex items-center gap-4">
              <div className={`flex-shrink-0 p-3 rounded-lg ${item.color}`}>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">{item.name}</dt>
                <dd className="text-2xl font-bold text-gray-900">{item.stat}</dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terakhir</h2>
        <div className="space-y-4">
          {statsData?.recent_activities?.length > 0 ? (
            statsData.recent_activities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">
                    <span className="font-bold">{activity.user_name}</span> melamar posisi <span className="text-blue-600">{activity.job_title}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: id })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">Belum ada aktivitas terbaru.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
