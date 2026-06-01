# WKU Admission System

## Overview

The WKU Admission System is a full-stack web application designed to streamline the university admission process. The system allows students to submit applications online, admission officers to review applications, and administrators to monitor admission statistics and system activities.

This project was developed as part of the CPS3962 Software Engineering Project at Wenzhou-Kean University.

---

## Features

### Student Module

* Student Registration
* Student Login
* Online Application Submission
* Application Status Tracking
* Notification Center
* Personal Dashboard

### Admission Officer Module

* Officer Login
* Review Student Applications
* Approve Applications
* Reject Applications
* Request Additional Documents
* Add Review Remarks

### Administrator Module

* Admin Login
* Monitor All Applications
* View Admission Statistics
* Search and Filter Applications
* Track Overall Admission Progress

---

## System Architecture

### Frontend

* React
* React Router DOM
* Axios
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MySQL
* XAMPP

### Version Control

* Git
* GitHub

---

## Database Structure

Main tables included in the system:

### Users

Stores student, officer, and administrator accounts.

### Applications

Stores student application information and admission status.

### Reviews

Stores admission officer decisions and remarks.

### Notifications

Stores system notifications sent to students.

### Documents

Stores uploaded document information.

---

## User Roles

### Student

Students can:

* Register an account
* Log in
* Submit applications
* View application status
* Receive notifications

### Admission Officer

Admission officers can:

* Review submitted applications
* Approve applications
* Reject applications
* Request additional documents
* Add review comments

### Administrator

Administrators can:

* View all applications
* Monitor admission statistics
* Search application records
* Manage admission workflow

---

## Installation Guide

### Clone Repository

```bash
git clone https://github.com/ciderrrr/wku-admission-system.git
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Database Setup

1. Open XAMPP
2. Start Apache and MySQL
3. Open phpMyAdmin
4. Create database:

```sql
CREATE DATABASE wku_admission_system;
```

5. Import:

```text
database/wku_admission_system.sql
```

---

## Project Screenshots

### Login Page

* User authentication interface

### Student Dashboard

* Application management
* Notification center

### Admission Officer Dashboard

* Application review workflow

### Administrator Dashboard

* Admission statistics
* Application monitoring

---

## Future Improvements

* Email notification integration
* PDF application export
* Advanced analytics dashboard
* Multi-language support
* Interview scheduling system

---

## Authors

### Team Members

* Qian Wang
* Team Member 2
* Team Member 3
* Team Member 4

Wenzhou-Kean University

CPS3962 Software Engineering Project

2026
