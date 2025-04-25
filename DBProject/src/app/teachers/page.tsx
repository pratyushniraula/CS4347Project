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
} from "@/components/ui/dropdown-menu"

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

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // TODO: Fetch teachers from the database on mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // TODO: Replace with actual database call
        // const teachersData = await getTeachers();
        // setTeachers(teachersData);
        console.log("Implement database fetch logic here!");
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher => {
    const searchMatch = teacher.Name.toLowerCase().includes(searchQuery.toLowerCase());
    const departmentMatch = departmentFilter === '' || teacher.Department.toLowerCase() === departmentFilter.toLowerCase();

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
          placeholder="Department"
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
            <TableHead>Teacher Assistant ID</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeachers.map(teacher => (
            <TableRow key={teacher.Teacher_id}>
              <TableCell>{teacher.Teacher_id}</TableCell>
              <TableCell>{teacher.Name}</TableCell>
              <TableCell>{teacher.Subject}</TableCell>
              <TableCell>{teacher.Department}</TableCell>
              <TableCell>{teacher.Phone_no}</TableCell>
              <TableCell>{teacher.Email}</TableCell>
              <TableCell>{teacher.Office_location}</TableCell>
              <TableCell>{teacher.Office_hours}</TableCell>
              <TableCell>{teacher.Teacher_assistant_id}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <Edit className="h-4 w-4"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/teachers/${teacher.Teacher_id}`}>
                        View/Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Button variant="destructive" size="sm">
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
