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
          console.log(data.data[0])
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } catch (e) {
      console.error(e)
    }
  }, [result])

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
          </div> :
          <div id="reader" className="w-full h-full border-0"></div>
        }
      </div>
    </div>
  )
}
