import type { VercelRequest, VercelResponse } from "@vercel/node";

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

// API handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "POST") {
      const { action, imageBase64 } = req.body as { action: string; imageBase64?: string };

      if (!action) {
        return res.status(400).json({ success: false, message: "Missing action parameter" });
      }

      switch (action) {
        case "enroll":
          if (!imageBase64) return res.status(400).json({ success: false, message: "Missing imageBase64" });
          enrolledFaceImage = imageBase64;
          enrolledFaceSignature = extractImageSignature(imageBase64);
          return res.status(200).json({ success: true, message: "Face enrolled successfully" });

        case "verify":
          if (!enrolledFaceImage || !enrolledFaceSignature) {
            return res.status(400).json({ success: false, message: "No face enrolled yet" });
          }
          if (!imageBase64) return res.status(400).json({ success: false, message: "Missing imageBase64" });

          const currentSignature = extractImageSignature(imageBase64);
          const similarity = compareSignatures(enrolledFaceSignature, currentSignature);
          const threshold = 0.75;
          const isSamePerson = similarity >= threshold;

          return res.status(200).json({
            success: true,
            isSamePerson,
            similarity: Math.round(similarity * 100) / 100,
            message: isSamePerson ? "Face verified successfully!" : "Face does not match the enrolled face."
          });

        case "clear":
          enrolledFaceImage = null;
          enrolledFaceSignature = null;
          return res.status(200).json({ success: true, message: "Enrolled face cleared" });

        default:
          return res.status(400).json({ success: false, message: "Unknown action" });
      }
    } else {
      return res.status(405).json({ success: false, message: "Method not allowed" });
    }
  } catch (err: any) {
    console.error("Face verification error:", err);
    return res.status(500).json({ success: false, message: err.message || "Unknown error" });
  }
}
