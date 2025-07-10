import { useState, useContext } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../auth.jsx';

const RegistrationPage = () => {
  const { isAuthenticated, setIsAuthenticated, setUser, setUserRole } =
    useContext(AuthContext);
  const navigateTo = useNavigate();

  const [activeTab, setActiveTab] = useState('Patient');

  // Common Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Doctor-specific Fields
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [department, setDepartment] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (activeTab === 'Doctor') {
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('gender', gender);
        formData.append('password', password);
        formData.append('specialization', specialization);
        formData.append('consultationFee', consultationFee);
        formData.append('experience', experience);
        formData.append('department', department);
        if (profilePic) formData.append('profileImage', profilePic);

        res = await axios.post(
          'https://ezhealth-server.onrender.com/api/v1/doctor/register',
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // Patient Registration
        res = await axios.post(
          'https://ezhealth-server.onrender.com/api/v1/user/patient/register',
          { firstName, lastName, email, phone, age, gender, password },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      if (res.data.success) {
        toast.success(res.data.message);
        if (activeTab === 'Doctor') {
          setIsAuthenticated(false);
          navigateTo('/login');
        } else {
          const authRes = await axios.get(
            'http://localhost:5000/api/v1/user/me',
            { withCredentials: true }
          );

          if (authRes.data.success) {
            setIsAuthenticated(true);
            setUser(authRes.data.user);
            setUserRole(authRes.data.user.role);
            navigateTo('/patient/dashboard');
          } else {
            toast.error('Failed to fetch user details after registration.');
          }
        }
      } else {
        toast.error(res.data.message || 'Registration failed.');
        return;
      }

      // Reset all fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAge('');
      setGender('');
      setPassword('');
      setSpecialization('');
      setConsultationFee('');
      setExperience('');
      setDepartment('');
      setProfilePic(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed');
    }
  };

  // if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="bg-blue-100 min-h-screen flex justify-center items-center">
      <div className="bg-blue-50 shadow-lg rounded-lg mt-24 mb-20 p-10 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Register
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab('Patient')}
            className={`px-6 py-2 rounded-l-lg ${
              activeTab === 'Patient'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-600'
            }`}>
            Patient
          </button>
          <button
            onClick={() => setActiveTab('Doctor')}
            className={`px-6 py-2 rounded-r-lg ${
              activeTab === 'Doctor'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-600'
            }`}>
            Doctor
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegistration}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* DOB */}
            {activeTab !== 'Doctor' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Age
                </label>
                <input
                  type="text"
                  value={age}
                  placeholder="Enter your age (in years)"
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Gender */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required>
                <option value="" disabled>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Doctor Fields */}
            {activeTab === 'Doctor' && (
              <>
                {/* Specialization */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g., Cardiologist"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Experience (in years)
                  </label>
                  <input
                    type="number"
                    value={experience}
                    min="0"
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g., 5"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Qualification */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g., Cardiology, Neurology"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Consultation Fee
                  </label>
                  <input
                    type="text"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    placeholder="e.g., Rs.500 (INR)"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Profile Picture */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePic(e.target.files[0])}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div className="md:col-span-2 relative">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-11 right-4 text-gray-600 hover:text-blue-500">
                {showPassword ? <IoEye /> : <IoEyeOff />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 mt-6 rounded-lg hover:bg-blue-700">
            Register as {activeTab}
          </button>

          {/* Redirect to Login */}
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
