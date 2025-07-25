import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import TempPage from "./pages/temp";
import VerificationPage from "./pages/verification";
import MainPage from "./pages/Main";
import Layout from "./components/Layout";
import RestaurantDetailPage from "./pages/RestaurantDetail";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/temp" element={<TempPage />} />
        <Route path="/verification" element={<VerificationPage />} />
      </Route>
    </Routes>
  );
};

export default App;

