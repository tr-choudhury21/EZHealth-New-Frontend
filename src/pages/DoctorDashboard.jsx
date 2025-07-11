import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaSave } from 'react-icons/fa';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDoctorData = async () => {
    try {
      const profileRes = await axios.get(
        'https://ez-health-server.vercel.app/api/v1/doctor/me',
        { withCredentials: true }
      );
      setDoctor(profileRes.data.doctor);
      setFormData(profileRes.data.doctor);

      const apptRes = await axios.get(
        'https://ez-health-server.vercel.app/api/v1/appointment/',
        { withCredentials: true }
      );

      setAppointments(apptRes.data.appointments);
      setFilteredAppointments(apptRes.data.appointments);
    } catch (err) {
      toast.error('Failed to load doctor data');
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const handleEditToggle = () => setEditMode(!editMode);

  const handleSave = async () => {
    try {
      await axios.put(
        'https://ez-health-server.vercel.app/api/v1/doctor/edit',
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success('Profile updated successfully');
      setEditMode(false);
      fetchDoctorData();
    } catch (err) {
      toast.error('Profile update failed');
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `https://ez-health-server.vercel.app/api/v1/appointment/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(`Appointment marked as ${newStatus}`);
      fetchDoctorData();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setFilteredAppointments(
      status === 'All'
        ? appointments
        : appointments.filter((a) => a.status === status)
    );
  };

  const getCountdownText = (apptDate, apptTime) => {
    if (!apptDate || !apptTime) return '';
    const target = new Date(`${apptDate}T${apptTime}`);
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) return '🕒 Meeting Started or Time Passed';
    const mins = Math.floor(diff / 1000 / 60) % 60;
    const hrs = Math.floor(diff / 1000 / 60 / 60);
    const days = Math.floor(hrs / 24);
    return `⏳ Starts in ${days > 0 ? `${days}d ` : ''}${hrs % 24}h ${mins}m`;
  };

  const getPreviousPatients = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(
      (a) => a.status === 'Completed' || a.appointmentDate < today
    );
  };

  const statusColors = {
    Pending: 'text-yellow-600 bg-yellow-100',
    Accepted: 'text-green-600 bg-green-100',
    Rejected: 'text-red-600 bg-red-100',
    Completed: 'text-blue-600 bg-blue-100',
  };

  if (!doctor)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Doctor Dashboard
      </h1>

      {/* Profile Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-start gap-6">
          <img
            src={doctor.profileImage || 'https://i.pravatar.cc/150?img=67'}
            alt="Doctor"
            className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-600 flex flex-wrap gap-2 items-center">
                Dr.{' '}
                {editMode ? (
                  <>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="border rounded px-2 py-1"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="border rounded px-2 py-1"
                      placeholder="Last Name"
                    />
                  </>
                ) : (
                  <>
                    {doctor.firstName} {doctor.lastName}
                  </>
                )}
              </h2>
              <button
                onClick={editMode ? handleSave : handleEditToggle}
                className={`text-sm px-4 py-2 rounded-md font-medium ${
                  editMode
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}>
                {editMode ? (
                  <FaSave className="inline mr-2" />
                ) : (
                  <FaEdit className="inline mr-2" />
                )}
                {editMode ? 'Save' : 'Edit'}
              </button>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Email:</strong>{' '}
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 ml-2"
                  />
                ) : (
                  doctor.email
                )}
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                {editMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 ml-2"
                  />
                ) : (
                  doctor.phone
                )}
              </p>
              <p>
                <strong>Department:</strong> {doctor.department}
              </p>
              <p>
                <strong>Consultation Fee:</strong>{' '}
                {editMode ? (
                  <input
                    type="text"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 ml-2"
                  />
                ) : (
                  doctor.consultationFee
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter + Appointment List */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-600">Appointments</h2>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
            {['All', 'Pending', 'Accepted', 'Rejected', 'Completed'].map(
              (status) => (
                <option key={status}>{status}</option>
              )
            )}
          </select>
        </div>

        {filteredAppointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <ul className="space-y-4">
              {filteredAppointments.map((appt) => (
                <li
                  key={appt._id}
                  className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <p>
                      <strong>Patient:</strong> {appt.patientId.firstName}{' '}
                      {appt.patientId.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {appt.patientId.email}
                    </p>
                    <p>
                      <strong>Date:</strong>{' '}
                      {new Date(appt.appointmentDate).toLocaleDateString(
                        'en-US',
                        {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                    <p>
                      <strong>Time:</strong>{' '}
                      {appt.appointmentTime?.replace(
                        /(\d{2}):(\d{2}).*/,
                        (_, hh, mm) => {
                          const hours = parseInt(hh, 10);
                          const ampm = hours >= 12 ? 'PM' : 'AM';
                          const displayHours = hours % 12 || 12;
                          return `${displayHours}:${mm} ${ampm}`;
                        }
                      )}
                    </p>
                  </div>

                  <div className="mt-3 md:mt-0 text-center space-y-2">
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full block ${
                        statusColors[appt.status] || 'bg-gray-200 text-gray-700'
                      }`}>
                      {appt.status}
                    </span>

                    {appt.status === 'Pending' && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => updateStatus(appt._id, 'Accepted')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(appt._id, 'Rejected')}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                          Reject
                        </button>
                      </div>
                    )}

                    {appt.status === 'Accepted' && (
                      <div className="space-y-2">
                        <p className="text-sm italic text-gray-500">
                          {getCountdownText(
                            appt.appointmentDate,
                            appt.appointmentTime
                          )}
                        </p>
                        {appt.meetingLink && (
                          <a
                            href={appt.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition duration-200">
                            🔗 Join Meeting
                          </a>
                        )}
                        <button
                          onClick={() => updateStatus(appt._id, 'Completed')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full w-full">
                          Completed
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Previous Patients */}
      <div className="bg-blue-100 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          Previous Patients
        </h2>
        {getPreviousPatients().length === 0 ? (
          <p className="text-gray-500">No previous patients.</p>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            <ul className="space-y-4">
              {getPreviousPatients().map((appt) => (
                <li key={appt._id} className="border rounded-lg p-4">
                  <p>
                    <strong>Patient:</strong> {appt.patientId.firstName}{' '}
                    {appt.patientId.lastName}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(appt.appointmentDate).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                  <p>
                    <strong>Status:</strong> {appt.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
