import { supabase } from './supabaseClient';
import { LogOut, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ session }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        الوضعية المشكلة في الرياضيات
      </div>
      <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={() => navigate('/')} className="nav-home-btn">
          <Home size={16} />
          الرئيسية
        </button>
        <span>{session.user.email}</span>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={16} />
          تسجيل الخروج
        </button>
      </div>
    </nav>
  );
}
