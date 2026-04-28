import React from 'react';
import { FaLaptopCode, FaRocket, FaUsers } from 'react-icons/fa';

export const metadata = {
  title: "About - Techworld",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
            About TechWorld
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto drop-shadow-md">
            Innovating the future of e-commerce with cutting-edge technology and unparalleled user experience.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Core Values</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <FaLaptopCode className="text-5xl text-blue-500 mb-6" />,
              title: "Innovation",
              desc: "We leverage the latest technologies to provide a seamless and modern shopping experience.",
            },
            {
              icon: <FaUsers className="text-5xl text-purple-500 mb-6" />,
              title: "Customer First",
              desc: "Your satisfaction is our priority. We design every feature with the user in mind.",
            },
            {
              icon: <FaRocket className="text-5xl text-indigo-500 mb-6" />,
              title: "Rapid Delivery",
              desc: "Fast, reliable, and secure shipping ensures your products reach you when you need them.",
            },
          ].map((value, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-10 text-center transform hover:-translate-y-2 group"
            >
              <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              {/* Note: In a real Next.js app, consider next/image, using standard img for external placeholder simplicity */}
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                alt="Our Team" 
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Our Story</h2>
            <div className="w-20 h-1 bg-purple-600 rounded-full"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded in 2026, TechWorld started with a simple vision: to make high-quality tech products accessible to everyone. We noticed a gap in the market for a truly user-centric e-commerce platform that didn't just sell products, but provided an experience.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Today, we are proud to serve thousands of customers worldwide, offering a curated selection of the best gadgets and electronics. Our team of passionate tech enthusiasts works tirelessly to ensure that every interaction you have with TechWorld is extraordinary.
            </p>
            <button className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300 transform hover:-translate-y-1">
              Join Our Journey
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
