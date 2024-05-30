'use client'
import LoginPage from '@/components/auth/LoginPage'
import useAuth from '@/hooks/useAuth';
import React from 'react'

function Page() {
    const { auth, user } = useAuth();

    if (!auth) return <div>Loading...</div>;
    return (
        <LoginPage />
    )
}

export default Page