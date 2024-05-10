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

export default function LoginPage() {
  const [result, setResult] = useState(null)
  const [user, setUser] = useState(null)

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
    try {
      fetch(`http://localhost:8080/api/employee/${result}`)
        .then(response => response.json())
        .then(data => {
          setUser(data.data[0]);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } catch (e) {
      console.error(e)
    }
  }, [result])


  useEffect(() => {
    if (!user) return
    attendance()
  }, [user]);

  const attendance = (id) => {
    try {
      fetch(`http://localhost:8080/api/attendance/${user.employee_id}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data && data.data.length === 0) {
            fetch('http://localhost:8080/api/time_in', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ employee_id: user.employee_id, attendance_id: uuidv4() }),
            })
              .then(response => response.json())
              .then(data => console.log(data))
              .catch((error) => {
                console.error('Error:', error);
              });
          } else {
            fetch(`http://localhost:8080/api/time_out/${data.data[0].attendance_id}`, {
              method: 'PUT',
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
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 ">
      <div className="flex items-center justify-center py-12">

        <UserForm />
      </div>
      <div className="items-center justify-center hidden bg-muted lg:flex">
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
