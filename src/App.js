// App.js
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
import Signup from './Components/SignUp';
import SignIn from './Components/SignIn';
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
    <div>
      <Header /> {/* Always visible */}
      <Outlet /> {/* This is where the Body component will render */}
    </div>
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
