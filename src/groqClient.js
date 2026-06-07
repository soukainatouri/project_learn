import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

export const generateSituations = async (formData) => {
  const prompt = `
أنت خبير تربوي في تدريس الرياضيات بالابتدائي وفق المقاربة بالكفايات.
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
- تتضمن الوضعية: ${formData.includes.join("، ")}
- المهمة المطلوبة: ${formData.taskRequired}
- المنتوج النهائي: ${formData.finalProduct}
- نوع الحل: ${formData.solutionType}
- المعارف السابقة: ${formData.priorKnowledge}
- المهارات المطلوبة: ${formData.requiredSkills}
- المعطيات الرقمية: ${formData.numericData}
- الوحدات: ${formData.units.join("، ")}
- معايير الجودة: ${formData.qualityStandards.join("، ")}
- معايير النجاح: ${formData.successCriteria.join("، ")}
- طول الوضعية: ${formData.length}
- لغة الصياغة: ${formData.language}

المطلوب:
اكتب 3 خيارات (أمثلة) لوضعية مشكلة مختلفة في الرياضيات تناسب هذه المعطيات. 
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
أنت خبير تربوي في تدريس الرياضيات بالابتدائي.
الوضعية المشكلة المختارة هي:
"${selectedSituation}"

قم بإنتاج التفاصيل التالية لهذه الوضعية بناءً على المعطيات:
1. الحل النموذجي
2. تحليل الموارد المعبأة
3. العقبات المتوقعة
4. شبكات التقويم
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
