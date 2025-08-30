# 🚀 Full-Stack Task Management System

<div align="center">

![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)
![DRF](https://img.shields.io/badge/Django%20REST-ff1709?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

**A comprehensive task management application built with Django REST Framework backend and React frontend, featuring JWT authentication, CRUD operations, and interactive dashboards.**

[🔥 Live Demo](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/ae93d6f5a5388ba1b7db9657b0c48d26/b3c6423e-3a27-439e-9c24-ac6bf7ce6675/index.html) | [📖 API Docs](#api-documentation) | [🚀 Quick Start](#quick-start)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ System Architecture](#-system-architecture)
- [🔐 Authentication Flow](#-authentication-flow)
- [🗄️ Database Schema](#-database-schema)
- [⚛️ Frontend Architecture](#-frontend-architecture)
- [🔌 API Endpoints](#-api-endpoints)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🛠️ Installation Guide](#-installation-guide)
- [📊 Dashboard Features](#-dashboard-features)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

### 🔒 **Backend (Django + DRF)**
- ✅ **JWT Authentication** with access/refresh tokens and blacklisting
- ✅ **Complete CRUD APIs** for tasks, categories, and users
- ✅ **Swagger Documentation** auto-generated at `/swagger/` endpoint
- ✅ **Advanced Filtering & Search** with query parameters
- ✅ **Task Statistics API** with completion rates and analytics
- ✅ **Database Seeding** management command for sample data
- ✅ **File Attachments** and comments system
- ✅ **Task History** tracking and audit trails
- ✅ **CORS Configuration** for frontend integration
- ✅ **Pagination** for large datasets

### 🎨 **Frontend (React)**
- ✅ **JWT Authentication** with automatic token refresh
- ✅ **Protected Routes** and authentication guards
- ✅ **Interactive Dashboard** with real-time statistics
- ✅ **Data Visualizations** using Chart.js (donut, bar charts)
- ✅ **Task Management** with full CRUD operations
- ✅ **Advanced Filtering** by status, priority, category
- ✅ **Responsive Design** optimized for all devices
- ✅ **Modern UI** with professional styling
- ✅ **Real-time Updates** after API operations
- ✅ **Error Handling** and loading states

---

## 🏗️ System Architecture

The application follows a modern three-tier architecture pattern with clear separation of concerns:

[60]

### **Architecture Layers:**

1. **🎨 Frontend Layer (React)**
   - Single Page Application (SPA) with React Router
   - JWT token management and authentication
   - Interactive dashboard with charts and statistics
   - Task management interface with CRUD operations

2. **🔗 Backend Layer (Django + DRF)**
   - RESTful API endpoints with Django REST Framework
   - JWT middleware for authentication
   - Business logic and data validation
   - Swagger documentation generation

3. **🗄️ Database Layer**
   - Relational database (SQLite/PostgreSQL)
   - Normalized schema with proper relationships
   - Efficient querying with ORM optimization

---

## 🔐 Authentication Flow

The system implements a secure JWT-based authentication system with token refresh capabilities:

[61]

### **Authentication Process:**

1. **🔑 Login Process**
   - User submits credentials to `/api/auth/login/`
   - Backend validates credentials against database
   - Returns access token (1 hour) + refresh token (7 days)
   - Frontend stores tokens securely in localStorage

2. **🛡️ Protected Requests**
   - Frontend includes JWT token in Authorization header
   - Backend validates token signature and expiration
   - Returns protected resource data

3. **🔄 Token Refresh**
   - When access token expires, use refresh token
   - Backend issues new access token
   - Continue making authenticated requests

4. **🚪 Logout Process**
   - Frontend sends refresh token to `/api/auth/logout/`
   - Backend blacklists the refresh token
   - Frontend clears stored tokens

---

## 🗄️ Database Schema

The database uses a normalized relational schema optimized for task management workflows:

[62]

### **Entity Relationships:**

- **👤 User**: Core authentication and profile data
- **📁 Category**: Task categorization with color coding
- **📋 Task**: Main entity with status, priority, assignments
- **💬 Comment**: Task discussions and updates

### **Key Relationships:**
- User **1:N** Task (assigned_to, created_by)
- Category **1:N** Task
- Task **1:N** Comment
- User **1:N** Comment (author)

---

## ⚛️ Frontend Architecture

The React frontend follows a component-based architecture with clear hierarchy and separation of concerns:

[63]

### **Component Structure:**

- **🏠 App**: Root component with routing and authentication context
- **📄 Pages**: Main application views (Dashboard, Tasks, Login)
- **📊 Dashboard**: Statistics cards, charts, and recent tasks
- **📋 Tasks**: Task management with filtering and CRUD operations
- **🔧 Shared**: Reusable components (Header, Sidebar, etc.)

---

## 🔌 API Endpoints

The REST API provides comprehensive endpoints for all application functionality:

[64]

### **Endpoint Categories:**

1. **🔐 Authentication Endpoints**
   - User registration, login, logout
   - Token refresh and user profile management

2. **📋 Task Management Endpoints**
   - Full CRUD operations with advanced filtering
   - Statistics and analytics endpoints
   - User-specific task queries

3. **📁 Resource Endpoints**
   - Categories and user management
   - Supporting data for task operations

---

## 🚀 Quick Start

Get the application running in under 5 minutes:

### **Prerequisites**
- Python 3.8+ installed
- Node.js 14+ (for frontend development)
- Git for version control

### **🔧 Backend Setup**
```bash
# Clone the repository
git clone <repository-url>
cd task-management-system

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
echo "SECRET_KEY=your-secret-key-here" > .env
echo "DEBUG=True" >> .env

# Setup database
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Seed sample data
python manage.py seed_data --mode=refresh --users=10 --tasks=50

# Start development server
python manage.py runserver
```

### **🎨 Frontend Setup**
```bash
# Navigate to frontend directory
cd frontend

# Serve the application (choose one):
python -m http.server 3000
# OR open index.html directly in browser
# OR use VS Code Live Server extension
```

### **🎯 Access Points**
- **Frontend Application**: http://localhost:3000
- **API Documentation**: http://127.0.0.1:8000/swagger/
- **Admin Panel**: http://127.0.0.1:8000/admin/

### **🔑 Demo Credentials**
- **Username**: `john_doe`
- **Password**: `testpass123`

---

## 📁 Project Structure

```
task-management-system/
├── 🐍 backend/                     # Django REST API
│   ├── task_manager/               # Main Django project
│   │   ├── settings.py            # Configuration (JWT, DRF, CORS)
│   │   ├── urls.py                # Main URL routing with Swagger
│   │   ├── wsgi.py                # WSGI configuration
│   │   └── asgi.py                # ASGI configuration
│   ├── apps/                      # Django applications
│   │   ├── authentication/        # JWT auth endpoints
│   │   │   ├── models.py          # User profile extensions
│   │   │   ├── views.py           # Auth API views
│   │   │   ├── serializers.py     # JWT serializers
│   │   │   └── urls.py            # Auth URL patterns
│   │   └── tasks/                 # Task management
│   │       ├── models.py          # Task, Category, Comment models
│   │       ├── views.py           # CRUD views with filtering
│   │       ├── serializers.py     # API serializers
│   │       ├── urls.py            # Task URL patterns
│   │       └── admin.py           # Django admin config
│   ├── management/                # Management commands
│   │   └── commands/
│   │       └── seed_data.py       # Database seeding
│   ├── requirements.txt           # Python dependencies
│   ├── manage.py                  # Django management script
│   └── .env.example              # Environment template
├── ⚛️ frontend/                    # React Application
│   ├── index.html                 # Main HTML template
│   ├── style.css                  # Complete styling system
│   ├── app.js                     # React components and logic
│   └── assets/                    # Static assets
├── 📚 documentation/              # Project documentation
│   ├── api-testing-guide.md       # API testing examples
│   ├── setup-guide.md             # Detailed setup instructions
│   └── deployment-guide.md        # Production deployment
├── 🔧 scripts/
│   ├── setup.sh                   # Automated setup script
│   └── deploy.sh                  # Deployment script
└── README.md                      # This file
```

---

## 🛠️ Installation Guide

### **🔧 Automated Setup (Recommended)**
```bash
# Make setup script executable
chmod +x scripts/setup.sh

# Run automated setup
./scripts/setup.sh
```

### **📖 Manual Setup**

#### **1. Environment Setup**
```bash
# Create .env file
cp .env.example .env

# Edit environment variables
nano .env
```

#### **2. Database Configuration**
```bash
# For SQLite (default)
python manage.py migrate

# For PostgreSQL (production)
pip install psycopg2-binary
# Update DATABASE_URL in .env
python manage.py migrate
```

#### **3. Static Files**
```bash
# Collect static files for production
python manage.py collectstatic
```

#### **4. Create Superuser**
```bash
python manage.py createsuperuser
```

#### **5. Load Sample Data**
```bash
# Load sample data with custom options
python manage.py seed_data --mode=refresh --users=20 --tasks=100 --categories=8
```

---

## 📊 Dashboard Features

### **📈 Statistics Cards**
- **Total Tasks**: Complete count of all tasks
- **Pending Tasks**: Tasks awaiting action
- **In Progress**: Currently active tasks
- **Completed Tasks**: Successfully finished tasks
- **Overdue Tasks**: Past due date tasks

### **📊 Interactive Charts**
- **Status Distribution**: Donut chart showing task status breakdown
- **Priority Analysis**: Bar chart displaying priority distribution
- **Category Breakdown**: Horizontal bar chart of tasks by category
- **Completion Trends**: Time-based completion analytics

### **📋 Recent Tasks Table**
- **Real-time Updates**: Latest task activities
- **Quick Actions**: Inline status updates
- **Priority Indicators**: Visual priority markers
- **Overdue Alerts**: Highlighted overdue tasks

### **🔍 Advanced Filtering**
- **Multi-field Search**: Title and description search
- **Status Filtering**: Pending, In Progress, Completed, Cancelled
- **Priority Filtering**: Low, Medium, High, Urgent
- **Date Range**: Due date and creation date filters
- **Assignee Filtering**: Filter by assigned user

---

## 🧪 Testing

### **🔍 Backend Testing**
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.tasks

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generate HTML report
```

### **🧪 API Testing**
```bash
# Test authentication endpoint
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "testpass123"}'

# Test protected endpoint
curl -X GET http://127.0.0.1:8000/api/tasks/tasks/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### **🎯 Frontend Testing**
```javascript
// Test authentication
const loginResponse = await fetch('/api/auth/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'john_doe', password: 'testpass123' })
});

// Test task creation
const taskResponse = await fetch('/api/tasks/tasks/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'New Task',
    description: 'Task description',
    priority: 'medium',
    assigned_to: 1
  })
});
```

---

## 🚀 Deployment

### **🐳 Docker Deployment**
```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "task_manager.wsgi:application", "--bind", "0.0.0.0:8000"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: taskmanager
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/taskmanager

volumes:
  postgres_data:
```

### **☁️ Production Deployment**

#### **Backend (Django)**
```bash
# Install production dependencies
pip install gunicorn psycopg2-binary

# Configure production settings
export DEBUG=False
export ALLOWED_HOSTS=yourdomain.com
export DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Collect static files
python manage.py collectstatic

# Run migrations
python manage.py migrate

# Start with Gunicorn
gunicorn task_manager.wsgi:application --bind 0.0.0.0:8000
```

#### **Frontend (React)**
```bash
# Build production bundle (if using build tools)
npm run build

# Serve static files
# Upload dist/ files to CDN or static hosting
# Update API base URL in production
```

### **🔧 Environment Variables**
```bash
# Production .env
SECRET_KEY=your-super-secret-production-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@host:5432/database
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Email settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Security settings
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
```

---

## 📚 API Documentation

### **📖 Interactive Documentation**
- **Swagger UI**: http://127.0.0.1:8000/swagger/
- **ReDoc**: http://127.0.0.1:8000/redoc/
- **JSON Schema**: http://127.0.0.1:8000/swagger.json

### **🔐 Authentication**
All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### **📊 Response Formats**
```json
{
  "count": 50,
  "next": "http://api.example.org/tasks/?page=3",
  "previous": "http://api.example.org/tasks/?page=1",
  "results": [
    {
      "id": 1,
      "title": "Implement user authentication",
      "status": "in_progress",
      "priority": "high",
      "due_date": "2025-09-15T14:00:00Z",
      "category": {
        "id": 1,
        "name": "Development",
        "color": "#007bff"
      },
      "assigned_to": {
        "id": 2,
        "username": "jane_smith",
        "full_name": "Jane Smith"
      }
    }
  ]
}
```

---

## 🔧 Customization

### **🎨 Styling System**
The frontend uses a comprehensive design system with CSS custom properties:

```css
:root {
  --color-primary: #007bff;
  --color-success: #28a745;
  --color-warning: #ffc107;
  --color-danger: #dc3545;
  --color-info: #17a2b8;
}
```

### **🔌 Adding Custom Endpoints**
```python
# apps/tasks/views.py
@action(detail=False, methods=['get'])
def custom_stats(self, request):
    # Custom statistics logic
    return Response({"custom_data": "value"})
```

### **⚛️ Adding React Components**
```javascript
// Create new component
const CustomComponent = ({ data }) => {
  return (
    <div className="custom-component">
      {/* Component JSX */}
    </div>
  );
};
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### **📋 Development Process**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **📝 Code Standards**
- **Python**: Follow PEP 8 style guide
- **JavaScript**: Use ESLint and Prettier
- **Django**: Follow Django best practices
- **React**: Use functional components with hooks

### **🧪 Testing Requirements**
- Write tests for new features
- Maintain test coverage above 80%
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Troubleshooting

### **❓ Common Issues**

1. **Login fails with correct credentials**
   ```bash
   # Check user status
   python manage.py shell
   >>> from django.contrib.auth.models import User
   >>> user = User.objects.get(username='john_doe')
   >>> print(user.is_active)
   ```

2. **CORS errors in frontend**
   ```python
   # Update settings.py
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "http://127.0.0.1:3000",
   ]
   ```

3. **Database migration issues**
   ```bash
   # Reset migrations
   python manage.py migrate --fake-initial
   ```

### **🔍 Debug Mode**
```python
# Enable debug logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

---

## 🙏 Acknowledgments

- **Django REST Framework** for the excellent API framework
- **React** for the powerful frontend library
- **Chart.js** for beautiful data visualizations
- **JWT** for secure authentication
- **Swagger** for API documentation

---

<div align="center">

**Built with ❤️ using Django REST Framework and React**

⭐ **Star this repo if you found it helpful!** ⭐

[🔝 Back to Top](#-full-stack-task-management-system)

</div>