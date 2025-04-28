CREATE DATABASE IF NOT EXISTS ponder_school;
USE ponder_school;


CREATE TABLE IF NOT EXISTS Students (
    studentID INT PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    year VARCHAR(10),
    dateOfBirth DATE,
    address VARCHAR(255),
    gpa DECIMAL(3,2)
    
);

CREATE TABLE IF NOT EXISTS Teachers (
    teacherID INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    subject VARCHAR(50),
    department VARCHAR(50),
    officeLocation VARCHAR(50),
    officeHours VARCHAR(70),
    teacherAssistantID INT,
    FOREIGN KEY (teacherAssistantID) REFERENCES Students(studentID)
);

CREATE TABLE IF NOT EXISTS Classes (
    classID INT PRIMARY KEY,
    courseCode VARCHAR(10),
    className VARCHAR(100),
    department VARCHAR(50),
    honorsAP BOOLEAN,
    semester VARCHAR(10),
    year VARCHAR(10),
    location VARCHAR(50),
    schedule VARCHAR(70),
    teacherID INT,
    FOREIGN KEY (teacherID) REFERENCES Teachers(teacherID)
);

CREATE TABLE IF NOT EXISTS Attendance (
    studentID INT,
    date DATE,
    status CHAR(1),  -- P, A, E, S, T, F
    PRIMARY KEY (studentID, date),
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE IF NOT EXISTS Enrollment (
    studentID INT,
    classID INT,
    PRIMARY KEY (studentID, classID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID),
    FOREIGN KEY (classID) REFERENCES Classes(classID)
);

CREATE TABLE IF NOT EXISTS Grades (
    studentID INT,
    classID INT,
    grade DECIMAL(5,2),
    PRIMARY KEY (studentID, classID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID),
    FOREIGN KEY (classID) REFERENCES Classes(classID)
);
