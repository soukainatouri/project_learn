import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function FormPage({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    level: '',
    domain: '',
    lessonTitle: '',
    targetLearnings: '',
    situationGoal: '',
    educationalObjectives: '',
    mathResources: '',
    context: '',
    contextDescription: '',
    situationType: '',
    difficulty: '',
    includes: [],
    taskRequired: '',
    finalProduct: '',
    solutionType: '',
    priorKnowledge: '',
    requiredSkills: '',
    numericData: '',
    units: [],
    qualityStandards: [],
    successCriteria: [],
    length: '',
    language: ''
  });

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const array = prev[field];
      if (array.includes(value)) {
        return { ...prev, [field]: array.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...array, value] };
      }
    });
  };

  const handleRadioChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-page">
      <button className="icon-btn" style={{ marginBottom: '20px' }} onClick={onBack}>
        <ArrowRight size={20} />
        عودة للرئيسية
      </button>

      <div className="form-header">
        <h2>استبيان صياغة الوضعية المشكلة في الرياضيات</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 1 */}
        <div className="form-section">
          <h3 className="form-section-title">1. معلومات الدرس</h3>
          
          <div className="form-group">
            <label className="form-label">المستوى الدراسي</label>
            <div className="radio-group">
              {['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'].map(level => (
                <label key={level} className={`radio-label ${formData.level === level ? 'selected' : ''}`}>
                  <input type="radio" name="level" value={level} checked={formData.level === level} onChange={() => handleRadioChange('level', level)} style={{display: 'none'}} />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">المجال الرياضي</label>
            <div className="radio-group">
              {['الأعداد والحساب', 'الهندسة', 'القياس', 'تنظيم ومعالجة البيانات'].map(domain => (
                <label key={domain} className={`radio-label ${formData.domain === domain ? 'selected' : ''}`}>
                  <input type="radio" name="domain" value={domain} checked={formData.domain === domain} onChange={() => handleRadioChange('domain', domain)} style={{display: 'none'}} />
                  <span>{domain}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">عنوان الدرس</label>
            <input type="text" className="form-input" name="lessonTitle" value={formData.lessonTitle} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">التعلمات المستهدفة</label>
            <input type="text" className="form-input" name="targetLearnings" value={formData.targetLearnings} onChange={handleChange} required />
          </div>
        </div>

        {/* Section 2 */}
        <div className="form-section">
          <h3 className="form-section-title">2. الكفايات والأهداف</h3>
          
          <div className="form-group">
            <label className="form-label">ما الهدف من الوضعية؟</label>
            <div className="radio-group">
              {['بناء تعلم جديد', 'استثمار التعلمات', 'تقويم التعلمات', 'دعم ومعالجة التعثرات'].map(goal => (
                <label key={goal} className={`radio-label ${formData.situationGoal === goal ? 'selected' : ''}`}>
                  <input type="radio" name="situationGoal" value={goal} checked={formData.situationGoal === goal} onChange={() => handleRadioChange('situationGoal', goal)} style={{display: 'none'}} />
                  <span>{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">الهدف أو الأهداف التعليمية</label>
            <input type="text" className="form-input" name="educationalObjectives" value={formData.educationalObjectives} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">الموارد الرياضية المراد تعبئتها</label>
            <input type="text" className="form-input" name="mathResources" value={formData.mathResources} onChange={handleChange} />
          </div>
        </div>

        {/* Section 3 */}
        <div className="form-section">
          <h3 className="form-section-title">3. سياق الوضعية</h3>
          
          <div className="form-group">
            <label className="form-label">اختر سياقاً قريباً من المتعلم</label>
            <div className="radio-group">
              {['التسوق', 'رحلة مدرسية', 'لعبة أو رياضة', 'الأسرة', 'الزراعة', 'البناء والهندسة', 'البيئة', 'سياق آخر'].map(ctx => (
                <label key={ctx} className={`radio-label ${formData.context === ctx ? 'selected' : ''}`}>
                  <input type="radio" name="context" value={ctx} checked={formData.context === ctx} onChange={() => handleRadioChange('context', ctx)} style={{display: 'none'}} />
                  <span>{ctx}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">وصف مختصر للسياق</label>
            <input type="text" className="form-input" name="contextDescription" value={formData.contextDescription} onChange={handleChange} required />
          </div>
        </div>

        {/* Section 4 */}
        <div className="form-section">
          <h3 className="form-section-title">4. خصائص الوضعية المشكلة</h3>
          
          <div className="form-group">
            <label className="form-label">نوع الوضعية</label>
            <div className="radio-group">
              {['وضعية بناء التعلم', 'وضعية إدماج', 'وضعية تقويم', 'مشروع مصغر'].map(type => (
                <label key={type} className={`radio-label ${formData.situationType === type ? 'selected' : ''}`}>
                  <input type="radio" name="situationType" value={type} checked={formData.situationType === type} onChange={() => handleRadioChange('situationType', type)} style={{display: 'none'}} />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">درجة الصعوبة</label>
            <div className="radio-group">
              {['بسيطة', 'متوسطة', 'مرتفعة'].map(diff => (
                <label key={diff} className={`radio-label ${formData.difficulty === diff ? 'selected' : ''}`}>
                  <input type="radio" name="difficulty" value={diff} checked={formData.difficulty === diff} onChange={() => handleRadioChange('difficulty', diff)} style={{display: 'none'}} />
                  <span>{diff}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">هل تريد أن تتضمن الوضعية:</label>
            <div className="checkbox-group">
              {['معطيات زائدة', 'معطيات ناقصة', 'أكثر من طريقة للحل', 'رسماً أو شكلاً هندسياً', 'جدولاً', 'مخططاً', 'بيانات إحصائية'].map(inc => (
                <label key={inc} className={`checkbox-label ${formData.includes.includes(inc) ? 'selected' : ''}`}>
                  <input type="checkbox" checked={formData.includes.includes(inc)} onChange={() => handleCheckboxChange('includes', inc)} style={{display: 'none'}} />
                  <span>{inc}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="form-section">
          <h3 className="form-section-title">5. المهمة الرياضية</h3>
          
          <div className="form-group">
            <label className="form-label">ما المطلوب من المتعلم إنجازه؟</label>
            <input type="text" className="form-input" name="taskRequired" value={formData.taskRequired} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">المنتوج النهائي المنتظر</label>
            <input type="text" className="form-input" name="finalProduct" value={formData.finalProduct} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">هل الحل فردي أم جماعي؟</label>
            <div className="radio-group">
              {['فردي', 'ثنائي', 'مجموعات'].map(sol => (
                <label key={sol} className={`radio-label ${formData.solutionType === sol ? 'selected' : ''}`}>
                  <input type="radio" name="solutionType" value={sol} checked={formData.solutionType === sol} onChange={() => handleRadioChange('solutionType', sol)} style={{display: 'none'}} />
                  <span>{sol}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Section 6 */}
        <div className="form-section">
          <h3 className="form-section-title">6. الموارد السابقة الضرورية</h3>
          
          <div className="form-group">
            <label className="form-label">ما المعارف السابقة التي يفترض توفرها لدى المتعلم؟</label>
            <input type="text" className="form-input" name="priorKnowledge" value={formData.priorKnowledge} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">ما المهارات الرياضية المطلوبة؟</label>
            <input type="text" className="form-input" name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} />
          </div>
        </div>

        {/* Section 7 */}
        <div className="form-section">
          <h3 className="form-section-title">7. المعطيات الرقمية</h3>
          
          <div className="form-group">
            <label className="form-label">الأعداد أو القياسات المراد استعمالها</label>
            <input type="text" className="form-input" name="numericData" value={formData.numericData} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">الوحدات المستعملة</label>
            <div className="checkbox-group">
              {['الدرهم', 'المتر', 'السنتيمتر', 'اللتر', 'الكيلوغرام', 'الزمن', 'أخرى'].map(unit => (
                <label key={unit} className={`checkbox-label ${formData.units.includes(unit) ? 'selected' : ''}`}>
                  <input type="checkbox" checked={formData.units.includes(unit)} onChange={() => handleCheckboxChange('units', unit)} style={{display: 'none'}} />
                  <span>{unit}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Section 8 */}
        <div className="form-section">
          <h3 className="form-section-title">8. معايير جودة الوضعية</h3>
          <div className="checkbox-group">
            {['مرتبطة بواقع المتعلم', 'تشكل تحدياً معرفياً', 'تستدعي البحث والتفكير', 'تسمح بتعبئة موارد متعددة', 'لها أكثر من استراتيجية للحل', 'تحفز المناقشة والتبرير', 'تنمي النمذجة الرياضية', 'تنمي التواصل الرياضي'].map(std => (
              <label key={std} className={`checkbox-label ${formData.qualityStandards.includes(std) ? 'selected' : ''}`}>
                <input type="checkbox" checked={formData.qualityStandards.includes(std)} onChange={() => handleCheckboxChange('qualityStandards', std)} style={{display: 'none'}} />
                <span>{std}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 9 */}
        <div className="form-section">
          <h3 className="form-section-title">9. التقويم</h3>
          <label className="form-label">معايير النجاح</label>
          <div className="checkbox-group">
            {['فهم المطلوب', 'اختيار الاستراتيجية المناسبة', 'إنجاز العمليات بشكل صحيح', 'تنظيم الحل', 'تبرير الإجابة', 'التحقق من النتيجة'].map(crit => (
              <label key={crit} className={`checkbox-label ${formData.successCriteria.includes(crit) ? 'selected' : ''}`}>
                <input type="checkbox" checked={formData.successCriteria.includes(crit)} onChange={() => handleCheckboxChange('successCriteria', crit)} style={{display: 'none'}} />
                <span>{crit}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 10 */}
        <div className="form-section">
          <h3 className="form-section-title">10. إعدادات التوليد</h3>
          
          <div className="form-group">
            <label className="form-label">عدد أسطر الوضعية</label>
            <div className="radio-group">
              {['قصيرة (3–5 أسطر)', 'متوسطة (6–10 أسطر)', 'مفصلة'].map(len => (
                <label key={len} className={`radio-label ${formData.length === len ? 'selected' : ''}`}>
                  <input type="radio" name="length" value={len} checked={formData.length === len} onChange={() => handleRadioChange('length', len)} style={{display: 'none'}} />
                  <span>{len}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">لغة الصياغة</label>
            <div className="radio-group">
              {['عربية مبسطة', 'عربية فصحى'].map(lang => (
                <label key={lang} className={`radio-label ${formData.language === lang ? 'selected' : ''}`}>
                  <input type="radio" name="language" value={lang} checked={formData.language === lang} onChange={() => handleRadioChange('language', lang)} style={{display: 'none'}} />
                  <span>{lang}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          إنشاء الوضعية المشكلة
        </button>
      </form>
    </div>
  );
}
