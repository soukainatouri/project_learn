import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateSituations, generateSituationDetails } from './groqClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function ResultsPage({ formData }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [situations, setSituations] = useState([]);
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If user refreshes or navigates directly here without form data, send them back
    if (!formData) {
      navigate('/form');
      return;
    }
    const fetchSituations = async () => {
      try {
        setLoading(true);
        const results = await generateSituations(formData);
        setSituations(results);
      } catch (err) {
        setError('حدث خطأ أثناء توليد الوضعيات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };
    fetchSituations();
  }, [formData, navigate]);

  const handleSelect = async (situation) => {
    setSelectedSituation(situation);
    try {
      setDetailsLoading(true);
      const resultDetails = await generateSituationDetails(formData, situation);
      setDetails(resultDetails);
    } catch (err) {
      setError('حدث خطأ أثناء توليد التفاصيل.');
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="results-page">
      <button className="icon-btn back-btn" onClick={() => navigate('/form')}>
        <ArrowRight size={20} />
        عودة للنموذج
      </button>

      {error && <div style={{color: 'red', marginBottom: '20px', textAlign: 'center'}}>{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <h3>جاري صياغة الوضعيات المشكلة بذكاء...</h3>
          <p>يرجى الانتظار قليلاً</p>
        </div>
      ) : (
        <>
          {!selectedSituation ? (
            <>
              <div className="form-header">
                <h2>الوضعيات المقترحة</h2>
                <p>اختر الوضعية التي تناسبك لاستكمال التفاصيل</p>
              </div>

              {situations.map((sit, index) => (
                <div key={index} className="result-card">
                  <div className="result-header">
                    <h3 className="result-title">الخيار {index + 1}</h3>
                    <button className="select-btn" onClick={() => handleSelect(sit)}>اختيار هذه الوضعية</button>
                  </div>
                  <div className="result-content">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm, remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {sit}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="form-header">
                <h2>تفاصيل الوضعية المختارة</h2>
              </div>
              
              <div className="result-card" style={{borderColor: '#4caf50', background: '#f9fdf9'}}>
                <div className="result-header">
                  <h3 className="result-title" style={{color: '#388e3c', display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <CheckCircle size={24} />
                    الوضعية المشكلة
                  </h3>
                </div>
                <div className="result-content">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                  >
                    {selectedSituation}
                  </ReactMarkdown>
                </div>
              </div>

              {detailsLoading ? (
                <div className="loading-container" style={{marginTop: '40px'}}>
                  <div className="spinner"></div>
                  <h3>جاري إعداد الحلول والشبكات وباقي التفاصيل...</h3>
                </div>
              ) : (
                <div className="detail-section">
                  <h3>التحليل والحلول</h3>
                  <div className="detail-content">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm, remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {details}
                    </ReactMarkdown>
                  </div>
                  
                  <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                    <button 
                      className="submit-btn generate-sim-btn" 
                      onClick={() => navigate('/simulation', { state: { initialSituation: selectedSituation } })}
                      style={{ background: '#6366f1' }}
                    >
                      توليد قصة مصورة لهذه الوضعية
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
