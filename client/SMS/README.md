# School Financial Management System (FMS)

A comprehensive MERN stack application with role-based authentication for managing school finances including student fees, expenses, staff payroll, and budgets with advanced reporting and Excel export capabilities.

## 🚀 Features

### Authentication & Authorization
- **Role-Based Access Control**: Admin, Accountant, Teacher, Student, Parent roles
- **Secure Authentication**: JWT-based authentication with password hashing
- **Protected Routes**: Role-specific access to different modules
- **User Management**: Registration, login, logout functionality

### Core Modules
- **Student Fee Management**: Record payments, generate receipts, track pending fees
- **Expense Management**: Categorize and track all school expenses
- **Staff & Payroll**: Manage employee records and salary processing
- **Budget Planning**: Create and monitor departmental budgets
- **Dashboard & Reports**: Real-time financial overview with charts and analytics
- **Excel Export**: Export all reports to Excel format

### User Roles & Permissions

#### Administrator
- Full system access
- User management
- All financial modules
- System configuration
- Complete reporting access

#### Accountant
- Fee collection and management
- Expense tracking and approval
- Payroll processing
- Financial reports generation
- Budget monitoring

#### Teacher/Staff
- View student information
- Basic financial reports
- Personal payroll information
- Limited system access

#### Student/Parent
- View personal fee status
- Payment history access
- Download receipts
- Academic progress reports

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- ExcelJS for Excel generation
- CORS for cross-origin requests

**Frontend:**
- React 18 with Vite
- Tailwind CSS v3
- React Router for navigation
- Recharts for data visualization
- Axios for API calls
- React Icons for UI icons
- React Toastify for notifications
- Context API for state management

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create .env file
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_fms
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Seed demo users:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Demo Accounts

After running the seed script, you can use these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | admin123 |
| Accountant | accountant@school.com | accountant123 |
| Teacher | teacher@school.com | teacher123 |
| Student | student@school.com | student123 |
| Parent | parent@school.com | parent123 |

## 🗃️ Database Schema

### Collections
- **users**: User authentication and role management
- **students**: Student records with guardian information
- **feeStructures**: Class-wise fee definitions
- **feePayments**: Payment transactions with receipts
- **expenses**: Categorized expense records
- **staff**: Employee information and salary details
- **payrolls**: Monthly salary processing records
- **budgets**: Departmental budget planning and tracking

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Students (Admin, Accountant, Teacher)
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Fees (Admin, Accountant)
- `POST /api/fees/payment` - Record fee payment
- `GET /api/fees/payments` - Get payments with filters
- `GET /api/fees/structures` - Get fee structures
- `POST /api/fees/structure` - Add fee structure

### Expenses (Admin, Accountant)
- `POST /api/expenses` - Add expense
- `GET /api/expenses` - Get expenses with filters
- `GET /api/expenses/summary` - Get category-wise summary

### Staff & Payroll (Admin, Accountant)
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Add staff member
- `POST /api/payroll` - Add payroll record
- `GET /api/payroll/summary` - Get department-wise summary

### Reports (Role-based access)
- `GET /api/reports/dashboard` - Get dashboard data
- `GET /api/reports/export/excel` - Export reports to Excel

## 📊 Usage Guide

### Landing Page
- Modern landing page with feature overview
- Role-based access information
- Registration and login options
- Demo account access

### Authentication
- Secure login/registration system
- Role-based dashboard redirection
- Password visibility toggle
- Demo account quick access

### Admin Dashboard
- Complete system overview
- User management capabilities
- All financial modules access
- Advanced reporting features

### Student/Parent Portal
- Personal fee status and history
- Payment receipt downloads
- Academic progress reports
- Limited system access

### Financial Management
- Real-time dashboard with charts
- Advanced filtering capabilities
- Excel export functionality
- Role-based data access

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected API endpoints
- Input validation on all forms
- Secure token handling
- Auto-logout on token expiration

## 📱 Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive navigation and layouts
- Touch-friendly interface
- Cross-device compatibility

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Deploy to services like Heroku, Railway, or DigitalOcean
3. Configure MongoDB Atlas for cloud database
4. Set secure JWT secret

### Frontend Deployment
1. Build the production version:
```bash
npm run build
```
2. Deploy to Netlify, Vercel, or similar platforms
3. Update API base URL for production
4. Configure environment variables

## 🎯 Getting Started

1. **Clone the repository**
2. **Install dependencies** for both backend and frontend
3. **Set up environment variables**
4. **Run the seed script** to create demo users
5. **Start both servers**
6. **Visit the landing page** at http://localhost:5173
7. **Login with demo accounts** to explore different roles

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
This project is licensed under the MIT License.

## 📞 Support
For support and questions, please create an issue in the repository.

---

**Built with ❤️ using the MERN Stack + Tailwind CSS**