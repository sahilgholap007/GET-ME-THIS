<div align="center">

# 🚢 Ship Global - GetMeThis

### *Your Gateway to Global Shopping Made Simple*

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Enabled-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

[🌐 Live Demo](https://getmethis.in) • [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/sahilgholap007/GET-ME-THIS/issues) • [✨ Request Feature](https://github.com/sahilgholap007/GET-ME-THIS/issues)

---

</div>

## 📋 Table of Contents

- [🎯 About The Project](#-about-the-project)
- [✨ Key Features](#-key-features)
- [🛠️ Built With](#️-built-with)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [💻 Usage](#-usage)
- [🏗️ Project Structure](#️-project-structure)
- [🔐 Authentication Flow](#-authentication-flow)
- [🎨 UI Components](#-ui-components)
- [📱 Responsive Design](#-responsive-design)
- [🔄 API Integration](#-api-integration)
- [🧪 Testing](#-testing)
- [📦 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Contact](#-contact)

---

## 🎯 About The Project

**Ship Global (GetMeThis)** is a revolutionary e-commerce platform that bridges the gap between global shoppers and international products. We provide a seamless shopping experience with personal shopper assistance, global shipping, and comprehensive procurement management.

### 🌟 What Makes Us Different?

- **🛍️ Personal Shopping Assistant** - Get help finding and purchasing products from anywhere in the world
- **🌍 Global Reach** - Access products from international markets with ease
- **📦 End-to-End Tracking** - Monitor your shipments from purchase to delivery
- **💼 Procurement Management** - Advanced system for businesses to manage purchases, approvals, and payments
- **🚢 Vessel Management** - Specialized tools for maritime logistics and vessel-related procurement

---

## ✨ Key Features

### 🛒 **Customer Features**
- **Personal Shopper Service** - AI-powered shopping assistance for finding products globally
- **Multi-Currency Support** - Shop in your preferred currency
- **Real-Time Order Tracking** - Track your packages across borders
- **Secure Payment Gateway** - PayPal integration with multiple payment options
- **User Dashboard** - Manage orders, addresses, and preferences
- **Email Verification** - OTP-based secure account verification
- **Password Recovery** - Secure password reset with OTP verification

### 💼 **Business/Admin Features**
- **Procurement System**
  - Create and manage procurement requests
  - Multi-level approval workflow
  - Payment tracking and management
  - Material receipt verification
  - Vendor and product master data management
  - Bulk upload functionality for vendors, products, and scales
  - Auto-fill forms based on product history
  - Amount breakdown (base, tax, other charges)
  
- **Vessel Management**
  - Track vessel-specific procurement
  - Manage vessel works and maintenance
  - Dedicated vessel procurement workflows

- **Admin Dashboard**
  - User management
  - Order oversight
  - Analytics and reporting
  - Master data configuration
  - Two-step verification for high-value procurements (>50,000)

### 🎨 **UI/UX Features**
- **Responsive Design** - Optimized for all screen sizes (mobile, tablet, desktop)
- **Dark Mode Support** - Eye-friendly interface options
- **Smooth Animations** - Framer Motion powered transitions
- **Interactive Elements** - Engaging user interactions
- **Modern Aesthetics** - Glassmorphism and gradient designs
- **Loading Screens** - Beautiful loading animations
- **Toast Notifications** - Real-time feedback for user actions

---

## 🛠️ Built With

### **Core Technologies**
- **[Next.js 15.3.5](https://nextjs.org/)** - React framework with App Router
- **[React 19.0.0](https://reactjs.org/)** - UI library
- **[TypeScript 5.9.2](https://www.typescriptlang.org/)** - Type safety

### **Styling & UI**
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[React Icons](https://react-icons.github.io/react-icons/)** - Additional icons

### **Backend & Services**
- **[Firebase](https://firebase.google.com/)** - Backend services (Firestore, Authentication)
- **[Axios](https://axios-http.com/)** - HTTP client
- **Custom REST API** - Backend integration at `getmethis.in`

### **Forms & Validation**
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[React DatePicker](https://reactdatepicker.com/)** - Date selection

### **Additional Libraries**
- **[PayPal React SDK](https://www.npmjs.com/package/@paypal/react-paypal-js)** - Payment integration
- **[jsPDF](https://github.com/parallax/jsPDF)** - PDF generation
- **[React Toastify](https://fkhadra.github.io/react-toastify/)** - Notifications
- **[Three.js](https://threejs.org/)** & **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)** - 3D graphics
- **[Keen Slider](https://keen-slider.io/)** - Touch slider

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
Node.js >= 18.x
npm >= 9.x or yarn >= 1.22.x
Git
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sahilgholap007/GET-ME-THIS.git
   cd ship_global_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=https://getmethis.in/api/v1
   
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # PayPal Configuration
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 💻 Usage

### For Customers

1. **Register/Login** - Create an account or sign in
2. **Browse Products** - Explore global products through our personal shopper
3. **Place Orders** - Add items to cart and checkout
4. **Track Shipments** - Monitor your orders in real-time
5. **Manage Profile** - Update addresses and preferences

### For Businesses/Admins

1. **Access Admin Dashboard** - Login with admin credentials
2. **Create Procurement** - Submit purchase requests
3. **Approval Workflow** - Route requests through approval chain
4. **Payment Processing** - Manage payments and invoices
5. **Material Receipt** - Verify received materials
6. **Analytics** - View reports and insights

### Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🏗️ Project Structure

```
ship_global_frontend/
├── 📁 public/                  # Static assets
├── 📁 src/
│   ├── 📁 app/                 # Next.js App Router
│   │   ├── 📁 admin/           # Admin dashboard
│   │   ├── 📁 dashboard/       # User dashboard
│   │   ├── 📁 user-dashboard/  # Extended user features
│   │   ├── 📁 components/      # Landing page components
│   │   ├── 📁 login/           # Authentication pages
│   │   ├── 📁 register/
│   │   ├── 📁 verify-email/
│   │   ├── 📁 forgot-password/
│   │   ├── 📁 reset-password/
│   │   ├── 📁 information/     # Info pages
│   │   ├── 📁 contact/         # Contact page
│   │   ├── 📁 utils/           # Utility functions
│   │   ├── firebaseConfig.js   # Firebase setup
│   │   ├── globals.css         # Global styles
│   │   ├── layout.js           # Root layout
│   │   └── page.js             # Home page
│   ├── 📁 components/          # Reusable components
│   │   └── 📁 ui/              # UI primitives (Radix)
│   ├── 📁 hooks/               # Custom React hooks
│   └── 📁 lib/                 # Utility libraries
├── 📄 .env.local               # Environment variables
├── 📄 .firebaserc              # Firebase config
├── 📄 firebase.json            # Firebase hosting
├── 📄 next.config.mjs          # Next.js configuration
├── 📄 tailwind.config.js       # Tailwind configuration
├── 📄 tsconfig.json            # TypeScript configuration
├── 📄 package.json             # Dependencies
└── 📄 README.md                # This file
```

---

## 🔐 Authentication Flow

### Registration Flow
```
User Registration → OTP sent to email → Email Verification Page → 
Enter OTP → Verification Success → Auto-login → Dashboard
```

### Login Flow
```
User Login → Email Verified? → 
  ├─ Yes → Dashboard
  └─ No → Redirect to Email Verification
```

### Password Reset Flow
```
Forgot Password → Enter Email → OTP sent → 
Enter OTP + New Password → Password Reset Success → Login
```

### Key Features
- ✅ OTP-based email verification (6-digit code)
- ✅ 10-minute OTP expiry
- ✅ Resend OTP functionality with rate limiting
- ✅ Secure password reset
- ✅ JWT token-based authentication
- ✅ Protected routes and middleware

---

## 🎨 UI Components

### Radix UI Components Used
- **Dialog** - Modal windows
- **Dropdown Menu** - Context menus
- **Select** - Custom select inputs
- **Checkbox** - Form checkboxes
- **Switch** - Toggle switches
- **Tabs** - Tabbed interfaces
- **Accordion** - Collapsible content
- **Alert Dialog** - Confirmation dialogs
- **Tooltip** - Helpful hints
- **Popover** - Floating content
- **Scroll Area** - Custom scrollbars
- **Avatar** - User avatars
- **Separator** - Visual dividers

### Custom Components
- **Navbar** - Responsive navigation with mobile menu
- **Hero** - Animated landing section
- **LoadingScreen** - Beautiful loading animations
- **FloatingVideo** - Interactive video player
- **PublicTracker** - Order tracking interface
- **ShoppingCartGame** - Gamified shopping experience
- **PersonalShopperLanding** - AI assistant interface

---

## 📱 Responsive Design

The application is fully responsive across all devices:

- **Mobile** (320px - 767px) - Touch-optimized interface
- **Tablet** (768px - 1023px) - Adaptive layouts
- **Desktop** (1024px+) - Full-featured experience

### Mobile-Specific Features
- Hamburger menu navigation
- Touch-friendly buttons and inputs
- Optimized image loading
- Simplified layouts for small screens
- Bottom navigation for key actions

---

## 🔄 API Integration

### Base URL
- **Production**: `https://getmethis.in/api/v1`
- **Development**: `http://localhost:8000/api/v1`

### Key Endpoints

#### Authentication
- `POST /users/register/` - User registration
- `POST /users/login/` - User login
- `POST /users/verify-email/` - Email verification
- `POST /users/resend-verification/` - Resend OTP
- `POST /users/password-reset/request/` - Request password reset
- `POST /users/password-reset/confirm/` - Confirm password reset
- `GET /users/profile/` - Get user profile

#### Procurement
- `GET /procurements/` - List procurements
- `POST /procurements/` - Create procurement
- `GET /procurements/{id}/` - Get procurement details
- `PUT /procurements/{id}/approve/` - Approve procurement
- `PUT /procurements/{id}/payment/` - Process payment
- `PUT /procurements/{id}/material/` - Confirm material receipt

For detailed API documentation, see [BACKEND_API_CHANGES.md](./BACKEND_API_CHANGES.md)

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and email verification
- [ ] Login with verified/unverified accounts
- [ ] Password reset flow
- [ ] Procurement creation and approval
- [ ] Payment processing
- [ ] Material receipt confirmation
- [ ] Responsive design on multiple devices
- [ ] Form validation
- [ ] Error handling

### Test Credentials
```
Email: test@example.com
Password: TestPass123!
OTP (development): 123456
```

---

## 📦 Deployment

### Firebase Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Vercel Deployment

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on push to main

### Environment Variables for Production
Ensure all environment variables are set in your hosting platform:
- API URLs
- Firebase configuration
- PayPal credentials
- Any other secrets

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Coding Standards
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Contact

**Project Maintainer**: Sahil Gholap

- **GitHub**: [@sahilgholap007](https://github.com/sahilgholap007)
- **Project Link**: [https://github.com/sahilgholap007/GET-ME-THIS](https://github.com/sahilgholap007/GET-ME-THIS)
- **Website**: [https://getmethis.in](https://getmethis.in)
- **Support Email**: support@getmethis.in

---

<div align="center">

### 🌟 Star this repository if you find it helpful!

**Made with ❤️ by the GetMeThis Team**

[⬆ Back to Top](#-ship-global---getmethis)

</div>
