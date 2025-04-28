import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Login from '../components/others/Login'
import Register from '../components/others/Register'
// import AdminLogin from '../pages/Admin';

// const adminRoute = import.meta.env.ALUMNI_CONNECT_ADMIN_ROUTE;

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/home" element={<Home/>} />
      {/* <Route path = {`/${adminRoute}`} element={<AdminLogin/>} /> */}
    </Routes>
  </BrowserRouter>
  )
}

export default App