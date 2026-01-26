import api from '@/api/axios'
import toast from 'react-hot-toast'

/**
 * Upload a single file
 * @param {File} file - The file to upload
 * @param {string} endpoint - API endpoint for upload
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise} Upload response
 */
export const uploadFile = async (file, endpoint, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(percentCompleted)
        }
      },
    })

    toast.success('File uploaded successfully')
    return response.data
  } catch (error) {
    toast.error(error.response?.data?.message || 'File upload failed')
    throw error
  }
}

/**
 * Upload multiple files
 * @param {File[]} files - Array of files to upload
 * @param {string} endpoint - API endpoint for upload
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise} Upload response
 */
export const uploadMultipleFiles = async (files, endpoint, onProgress) => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  try {
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(percentCompleted)
        }
      },
    })

    toast.success(`${files.length} file(s) uploaded successfully`)
    return response.data
  } catch (error) {
    toast.error(error.response?.data?.message || 'File upload failed')
    throw error
  }
}

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSize - Maximum file size in MB
 * @param {string[]} options.allowedTypes - Allowed MIME types
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateFile = (file, options = {}) => {
  const { maxSize = 10, allowedTypes = [] } = options

  // Check file size (convert MB to bytes)
  const maxSizeBytes = maxSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize}MB limit`,
    }
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    }
  }

  return { valid: true, error: null }
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
