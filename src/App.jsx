import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import HomePage from './HomePage';
import FormPage from './FormPage';
import ResultsPage from './ResultsPage';
import AuthPage from './AuthPage';
import Navbar from './Navbar';
import SimulationPage from './SimulationPage';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFormSubmit = async (data) => {
    setFormData(data);
    
    if (session?.user) {
      try {
        await supabase.from('form_submissions').insert([
          { user_id: session.user.id, payload: data }
        ]);
      } catch(err) {
        console.warn("Failed to save to Supabase (table might not exist yet).", err);
      }
    }

    navigate('/results');
  };

  if (loadingSession) {
    return <div className="loading-screen">جاري التحميل...</div>;
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <>
      <Navbar session={session} />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<FormPage onSubmit={handleFormSubmit} />} />
          <Route path="/results" element={<ResultsPage formData={formData} />} />
          <Route path="/simulation" element={<SimulationPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
