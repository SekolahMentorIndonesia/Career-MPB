import React, { useState } from 'react';
import { User, CheckCircle, XCircle, Clock, Users, FileText, BarChart, Search, ChevronsUpDown, Link as LinkIcon, Copy, Check } from 'lucide-react';
import clsx from 'clsx';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';

const AdminPsychotest = () => {
  const [activeTab, setActiveTab] = useState('participants'); // 'participants', 'questions', 'summary'
  const [isUserSelectionModalOpen, setIsUserSelectionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [generatedLinkForUser, setGeneratedLinkForUser] = useState('');

  const psychotestParticipants = [
    { id: 1, name: 'Budi Santoso', status: 'Selesai', result: 'Lulus', position: 'Frontend Dev', pgScore: 80, essayScore: 'Belum Dinilai' },
    { id: 2, name: 'Siti Aminah', status: 'Sedang Mengerjakan', result: '-', position: 'Backend Dev', pgScore: '-', essayScore: '-' },
    { id: 3, name: 'Joko Susilo', status: 'Belum Mengerjakan', result: '-', position: 'UI/UX Designer', pgScore: '-', essayScore: '-' },
    { id: 4, name: 'Dewi Lestari', status: 'Selesai', result: 'Tidak Lulus', position: 'Frontend Dev', pgScore: 50, essayScore: 'Sudah Dinilai' },
    { id: 5, name: 'Rahmat Hidayat', status: 'Selesai', result: 'Lulus', position: 'Backend Dev', pgScore: 90, essayScore: 'Sudah Dinilai' },
  ];

  const dummyUsers = [
    { id: 1, name: 'Budi Santoso', email: 'budi.santoso@example.com' },
    { id: 2, name: 'Siti Aminah', email: 'siti.aminah@example.com' },
    { id: 3, name: 'Joko Susilo', email: 'joko.susilo@example.com' },
    { id: 4, name: 'Dewi Lestari', email: 'dewi.lestari@example.com' },
    { id: 5, name: 'Rahmat Hidayat', email: 'rahmat.hidayat@example.com' },
  ];

  const handleGenerateLink = () => {
    setIsUserSelectionModalOpen(true);
    setSelectedUser(null); // Reset selected user when opening modal
    setGeneratedLinkForUser(''); // Reset generated link when opening modal
  };

  const handleCloseUserSelectionModal = () => {
    setIsUserSelectionModalOpen(false);
    setSelectedUser(null);
    setGeneratedLinkForUser('');
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleGenerateLinkForUser = () => {
    if (selectedUser) {
      const code = generateRandomCode();
      setGeneratedLinkForUser(`${window.location.origin}/test-psikotes/${code}?user=${selectedUser.id}`);
    } else {
      alert('Pilih peserta terlebih dahulu!');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Belum Mengerjakan':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Belum Mengerjakan</span>;
      case 'Sedang Mengerjakan':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Sedang Mengerjakan</span>;
      case 'Selesai':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Selesai</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getResultBadge = (result) => {
    switch (result) {
      case 'Lulus':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Lulus</span>;
      case 'Tidak Lulus':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Tidak Lulus</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{result}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Psikotes</h1>
          <p className="text-gray-600">Atur soal dan pantau peserta psikotes</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-0 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('participants')}
              className={clsx(
                activeTab === 'participants'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
              )}
            >
              <Users
                className={clsx(
                  activeTab === 'participants' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500',
                  '-ml-0.5 mr-2 h-5 w-5'
                )}
                aria-hidden="true"
              />
              <span>Daftar Peserta</span>
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={clsx(
                activeTab === 'questions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
              )}
            >
              <FileText
                className={clsx(
                  activeTab === 'questions' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500',
                  '-ml-0.5 mr-2 h-5 w-5'
                )}
                aria-hidden="true"
              />
              <span>Bank Soal</span>
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={clsx(
                activeTab === 'summary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
              )}
            >
              <BarChart
                className={clsx(
                  activeTab === 'summary' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500',
                  '-ml-0.5 mr-2 h-5 w-5'
                )}
                aria-hidden="true"
              />
              <span>Ringkasan</span>
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'participants' && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full sm:w-1/2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari peserta..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleGenerateLink}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Generate Link
                  </button>
                </div>
              </div>



              {psychotestParticipants.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada peserta pada tahap psikotes.</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Tambahkan peserta untuk memulai manajemen psikotes.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Peserta
                        </th>

                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status Tes
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nilai PG
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Esai
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hasil Akhir
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Aksi</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {psychotestParticipants.map((participant) => (
                        <tr key={participant.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {participant.name}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getStatusBadge(participant.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {participant.pgScore}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {participant.essayScore}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getResultBadge(participant.result)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-4" title="Lihat Detail">
                              <User className="h-5 w-5" />
                            </button>
                            {participant.status === 'Selesai' && (
                              <>
                                <button className="text-green-600 hover:text-green-900 mr-4" title="Tandai Lulus">
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                                <button className="text-red-600 hover:text-red-900" title="Tandai Tidak Lulus">
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </>
                            )}
                            {participant.status === 'Belum Mengerjakan' && (
                              <button className="text-yellow-600 hover:text-yellow-900" title="Kirim Ulang Link">
                                <Clock className="h-5 w-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {isUserSelectionModalOpen && (
            <div className="fixed inset-0 z-50 flex justify-end">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseUserSelectionModal}></div>
              <div className="relative w-full max-w-md bg-white shadow-lg h-full overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Pilih Peserta untuk Generate Link</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={handleCloseUserSelectionModal}
                  >
                    <span className="sr-only">Tutup</span>
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <Listbox value={selectedUser} onChange={setSelectedUser}>
                      {() => (
                        <>
                          <Listbox.Label className="block text-sm font-medium text-gray-700">
                            Pilih Peserta
                          </Listbox.Label>
                          <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm">
                              <span className="block truncate">
                                {selectedUser ? `${selectedUser.name} (${selectedUser.email})` : 'Pilih peserta...'}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </span>
                            </Listbox.Button>

                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {dummyUsers.map((user) => (
                                <Listbox.Option
                                  key={user.id}
                                  className={({ active }) =>
                                    clsx(
                                      active ? 'text-white bg-blue-600' : 'text-gray-900',
                                      'relative cursor-default select-none py-2 pl-3 pr-9'
                                    )
                                  }
                                  value={user}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span className={clsx(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                        {user.name} ({user.email})
                                      </span>

                                      {selected ? (
                                        <span
                                          className={clsx(
                                            active ? 'text-white' : 'text-blue-600',
                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                          )}
                                        >
                                          <Check className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        </>
                      )}
                    </Listbox>
                  </div>

                  {generatedLinkForUser && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex-1 truncate mr-4">
                        <p className="text-sm font-medium text-blue-800">Link Psikotes:</p>
                        <p className="text-sm text-blue-600 truncate">{generatedLinkForUser}</p>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(generatedLinkForUser)}
                        className="flex-shrink-0 p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                        title="Salin Link"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <button
                    className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleGenerateLinkForUser}
                  >
                    Generate Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengaturan Tipe Soal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <input
                      id="multiple-choice"
                      name="multiple-choice"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="multiple-choice" className="text-sm font-medium text-gray-700">
                      Gunakan Pilihan Ganda
                    </label>
                    <div className="flex items-center ml-auto">
                      <label htmlFor="mc-count" className="text-sm text-gray-600 mr-2">Jumlah Soal:</label>
                      <input
                        type="number"
                        id="mc-count"
                        defaultValue="8"
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      id="essay"
                      name="essay"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="essay" className="text-sm font-medium text-gray-700">
                      Gunakan Esai
                    </label>
                    <div className="flex items-center ml-auto">
                      <label htmlFor="essay-count" className="text-sm text-gray-600 mr-2">Jumlah Soal:</label>
                      <input
                        type="number"
                        id="essay-count"
                        defaultValue="2"
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Soal Pilihan Ganda</h3>
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      + Tambah Soal
                    </button>
                  </div>
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-gray-900">Belum ada soal pilihan ganda</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Soal Esai</h3>
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      + Tambah Soal
                    </button>
                  </div>
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-gray-900">Belum ada soal esai</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-6">


              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  { name: 'Total Peserta', value: '150', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
                  { name: 'Belum Mulai', value: '30', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                  { name: 'Sedang Tes', value: '20', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-100' },
                  { name: 'Lulus', value: '70', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
                  { name: 'Tidak Lulus', value: '30', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
                ].map((item) => (
                  <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 rounded-md p-3 ${item.bg}`}>
                          <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">{item.value}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPsychotest;
