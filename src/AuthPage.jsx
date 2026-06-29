import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني.');
      }
    } catch (error) {
      let errorMsg = error.message || '';
      if (errorMsg.includes('Invalid login credentials')) {
        setMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (errorMsg.includes('User already registered')) {
        setMessage('هذا البريد الإلكتروني مسجل بالفعل.');
      } else if (errorMsg.includes('Password should be at least')) {
        setMessage('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.');
      } else {
        setMessage('حدث خطأ أثناء المصادقة. الرجاء المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h2>
        
        {message && <div className="auth-message">{message}</div>}

        <form onSubmit={handleAuth} className="auth-form">
          <div className="form-group">
            <label className="form-label">البريد الإلكتروني</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'جاري التحميل...' : (isLogin ? 'دخول' : 'تسجيل')}
          </button>
        </form>

        <button 
          className="toggle-auth-btn" 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'ليس لديك حساب؟ قم بإنشاء واحد' : 'لديك حساب بالفعل؟ قم بتسجيل الدخول'}
        </button>
      </div>
    </div>
  );
}
