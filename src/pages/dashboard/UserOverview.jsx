import React from 'react';
import { CheckCircle, XCircle, Clock, User, FileText } from 'lucide-react';
import checkDataCompleteness from '../../utils/dataCompletenessChecker';

const UserOverview = () => {
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

  // Use checkDataCompleteness to determine the status
  const { isProfileComplete, isDocumentUploaded } = checkDataCompleteness(mockProfileData, mockDocumentData);

  const hasApplied = false;

  // In a real application, these states would be determined by actual data from backend or context
  // For now, they are hardcoded for demonstration purposes.
  // You would fetch user profile data, document upload status, and application status
  // and update these states accordingly.

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Overview Pengguna</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card Status Profil */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Status Profil</p>
            <p className="text-2xl font-semibold text-gray-900">{isProfileComplete ? 'Lengkap' : 'Belum Lengkap'}</p>
          </div>
          {isProfileComplete ? <CheckCircle className="w-8 h-8 text-green-500" /> : <XCircle className="w-8 h-8 text-red-500" />}
        </div>

        {/* Card Status Dokumen */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Status Dokumen</p>
            <p className="text-2xl font-semibold text-gray-900">{isDocumentUploaded ? 'Sudah Diunggah' : 'Belum Diunggah'}</p>
          </div>
          {isDocumentUploaded ? <CheckCircle className="w-8 h-8 text-green-500" /> : <XCircle className="w-8 h-8 text-red-500" />}
        </div>

        {/* Card Status Lamaran */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Status Lamaran</p>
            <p className="text-2xl font-semibold text-gray-900">{hasApplied ? 'Sudah Melamar' : 'Belum Melamar'}</p>
          </div>
          {hasApplied ? <CheckCircle className="w-8 h-8 text-green-500" /> : <XCircle className="w-8 h-8 text-red-500" />}
        </div>
      </div>

      {/* Checklist Onboarding */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Checklist Onboarding</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox text-blue-600 rounded" checked={isProfileComplete} disabled />
            Lengkapi data diri
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox text-blue-600 rounded" checked={isDocumentUploaded} disabled />
            Upload dokumen
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox text-blue-600 rounded" checked={hasApplied} disabled />
            Daftar lowongan
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserOverview;
