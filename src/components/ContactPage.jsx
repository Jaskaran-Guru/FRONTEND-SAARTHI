import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

const ContactPage = () => {
  const { user, isAuthenticated, trackInteraction } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', phone: '', subject: '', message: '', propertyInterest: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  
  const API_BASE_URL = 'https://backend-saarthi.onrender.com/api';

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("📤 Sending Contact Data...");
      
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (data.success) {
        if (isAuthenticated && trackInteraction) trackInteraction('contact_submit', { subject: formData.subject });
        setSubmitted(true);
      } else {
        alert("❌ Failed to send message.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("Error sending message.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">✓ Message Sent!</h2>
          <p className="mb-6">We will contact you shortly.</p>
          <button onClick={() => setSubmitted(false)} className="btn-primary">Send Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-8 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required className="form-input" />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="form-input" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" required className="form-input" />
                <select name="subject" value={formData.subject} onChange={handleInputChange} required className="form-input"><option value="">Subject</option><option value="buy">Buying</option><option value="sell">Selling</option></select>
                <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Message" rows="5" required className="form-input"></textarea>
                <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Sending..." : "Send Message"}</button>
            </form>
        </div>
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default ContactPage;
