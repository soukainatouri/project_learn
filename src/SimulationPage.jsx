import { useState, useRef } from 'react';
import { ArrowRight, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateStoryScenes } from './groqClient';

export default function SimulationPage() {
  const navigate = useNavigate();
  const [situationText, setSituationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [readyScenes, setReadyScenes] = useState([]);
  const [error, setError] = useState(null);
  const seedRef = useRef(Math.floor(Math.random() * 10000));

  const getImageUrl = (prompt) => {
    const encodedPrompt = encodeURIComponent(prompt);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&seed=${seedRef.current}`;
  };

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  // Load a single image with retry logic for Pollinations rate limiting
  const loadSingleImage = (url, retries = 3) => {
    return new Promise((resolve) => {
      const attempt = (attemptsLeft) => {
        const img = new Image();
        img.onload = () => {
          // Check it's a real image, not an error JSON response
          if (img.naturalWidth > 1) {
            resolve(true);
          } else if (attemptsLeft > 0) {
            setTimeout(() => attempt(attemptsLeft - 1), 5000);
          } else {
            resolve(false);
          }
        };
        img.onerror = () => {
          if (attemptsLeft > 0) {
            setTimeout(() => attempt(attemptsLeft - 1), 5000);
          } else {
            resolve(false);
          }
        };
        img.src = url;
      };
      attempt(retries);
    });
  };

  const handleGenerate = async () => {
    if (!situationText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setReadyScenes([]);
    setImagesLoaded(0);
    setTotalImages(0);
    seedRef.current = Math.floor(Math.random() * 10000);
    
    try {
      // Phase 1: Generate scene descriptions from Groq
      setLoadingPhase('scenes');
      const generatedScenes = await generateStoryScenes(situationText);

      if (!generatedScenes || generatedScenes.length === 0) {
        setError('لم نتمكن من توليد المشاهد. يرجى المحاولة مرة أخرى.');
        setIsLoading(false);
        return;
      }

      // Phase 2: Load images ONE BY ONE with retries
      // Pollinations.ai only allows 1 request at a time per IP
      setLoadingPhase('images');
      setTotalImages(generatedScenes.length);

      const scenesWithUrls = generatedScenes.map(scene => ({
        ...scene,
        imageUrl: getImageUrl(scene.imagePrompt)
      }));

      // Sequential loading with delay between each image
      for (let i = 0; i < scenesWithUrls.length; i++) {
        if (i > 0) await delay(3000); // Wait 3s between images to let the server queue clear
        await loadSingleImage(scenesWithUrls[i].imageUrl);
        setImagesLoaded(i + 1);
      }

      setReadyScenes(scenesWithUrls);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء الاتصال بالخادم. تأكد من إعدادات الشبكة.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="simulation-page">
      <button className="icon-btn back-btn" onClick={() => navigate(-1)}>
        <ArrowRight size={20} />
        عودة
      </button>

      <div className="form-header">
        <h2>محاكاة الوضعية المشكلة</h2>
        <p className="sub-title" style={{ marginTop: '10px' }}>
          قم بلصق نص الوضعية المشكلة هنا، وسنقوم بتحويلها إلى قصة مصورة (كوميكس) لتسهيل فهمها على المتعلمين.
        </p>
      </div>

      <div className="examples-section">
        <label className="form-label">أمثلة جاهزة (اضغط لاستعمالها):</label>
        <div className="examples-list">
          {[
            'ذهبت مريم إلى السوق لشراء لوازم حفلة نجاحها. اشترت 3 كيلوغرامات من التفاح بثمن 15 درهماً للكيلوغرام الواحد، وقالب حلوى بـ 120 درهماً. إذا كانت مريم تملك ورقة نقدية من فئة 200 درهم، فهل سيكفيها المبلغ لتسديد ثمن مشترياتها؟ وكم سيعيد لها البائع؟',
            'يريد أحمد أن يسيّج حديقته المستطيلة الشكل التي يبلغ طولها 12 متراً وعرضها 8 أمتار. إذا كان ثمن المتر الواحد من السياج هو 25 درهماً، فما هو المبلغ الإجمالي الذي سيدفعه أحمد؟',
            'نظمت مدرسة النجاح رحلة مدرسية لـ 120 تلميذاً. تم توزيعهم بالتساوي على 4 حافلات. في كل حافلة، جلس التلاميذ في صفوف من 5 مقاعد. كم عدد الصفوف المملوءة في كل حافلة؟'
          ].map((example, i) => (
            <button
              key={i}
              className="example-btn"
              onClick={() => setSituationText(example)}
            >
              <span className="example-number">{i + 1}</span>
              <span className="example-text">{example.slice(0, 60)}...</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <textarea 
          className="form-input situation-textarea" 
          placeholder="اكتب أو انسخ نص الوضعية المشكلة هنا..."
          value={situationText}
          onChange={(e) => setSituationText(e.target.value)}
        ></textarea>
      </div>

      <button 
        className="submit-btn generate-sim-btn" 
        onClick={handleGenerate} 
        disabled={isLoading || !situationText.trim()}
      >
        {isLoading ? 'جاري التوليد...' : (
          <>
            <Wand2 size={24} style={{ marginLeft: '10px', display: 'inline' }} />
            توليد القصة المصورة
          </>
        )}
      </button>

      {error && (
        <div className="auth-message error-message" style={{ marginTop: '20px', borderColor: '#ef4444', color: '#b91c1c' }}>
          {error}
        </div>
      )}

      {isLoading && (
        <div className="loading-container" style={{ marginTop: '40px' }}>
          <div className="spinner"></div>
          {loadingPhase === 'scenes' && (
            <p>نقوم الآن بتحليل الوضعية وكتابة المشاهد...</p>
          )}
          {loadingPhase === 'images' && (
            <>
              <p>جاري رسم الصور... ({imagesLoaded} / {totalImages})</p>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: totalImages > 0 ? `${(imagesLoaded / totalImages) * 100}%` : '0%' }}
                ></div>
              </div>
            </>
          )}
        </div>
      )}

      {readyScenes.length > 0 && !isLoading && (
        <div className="comic-grid">
          {readyScenes.map((scene, index) => (
            <div key={index} className="comic-panel">
              <div className="panel-number">{index + 1}</div>
              <div className="panel-image-container">
                <img 
                  src={scene.imageUrl} 
                  alt={scene.arabicCaption} 
                  className="panel-image"
                />
              </div>
              <div className="panel-caption">
                {scene.arabicCaption}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
