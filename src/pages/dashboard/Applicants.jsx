import { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';

const Applicants = () => {
  const [filter, setFilter] = useState('All');

  const applicants = [
    { id: 1, name: 'Budi Santoso', role: 'Frontend Dev', status: 'Applied', date: '2023-10-10' },
    { id: 2, name: 'Siti Aminah', role: 'Product Designer', status: 'Interview', date: '2023-10-09' },
    { id: 3, name: 'John Doe', role: 'Backend Dev', status: 'Rejected', date: '2023-10-08' },
    { id: 4, name: 'Jane Smith', role: 'Frontend Dev', status: 'Accepted', date: '2023-10-07' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Data Pelamar</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Cari pelamar berdasarkan nama atau posisi..."
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['All', 'Applied', 'Interview', 'Accepted', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`${
                filter === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* List */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {applicants.map((person) => (
            <li key={person.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-500 text-white font-medium">
                    {person.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{person.name}</p>
                  <p className="text-sm text-gray-500 truncate">{person.role}</p>
                </div>
                <div className="inline-flex items-center text-sm text-gray-500">
                  {person.date}
                </div>
                <div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    person.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    person.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    person.status === 'Interview' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {person.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Applicants;
