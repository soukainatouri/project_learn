import { useState } from 'react';
import { ArrowRight, Wand2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateStoryScenes } from './groqClient';

export default function SimulationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [situationText, setSituationText] = useState(location.state?.initialSituation || '');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [readyScenes, setReadyScenes] = useState([]);
  const [error, setError] = useState(null);

  // We are using the new router.huggingface.co endpoint which bypasses the ISP block!
  const generateHFImage = async (prompt) => {
    const apiKey = import.meta.env.VITE_HF_API_KEY;
    if (!apiKey || apiKey === 'YOUR_HF_API_KEY_HERE') {
      throw new Error('MISSING_API_KEY');
    }

    // Using the Hugging Face Router API (unblocked by Inwi!)
    // Switching to FLUX.1-schnell since Stable Diffusion XL is deprecated on this router
    const response = await fetch('https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Hugging Face Error:', errText);
      throw new Error(`Failed to generate image. Status: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  const handleGenerate = async () => {
    if (!situationText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setReadyScenes([]);
    setImagesLoaded(0);
    setTotalImages(0);
    
    try {
      // Phase 1: Generate scene descriptions from Groq
      setLoadingPhase('scenes');
      const generatedScenes = await generateStoryScenes(situationText);

      if (!generatedScenes || generatedScenes.length === 0) {
        setError('لم نتمكن من توليد المشاهد. يرجى المحاولة مرة أخرى.');
        setIsLoading(false);
        return;
      }

      // Phase 2: Generate images via Hugging Face Router
      setLoadingPhase('images');
      setTotalImages(generatedScenes.length);

      const loadedScenes = [];
      // Sequential loading
      for (let i = 0; i < generatedScenes.length; i++) {
        const scene = generatedScenes[i];
        try {
          const blobUrl = await generateHFImage(scene.imagePrompt);
          loadedScenes.push({ ...scene, imageUrl: blobUrl });
        } catch (err) {
          if (err.message === 'MISSING_API_KEY') {
            setError('يرجى إضافة مفتاح Hugging Face في ملف .env.local لتوليد الصور.');
            setIsLoading(false);
            return;
          }
          console.error(`Failed to generate image for scene ${i+1}:`, err);
          // Fallback to a placeholder if generation fails so the story isn't completely broken
          loadedScenes.push({ 
            ...scene, 
            imageUrl: `https://placehold.co/800x600/e2e8f0/475569?text=Image+Generation+Failed+for+Scene+${i+1}` 
          });
        }
        setImagesLoaded(i + 1);
      }

      setReadyScenes(loadedScenes);
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
              <p>جاري رسم الصور عبر Hugging Face... ({imagesLoaded} / {totalImages})</p>
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
