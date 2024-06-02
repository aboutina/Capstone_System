'use strict';
import { useState, useEffect } from 'react';
import axios from 'axios';

const useEmployee = (page, limit) => {
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(0)
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
                const response = await axios.get(`http://localhost:8080/api/employees?page=${page}&limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data.data);
                setTotalPages(response.data.totalPages)
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };

        fetchEmployees();
    }, [page]);

    return { employee: data , totalPages };
};

export default useEmployee;