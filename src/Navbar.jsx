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
      <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate('/')} className="icon-btn" style={{ fontSize: '14px', padding: '6px 12px' }}>
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
