const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cara-versel.onrender.com'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
  }
  count?: number
}

// Users API
export async function fetchUsers(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<any[]> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to fetch users')
    }

    return result.data || []
  } catch (error) {
    console.error('Users API fetch error:', error)
    throw error
  }
}

export async function createUser(userData: any): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<any> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to create user')
    }

    return result.data
  } catch (error) {
    console.error('Create user error:', error)
    throw error
  }
}

// Seminars API
export async function fetchSeminars(): Promise<any> {
  try {
    const [windowsResponse, sessionsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/v1/seminars/windows`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }),
      fetch(`${API_BASE_URL}/api/v1/seminars/sessions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }),
    ])

    if (!windowsResponse.ok || !sessionsResponse.ok) {
      throw new Error('Failed to fetch seminars data')
    }

    const windowsResult: ApiResponse<any[]> = await windowsResponse.json()
    const sessionsResult: ApiResponse<any[]> = await sessionsResponse.json()

    return {
      windows: windowsResult.data || [],
      sessions: sessionsResult.data || [],
    }
  } catch (error) {
    console.error('Seminars API fetch error:', error)
    throw error
  }
}

export async function createSeminarWindow(windowData: any): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/seminars/windows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(windowData),
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<any> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to create seminar window')
    }

    return result.data
  } catch (error) {
    console.error('Create seminar window error:', error)
    throw error
  }
}

export async function createSeminarSession(sessionData: any): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/seminars/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<any> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to create seminar session')
    }

    return result.data
  } catch (error) {
    console.error('Create seminar session error:', error)
    throw error
  }
}

// Progress Reports API
export async function fetchProgressReports(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/progress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<any[]> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to fetch progress reports')
    }

    return result.data || []
  } catch (error) {
    console.error('Progress reports API fetch error:', error)
    throw error
  }
}

export async function createProgressReport(reportData: any): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<any> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to create progress report')
    }

    return result.data
  } catch (error) {
    console.error('Create progress report error:', error)
    throw error
  }
}

export async function submitProgressReport(reportId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/progress/${reportId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<any> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to submit progress report')
    }

    return result.data
  } catch (error) {
    console.error('Submit progress report error:', error)
    throw error
  }
}

// Availability Polls API
export async function fetchAvailabilityPolls(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/availability/polls`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<any[]> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to fetch availability polls')
    }

    return result.data || []
  } catch (error) {
    console.error('Availability polls API fetch error:', error)
    throw error
  }
}

export async function createAvailabilityPoll(pollData: any): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/availability/polls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pollData),
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<any> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to create availability poll')
    }

    return result.data
  } catch (error) {
    console.error('Create availability poll error:', error)
    throw error
  }
}

export async function submitAvailabilityResponse(pollId: string, responseData: any): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/availability/polls/${pollId}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responseData),
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<any> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to submit availability response')
    }

    return result.data
  } catch (error) {
    console.error('Submit availability response error:', error)
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
