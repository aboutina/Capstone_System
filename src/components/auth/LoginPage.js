'use client'
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Html5QrcodeScanner } from "html5-qrcode"
import { useState, useEffect } from "react"
import UserForm from "../form/UserForm"
import { Badge } from "../ui/badge"
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import useAuth from "@/hooks/useAuth"
import { toast } from "sonner"

export default function LoginPage() {
  const [result, setResult] = useState(null)
  const [user, setUser] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    const readerElement = document.getElementById('reader');

    if (readerElement && readerElement.offsetWidth > 0 && readerElement.offsetHeight > 0) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250
        },
        fps: 5,
      })

      // Add a timeout to ensure the image is fully loaded
      setTimeout(() => {
        scanner.render(success, error)
      }, 1000);

      function success(result) {
        scanner.clear()
        setResult(result)

      }

      function error(err) {
        // console.warn(err)
      }
    }
  },)

  useEffect(() => {
    const fetchData = async () => {
      if(result === null) return
      try {
        const response = await axios.get(`http://localhost:8080/api/employee/${result}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.data.length > 0) {
          setUser(response.data.data[0]);
        } else {
          toast("Error", {
            description: "User Not Found",
          })
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [result]);


  useEffect(() => {
    if (!user || !user.employee_id) return;
    attendance(user.employee_id);
  }, [user]);

  const attendance = (id) => {
    console.log("id", id)
    try {
      fetch(`http://localhost:8080/api/attendance/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data && data.data.length === 0) {
            fetch('http://localhost:8080/api/time_in', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ employee_id: id, attendance_id: uuidv4() }),
            })
              .then(response => response.json())
              .then(data => console.log(data))
              .catch((error) => {
                console.error('Error:', error);
              });
          } else {
            console.log("data", data.data[0].time_in)
            fetch(`http://localhost:8080/api/time_out/${data.data[0].attendance_id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ time_in: data.data[0].time_in }),
            })
              .then(response => response.json())
              .then(data => console.log(data))
              .catch((error) => {
                console.error('Error:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    let timer;
    if (user && result) {
      timer = setTimeout(() => {
        // Reset user and result here
        setUser(null);
        setResult(null);
      }, 5000); // 5000 milliseconds = 5 seconds
    }

    // Cleanup function
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [user, result]);

  return (
    <div className="grid w-full min-h-screen grid-cols-1 ">
      {/* <div className="flex items-center justify-center py-12">

        <UserForm />
      </div> */}
      <div className="flex items-center justify-center bg-muted/50">
        {user ?
          <div>
            <Image width={300} height={300} src={user.qrcode} alt={user.name} />
            <h1 className="mt-3 text-xl font-semibold tracking-tight border-b scroll-m-20 first:mt-0">{user.name}</h1>
            <div className="flex gap-2">
              <Badge>{user.department}</Badge>
              <Badge >{user.position}</Badge>
            </div>
            <h2 className="mt-1 text-xs font-medium text-gray-300">Phone:{user.phone_number}</h2>
            <Button onClick={() => {
              setUser(null)
              setResult(null)
            }}>Reset</Button>
          </div> :
          <div id="reader" className="w-full h-full border-0"></div>
        }
      </div>
    </div>
  )
}
