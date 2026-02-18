const checkDataCompleteness = (user) => {
  if (!user) return { percentage: 0, isProfileComplete: false, isDocumentUploaded: false };

  // Fields that determine profile completeness
  const profileFields = [
    'name', 'phone', 'nik', 'religion', 'height', 'weight',
    'birth_place', 'birth_date', 'ktp_address', 'ktp_rt', 'ktp_rw', 'ktp_kelurahan',
    'ktp_kecamatan', 'ktp_kabupaten', 'domicile_address', 'domicile_rt', 'domicile_rw',
    'domicile_kelurahan', 'domicile_kecamatan', 'domicile_kabupaten',
    'last_education', 'major', 'gpa', 'skills'
  ];

  const filledFields = profileFields.filter(field => {
    const val = user[field];
    return val !== null && val !== undefined && val !== '';
  });

  const percentage = Math.round((filledFields.length / profileFields.length) * 100);
  const isProfileComplete = filledFields.length === profileFields.length;

  // For documents, we check if mandatory ones exist
  const isDocumentUploaded = !!(user.cv_url && user.photo_url && user.ktp_url && user.ijazah_url && user.transcript_url);

  return {
    percentage,
    isProfileComplete,
    isDocumentUploaded
  };
};

export default checkDataCompleteness;
