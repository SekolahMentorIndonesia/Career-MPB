import React from 'react';
import { Search, MapPin, ChevronDown, Briefcase } from 'lucide-react';

const JobSearchSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Pekerjaan Tersedia</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari posisi pekerjaan..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="relative md:w-1/4">
            <select
              className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none"
              defaultValue="Semua Lokasi"
            >
              <option>Semua Lokasi</option>
              <option>Jakarta</option>
              <option>Bandung</option>
              <option>Surabaya</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="relative md:w-1/4">
            <select
              className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none"
              defaultValue="Semua Tipe"
            >
              <option>Semua Tipe</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Magang</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* No jobs available message */}
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada lowongan dibuka saat ini.</h3>
          <p className="mt-1 text-sm text-gray-500">
            Pantau terus halaman ini untuk informasi lowongan terbaru dari MPB Corps.
          </p>
        </div>
      </div>
    </section>
  );
};

export default JobSearchSection;
