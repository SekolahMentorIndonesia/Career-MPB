import { useAuth } from '../../context/AuthContext';
import { Building, Mail, Phone, MapPin } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profil Perusahaan</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Informasi HR</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Detail akun dan preferensi.</p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
              {user?.name?.charAt(0) || 'H'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500">{user?.role}</p>
            </div>
          </div>
          
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Telepon
              </dt>
              <dd className="mt-1 text-sm text-gray-900">+62 812 3456 7890</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Building className="w-4 h-4" /> Departemen
              </dt>
              <dd className="mt-1 text-sm text-gray-900">Human Resources Department</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Lokasi Kantor</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <p className="text-gray-600">
              Jl. Jendral Sudirman No. Kav 52-53,<br />
              Senayan, Kebayoran Baru,<br />
              Jakarta Selatan 12190
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
