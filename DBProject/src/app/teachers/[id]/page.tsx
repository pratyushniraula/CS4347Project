"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getTeacherAssistant, TeacherAssistant } from "@/services/teacher-assistant";

// Define the Teacher type
interface Teacher {
  Teacher_id: string;
  Name: string;
  Subject: string;
  Department: string;
  Phone_no: string;
  Email: string;
  Office_location: string;
  Office_hours: string;
  Teacher_assistant_id: string;
}

const TeacherDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [department, setDepartment] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [email, setEmail] = useState('');
    const [officeLocation, setOfficeLocation] = useState('');
    const [officeHours, setOfficeHours] = useState('');
    const [teacherAssistantId, setTeacherAssistantId] = useState('');
    const [teacherAssistant, setTeacherAssistant] = useState<TeacherAssistant | null>(null);

  // TODO: Fetch teacher data from the database based on the ID
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // TODO: Replace with actual database call
        // const teacherData = await getTeacher(id);
        // setTeacher(teacherData);
        // setName(teacherData.Name);
        // setSubject(teacherData.Subject);
        // setDepartment(teacherData.Department);
        // setPhoneNo(teacherData.Phone_no);
        // setEmail(teacherData.Email);
        // setOfficeLocation(teacherData.Office_location);
        // setOfficeHours(teacherData.Office_hours);
        // setTeacherAssistantId(teacherData.Teacher_assistant_id);
        console.log("Implement database fetch logic here!");
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeacherData();
  }, [id]);

  useEffect(() => {
    const loadTeacherAssistant = async () => {
      if (teacherAssistantId) {
        const ta = await getTeacherAssistant(teacherAssistantId);
        setTeacherAssistant(ta);
      }
    };
    loadTeacherAssistant();
  }, [teacherAssistantId]);


  const handleSave = () => {
    if (!teacher) return;

    // TODO: call updateTeacher(id, data) here
    const updatedTeacher = {
      ...teacher,
        Name: name,
        Subject: subject,
        Department: department,
        Phone_no: phoneNo,
        Email: email,
        Office_location: officeLocation,
        Office_hours: officeHours,
        Teacher_assistant_id: teacherAssistantId,
    };
    console.log('Saving teacher:', updatedTeacher);
    // After successful save, navigate back to the teachers list
    router.push('/teachers');
  };

  if (!teacher) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Teacher Detail</h1>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            type="text"
            id="subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            type="text"
            id="department"
            value={department}
            onChange={e => setDepartment(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            type="text"
            id="phone"
            value={phoneNo}
            onChange={e => setPhoneNo(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="officeLocation">Office Location</Label>
          <Input
            type="text"
            id="officeLocation"
            value={officeLocation}
            onChange={e => setOfficeLocation(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="officeHours">Office Hours</Label>
          <Input
            type="text"
            id="officeHours"
            value={officeHours}
            onChange={e => setOfficeHours(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="teacherAssistantId">Teacher Assistant ID</Label>
          <Input
            type="text"
            id="teacherAssistantId"
            value={teacherAssistantId}
            onChange={e => setTeacherAssistantId(e.target.value)}
          />
          {teacherAssistant && (
              <div>
                Teacher Assistant: {teacherAssistant.name}
              </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Button variant="secondary" onClick={handleSave}>Save</Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Classes Taught</h2>
        <p>
          {/* Add Classes Taught overview here */}
          Classes Overview: to be implemented
        </p>
      </div>
    </div>
  );
};

export default TeacherDetailPage;
