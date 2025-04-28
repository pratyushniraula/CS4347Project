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
teacher_office_start = 101
teacher_counter = 0
num_of_teachers = {
    "Math": 4, "English": 5, "Science": 5, "History": 4, "Electives": 4
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
            "officeLocation":"Office " + str(teacher_office_start + teacher_counter),
            "teacherAssistantID": random.choice(assistant_pool) if random.random() < 0.3 else "NULL"
        })
        teacher_counter += 1

teachers_df = pd.DataFrame(teachers)

## office hours
office_hours = []

days_options = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
]

for teacher in teachers:
    day1 = random.choice(days_options)
    day2 = random.choice([d for d in days_options if d != day1])
    start_hour = random.choice([7, 8, 3, 4])  # Morning (7am/8am) or Afternoon (3pm/4pm)
    am_pm = "AM" if start_hour < 12 else "PM"
    start_minute = random.choice(["00", "30"])
    
    end_hour = start_hour + 1 if start_hour != 11 else 12
    end_am_pm = "AM" if end_hour < 12 else "PM"
    
    office_hour1 = f"{day1} {start_hour}:{start_minute} {am_pm} - {end_hour}:{start_minute} {end_am_pm}"
    office_hour2 = f"{day2} {start_hour}:{start_minute} {am_pm} - {end_hour}:{start_minute} {end_am_pm}"
    
    office_hours.append({
        "teacherID": teacher["teacherID"],
        "officeHours": f"{office_hour1} and {office_hour2}"
    })

office_hours_df = pd.DataFrame(office_hours)

