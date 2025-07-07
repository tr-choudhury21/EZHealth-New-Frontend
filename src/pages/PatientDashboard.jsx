import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusColor = {
    Confirmed: 'text-green-600 bg-green-100',
    Pending: 'text-yellow-600 bg-yellow-100',
    Cancelled: 'text-red-600 bg-red-100',
    Rejected: 'text-red-600 bg-red-100',
    Accepted: 'text-green-600 bg-green-100',
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        'https://ezhealth-server.onrender.com/api/v1/user/patient/profile',
        {
          withCredentials: true,
        }
      );
      const { profile, appointments, prescriptions } = res.data;
      setProfile(profile);
      setAppointments(appointments);
      setPrescriptions(prescriptions);
    } catch (err) {
      toast.error('Failed to load patient data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const cancelAppointment = async (appointmentId) => {
    try {
      await axios.put(
        `https://ezhealth-server.onrender.com/api/v1/appointment/${appointmentId}/cancel`,
        {},
        { withCredentials: true }
      );
      toast.success('Appointment cancelled.');
      fetchProfile(); // refresh dashboard
    } catch (err) {
      toast.error('Could not cancel appointment.');
    }
  };

  const totalAppointments = appointments.length;
  const upcomingAppointments = appointments.filter(
    (a) => a.status !== 'Cancelled' && new Date(a.date) >= new Date()
  ).length;
  const prescriptionCount = prescriptions.length;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6 my-5">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Patient Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl  font-semibold text-blue-600 mb-4">Profile</h2>
          <p>
            <strong>Name:</strong> {profile.firstName} {profile.lastName}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Age:</strong> {profile.age}
          </p>
          <p>
            <strong>Gender:</strong> {profile.gender}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="text-blue-600 font-semibold text-lg">
            Total Appointments
          </h3>
          <p className="text-2xl font-bold">{totalAppointments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="text-blue-600 font-semibold text-lg">Upcoming</h3>
          <p className="text-2xl font-bold">{upcomingAppointments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="text-blue-600 font-semibold text-lg">Prescriptions</h3>
          <p className="text-2xl font-bold">{prescriptionCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Appointments */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
            Appointments
          </h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments booked.</p>
          ) : (
            <div className="max-h-[360px] overflow-y-auto pr-2">
              <ul className="space-y-4">
                {appointments.map((appt) => (
                  <li
                    key={appt.appointmentId}
                    className="border rounded-lg p-4 flex justify-between items-start">
                    <div>
                      <p>
                        <strong>Doctor:</strong> {appt.doctorName}
                      </p>
                      <p>
                        <strong>Department:</strong> {appt.department}
                      </p>
                      <p>
                        <strong>Date:</strong>{' '}
                        {new Date(appt.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p>
                        <strong>Time:</strong>{' '}
                        {appt.time?.replace(
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
                    <div className="text-center space-y-2">
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full block ${
                          statusColor[appt.status] ||
                          'bg-gray-200 text-gray-600'
                        }`}>
                        {appt.status}
                      </span>
                      {appt.status === 'Accepted' && appt.meetingLink && (
                        <a
                          href={appt.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition duration-200">
                          🔗 Join Meeting
                        </a>
                      )}
                      {(appt.status === 'Pending' ||
                        appt.status === 'Confirmed') && (
                        <button
                          onClick={() => cancelAppointment(appt.appointmentId)}
                          className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                          Cancel
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Prescriptions */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-3">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
            Medication & Prescriptions
          </h2>
          {prescriptions.length === 0 ? (
            <p className="text-gray-500">No prescriptions available.</p>
          ) : (
            <ul className="space-y-4">
              {prescriptions.map((presc, idx) => (
                <li key={idx} className="border rounded-lg p-4">
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(presc.issuedAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {presc.doctorName}
                  </p>
                  <p>
                    <strong>Medications:</strong> {presc.medications.join(', ')}
                  </p>
                  <p>
                    <strong>Instructions:</strong> {presc.notes}
                  </p>
                  {presc.fileUrl && (
                    <a
                      href={presc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline mt-2 inline-block">
                      View Prescription File
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
