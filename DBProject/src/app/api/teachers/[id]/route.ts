// src/api/teachers/[id]/route.ts
import mysql from 'mysql2';
import { NextResponse } from 'next/server';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

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

interface Student {
    studentID: string;
    firstName: string;
    lastName: string;
    year: string;
    dateOfBirth: string; // Date of birth as a string
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

// Handle GET request for the /api/teachers/[id] route
export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params; // Correct way to get the `id` in Next.js 13+

  try {
    // Fetch teacher by ID from the database
    const results: Teacher[] = await queryDb('SELECT * FROM teachers WHERE teacherID = ?', [id]);
 

    if (results.length === 0) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const teacher = results[0];

    if(teacher.teacherAssistantID){
        const results: Student[] = await queryDb('SELECT * FROM students WHERE studentID = ?', [teacher.teacherAssistantID]);

        if (results.length === 0) {
            return NextResponse.json({ error: 'Teacher Assistant not found' }, { status: 404 });
        }

        const TeacherAssistant = results[0];

        return NextResponse.json({
            Teacher_id: teacher.teacherID,
            Name: teacher.name,
            Subject: teacher.subject,
            Department: teacher.department,
            Phone_no: teacher.phone,
            Email: teacher.email,
            Office_location: teacher.officeLocation,
            Office_hours: teacher.officeHours,
            Teacher_assistant_id: teacher.teacherAssistantID,
            TeacherAssistant: TeacherAssistant.firstName + " " + TeacherAssistant.lastName,
          });
    }

    

    

    return NextResponse.json({
      Teacher_id: teacher.teacherID,
      Name: teacher.name,
      Subject: teacher.subject,
      Department: teacher.department,
      Phone_no: teacher.phone,
      Email: teacher.email,
      Office_location: teacher.officeLocation,
      Office_hours: teacher.officeHours,
      Teacher_assistant_id: teacher.teacherAssistantID,
      TeacherAssistant: '',
    });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// Handle PUT request to update a teacher's information
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params; // Correct way to get the `id` in Next.js 13+
  const data = await req.json();
  const { Name, Subject, Department, Phone_no, Email, Office_location, Office_hours, Teacher_assistant_id } = data; // Get request body

  try {
    // Update teacher data
    const result = await queryDb(
      'UPDATE teachers SET name = ?, subject = ?, department = ?, phone = ?, email = ?, officeLocation = ?, officeHours = ?, teacherAssistantID = ? WHERE teacherID = ?',
      [Name, Subject, Department, Phone_no, Email, Office_location, Office_hours, (Teacher_assistant_id != '') ? Teacher_assistant_id : null, id]
    );

    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Teacher updated successfully' });
  } catch (error) {
    console.error('Error updating teacher:', error);
    return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 });
  }
}

// Handle DELETE request to delete a teacher's information
export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params; // Get the teacher ID from the URL

  try {
    // Delete related data (like teacher assistant, courses, etc.)
    const classIds = await queryDb('SELECT classID FROM classes WHERE teacherID = ?', [id]);
    for (let classObj of classIds) {
        const classID = classObj.classID;  // Access the classID from each object
    
        // Delete from enrollment based on the classID
        await queryDb('DELETE FROM enrollment WHERE classID = ?', [classID]);
    
        // Delete from grades based on the classID
        await queryDb('DELETE FROM grades WHERE classID = ?', [classID]);
    }
    
    await queryDb('DELETE FROM classes WHERE teacherID = ?', [id]);
    const result = await queryDb('DELETE FROM teachers WHERE teacherID = ?', [id]);

    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
  }
}

// For any unsupported method
export async function OPTIONS() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
