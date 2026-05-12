import React, { useEffect, useRef, useState } from 'react';
import { datoClient } from '../lib/datocms';
import { gql } from 'graphql-request';
import videoThumb from '../assets/images/video_thumbnail.jpeg';


// ----------------------------------------------------------------------
// GraphQL Query (correct Mux structure)
// ----------------------------------------------------------------------
const RESOURCES_QUERY = gql`
{
  allCatalogueItems(orderBy: title_ASC) {
    id
    title
    description
    fileType
    fileSize
    catalogueFile { url }
  }
  allVideoResources(orderBy: title_ASC) {
    id
    title
    duration
    videoUrl
    thumbnail { url }
  }
}
`;

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------
interface ResourcesProps {
  onNavigate: (page: string) => void;
}

interface CatalogueItem {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  catalogueFile: { url: string };
}

interface VideoResource {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  thumbnail?: { url: string };
  videoFile?: {
    id: string;
    video: {
      muxPlaybackId: string;
      streamingUrl: string;
      mp4High?: string;
      mp4Med?: string;
      mp4Low?: string;
      thumbJpg?: string;
    };
  };
}

// ----------------------------------------------------------------------
// Enterprise Video Player Component (built-in)
// ----------------------------------------------------------------------
interface VideoPlayerProps {
  url: string;          // HLS (.m3u8) or direct MP4
  fallbackUrl?: string; // direct MP4 when HLS fails
  poster?: string;
}

const EnterpriseVideoPlayer: React.FC<VideoPlayerProps> = ({ url, fallbackUrl, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: any = null;
    let mounted = true;

    const clearHls = () => {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    };

    const setSource = (src: string) => {
      if (!mounted) return;
      setLoading(true);
      setError(null);
      video.src = src;
      video.load();
      video.play().catch((e) => console.warn('Autoplay prevented:', e));
    };

    const handleCanPlay = () => mounted && setLoading(false);
    const handleError = () => {
      if (!mounted) return;
      if (fallbackUrl && video.src !== fallbackUrl) {
        console.log('HLS failed, falling back to MP4');
        clearHls();
        setSource(fallbackUrl);
      } else {
        setError('Failed to play video. Please try again.');
        setLoading(false);
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    const isHls = url.includes('.m3u8') || url.includes('streaming.datocms.com') || url.includes('mux.com');
    if (isHls) {
      // Safari native HLS
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        setSource(url);
      } else if (window.Hls?.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => mounted && setLoading(false));
        hls.on(window.Hls.Events.ERROR, (_, data) => {
          if (data.fatal && mounted) {
            console.error('HLS fatal error', data);
            if (fallbackUrl) {
              clearHls();
              setSource(fallbackUrl);
            } else {
              setError('Video cannot be played. Try a different browser.');
              setLoading(false);
            }
          }
        });
      } else {
        setError('Your browser does not support HLS streaming.');
        setLoading(false);
      }
    } else {
      setSource(url);
    }

    return () => {
      mounted = false;
      clearHls();
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.pause();
      video.src = '';
    };
  }, [url, fallbackUrl]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {loading && !error && (
        <div className="video-loading-overlay">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading video...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="video-error-overlay">
          <i className="fas fa-exclamation-triangle fa-2x mb-2"></i>
          <p>{error}</p>
          <button className="btn btn-sm btn-light" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}
      <video
        ref={videoRef}
        className="custom-video-player"
        controls
        autoPlay
        playsInline
        poster={poster}
        style={{ width: '100%', height: '100%', display: error ? 'none' : 'block' }}
      />
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Resources Component
// ----------------------------------------------------------------------
export default function Resources({ onNavigate }: ResourcesProps) {
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([]);
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeVideo, setActiveVideo] = useState<{
    type: 'embed' | 'stream';
    url: string;
    fallbackUrl?: string;
  } | null>(null);

  const [activePdf, setActivePdf] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await datoClient.request(RESOURCES_QUERY);
      setCatalogues(data.allCatalogueItems);
      setVideos(data.allVideoResources);
    } catch (err) {
      console.error('DatoCMS Fetch Error:', err);
      setError('Failed to load resources. Please refresh the page or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getVideoThumbnail = (video: VideoResource): string => {
    // 1. Custom uploaded thumbnail
    if (video.thumbnail?.url) return video.thumbnail.url;
    // 2. Mux auto thumbnail
    if (video.videoFile?.video?.thumbJpg) return video.videoFile.video.thumbJpg;
    // 3. YouTube thumbnail
    const url = video.videoUrl || '';
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      let videoId = '';
      if (url.includes('youtube.com/watch')) {
        videoId = url.split('v=')[1]?.split('&')[0] || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      }
      if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    // 4. Fallback
    return videoThumb;
  };

  const openVideo = (video: VideoResource) => {
    // PRIORITY 1: DatoCMS uploaded video (Mux) → HLS + MP4 fallback
    if (video.videoFile?.video?.streamingUrl) {
      setActiveVideo({
        type: 'stream',
        url: video.videoFile.video.streamingUrl,
        fallbackUrl: video.videoFile.video.mp4High || video.videoFile.video.mp4Med,
      });
      return;
    }

    const url = video.videoUrl || '';
    if (!url) return;

    // YouTube
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      let videoId = '';
      if (url.includes('youtube.com/watch')) {
        videoId = url.split('v=')[1]?.split('&')[0] || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      }
      if (videoId) {
        setActiveVideo({
          type: 'embed',
          url: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
        });
        return;
      }
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()?.split('?')[0];
      if (videoId) {
        setActiveVideo({
          type: 'embed',
          url: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
        });
        return;
      }
    }

    // Google Drive
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/(.*?)\//);
      const fileId = match?.[1];
      if (fileId) {
        setActiveVideo({
          type: 'embed',
          url: `https://drive.google.com/file/d/${fileId}/preview`,
        });
        return;
      }
    }

    // Direct video file or unknown – treat as stream
    setActiveVideo({ type: 'stream', url });
  };

  const closeVideo = () => setActiveVideo(null);
  const openPdfViewer = (url: string, title: string) => setActivePdf({ url, title });
  const closePdfViewer = () => setActivePdf(null);

