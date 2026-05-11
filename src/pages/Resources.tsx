import React, { useState } from 'react';

// Import all catalogue PDFs (Vite will bundle them)
import antennaSetupPdf from '../assets/catalogues/3D AUTOMATED ANTENNA RADIATION PATTERN MEASUREMENT SET UP_NEW.pdf';
import dacPdf from '../assets/catalogues/Addressable expandable voltage output DAC.pdf';
import pneumaticPdf from '../assets/catalogues/Advance Pneumatic Trainer Kit2.pdf';
import hydraulicPdf from '../assets/catalogues/Hydraulic Trainer Kit2.pdf';
import kaBandPdf from '../assets/catalogues/Ka Band 26 Ghz to 40GHz Microwave components_Microline_India.pdf';
import pcbEquipPdf from '../assets/catalogues/Microline PCB Manufacturing Equipment.pdf';
import hornAntennaPdf from '../assets/catalogues/Microline_Double_Ridged_Horn_Antenna.pdf';
import testBench2008APdf from '../assets/catalogues/Microline_Microwave Test Bench 2008A.pdf';
import testBench2008A2Pdf from '../assets/catalogues/Microwave Test Bench 2008A.pdf';
import testBench2008BPdf from '../assets/catalogues/Microwave Test Bench 2008B.pdf';
import wavePropPdf from '../assets/catalogues/MICROWAVE WAVE PROPAGATION SET UP.pdf';
import xBandPdf from '../assets/catalogues/Microwave X Band Components.pdf';
import escalatorPdf from '../assets/catalogues/Model_Escalator.pdf';

// Import local video
import microlineDacVideo from '../assets/videos/Microline DAC.mp4';

interface ResourcesProps {
  onNavigate: (page: string) => void;
}

const catalogues = [
  {
    title: '3D Automated Antenna Measurement Setup',
    type: 'PDF',
    size: '4.2 MB',
    desc: 'Complete product line catalogue with specifications.',
    url: antennaSetupPdf,
  },
  {
    title: 'Addressable Expandable Voltage Output DAC',
    type: 'PDF',
    size: '1.5 MB',
    desc: 'Details on our addressable DAC solutions.',
    url: dacPdf,
  },
  {
    title: 'Advance Pneumatic Trainer Kit',
    type: 'PDF',
    size: '2.1 MB',
    desc: 'Information on the pneumatic trainer kit.',
    url: pneumaticPdf,
  },
  {
    title: 'Hydraulic Trainer Kit',
    type: 'PDF',
    size: '2.3 MB',
    desc: 'Hydraulic trainer kit brochure.',
    url: hydraulicPdf,
  },
  {
    title: 'Ka Band 26-40 GHz Components',
    type: 'PDF',
    size: '3.5 MB',
    desc: 'Microwave components for Ka band.',
    url: kaBandPdf,
  },
  {
    title: 'PCB Manufacturing Equipment',
    type: 'PDF',
    size: '1.8 MB',
    desc: 'Equipment for PCB production.',
    url: pcbEquipPdf,
  },
  {
    title: 'Double Ridged Horn Antenna',
    type: 'PDF',
    size: '2.0 MB',
    desc: 'Specifications of our horn antenna.',
    url: hornAntennaPdf,
  },
  {
    title: 'Microwave Test Bench 2008A (Microline)',
    type: 'PDF',
    size: '1.2 MB',
    desc: 'Test bench details.',
    url: testBench2008APdf,
  },
  {
    title: 'Microwave Test Bench 2008A',
    type: 'PDF',
    size: '1.2 MB',
    desc: 'Another version of the test bench.',
    url: testBench2008A2Pdf,
  },
  {
    title: 'Microwave Test Bench 2008B',
    type: 'PDF',
    size: '1.3 MB',
    desc: 'Test bench 2008B brochure.',
    url: testBench2008BPdf,
  },
  {
    title: 'Microwave Wave Propagation Setup',
    type: 'PDF',
    size: '2.8 MB',
    desc: 'Wave propagation measurement setup.',
    url: wavePropPdf,
  },
  {
    title: 'Microwave X Band Components',
    type: 'PDF',
    size: '2.6 MB',
    desc: 'Components for X band.',
    url: xBandPdf,
  },
  {
    title: 'Model Escalator',
    type: 'PDF',
    size: '1.1 MB',
    desc: 'Escalator model details.',
    url: escalatorPdf,
  },
  {
    title: 'Test PDF Example',
    type: 'PDF',
    size: '0.5 MB',
    desc: 'This is a test PDF for demonstration purposes.',
    url: 'https://pdfobject.com/pdf/sample.pdf',
  }
];

