# ProManage - Enterprise Project Management System

A modern, multi-tenant project management application built with a scalable full-stack architecture. It features organization-based data isolation, real-time-style task management (Kanban), and a strictly typed GraphQL API.

## 🚀 Features

* **Multi-Tenancy**: Dynamic organization switching with complete data isolation.
* **Project Dashboard**: Visual grid of projects with status indicators and progress tracking.
* **Kanban Task Board**: Interactive board for managing tasks (Todo / In Progress / Done).
* **CRUD Operations**: Full capability to Create, Read, Update, and Delete projects and tasks.
* **Context-Aware UI**: Global state management for organization context using React Context.
* **Comment System**: Threaded discussions on individual tasks.
* **Polished UI**: Enterprise-grade interface using TailwindCSS and Inter typography.

## 🛠 Tech Stack

### Backend
* **Framework**: Django 4.x (Python)
* **API**: Graphene-Django (GraphQL)
* **Database**: PostgreSQL 15
* **Containerization**: Docker & Docker Compose

### Frontend
* **Framework**: React 18
* **Language**: TypeScript
* **State/Data Fetching**: Apollo Client (GraphQL)
* **Styling**: TailwindCSS
* **Routing**: React Router DOM

---

## 📦 Installation & Setup

Follow these steps to get the application running locally.

### 1. Prerequisites
* Docker & Docker Compose
* Node.js (v16+)
* Python (v3.9+)

### 2. Start the Database (Docker)
We use Docker to spin up a PostgreSQL instance effortlessly.

```bash
# In the root directory (where docker-compose.yml is)
docker-compose up -d
```
### 3. Backend Setup
Open a new terminal for the backend.

```bash

cd backend


# 1. Create a virtual environment
python -m venv venv

# 2. Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run Database Migrations
python manage.py migrate

# 5. Create a Superuser (Optional, for Django Admin access)
python manage.py createsuperuser

# 6. Start the Server
python manage.py runserver
The Backend API will be available at: http://localhost:8000/graphql
```
### 4. Frontend Setup
Open a new terminal for the frontend.

```bash

cd frontend

# 1. Install dependencies
npm install

# 2. Start the Development Server
npm run dev
```
The Application will be available at: http://localhost:5173


### 📖 API Documentation (GraphQL)
This project uses a single GraphQL endpoint. You can explore the schema and test queries using the interactive GraphiQL interface.

Ensure the backend is running.

Navigate to http://localhost:8000/graphql in your browser.

Sample Queries
1. Fetch All Organizations (For Dropdown)
```bash
GraphQL

query {
  allOrganizations {
    id
    name
    slug
  }
  ```
}
2. Fetch Projects for an Organization
```bash
GraphQL

query {
  organizationProjects(orgSlug: "tech-corp") {
    id
    name
    status
    taskCount
    completedTaskCount
  }
}
```
3. Create a New Task
```bash
GraphQL

mutation {
  createTask(projectId: "1", title: "Review PR", assigneeEmail: "dev@test.com") {
    task {
      id
      title
      status
    }
  }
}
```
📂 Project Structure
```bash
pm-system/
├── backend/                # Django Project
│   ├── core/              # Settings & Configuration
│   ├── projects/          # Main Application Logic (Models, Schema)
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/    # Reusable UI Components (Modals, Cards)
│   │   ├── context/       # Global State (OrgContext)
│   │   ├── graphql/       # Apollo Queries & Mutations
│   │   ├── pages/         # Page Views (Dashboard, ProjectDetail)
│   │   └── types.ts       # TypeScript Interfaces
│   └── package.json
├── docker-compose.yml      # PostgreSQL Service
└── README.md               # Documentation
```
# 🛡 Design Decisions & Trade-offs
GraphQL over REST: Chosen to solve the "over-fetching" problem. We can fetch a project, its tasks, and task comments in a single network request rather than hitting 3 separate endpoints.

Optimistic UI: The frontend does not currently implement Optimistic Response (updating UI before server confirms) for simplicity, but it does use Apollo's refetchQueries to ensure data consistency after mutations.

Multi-Tenancy: Implemented at the logical level (filtering by Organization Foreign Key) rather than database schema level (separate schemas) for easier maintenance and simpler migrations.