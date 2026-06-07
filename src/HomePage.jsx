import { Settings, User, BookOpen, MonitorPlay, FileEdit, HelpCircle, Star, Heart } from 'lucide-react';

export default function HomePage({ onStartForm }) {
  return (
    <div className="home-page">
      <header className="home-header">
        <button className="icon-btn">
          <Settings size={20} />
          الإعدادات
        </button>
        <button className="icon-btn">
          الأستاذ/ة
          <User size={20} />
        </button>
      </header>

      <div className="main-title-container">
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '10px'}}>
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            <BookOpen size={60} color="#1976d2" style={{ position: 'absolute', bottom: 0, left: '10px' }} />
            <div style={{ position: 'absolute', top: 0, left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: '#ffeb3b', boxShadow: '0 0 20px #ffeb3b' }}></div>
          </div>
        </div>
        <h1 className="main-title">الوضعية الذكية</h1>
        <p className="sub-title">منصة ذكية لصياغة ومحاكاة الوضعيات المشكلة</p>
        <p className="sub-title-2">موجّهة لأساتذة التعليم الابتدائي</p>
      </div>

      <div className="cards-container">
        <div className="action-card green-card">
          <div className="card-icon-wrapper">
            <FileEdit size={50} />
          </div>
          <h2 className="card-title">صياغة الوضعية المشكلة</h2>
          <p className="card-desc">أنشئ وضعيات مشكلة تعليمية مناسبة لمستوى تلاميذك</p>
          <button className="card-btn" onClick={onStartForm}>
            بدء الصياغة
          </button>
        </div>

        <button className="help-btn">?</button>

        <div className="action-card blue-card">
          <div className="card-icon-wrapper">
            <MonitorPlay size={50} />
          </div>
          <h2 className="card-title">محاكاة الوضعية</h2>
          <p className="card-desc">جرب وضعياتك وشاهد كيف يتفاعل التلاميذ معها خطوة بخطوة</p>
          <button className="card-btn">
            بدء المحاكاة
          </button>
        </div>
      </div>

      <div className="footer-text">
        <Star size={16} color="#4caf50" />
        وضعيات مشكلة جيدة... تعلم نشط، تفكير عميق، وتلميذ فاعل
        <Heart size={16} color="#f44336" />
      </div>
    </div>
  );
}
