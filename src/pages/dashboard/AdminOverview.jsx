import React from 'react';
import { Users, BrainCircuit, CheckCircle, XCircle } from 'lucide-react';

const AdminOverview = () => {
  const stats = [
    { name: 'Total Pelamar', stat: '124', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { name: 'Sedang Psikotes', stat: '42', icon: BrainCircuit, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Lulus', stat: '45', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { name: 'Gagal', stat: '37', icon: XCircle, color: 'bg-red-100 text-red-600' },
  ];

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
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm text-gray-900 font-medium">Budi Santoso melamar posisi Senior Frontend Developer</p>
                <p className="text-xs text-gray-500">2 jam yang lalu</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