// Loading UI – enterprise grade
if (loading) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-container">
        <div className="loading-ring" aria-hidden="true"></div>

        <div className="loading-content">
          <h3 className="loading-title">Loading resources</h3>
          <p className="loading-message">Please wait while we prepare your content</p>
        </div>
      </div>
    </div>
  );
}

// Error UI – professional & accessible
if (error) {
  return (
    <div className="error-container">
      <div className="error-card" role="alert">
        <div className="error-icon" aria-hidden="true">
          <i className="fas fa-exclamation-triangle"></i>
        </div>

        <h3 className="error-title">Unable to load resources</h3>
        <p className="error-message">{error}</p>

        <button className="btn btn-primary error-retry-btn" onClick={fetchResources}>
          <i className="fas fa-sync-alt me-2" aria-hidden="true"></i>
          Retry
        </button>
      </div>
    </div>
  );
}


  return (
    <div className="pt-navbar">
      {/* Hero Section */}
      <div className="page-hero bg-gradient-dark">
        <div
          className="page-hero-overlay"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200')",
          }}
        />
        <div className="container position-relative z-1">
          <div className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs">
            <button onClick={() => onNavigate('home')} className="breadcrumb-link text-info">HOME</button>
            <span className="text-white" style={{ opacity: 0.5 }}> / </span>
            <span className="text-gold">RESOURCES</span>
          </div>
          <h1 className="text-white fs-2xl fw-900">Resources (Catalogues & Videos)</h1>
        </div>
      </div>

      <div className="section py-5">
        <div className="container">
          {/* Catalogues Section */}
          <div className="mb-20">
            <div className="resources-heading">
              <i className="fas fa-file-alt"></i>
              <h2>Catalogues & <span>Brochures</span></h2>
            </div>
            <div className="d-flex flex-column gap-4">
              {catalogues.map((cat) => (
                <div key={cat.id} className="catalogue-item">
                  <div className="catalogue-info">
                    <div className="file-badge">{cat.fileType}</div>
                    <div>
                      <p className="catalogue-title">{cat.title}</p>
                      <p className="catalogue-meta">
                        {cat.description} • {cat.fileSize}
                      </p>
                    </div>
                  </div>
                  <div className="catalogue-actions">
                    <button
                      className="btn btn-outline"
                      onClick={() => openPdfViewer(cat.catalogueFile.url, cat.title)}
                    >
                      <i className="fas fa-eye me-2"></i> View
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDownload(cat.catalogueFile.url, cat.title + '.pdf')}
                    >
                      <i className="fas fa-download me-2"></i> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Videos Section */}
          <div>
            <div className="resources-heading">
              <i className="fas fa-play"></i>
              <h2>Product <span>Videos</span></h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="video-card"
                  onClick={() => openVideo(video)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="video-thumb">
                    <img src={getVideoThumbnail(video)} alt={video.title} loading="lazy" />
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
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={closeVideo}>
              <i className="fas fa-times"></i>
            </button>
            {activeVideo.type === 'embed' ? (
              <iframe
                src={activeVideo.url}
                title="Video Player"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="video-iframe"
              />
            ) : (
              <EnterpriseVideoPlayer
                url={activeVideo.url}
                fallbackUrl={activeVideo.fallbackUrl}
              />
            )}
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {activePdf && (
        <div className="pdf-modal-overlay" onClick={closePdfViewer}>
          <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3 className="pdf-modal-title">{activePdf.title}</h3>
              <button className="pdf-modal-close" onClick={closePdfViewer}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <iframe src={activePdf.url} title={activePdf.title} className="pdf-iframe" />
          </div>
        </div>
      )}
    </div>
  );
}

// Extend Window interface for Hls (TypeScript)
declare global {
  interface Window {
    Hls: any;
  }
}