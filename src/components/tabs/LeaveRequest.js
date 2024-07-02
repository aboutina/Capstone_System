'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { useForm } from 'react-hook-form'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

function LeaveRequest() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
      console.log(data);
    };
  
    return (
        <div className="max-w-[800px] m-auto">
        <Card className="rounded-xl">
                        <CardHeader>
                            <CardTitle className="text-md">Leave Request Form</CardTitle>
                            <CardDescription> Fill up form below.  </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                                  <div className="space-y-1">
          <Label htmlFor="employeeName">Employee Name</Label>
          <Input id="employeeName" {...register("employeeName", { required: true })} />
          {errors.employeeName && <span className="text-red-500 font-normal text-xs">This field is required!</span>}
        </div>
  
        <div className="space-y-1">
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input id="employeeId" {...register("employeeId", { required: true })} />
          {errors.employeeId && <span className="text-red-500 font-normal text-xs">This field is required!</span>}
        </div>   
                                </div>
       
  
        <div className="space-y-1">
          <Label htmlFor="department">Department</Label>
          <Input id="department" {...register("department", { required: true })} />
          {errors.department && <span className="text-red-500 font-normal text-xs">This field is required!</span>}
        </div>
  
        <div className="space-y-1">
          <Label htmlFor="position">Position</Label>
          <Input id="position" {...register("position", { required: true })} />
          {errors.position && <span className="text-red-500 font-normal text-xs">This field is required!</span>}
        </div>
  
        <div className="flex flex-col gap-1 space-y-1 mt-2">
          <Label htmlFor="leaveType">Type of Leave</Label>
          <select className='p-3 rounded-sm border border-input' id="leaveType" {...register("leaveType", { required: true })}>
            <option value="">Select...</option>
            <option value="vacation">Vacation</option>
            <option value="sick">Sick</option>
            <option value="personal">Personal</option>
            <option value="maternity">Maternity</option>
            <option value="paternity">Paternity</option>
          </select>
          {errors.leaveType && <span className="text-red-500 font-normal text-xs">This field is required!</span>}
        </div>
  
        <div className="space-y-1">
          <Label htmlFor="startDate">Start Date</Label>
          <Input type="date" id="startDate" {...register("startDate", { required: true })} />
          {errors.startDate && <span className="text-red-500 font-normal text-xs">This field is required!</span>}
        </div>
  
        <div className="space-y-1">
          <Label htmlFor="endDate">End Date</Label>
          <Input type="date" id="endDate" {...register("endDate", { required: true })} />
          {errors.endDate && <span className="text-red-500 font-normal text-xs">This field is required!</span>}
        </div>
  
        <div className="space-y-1">
          <Label htmlFor="reason">Reason for Leave</Label>
          <Textarea id="reason" {...register("reason", { required: true })} />
          {errors.reason && <span className="text-red-500 font-normal text-xs">This field is required!</span>}
        </div>
  
        <div className="space-y-1">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input id="contactNumber" {...register("contactNumber", { required: true })} />
          {errors.contactNumber && <span className="text-red-500 font-normal text-xs">This field is required!</span>}
        </div>
  
        <div className="space-y-1">
          <Label htmlFor="emailAddress">Email Address</Label>
          <Input id="emailAddress" type="email" {...register("emailAddress", { required: true })} />
          {errors.emailAddress && <span className="text-red-500 font-normal text-xs">This field is required!</span>}
        </div>
  
        <Button className="mt-5" type="submit">Submit</Button>
      </form>
      </CardContent>
        </Card>
      </div>
    );
  }

export default LeaveRequest