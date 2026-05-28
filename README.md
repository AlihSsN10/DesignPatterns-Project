# EM-Booking: Event Management & Booking System

EM-Booking is a complete web-based event booking and ticket purchasing platform built using a modern **3-Tier Architecture**. It features secure user authentication with roles (`CUSTOMER`, `EVENT_CREATOR`, `ADMIN`), responsive catalogs for browsing events, a ticket cart with checkout support, and an administrative moderation and reporting dashboard.

The application serves as a college graduation/course project, demonstrating clean software design principles and GoF Design Patterns.

---

## 🛠️ Tech Stack

- **Frontend (Client Tier):** React.js (built with Vite), Tailwind CSS (shadcn/ui), Lucide React, React Hook Form, React Router.
- **Backend (Application Tier):** Java, Spring Boot, Spring Data JPA, Hibernate, embedded Apache Tomcat.
- **Database (Data Tier):** MySQL.

---

## 📐 Architecture & Design Patterns

### 1. 3-Tier Architecture
The project strictly isolates concerns across three independent physical/logical layers:
- **Client Tier (Frontend):** Renders the user interface and coordinates with the API using JSON payloads.
- **Application Tier (Backend):** Handles session management, business rule validations, database operations, and design pattern execution.
- **Data Tier (Database):** Holds persistent data securely in relational tables (`users`, `events`, `bookings`, `reviews`) using MySQL.

### 2. Design Patterns Implemented
- **Factory Method Pattern (`pattern/factory`):** Dynamically instantiates the appropriate concrete event type (`ConcertEvent`, `SeminarEvent`, `WorkshopEvent`) based on the input type.
- **Composite Pattern (`pattern/composite`):** Standardizes ticket pricing calculation so that both single ticket purchases (`SingleTicket`) and bundled package deals (`TicketBundle`) can be processed uniformly.
- **Template Method Pattern (`pattern/template`):** Structures report generation workflows in the abstract base class `ReportGenerator`, while concrete classes `CsvReportGenerator` and `PdfReportGenerator` customize formatting and output structures.

---

## 🚀 How to Run the Project

### Prerequisites
Make sure you have the following installed on your machine:
- **Java JDK 17** or higher
- **Node.js** (v18+) & **npm**
- **MySQL Server** (running on port `3306`)

---

### Step 1: Set Up the MySQL Database
1. Open your MySQL client (e.g., MySQL Workbench or Command Line).
2. Create a database named `event_booking`:
   ```sql
   CREATE DATABASE event_booking;
   ```
3. Update the database credentials in the backend configuration if necessary. You can find them in:
   `backend/src/main/resources/application.properties`
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/event_booking?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
   *(Note: The database table structure is automatically created by Hibernate on startup via `spring.jpa.hibernate.ddl-auto=update`)*

---

### Step 2: Start the Java Spring Boot Backend
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Build and run the project:
   - **Using Maven Wrapper (Windows):**
     ```cmd
     mvnw.cmd spring-boot:run
     ```
   - **Using Maven Wrapper (Mac/Linux):**
     ```bash
     ./mvnw spring-boot:run
     ```
   - **Using your IDE (IntelliJ IDEA / Eclipse):**
     Open the `backend` directory as a Maven project and run `EventBookingApplication.java`.
3. The server will start and be available at: `http://localhost:8080`

---

### Step 3: Run the React Frontend
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd events-management-main/events-management-main
   ```
2. Install the project dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

---

## 👤 Default User Accounts & Roles

Once the project is running, you can register new accounts via the UI under two roles:
1. **Attend Events** (`CUSTOMER` role) - Can browse, add tickets to the cart, and purchase.
2. **Organize Events** (`EVENT_CREATOR` role) - Can submit new events for approval and view sales analytics.

### 🔑 Master Admin Credentials
To access the **Admin Dashboard** (which allows approving new events, deleting events, and generating system reports), use the pre-created master credentials:
- **Email:** `admin@test.com`
- **Password:** `password`
