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

export const generateStoryScenes = async (situationText) => {
  const prompt = `
أنت خبير في كتابة القصص المصورة (الكوميكس) التعليمية للأطفال.
الوضعية المشكلة هي:
"${situationText}"

المطلوب منك تحويل هذه الوضعية إلى قصة مصورة مكونة من 4 إلى 5 مشاهد متسلسلة لمساعدة الأطفال على فهم المشكلة قبل حلها.

لكل مشهد، قم بتوفير:
1. وصف باللغة الإنجليزية للصورة (Image Prompt) لكي يتم توليدها بالذكاء الاصطناعي. يجب أن يكون الوصف بأسلوب "cartoon style, clear and colorful, educational".
2. تعليق باللغة العربية (Caption) يظهر أسفل المشهد، يشرح ما يحدث في الصورة ببساطة.

يجب أن يكون الناتج عبارة عن مصفوفة JSON صالحة (Valid JSON Array) تحتوي على كائنات (Objects) بالتنسيق التالي، ولا تضف أي نص آخر قبل أو بعد الـ JSON:
[
  {
    "sceneNumber": 1,
    "arabicCaption": "تعليق المشهد الأول...",
    "imagePrompt": "cartoon style, ..."
  },
  ...
]
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
      response_format: { type: "json_object" } 
    });
    
    const responseText = chatCompletion.choices[0]?.message?.content || "{}";
    
    // In case the model returns the array wrapped in an object or just the array
    let parsed;
    try {
      parsed = JSON.parse(responseText);
      // if it wrapped it in { "scenes": [...] }
      if (parsed.scenes && Array.isArray(parsed.scenes)) {
        return parsed.scenes;
      }
      // if it returned just the array
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // fallback
      const key = Object.keys(parsed).find(k => Array.isArray(parsed[k]));
      if (key) return parsed[key];
    } catch (parseError) {
      console.error("Failed to parse JSON from Groq:", parseError, responseText);
      // Attempt to extract JSON if there's markdown wrappers
      const match = responseText.match(/\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
    }
    return [];
  } catch (error) {
    console.error("Error generating story scenes:", error);
    throw error;
  }
};
