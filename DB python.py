from faker import Faker
from datetime import date, timedelta
import pandas as pd
import random

fake = Faker()
Faker.seed(1)
random.seed(1)

## students
students = []
num_of_students = 100
year_age = {"Freshman": 14, "Sophomore": 15, "Junior": 16, "Senior": 17}
student_ids = random.sample(range(1000, 9999), num_of_students)

for i in range(num_of_students):
    year = random.choice(list(year_age.keys()))
    base_age = year_age[year]
    age = base_age + random.choice([-1, 0, 1])
    dob = fake.date_of_birth(minimum_age=age, maximum_age=age)
    address = f"{fake.building_number()} {fake.street_name()}, Ponder, TX 76259"
    
    student = {
        "studentID": student_ids[i],
        "firstName": fake.first_name(),
        "lastName": fake.last_name(),
        "year": year,
        "dateOfBirth": dob,
        "address": address
    }
    students.append(student)

students_df = pd.DataFrame(students)

## teachers
teachers = []
teacher_id_start = 5000
teacher_counter = 0
num_of_teachers = {
    "Math": 4, "English": 5, "Science": 5, "History": 4, "Electives": 5
}
assistant_pool = random.sample(student_ids, k=len(student_ids) // 4)

for dept, count in num_of_teachers.items():
    for _ in range(count):
        teachers.append({
            "teacherID": teacher_id_start + teacher_counter,
            "name": fake.name(),
            "email": fake.email(),
            "phone": fake.phone_number(),
            "subject": dept,
            "department": dept,
            "teacherAssistantID": random.choice(assistant_pool) if random.random() < 0.3 else None
        })
        teacher_counter += 1

teachers_df = pd.DataFrame(teachers)

## attendance
school_days = 90
end_date = date(2025, 5, 23)
all_dates = []
current = end_date
while len(all_dates) < school_days:
    if current.weekday() < 5:
        all_dates.append(current)
    current -= timedelta(days=1)
all_dates = sorted(all_dates)

students_by_year = {year: [] for year in year_age}
for student in students:
    students_by_year[student["year"]].append(student)

field_trip_days = {
    "Freshman": random.choice(all_dates),
    "Sophomore": random.choice(all_dates),
    "Junior": random.choice(all_dates),
    "Senior": random.sample(all_dates, 2)
}

attendance = []
for student in students:
    sid = student["studentID"]
    year = student["year"]
    for day in all_dates:
        if (year != "Senior" and day == field_trip_days[year]) or (year == "Senior" and day in field_trip_days["Senior"]):
            status = "F" if random.random() < 0.7 else random.choices(["P", "A", "E", "S", "T"], weights=[80, 5, 5, 2, 8])[0]
        else:
            status = random.choices(["P", "A", "E", "S", "T"], weights=[80, 5, 5, 2, 8])[0]
        attendance.append({"studentID": sid, "date": day, "status": status})

attendance_df = pd.DataFrame(attendance)

## classes
manual_classes = [
    {"courseCode": "MATH101", "className": "Algebra I", "department": "Math", "teacherID": 5000},
    {"courseCode": "MATH102", "className": "Geometry", "department": "Math", "teacherID": 5000},
    {"courseCode": "MATH103", "className": "Geometry Honors", "department": "Math", "teacherID": 5001},
    {"courseCode": "MATH104", "className": "Algebra II", "department": "Math", "teacherID": 5002},
    {"courseCode": "MATH105", "className": "Algebra II Honors", "department": "Math", "teacherID": 5002},
    {"courseCode": "MATH106", "className": "Pre-Calculus", "department": "Math", "teacherID": 5003},
    {"courseCode": "MATH206", "className": "Calculus AB", "department": "Math", "teacherID": 5003},
    {"courseCode": "ENG101", "className": "English I", "department": "English", "teacherID": 5004},
    {"courseCode": "ENG102", "className": "English II", "department": "English", "teacherID": 5005},
    {"courseCode": "ENG103", "className": "English III", "department": "English", "teacherID": 5006},
    {"courseCode": "ENG104", "className": "English IV", "department": "English", "teacherID": 5007},
    {"courseCode": "ENG204", "className": "AP English", "department": "English", "teacherID": 5008},
    {"courseCode": "BIO101", "className": "Biology", "department": "Science", "teacherID": 5009},
    {"courseCode": "BIO201", "className": "AP Biology", "department": "Science", "teacherID": 5010},
    {"courseCode": "CHEM101", "className": "Chemistry", "department": "Science", "teacherID": 5010},
    {"courseCode": "CHEM102", "className": "Chemistry Honors", "department": "Science", "teacherID": 5011},
    {"courseCode": "CHEM201", "className": "AP Chemistry", "department": "Science", "teacherID": 5011},
    {"courseCode": "PHYS101", "className": "Physics", "department": "Science", "teacherID": 5012},
    {"courseCode": "PHYS201", "className": "AP Physics", "department": "Science", "teacherID": 5013},
    {"courseCode": "ESS101", "className": "Environmental Science", "department": "Science", "teacherID": 5013},
    {"courseCode": "ESS201", "className": "AP Environmental Science", "department": "Science", "teacherID": 5013},
    {"courseCode": "ANP101", "className": "Anatomy & Physiology", "department": "Science", "teacherID": 5012},
    {"courseCode": "PSYC101", "className": "Psychology", "department": "Science", "teacherID": 5011},
    {"courseCode": "HIST101", "className": "World History", "department": "History", "teacherID": 5014},
    {"courseCode": "HIST202", "className": "AP World History", "department": "History", "teacherID": 5014},
    {"courseCode": "HIST103", "className": "U.S. History", "department": "History", "teacherID": 5015},
    {"courseCode": "HIST203", "className": "AP U.S. History", "department": "History", "teacherID": 5015},
    {"courseCode": "GOV101", "className": "Government", "department": "History", "teacherID": 5016},
    {"courseCode": "GOV201", "className": "AP Government", "department": "History", "teacherID": 5016},
    {"courseCode": "ECON101", "className": "Economics", "department": "History", "teacherID": 5017},
    {"courseCode": "ECON201", "className": "AP Economics", "department": "History", "teacherID": 5017},
    {"courseCode": "MUSI101", "className": "Band", "department": "Electives", "teacherID": 5018},
    {"courseCode": "MUSI102", "className": "Orchestra", "department": "Electives", "teacherID": 5018},
    {"courseCode": "MUSI103", "className": "Choir", "department": "Electives", "teacherID": 5019},
    {"courseCode": "THE101", "className": "Theatre", "department": "Electives", "teacherID": 5020},
    {"courseCode": "ART101", "className": "Art I", "department": "Electives", "teacherID": 5020},
    {"courseCode": "HLTH101", "className": "Health", "department": "Electives", "teacherID": 5021},
    {"courseCode": "BUSI101", "className": "Business Principles", "department": "Electives", "teacherID": 5022},
    {"courseCode": "CS101", "className": "Computer Science", "department": "Electives", "teacherID": 5022}
]

classes_df = pd.DataFrame(manual_classes)
classes_by_dept = classes_df.groupby("department")

## enrollment
enrollment = []
for student_id in students_df["studentID"]:
    student_courses = []
    student_courses.append(classes_by_dept.get_group("English")["courseCode"].sample(1).iloc[0])
    student_courses.append(classes_by_dept.get_group("Math")["courseCode"].sample(1).iloc[0])
    student_courses.extend(classes_by_dept.get_group("Science")["courseCode"].sample(random.randint(1, 2)).tolist())
    student_courses.extend(classes_by_dept.get_group("History")["courseCode"].sample(random.randint(1, 2)).tolist())
    student_courses.extend(classes_by_dept.get_group("Electives")["courseCode"].sample(random.randint(1, 3)).tolist())
    
    for course in student_courses:
        enrollment.append({"studentID": student_id, "courseCode": course})

enrollment_df = pd.DataFrame(enrollment)

## grades
grades_df = enrollment_df.copy()
grades_df["grade"] = grades_df.apply(lambda _: round(random.uniform(65, 100), 2), axis=1)

## gpa calculation
gpa_df = grades_df.groupby("studentID")["grade"].mean().round(2).reset_index()
gpa_df.rename(columns={"grade": "gpa"}, inplace=True)
students_df = pd.merge(students_df, gpa_df, on="studentID", how="left")

## preview
print("\n✅ Preview of Generated DataFrames")

print("\nStudents:")
print(students_df.head())

print("\nTeachers:")
print(teachers_df.head())

print("\nClasses:")
print(classes_df.head())

print("\nEnrollment:")
print(enrollment_df.head())

print("\nGrades:")
print(grades_df.head())

print("\nAttendance:")
print(attendance_df.head())

## save csv for sql

students_df.to_csv("students.csv", index=False)
teachers_df.to_csv("teachers.csv", index=False)
classes_df.to_csv("classes.csv", index=False)
attendance_df.to_csv("attendance.csv", index=False)
enrollment_df.to_csv("enrollment.csv", index=False)
grades_df.to_csv("grades.csv", index=False)
