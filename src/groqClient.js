import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

export const generateSituations = async (formData) => {
  const prompt = `
أنت خبير تربوي متخصص في تدريس الرياضيات بالابتدائي وفق المقاربة بالكفايات المعتمدة في المنهاج المغربي.

بناءً على المعلومات التالية التي قدمها الأستاذ:

- المستوى الدراسي: ${formData.level}
- المجال الرياضي: ${formData.domain}
- عنوان الدرس: ${formData.lessonTitle}
- التعلمات المستهدفة: ${formData.targetLearnings}
- الهدف من الوضعية: ${formData.situationGoal}
- الأهداف التعليمية: ${formData.educationalObjectives}
- الموارد الرياضية: ${formData.mathResources}
- سياق الوضعية: ${formData.context} (${formData.contextDescription})
- نوع الوضعية: ${formData.situationType}
- درجة الصعوبة: ${formData.difficulty}
- تتضمن الوضعية: ${(formData.includes || []).join("، ")}
- المهمة المطلوبة: ${formData.taskRequired}
- المنتوج النهائي: ${formData.finalProduct}
- نوع الحل: ${formData.solutionType}
- المعارف السابقة: ${formData.priorKnowledge}
- المهارات المطلوبة: ${formData.requiredSkills}
- المعطيات الرقمية: ${formData.numericData}
- الوحدات: ${(formData.units || []).join("، ")}
- طول الوضعية: ${formData.length}
- لغة الصياغة: ${formData.language}

### معايير جودة الوضعية الإلزامية:
يرجى التأكد بشكل صارم من أن الوضعيات المقترحة تستوفي جميع المعايير التالية:
- مرتبطة بواقع المتعلم
- تشكل تحدياً معرفياً
- تستدعي البحث والتفكير
- تسمح بتعبئة موارد متعددة
- لها أكثر من استراتيجية للحل
- تحفز المناقشة والتبرير
- تنمي النمذجة الرياضية
- تنمي التواصل الرياضي

### معايير النجاح والتقويم الإلزامية:
يجب أن تسمح الوضعية بتقويم قدرة المتعلم على:
- فهم المطلوب
- اختيار الاستراتيجية المناسبة
- إنجاز العمليات بشكل صحيح
- تنظيم الحل
- تبرير الإجابة
- التحقق من النتيجة

المطلوب:
اكتب 3 خيارات (أمثلة) لوضعية مشكلة مختلفة في الرياضيات تناسب هذه المعطيات بشكل دقيق وتوافق المنهاج المغربي للابتدائي. 
اكتب فقط نص الوضعية لكل خيار بشكل واضح وجذاب للمتعلم.
افصل بين الخيارات بـ "---".
الخيار الأول:
...
---
الخيار الثاني:
...
---
الخيار الثالث:
...
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    const response = chatCompletion.choices[0]?.message?.content || "";
    return response.split("---").map(s => s.trim()).filter(s => s.length > 0);
  } catch (error) {
    console.error("Error generating situations:", error);
    throw error;
  }
};

export const generateSituationDetails = async (formData, selectedSituation) => {
  const prompt = `
أنت خبير تربوي متخصص في تدريس الرياضيات بالابتدائي في المغرب.
الوضعية المشكلة المختارة هي:
"${selectedSituation}"

قم بإنتاج التفاصيل التالية لهذه الوضعية بناءً على المعطيات المحددة، واحرص على دمج معايير النجاح وجودة الوضعية:
1. الحل النموذجي
2. تحليل الموارد المعبأة
3. العقبات المتوقعة
4. شبكات التقويم (مبنية على: فهم المطلوب، اختيار الاستراتيجية، إنجاز العمليات، تنظيم الحل، تبرير الإجابة، التحقق من النتيجة)
5. سيناريو المحاكاة خطوة بخطوة
6. اقتراحات للدعم والمعالجة

اكتبها بتنسيق منظم وواضح.
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 3000,
    });
    
    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating details:", error);
    throw error;
  }
};
