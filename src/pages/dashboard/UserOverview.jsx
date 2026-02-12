import React, { useState, useEffect } from 'react';
import { CheckCircle, User, FileText, Briefcase, Circle, Loader2 } from 'lucide-react';

const UserOverview = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${window.API_BASE_URL}/api/user/dashboard-summary`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const result = await response.json();
        if (result.success) {
          setSummaryData(result.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const { profile_percentage, is_profile_complete, is_document_uploaded, has_applied } = summaryData || {};

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Overview Pengguna</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {/* Card Status Profil */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between border-b-4 border-blue-500">
          <div>
            <p className="text-sm font-medium text-gray-500">Status Profil</p>
            <p className={`text-2xl font-bold ${is_profile_complete ? 'text-green-600' : 'text-orange-500'}`}>
              {profile_percentage}% {is_profile_complete ? 'Sudah Lengkap' : 'Belum Lengkap'}
            </p>
          </div>
          <User className={`w-8 h-8 ${is_profile_complete ? 'text-green-500' : 'text-orange-500'}`} />
        </div>

        {/* Card Status Dokumen */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between border-b-4 border-indigo-500">
          <div>
            <p className="text-sm font-medium text-gray-500">Status Dokumen</p>
            <p className={`text-2xl font-bold ${is_document_uploaded ? 'text-green-600' : 'text-red-500'}`}>
              {is_document_uploaded ? 'Sudah Lengkap' : 'Belum Lengkap'}
            </p>
          </div>
          <FileText className={`w-8 h-8 ${is_document_uploaded ? 'text-green-500' : 'text-red-500'}`} />
        </div>
      </div>

      {/* Langkah Selanjutnya */}
      {(!is_profile_complete || !is_document_uploaded || !has_applied) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Langkah Selanjutnya
            <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
          </h2>
          <div className="space-y-4">
            {!is_profile_complete && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 group">
                <div className="p-2 rounded-lg bg-white border text-gray-400 group-hover:border-blue-300">
                  <Circle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Lengkapi Data Diri</p>
                  <p className="text-xs text-gray-500">Identitas, Alamat, dan Pendidikan</p>
                </div>
              </div>
            )}

            {!is_document_uploaded && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 group">
                <div className="p-2 rounded-lg bg-white border text-gray-400 group-hover:border-blue-300">
                  <Circle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Upload Dokumen Wajib</p>
                  <p className="text-xs text-gray-500">CV, Pas Foto, dan KTP</p>
                </div>
              </div>
            )}

            {!has_applied && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 group">
                <div className="p-2 rounded-lg bg-white border text-gray-400 group-hover:border-blue-300">
                  <Circle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Daftar Lowongan Pekerjaan</p>
                  <p className="text-xs text-gray-500">Pilih posisi yang sesuai dengan keahlian Anda</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOverview;
