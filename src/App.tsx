import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Verify from './routes/Verify';
import Success from './routes/Success';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Verify />} />
        <Route path='/success' element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}
