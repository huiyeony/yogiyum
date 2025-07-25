import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';
import TempPage from './pages/temp';
import VerificationPage from './pages/verification';
import MyPage from './pages/mypage';
import EditProfile from './pages/edit-profile';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/temp" element={<TempPage />} />
      <Route path="/verification" element={<VerificationPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/edit-profile" element={<EditProfile />} />
    </Routes>
  );
};

export default App;
