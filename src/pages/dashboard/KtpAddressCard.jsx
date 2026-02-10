import React from 'react';
import { MapPin } from 'lucide-react';

const KtpAddressCard = ({
  isEditing,
  ktpAddress, setKtpAddress,
  ktpRt, setKtpRt,
  ktpRw, setKtpRw,
  ktpKelurahan, setKtpKelurahan,
  ktpKecamatan, setKtpKecamatan,
  ktpKabupaten, setKtpKabupaten,
  missingFields = []
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">ALAMAT KTP</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="ktp-address" className={`block text-sm font-semibold mb-1 ${missingFields.includes('ktp_address') ? 'text-rose-600' : 'text-gray-700'}`}>
            Alamat {missingFields.includes('ktp_address') && <span className="text-[10px] ml-1 font-bold bg-rose-100 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Wajib Diisi</span>}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              name="ktp-address"
              id="ktp-address"
              rows="3"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? (missingFields.includes('ktp_address') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500")
                : (missingFields.includes('ktp_address') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              placeholder="Alamat KTP Anda"
              value={ktpAddress}
              onChange={(e) => setKtpAddress(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="ktp-rt" className="block text-sm font-semibold text-gray-700">RT</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="ktp-rt"
                id="ktp-rt"
                maxLength="5"
                className={`block w-full px-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                  ? "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500"
                  : "border-transparent bg-gray-50/30 text-gray-700 cursor-default"
                  }`}
                disabled={!isEditing}
                placeholder="RT"
                value={ktpRt}
                onChange={(e) => setKtpRt(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="ktp-rw" className="block text-sm font-semibold text-gray-700">RW</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="ktp-rw"
                id="ktp-rw"
                maxLength="5"
                className={`block w-full px-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                  ? "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500"
                  : "border-transparent bg-gray-50/30 text-gray-700 cursor-default"
                  }`}
                disabled={!isEditing}
                placeholder="RW"
                value={ktpRw}
                onChange={(e) => setKtpRw(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="ktp-kelurahan" className="block text-sm font-semibold text-gray-700">Kelurahan</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="ktp-kelurahan"
              id="ktp-kelurahan"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500"
                : "border-transparent bg-gray-50/30 text-gray-700 cursor-default"
                }`}
              disabled={!isEditing}
              placeholder="Kelurahan sesuai KTP"
              value={ktpKelurahan}
              onChange={(e) => setKtpKelurahan(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="ktp-kecamatan" className="block text-sm font-semibold text-gray-700">Kecamatan</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="ktp-kecamatan"
              id="ktp-kecamatan"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500"
                : "border-transparent bg-gray-50/30 text-gray-700 cursor-default"
                }`}
              disabled={!isEditing}
              placeholder="Kecamatan sesuai KTP"
              value={ktpKecamatan}
              onChange={(e) => setKtpKecamatan(e.target.value)}
            />
          </div>
        </div>



        <div>
          <label htmlFor="ktp-kabupaten" className={`block text-sm font-semibold mb-1 ${missingFields.includes('ktp_kabupaten') ? 'text-rose-600' : 'text-gray-700'}`}>
            Kabupaten/Kota {missingFields.includes('ktp_kabupaten') && <span className="text-[10px] ml-1 font-bold bg-rose-100 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Wajib Diisi</span>}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="ktp-kabupaten"
              id="ktp-kabupaten"
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200 sm:text-sm ${isEditing
                ? (missingFields.includes('ktp_kabupaten') ? "border-rose-300 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500" : "border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500")
                : (missingFields.includes('ktp_kabupaten') ? "border-rose-200 bg-rose-50/5 text-gray-700 cursor-default" : "border-transparent bg-gray-50/30 text-gray-700 cursor-default")
                }`}
              disabled={!isEditing}
              placeholder="Kabupaten/Kota sesuai KTP"
              value={ktpKabupaten}
              onChange={(e) => setKtpKabupaten(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KtpAddressCard;
