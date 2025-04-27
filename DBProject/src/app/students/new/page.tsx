"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const NewStudentPage: React.FC = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [gpa, setGPA] = useState('');
  const [year, setYear] = useState('freshman'); // default to freshman

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!firstName || !lastName || !address || !dob || !gpa) {
      alert('Please fill out all fields.');
      return;
    }

    const newStudent = {
      firstName,
      lastName,
      address,
      dob: dob.toISOString().slice(0, 10), // convert to string in YYYY-MM-DD format
      gpa: parseFloat(gpa),
      year,
    };

    try {
      const response = await fetch('/api/students/${id}', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        router.push('/students'); // Redirect to students list after success
      } else {
        throw new Error('Failed to create student');
      }
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Failed to create student');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Student</h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !dob && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dob ? format(dob, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={dob}
                onSelect={setDob}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="gpa">GPA</Label>
          <Input
            type="number"
            id="gpa"
            value={gpa}
            onChange={(e) => setGPA(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="year">Year</Label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <div className="mt-4">
          <Button type="submit">Add Student</Button>
        </div>
      </form>
    </div>
  );
};

export default NewStudentPage;
