import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/doctor/all`,
          {
            withCredentials: true,
          }
        );
        const allDoctors = res.data.doctors || [];
        setDoctors(allDoctors);
        setFilteredDoctors(allDoctors);

        const uniqueDepartments = [
          'All',
          ...new Set(allDoctors.map((doc) => doc.department)),
        ];
        setDepartments(uniqueDepartments);
      } catch (error) {
        toast.error('Failed to load doctors.');
      }
    };

    fetchDoctors();
  }, []);

  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    if (dept === 'All') {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter((doc) => doc.department === dept));
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 py-24 px-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Our Doctors
      </h1>

      {/* Department Filter */}
      <div className="mb-6 flex justify-center">
        <select
          value={selectedDept}
          onChange={handleDepartmentChange}
          className="px-4 py-2 border border-blue-300 rounded-lg shadow bg-white text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
          {departments.map((dept, idx) => (
            <option key={idx} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-blue-50 rounded-xl shadow hover:shadow-lg p-6 transition duration-300 border border-blue-100 flex flex-col items-center text-center">
            {/* Profile Image */}
            <img
              src={doctor.profileImage || 'https://i.pravatar.cc/150?img=12'}
              alt="Doctor Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 mb-4"
            />

            {/* Doctor Details */}
            <h2 className="text-xl font-semibold text-blue-600 mb-1">
              Dr. {doctor.firstName} {doctor.lastName}
            </h2>
            <p className="text-gray-600 mb-1">
              <strong>Department:</strong> {doctor.department}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Email:</strong> {doctor.email}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Phone:</strong> {doctor.phone}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Consultation Fee:</strong> {doctor.consultationFee}
            </p>

            {/* View Profile Button */}
            <button className="bg-blue-600 text-white py-2 px-4 rounded-full text-sm hover:bg-orange-500">
              View Profile
            </button>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No doctors found in this department.
        </p>
      )}
    </div>
  );
};

export default DoctorsList;
