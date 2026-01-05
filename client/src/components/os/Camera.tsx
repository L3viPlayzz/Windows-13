import { Camera as CameraIcon, Video, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function CameraApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (isCameraActive) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error('Camera error:', err));
    }
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setPhotos([...photos, canvas.toDataURL()]);
      }
    }
  };

  return (
    <div className="h-full w-full bg-black text-white flex flex-col">
      <div className="border-b border-zinc-700 p-4 flex items-center gap-2">
        <CameraIcon className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold">Camera</h2>
      </div>

      <div className="flex-1 flex flex-col">
        {isCameraActive && (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        )}
        {!isCameraActive && (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <CameraIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-gray-400">Camera is not active</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-700 p-4">
        <div className="flex gap-4 justify-center mb-4">
          <button onClick={() => setIsCameraActive(!isCameraActive)} className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${isCameraActive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            <Video className="w-5 h-5" />
            {isCameraActive ? 'Stop Camera' : 'Start Camera'}
          </button>
          <button onClick={takePhoto} disabled={!isCameraActive} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Take Photo
          </button>
        </div>

        {photos.length > 0 && (
          <div className="bg-zinc-800 p-4 rounded-lg max-h-32 overflow-y-auto">
            <p className="text-sm font-semibold mb-2">Photos ({photos.length})</p>
            <div className="flex gap-2">
              {photos.map((photo, i) => (
                <img key={i} src={photo} alt={`Photo ${i}`} className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
