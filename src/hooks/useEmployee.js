'use strict';
import { useState, useEffect } from 'react';
import axios from 'axios';

const useEmployee = () => {
    const [data, setData] = useState([]);
    let token
    if (typeof window !== 'undefined') {
        // Now we are in the client-side context
        token = localStorage.getItem('token');
        // rest of your code
    }

    useEffect(() => {
        const fetchEmployees = async () => {
            try {

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get('http://localhost:8080/api/employees', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };

        fetchEmployees();
    }, []);

    return { employee: data };
};

export default useEmployee;