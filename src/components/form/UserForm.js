'use client'
import React, { useEffect, useRef, useState } from 'react';
import useStore from '../../../Zustand';
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
import { storage } from '../../../firebase';
import QRCode from 'qrcode.react';

function UserForm() {
    const qrCodeRef = useRef(null);
    const [url, setUrl] = useState("");
    const [userForm, setUserForm] = useState({
        name: '',
        salary_date: '',
        department: '',
        position: '',
        qrcode: "",
        phone_number: '',
    });
    const [date, setDate] = useState(null);

    useEffect(() => {
        setUserForm({ ...userForm, salary_date: date, employee_id: (new Date().getTime() * 1000).toString() })
    }, [date])

    const handleChange = (e) => {
        setUserForm({
            ...userForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            downloadQRCode()
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
                .then((data) => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const downloadQRCode = async () => {
        const canvas = qrCodeRef.current.querySelector("canvas");
        canvas.toBlob(async (blob) => {
            let downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${userForm.name}.png`;
            document.body.appendChild(downloadLink);
            const downloadURL = await uploadFile(blob);
            console.log(downloadURL); // Log the download URL
            setUserForm({ ...userForm, qrcode: downloadURL });
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }, 'image/png');
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
                                onSelect={setDate}
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
                        type="text"
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
                    <div className="self-center" ref={qrCodeRef}>
                        <QRCode size={200} level="M" value={userForm.name} />
                    </div>
                )}
            </form>
        </div>
    );
}

export default UserForm;