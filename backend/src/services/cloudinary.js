import { v2 as cloudinary } from 'cloudinary';

export function initCloudinary({ cloudName, apiKey, apiSecret }) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
  return cloudinary;
}

export async function uploadBufferToCloudinary(buffer, filename) {
  const cloudinaryUpload = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'cadeira-falhas',
          public_id: filename?.replace(/\.[^/.]+$/, ''),
          resource_type: 'image'
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

  const result = await cloudinaryUpload();
  return result.secure_url;
}
