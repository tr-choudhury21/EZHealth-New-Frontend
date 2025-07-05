import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookAppointmentForm = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([
    'Cardiology',
    'Neurology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics',
  ]);

  const [doctors, setDoctors] = useState([]);
  const [consultationFee, setConsultationFee] = useState(0);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [formData, setFormData] = useState({
    department: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/doctor/all');
        setDoctors(res.data.doctors);
      } catch (err) {
        toast.error('Failed to load doctors.');
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors by department
  useEffect(() => {
    if (formData.department) {
      setFilteredDoctors(
        doctors.filter((doc) => doc.department === formData.department)
      );
    } else {
      setFilteredDoctors([]);
    }
  }, [formData.department, doctors]);

  useEffect(() => {
    const selectedDoctor = filteredDoctors.find(
      (doc) => doc._id === formData.doctorId
    );
    if (selectedDoctor) {
      setConsultationFee(selectedDoctor.consultationFee || 0);
    } else {
      setConsultationFee(0);
    }
  }, [formData.doctorId, filteredDoctors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:5000/api/v1/appointment/book',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success(res.data.message || 'Appointment booked successfully!');

      // Reset form
      setFormData({
        department: '',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
      });

      // Redirect to optional payment page
      // const { appointmentId } = res.data;
      navigate(
        `/appointment/success?appointmentId=${res.data.appointmentId}&amount=${consultationFee}`
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:5000/api/v1/appointment/book',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success(res.data.message);
      setFormData({
        department: '',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <form
        onSubmit={handleBooking}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Book an Appointment
        </h2>

        {/* Department */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Department
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled>
              Select Department
            </option>
            {departments.map((dept, i) => (
              <option key={i} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Doctor</label>
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled>
              Select Doctor
            </option>
            {filteredDoctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                Dr. {doc.firstName} {doc.lastName} ({doc.department})
              </option>
            ))}
          </select>
          {consultationFee > 0 && (
            <p className="text-blue-700 font-semibold mt-2">
              Consultation Fee: ₹{consultationFee}
            </p>
          )}
        </div>

        {/* Appointment Date */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Appointment Date
          </label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Appointment Time */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Appointment Time
          </label>
          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 mt-4 rounded-lg hover:bg-blue-700">
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointmentForm;
