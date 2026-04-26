const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cara-versel.onrender.com'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
  }
  count?: number
}

export async function fetchApiData(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for real-time data
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<any[]> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to fetch data')
    }

    return result.data || []
  } catch (error) {
    console.error('API fetch error:', error)
    throw error
  }
}

// Generic API client for other endpoints
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      cache: 'no-store',
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}
