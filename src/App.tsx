import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import TempPage from "./pages/temp";
import VerificationPage from "./pages/verification";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/temp" element={<TempPage />} />
      <Route path="/verification" element={<VerificationPage />} />
    </Routes>
  );
};

export default App;
