import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

const PersonalDetailsCard = ({
  isEditing,
  name, setName,
  nik, setNik,
  religion, setReligion,
  height, setHeight,
  weight, setWeight,
  birthPlace, setBirthPlace,
  birthDate, setBirthDate,
  missingFields = []
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">DATA DIRI</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className={`block text-sm font-semibold mb-1 ${missingFields.includes('name') ? 'text-rose-600' : 'text-gray-700'}`}>
            Nama Lengkap {missingFields.includes('name') && <span className="text-[10px] ml-1 font-bold bg-rose-100 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Wajib Diisi</span>}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              id="name"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? (missingFields.includes('name') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500")
                : (missingFields.includes('name') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              placeholder="Nama Lengkap Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="nik" className={`block text-sm font-semibold mb-1 ${missingFields.includes('nik') ? 'text-rose-600' : 'text-gray-700'}`}>
            NIK {missingFields.includes('nik') && <span className="text-[10px] ml-1 font-bold bg-rose-100 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Wajib Diisi</span>}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="nik"
              id="nik"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? (missingFields.includes('nik') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500")
                : (missingFields.includes('nik') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              placeholder="Nomor Induk Kependudukan"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="religion" className="block text-sm font-semibold text-gray-700">Agama</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="religion"
              id="religion"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500"
                : "border-transparent bg-gray-50/30 text-gray-700 cursor-default"
                }`}
              disabled={!isEditing}
              value={religion}
              onChange={(e) => setReligion(e.target.value)}
            >
              <option value="">Pilih Agama</option>
              <option value="Islam">Islam</option>
              <option value="Protestan">Protestan</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Khonghucu">Khonghucu</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="height" className="block text-sm font-semibold text-gray-700">Tinggi Badan</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="height"
              id="height"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500"
                : "border-transparent bg-gray-50/30 text-gray-700 cursor-default"
                }`}
              disabled={!isEditing}
              placeholder="Contoh: 170 cm"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-semibold text-gray-700">Berat Badan</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="weight"
              id="weight"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500"
                : "border-transparent bg-gray-50/30 text-gray-700 cursor-default"
                }`}
              disabled={!isEditing}
              placeholder="Contoh: 60 kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="birth-place" className={`block text-sm font-semibold mb-1 ${missingFields.includes('birth_place') ? 'text-rose-600' : 'text-gray-700'}`}>
            Tempat Lahir {missingFields.includes('birth_place') && <span className="text-[10px] ml-1 font-bold bg-rose-100 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Wajib Diisi</span>}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="birth-place"
              id="birth-place"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? (missingFields.includes('birth_place') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500")
                : (missingFields.includes('birth_place') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              placeholder="Contoh: Jakarta"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="birth-date" className={`block text-sm font-semibold mb-1 ${missingFields.includes('birth_date') ? 'text-rose-600' : 'text-gray-700'}`}>
            Tanggal Lahir {missingFields.includes('birth_date') && <span className="text-[10px] ml-1 font-bold bg-rose-100 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Wajib Diisi</span>}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="birth-date"
              id="birth-date"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm disabled:text-gray-500 ${isEditing
                ? (missingFields.includes('birth_date') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white")
                : (missingFields.includes('birth_date') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsCard;
