import { analyzeImage } from "../services/gemini";
import fs from "fs";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default {
  async analyze(ctx: any) {
    const file = (ctx.request as any).files?.image;

    if (!file) {
      ctx.status = 400;
      ctx.body = { error: { message: "No image uploaded. Send a file with field name 'image'." } };
      return;
    }

    const uploadedFile = Array.isArray(file) ? file[0] : file;
    const filePath = uploadedFile.filepath || uploadedFile.path;
    const fileSize = uploadedFile.size;
    const mimeType = uploadedFile.mimetype || uploadedFile.type;

    // Validate file type
    if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType)) {
      // Clean up the temp file
      try { fs.unlinkSync(filePath); } catch { /* ignore */ }
      ctx.status = 400;
      ctx.body = {
        error: {
          message: `Invalid file type: ${mimeType}. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
        },
      };
      return;
    }

    // Validate file size
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      try { fs.unlinkSync(filePath); } catch { /* ignore */ }
      ctx.status = 400;
      ctx.body = {
        error: { message: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.` },
      };
      return;
    }

    try {
      const result = await analyzeImage(filePath);
      ctx.status = 200;
      ctx.body = { data: result };
    } catch (error: any) {
      console.error("Image analysis error:", error);
      ctx.status = 500;
      ctx.body = {
        error: { message: "Image analysis failed. Please try again.", details: error.message },
      };
    }
  },
};