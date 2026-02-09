import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

const PersonalDataForm = ({
  name, setName,
  email, setEmail,
  phone, setPhone,
  domicile, setDomicile,
  ktpAddress, setKtpAddress,
  nik, setNik,
  religion, setReligion,
  height, setHeight,
  weight, setWeight,
  birthPlace, setBirthPlace,
  birthDate, setBirthDate,
  ktpKelurahan, setKtpKelurahan,
  ktpKota, setKtpKota,
  ktpKabupaten, setKtpKabupaten,
  domicileKelurahan, setDomicileKelurahan,
  domicileKota, setDomicileKota,
  domicileKabupaten, setDomicileKabupaten,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="name"
            id="name"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
            placeholder="Nama Lengkap Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Nomor HP (Whatsapp)</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            name="phone"
            id="phone"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
            placeholder="+62 812 3456 7890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="nik" className="block text-sm font-semibold text-gray-700">NIK</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="nik"
            id="nik"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
            placeholder="Contoh: 60 kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">ALAMAT KTP</h3>
        <div>
          <label htmlFor="ktp-address" className="block text-sm font-semibold text-gray-700">Alamat</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              name="ktp-address"
              id="ktp-address"
              rows="3"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
              placeholder="Alamat KTP Anda"
              value={ktpAddress}
              onChange={(e) => setKtpAddress(e.target.value)}
            ></textarea>
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
              placeholder="Kelurahan sesuai KTP"
              value={ktpKelurahan}
              onChange={(e) => setKtpKelurahan(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="ktp-kota" className="block text-sm font-semibold text-gray-700">Kecamatan</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="ktp-kota"
              id="ktp-kota"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
              placeholder="Kota sesuai KTP"
              value={ktpKota}
              onChange={(e) => setKtpKota(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="ktp-kabupaten" className="block text-sm font-semibold text-gray-700">Kabupaten/Kota</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="ktp-kabupaten"
              id="ktp-kabupaten"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
              placeholder="Kabupaten sesuai KTP"
              value={ktpKabupaten}
              onChange={(e) => setKtpKabupaten(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 pb-4 mb-4"></div>

      <div>
        <label htmlFor="birth-place" className="block text-sm font-semibold text-gray-700">Tempat Lahir</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="birth-place"
            id="birth-place"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
            placeholder="Contoh: Jakarta"
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="birth-date" className="block text-sm font-semibold text-gray-700">Tanggal Lahir</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            name="birth-date"
            id="birth-date"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">ALAMAT DOMISILI</h3>
        <div>
          <label htmlFor="domicile" className="block text-sm font-semibold text-gray-700">Alamat Lengkap</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="domicile"
              id="domicile"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
              placeholder="Kota/Kabupaten Domisili Anda"
              value={domicile}
              onChange={(e) => setDomicile(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="domicile-kelurahan" className="block text-sm font-semibold text-gray-700">Kelurahan</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="domicile-kelurahan"
              id="domicile-kelurahan"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
              placeholder="Kelurahan domisili"
              value={domicileKelurahan}
              onChange={(e) => setDomicileKelurahan(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="domicile-kota" className="block text-sm font-semibold text-gray-700">Kecamatan</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="domicile-kota"
              id="domicile-kota"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
              placeholder="Kota domisili"
              value={domicileKota}
              onChange={(e) => setDomicileKota(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="domicile-kabupaten" className="block text-sm font-semibold text-gray-700">Kabupaten/Kota</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="domicile-kabupaten"
              id="domicile-kabupaten"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
              placeholder="Kabupaten domisili"
              value={domicileKabupaten}
              onChange={(e) => setDomicileKabupaten(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 pb-4 mb-4"></div>

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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:shadow-md transition-all duration-200 sm:text-sm"
            placeholder="Contoh: 60 kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
      </div>


    </div>
  );
};

export default PersonalDataForm;
