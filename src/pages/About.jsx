import React from 'react';
import about from '../assets/about.png';
import team from '../assets/whoweare.png';

const AboutUsPage = () => {
  return (
    <div className="bg-blue-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-500 to-indigo-800 text-white py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              About Us
            </h1>
            <p className="text-lg md:text-xl leading-relaxed">
              We are committed to delivering world-class healthcare services to
              our community. Our team of professionals is dedicated to ensuring
              your health and wellness.
            </p>
            <button className="bg-white text-blue-600 font-medium py-3 px-6 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300">
              Learn More
            </button>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <img
              src={about}
              alt="Hero Illustration"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="relative py-16 px-6 md:px-16 lg:px-24">
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 bg-blue-300 rounded-full w-16 h-16 opacity-40 blur-lg"></div>
        <div className="absolute bottom-20 right-10 bg-blue-400 rounded-full w-24 h-24 opacity-30 blur-lg"></div>
        <div className="absolute top-20 right-32 bg-blue-200 rounded-full w-12 h-12 opacity-50 blur-md"></div>

        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-10">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Biography Text */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-blue-600">
                Dedicated to Excellence
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our team is composed of highly qualified professionals who are
                passionate about healthcare and committed to your well-being.
                With years of experience and a patient-first approach, we
                provide compassionate and innovative care.
              </p>
              <p className="text-gray-700 leading-relaxed">
                From cutting-edge treatments to personalized medical plans, we
                strive to set the gold standard in healthcare. Join us on our
                journey toward a healthier tomorrow.
              </p>
            </div>

            {/* Biography Image */}
            <div className="relative">
              <img src={team} alt="Team" className="rounded-lg" />
              {/* Floating Decorative Images */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
