import { Route, Routes } from "react-router-dom";
import IntroPage from "@/pages/IntroPage";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";

import MainPage from "./pages/Main";
import Layout from "./components/Layout";
import RestaurantDetailPage from "./pages/RestaurantDetail";
import MyPage from "./pages/mypage";
import EditProfile from "./pages/edit-profile";
import LikedRestaurantsPage from "./pages/LikedRestaurantsPage";

const App = () => {
  return (
    <Routes>
      {/* 헤더 없는게 시각적으로 깔끔한 페이지*/}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* 인트로 페이지 추가 */}
      <Route path="/" element={<IntroPage />} />
      <Route element={<Layout />}>
        <Route path="/main" element={<MainPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
        <Route path="/liked" element={<LikedRestaurantsPage />} />

        <Route path="/mypage" element={<MyPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Route>
    </Routes>
  );
};

export default App;
