'use strict';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const useAuth = () => {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        if (typeof window !== 'undefined') {
            // Now we are in the client-side context
            return localStorage.getItem('token');
        }
        return null;
    });
    const router = useRouter();

    useEffect(() => {
        let localStorageUser;
        let localStorageAdmin;

        if (typeof window !== 'undefined') {
            localStorageUser = JSON.parse(localStorage.getItem('user'));
            localStorageAdmin = JSON.parse(localStorage.getItem('admin'));

            // Set user if exists in localStorage, otherwise set admin
            setUser(localStorageAdmin ? { ...localStorageAdmin, status: 'admin' } : { ...localStorageUser, status: 'user' });

            if (!token) {
                router.push('/');
            } else {
                axios.defaults.headers.common['Authorization'] = token;
                setAuth(true);
            }
        }
    }, []);

    return { auth, user, token };
};

export default useAuth;