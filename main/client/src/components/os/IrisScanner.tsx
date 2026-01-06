import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, Camera } from 'lucide-react';

interface IrisScannerProps {
  onUnlock: () => void;
  onSwitchToPin?: () => void;
}

export function IrisScanner({ onUnlock, onSwitchToPin }: IrisScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [message, setMessage] = useState('Position your face in the scanner');
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      try {
        const response = await fetch('/api/face/status');
        const data = await response.json();
        setIsEnrolled(data.enrolled);
        if (!data.enrolled) {
          setMessage('No face enrolled. Position your face to enroll.');
        }
      } catch (error) {
        console.error('Failed to check enrollment status:', error);
        setIsEnrolled(false);
      }
    };

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setCameraReady(true);
          };
        }
      } catch (error) {
        console.error('Camera access denied:', error);
        setCameraError(true);
        setMessage('Camera access required');
      }
    };

    checkEnrollmentStatus();
    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

  const captureImage = (): string | null => {
    if (!canvasRef.current || !videoRef.current) return null;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    return canvasRef.current.toDataURL('image/jpeg', 0.8);
  };

  const handleScan = async () => {
    if (isScanning || scanned || !cameraReady || isEnrolled === null) return;
    
    setIsScanning(true);
    setMessage(isEnrolled ? 'Verifying face...' : 'Enrolling face...');
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 25;
      });
    }, 100);

    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const imageData = captureImage();
      if (!imageData) {
        throw new Error('Failed to capture image');
      }

      clearInterval(interval);
      setScanProgress(100);

      if (!isEnrolled) {
        const response = await fetch('/api/face/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData })
        });
        
        const result = await response.json();
        
        if (result.success) {
          setIsScanning(false);
          setScanned(true);
          setMessage('Face enrolled! System unlocking...');
          
          setTimeout(() => {
            stopCamera();
            onUnlock();
          }, 1000);
        } else {
          throw new Error(result.message || 'Enrollment failed');
        }
      } else {
        const response = await fetch('/api/face/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData })
        });
        
        const result = await response.json();
        setIsScanning(false);

        if (result.isSamePerson) {
          setScanned(true);
          setMessage('Face verified! Unlocking...');
          
          setTimeout(() => {
            stopCamera();
            onUnlock();
          }, 1000);
        } else {
          const similarity = Math.round((result.similarity || 0) * 100);
          setMessage(`Access denied. ${result.message || `Face not recognized (${similarity}% match)`}`);
          setScanned(true);
          
          setTimeout(() => {
            setScanned(false);
            setMessage('Position your face in the scanner');
          }, 3000);
        }
      }
    } catch (err: any) {
      console.error('Face scan error:', err);
      clearInterval(interval);
      setIsScanning(false);
      setMessage(err.message || 'Scan failed. Try again.');
      
      setTimeout(() => {
        setScanned(false);
        setMessage('Position your face in the scanner');
      }, 2500);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      <video ref={videoRef} className="hidden" autoPlay playsInline />
      <canvas ref={canvasRef} className="hidden" width={640} height={480} />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, rgba(0, 120, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 120, 212, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-20"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500 to-transparent rounded-full blur-3xl" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 w-48 h-48"
          >
            <div className="w-full h-full border-2 border-transparent border-t-blue-400 border-r-blue-400 rounded-full" />
          </motion.div>

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 w-40 h-40"
          >
            <div className="w-full h-full border border-transparent border-l-cyan-400 border-b-cyan-400 rounded-full" />
          </motion.div>

          <div className="relative w-32 h-32 mx-auto flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 rounded-full border-2 border-blue-400/50 shadow-2xl overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {cameraReady ? (
                <Eye className="w-16 h-16 text-blue-300" />
              ) : (
                <Camera className="w-16 h-16 text-yellow-300 animate-pulse" />
              )}
            </motion.div>

            {isScanning && (
              <motion.div
                animate={{ y: [-60, 60] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm"
              />
            )}

            {scanned && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 border-2 border-green-400 rounded-full"
              />
            )}
          </div>
        </motion.div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-display">Face Scanner</h2>
          {isEnrolled === false && (
            <p className="text-yellow-300 text-xs mb-2">First time setup - enrolling your face</p>
          )}
          <p className="text-cyan-300 text-sm mb-2">{message}</p>
          {cameraError && <p className="text-yellow-400 text-xs mb-2">Allow camera access to proceed</p>}
          {!cameraReady && !cameraError && <p className="text-cyan-400/70 text-xs mb-2">Initializing camera...</p>}

          {isScanning && (
            <div className="w-48 h-1 bg-blue-900/50 rounded-full overflow-hidden mb-6">
              <motion.div
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.1 }}
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
              />
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={isScanning || scanned || !cameraReady || cameraError || isEnrolled === null}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-blue-400 disabled:to-cyan-400 text-white rounded-lg font-semibold transition-all active:scale-95 shadow-lg disabled:opacity-50"
            data-testid="button-start-scan"
          >
            {scanned ? (message.includes('denied') ? 'Try Again' : 'Unlocked!') : isScanning ? 'Scanning...' : isEnrolled ? 'Verify Face' : 'Enroll Face'}
          </button>

          {onSwitchToPin && (
            <button
              onClick={() => {
                stopCamera();
                onSwitchToPin();
              }}
              className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-cyan-300 hover:text-cyan-200 rounded-lg text-sm transition-all"
            >
              Use PIN Code Instead
            </button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          className="text-cyan-400/60 text-xs text-center mt-8 max-w-md"
        >
          <p>• First scan: Your face will be enrolled</p>
          <p>• Future scans: AI verifies it's really you</p>
          <p>• Only your face can unlock this device</p>
        </motion.div>
      </div>
    </div>
  );
}
