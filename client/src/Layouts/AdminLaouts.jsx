import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Protected admin layout component
export default function AdminLayout() {
   // Get user from Redux store
   const user = useSelector((state) => state.Auth.user)
   const navigate = useNavigate()

   // Redirect non-admin users
   useEffect(() => {
       if (!user || user.role !== "admin") {
           navigate('/login')
       }
   }, [user, navigate])

   return (
       <Outlet />
   )
}