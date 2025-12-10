import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
       <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-slate-400">We'd love to hear from you. Reach out to us for any queries.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-8">
                {[
                    { icon: MapPin, title: 'Head Office', details: ['123 Education Hub, Sector 62', 'Noida, Uttar Pradesh, India'] },
                    { icon: Phone, title: 'Phone', details: ['+91 98765 43210', '+91 11 2345 6789'] },
                    { icon: Mail, title: 'Email', details: ['info@sgcsc.co.in', 'support@sgcsc.co.in'] },
                ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                <Icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                {item.details.map((line, idx) => (
                                    <p key={idx} className="text-gray-600 text-sm">{line}</p>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                {success ? (
                    <div className="bg-green-50 text-green-700 p-8 rounded-lg text-center border border-green-100">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                        <p>Thank you for contacting us. We will get back to you shortly.</p>
                        <button onClick={() => setSuccess(false)} className="mt-6 text-sm font-medium text-green-700 hover:text-green-800 underline">Send another message</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                <input type="text" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input type="tel" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="+91 9876543210" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="john@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition">
                                <option>General Inquiry</option>
                                <option>Franchise Inquiry</option>
                                <option>Student Support</option>
                                <option>Verification Issue</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea required rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="How can we help you?"></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Send Message'}
                        </button>
                    </form>
                )}
            </div>
        </div>
        
        {/* Map Placeholder */}
        <div className="mt-16 bg-slate-200 rounded-xl h-96 flex items-center justify-center border border-gray-300">
            <div className="text-center text-gray-500">
                <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                <p>Google Map Integration Placeholder</p>
                <p className="text-sm">(Embed Map Iframe Here)</p>
            </div>
        </div>
      </div>
    </div>
  );
};