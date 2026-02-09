import React from 'react';
import { Camera } from 'lucide-react';

const AdminProfile = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-gray-600">Lengkapi data diri Anda untuk keperluan administrasi.</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {/* Placeholder for profile picture */}
            <img
              className="h-full w-full object-cover"
              src="https://via.placeholder.com/150" // Replace with actual image or user's avatar
              alt="Profile"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Foto Profil</h3>
            <p className="mt-1 text-sm text-gray-500">
              Unggah foto profil terbaru Anda. Format: JPG, PNG, atau WEBP. Maksimal 2MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Nama Lengkap *</label>
            <div className="mt-1">
              <input
                type="text"
                name="full-name"
                id="full-name"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Sarah Amalia"
              />
            </div>
          </div>
          <div>
            <label htmlFor="nik" className="block text-sm font-medium text-gray-700">NIK (KTP) *</label>
            <div className="mt-1">
              <input
                type="text"
                name="nik"
                id="nik"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="16 digit NIK"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="admin@mpb.group"
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">No HP / WhatsApp *</label>
            <div className="mt-1">
              <input
                type="text"
                name="phone-number"
                id="phone-number"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat Lengkap *</label>
            <div className="mt-1">
              <textarea
                id="address"
                name="address"
                rows="3"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Masukkan alamat lengkap sesuai KTP"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;