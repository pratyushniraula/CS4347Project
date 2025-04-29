// src/api/students/[id]/route.ts
import mysql from 'mysql2';
import { NextResponse } from 'next/server';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

interface Student {
  studentID: string;
  firstName: string;
  lastName: string;
  year: string; // year as a string like "freshman", "sophomore"
  dateOfBirth: string; // Date of birth as string (in database)
  address: string;
  gpa: number;
}

const queryDb = (query: string, values: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Handle GET and PUT requests for the /api/students/[id] route
export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params; // Correct way to get the `id` in Next.js 13+

  try {
    // Fetch student by ID from the database
    const results: Student[] = await queryDb('SELECT * FROM students WHERE studentID = ?', [id]);
    

    if (results.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = results[0];
    return NextResponse.json({
      studentID: student.studentID,
      firstName: student.firstName,
      lastName: student.lastName,
      year: student.year, // year as string (e.g., "freshman")
      dateOfBirth: student.dateOfBirth,
      address: student.address,
      gpa: student.gpa,
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// Handle PUT request to update a student's information
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params; // Correct way to get the `id` in Next.js 13+
  const data = await req.json();
  const { firstName, lastName, address, dateOfBirth, gpa, year } = data; // Get request body

  try {
    // Update student data
    const result = await queryDb(
      'UPDATE students SET firstName = ?, lastName = ?, address = ?, dateOfBirth = ?, gpa = ?, year = ? WHERE studentID = ?',
      [firstName, lastName, address, dateOfBirth, gpa, year, id]
    );

    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  console.log("this is claaed")
  const { id } = await context.params; // Get the student ID from the URL

  try {
    await queryDb('UPDATE teachers SET teacherAssistantID = NULL WHERE teacherAssistantID = ?', [id]);

    // Delete student by ID from the database
    await queryDb('DELETE FROM attendance WHERE studentID = ?', [id]);
    await queryDb('DELETE FROM enrollment WHERE studentID = ?', [id]);
    await queryDb('DELETE FROM grades WHERE studentID = ?', [id]);
    const result = await queryDb('DELETE FROM students WHERE studentID = ?', [id]);

    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}

// For any unsupported method
export async function OPTIONS() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
