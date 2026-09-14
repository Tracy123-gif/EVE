// Cloudinary hosts the photos and voice notes users add to a memory, since
// Firebase Storage now requires a billing plan even for free-tier usage.
// Uploads use an unsigned upload preset, so no server-side signing step or
// secret key is needed from the client.
const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';

export const isCloudinaryConfigured = Boolean(cloudName && uploadPreset);

type ResourceType = 'image' | 'video';

// Cloudinary has no separate "audio" resource type; audio files (like the
// app's recorded voice notes) upload under 'video'.
export async function uploadToCloudinary(
  localUri: string,
  resourceType: ResourceType,
): Promise<string> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      'Cloudinary is not configured. Add EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and ' +
        'EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET (see .env.example).',
    );
  }

  const form = new FormData();
  form.append('file', {
    uri: localUri,
    type: resourceType === 'image' ? 'image/jpeg' : 'audio/m4a',
    name: resourceType === 'image' ? 'upload.jpg' : 'upload.m4a',
  } as unknown as Blob);
  form.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: 'POST', body: form },
  );
  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.status}`);
  }
  const data = (await response.json()) as { secure_url: string };
  return data.secure_url;
}
