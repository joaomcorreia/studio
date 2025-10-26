import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  username: string
  email: string
  is_staff: boolean
  is_superuser: boolean
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const login = async (username: string, password: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
    
    const response = await fetch(`${apiUrl}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      
      // Fetch user data
      await fetchUser()
      return { success: true }
    } else {
      const errorData = await response.json()
      return { success: false, error: errorData.detail || 'Login failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/dashboard/admin/login')
  }

  const fetchUser = async () => {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
      const response = await fetch(`${apiUrl}/auth/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        // Token is invalid
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refetch: fetchUser,
  }
}