const videos = [
  {
    title: 'Microwave 3D Anechoic Chamber Demo',
    duration: '5:32',
    thumb: 'https://images.pexels.com/photos/3912981/pexels-photo-3912981.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: 'https://www.youtube.com/watch?v=bhp5PZfjvIo',
  },
  {
    title: 'Antenna Measurement System Walkthrough',
    duration: '8:14',
    thumb: 'https://images.pexels.com/photos/1167355/pexels-photo-1167355.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: microlineDacVideo,
  },
  {
    title: 'NIT Lab Setup Installation',
    duration: '3:45',
    thumb: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: 'https://www.youtube.com/watch?v=example3',
  },
  {
    title: 'RF Component Manufacturing Process',
    duration: '6:20',
    thumb: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: 'https://www.youtube.com/watch?v=example4',
  },
];

export default function Resources({ onNavigate }: ResourcesProps) {
  const [activeVideo, setActiveVideo] = useState<{
    type: 'youtube' | 'local';
    url: string;
  } | null>(null);

  const [activePdf, setActivePdf] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openVideo = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        setActiveVideo({ type: 'youtube', url: `https://www.youtube.com/embed/${videoId}?autoplay=1` });
      }
    } else {
      setActiveVideo({ type: 'local', url });
    }
  };

  const closeVideo = () => setActiveVideo(null);
  const openPdfViewer = (url: string, title: string) => setActivePdf({ url, title });
  const closePdfViewer = () => setActivePdf(null);

  return (
    <div className="pt-navbar">
      {/* Hero */}
      <div className="page-hero bg-gradient-dark">
        <div
          className="page-hero-overlay"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200')" }}
        />
        <div className="container position-relative z-1">
          <p className="fs-xs text-accent-light text-uppercase mb-2 ls-1">
            <button onClick={() => onNavigate('home')} className="breadcrumb-link">Home</button>
            {' / Resources'}
          </p>
          <h1 className="text-white fs-2xl fw-900">Resources (Catalogues &amp; Videos)</h1>
        </div>
      </div>

      <div className="section py-5">
        <div className="container">
          {/* Catalogues */}
          <div className="mb-20">
            <div className="resources-heading">
              <i className="fas fa-file-alt"></i>
              <h2>Catalogues &amp; <span>Brochures</span></h2>
            </div>
            <div className="d-flex flex-column gap-4">
              {catalogues.map(cat => (
                <div key={cat.title} className="catalogue-item">
                  <div className="catalogue-info">
                    <div className="file-badge">{cat.type}</div>
                    <div>
                      <p className="catalogue-title">{cat.title}</p>
                      <p className="catalogue-meta">{cat.desc} • {cat.size}</p>
                    </div>
                  </div>
                  <div className="catalogue-actions">
                    <button
                      className="btn btn-outline"
                      onClick={() => openPdfViewer(cat.url, cat.title)}
                    >
                      <i className="fas fa-eye mr-2"></i> View
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDownload(cat.url, cat.title + '.pdf')}
                    >
                      <i className="fas fa-download mr-2"></i> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div>
            <div className="resources-heading">
              <i className="fas fa-play"></i>
              <h2>Product <span>Videos</span></h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {videos.map(video => (
                <div key={video.title} className="video-card" onClick={() => openVideo(video.url)}>
                  <div className="video-thumb">
                    <img src={video.thumb} alt={video.title} />
                    <div className="video-play-overlay">
                      <div className="video-play-btn">
                        <i className="fas fa-play"></i>
                      </div>
                    </div>
                    <span className="video-duration">{video.duration}</span>
                  </div>
                  <p className="video-title">{video.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="video-modal-overlay" onClick={closeVideo}>
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
            <button className="video-modal-close" onClick={closeVideo}>
              <i className="fas fa-times"></i>
            </button>
            {activeVideo.type === 'youtube' ? (
              <iframe
                src={activeVideo.url}
                title="YouTube Video Player"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : (
              <video
                className="custom-video-player"
                controls
                autoPlay
                src={activeVideo.url}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {activePdf && (
        <div className="pdf-modal-overlay" onClick={closePdfViewer}>
          <div className="pdf-modal-content" onClick={e => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3 className="pdf-modal-title">{activePdf.title}</h3>
              <button className="pdf-modal-close" onClick={closePdfViewer}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <iframe
              src={activePdf.url}
              title={activePdf.title}
              className="pdf-iframe"
            />
          </div>
        </div>
      )}
    </div>
  );
}