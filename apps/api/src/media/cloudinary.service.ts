import { Injectable, Logger, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  v2 as cloudinary,
  type UploadApiResponse,
} from "cloudinary";
import type { AppConfig } from "../config/configuration";

/**
 * Thin wrapper around the Cloudinary SDK. Configured from environment secrets
 * (never hardcoded). If keys are absent it stays disabled and uploads fail
 * cleanly with a 503 rather than throwing an opaque SDK error.
 */
@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger("Cloudinary");
  private readonly folder: string;
  readonly enabled: boolean;

  constructor(config: ConfigService<AppConfig, true>) {
    const c = config.get("cloudinary", { infer: true });
    this.folder = c.folder;
    this.enabled = Boolean(c.cloudName && c.apiKey && c.apiSecret);

    if (this.enabled) {
      cloudinary.config({
        cloud_name: c.cloudName,
        api_key: c.apiKey,
        api_secret: c.apiSecret,
        secure: true,
      });
    } else {
      this.logger.warn(
        "Cloudinary keys not set — media upload is disabled. Add CLOUDINARY_* to apps/api/.env.local.",
      );
    }
  }

  private ensureEnabled(): void {
    if (!this.enabled) {
      throw new ServiceUnavailableException(
        "Media uploads are not configured (missing Cloudinary keys).",
      );
    }
  }

  /** Uploads an image buffer, returning Cloudinary's response. */
  uploadImage(buffer: Buffer): Promise<UploadApiResponse> {
    this.ensureEnabled();
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: this.folder, resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Upload failed"));
          } else {
            resolve(result);
          }
        },
      );
      stream.end(buffer);
    });
  }

  /** Deletes an asset by its Cloudinary public_id. */
  async deleteImage(publicId: string): Promise<void> {
    this.ensureEnabled();
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  }
}
