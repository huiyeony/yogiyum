import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyPage from './pages/mypage';
import EditProfile from './pages/edit-profile';

function App() {
  return (
    <Routes>
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/edit-profile" element={<EditProfile />} />
    </Routes>
  );
}

export default App;
