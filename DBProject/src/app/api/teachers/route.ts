import { NextResponse } from 'next/server';
import mysql from 'mysql2';

// Setup the MySQL pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

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

// Helper function to query the database
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

// Handle GET request for /api/teachers
export async function GET(req: Request) {
  try {
    // Fetch all teachers from the database
    const results: Teacher[] = await queryDb('SELECT * FROM teachers');
    
    // Return the teachers data in JSON format
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}
