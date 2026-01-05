import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Camera } from 'lucide-react';
import * as faceapi from 'face-api.js';

interface WindowsHelloProps {
  onUnlock: () => void;
  onBack?: () => void;
}

const FACE_MATCH_THRESHOLD = 0.6; // Higher = more lenient matching (Euclidean distance)
const ENROLLED_FACE_KEY = 'windows_hello_enrolled_face';
const USER_NAME = 'Levi van Iteron';
const USER_INITIALS = 'LI';
const PROFILE_PICTURE = '/profile-picture.png';

export function WindowsHello({ onUnlock, onBack }: WindowsHelloProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [message, setMessage] = useState('Loading face recognition...');
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [locked, setLocked] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [showSkip, setShowSkip] = useState(true);
  const enrolledDescriptor = useRef<Float32Array | null>(null);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
  };

  // Load face-api.js models - wait for all models before enabling face detection
  useEffect(() => {
    const loadModels = async () => {
      try {
        setMessage('Initializing Windows Hello...');
        const MODEL_URL = '/models';
        
        // Load all required models in parallel
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        
        setModelsLoaded(true);
        console.log('All face recognition models loaded');
        
        // Check if face is enrolled in localStorage
        const storedDescriptor = localStorage.getItem(ENROLLED_FACE_KEY);
        if (storedDescriptor) {
          try {
            const parsed = JSON.parse(storedDescriptor);
            enrolledDescriptor.current = new Float32Array(parsed);
            setIsEnrolled(true);
            setMessage('Position your face for verification');
          } catch (e) {
            console.error('Failed to parse stored descriptor:', e);
            localStorage.removeItem(ENROLLED_FACE_KEY);
            setMessage('Position your face to enroll');
          }
        } else {
          setMessage('Position your face to enroll');
        }
      } catch (error) {
        console.error('Failed to load face recognition models:', error);
        setMessage('Face recognition unavailable - use password login');
      }
    };

    loadModels();
  }, []);

  // Initialize camera immediately (parallel with model loading)
  useEffect(() => {
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

    initCamera();

    return () => {
      stopCamera();
    };
  }, []);

  // Detect face and get descriptor
  const detectFace = async (): Promise<Float32Array | null> => {
    if (!videoRef.current || !modelsLoaded) return null;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      return detection.descriptor;
    }
    return null;
  };

  // Calculate Euclidean distance between two descriptors
  const calculateDistance = (desc1: Float32Array, desc2: Float32Array): number => {
    let sum = 0;
    for (let i = 0; i < desc1.length; i++) {
      sum += Math.pow(desc1[i] - desc2[i], 2);
    }
    return Math.sqrt(sum);
  };

  const handleSkip = () => {
    stopCamera();
    if (onBack) {
      onBack();
    }
  };

  const startScan = async () => {
    if (isScanning || scanned || !cameraReady || !modelsLoaded) return;
    
    setIsScanning(true);
    setMessage(isEnrolled ? 'Scanning face...' : 'Enrolling face...');
    setScanProgress(0);

    // Progress animation
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Wait a moment for stable video frame
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Detect face
      const descriptor = await detectFace();
      
      clearInterval(interval);

      if (!descriptor) {
        setIsScanning(false);
        setMessage('No face detected. Please position your face clearly in the camera.');
        setTimeout(() => {
          setMessage(isEnrolled ? 'Position your face for verification' : 'Position your face to enroll');
        }, 3000);
        return;
      }

      setScanProgress(100);

      if (!isEnrolled) {
        // Enrollment mode
        enrolledDescriptor.current = descriptor;
        localStorage.setItem(ENROLLED_FACE_KEY, JSON.stringify(Array.from(descriptor)));
        
        setIsScanning(false);
        setScanned(true);
        setIsEnrolled(true);
        setMessage('Face enrolled successfully! Unlocking...');
        
        setTimeout(() => {
          stopCamera();
          setLocked(false);
          setTimeout(() => onUnlock(), 600);
        }, 1000);
      } else {
        // Verification mode
        if (!enrolledDescriptor.current) {
          throw new Error('No enrolled face to compare');
        }

        const distance = calculateDistance(enrolledDescriptor.current, descriptor);
        const similarity = Math.max(0, 1 - distance) * 100;
        
        console.log(`Face comparison: distance=${distance.toFixed(3)}, similarity=${similarity.toFixed(1)}%`);
        
        setIsScanning(false);

        if (distance < FACE_MATCH_THRESHOLD) {
          // Face matched!
          setScanned(true);
          setMessage(`Face verified! (${similarity.toFixed(0)}% match) Unlocking...`);
          
          setTimeout(() => {
            stopCamera();
            setLocked(false);
            setTimeout(() => onUnlock(), 600);
          }, 1000);
        } else {
          // Face did not match
          setScanned(true);
          setMessage(`Access denied. Face not recognized (${similarity.toFixed(0)}% match, need 50%+)`);
          
          setTimeout(() => {
            setScanned(false);
            setMessage('Position your face for verification');
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
        setMessage(isEnrolled ? 'Position your face for verification' : 'Position your face to enroll');
      }, 2500);
    }
  };


  if (!locked) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 bg-black z-[10000] pointer-events-none"
      />
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center z-[10000] overflow-hidden">
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="hidden" width={640} height={480} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative z-10 flex flex-col items-center gap-8 bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-emerald-400/50 shadow-2xl"
      >
        {/* Profile Picture */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-400/50 shadow-2xl">
          <img 
            src={PROFILE_PICTURE} 
            alt={USER_NAME}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
            {USER_INITIALS}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1 font-display">{USER_NAME}</h1>
          <p className="text-green-300 text-sm">Windows Hello Face Recognition</p>
          {!isEnrolled && modelsLoaded && (
            <p className="text-yellow-300 text-xs mt-2">First time setup - enrolling your face</p>
          )}
          {!modelsLoaded && (
            <p className="text-yellow-300 text-xs mt-2">Loading AI models...</p>
          )}
        </div>

        <motion.div
          animate={{ scale: isScanning ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.6, repeat: isScanning ? Infinity : 0 }}
          className="relative w-40 h-40 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-600/30 border-2 border-green-400/60 flex items-center justify-center overflow-hidden"
        >
          <motion.div
            animate={{ y: isScanning ? ['-160px', '160px'] : '-160px' }}
            transition={{ duration: 1.5, repeat: isScanning ? Infinity : 0, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/40 to-transparent h-2"
          />
          
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            {cameraReady && modelsLoaded ? (
              <User className="w-20 h-20 text-green-300" />
            ) : (
              <Camera className="w-20 h-20 text-yellow-300 animate-pulse" />
            )}
          </motion.div>

          {scanned && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 border-2 border-green-400 rounded-full"
            />
          )}
        </motion.div>

        <div className="text-center">
          <p className="text-green-300 text-sm mb-4">{message}</p>
          {cameraError && <p className="text-yellow-400 text-xs mb-4">Allow camera access to proceed</p>}
          {!cameraReady && !cameraError && modelsLoaded && <p className="text-green-400/70 text-xs mb-4">Initializing camera...</p>}

          {isScanning && (
            <div className="w-48 h-1 bg-green-900/50 rounded-full overflow-hidden mb-6">
              <motion.div
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.1 }}
                className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
              />
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={startScan}
              disabled={isScanning || (scanned && !message.includes('denied')) || !cameraReady || cameraError || !modelsLoaded}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-green-400 disabled:to-emerald-400 text-white rounded-lg font-semibold transition-all active:scale-95 shadow-lg disabled:opacity-50"
              data-testid="button-start-hello-scan"
            >
              {!modelsLoaded ? 'Loading...' : scanned ? (message.includes('denied') ? 'Try Again' : 'Unlocked!') : isScanning ? 'Scanning...' : isEnrolled ? 'Verify Face' : 'Enroll Face'}
            </button>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleSkip}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all active:scale-95 shadow-lg text-sm"
            >
              Use Password
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
