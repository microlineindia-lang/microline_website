import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface Props {
  url: string;
  fallbackUrl?: string;
  poster?: string;
}

export default function EnterpriseVideoPlayer({ url, fallbackUrl, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      console.error('Video element not found');
      return;
    }

    console.log('Attempting to play:', url);
    console.log('Fallback URL:', fallbackUrl);

    let hls: Hls | null = null;
    let mounted = true;

    const setSource = (src: string) => {
      console.log('Setting source to:', src);
      setLoading(true);
      setError(null);
      video.src = src;
      video.load();
      video.play().catch(e => console.warn('Autoplay blocked:', e));
    };

    const handleCanPlay = () => {
      console.log('Video can play');
      if (mounted) setLoading(false);
    };

    const handleError = (e: Event) => {
      const videoElement = e.target as HTMLVideoElement;
      console.error('Video error:', videoElement.error?.code, videoElement.error?.message);
      if (mounted && fallbackUrl && video.src !== fallbackUrl) {
        console.log('Falling back to MP4');
        setSource(fallbackUrl);
      } else {
        setError('Failed to play video. Check console for details.');
        setLoading(false);
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    const isHls = url.includes('.m3u8') || url.includes('streaming.datocms.com') || url.includes('mux.com');
    console.log('Is HLS?', isHls);

    if (isHls) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Using Safari native HLS');
        setSource(url);
      } else if (Hls.isSupported()) {
        console.log('Using hls.js');
        hls = new Hls({ enableWorker: true, debug: true }); // enable debug logs
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed');
          if (mounted) setLoading(false);
        });
        hls.on(Hls.Events.ERROR, (_, data) => {
          console.error('HLS error:', data);
          if (data.fatal && mounted && fallbackUrl) {
            hls.destroy();
            setSource(fallbackUrl);
          } else if (data.fatal) {
            setError('HLS error: ' + data.type);
            setLoading(false);
          }
        });
      } else {
        setError('HLS not supported');
      }
    } else {
      setSource(url);
    }

    return () => {
      mounted = false;
      if (hls) hls.destroy();
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.pause();
      video.src = '';
    };
  }, [url, fallbackUrl]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
      {loading && !error && <div className="video-loading-overlay">Loading...</div>}
      {error && <div className="video-error-overlay"><p>{error}</p><button onClick={() => window.location.reload()}>Retry</button></div>}
      <video ref={videoRef} controls autoPlay playsInline poster={poster} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}