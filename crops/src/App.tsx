import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Signout from './pages/auth/Signout'; 

import Home from './pages/home';
import { Contact } from './pages/contact';
import { SoilSamplingForm } from './pages/soil-sampling-form';
import { About } from './pages/about';
import { Analysis } from './pages/analysis'; 
import { FAQ } from './pages/faq'; 

function App() {
  const token = localStorage.getItem("token");

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <main className="min-h-screen bg-background">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signout" element={<Signout />} />
            <Route path="/dashboard" element={token ? <Home /> : <Navigate to="/login" />} />
            <Route path="/" element={<Home />} />
            <Route path="/soil-sampling" element={<SoilSamplingForm />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </Router>
        <Toaster />
      </main>
    </ThemeProvider>
  );
}

export default App;