// src/pages/Contact.tsx

import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useTheme } from "../components/ui/ThemeProvider.tsx";

import { contactService } from '../services/contactService';

import contactHeroLight from '../assets/images/contact-us-light.png';
import contactHeroDark from '../assets/images/contact-us-dark.png';
import { Helmet } from 'react-helmet-async';

/* ========================================
   SEO Constants
======================================== */
const SITE_URL = 'https://www.microlineindia.in';
const PAGE_URL = `${SITE_URL}/contact`;
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface ContactProps {
  onNavigate: (page: string) => void;
}

export default function Contact({ onNavigate }: ContactProps) {

  const { isDarkMode } = useTheme();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [turnstileToken, setTurnstileToken] =
    useState<string | null>(null);

  const [loadedAt] = useState(Date.now());

  // Google Maps embed URL
  const mapSrc =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.0611614284185!2d88.37951717829274!3d22.464335826888878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02719f1f67499b%3A0x4403e37013f04bc6!2s27%2C%20Harimati%20Sarani%2C%20Barhans%2C%20Garia%2C%20Kolkata%2C%20West%20Bengal%20700084%2C%20India!5e0!3m2!1sen!2sus!4v1778250086506!5m2!1sen!2sus';

    /* ========================================
     Structured Data (JSON-LD)
  ======================================== */
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Microline India',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/favicon-96x96.png`,
        },
        description:
          'Leading Indian manufacturer of RF & Microwave systems, antenna measurement systems, microwave laboratory setups, and waveguide components.',
        foundingDate: '1997',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '27 Harimati Sarani, Garia',
          addressLocality: 'Kolkata',
          addressRegion: 'West Bengal',
          postalCode: '700084',
          addressCountry: 'IN',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+91-98747-90272',
            contactType: 'sales',
          },
          {
            '@type': 'ContactPoint',
            telephone: '+91-87773-84302',
            contactType: 'customer service',
          },
          {
            '@type': 'ContactPoint',
            telephone: '+91-33-79620301',
            contactType: 'customer support',
          },
        ],
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Microline India',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'ContactPage',
        '@id': `${PAGE_URL}/#contactpage`,
        url: PAGE_URL,
        name: 'Contact Us | Microline India',
        description:
          'Contact Microline India for RF & microwave systems, antenna measurement solutions, laboratory setups, and waveguide components. Reach us by phone, email, or visit our Kolkata office.',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${PAGE_URL}/#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Contact Us', item: PAGE_URL },
        ],
      },
    ],
  };
  
    // ======================
  // Submit Handler
  // ======================

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError('');

    if (!turnstileToken) {
      setError('Please complete the security verification.');
      return;
    }

    try {

      setLoading(true);

      await contactService.submitForm({
        ...form,

        // Honeypot
        website: '',

        // Timing protection
        loadedAt,

        // Turnstile token
        'cf-turnstile-response': turnstileToken,
      });

      setSubmitted(true);

      // Reset form
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

    } catch (err: any) {

      console.error(err);

      setError(
        err?.response?.data?.error ||
        'Failed to send message.'
      );

    } finally {

      setLoading(false);

    }
  };

    return (
    <>
      {/* ========================================
         SEO Meta Tags
      ======================================== */}
      <Helmet prioritizeSeoTags>
        <title>Contact Us | Microline India</title>
        <meta
          name="description"
          content="Contact Microline India for RF & microwave systems, antenna measurement solutions, laboratory setups, and waveguide components. Reach us by phone, email, or visit our Kolkata office."
        />
        <meta
          name="keywords"
          content="contact Microline India, RF microwave supplier contact, antenna testing company India, microwave lab manufacturer contact, waveguide components contact, Kolkata RF company, Microline phone email"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PAGE_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Microline India" />
        <meta property="og:title" content="Contact Us | Microline India" />
        <meta
          property="og:description"
          content="Contact Microline India for RF & microwave systems, antenna measurement solutions, laboratory setups, and waveguide components."
        />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Microline India" />
        <meta
          name="twitter:description"
          content="Contact Microline India for RF & microwave systems, antenna measurement solutions, laboratory setups, and waveguide components."
        />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
    
    <main className="pt-navbar">

      {/* Hero */}
      <div className="page-hero bg-gradient-dark">

        <div
          className="page-hero-overlay"
          style={{
            backgroundImage: `url(${isDarkMode ? contactHeroDark : contactHeroLight})`
          }}
        />

        <div className="container position-relative z-1">

          <div className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs">
            <button
              onClick={() => onNavigate('home')}
              className="breadcrumb-link text-info"
            >
              HOME
            </button>

            <span className="text-white" style={{ opacity: 0.5 }}>
              /
            </span>

            <span className="text-gold">
              CONTACT US
            </span>
          </div>

          <h1 className="text-white fs-2xl fw-900">
            Contact Us
          </h1>

        </div>
      </div>

      {/* Content */}
      <div className="section py-5">

        <h2 className="section-title text-center">
          Get <span className="text-accent">In Touch</span>
        </h2>

        <div className="container">

          <div className="grid grid-cols-2 gap-5">

            {/* LEFT SIDE */}
            <div>

              <p className="text-secondary mb-4">
                We are always happy to help you.
                Reach out to us for any inquiries,
                quotes or collaborations.
              </p>

              <div className="d-flex flex-column gap-3 mb-4">

                {/* Phone */}
                <div className="contact-info-card">

                  <div className="contact-info-icon">
                    <i className="fas fa-phone"></i>
                  </div>

                  <div>
                    <p className="fw-700 text-accent fs-xs mb-1">
                      Phone / Mobile
                    </p>

                    <p className="text-secondary fs-sm">
                      +91 98747 90272 / +91 87773 84302
                    </p>

                    <p className="text-secondary fs-sm">
                      Landline: 033-79620301
                    </p>
                  </div>

                </div>

                {/* Email */}
                <div className="contact-info-card">

                  <div className="contact-info-icon">
                    <i className="fas fa-envelope"></i>
                  </div>

                  <div>

                    <p className="fw-700 text-accent fs-xs mb-1">
                      Email
                    </p>

                    <p className="text-secondary fs-sm">
                      info@microlineindia.in
                    </p>

                    <p className="text-secondary fs-sm">
                      microlineindia@gmail.com
                    </p>

                  </div>

                </div>

                {/* Address */}
                <div className="contact-info-card">

                  <div className="contact-info-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>

                  <div>

                    <p className="fw-700 text-accent fs-xs mb-1">
                      Address
                    </p>

                    <p className="text-secondary fs-sm">
                      Microline India
                      <br />
                      27 Harimati Sarani, Garia
                      <br />
                      Kolkata - 700084, West Bengal, India
                    </p>

                  </div>

                </div>

              </div>

              {/* Map */}
              <div className="map-container">

                <iframe
                  src={mapSrc}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location"
                />

              </div>

            </div>

            {/* RIGHT SIDE */}
            <div>

              {submitted ? (

                <div className="text-center py-5">

                  <i className="fas fa-check-circle text-accent fs-4xl mb-3"></i>

                  <h3 className="fs-2xl fw-900 mb-2 text-soft">
                    Message Sent!
                  </h3>

                  <p className="text-secondary mb-4">
                    Thank you for reaching out.
                    We will get back to you soon.
                  </p>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-outline"
                  >
                    Send Another Message
                  </button>

                </div>

              ) : (

                <form onSubmit={handleSubmit}>

                  <h3 className="fw-900 mb-4 text-soft">
                    Send a Message
                  </h3>

                  {/* Name + Email */}
                  <div className="grid grid-cols-2 gap-4 mb-4">

                    <div>

                      <label className="form-label">
                        Your Name
                      </label>

                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            name: e.target.value
                          })
                        }
                        className="form-input"
                        placeholder="John Doe"
                      />

                    </div>

                    <div>

                      <label className="form-label">
                        Email Address
                      </label>

                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            email: e.target.value
                          })
                        }
                        className="form-input"
                        placeholder="john@example.com"
                      />

                    </div>

                  </div>

                  {/* Phone */}
                  <div className="mb-4">

                    <label className="form-label">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value
                        })
                      }
                      className="form-input"
                      placeholder="+91 XXXXX XXXXX"
                    />

                  </div>

                  {/* Subject */}
                  <div className="mb-4">

                    <label className="form-label">
                      Subject
                    </label>

                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          subject: e.target.value
                        })
                      }
                      className="form-input"
                      placeholder="Product inquiry / Quote request"
                    />

                  </div>

                  {/* Message */}
                  <div className="mb-4">

                    <label className="form-label">
                      Your Message
                    </label>

                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          message: e.target.value
                        })
                      }
                      className="form-input"
                      placeholder="Describe your requirements..."
                    />

                  </div>

                  {/* Error */}
                  {error && (
                    <div
                      className="mb-4 p-3"
                      style={{
                        background: 'rgba(255,0,0,0.1)',
                        border: '1px solid rgba(255,0,0,0.3)',
                        borderRadius: '10px',
                        color: '#ff6b6b'
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Turnstile */}
                  <div className="mb-4">

                    <Turnstile
                      siteKey={
                        import.meta.env.VITE_TURNSTILE_SITE_KEY
                      }
                      onSuccess={(token) => {
                        setTurnstileToken(token);
                      }}
                    />

                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                  >

                    {loading ? 'Sending...' : 'Send Message'}

                    {!loading && (
                      <i className="fas fa-paper-plane fs-md"></i>
                    )}

                  </button>

                </form>

              )}

            </div>

          </div>

        </div>

      </div>

    </main>
    </>
  );
}