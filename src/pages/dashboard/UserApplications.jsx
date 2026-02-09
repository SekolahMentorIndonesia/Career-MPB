import React from 'react';
import checkDataCompleteness from '../../utils/dataCompletenessChecker';

const UserApplications = () => {
  // Mock data for profileData and documentData
  // In a real application, this data would come from a global state, context, or API calls
  const mockProfileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+62 812 3456 7890',
    domicile: 'Jakarta',
    address: 'Jl. Contoh No. 123',
    ktpAddress: 'Jl. KTP No. 456',
    nik: '1234567890123456',
    lastEducation: 'S1 Teknik Informatika',
    gpa: '3.8',
    major: 'Teknik Informatika',
    religion: 'Islam',
    height: '170',
    weight: '60',
    skills: 'React, Node.js, JavaScript',
  };

  const mockDocumentData = {
    cvFile: true, // Assuming file is uploaded
    pasFotoFile: true, // Assuming file is uploaded
    ktpFile: true, // Assuming file is uploaded
    // portofolioFile: true, // Optional
    // sertifikatFile: true, // Optional
    // paklaringFile: true, // Optional
  };

  const isDataComplete = checkDataCompleteness(mockProfileData, mockDocumentData);
  const applicationStatus = [
    {
      step: 'Registrasi',
      status: 'completed',
    },
    {
      step: 'Psikotes',
      status: 'pending',
    },
    {
      step: 'Interview',
      status: 'pending',
    },
    {
      step: 'Hasil Akhir',
      status: 'pending',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-semibold leading-tight text-green-700 bg-green-100 rounded-full">Selesai</span>;
      case 'in_progress':
        return <span className="px-2 py-1 text-xs font-semibold leading-tight text-blue-700 bg-blue-100 rounded-full">Diproses</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full">Menunggu</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Lamaran Saya</h1>
      
      {/* Placeholder for incomplete data UX note */}
      {!isDataComplete && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Data Anda Belum Lengkap!</p>
          <p>Silakan lengkapi data diri dan unggah dokumen yang diperlukan untuk melanjutkan proses lamaran.</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Lamaran Anda</h2>
        <p className="text-sm text-gray-600 mb-6">Status akan diperbarui oleh admin.</p>
        
        <div className="relative pl-8">
          {applicationStatus.map((item, index) => (
            <div key={index} className="mb-8 flex items-start">
              {/* Timeline dot and line */}
              <div className="absolute left-0 flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${
                  item.status === 'completed' ? 'bg-green-500' : 
                  item.status === 'in_progress' ? 'bg-blue-500' : 
                  'bg-gray-300'
                }`}></div>
                {index < applicationStatus.length - 1 && (
                  <div className={`w-0.5 h-full ${
                    applicationStatus[index + 1].status === 'completed' ? 'bg-green-500' : 
                    applicationStatus[index + 1].status === 'in_progress' ? 'bg-blue-500' : 
                    'bg-gray-300'
                  }`}></div>
                )}
              </div>

              {/* Content */}
              <div className="ml-6 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-medium text-gray-900">{item.step}</h3>
                  {getStatusBadge(item.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserApplications;
