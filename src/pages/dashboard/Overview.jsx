import { Users, Briefcase, UserCheck, Clock } from 'lucide-react';

const Overview = () => {
  const stats = [
    { name: 'Total Lowongan', value: '12', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Pelamar', value: '148', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Interview', value: '24', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Pending Review', value: '56', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <span className="text-sm text-gray-500">Last updated: Today</span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden rounded-xl border shadow-sm">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-lg ${item.bg}`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="text-2xl font-bold text-gray-900">{item.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Mock */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Aktivitas Terbaru</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">Budi Santoso</span> melamar untuk posisi <span className="font-bold text-blue-600">Senior Frontend Developer</span>
                </p>
                <span className="ml-auto text-xs text-gray-400">2 jam yang lalu</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
