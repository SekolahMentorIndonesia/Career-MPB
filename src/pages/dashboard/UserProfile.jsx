import React, { useState } from 'react';
import { Save } from 'lucide-react';
import PersonalDataForm from './PersonalDataForm';
import EducationDataForm from './EducationDataForm';

const UserProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [domicile, setDomicile] = useState('');
  const [ktpAddress, setKtpAddress] = useState('');
  const [ktpKelurahan, setKtpKelurahan] = useState('');
  const [ktpKota, setKtpKota] = useState('');
  const [ktpKabupaten, setKtpKabupaten] = useState('');
  const [nik, setNik] = useState('');
  const [lastEducation, setLastEducation] = useState('');
  const [gpa, setGpa] = useState('');
  const [major, setMajor] = useState('');
  const [religion, setReligion] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [skills, setSkills] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [domicileKelurahan, setDomicileKelurahan] = useState('');
  const [domicileKota, setDomicileKota] = useState('');
  const [domicileKabupaten, setDomicileKabupaten] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name,
      email,
      phone,
      domicile,
      ktpAddress,
      ktpKelurahan,
      ktpKota,
      ktpKabupaten,
      nik,
      birthPlace,
      birthDate,
      domicileKelurahan,
      domicileKota,
      domicileKabupaten,
      lastEducation,
      gpa,
      major,
      religion,
      height,
      weight,
      skills,
    };
    console.log('Form Data Submitted:', formData);
    // Here you would typically send this data to a backend API
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profil Saya</h1>


      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">DATA DIRI</h2>
          <PersonalDataForm
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            phone={phone} setPhone={setPhone}
            domicile={domicile} setDomicile={setDomicile}
            ktpAddress={ktpAddress} setKtpAddress={setKtpAddress}
            ktpKelurahan={ktpKelurahan} setKtpKelurahan={setKtpKelurahan}
            ktpKota={ktpKota} setKtpKota={setKtpKota}
            ktpKabupaten={ktpKabupaten} setKtpKabupaten={setKtpKabupaten}
            nik={nik} setNik={setNik}
            religion={religion} setReligion={setReligion}
            height={height} setHeight={setHeight}
            weight={weight} setWeight={setWeight}
            birthPlace={birthPlace} setBirthPlace={setBirthPlace}
            birthDate={birthDate} setBirthDate={setBirthDate}
            domicileKelurahan={domicileKelurahan} setDomicileKelurahan={setDomicileKelurahan}
            domicileKota={domicileKota} setDomicileKota={setDomicileKota}
            domicileKabupaten={domicileKabupaten} setDomicileKabupaten={setDomicileKabupaten}
          />

          <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">PENDIDIKAN</h2>
          <EducationDataForm
            lastEducation={lastEducation} setLastEducation={setLastEducation}
            gpa={gpa} setGpa={setGpa}
            major={major} setMajor={setMajor}
            skills={skills} setSkills={setSkills}
          />
          <p className="text-sm font-bold text-rose-500 mt-4">*Semua data wajib diisi sebelum melamar pekerjaan</p>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-5 w-5 mr-2" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
