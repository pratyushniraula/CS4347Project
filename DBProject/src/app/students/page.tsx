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

// Define the Student type
interface Student {
  studentID: string;
  firstName: string;
  lastName: string;
  address: string;
  dateOfBirth: string;
  gpa: number;
  year: string; // year is a string like freshman, sophomore, etc.
}

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // TODO: Fetch students from the database on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students'); // Make sure this API endpoint returns the list of students
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (studentID: string) => {
    try {
      // Send DELETE request to API
      const response = await fetch(`/api/students/${studentID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      // Remove the student from the state
      setStudents(prevStudents => prevStudents.filter(student => student.studentID !== studentID));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const filteredStudents = students.filter(student => {
    const searchMatch = `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const yearMatch = student.year.toLowerCase().includes(yearFilter.toLowerCase());
    return searchMatch && yearMatch;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
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
          placeholder="Filter by year"
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>GPA</TableHead>
            <TableHead>Year</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map(student => (
            <TableRow key={student.studentID}>
              <TableCell>{student.studentID}</TableCell>
              <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
              <TableCell>{student.address}</TableCell>
              <TableCell>{new Date(student.dateOfBirth).toLocaleDateString("en-US", {year: "numeric",month: "long",day: "numeric"})}</TableCell>
              <TableCell>{student.gpa}</TableCell>
              <TableCell>{student.year}</TableCell>
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
                      <Link href={`/students/${student.studentID}`}>
                        View/Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Button variant="destructive" size="sm"  onClick={() => handleDelete(student.studentID)}>
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

export default StudentsPage;
