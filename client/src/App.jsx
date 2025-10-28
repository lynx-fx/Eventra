import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "./component/landing.jsx";
import LoginPage from "./component/login/loginPage.jsx";
import Signup from "./component/login/signup.jsx";
import NotFound from "./component/notFound.jsx";
import Dashboard from "./component/dashboard.jsx";

function App() {
  return (
    <>
      <Toaster richColors />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
