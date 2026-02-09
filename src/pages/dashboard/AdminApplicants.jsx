import React, { useState } from 'react';
import { Eye, Check, X, Search, Briefcase, ChevronsUpDown, User } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import clsx from 'clsx';

const statuses = [
  'Semua Status',
  'Administrasi',
  'Psikotes',
  'Interview',
  'Diterima',
  'Ditolak',
];

const AdminApplicants = () => {
  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const handleOpenDetailModal = (applicant) => {
    setSelectedApplicant(applicant);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedApplicant(null);
  };

  const dummyApplicants = [
    {
      id: 1,
      name: 'Budi Santoso',
      email: 'budi.santoso@example.com',
      position: 'Senior Frontend Developer',
      status: 'Psikotes',
      psychotestResult: {
        score: 85,
        totalQuestions: 10,
        correctAnswers: 8,
        wrongAnswers: 2,
        questions: [
          {
            id: 1,
            question: 'Apa fungsi `useState` di React?',
            userAnswer: 'Untuk mengelola state dalam komponen fungsional.',
            correctAnswer: 'Untuk mengelola state dalam komponen fungsional.',
            isCorrect: true,
          },
          {
            id: 2,
            question: 'Apa perbedaan `let` dan `const`?',
            userAnswer: '`let` bisa diubah nilainya, `const` tidak.',
            correctAnswer: '`let` bisa diubah nilainya, `const` tidak.',
            isCorrect: true,
          },
          {
            id: 3,
            question: 'Apa itu Virtual DOM?',
            userAnswer: 'Representasi UI di memori yang disinkronkan dengan DOM asli.',
            correctAnswer: 'Representasi UI di memori yang disinkronkan dengan DOM asli.',
            isCorrect: true,
          },
          {
            id: 4,
            question: 'Bagaimana cara kerja `useEffect`?',
            userAnswer: 'Menjalankan efek samping setelah render, bisa membersihkan efek sebelumnya.',
            correctAnswer: 'Menjalankan efek samping setelah render, bisa membersihkan efek sebelumnya.',
            isCorrect: true,
          },
          {
            id: 5,
            question: 'Apa itu props drilling?',
            userAnswer: 'Meneruskan props melalui banyak komponen perantara.',
            correctAnswer: 'Meneruskan props melalui banyak komponen perantara.',
            isCorrect: true,
          },
          {
            id: 6,
            question: 'Apa itu Higher-Order Component (HOC)?',
            userAnswer: 'Fungsi yang mengambil komponen dan mengembalikan komponen baru.',
            correctAnswer: 'Fungsi yang mengambil komponen dan mengembalikan komponen baru.',
            isCorrect: true,
          },
          {
            id: 7,
            question: 'Apa itu Context API?',
            userAnswer: 'Cara untuk berbagi state antar komponen tanpa props drilling.',
            correctAnswer: 'Cara untuk berbagi state antar komponen tanpa props drilling.',
            isCorrect: true,
          },
          {
            id: 8,
            question: 'Apa itu Redux?',
            userAnswer: 'Library manajemen state untuk aplikasi JavaScript.',
            correctAnswer: 'Library manajemen state untuk aplikasi JavaScript.',
            isCorrect: true,
          },
          {
            id: 9,
            question: 'Apa itu `key` prop di React?',
            userAnswer: 'Untuk membantu React mengidentifikasi item mana yang berubah, ditambahkan, atau dihapus.',
            correctAnswer: 'Untuk membantu React mengidentifikasi item mana yang berubah, ditambahkan, atau dihapus.',
            isCorrect: true,
          },
          {
            id: 10,
            question: 'Apa itu React Router?',
            userAnswer: 'Library untuk navigasi deklaratif di aplikasi React.',
            correctAnswer: 'Library untuk navigasi deklaratif di aplikasi React.',
            isCorrect: true,
          },
        ],
      },
    },
    {
      id: 2,
      name: 'Siti Aminah',
      email: 'siti.aminah@example.com',
      position: 'Product Designer (UI/UX)',
      status: 'Administrasi',
      psychotestResult: null, // Belum psikotes
    },
    {
      id: 3,
      name: 'Joko Susilo',
      email: 'joko.susilo@example.com',
      position: 'Backend Engineer (Go)',
      status: 'Ditolak',
      psychotestResult: {
        score: 40,
        totalQuestions: 10,
        correctAnswers: 4,
        wrongAnswers: 6,
        questions: [
          {
            id: 1,
            question: 'Apa itu goroutine?',
            userAnswer: 'Fungsi yang berjalan secara independen.',
            correctAnswer: 'Fungsi yang berjalan secara independen.',
            isCorrect: true,
          },
          {
            id: 2,
            question: 'Apa itu channel di Go?',
            userAnswer: 'Mekanisme komunikasi antar goroutine.',
            correctAnswer: 'Mekanisme komunikasi antar goroutine.',
            isCorrect: true,
          },
          {
            id: 3,
            question: 'Apa perbedaan `make` dan `new`?',
            userAnswer: '`make` untuk slice, map, channel; `new` untuk alokasi memori.',
            correctAnswer: '`make` untuk slice, map, channel; `new` untuk alokasi memori.',
            isCorrect: true,
          },
          {
            id: 4,
            question: 'Apa itu interface di Go?',
            userAnswer: 'Kumpulan tanda tangan metode.',
            correctAnswer: 'Kumpulan tanda tangan metode.',
            isCorrect: true,
          },
          {
            id: 5,
            question: 'Bagaimana cara menangani error di Go?',
            userAnswer: 'Menggunakan `panic` dan `recover`.',
            correctAnswer: 'Mengembalikan nilai error sebagai nilai terakhir.',
            isCorrect: false,
          },
          {
            id: 6,
            question: 'Apa itu defer?',
            userAnswer: 'Menunda eksekusi fungsi hingga fungsi yang mengelilinginya selesai.',
            correctAnswer: 'Menunda eksekusi fungsi hingga fungsi yang mengelilinginya selesai.',
            isCorrect: true,
          },
          {
            id: 7,
            question: 'Apa itu `context` package?',
            userAnswer: 'Untuk mengelola batas waktu, pembatalan, dan nilai-nilai lintas API.',
            correctAnswer: 'Untuk mengelola batas waktu, pembatalan, dan nilai-nilai lintas API.',
            isCorrect: true,
          },
          {
            id: 8,
            question: 'Apa itu `select` statement?',
            userAnswer: 'Untuk menunggu operasi komunikasi pada beberapa channel.',
            correctAnswer: 'Untuk menunggu operasi komunikasi pada beberapa channel.',
            isCorrect: true,
          },
          {
            id: 9,
            question: 'Apa itu `init` function?',
            userAnswer: 'Fungsi yang dieksekusi sebelum `main` dan setiap kali package diimpor.',
            correctAnswer: 'Fungsi yang dieksekusi sebelum `main` dan setiap kali package diimpor.',
            isCorrect: true,
          },
          {
            id: 10,
            question: 'Apa itu `go mod`?',
            userAnswer: 'Untuk mengelola dependensi proyek Go.',
            correctAnswer: 'Untuk mengelola dependensi proyek Go.',
            isCorrect: true,
          },
        ],
      },
    },
  ];

  const applicants = dummyApplicants.filter(applicant =>
    selectedStatus === 'Semua Status' || applicant.status === selectedStatus
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Administrasi':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Administrasi</span>;
      case 'Psikotes':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Psikotes</span>;
      case 'Interview':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Interview</span>;
      case 'Diterima':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Diterima</span>;
      case 'Ditolak':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Ditolak</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Pelamar</h1>
          <p className="text-gray-600">Kelola data pelamar yang masuk.</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Cari pelamar..."
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <Listbox value={selectedStatus} onChange={setSelectedStatus}>
              {() => (
                <>
                  <ListboxButton className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm">
                    <span className="block truncate">{selectedStatus}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {statuses.map((status) => (
                      <ListboxOption
                        key={status}
                        className={({ active }) =>
                          clsx(
                            active ? 'text-white bg-blue-600' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9'
                          )
                        }
                        value={status}
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={clsx(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                              {status}
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
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </>
              )}
            </Listbox>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Pelamar
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posisi Dilamar
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-base font-medium text-gray-900">Belum ada pelamar masuk</p>
                    <p className="text-sm text-gray-500 mt-1">Pelamar akan muncul setelah mendaftar.</p>
                  </td>
                </tr>
              ) : (
                applicants.map((applicant) => (
                  <tr key={applicant.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {applicant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {applicant.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(applicant.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Lihat Detail"
                          onClick={() => handleOpenDetailModal(applicant)}
                        >
                          <User className="h-5 w-5" />
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="Setujui">
                          <Check className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Tolak">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDetailModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseDetailModal}></div>
          <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Detail Pelamar: {selectedApplicant.name}</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCloseDetailModal}
              >
                <span className="sr-only">Tutup</span>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nama</p>
                <p className="text-base text-gray-900">{selectedApplicant.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base text-gray-900">{selectedApplicant.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Posisi Dilamar</p>
                <p className="text-base text-gray-900">{selectedApplicant.position}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-base text-gray-900">{getStatusBadge(selectedApplicant.status)}</p>
              </div>

              {selectedApplicant.psychotestResult && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Hasil Psikotes</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Skor</p>
                      <p className="text-base text-gray-900">{selectedApplicant.psychotestResult.score}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Soal</p>
                      <p className="text-base text-gray-900">{selectedApplicant.psychotestResult.totalQuestions}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Jawaban Benar</p>
                      <p className="text-base text-gray-900">{selectedApplicant.psychotestResult.correctAnswers}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Jawaban Salah</p>
                      <p className="text-base text-gray-900">{selectedApplicant.psychotestResult.wrongAnswers}</p>
                    </div>
                  </div>

                  <h5 className="text-md font-medium text-gray-900 mb-2">Detail Jawaban:</h5>
                  <div className="space-y-4">
                    {selectedApplicant.psychotestResult.questions.map((q) => (
                      <div key={q.id} className="p-3 border rounded-md">
                        <p className="font-medium text-gray-800">{q.question}</p>
                        <p className="text-sm text-gray-600">
                          Jawaban Anda: <span className={clsx(q.isCorrect ? 'text-green-600' : 'text-red-600')}>{q.userAnswer}</span>
                        </p>
                        {!q.isCorrect && (
                          <p className="text-sm text-gray-600">
                            Jawaban Benar: <span className="text-green-600">{q.correctAnswer}</span>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end p-4 border-t bg-gray-50">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleCloseDetailModal}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplicants;