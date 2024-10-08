// App.js
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
import Signup from './Components/SignUp';
import SignIn from './Components/SignIn';
import CustomerDashboard from './Components/CustomerDashboard';
import AdminDashboard from './Components/AdminDashboard';
import { UserContextProvider } from './utils/UserContext';
import LoanApply from './Components/LoanApply';
import LoanApply2 from './Components/LoanApply2';
import TransferMoney from './Components/TransferMoney';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import OtherTransfer from './Components/OtherTransfer';
// Header Component
// const Header = () => {
//   return (
//     <header>
//       <h1>My Application Header</h1>
//     </header>
//   );
// };

// Body Component (will be rendered in Outlet)
// const Body = () => {
//   return (
//     <main>
//       <h2>This is the Body content</h2>
//       <p>Welcome to the body section of this page.</p>
//     </main>
//   );
// };

// Layout Component that contains the Header and Outlet
const AppLayout = () => {
  return (
    <UserContextProvider>
    <div className='App'>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <Header /> {/* Always visible */}
        <Outlet /> {/* This is where the Body component will render */}
    </div>
    </UserContextProvider>
  );
};

// Define the router
const appRouter = createBrowserRouter([
  {
    path: '/', // Root path
    element: <AppLayout />, // AppLayout includes Header and Outlet
    children: [
      {
        path: '/', // Empty path matches root
        element: <Home />, // Body will render inside the Outlet
      },
      {
        path:"/login",
        element:<Signup /> , // Login page will render inside the Outlet
      },
      {
        path:'/signIn',
        element: <SignIn />
      },
      {
        path: '/CustomerDashboard',
        element: <CustomerDashboard />
      },
      {
        path:'/AdminDashboard',
        element: <AdminDashboard />
      },
      {
        path: '/loanApply',
        element: <LoanApply2 />
      },
      {
        path:'/transfer',
        element: <TransferMoney />
      },
      {
        path:'/othertransfer',
        element: <OtherTransfer />
      },
      {
        path:'/AdminLogin',
        element:<SignIn />
      }
    ],
  },
]);

// Main App component
function App() {
  return (
    <RouterProvider router={appRouter} /> // Provide the router to the app
  );
}

export default App;
