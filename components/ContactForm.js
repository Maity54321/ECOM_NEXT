"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { submitFeedback } from '@/services/feedback.service';
import { toast } from 'react-toastify';
import { useAuth } from './AuthProvider';

export default function ContactForm() {
  const { user } = useAuth();
  const ref = useRef();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name ? user.name.split(" ")[0] : "",
        lastName: user.name ? user.name.split(" ")[1] || "" : "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const fromName = `${formData.firstName} ${formData.lastName}`.trim();
      await submitFeedback(
        fromName,
        formData.email,
        formData.subject,
        formData.message
      );
      toast.success('Feedback submitted successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // toast.error is already handled by httpService interceptor for unexpected errors, 
      // but we can add more specific handling here if needed.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:w-3/5 p-12 lg:p-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              ref={ref}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 outline-none"
              placeholder="John"
              required
              disabled={user ? true : false}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              ref={ref}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 outline-none"
              placeholder="Doe"
              disabled={user ? true : false}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            ref={ref}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 outline-none"
            placeholder="john@example.com"
            required
            disabled={user ? true : false}
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 outline-none"
            placeholder="How can we help?"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            id="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 outline-none resize-none"
            placeholder="Your message here..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <span>{loading ? 'Sending...' : 'Send Message'}</span>
          {!loading && <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />}
        </button>
      </form>
    </div>
  );
}
