import { Settings, User, BookOpen, MonitorPlay, FileEdit, HelpCircle, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="main-title-container">
        <div className="hero-icon-wrapper">
          <BookOpen size={60} className="hero-icon" />
        </div>
        <h1 className="main-title">الوضعية الذكية</h1>
        <p className="sub-title">منصة ذكية لصياغة ومحاكاة الوضعيات المشكلة</p>
        <p className="sub-title-accent">موجّهة لأساتذة التعليم الابتدائي</p>
      </div>

      <div className="cards-container">
        <div className="action-card primary-card">
          <div className="card-icon-wrapper">
            <FileEdit size={50} />
          </div>
          <h2 className="card-title">صياغة الوضعية المشكلة</h2>
          <p className="card-desc">أنشئ وضعيات مشكلة تعليمية مناسبة لمستوى تلاميذك</p>
          <Link to="/form" className="card-link-btn">
            بدء الصياغة
          </Link>
        </div>

        <div className="action-card primary-card">
          <div className="card-icon-wrapper" style={{ color: 'var(--wimbledon-lime)', background: 'var(--wimbledon-dark)' }}>
            <MonitorPlay size={50} />
          </div>
          <h2 className="card-title">محاكاة الوضعية</h2>
          <p className="card-desc">جرب وضعياتك وشاهد كيف يتفاعل التلاميذ معها خطوة بخطوة</p>
          <Link to="/simulation" className="card-link-btn">
            بدء المحاكاة
          </Link>
        </div>
      </div>

      <div className="footer-text">
        <Star size={16} className="accent-icon" />
        وضعيات مشكلة جيدة... تعلم نشط، تفكير عميق، وتلميذ فاعل
      </div>
    </div>
  );
}
