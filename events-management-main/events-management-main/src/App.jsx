import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import BookDetailsPage from './Pages/BookDetailsPage'
import Login from './Pages/Login'
import WishList from './Pages/WishList'
import ReviewsPage from './Pages/ReviewsPage'
import SignUp from './Pages/SignUp'
import NotFoundPage from './Pages/NotFoundPage'
import Layout from './Layout/Layout'
import ProfilePage from './Pages/ProfilePage'
import HomePage from './Pages/HomePage'
import BookPage from './Pages/BookPage'
import Cart from './Pages/Cart'
import { Toaster } from 'react-hot-toast';
import PaymentPage from './Pages/PatmentPage'
import Dashboard from './Pages/Dashboard'
import CreateEventPage from './Pages/CreateEventPage'
import AdminLogin from './Pages/AdminLogin'

// استيراد الـ Provider الخاص بكِ هنا 👇
import { AppProvider } from './context/AppContext' 

window.scrollTo({ top: 0, behavior: 'smooth' });

// إنشاء الراوتر كما هو دون تعديل
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "book-details", element: <BookDetailsPage /> },
      { path: "booking", element: <BookPage /> },
      { path: "cart", element: <Cart /> },
      { path: "login", element: <Login /> },
      { path: "admin", element: <AdminLogin /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "wishlist", element: <WishList /> },
      { path: "reviews", element: <ReviewsPage /> },
      { path: "signup", element: <SignUp /> },
      { path: "*", element: <NotFoundPage /> }, 
      { path: "payment", element: <PaymentPage /> }, 
      { path: "dashboard", element: <Dashboard /> }, 
      { path: "create-event", element: <CreateEventPage /> },
    ],
  },
]);

export default function App() {
  return (
    
    <AppProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </AppProvider>
  )
}