## merge it back
teachers_df = teachers_df.merge(office_hours_df, on="teacherID")


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
    
    {"classID": 1, "courseCode": "MATH101", "className": "Algebra I", "department": "Math", "honorsAP": 0, "semester": "Fall", "year": 2025, "location": "Room 101", "schedule": "Mon/Wed/Fri 10:00-11:00 AM", "teacherID": 5000},
    {"classID": 2, "courseCode": "MATH102", "className": "Geometry", "department": "Math", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 102", "schedule": "Tue/Thu 9:00-10:30 AM", "teacherID": 5000},
    {"classID": 3, "courseCode": "MATH103", "className": "Geometry Honors", "department": "Math", "honorsAP": 1, "semester": "Fall", "year": 2025, "location": "Room 103", "schedule": "Mon/Wed/Fri 11:00-12:00 PM", "teacherID": 5001},
    {"classID": 4, "courseCode": "MATH104", "className": "Algebra II", "department": "Math", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 104", "schedule": "Mon/Wed/Fri 1:00-2:30 PM", "teacherID": 5002},
    {"classID": 5, "courseCode": "MATH105", "className": "Algebra II Honors", "department": "Math", "honorsAP": 1, "semester": "Fall", "year": 2025, "location": "Room 105", "schedule": "Tue/Thu 1:00-2:30 PM", "teacherID": 5002},
    {"classID": 6, "courseCode": "MATH106", "className": "Pre-Calculus", "department": "Math", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 106", "schedule": "Mon/Wed/Fri 2:00-3:30 PM", "teacherID": 5003},
    {"classID": 7, "courseCode": "MATH206", "className": "Calculus AB", "department": "Math", "honorsAP": 1, "semester": "Fall", "year": 2025, "location": "Room 207", "schedule": "Tue/Thu 3:00-4:30 PM", "teacherID": 5003},
    {"classID": 8, "courseCode": "ENG101", "className": "English I", "department": "English", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 108", "schedule": "Mon/Wed/Fri 9:00-10:00 AM", "teacherID": 5004},
    {"classID": 9, "courseCode": "ENG102", "className": "English II", "department": "English", "honorsAP": 0, "semester": "Fall", "year": 2025, "location": "Room 109", "schedule": "Tue/Thu 10:00-11:30 AM", "teacherID": 5005},
    {"classID": 10, "courseCode": "ENG103", "className": "English III", "department": "English", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 110", "schedule": "Mon/Wed/Fri 11:00-12:00 PM", "teacherID": 5006},
    {"classID": 11, "courseCode": "ENG104", "className": "English IV", "department": "English", "honorsAP": 0, "semester": "Fall", "year": 2025, "location": "Room 111", "schedule": "Tue/Thu 1:00-2:30 PM", "teacherID": 5007},
    {"classID": 12, "courseCode": "ENG204", "className": "AP English", "department": "English", "honorsAP": 1, "semester": "Spring", "year": 2025, "location": "Room 112", "schedule": "Mon/Wed 2:00-3:30 PM", "teacherID": 5008},
    {"classID": 13, "courseCode": "BIO101", "className": "Biology", "department": "Science", "honorsAP": 0, "semester": "Fall", "year": 2025, "location": "Room 201", "schedule": "Mon/Wed/Fri 9:00-10:30 AM", "teacherID": 5009},
    {"classID": 14, "courseCode": "BIO201", "className": "AP Biology", "department": "Science", "honorsAP": 1, "semester": "Spring", "year": 2025, "location": "Room 202", "schedule": "Tue/Thu 9:00-10:30 AM", "teacherID": 5010},
    {"classID": 15, "courseCode": "CHEM101", "className": "Chemistry", "department": "Science", "honorsAP": 0, "semester": "Fall", "year": 2025, "location": "Room 203", "schedule": "Mon/Wed/Fri 10:00-11:30 AM", "teacherID": 5010},
    {"classID": 16, "courseCode": "CHEM102", "className": "Chemistry Honors", "department": "Science", "honorsAP": 1, "semester": "Spring", "year": 2025, "location": "Room 204", "schedule": "Tue/Thu 11:00-12:30 PM", "teacherID": 5011},
    {"classID": 17, "courseCode": "CHEM201", "className": "AP Chemistry", "department": "Science", "honorsAP": 1, "semester": "Fall", "year": 2025, "location": "Room 205", "schedule": "Mon/Wed 2:00-3:30 PM", "teacherID": 5011},
    {"classID": 18, "courseCode": "PHYS101", "className": "Physics", "department": "Science", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 206", "schedule": "Tue/Thu 1:00-2:30 PM", "teacherID": 5012},
    {"classID": 19, "courseCode": "PHYS201", "className": "AP Physics", "department": "Science", "honorsAP": 1, "semester": "Fall", "year": 2025, "location": "Room 207", "schedule": "Mon/Wed/Fri 9:00-10:30 AM", "teacherID": 5013},
    {"classID": 20, "courseCode": "ESS101", "className": "Environmental Science", "department": "Science", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 208", "schedule": "Mon/Wed 10:00-11:30 AM", "teacherID": 5013},
    {"classID": 21, "courseCode": "ESS201", "className": "AP Environmental Science", "department": "Science", "honorsAP": 1, "semester": "Fall", "year": 2025, "location": "Room 209", "schedule": "Tue/Thu 3:00-4:30 PM", "teacherID": 5013},
    {"classID": 22, "courseCode": "ANP101", "className": "Anatomy & Physiology", "department": "Science", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 210", "schedule": "Mon/Wed/Fri 11:00-12:30 PM", "teacherID": 5012},
    {"classID": 23, "courseCode": "PSYC101", "className": "Psychology", "department": "Science", "honorsAP": 0, "semester": "Fall", "year": 2025, "location": "Room 211", "schedule": "Tue/Thu 10:00-11:30 AM", "teacherID": 5011},
    {"classID": 24, "courseCode": "HIST101", "className": "World History", "department": "History", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 301", "schedule": "Mon/Wed/Fri 10:00-11:00 AM", "teacherID": 5014},
    {"classID": 25, "courseCode": "HIST202", "className": "AP World History", "department": "History", "honorsAP": 1, "semester": "Fall", "year": 2025, "location": "Room 302", "schedule": "Tue/Thu 9:00-10:30 AM", "teacherID": 5014},
    {"classID": 26, "courseCode": "HIST103", "className": "U.S. History", "department": "History", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 303", "schedule": "Mon/Wed/Fri 1:00-2:00 PM", "teacherID": 5015},
    {"classID": 27, "courseCode": "HIST203", "className": "AP U.S. History", "department": "History", "honorsAP": 1, "semester": "Fall", "year": 2025, "location": "Room 304", "schedule": "Tue/Thu 2:00-3:30 PM", "teacherID": 5015},
    {"classID": 28, "courseCode": "GOV101", "className": "Government", "department": "History", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 305", "schedule": "Mon/Wed/Fri 9:30-10:30 AM", "teacherID": 5016},
    {"classID": 29, "courseCode": "GOV201", "className": "AP Government", "department": "History", "honorsAP": 1, "semester": "Fall", "year": 2025, "location": "Room 306", "schedule": "Tue/Thu 10:30-12:00 PM", "teacherID": 5016},
    {"classID": 30, "courseCode": "ECON101", "className": "Economics", "department": "History", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 307", "schedule": "Mon/Wed/Fri 1:00-2:00 PM", "teacherID": 5017},
    {"classID": 31, "courseCode": "ECON201", "className": "AP Economics", "department": "History", "honorsAP": 1, "semester": "Fall", "year": 2025, "location": "Room 308", "schedule": "Tue/Thu 2:00-3:30 PM", "teacherID": 5017},
    {"classID": 32, "courseCode": "MUSI101", "className": "Band", "department": "Electives", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 401", "schedule": "Mon/Wed/Fri 9:00-10:00 AM", "teacherID": 5018},
    {"classID": 33, "courseCode": "MUSI102", "className": "Choir", "department": "Electives", "honorsAP": 0, "semester": "Fall", "year": 2025, "location": "Room 402", "schedule": "Tue/Thu 1:00-2:30 PM", "teacherID": 5018},
    {"classID": 34, "courseCode": "ART101", "className": "Art", "department": "Electives", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Room 403", "schedule": "Mon/Wed 10:30-12:00 PM", "teacherID": 5019},
    {"classID": 35, "courseCode": "ART102", "className": "Advanced Art", "department": "Electives", "honorsAP": 0, "semester": "Fall", "year": 2025, "location": "Room 404", "schedule": "Tue/Thu 10:00-11:30 AM", "teacherID": 5020},
    {"classID": 36, "courseCode": "PHED101", "className": "Physical Education", "department": "Electives", "honorsAP": 0, "semester": "Spring", "year": 2025, "location": "Gym 1", "schedule": "Mon/Wed/Fri 1:00-2:00 PM", "teacherID": 5021},
    {"classID": 37, "courseCode": "PHED102", "className": "Health", "department": "Electives", "honorsAP": 0, "semester": "Fall", "year": 2025, "location": "Room 405", "schedule": "Tue/Thu 9:30-11:00 AM", "teacherID": 5021}
]

classes_df = pd.DataFrame(manual_classes)
classes_by_dept = classes_df.groupby("department")

## enrollment
enrollment = []
for student_id in students_df["studentID"]:
    student_courses = []
    student_courses.append(classes_by_dept.get_group("English")["classID"].sample(1).iloc[0])
    student_courses.append(classes_by_dept.get_group("Math")["classID"].sample(1).iloc[0])
    student_courses.extend(classes_by_dept.get_group("Science")["classID"].sample(random.randint(1, 2)).tolist())
    student_courses.extend(classes_by_dept.get_group("History")["classID"].sample(random.randint(1, 2)).tolist())
    student_courses.extend(classes_by_dept.get_group("Electives")["classID"].sample(random.randint(1, 3)).tolist())
    
    for course in student_courses:
        enrollment.append({"studentID": student_id, "classID": course})

enrollment_df = pd.DataFrame(enrollment)

## grades
grades_df = enrollment_df.copy()
grades_df["grade"] = grades_df.apply(lambda _: round(random.uniform(65, 100), 2), axis=1)

## gpa calculation
def grade_to_gpa(grade):
    if grade >= 97:
        return 4.0  # A+
    elif grade >= 93:
        return 4.0  # A
    elif grade >= 90:
        return 3.7  # A-
    elif grade >= 87:
        return 3.3  # B+
    elif grade >= 83:
        return 3.0  # B
    elif grade >= 80:
        return 2.7  # B-
    elif grade >= 77:
        return 2.3  # C+
    elif grade >= 73:
        return 2.0  # C
    elif grade >= 70:
        return 1.7  # C-
    elif grade >= 67:
        return 1.3  # D+
    elif grade >= 65:
        return 1.0  # D
    else:
        return 0.0  # F
    
gpa_df = grades_df.groupby("studentID")["grade"].apply(lambda grades: grades.apply(grade_to_gpa).mean()).round(2).reset_index()
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
