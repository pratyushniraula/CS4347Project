"use client";

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Define the Teacher type
interface Teacher {
  teacherID: string;
  name: string;
  subject: string;
  department: string;
  phone: string;
  email: string;
  officeLocation: string;
  officeHours: string;
  teacherAssistantID: string;
}

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/teachers'); // Make sure this API endpoint returns the list of teachers
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleDelete = async (teacherID: string) => {
    try {
      const response = await fetch(`/api/teachers/${teacherID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete teacher');
      }

      setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher.teacherID !== teacherID));
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const searchMatch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
    const departmentMatch = teacher.department.toLowerCase().includes(departmentFilter.toLowerCase());
    return searchMatch && departmentMatch;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Teachers</h1>
      </div>

      <div className="flex space-x-4 mb-4">
        <Input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Filter by department"
          value={departmentFilter}
          onChange={e => setDepartmentFilter(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Teacher ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Phone No</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Office Location</TableHead>
            <TableHead>Office Hours</TableHead>
            <TableHead>Assistant ID</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeachers.map(teacher => (
            <TableRow key={teacher.teacherID}>
              <TableCell>{teacher.teacherID}</TableCell>
              <TableCell>{teacher.name}</TableCell>
              <TableCell>{teacher.subject}</TableCell>
              <TableCell>{teacher.department}</TableCell>
              <TableCell>{teacher.phone}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>{teacher.officeLocation}</TableCell>
              <TableCell>{teacher.officeHours}</TableCell>
              <TableCell>{teacher.teacherAssistantID}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/teachers/${teacher.teacherID}`}>
                        View/Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(teacher.teacherID)}
                      >
                        Delete
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeachersPage;
