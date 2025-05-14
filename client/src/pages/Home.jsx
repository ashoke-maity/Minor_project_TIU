import React from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/home/HeroSection';
import Footer from '../components/layout/Footer';
import { FaUserGraduate, FaDonate, FaUsers, FaBullhorn } from 'react-icons/fa';

const Home = () => {
  return (
    <>
      <Header />
      <HeroSection/>
      {/* Features */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What You Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FaUserGraduate />}
              title="Alumni Directory"
              desc="Find and connect with alumni across the world by batch, branch, or interests."
              color="text-blue-600"
            />
            <FeatureCard
              icon={<FaDonate />}
              title="Donate"
              desc="Give back to support scholarships, infrastructure and student success."
              color="text-green-600"
            />
            <FeatureCard
              icon={<FaUsers />}
              title="Job & Mentorship"
              desc="Explore jobs, hire alumni or guide juniors through mentorship."
              color="text-purple-600"
            />
            <FeatureCard
              icon={<FaBullhorn />}
              title="Share Success"
              desc="Tell your story, inspire others, and showcase your journey."
              color="text-pink-600"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

const FeatureCard = ({ icon, title, desc, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
    <div className={`text-4xl mb-4 ${color}`}>{icon}</div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);

export default Home;
