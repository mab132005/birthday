export type QuizQuestion = {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer?: string;
  successMessage?: string;
  wrongMessage?: string;
};

export type GalleryPhoto = {
  id: number;
  url: string;
  alt: string;
};

export type ScratchCardConfig = {
  title: string;
  subtitle: string;
  coverText: string;
  hiddenSecret: string;
  buttonText: string;
};

export type BirthdayConfig = {
  herName: string;
  password: string;
  musicPath: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  welcomeLines: string[];
  firstLetterLines: string[];
  galleryPhotos: GalleryPhoto[];
  quizQuestions: QuizQuestion[];
  openQuestions: string[];
  loveReasons: string[];
  scratchCardConfig: ScratchCardConfig;
  mainLetterLines: string[];
  finalTitle: string;
  finalSubtitle: string;
  finalClosing: string;
};

export const birthdayConfig: BirthdayConfig = {
  herName: "Elham",
  password: "1234",
  musicPath: "/music/Albumaty (mp3cut.net).mp3",
  // يمكنك اختيارياً وضع توكن بوت تليجرام وآيدي الشات لتصلك الإجابات فوريًا على تليجرام
  telegramBotToken: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || "",
  telegramChatId: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || "",
  welcomeLines: [
    "أهلًا بيكي",
    "النهارده  يوم مش عادي",
    "النهارده يوم الشخص اللي وجوده فرق معايا ❤️",
    "Elham",
    "جاهزة تبدأي ؟",
  ],
  firstLetterLines: [
    "قبل ما نبدأ ",
    "في حاجة صغيرة عايز أقولهالك ",
    "يمكن لسه معندناش صور كتير",
    "ولسه مخرجناش سوا",
    "ولسه في حاجات كتير جدًا مستنيانا",
    "بس يمكن ده أجمل جزء",
    "إن كل الحاجات الحلوة دي لسه قدامنا ❤️",
  ],
  galleryPhotos: [
    { id: 1, url: "/photos/1.jpg", alt: "صورة 1" },
    { id: 2, url: "/photos/2.jpg", alt: "صورة 2" },
    { id: 3, url: "/photos/3.jpg", alt: "صورة 3" },
    { id: 4, url: "/photos/4.jpg", alt: "صورة 4" },
    { id: 5, url: "/photos/5.jpg", alt: "صورة 5" },
    { id: 6, url: "/photos/6.jpg", alt: "صورة 6" },
    { id: 7, url: "/photos/7.jpg", alt: "صورة 7" },
    { id: 8, url: "/photos/8.jpg", alt: "صورة 8" },
    { id: 9, url: "/photos/9.jpg", alt: "صورة 9" },
    { id: 10, url: "/photos/10.jpg", alt: "صورة 10" },
    { id: 11, url: "/photos/11.jpg", alt: "صورة 11" },
    { id: 12, url: "/photos/12.jpg", alt: "صورة 12" },
    { id: 13, url: "/photos/13.jpg", alt: "صورة 13" },
    { id: 14, url: "/photos/14.jpg", alt: "صورة 14" },
    { id: 15, url: "/photos/15.jpg", alt: "صورة 15" },
    { id: 16, url: "/photos/16.jpg", alt: "صورة 16" },
    { id: 17, url: "/photos/17.jpg", alt: "صورة 17" },
    { id: 18, url: "/photos/18.jpg", alt: "صورة 18" },
    { id: 19, url: "/photos/19.jpg", alt: "صورة 19" },
    { id: 20, url: "/photos/20.jpg", alt: "صورة 20" },
    { id: 21, url: "/photos/21.jpg", alt: "صورة 21" },
  ],
  quizQuestions: [
    {
      id: 1,
      category: "قد إيه إنتِ عارفاني؟ 😌❤️",
      question: "إيه أكتر حاجة ممكن تخليني مبسوط جدًا؟",
      options: ["لما نتكلم مع بعض", "لما أقعد لوحدي شوية", "لما أخرج وأغير جو", "لما أعمل حاجة بحبها"],
      correctAnswer: "لما نتكلم مع بعض",
      successMessage: "أيوه، ده أحلى حاجة تفهمها عني ❤️",
      wrongMessage: "مممم... أنتِ لوحدكِ هتفضلي كمان 😌",
    },
    {
      id: 2,
      category: "قد إيه إنتِ عارفاني؟ 😌❤️",
      question: "إيه أكتر حاجة ممكن تعصبني؟",
      options: ["الزحمة", "التجاهل", "التأخير", "قلة الكلام"],
      correctAnswer: "التجاهل",
      successMessage: "صح! ده اللي بيقلب الموقف بسرعة 😌❤️",
      wrongMessage: "أهو، أنتِ مش هتغضبي من كده 😂",
    },
    {
      id: 3,
      category: "قد إيه إنتِ عارفاني؟ 😌❤️",
      question: "إيه أكتر صفة شايفة إنها شبه شخصيتي؟",
      options: ["الهدوء", "العصبية", "العند", "الاجتماعية الزايدة"],
      correctAnswer: "الهدوء",
      successMessage: "أيوه، ده اللي بيفهم الناس عنكِ جدًا ❤️",
      wrongMessage: "الهدوء غالبًا هو اللي بيشبهني أكتر 😌",
    },
    {
      id: 4,
      category: "قد إيه إنتِ عارفاني؟ 😌❤️",
      question: "لو عندي يوم فاضي، تتوقعي أحب أقضيه إزاي؟",
      options: [
        "أخرج وأقضي اليوم بره 🌿",
        "أنام اليوم كله 😂",
        "أقعد مع أصحابي 👬",
        "ألعب جيمز وأروّق دماغي 🎮",
      ],
      correctAnswer: "أنام اليوم كله 😂",
      successMessage: "أيوه، ده أحلى حاجة في يوم فاضي 😌❤️",
      wrongMessage: "أنا متوقع إنكِ هتختار غير كده، النوم أحلى حاجة في يوم فاضي 😂❤️",
    },
    {
      id: 5,
      category: "قد إيه إنتِ عارفاني؟ 😌❤️",
      question: "أنا شخص صباحي ولا بحب السهر؟ 🌙",
      options: ["صباحي جدًا ☀️", "بحب السهر 🌙", "الاتنين", "حسب اليوم"],
      correctAnswer: "بحب السهر 🌙",
      successMessage: "أيوه، ده اللي بيخلّيكِ مميزة 😌❤️",
      wrongMessage: "أنا كنت متوقع أكتر إنكِ بتحبي السهر 😂",
    },
    {
      id: 6,
      category: "😂 أسئلة بينا",
      question: "مين فينا أكتر واحد بيزعل على حاجات هبلة؟ 😂",
      options: ["أنا طبعًا 😂", "إنتِ يا حبيبتي 😌❤️", "إحنا الاتنين سوا", "محدش فينا بيزعل"],
      correctAnswer: "إنتِ يا حبيبتي 😌❤️",
      successMessage: "صح! إنتِ اللي بتزعلي وتصالحيني بسرعة بعدها ❤️",
      wrongMessage: "لا طبعًا، إنتِ يا حبيبتي اللي بتزعلي من أبسط حاجة 😂❤️",
    },
    {
      id: 7,
      category: "😂 أسئلة بينا",
      question: "مين غيرته أكتر؟ 👀",
      options: ["أنا", "إنتِ", "إحنا الاتنين", "محدش فينا"],
      correctAnswer: "إحنا الاتنين",
      successMessage: "أيوه، من غير التاني ما يِكملش 😌❤️",
      wrongMessage: "أنتِ غالبًا بتغلطي هنا 😂",
    },
    {
      id: 8,
      category: "😂 أسئلة بينا",
      question: "مين فينا بيحب يصور كل حاجة وبياخد صور كتير؟ 📸😂",
      options: [
        "أنا وبحب أصور 📸",
        "إنتِ طبعًا يا مصورة الحكايات 📸😂❤️",
        "إحنا الاتنين سوا",
        "محدش بيحب التصوير",
      ],
      correctAnswer: "إنتِ طبعًا يا مصورة الحكايات 📸😂❤️",
      successMessage: "صح! بتصوري كل حاجة والذكريات بتبقى أحلى بسببك ❤️",
      wrongMessage: "لا طبعًا، إنتِ اللي الكاميرا مش بتفارق إيدك 😂❤️",
    },
    {
      id: 9,
      category: "😂 أسئلة بينا",
      question: "مين فينا محتاج التاني أكتر؟ 😌❤️",
      options: ["أنا", "إنتِ", "إحنا الاتنين ❤️", "السؤال نفسه صعب 😂"],
      correctAnswer: "إحنا الاتنين ❤️",
      successMessage: "أيوه، وساعتها نبقى أحسن من قبل ❤️",
      wrongMessage: "أنا متوقع إنكِ هتختاري الاتنين كمان 😌",
    },
    {
      id: 10,
      category: "💭 اختاري بين اتنين",
      question: "خروجة رومانسية ❤️ ولا قعدة طويلة نتكلم فيها؟",
      options: ["قعدة طويلة نتكلم فيها ❤️", "خروجة رومانسية"],
      successMessage: "حلو جدًا، ده اختيارك فعلاً ❤️",
    },
    {
      id: 11,
      category: "💭 اختاري بين اتنين",
      question: "بحر 🌊 ولا مكان هادي 🌿؟",
      options: ["بحر 🌊", "مكان هادي 🌿"],
      successMessage: "أيوه، ده ذوقك الحقيقي 😌",
    },
    {
      id: 12,
      category: "💭 اختاري بين اتنين",
      question: "مكالمة طويلة 📞 ولا شات طول اليوم 💬؟",
      options: ["مكالمة طويلة", "شات طول اليوم 💬"],
      successMessage: "حلو جدًا، ده اختيارك ❤️",
    },
    {
      id: 13,
      category: "💭 اختاري بين اتنين",
      question: "قهوة ☕ ولا شاي 🍵؟",
      options: ["قهوة ☕", "شاي 🍵"],
      successMessage: "ممتاز، ده اختيارك وذوقك 😌",
    },
    {
      id: 14,
      category: "💭 اختاري بين اتنين",
      question: "صيف ☀️ ولا شتاء ❄️؟",
      options: ["صيف", "شتاء"],
      successMessage: "حلو جدًا، ده اللي يناسبك ❤️",
    },
    {
      id: 15,
      category: "💭 اختاري بين اتنين",
      question: "فيلم سوا 🎬 ولا نفضل نتكلم بالساعات؟",
      options: ["فيلم سوا 🎬", "نتكلم بالساعات 💬"],
      successMessage: "أيوه، ده اللي بيقولك إيه ذوقك ❤️",
    },
    {
      id: 16,
      category: "💭 اختاري بين اتنين",
      question: "صور كتير 📸 ولا نعيش اللحظة من غير تصوير؟",
      options: ["صور كتير 📸", "نعيش اللحظة من غير تصوير ❤️"],
      successMessage: "حلو جدًا، ده اختيارك فعلاً 😌",
    },
    {
      id: 17,
      category: "💭 اختاري بين اتنين",
      question: "سفرية سوا ✈️ ولا يوم كامل في مكان هادي؟",
      options: ["سفرية سوا ✈️", "يوم كامل في مكان هادي 🌿"],
      successMessage: "هذا ذوقك اللي بيبان من الاختيار ❤️",
    },
    {
      id: 18,
      category: "💭 اختاري بين اتنين",
      question: "وردة 🌹 ولا شوكولاتة 🍫؟",
      options: ["وردة 🌹", "شوكولاتة 🍫"],
      successMessage: "حلو جدًا، الاختيار ده شكل من أشكال الحنان ❤️",
    },
  ],
  openQuestions: [
    "إيه أول حاجة نفسك نعملها سوا؟ ❤️",
    "إيه المكان اللي نفسك نروحه مع بعض؟ 🌍",
    "لو قضينا يوم كامل سوا، نفسك اليوم ده يبقى عامل إزاي؟ 🥹",
    "إيه أكتر حاجة نفسك أفضل أعملها عشانك؟ ❤️",
    "إيه أكتر حلم نفسك نحققه سوا؟ ✨",
    "لو هتكتبيلي رسالة أفتحها بعد 5 سنين، هتقوليلي إيه؟ 💌",
  ],
  loveReasons: [
    "ضحكتك ❤️",
    "اهتمامك بالتفاصيل الصغيرة ❤️",
    "وجودك في حياتي ❤️",
    "حبك للناس اللي بتحبيهم ❤️",
    "حنيتك وغلاوتك ❤️",
    "قدرتك على انك تخلي كل حاجة أحسن ❤️",
    "الهدوء اللي بتيجي بيه ❤️",
    "اخلاقك العالية ❤️",
    "أكتر حاجة بحبها فيكي هي إنكِ موجودة ❤️",
  ],
  scratchCardConfig: {
    title: "مفاجأة سرية 🎁✨",
    subtitle: "اكشطي الكارت المكتوب قدامك بصابعك علشان تكشفي المفاجأة...",
    coverText: "اكشطي هنا بأصبعك 👈✨",
    hiddenSecret: "المفاجأة الحقيقية هي الرسالة والكلمات اللي طالعة من قلبي ومستنياكي في الصفحة الجاية... ❤️✉️✨",
    buttonText: "اقرأي الرسالة ❤️",
  },
  mainLetterLines: [
    "كل سنة وإنتِ طيبة يا Elham يا حبيبتي ❤️",
    "يمكن أجمل حاجة في حكايتنا إننا مبدأناهاش من قريب...",
    "إحنا مع بعض من وإحنا صغيرين، وكبرنا وكل واحد فينا شاف التاني في مراحل كتير من حياته.",
    "يمكن وقتها مكنّاش نعرف إن الأيام هتجمعنا بالشكل ده...",
    "وإن البنت اللي عرفتها وأنا صغير هتبقى في يوم من الأيام أقرب وأغلى إنسانة ليا. ❤️",
    "عدّى وقت كتير، واتغيرت حاجات كتير، وكبرنا سوا...",
    "لكن أجمل حاجة إن حكايتنا لسه مستمرة لحد النهارده. ❤️",
    "ولسه ذكريات كتير مستنيانا. ❤️",
    "وأنا أتمنى أكون موجود معاكي في كل لحظة حلوة جاية في حياتنا.",
    "ممتن إنك كنتِ جزء من حياتي من وإحنا صغيرين...",
    "وأكتر امتنان إنك لسه معايا لحد دلوقتي. ❤️",
    "كل سنة وإنتِ أقرب وأغلى شخص ليا.",
    "كل سنة وإنتِ حبيبتي وخطيبتي وأجمل جزء في حكايتي. ❤️",
    "عيد ميلاد سعيد يا Elham 🎂❤️",
    "بحبك ❤️",
  ],
  finalTitle: "Happy Birthday ❤️",
  finalSubtitle: "عيد ميلاد سعيد لأجمل جزء في حكايتي.",
  finalClosing: "دي بدايتها. ❤️",
};
