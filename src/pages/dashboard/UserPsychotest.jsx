import React from 'react';
import { Brain, Clock, CheckCircle } from 'lucide-react';

const UserPsychotest = () => {
  const psychotestStatus = 'Belum Bisa Akses'; // Options: 'Belum Bisa Akses', 'Menunggu Link', 'Selesai'
  const isButtonDisabled = psychotestStatus !== 'Menunggu Link';

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Belum Bisa Akses':
        return <Brain className="h-6 w-6 text-gray-500" />;
      case 'Menunggu Link':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'Selesai':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <Brain className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Belum Bisa Akses':
        return 'Anda belum dapat mengakses psikotes saat ini. Harap lengkapi profil Anda atau tunggu instruksi selanjutnya.';
      case 'Menunggu Link':
        return 'Link psikotes akan segera dikirimkan kepada Anda. Mohon periksa email secara berkala.';
      case 'Selesai':
        return 'Anda telah menyelesaikan psikotes. Hasil akan segera diumumkan.';
      default:
        return 'Status psikotes tidak diketahui.';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Psikotes</h1>
        <span className="text-sm font-medium text-gray-600 bg-yellow-200 px-3 py-1 rounded-full">Mode Demo / UI Mock</span>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Status Psikotes Anda</h2>
        <div className="flex items-center space-x-4 mb-6">
          {getStatusIcon(psychotestStatus)}
          <p className="text-lg text-gray-700 font-medium">{psychotestStatus}</p>
        </div>
        <p className="text-gray-600 mb-6">{getStatusText(psychotestStatus)}</p>

        <div className="flex items-center space-x-4">
          <button
            className={`px-6 py-3 rounded-md text-white font-semibold transition-colors duration-200 ${
              isButtonDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            }`}
            disabled={isButtonDisabled}
            title={isButtonDisabled ? 'Tombol ini dinonaktifkan dalam mode demo.' : 'Mulai Psikotes'}
          >
            Mulai Psikotes
          </button>
          {isButtonDisabled && (
            <p className="text-sm text-gray-500">Tombol ini dinonaktifkan karena {psychotestStatus.toLowerCase()}.</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Informasi Tambahan</h2>
        <p className="text-gray-600">
          Halaman ini menampilkan status terkini mengenai tahapan psikotes Anda. Harap perhatikan instruksi dan jadwal yang diberikan oleh tim rekrutmen.
          Jika ada pertanyaan lebih lanjut, jangan ragu untuk menghubungi administrator.
        </p>
      </div>
    </div>
  );
};

export default UserPsychotest;
