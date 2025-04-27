import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
// import AdminLogin from '../pages/Admin';

// const adminRoute = import.meta.env.ALUMNI_CONNECT_ADMIN_ROUTE;

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/SignIn" element={<SignIn/>} />
      <Route path="/SignUp" element={<SignUp/>} />
      {/* <Route path = {`/${adminRoute}`} element={<AdminLogin/>} /> */}
    </Routes>
  </BrowserRouter>
  )
}

export default App