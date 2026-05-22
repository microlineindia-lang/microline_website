import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { datoClient } from '../lib/datocms';
import { gql } from 'graphql-request';
import videoThumb from '../assets/images/video_thumbnail.jpeg';
import { useTheme } from "../components/ui/ThemeProvider.tsx";
import resourcesHeroLight from '../assets/images/resources-light.png';
import resourcesHeroDark from '../assets/images/resources-dark.png';

/* ========================================
   SEO Constants
======================================== */
const SITE_URL = 'https://www.microlineindia.in';
const PAGE_URL = `${SITE_URL}/resources`;
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/* ========================================
   GraphQL Query
======================================== */
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

/* ========================================
   Interfaces
======================================== */
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

/* ========================================
   Enterprise Video Player (unchanged)
======================================== */
interface VideoPlayerProps {
  url: string;
  fallbackUrl?: string;
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
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        setSource(url);
      } else if (window.Hls?.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => mounted && setLoading(false));
        hls.on(window.Hls.Events.ERROR, (_: any, data: { fatal: any }) => {
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

/* ========================================
   Main Resources Component
======================================== */
export default function Resources() {
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([]);
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();

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
    link.target = '_blank';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getVideoThumbnail = (video: VideoResource): string => {
    if (video.thumbnail?.url) return video.thumbnail.url;
    if (video.videoFile?.video?.thumbJpg) return video.videoFile.video.thumbJpg;
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
    return videoThumb;
  };

  const openVideo = (video: VideoResource) => {
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

    setActiveVideo({ type: 'stream', url });
  };

  const closeVideo = () => setActiveVideo(null);
  const openPdfViewer = (url: string, title: string) => setActivePdf({ url, title });
  const closePdfViewer = () => setActivePdf(null);

  /* ========================================
     Structured Data (VideoObject items)
  ======================================== */
  const videoObjects = videos.map((video) => {
    const thumb = getVideoThumbnail(video);
    const videoUrl =
      video.videoFile?.video?.streamingUrl ||
      video.videoFile?.video?.mp4High ||
      video.videoUrl ||
      '';
    return {
      '@type': 'VideoObject',
      name: video.title,
      description: video.title,
      thumbnailUrl: thumb,
      contentUrl: videoUrl,
      uploadDate: new Date().toISOString().split('T')[0],
      duration: video.duration || undefined,
    };
  });

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
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Microline India',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'CollectionPage',
        '@id': `${PAGE_URL}/#collectionpage`,
        url: PAGE_URL,
        name: 'Resources: Brochures & Product Videos | Microline India',
        description:
          'Explore Microline India\'s product catalogues, brochures, and product demonstration videos. Download PDFs or watch videos showcasing our RF & microwave solutions.',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${PAGE_URL}/#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Resources', item: PAGE_URL },
        ],
      },
      ...videoObjects,
    ],
  };

  /* ========================================
     Loading State
  ======================================== */
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

  /* ========================================
     Error State
  ======================================== */
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

  /* ========================================
     Main Render
  ======================================== */
  return (
    <>
      {/* ========================================
         SEO
      ======================================== */}
      <Helmet prioritizeSeoTags>
        <title>Resources: Brochures & Product Videos | Microline India</title>
        <meta
          name="description"
          content="Explore Microline India's product catalogues, brochures, and product demonstration videos. Download PDFs or watch videos showcasing our RF & microwave solutions."
        />
        <meta
          name="keywords"
          content="Microline India resources, microwave brochures, product catalogue, RF videos, anechoic chamber brochure, microwave lab PDF, waveguide components PDF, antenna testing videos"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PAGE_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Microline India" />
        <meta property="og:title" content="Resources: Brochures & Product Videos | Microline India" />
        <meta
          property="og:description"
          content="Explore Microline India's product catalogues, brochures, and product demonstration videos."
        />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Resources: Brochures & Product Videos | Microline India" />
        <meta
          name="twitter:description"
          content="Explore Microline India's product catalogues, brochures, and product demonstration videos."
        />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <main className="pt-navbar">
        {/* ========================================
           Hero
        ======================================== */}
        <section className="page-hero bg-gradient-dark" aria-label="Resources hero">
          <div
            className="page-hero-overlay"
            style={{
              backgroundImage: `url(${isDarkMode ? resourcesHeroDark : resourcesHeroLight})`,
            }}
          />
          <div className="container position-relative z-1">
            <nav
              aria-label="Breadcrumb"
              className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs"
            >
              <Link to="/" className="breadcrumb-link text-info">
                HOME
              </Link>
              <span className="text-white" style={{ opacity: 0.5 }}>
                /
              </span>
              <span className="text-gold">RESOURCES</span>
            </nav>
            <h1 className="text-white fs-2xl fw-900">Brochures & Videos</h1>
          </div>
        </section>

        {/* ========================================
           Main Content
        ======================================== */}
        <section className="section py-5" aria-label="Resource lists">
          <div className="container">
            {/* Catalogues */}
            <section aria-labelledby="catalogues-heading" className="mb-20">
              <div className="resources-heading" id="catalogues-heading">
                <i className="fas fa-file-alt" aria-hidden="true"></i>
                <h2>Catalogues & <span>Brochures</span></h2>
              </div>
              <div className="d-flex flex-column gap-4">
                {catalogues.map((cat) => (
                  <article key={cat.id} className="catalogue-item">
                    <div className="catalogue-info">
                      <div className="file-badge" aria-label={`File type: ${cat.fileType}`}>
                        {cat.fileType}
                      </div>
                      <div>
                        <h3 className="catalogue-title">{cat.title}</h3>
                        <p className="catalogue-meta">
                          {cat.description} • {cat.fileSize}
                        </p>
                      </div>
                    </div>
                    <div className="catalogue-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => openPdfViewer(cat.catalogueFile.url, cat.title)}
                        aria-label={`View ${cat.title}`}
                      >
                        <i className="fas fa-eye me-2" aria-hidden="true"></i> View
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleDownload(cat.catalogueFile.url, `${cat.title}.pdf`)}
                        aria-label={`Download ${cat.title}`}
                      >
                        <i className="fas fa-download me-2" aria-hidden="true"></i> Download
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Videos */}
            <section aria-labelledby="videos-heading">
              <div className="resources-heading" id="videos-heading">
                <i className="fas fa-play" aria-hidden="true"></i>
                <h2>Product <span>Videos</span></h2>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {videos.map((video) => (
                  <article
                    key={video.id}
                    className="video-card"
                    onClick={() => openVideo(video)}
                    style={{ cursor: 'pointer' }}
                    aria-label={`Play video: ${video.title}`}
                  >
                    <div className="video-thumb">
                      <img src={getVideoThumbnail(video)} alt={video.title} loading="lazy" />
                      <div className="video-play-overlay">
                        <div className="video-play-btn">
                          <i className="fas fa-play" aria-hidden="true"></i>
                        </div>
                      </div>
                      <span className="video-duration">{video.duration}</span>
                    </div>
                    <h3 className="video-title">{video.title}</h3>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        {/* ========================================
           Video Modal
        ======================================== */}
        {activeVideo && (
          <div
            className="video-modal-overlay"
            onClick={closeVideo}
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
          >
            <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="video-modal-close" onClick={closeVideo} aria-label="Close video">
                <i className="fas fa-times" aria-hidden="true"></i>
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

        {/* ========================================
           PDF Viewer Modal
        ======================================== */}
        {activePdf && (
          <div
            className="pdf-modal-overlay"
            onClick={closePdfViewer}
            role="dialog"
            aria-modal="true"
            aria-label="PDF viewer"
          >
            <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="pdf-modal-header">
                <h3 className="pdf-modal-title">{activePdf.title}</h3>
                <button className="pdf-modal-close" onClick={closePdfViewer} aria-label="Close PDF viewer">
                  <i className="fas fa-times" aria-hidden="true"></i>
                </button>
              </div>
              <iframe src={activePdf.url} title={activePdf.title} className="pdf-iframe" />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

declare global {
  interface Window {
    Hls: any;
  }
}