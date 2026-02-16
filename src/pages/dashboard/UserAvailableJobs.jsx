import React from 'react';
import JobSearchSection from '../../components/JobSearchSection';

const UserAvailableJobs = () => {
    return (
        <div className="space-y-6 max-w-6xl pb-20">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Lowongan Pekerjaan</h1>
                <p className="text-sm text-gray-500 font-medium">Temukan posisi yang sesuai dengan keahlian dan aspirasi karir Anda.</p>
            </div>

            <div className="-mx-4 sm:-mx-0">
                <JobSearchSection />
            </div>
        </div>
    );
};

export default UserAvailableJobs;
