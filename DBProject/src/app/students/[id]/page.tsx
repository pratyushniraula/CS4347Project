"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Define the Student type
interface Student {
  studentID: string;
  firstName: string;
  lastName: string;
  year: string;
  dateOfBirth: string; // Date of birth as a string
  address: string;
  gpa: number;
}

const StudentDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDob] = useState<Date | undefined>(undefined);
  const [gpa, setGPA] = useState('');
  const [year, setYear] = useState('');

  // Fetch student data based on ID
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`/api/students/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }

        const studentData: Student = await response.json();
        setStudent(studentData);

        // Set initial form values from fetched data
        setFirstName(studentData.firstName);
        setLastName(studentData.lastName);
        setAddress(studentData.address);
        setYear(studentData.year);
        setGPA(studentData.gpa.toString());

        // Validate and set DOB (Date)
        const parsedDob = new Date(studentData.dateOfBirth);
        if (!isNaN(parsedDob.getTime())) {
          setDob(parsedDob);
        } else {
          console.log(studentData);
          console.error("Invalid DOB value:", studentData.dateOfBirth);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [id]);

  const handleSave = async () => {
    if (!student || !dateOfBirth) return;

    // Prepare updated student data with DOB in ISO format
    const updatedStudent = {
      ...student,
      firstName,
      lastName,
      address,
      dateOfBirth: dateOfBirth.toISOString().slice(0, 10), // Get YYYY-MM-DD format
      gpa: parseFloat(gpa),
      year,
    };

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStudent),
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      // After successful save, navigate back to the students list
      router.push('/students');
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Student Detail</h1>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            id="firstName"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            id="lastName"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            value={address}
            onChange={e => setAddress(e.target.value)}
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
                  !dateOfBirth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={dateOfBirth}
                onSelect={setDob}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
            onChange={e => setGPA(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <select
            id="year"
            value={year}
            onChange={e => setYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <Button variant="secondary" onClick={handleSave}>Save</Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Grades and Attendance</h2>
        <p>
          <a href="#" className="text-blue-500 hover:underline">View Grades</a>
        </p>
        <p>
          <a href="#" className="text-blue-500 hover:underline">View Attendance</a>
        </p>
      </div>
    </div>
  );
};

export default StudentDetailPage;
