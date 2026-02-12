import React from 'react';
import { MapPin } from 'lucide-react';

const DomicileAddressCard = ({
  isEditing,
  domicile, setDomicile,
  domicileRt, setDomicileRt,
  domicileRw, setDomicileRw,
  domicileKelurahan, setDomicileKelurahan,
  domicileKecamatan, setDomicileKecamatan,
  domicileKabupaten, setDomicileKabupaten,
  missingFields = []
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">ALAMAT DOMISILI</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="domicile" className={`block text-sm font-semibold mb-1 ${missingFields.includes('domicile_address') ? 'text-rose-600' : 'text-gray-700'}`}>
            Alamat Lengkap
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="domicile"
              id="domicile"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? (missingFields.includes('domicile_address') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500")
                : (missingFields.includes('domicile_address') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              placeholder="Alamat domisili lengkap"
              value={domicile}
              onChange={(e) => setDomicile(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="domicile-rt" className={`block text-sm font-semibold mb-1 ${missingFields.includes('domicile_rt') ? 'text-rose-600' : 'text-gray-700'}`}>
              RT
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="domicile-rt"
                id="domicile-rt"
                maxLength="5"
                className={`block w-full px-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                  ? (missingFields.includes('domicile_rt') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500")
                  : (missingFields.includes('domicile_rt') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                  }`}
                disabled={!isEditing}
                placeholder="RT"
                value={domicileRt}
                onChange={(e) => setDomicileRt(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="domicile-rw" className={`block text-sm font-semibold mb-1 ${missingFields.includes('domicile_rw') ? 'text-rose-600' : 'text-gray-700'}`}>
              RW
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="domicile-rw"
                id="domicile-rw"
                maxLength="5"
                className={`block w-full px-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                  ? (missingFields.includes('domicile_rw') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500")
                  : (missingFields.includes('domicile_rw') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                  }`}
                disabled={!isEditing}
                placeholder="RW"
                value={domicileRw}
                onChange={(e) => setDomicileRw(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="domicile-kelurahan" className={`block text-sm font-semibold mb-1 ${missingFields.includes('domicile_kelurahan') ? 'text-rose-600' : 'text-gray-700'}`}>
            Kelurahan
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="domicile-kelurahan"
              id="domicile-kelurahan"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? (missingFields.includes('domicile_kelurahan') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500")
                : (missingFields.includes('domicile_kelurahan') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              placeholder="Kelurahan domisili"
              value={domicileKelurahan}
              onChange={(e) => setDomicileKelurahan(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="domicile-kecamatan" className={`block text-sm font-semibold mb-1 ${missingFields.includes('domicile_kecamatan') ? 'text-rose-600' : 'text-gray-700'}`}>
            Kecamatan
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="domicile-kecamatan"
              id="domicile-kecamatan"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? (missingFields.includes('domicile_kecamatan') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500")
                : (missingFields.includes('domicile_kecamatan') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              placeholder="Kecamatan domisili"
              value={domicileKecamatan}
              onChange={(e) => setDomicileKecamatan(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="domicile-kabupaten" className={`block text-sm font-semibold mb-1 ${missingFields.includes('domicile_kabupaten') ? 'text-rose-600' : 'text-gray-700'}`}>
            Kabupaten/Kota
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="domicile-kabupaten"
              id="domicile-kabupaten"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? (missingFields.includes('domicile_kabupaten') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500")
                : (missingFields.includes('domicile_kabupaten') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              placeholder="Kabupaten/Kota domisili"
              value={domicileKabupaten}
              onChange={(e) => setDomicileKabupaten(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomicileAddressCard;
