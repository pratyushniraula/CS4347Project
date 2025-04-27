import { NextResponse } from 'next/server';
import mysql from 'mysql2';

// Setup the MySQL pool
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
  year: string;
  dob: string;
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

// Handle GET request for /api/students
export async function GET(req: Request) {
  try {
    // Fetch all students from the database
    const results: Student[] = await queryDb('SELECT * FROM students');
    
    // Return the students data in JSON format
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
