import { supabase } from './supabaseClient';
import { LogOut } from 'lucide-react';

export default function Navbar({ session }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        الوضعية المشكلة في الرياضيات
      </div>
      <div className="navbar-user">
        <span>{session.user.email}</span>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={16} />
          تسجيل الخروج
        </button>
      </div>
    </nav>
  );
}
