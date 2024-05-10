'use client'
import React, { useEffect, useRef, useState } from 'react';
import useStore from '../../lib/Zustand';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth, db, storage } from '../../lib/firebase';
import QRCode from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

function UserForm() {
    const qrCodeRef = useRef(null);
    const [url, setUrl] = useState("");

    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        salary_date: '',
        department: '',
        position: '',
        qrcode: "",
        phone_number: '',
    });
    const [admin, setAdmin] = useState(null)
    const [date, setDate] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log(user)
                const adminCollection = collection(db, 'admin');
                const q = query(adminCollection, where("email", "==", user.email));

                getDocs(q)
                    .then((querySnapshot) => {
                        if (!querySnapshot.empty) {
                            setAdmin(querySnapshot.docs[0].data());
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching admin data: ", error);
                    });
            }
        });
        return unsubscribe;
    }, [])

    useEffect(() => {
        console.log(userForm)
        if (date) {
            const newDate = new Date(date.getTime());
            newDate.setDate(newDate.getDate() + 1);
            const dateOnly = newDate.toISOString().slice(0, 10);
            setUserForm({ ...userForm, salary_date: dateOnly, employee_id: uuidv4() })
        }
    }, [date])

    const handleChange = (e) => {
        setUserForm({
            ...userForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await downloadQRCode();
            for (let key of Object.keys(userForm)) {
                if (!userForm[key]) {
                    alert(`Please fill in the ${key} field.`);
                    return;
                }
            }
            fetch('http://localhost:8080/api/create_employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userForm),
            })
                .then((response) => response.json())
                .then(async (data) => {
                    setUserForm({
                        name: '',
                        email: '',
                        password: '',
                        salary_date: '',
                        department: '',
                        position: '',
                        qrcode: '',
                        phone_number: '',
                    });
                    await createUserWithEmailAndPassword(auth, userForm.email, userForm.password);
                    await signOut(auth);
                    await signInWithEmailAndPassword(auth, admin.email, admin.password)
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } catch (err) {
            console.error('Error:', err);
        }
    };


    const downloadQRCode = async () => {
        if (qrCodeRef.current) {
            const canvas = qrCodeRef.current.querySelector("canvas");
            if (canvas) {
                canvas.toBlob(async (blob) => {
                    let downloadLink = document.createElement("a");
                    downloadLink.href = URL.createObjectURL(blob);
                    downloadLink.download = `${userForm.name}.png`;
                    document.body.appendChild(downloadLink);
                    const downloadURL = await uploadFile(blob);
                    console.log(downloadURL); // Log the download URL
                    setUserForm({ ...userForm, qrcode: downloadURL });
                    // downloadLink.click();
                    document.body.removeChild(downloadLink);
                }, 'image/png');
            }
        }
    };


    const uploadFile = async (file) => {
        const storageRef = ref(storage, `qrCode/${userForm.name}.png`);
        const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
        const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
        return downloadURL;
    };

    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Create User</h1>
            </div>
            <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        name="name"
                        value={userForm.name} onChange={handleChange}
                        placeholder="Enter name"
                        required
                    />
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="text"
                        name="email"
                        value={userForm.email} onChange={handleChange}
                        placeholder="Enter email"
                        required
                    />
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={userForm.password} onChange={handleChange}
                        placeholder="Enter password"
                        required
                    />
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    " justify-start text-left font-normal",
                                    !userForm.salary_date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {userForm.salary_date ? format(userForm.salary_date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(date) => {
                                    setDate(date);
                                    console.log(date);
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Label htmlFor="department">Department</Label>
                    <Input
                        id="department"
                        type="text"
                        name="department"
                        value={userForm.department} onChange={handleChange}
                        placeholder="Enter department"
                        required
                    />
                    <Label htmlFor="position">Position</Label>
                    <Input
                        id="position"
                        type="text"
                        name="position"
                        value={userForm.position} onChange={handleChange}
                        placeholder="Enter position"
                        required
                    />
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                        id="phone_number"
                        type="number"
                        name="phone_number"
                        value={userForm.phone_number} onChange={handleChange}
                        placeholder="Enter phone number"
                        required
                    />
                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                </div>
                {userForm.name && (
                    <div className="hidden" ref={qrCodeRef}>
                        <QRCode size={200} level="M" value={userForm.name} />
                    </div>
                )}
            </form>
        </div>
    );
}

export default UserForm;