import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import Home from "./pages/Home";
import Recent from "./pages/Recent";
import Mystuff from "./pages/Mystuff";
import Search from "./pages/Search";
import SignIn from "./pages/SignIn";
import Footer from "./components/Footer";
import "./index.css";
import Signout from "./pages/Signout";
import Signup from "./pages/Signup";
import Question from "./pages/Question";
import QuestionPage from "./pages/QuestionPage";
import Myaccount from "./pages/Myaccount";
import ProfileInfo from "./pages/ProfileInfo";
import { UserProvider } from "./contexts/UserContext";
import { TextProvider } from "./contexts/TextContext";
import PaymentHistory from "./stripeservices/PaymentHistory";
import PaymentMethods from "./stripeservices/PaymentMethods";
import Security from "./pages/Security";
import ExpertsNavigation from "./components/ExpertsNavigation";
import Cheggexperts from "./pages/Cheggexperts";
import ExpertsSignup from "./pages/ExpertsSignUp";
import MainPage from "./pages/MainPage";
import SubmitQuestion from "./pages/SubmitQuestion";
import Forgotpassword from "./pages/Forgotpassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route index element={<Home />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/mystuff" element={<Mystuff />} />
          <Route path="/search" element={<Search />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signout" element={<Signout />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/question/:id" element={<QuestionPage />} />
          <Route path="/api/v1/users/resetPassword/:token" element={<ResetPassword />} />
          <Route path="/my/account" element={<Myaccount />} />
          <Route path="/my/profile" element={<ProfileInfo />} />
          <Route path="/my/orders" element={<PaymentHistory />} />
          <Route path="/my/payments" element={<PaymentMethods />} />
          <Route path="/my/security" element={<Security/>} />
          <Route path="/cheggindia" element={<Cheggexperts/>} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/cheggindia/signup" element={<ExpertsSignup />} />
          <Route path="/cheggindia/mainpage" element={<MainPage />} />
          <Route path="/submit-question" element={<SubmitQuestion />} />
        </Routes>
        <Footer />
      </Router>
      </TextProvider>
      </UserProvider>
    </QueryClientProvider>
    
  </React.StrictMode>
);
