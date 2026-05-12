// src/pages/Contact.tsx
import { useState } from 'react';

interface ContactProps {
  onNavigate: (page: string) => void;
}

export default function Contact({ onNavigate }: ContactProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Google Maps embed URL (Kolkata, West Bengal)
  const mapSrc =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.0611614284185!2d88.37951717829274!3d22.464335826888878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02719f1f67499b%3A0x4403e37013f04bc6!2s27%2C%20Harimati%20Sarani%2C%20Barhans%2C%20Garia%2C%20Kolkata%2C%20West%20Bengal%20700084%2C%20India!5e0!3m2!1sen!2sus!4v1778250086506!5m2!1sen!2sus';

return (
    <div className="pt-navbar">
      {/* Hero */}
      <div className="page-hero bg-gradient-dark">
        <div
          className="page-hero-overlay"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1200')" }}
        />
        <div className="container position-relative z-1">
          <p className="fs-xs text-accent-light text-uppercase mb-2 ls-1">
            <button onClick={() => onNavigate('home')} className="breadcrumb-link">Home</button>
            {' / Contact Us'}
          </p>
          <h1 className="text-white fs-2xl fw-900">Contact Us</h1>
        </div>
      </div>

      {/* Content */}
      <div className="section py-5">
        <h2 className="section-title text-center">
                Get <span className="text-accent">In Touch</span>
              </h2>
        <div className="container">
          <div className="grid grid-cols-2 gap-5">
            {/* Left: Info + Map */}
            <div>

  <p className="text-secondary mb-4">
    We are always happy to help you. Reach out to us for any inquiries, quotes or collaborations.
  </p>

  <div className="d-flex flex-column gap-3 mb-4">
    {/* Phone */}
    <div className="contact-info-card">
      <div className="contact-info-icon"><i className="fas fa-phone"></i></div>
      <div>
        <p className="fw-700 text-accent fs-xs mb-1">Phone / Mobile</p>
        <p className="text-secondary fs-sm">+91 98747 90272 / +91 87773 84302</p>
        <p className="text-secondary fs-sm">Landline: 033-79620301</p>
      </div>
    </div>

    {/* Email */}
    <div className="contact-info-card">
      <div className="contact-info-icon"><i className="fas fa-envelope"></i></div>
      <div>
        <p className="fw-700 text-accent fs-xs mb-1">Email</p>
        <p className="text-secondary fs-sm">info@microlineindia.in</p>
        <p className="text-secondary fs-sm">microlineindia@gmail.com</p>
      </div>
    </div>

    {/* Address */}
    <div className="contact-info-card">
      <div className="contact-info-icon"><i className="fas fa-map-marker-alt"></i></div>
      <div>
        <p className="fw-700 text-accent fs-xs mb-1">Address</p>
        <p className="text-secondary fs-sm">
          Microline India<br />
          27 Harimati Sarani, Garia<br />
          Kolkata - 700084, West Bengal, India
        </p>
      </div>
    </div>
  </div>

  <div className="map-container">
    <iframe src={mapSrc} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location" />
  </div>
</div>

            {/* Right: Form */}
            <div>
              {submitted ? (
                <div className="text-center py-5">
                  <i className="fas fa-check-circle text-accent fs-4xl mb-3"></i>
                  <h3 className="fs-2xl fw-900 mb-2 text-soft">Message Sent!</h3>
                  <p className="text-secondary mb-4">Thank you for reaching out...</p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-outline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="fw-900 mb-4 text-soft">Send a Message</h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="form-label">Your Name</label>
                      <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="form-label">Email Address</label>
                      <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="form-input" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="form-input" placeholder="+91 XXXXX XXXXX" />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Subject</label>
                    <input type="text" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="form-input" placeholder="Product inquiry / Quote request" />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Your Message</label>
                    <textarea rows={5} required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="form-input" placeholder="Describe your requirements..." />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                    Send Message <i className="fas fa-paper-plane fs-md"></i>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}