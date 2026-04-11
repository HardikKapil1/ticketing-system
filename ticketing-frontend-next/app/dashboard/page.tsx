'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  userId: number
  role: string
  exp: number
}

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    const decoded = jwtDecode<JwtPayload>(token)
    if (decoded.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/user')
    }
  }, [router])

  return null
}
