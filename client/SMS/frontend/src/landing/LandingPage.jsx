import { Link } from 'react-router-dom';
import { FaGraduationCap, FaMoneyBillWave, FaChartLine, FaUsers, FaShieldAlt, FaCloudDownloadAlt, FaCheckCircle, FaStar, FaArrowRight, FaPlay, FaBook, FaBus, FaUtensils, FaCalendarAlt, FaMobile, FaLaptop, FaCreditCard, FaFileInvoiceDollar, FaUserGraduate, FaChalkboardTeacher, FaBuilding, FaClipboardList, FaBell, FaSync, FaDatabase, FaLock } from 'react-icons/fa';

const LandingPage = () => {
  const coreFeatures = [
    {
      icon: FaMoneyBillWave,
      title: 'Complete Fee Management',
      description: 'Tuition fees, transport fees, library fees, exam fees, hostel fees, activity fees, and custom fee structures with automated calculations.',
      details: ['Multiple payment modes', 'Installment plans', 'Late fee calculations', 'Discount management', 'Scholarship tracking']
    },
    {
      icon: FaChartLine,
      title: 'Advanced Financial Analytics',
      description: 'Real-time dashboards, profit & loss statements, cash flow analysis, budget vs actual reports, and predictive financial modeling.',
      details: ['Monthly/Yearly reports', 'Department-wise analysis', 'Revenue forecasting', 'Expense tracking', 'ROI calculations']
    },
    {
      icon: FaUsers,
      title: 'Complete HR & Payroll',
      description: 'Staff management, salary processing, attendance tracking, leave management, performance evaluation, and compliance reporting.',
      details: ['Automated payroll', 'Tax calculations', 'Provident fund', 'Bonus management', 'Increment tracking']
    },
    {
      icon: FaUserGraduate,
      title: 'Student Information System',
      description: 'Complete student lifecycle management from admission to graduation with academic records, attendance, and progress tracking.',
      details: ['Admission management', 'Academic records', 'Attendance tracking', 'Grade management', 'Parent communication']
    },
    {
      icon: FaBook,
      title: 'Academic Management',
      description: 'Curriculum planning, timetable management, examination system, grade book, assignment tracking, and academic calendar.',
      details: ['Course management', 'Exam scheduling', 'Result processing', 'Certificate generation', 'Academic reports']
    },
    {
      icon: FaBuilding,
      title: 'Infrastructure Management',
      description: 'Asset management, maintenance tracking, facility booking, inventory control, and resource allocation optimization.',
      details: ['Asset tracking', 'Maintenance schedules', 'Room booking', 'Equipment management', 'Utility tracking']
    }
  ];

  const additionalModules = [
    {
      icon: FaBus,
      title: 'Transport Management',
      description: 'Route planning, vehicle tracking, driver management, fuel monitoring, and transport fee collection.',
      features: ['GPS tracking', 'Route optimization', 'Driver profiles', 'Maintenance alerts', 'Parent notifications']
    },
    {
      icon: FaUtensils,
      title: 'Canteen & Mess Management',
      description: 'Menu planning, inventory management, meal tracking, nutritional analysis, and canteen billing system.',
      features: ['Digital menu', 'Cashless payments', 'Nutrition tracking', 'Inventory alerts', 'Meal preferences']
    },
    {
      icon: FaBook,
      title: 'Library Management',
      description: 'Book cataloging, issue/return tracking, fine management, digital resources, and reading analytics.',
      features: ['Barcode scanning', 'Digital catalog', 'Fine calculations', 'Reading reports', 'Resource booking']
    },
    {
      icon: FaCalendarAlt,
      title: 'Event & Activity Management',
      description: 'Event planning, activity scheduling, participation tracking, budget management, and performance analytics.',
      features: ['Event calendar', 'Registration system', 'Budget tracking', 'Photo gallery', 'Achievement records']
    },
    {
      icon: FaClipboardList,
      title: 'Examination System',
      description: 'Exam scheduling, hall ticket generation, result processing, grade analysis, and performance reports.',
      features: ['Online exams', 'Auto evaluation', 'Result analysis', 'Rank generation', 'Progress tracking']
    },
    {
      icon: FaBell,
      title: 'Communication Hub',
      description: 'SMS/Email notifications, parent-teacher communication, announcements, newsletters, and feedback system.',
      features: ['Bulk messaging', 'Parent portal', 'Notice board', 'Feedback forms', 'Emergency alerts']
    }
  ];

  const financialFeatures = [
    {
      title: 'Revenue Management',
      items: ['Tuition Fee Collection', 'Transport Fee Tracking', 'Hostel Fee Management', 'Activity Fee Processing', 'Late Fee Calculations', 'Scholarship Management', 'Discount Processing', 'Refund Management']
    },
    {
      title: 'Expense Tracking',
      items: ['Staff Salaries & Benefits', 'Utility Bills Management', 'Maintenance Costs', 'Equipment Purchases', 'Marketing Expenses', 'Administrative Costs', 'Infrastructure Development', 'Compliance Costs']
    },
    {
      title: 'Budget Management',
      items: ['Annual Budget Planning', 'Department-wise Budgets', 'Project Budget Tracking', 'Variance Analysis', 'Budget Approvals', 'Forecast Modeling', 'Cost Center Management', 'Capital Expenditure Planning']
    },
    {
      title: 'Financial Reporting',
      items: ['Profit & Loss Statements', 'Balance Sheet Generation', 'Cash Flow Analysis', 'Fee Collection Reports', 'Outstanding Reports', 'Tax Compliance Reports', 'Audit Trail Reports', 'Management Dashboards']
    }
  ];

  const technologyFeatures = [
    {
      icon: FaMobile,
      title: 'Mobile Applications',
      description: 'Native iOS and Android apps for students, parents, teachers, and administrators with offline capabilities.',
      features: ['Student app', 'Parent app', 'Teacher app', 'Admin app', 'Offline sync']
    },
    {
      icon: FaLaptop,
      title: 'Web Platform',
      description: 'Responsive web application accessible from any device with role-based dashboards and real-time updates.',
      features: ['Cross-platform', 'Real-time sync', 'Responsive design', 'PWA support', 'Multi-language']
    },
    {
      icon: FaCreditCard,
      title: 'Payment Gateway Integration',
      description: 'Multiple payment options including credit/debit cards, net banking, UPI, wallets, and EMI facilities.',
      features: ['Multiple gateways', 'Secure payments', 'Auto reconciliation', 'Payment tracking', 'Refund processing']
    },
    {
      icon: FaDatabase,
      title: 'Data Management',
      description: 'Secure cloud storage, automated backups, data analytics, and compliance with data protection regulations.',
      features: ['Cloud storage', 'Auto backups', 'Data encryption', 'GDPR compliance', 'Analytics engine']
    },
    {
      icon: FaSync,
      title: 'Integration Capabilities',
      description: 'Seamless integration with existing systems, third-party applications, and government compliance portals.',
      features: ['API integration', 'Data migration', 'Third-party sync', 'Government portals', 'Custom integrations']
    },
    {
      icon: FaLock,
      title: 'Security & Compliance',
      description: 'Bank-grade security, role-based access control, audit trails, and compliance with educational regulations.',
      features: ['Data encryption', 'Access control', 'Audit logs', 'Compliance reports', 'Security monitoring']
    }
  ];

  const benefits = [
    {
      title: 'For School Administration',
      points: ['Reduce administrative workload by 70%', 'Real-time financial visibility', 'Automated compliance reporting', 'Streamlined operations', 'Data-driven decision making', 'Cost reduction and efficiency']
    },
    {
      title: 'For Teachers',
      points: ['Digital grade book and attendance', 'Parent communication tools', 'Lesson planning assistance', 'Student progress tracking', 'Automated report generation', 'Time-saving workflows']
    },
    {
      title: 'For Students',
      points: ['Access to academic records', 'Fee payment tracking', 'Assignment submissions', 'Exam schedules and results', 'Library and transport info', 'Event participation']
    },
    {
      title: 'For Parents',
      points: ['Real-time student progress', 'Fee payment and tracking', 'Teacher communication', 'Attendance monitoring', 'Event notifications', 'Academic performance insights']
    }
  ];

  const stats = [
    { number: '1000+', label: 'Schools Worldwide' },
    { number: '500K+', label: 'Active Students' },
    { number: '₹100Cr+', label: 'Transactions Processed' },
    { number: '99.9%', label: 'Uptime Guarantee' }
  ];

  const testimonials = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Principal, Delhi Public School',
      content: 'School FMS revolutionized our operations. Fee collection improved by 95%, and administrative efficiency increased dramatically.',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Finance Director, Ryan International',
      content: 'The financial reporting and analytics helped us optimize our budget and reduce operational costs by 30%.',
      rating: 5
    },
    {
      name: 'Sarah Johnson',
      role: 'Administrator, International School',
      content: 'Complete solution for school management. The parent and student portals have improved communication significantly.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                <FaGraduationCap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">School FMS</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
              <a href="#modules" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Modules</a>
              <a href="#financial" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Financial</a>
              <a href="#technology" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Technology</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Reviews</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Pricing</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaStar className="mr-2" />
              Complete School Management & Financial Solution
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> School's</span>
              <br />Complete Operations
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              The most comprehensive school management platform covering financial management, student information system, 
              academic management, HR & payroll, transport, library, canteen, and complete administrative operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center">
                Start Free Trial
                <FaArrowRight className="ml-2" />
              </Link>
              <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center">
                <FaPlay className="mr-2" />
                Watch Demo
              </button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Complete School Management
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Solution</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run a modern educational institution efficiently and effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500">
                      <FaCheckCircle className="text-green-500 mr-2 text-xs" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Modules */}
      <section id="modules" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Specialized
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Modules</span>
            </h2>
            <p className="text-xl text-gray-600">Advanced modules for comprehensive school operations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalModules.map((module, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <module.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm">{module.description}</p>
                <div className="space-y-1">
                  {module.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-500">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Management Details */}
      <section id="financial" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Complete Financial
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Management</span>
            </h2>
            <p className="text-xl text-gray-600">Comprehensive financial tools for educational institutions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {financialFeatures.map((category, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <FaCheckCircle className="text-green-500 mr-2 mt-0.5 text-xs flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section id="technology" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Advanced
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Technology</span>
            </h2>
            <p className="text-xl text-gray-600">Modern technology stack for reliable and scalable operations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologyFeatures.map((tech, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <tech.icon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">{tech.title}</h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm">{tech.description}</p>
                <div className="grid grid-cols-1 gap-1">
                  {tech.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-500">
                      <FaCheckCircle className="text-green-500 mr-2 text-xs" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Benefits for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Everyone</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <ul className="space-y-2">
                  {benefit.points.map((point, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <FaCheckCircle className="text-green-500 mr-2 mt-0.5 text-xs flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Trusted by
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Educators</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of schools worldwide who trust School FMS for complete school management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105">
              Start Your Free Trial
            </Link>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                  <FaGraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">School FMS</span>
              </div>
              <p className="text-gray-400 mb-6">
                Complete school management and financial solution for modern educational institutions.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Core Modules</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>Financial Management</li>
                <li>Student Information</li>
                <li>Academic Management</li>
                <li>HR & Payroll</li>
                <li>Transport System</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Features</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>Fee Management</li>
                <li>Library System</li>
                <li>Canteen Management</li>
                <li>Event Management</li>
                <li>Communication Hub</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>24/7 Support</li>
                <li>Training & Setup</li>
                <li>Data Migration</li>
                <li>Custom Integration</li>
                <li>Compliance Help</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 School FMS. Complete School Management Solution. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;