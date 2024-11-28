import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UserLayout() {
    const user = useSelector((state) => state.Auth.user); // Access the current user from Redux state
    const navigate = useNavigate(); // Hook to navigate programmatically

    useEffect(() => {
        if (!user) {
            navigate('/login'); // Redirect to the login page if the user is not logged in
        }
    }, [user, navigate]); // Runs when user or navigate changes

    return <Outlet />; // Renders nested routes for authenticated users
}
