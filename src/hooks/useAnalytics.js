'use client'
import React, { useEffect, useState } from 'react'
import useAuth from './useAuth';
import axios from 'axios';

function useAnalytics() {
    const { token } = useAuth()
    const [earlyBirds, setEarlyBirds] = useState(null)
    const [lates, setLates] = useState(null)
    const [earlyDepartures, setEarlyDepartures] = useState(null)
    const [absents, setAbsents] = useState(null)
    const [off, setOff] = useState(null)
    const [employee, setEmployee] = useState(null)
    const [monthly, setMonthly] = useState(null)
    const [yearly, setYearly] = useState(null)

    useEffect(() => {
        if (!token) return
        
        const fetchEarlyBirds = async () => {
            const response = await axios.get('http://localhost:8080/api/early_employees', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEarlyBirds(response.data.data)
        };

        const fetchLates = async () => {
            const response = await axios.get('http://localhost:8080/api/late_employees', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLates(response.data.data)
        };

        const fetchEarlyDepartures = async () => {
            const response = await axios.get('http://localhost:8080/api/early_departures', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEarlyDepartures(response.data.data)
        };

        const fetchAbsents = async () => {
            const response = await axios.get('http://localhost:8080/api/absent_employees', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAbsents(response.data.data)
        };

        const fetchOff = async () => {
            const response = await axios.get('http://localhost:8080/api/off', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOff(response.data.data)
        };

        const fetchEmployees = async () => {
            const response = await axios.get('http://localhost:8080/api/monthly_employees', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEmployee(response.data.data)
        };

        const fetchMonthly = async () => {
            const response = await axios.get('http://localhost:8080/api/monthly_attendance', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMonthly(response.data.data)
        };

        const fetchYearly = async () => {
            const response = await axios.get('http://localhost:8080/api/yearly_attendance', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setYearly(response.data.data)
        };


        fetchEarlyBirds();
        fetchLates()
        fetchEarlyDepartures()
        fetchAbsents()
        fetchOff()
        fetchEmployees()
        fetchMonthly()
        fetchYearly()
    }, []);


    return { earlyBirds, lates, earlyDepartures, absents, off, employee, monthly, yearly }
}

export default useAnalytics