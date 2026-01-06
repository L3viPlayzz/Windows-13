// Memory-based storage voor demo (reset bij elke cold start)
let enrolledFaceImage: string | null = null;
let enrolledFaceSignature: number[] | null = null;

// Extract a simple "signature" from base64 image (heuristic)
function extractImageSignature(base64Image: string): number[] {
  const signature: number[] = [];
  const data = base64Image;
  const sampleCount = 100;
  const step = Math.floor(data.length / sampleCount);

  for (let i = 0; i < sampleCount; i++) {
    const idx = i * step;
    const val1 = data.charCodeAt(idx) || 0;
    const val2 = data.charCodeAt(idx + 1) || 0;
    const val3 = data.charCodeAt(idx + 2) || 0;
    signature.push((val1 + val2 + val3) / 3);
  }
  return signature;
}

function compareSignatures(sig1: number[], sig2: number[]): number {
  if (sig1.length !== sig2.length || sig1.length === 0) return 0;
  let totalDiff = 0;
  let maxPossibleDiff = 0;

  for (let i = 0; i < sig1.length; i++) {
    const diff = Math.abs(sig1[i] - sig2[i]);
    totalDiff += diff;
    maxPossibleDiff += 128;
  }

  return Math.max(0, Math.min(1, 1 - totalDiff / maxPossibleDiff));
}

export async function enrollFace(imageBase64: string) {
  enrolledFaceImage = imageBase64;
  enrolledFaceSignature = extractImageSignature(imageBase64);
  return { success: true };
}

export async function verifyFace(imageBase64: string) {
  if (!enrolledFaceImage || !enrolledFaceSignature) {
    return { success: false, message: "No face enrolled" };
  }
  const currentSignature = extractImageSignature(imageBase64);
  const similarity = compareSignatures(enrolledFaceSignature, currentSignature);
  const isSamePerson = similarity >= 0.75;
  return { success: true, isSamePerson, similarity };
}

export async function isEnrolled() {
  return !!enrolledFaceImage;
}

export async function clearEnrolledFace() {
  enrolledFaceImage = null;
  enrolledFaceSignature = null;
}
