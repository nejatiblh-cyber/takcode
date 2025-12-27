import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300" dir="rtl">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
