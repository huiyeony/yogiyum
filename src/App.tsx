// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import TempPage from "./pages/temp";
import VerificationPage from "./pages/verification";

const App = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/temp" element={<TempPage />} />
        <Route path="/verification" element={<VerificationPage />} />
      </Route>
    </Routes>
  );
};

export default App;
