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
      {/* 헤더 없는게 시각적으로 깔끔 + 요기얌 누르면 메인페이지로 이동 가능 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/temp" element={<TempPage />} />

      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />

        <Route path="/temp" element={<TempPage />} />
        <Route path="/verification" element={<VerificationPage />} />
      </Route>
    </Routes>
  );
};

export default App;
