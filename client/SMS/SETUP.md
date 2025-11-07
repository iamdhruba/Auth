# Quick Setup Guide

## 🚀 Complete School Financial Management System

### Prerequisites
1. **Node.js** (v16+) - [Download](https://nodejs.org/)
2. **MongoDB** - Choose one option:
   - **Local MongoDB**: [Download](https://www.mongodb.com/try/download/community)
   - **MongoDB Atlas** (Cloud): [Sign up](https://www.mongodb.com/atlas)

### Setup Steps

#### 1. MongoDB Setup (Choose One)

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string (replace in .env file)

#### 2. Backend Setup
```bash
cd backend
npm install

# Update .env file with your MongoDB URI
# For local: mongodb://localhost:27017/school_fms
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/school_fms

npm run seed    # Create demo users
npm run dev     # Start backend server
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Start frontend server
```

### 🔐 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@school.com | admin123 |
| **Accountant** | accountant@school.com | accountant123 |
| **Teacher** | teacher@school.com | teacher123 |
| **Student** | student@school.com | student123 |
| **Parent** | parent@school.com | parent123 |

### 🌐 Access URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### 🎯 Features by Role

#### Admin Dashboard
- Complete system access
- User management
- All financial modules
- Advanced reporting

#### Accountant Portal
- Fee collection & management
- Expense tracking
- Payroll processing
- Financial reports

#### Teacher Interface
- Student information
- Basic reports
- Limited access

#### Student/Parent Portal
- Personal fee status
- Payment history
- Download receipts
- Academic reports

### 🛠️ Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS v3
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT + bcryptjs
- **Charts**: Recharts
- **Export**: ExcelJS

### 📱 Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Cross-device compatibility

### 🔒 Security Features
- Role-based access control
- JWT authentication
- Password hashing
- Protected routes
- Input validation

---

**Need Help?** Check the main README.md for detailed documentation.