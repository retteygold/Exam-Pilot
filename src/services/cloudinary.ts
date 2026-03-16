/**
 * Cloudinary Image Upload Service
 * 
 * Uses Cloudinary's free tier for image storage
 * 25GB storage, 25 credits/month, no expiry
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET

export const isCloudinaryConfigured = (): boolean => {
  return !!(CLOUD_NAME && API_KEY && API_SECRET)
}

/**
 * Upload an image file to Cloudinary
 */
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary not configured. Check environment variables.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'exam_papers') // Unsigned upload preset
  formData.append('cloud_name', CLOUD_NAME)
  
  // Add timestamp and signature for signed upload
  const timestamp = Math.round(new Date().getTime() / 1000)
  formData.append('timestamp', timestamp.toString())
  formData.append('api_key', API_KEY)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Upload failed')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    throw new Error(error.message || 'Failed to upload image')
  }
}

/**
 * Upload image from clipboard paste
 */
export const uploadImageDataToCloudinary = async (imageData: string): Promise<string> => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary not configured. Check environment variables.')
  }

  const formData = new FormData()
  formData.append('file', imageData)
  formData.append('upload_preset', 'exam_papers')
  formData.append('cloud_name', CLOUD_NAME)
  formData.append('timestamp', Math.round(new Date().getTime() / 1000).toString())
  formData.append('api_key', API_KEY)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Upload failed')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    throw new Error(error.message || 'Failed to upload image')
  }
}

/**
 * Delete an image from Cloudinary (requires API secret - server-side only in production)
 * Note: In production, this should be done server-side to protect API secret
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  console.warn('Image deletion should be handled server-side to protect API secret')
  // For now, just log. In production, implement this on your backend
  console.log('Would delete image:', publicId)
}
