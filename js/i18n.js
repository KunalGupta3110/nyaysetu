/*
   NYAYSETU - MULTILINGUAL UI
   Uses explicit data-i18n keys first, then translates remaining visible text.
*/

window.LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi - हिन्दी',
  bn: 'Bengali - বাংলা',
  te: 'Telugu - తెలుగు',
  mr: 'Marathi - मराठी',
  ta: 'Tamil - தமிழ்',
  ur: 'Urdu - اردو',
  gu: 'Gujarati - ગુજરાતી',
  kn: 'Kannada - ಕನ್ನಡ',
  ml: 'Malayalam - മലയാളം',
  or: 'Odia - ଓଡ଼ିଆ',
  pa: 'Punjabi - ਪੰਜਾਬੀ',
  as: 'Assamese - অসমীয়া',
  mai: 'Maithili - मैथिली',
  sat: 'Santali - ᱥᱟᱱᱛᱟᱲᱤ',
  ks: 'Kashmiri - کٲشُر',
  ne: 'Nepali - नेपाली',
  sd: 'Sindhi - سنڌي',
  kok: 'Konkani - कोंकणी',
  doi: 'Dogri - डोगरी',
  mni: 'Manipuri - মৈতৈলোন্',
  brx: 'Bodo - बड़ो',
  sa: 'Sanskrit - संस्कृतम्',
  bho: 'Bhojpuri - भोजपुरी',
  raj: 'Rajasthani - राजस्थानी',
  bgc: 'Haryanvi - हरियाणवी',
  hne: 'Chhattisgarhi - छत्तीसगढ़ी',
  mag: 'Magahi - मगही',
  awa: 'Awadhi - अवधी',
  tcy: 'Tulu - ತುಳು',
  kha: 'Khasi - Khasi',
  grt: 'Garo - A.chik',
  lus: 'Mizo - Mizo',
  nag: 'Nagamese - Nagamese',
  lep: 'Lepcha - ᰛᰩᰵᰛᰧᰶ',
  lbj: 'Ladakhi - ལ་དྭགས་སྐད',
  bhb: 'Bhili - भीली',
  gon: 'Gondi - गोंडी',
  hoc: 'Ho - 𑢹𑣉',
  kru: 'Kurukh - कुड़ुख़',
  unr: 'Mundari - मुंडारी'
};

const DEFAULT_LOCALE = 'en';
const I18N_CACHE_PREFIX = 'ns-i18n-v2-';
const AUTO_CACHE_PREFIX = 'ns-auto-i18n-v2-';
const TEXT_NODE_ORIGINALS = new WeakMap();
const ATTR_ORIGINALS = new WeakMap();
let currentLang = DEFAULT_LOCALE;
let currentStrings = {};
let i18nReady = false;
let isApplyingI18n = false;
let autoTranslateTimer = null;
let mutationObserver = null;

const BASE_STRINGS = {
  page_title: 'NyaySetu - AI-Powered Legal Access for India',
  home_page_title: 'NyaySetu - AI-Powered Legal Access for India',
  chat_page_title: 'AI Chat - NyaySetu',
  docs_page_title: 'Document Generator - NyaySetu',
  simplify_page_title: 'Law Simplifier - NyaySetu',
  students_page_title: 'Student Ecosystem - NyaySetu',
  nav_home: 'Home',
  nav_chat: 'AI Chat',
  nav_docs: 'Documents',
  nav_simplify: 'Simplifier',
  nav_students: 'Students',
  nav_ask: 'Ask a Question',
  hero_badge: 'AI-Powered · Legal Access · India',
  hero_title: 'Justice should not\ndepend on who\nyou know.',
  hero_sub: 'NyaySetu bridges the gap between people and the law. Ask legal questions in plain language - English, Hindi, Urdu, or any Indian language - powered by AI, reviewed by law students and professionals.',
  hero_start: 'Start for Free →',
  hero_how: 'How It Works',
  hero_note: '🔒 No signup required · Hindi, Urdu & more Indian languages · 12,400+ queries resolved',
  metric_queries: 'Legal queries resolved',
  metric_students: 'Law students onboarded',
  metric_docs: 'Documents generated',
  metric_satisfaction: 'User satisfaction',
  process_title: 'Process',
  process_header: 'A system built for clarity',
  process_sub: 'Every query passes through AI analysis and human review - fast and reliable.',
  process_step1_title: 'You Ask',
  process_step1_desc: 'Submit your legal question in English, Hindi, Urdu, or any Indian language. No legal knowledge needed.',
  process_step2_title: 'AI Analyses',
  process_step2_desc: 'Legal AI identifies applicable laws, IPC sections, and precedents instantly.',
  process_step3_title: 'Student Reviews',
  process_step3_desc: 'A verified law student reviews the output and adds professional context.',
  process_step4_title: 'Lawyer Escalates',
  process_step4_desc: 'Complex cases routed to licensed advocates - faster and affordable.',
  tag_citizen: 'Citizen',
  tag_ai: 'NyaySetu AI',
  tag_law_student: 'Law Student',
  tag_advocate: 'Advocate',
  features_title: 'Capabilities',
  features_sub: 'Every legal need, covered',
  feat_ai_title: 'AI Legal Assistant',
  feat_ai_desc: 'Ask anything in plain language - FIR procedures, property disputes, consumer rights. AI identifies applicable laws in seconds.',
  feat_ai_action: 'Open Chat',
  feat_docs_title: 'Document Generator',
  feat_docs_desc: 'Generate legally accurate documents in minutes - legal notices, affidavits, rent agreements, consumer complaints, RTI applications.',
  feat_docs_action: 'Generate Now',
  feat_simplify_title: 'Law Simplifier',
  feat_simplify_desc: 'Paste any legal text - court order, notice, contract, government circular - get a plain language breakdown with actionable steps.',
  feat_simplify_action: 'Try Simplifier',
  feat_students_title: 'Student Ecosystem',
  feat_students_desc: "Law students earn credits reviewing queries, build real portfolios, and get ranked on India's legal AI professional leaderboard.",
  feat_students_action: 'Join as Student',
  advantage_label: 'Advantage',
  advantage_title: 'Why NyaySetu exists',
  advantage_sub: 'Traditional legal help is slow, expensive, and inaccessible. We built NyaySetu to change all three.',
  why_fast_title: 'Fast - minutes, not weeks',
  why_fast_desc: 'Traditional legal consultation can take days to begin. NyaySetu provides an intelligent first response in under 30 seconds, with a reviewed answer within hours.',
  why_fast_metric: '⟳ < 30 second initial response',
  why_affordable_title: 'Affordable - not ₹5,000/hour',
  why_affordable_desc: 'Legal help in India is prohibitively expensive. NyaySetu is free to start - and premium plans cost less than a single traditional consultation.',
  why_affordable_metric: '₹ Fraction of traditional cost',
  why_access_title: 'Accessible - anywhere, anyone',
  why_access_desc: "Whether you're in Delhi or a small town in Bihar - if you have a phone, you have access to legal guidance. No office visits, no appointments.",
  why_access_metric: '📱 Any device, any location',
  cta_title: 'Get Started Today',
  cta_header: 'Your rights matter.<br>Know them.',
  cta_sub: 'Ask your first legal question for free. No signup required to begin.',
  cta_button: 'Start for Free →',
  cta_note: 'No credit card required · Hindi & English · 12,400+ queries resolved',
  footer_privacy: 'Privacy Policy',
  footer_terms: 'Terms of Use',
  footer_disclaimer: 'Legal Disclaimer',
  footer_contact: 'Contact Us',
  footer_copy: '© 2025 NyaySetu · Not a substitute for legal advice',
  chat_welcome_heading: 'How can NyaySetu help?',
  chat_welcome_sub: 'Ask any legal question in English, Hindi, Urdu, or any Indian language. Our AI will analyse your situation, identify relevant laws, and provide actionable guidance.',
  chat_placeholder: 'Ask your legal question here...',
  chat_send: '→',
  chat_new: 'New Chat',
  chat_doc_link: '📄 Generate Document',
  chat_simplify_link: '📚 Simplify a Law',
  chat_disclaimer: 'NyaySetu provides legal guidance, not professional legal advice. For serious matters, consult a qualified advocate.',
  chat_name: '⚖ NyaySetu Legal AI',
  chat_online: 'Online · Reviewed by law professionals',
  chat_hint: 'Enter to send · Shift+Enter for new line',
  sidebar_topics: 'Topics',
  docs_title: 'Document Generator',
  docs_header: 'Generate legal documents in minutes',
  docs_sub: 'AI-powered, legally accurate templates for every common Indian legal need. Fill in your details - ready to use in under 60 seconds.',
  docs_gen_button: '✦ Generate Document',
  docs_preview_title: 'Document Preview',
  docs_preview_placeholder: 'Fill in the form on the left<br>and click <strong style="color:var(--accent)">"Generate Document"</strong>',
  docs_copy: '📋 Copy',
  docs_download: '📄 Download PDF',
  simplifier_title: 'Law Simplifier',
  simplifier_header: 'Understand any legal text instantly',
  simplifier_sub: 'Paste a court order, legal notice, contract clause, IPC section, or government circular - get a plain-language breakdown with actionable steps in seconds.',
  simplifier_try_sample: 'Try a sample:',
  simplify_input_label: 'Legal Text Input',
  simplify_input_badge: 'Paste Here',
  simplify_clear: 'Clear',
  simplify_button: '✦ Simplify →',
  simplify_output_label: 'Plain English',
  simplify_output_badge: 'Simplified',
  simplifier_output_placeholder: 'Your plain-language explanation<br>will appear here',
  students_title: 'Student Ecosystem',
  students_header: 'Learn by doing. Earn while practicing.',
  students_sub: "Review real legal queries, build a professional portfolio, and get ranked on India's premier legal AI platform.",
  students_tab_dashboard: '📊 Dashboard',
  students_tab_review: '✅ Review Queue',
  students_tab_leaderboard: '🏆 Leaderboard',
  students_tab_signup: '🎓 Join as Student',
  auth_page_title: 'Sign In - NyaySetu',
  dash_page_title: 'Dashboard - NyaySetu'
};

const LOCAL_TRANSLATIONS = {
  hi: {
    page_title: 'न्यायसेतु - भारत के लिए AI कानूनी सहायता',
    home_page_title: 'न्यायसेतु - भारत के लिए AI कानूनी सहायता',
    chat_page_title: 'AI चैट - न्यायसेतु',
    docs_page_title: 'दस्तावेज़ जनरेटर - न्यायसेतु',
    simplify_page_title: 'कानून सरलकर्ता - न्यायसेतु',
    students_page_title: 'छात्र इकोसिस्टम - न्यायसेतु',
    nav_home: 'होम',
    nav_chat: 'AI चैट',
    nav_docs: 'दस्तावेज़',
    nav_simplify: 'सरलकर्ता',
    nav_students: 'छात्र',
    nav_ask: 'प्रश्न पूछें',
    hero_badge: 'AI-संचालित · कानूनी पहुंच · भारत',
    hero_title: 'न्याय इस बात पर निर्भर नहीं होना चाहिए\nकि आप किसे जानते हैं।',
    hero_sub: 'न्यायसेतु लोगों और कानून के बीच की दूरी कम करता है। सरल भाषा में कानूनी सवाल पूछें - अंग्रेज़ी, हिंदी, उर्दू या किसी भी भारतीय भाषा में - AI द्वारा संचालित और कानून के छात्रों व पेशेवरों द्वारा समीक्षा की गई।',
    hero_start: 'मुफ्त शुरू करें →',
    hero_how: 'कैसे काम करता है',
    hero_note: '🔒 साइनअप की जरूरत नहीं · हिंदी, उर्दू और अन्य भारतीय भाषाएं · 12,400+ सवाल हल',
    metric_queries: 'कानूनी सवाल हल',
    metric_students: 'कानून छात्र जुड़े',
    metric_docs: 'दस्तावेज़ बनाए गए',
    metric_satisfaction: 'यूज़र संतुष्टि',
    process_title: 'प्रक्रिया',
    process_header: 'स्पष्टता के लिए बना सिस्टम',
    process_sub: 'हर सवाल AI विश्लेषण और मानव समीक्षा से गुजरता है - तेज़ और भरोसेमंद।',
    process_step1_title: 'आप पूछते हैं',
    process_step1_desc: 'अपना कानूनी सवाल अंग्रेज़ी, हिंदी, उर्दू या किसी भी भारतीय भाषा में भेजें। कानूनी जानकारी जरूरी नहीं।',
    process_step2_title: 'AI विश्लेषण करता है',
    process_step2_desc: 'कानूनी AI लागू कानून, IPC धाराएं और मिसालें तुरंत पहचानता है।',
    process_step3_title: 'छात्र समीक्षा करता है',
    process_step3_desc: 'एक सत्यापित कानून छात्र उत्तर की समीक्षा करता है और पेशेवर संदर्भ जोड़ता है।',
    process_step4_title: 'वकील तक पहुंच',
    process_step4_desc: 'जटिल मामलों को लाइसेंस प्राप्त अधिवक्ताओं तक भेजा जाता है - तेज़ और किफायती।',
    tag_citizen: 'नागरिक',
    tag_ai: 'न्यायसेतु AI',
    tag_law_student: 'कानून छात्र',
    tag_advocate: 'अधिवक्ता',
    features_title: 'क्षमताएं',
    features_sub: 'हर कानूनी जरूरत, एक जगह',
    feat_ai_title: 'AI कानूनी सहायक',
    feat_ai_desc: 'सरल भाषा में कुछ भी पूछें - FIR प्रक्रिया, संपत्ति विवाद, उपभोक्ता अधिकार। AI सेकंडों में लागू कानून पहचानता है।',
    feat_ai_action: 'चैट खोलें',
    feat_docs_title: 'दस्तावेज़ जनरेटर',
    feat_docs_desc: 'मिनटों में कानूनी रूप से सही दस्तावेज़ बनाएं - नोटिस, हलफनामा, किराया समझौता, उपभोक्ता शिकायत, RTI आवेदन।',
    feat_docs_action: 'अभी बनाएं',
    feat_simplify_title: 'कानून सरलकर्ता',
    feat_simplify_desc: 'कोई भी कानूनी टेक्स्ट पेस्ट करें - कोर्ट आदेश, नोटिस, अनुबंध, सरकारी परिपत्र - और सरल भाषा में समझें।',
    feat_simplify_action: 'सरलकर्ता आज़माएं',
    feat_students_title: 'छात्र इकोसिस्टम',
    feat_students_desc: 'कानून छात्र सवालों की समीक्षा करके क्रेडिट कमाते हैं, पोर्टफोलियो बनाते हैं और भारत के कानूनी AI लीडरबोर्ड पर रैंक पाते हैं।',
    feat_students_action: 'छात्र के रूप में जुड़ें',
    advantage_label: 'लाभ',
    advantage_title: 'न्यायसेतु क्यों मौजूद है',
    advantage_sub: 'पारंपरिक कानूनी मदद धीमी, महंगी और पहुंच से बाहर है। न्यायसेतु इन तीनों को बदलने के लिए बनाया गया है।',
    why_fast_title: 'तेज़ - हफ्तों नहीं, मिनटों में',
    why_fast_desc: 'पारंपरिक कानूनी सलाह शुरू होने में कई दिन लग सकते हैं। न्यायसेतु 30 सेकंड से कम समय में पहला समझदार जवाब देता है और कुछ घंटों में समीक्षा किया हुआ उत्तर।',
    why_fast_metric: '⟳ 30 सेकंड से कम में शुरुआती जवाब',
    why_affordable_title: 'किफायती - ₹5,000/घंटा नहीं',
    why_affordable_desc: 'भारत में कानूनी मदद बहुत महंगी हो सकती है। न्यायसेतु मुफ्त में शुरू होता है - और प्रीमियम योजनाएं एक पारंपरिक सलाह से भी कम खर्च की हैं।',
    why_affordable_metric: '₹ पारंपरिक लागत का छोटा हिस्सा',
    why_access_title: 'सुलभ - कहीं भी, किसी के लिए',
    why_access_desc: 'आप दिल्ली में हों या बिहार के छोटे शहर में - अगर आपके पास फोन है, तो आपके पास कानूनी मार्गदर्शन है। ऑफिस जाने या अपॉइंटमेंट की जरूरत नहीं।',
    why_access_metric: '📱 कोई भी डिवाइस, कोई भी जगह',
    cta_title: 'आज ही शुरू करें',
    cta_header: 'आपके अधिकार मायने रखते हैं।<br>उन्हें जानें।',
    cta_sub: 'अपना पहला कानूनी सवाल मुफ्त पूछें। शुरू करने के लिए साइनअप जरूरी नहीं।',
    cta_button: 'मुफ्त शुरू करें →',
    cta_note: 'क्रेडिट कार्ड जरूरी नहीं · हिंदी और अंग्रेज़ी · 12,400+ सवाल हल',
    footer_privacy: 'गोपनीयता नीति',
    footer_terms: 'उपयोग की शर्तें',
    footer_disclaimer: 'कानूनी अस्वीकरण',
    footer_contact: 'संपर्क करें',
    footer_copy: '© 2025 न्यायसेतु · कानूनी सलाह का विकल्प नहीं',
    chat_welcome_heading: 'न्यायसेतु आपकी कैसे मदद कर सकता है?',
    chat_welcome_sub: 'कोई भी कानूनी सवाल अंग्रेज़ी, हिंदी, उर्दू या किसी भी भारतीय भाषा में पूछें। हमारा AI आपकी स्थिति का विश्लेषण करेगा, संबंधित कानून पहचानेगा और उपयोगी मार्गदर्शन देगा।',
    chat_placeholder: 'अपना कानूनी सवाल यहां लिखें...',
    chat_new: 'नई चैट',
    chat_doc_link: '📄 दस्तावेज़ बनाएं',
    chat_simplify_link: '📚 कानून सरल करें',
    chat_disclaimer: 'न्यायसेतु कानूनी मार्गदर्शन देता है, पेशेवर कानूनी सलाह नहीं। गंभीर मामलों में योग्य अधिवक्ता से सलाह लें।',
    chat_name: '⚖ न्यायसेतु कानूनी AI',
    chat_online: 'ऑनलाइन · कानून पेशेवरों द्वारा समीक्षा',
    chat_hint: 'भेजने के लिए Enter · नई लाइन के लिए Shift+Enter',
    sidebar_topics: 'विषय',
    docs_title: 'दस्तावेज़ जनरेटर',
    docs_header: 'मिनटों में कानूनी दस्तावेज़ बनाएं',
    docs_sub: 'हर सामान्य भारतीय कानूनी जरूरत के लिए AI-संचालित, कानूनी रूप से सही टेम्पलेट। अपनी जानकारी भरें - 60 सेकंड से कम में तैयार।',
    docs_gen_button: '✦ दस्तावेज़ बनाएं',
    docs_preview_title: 'दस्तावेज़ पूर्वावलोकन',
    docs_preview_placeholder: 'बाईं ओर फॉर्म भरें<br>और <strong style="color:var(--accent)">"दस्तावेज़ बनाएं"</strong> पर क्लिक करें',
    docs_copy: '📋 कॉपी',
    docs_download: '📄 PDF डाउनलोड',
    simplifier_title: 'कानून सरलकर्ता',
    simplifier_header: 'कोई भी कानूनी टेक्स्ट तुरंत समझें',
    simplifier_sub: 'कोर्ट आदेश, कानूनी नोटिस, अनुबंध क्लॉज़, IPC धारा या सरकारी परिपत्र पेस्ट करें - सेकंडों में सरल भाषा में समझें।',
    simplifier_try_sample: 'एक नमूना आज़माएं:',
    simplify_input_label: 'कानूनी टेक्स्ट इनपुट',
    simplify_input_badge: 'यहां पेस्ट करें',
    simplify_clear: 'साफ करें',
    simplify_button: '✦ सरल करें →',
    simplify_output_label: 'सरल हिंदी',
    simplify_output_badge: 'सरल किया गया',
    simplifier_output_placeholder: 'आपकी सरल भाषा में व्याख्या<br>यहां दिखाई देगी',
    students_title: 'छात्र इकोसिस्टम',
    students_header: 'करते हुए सीखें। अभ्यास करते हुए कमाएं।',
    students_sub: 'वास्तविक कानूनी सवालों की समीक्षा करें, पेशेवर पोर्टफोलियो बनाएं और भारत के प्रमुख कानूनी AI प्लेटफॉर्म पर रैंक पाएं।',
    students_tab_dashboard: '📊 डैशबोर्ड',
    students_tab_review: '✅ समीक्षा कतार',
    students_tab_leaderboard: '🏆 लीडरबोर्ड',
    students_tab_signup: '🎓 छात्र के रूप में जुड़ें'
  }
};

const EXTRA_TRANSLATIONS = {
  en: {
    auth_brand_title: 'Your legal rights,<br>one login away.',
    auth_brand_sub: 'Access AI-powered legal guidance, generate documents, and get answers reviewed by law professionals - all free.',
    auth_feature_chat: 'AI legal chat with real law references',
    auth_feature_docs: 'Generate legal documents in minutes',
    auth_feature_simplify: 'Simplify any legal text instantly',
    auth_feature_private: 'Your data is private and secure',
    auth_terms: 'By signing in, you agree to our Terms of Service.<br>NyaySetu is not a law firm. AI guidance is not legal advice.',
    auth_google: 'Continue with Google',
    auth_email_continue: 'or continue with email',
    auth_tab_signin: 'Sign In',
    auth_tab_signup: 'Create Account',
    auth_signin_title: 'Welcome back',
    auth_signin_sub: 'Sign in to your NyaySetu account.',
    auth_email_label: 'Email Address',
    auth_email_placeholder: 'Enter your email',
    auth_password_label: 'Password',
    auth_password_placeholder: 'Enter your password',
    auth_forgot_password: 'Forgot password?',
    auth_signin_button: 'Sign In ->',
    auth_no_account: 'Don\'t have an account? <a href="#" onclick="switchTab(\'signup\')">Create one free</a>',
    auth_signup_title: 'Create your account',
    auth_signup_sub: 'Free forever. No credit card required.',
    auth_role_label: 'I am a',
    auth_role_citizen: 'Citizen',
    auth_role_citizen_desc: 'Seeking legal help',
    auth_role_student: 'Law Student',
    auth_role_student_desc: 'Want to review & earn',
    auth_fullname_placeholder: 'Full name',
    auth_city_placeholder: 'City',
    auth_password_hint: 'Create a strong password',
    auth_college_placeholder: 'Law college',
    auth_area_label: 'Area of Interest',
    auth_select_area: 'Select area',
    auth_area_criminal: 'Criminal Law',
    auth_area_civil: 'Civil / Property Law',
    auth_area_family: 'Family Law',
    auth_area_consumer: 'Consumer Law',
    auth_area_constitutional: 'Constitutional Law',
    auth_area_all: 'All Areas',
    auth_create_button: 'Create Account ->',
    auth_already_account: 'Already have an account? <a href="#" onclick="switchTab(\'signin\')">Sign in</a>',
    auth_reset_title: 'Reset password',
    auth_reset_sub: 'Enter your email and we\'ll send a reset link.',
    auth_send_reset: 'Send Reset Link',
    auth_back_to_signin: '<a href="#" onclick="switchTab(\'signin\')">← Back to sign in</a>',
    dash_menu_profile: '👤 Profile Settings',
    dash_menu_docs: '📄 My Documents',
    dash_menu_students: '🎓 Student Dashboard',
    dash_menu_signout: '← Sign Out',
    dash_no_chats_title: 'No conversations yet',
    dash_no_chats_sub: 'Your AI chat history will appear here',
    dash_start_chatting: 'Start Chatting ->',
    dash_no_docs_title: 'No documents yet',
    dash_no_docs_sub: 'Generate your first legal document',
    dash_generate_doc: 'Generate Document ->',
    dash_snav_main: 'Main',
    dash_snav_overview: 'Overview',
    dash_snav_chats: 'Chat History',
    dash_snav_docs: 'My Documents',
    dash_snav_simplify: 'Simplify History',
    dash_snav_account: 'Account',
    dash_snav_profile: 'Profile',
    dash_snav_signout: 'Sign Out',
    dash_welcome_title: 'Good day, <span id="wb-name">there</span> 👋',
    dash_welcome_sub: 'Here\'s a summary of your NyaySetu activity.',
    dash_btn_ask: '⚖ Ask a Legal Question',
    dash_btn_generate: '📄 Generate Document',
    dash_stat_chats: 'Chat Sessions',
    dash_stat_docs: 'Documents Saved',
    dash_stat_simplified: 'Laws Simplified',
    dash_stat_resolution: 'Query Resolution',
    dash_recent_convos: 'Recent Conversations'
  },
  hi: {
    auth_brand_title: 'आपके कानूनी अधिकार,<br>बस एक लॉगिन दूर।',
    auth_brand_sub: 'AI कानूनी सहायता, दस्तावेज़ निर्माण और कानून पेशेवरों द्वारा समीक्षा किए गए उत्तर पाएं - बिल्कुल मुफ्त।',
    auth_google: 'Google से जारी रखें',
    auth_email_continue: 'या ईमेल से जारी रखें',
    auth_tab_signin: 'साइन इन',
    auth_tab_signup: 'खाता बनाएं',
    auth_signin_title: 'वापसी पर स्वागत है',
    auth_signin_sub: 'अपने NyaySetu खाते में साइन इन करें।',
    auth_email_label: 'ईमेल पता',
    auth_email_placeholder: 'अपना ईमेल दर्ज करें',
    auth_password_label: 'पासवर्ड',
    auth_password_placeholder: 'अपना पासवर्ड दर्ज करें',
    auth_signin_button: 'साइन इन करें ->',
    auth_signup_title: 'अपना खाता बनाएं',
    auth_signup_sub: 'हमेशा मुफ्त। क्रेडिट कार्ड की जरूरत नहीं।',
    auth_role_label: 'मैं हूं',
    auth_role_citizen: 'नागरिक',
    auth_role_student: 'कानून छात्र',
    auth_create_button: 'खाता बनाएं ->',
    auth_reset_title: 'पासवर्ड रीसेट करें',
    auth_send_reset: 'रीसेट लिंक भेजें'
  },
  ur: {
    page_title: 'NyaySetu - بھارت کے لیے AI قانونی رسائی',
    home_page_title: 'NyaySetu - بھارت کے لیے AI قانونی رسائی',
    chat_page_title: 'AI چیٹ - NyaySetu',
    docs_page_title: 'دستاویز جنریٹر - NyaySetu',
    simplify_page_title: 'قانون آسان بنانے والا - NyaySetu',
    students_page_title: 'طلبہ ایکو سسٹم - NyaySetu',
    auth_page_title: 'سائن ان - NyaySetu',
    dash_page_title: 'ڈیش بورڈ - NyaySetu',
    nav_home: 'ہوم',
    nav_chat: 'AI چیٹ',
    nav_docs: 'دستاویزات',
    nav_simplify: 'آسان فہم',
    nav_students: 'طلبہ',
    nav_ask: 'سوال پوچھیں',
    hero_badge: 'AI سے چلنے والی · قانونی رسائی · بھارت',
    hero_title: 'انصاف اس بات پر منحصر نہیں ہونا چاہیے\nکہ آپ کس کو جانتے ہیں۔',
    hero_sub: 'NyaySetu لوگوں اور قانون کے درمیان فاصلہ کم کرتا ہے۔ آسان زبان میں قانونی سوال پوچھیں - انگریزی، ہندی، اردو یا کسی بھی بھارتی زبان میں - AI کی مدد سے۔',
    hero_start: 'مفت شروع کریں ->',
    hero_how: 'یہ کیسے کام کرتا ہے',
    hero_note: '🔒 سائن اپ ضروری نہیں · ہندی، اردو اور مزید بھارتی زبانیں · 12,400+ سوالات حل',
    metric_queries: 'قانونی سوالات حل ہوئے',
    metric_students: 'قانون کے طلبہ شامل',
    metric_docs: 'دستاویزات بنیں',
    metric_satisfaction: 'صارفین کی اطمینان',
    process_title: 'طریقہ کار',
    process_header: 'وضاحت کے لیے بنایا گیا نظام',
    process_sub: 'ہر سوال AI تجزیے اور انسانی جائزے سے گزرتا ہے - تیز اور قابل اعتماد۔',
    process_step1_title: 'آپ پوچھتے ہیں',
    process_step1_desc: 'اپنا قانونی سوال انگریزی، ہندی، اردو یا کسی بھارتی زبان میں بھیجیں۔ قانونی علم ضروری نہیں۔',
    process_step2_title: 'AI تجزیہ کرتا ہے',
    process_step2_desc: 'قانونی AI متعلقہ قوانین، دفعات اور نظائر فوراً شناخت کرتا ہے۔',
    process_step3_title: 'طالب علم جائزہ لیتا ہے',
    process_step3_desc: 'تصدیق شدہ قانون کا طالب علم جواب کا جائزہ لے کر پیشہ ورانہ سیاق شامل کرتا ہے۔',
    process_step4_title: 'وکیل تک رسائی',
    process_step4_desc: 'پیچیدہ معاملات لائسنس یافتہ وکلا تک بھیجے جاتے ہیں - تیز اور کم خرچ۔',
    tag_citizen: 'شہری',
    tag_ai: 'NyaySetu AI',
    tag_law_student: 'قانون کا طالب علم',
    tag_advocate: 'وکیل',
    features_title: 'صلاحیتیں',
    features_sub: 'ہر قانونی ضرورت، ایک جگہ',
    feat_ai_title: 'AI قانونی معاون',
    feat_ai_desc: 'سادہ زبان میں کچھ بھی پوچھیں - FIR، جائیداد کے تنازعات، صارف حقوق۔ AI سیکنڈوں میں متعلقہ قانون بتاتا ہے۔',
    feat_ai_action: 'چیٹ کھولیں',
    feat_docs_title: 'دستاویز جنریٹر',
    feat_docs_desc: 'قانونی نوٹس، حلف نامہ، کرایہ نامہ، صارف شکایت اور RTI درخواست منٹوں میں بنائیں۔',
    feat_docs_action: 'ابھی بنائیں',
    feat_simplify_title: 'قانون آسان بنانے والا',
    feat_simplify_desc: 'کوئی بھی قانونی متن پیسٹ کریں اور آسان زبان میں عملی وضاحت حاصل کریں۔',
    feat_simplify_action: 'آزمائیں',
    feat_students_title: 'طلبہ ایکو سسٹم',
    feat_students_desc: 'قانون کے طلبہ حقیقی سوالات کا جائزہ لے کر کریڈٹ کماتے ہیں اور اپنا پورٹ فولیو بناتے ہیں۔',
    feat_students_action: 'طالب علم کے طور پر شامل ہوں',
    advantage_label: 'فائدہ',
    advantage_title: 'NyaySetu کیوں موجود ہے',
    advantage_sub: 'روایتی قانونی مدد سست، مہنگی اور مشکل ہے۔ ہم نے NyaySetu ان تینوں کو بدلنے کے لیے بنایا۔',
    why_fast_title: 'تیز - ہفتوں نہیں، منٹوں میں',
    why_fast_desc: 'روایتی مشاورت شروع ہونے میں دن لگ سکتے ہیں۔ NyaySetu 30 سیکنڈ سے کم میں ابتدائی جواب دیتا ہے۔',
    why_fast_metric: '⟳ 30 سیکنڈ سے کم ابتدائی جواب',
    why_affordable_title: 'کم خرچ - ₹5,000 فی گھنٹہ نہیں',
    why_affordable_desc: 'بھارت میں قانونی مدد مہنگی ہے۔ NyaySetu شروع کرنے کے لیے مفت ہے۔',
    why_affordable_metric: '₹ روایتی خرچ کا ایک حصہ',
    why_access_title: 'قابل رسائی - کہیں بھی، کسی کے لیے بھی',
    why_access_desc: 'اگر آپ کے پاس فون ہے تو آپ قانونی رہنمائی تک رسائی رکھتے ہیں۔ دفتر جانے یا اپائنٹمنٹ کی ضرورت نہیں۔',
    why_access_metric: '📱 کوئی بھی ڈیوائس، کوئی بھی جگہ',
    cta_title: 'آج ہی شروع کریں',
    cta_header: 'آپ کے حقوق اہم ہیں۔<br>انہیں جانیں۔',
    cta_sub: 'اپنا پہلا قانونی سوال مفت پوچھیں۔ شروع کرنے کے لیے سائن اپ ضروری نہیں۔',
    cta_button: 'مفت شروع کریں ->',
    cta_note: 'کریڈٹ کارڈ ضروری نہیں · ہندی اور انگریزی · 12,400+ سوالات حل',
    footer_privacy: 'پرائیویسی پالیسی',
    footer_terms: 'استعمال کی شرائط',
    footer_disclaimer: 'قانونی دستبرداری',
    footer_contact: 'ہم سے رابطہ کریں',
    footer_copy: '© 2025 NyaySetu · قانونی مشورے کا متبادل نہیں',
    chat_welcome_heading: 'NyaySetu آپ کی کیسے مدد کر سکتا ہے؟',
    chat_welcome_sub: 'کوئی بھی قانونی سوال انگریزی، ہندی، اردو یا کسی بھارتی زبان میں پوچھیں۔',
    chat_placeholder: 'اپنا قانونی سوال یہاں لکھیں...',
    chat_new: 'نئی چیٹ',
    chat_doc_link: '📄 دستاویز بنائیں',
    chat_simplify_link: '📚 قانون آسان کریں',
    chat_disclaimer: 'NyaySetu قانونی رہنمائی فراہم کرتا ہے، پیشہ ورانہ قانونی مشورہ نہیں۔',
    chat_name: '⚖ NyaySetu قانونی AI',
    chat_online: 'آن لائن · قانون پیشہ ور افراد کے ذریعے جائزہ',
    chat_hint: 'بھیجنے کے لیے Enter · نئی لائن کے لیے Shift+Enter',
    sidebar_topics: 'موضوعات',
    docs_title: 'دستاویز جنریٹر',
    docs_header: 'قانونی دستاویزات منٹوں میں بنائیں',
    docs_sub: 'عام بھارتی قانونی ضرورتوں کے لیے AI سے چلنے والے درست ٹیمپلیٹس۔',
    docs_gen_button: '✦ دستاویز بنائیں',
    docs_preview_title: 'دستاویز کا پیش نظارہ',
    docs_preview_placeholder: 'بائیں طرف فارم بھریں<br>اور <strong style="color:var(--accent)">"دستاویز بنائیں"</strong> پر کلک کریں',
    docs_copy: '📋 کاپی',
    docs_download: '📄 PDF ڈاؤن لوڈ',
    simplifier_title: 'قانون آسان بنانے والا',
    simplifier_header: 'کوئی بھی قانونی متن فوراً سمجھیں',
    simplifier_sub: 'عدالتی حکم، قانونی نوٹس، معاہدہ یا سرکاری سرکلر پیسٹ کریں اور آسان وضاحت پائیں۔',
    simplifier_try_sample: 'نمونہ آزمائیں:',
    simplify_input_label: 'قانونی متن',
    simplify_input_badge: 'یہاں پیسٹ کریں',
    simplify_clear: 'صاف کریں',
    simplify_button: '✦ آسان کریں ->',
    simplify_output_label: 'آسان اردو',
    simplify_output_badge: 'آسان بنایا گیا',
    simplifier_output_placeholder: 'آپ کی آسان زبان میں وضاحت<br>یہاں نظر آئے گی',
    students_title: 'طلبہ ایکو سسٹم',
    students_header: 'کام کرتے ہوئے سیکھیں۔ مشق کرتے ہوئے کمائیں۔',
    students_sub: 'حقیقی قانونی سوالات کا جائزہ لیں، پیشہ ورانہ پورٹ فولیو بنائیں اور رینک حاصل کریں۔',
    students_tab_dashboard: '📊 ڈیش بورڈ',
    students_tab_review: '✅ جائزہ قطار',
    students_tab_leaderboard: '🏆 لیڈر بورڈ',
    students_tab_signup: '🎓 طالب علم کے طور پر شامل ہوں',
    auth_brand_title: 'آپ کے قانونی حقوق،<br>صرف ایک لاگ ان دور۔',
    auth_brand_sub: 'AI قانونی رہنمائی، دستاویزات اور قانون پیشہ ور افراد کے جائزہ شدہ جوابات حاصل کریں - بالکل مفت۔',
    auth_feature_chat: 'حقیقی قانونی حوالوں کے ساتھ AI چیٹ',
    auth_feature_docs: 'منٹوں میں قانونی دستاویزات بنائیں',
    auth_feature_simplify: 'کسی بھی قانونی متن کو فوراً آسان کریں',
    auth_feature_private: 'آپ کا ڈیٹا نجی اور محفوظ ہے',
    auth_terms: 'سائن ان کرکے آپ ہماری شرائط سے اتفاق کرتے ہیں۔<br>NyaySetu قانون فرم نہیں ہے۔ AI رہنمائی قانونی مشورہ نہیں۔',
    auth_google: 'Google سے جاری رکھیں',
    auth_email_continue: 'یا ای میل سے جاری رکھیں',
    auth_tab_signin: 'سائن ان',
    auth_tab_signup: 'اکاؤنٹ بنائیں',
    auth_signin_title: 'واپسی پر خوش آمدید',
    auth_signin_sub: 'اپنے NyaySetu اکاؤنٹ میں سائن ان کریں۔',
    auth_email_label: 'ای میل پتہ',
    auth_email_placeholder: 'اپنا ای میل درج کریں',
    auth_password_label: 'پاس ورڈ',
    auth_password_placeholder: 'اپنا پاس ورڈ درج کریں',
    auth_forgot_password: 'پاس ورڈ بھول گئے؟',
    auth_signin_button: 'سائن ان ->',
    auth_no_account: 'اکاؤنٹ نہیں ہے؟ <a href="#" onclick="switchTab(\'signup\')">مفت بنائیں</a>',
    auth_signup_title: 'اپنا اکاؤنٹ بنائیں',
    auth_signup_sub: 'ہمیشہ مفت۔ کریڈٹ کارڈ ضروری نہیں۔',
    auth_role_label: 'میں ہوں',
    auth_role_citizen: 'شہری',
    auth_role_citizen_desc: 'قانونی مدد چاہیے',
    auth_role_student: 'قانون کا طالب علم',
    auth_role_student_desc: 'جائزہ لینا اور کمانا چاہتے ہیں',
    auth_fullname_placeholder: 'پورا نام',
    auth_city_placeholder: 'شہر',
    auth_password_hint: 'مضبوط پاس ورڈ بنائیں',
    auth_college_placeholder: 'قانون کالج',
    auth_area_label: 'دلچسپی کا شعبہ',
    auth_select_area: 'شعبہ منتخب کریں',
    auth_area_criminal: 'فوجداری قانون',
    auth_area_civil: 'دیوانی / جائیداد قانون',
    auth_area_family: 'خاندانی قانون',
    auth_area_consumer: 'صارف قانون',
    auth_area_constitutional: 'آئینی قانون',
    auth_area_all: 'تمام شعبے',
    auth_create_button: 'اکاؤنٹ بنائیں ->',
    auth_already_account: 'پہلے سے اکاؤنٹ ہے؟ <a href="#" onclick="switchTab(\'signin\')">سائن ان کریں</a>',
    auth_reset_title: 'پاس ورڈ ری سیٹ کریں',
    auth_reset_sub: 'اپنا ای میل درج کریں، ہم ری سیٹ لنک بھیجیں گے۔',
    auth_send_reset: 'ری سیٹ لنک بھیجیں',
    auth_back_to_signin: '<a href="#" onclick="switchTab(\'signin\')">← سائن ان پر واپس</a>'
  }
};

const translations = {
  en: { ...BASE_STRINGS, ...EXTRA_TRANSLATIONS.en },
  hi: { ...BASE_STRINGS, ...(LOCAL_TRANSLATIONS.hi || {}), ...EXTRA_TRANSLATIONS.hi },
  ur: { ...BASE_STRINGS, ...EXTRA_TRANSLATIONS.ur }
};

const LANGUAGE_SCRIPT_HINTS = {
  bn: 'বাংলা', te: 'తెలుగు', mr: 'मराठी', ta: 'தமிழ்', ur: 'اردو', gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ', ml: 'മലയാളം', or: 'ଓଡ଼ିଆ', pa: 'ਪੰਜਾਬੀ', as: 'অসমীয়া',
  mai: 'मैथिली', sat: 'ᱥᱟᱱᱛᱟᱲᱤ', ks: 'کٲشُر', ne: 'नेपाली', sd: 'سنڌي',
  kok: 'कोंकणी', doi: 'डोगरी', mni: 'মৈতৈলোন্', brx: 'बड़ो', sa: 'संस्कृतम्',
  bho: 'भोजपुरी', raj: 'राजस्थानी', bgc: 'हरियाणवी', hne: 'छत्तीसगढ़ी',
  mag: 'मगही', awa: 'अवधी', tcy: 'ತುಳು', kha: 'Khasi', grt: 'A.chik',
  lus: 'Mizo', nag: 'Nagamese', lep: 'ᰛᰩᰵᰛᰧᰶ', lbj: 'ལ་དྭགས་སྐད',
  bhb: 'भीली', gon: 'गोंडी', hoc: '𑢹𑣉', kru: 'कुड़ुख़', unr: 'मुंडारी'
};

function getSavedLanguage() {
  const saved = localStorage.getItem('lang') || localStorage.getItem('ns-lang');
  if (saved && LANGUAGE_NAMES[saved]) return saved;
  const browserLang = navigator.language?.split('-')[0];
  return LANGUAGE_NAMES[browserLang] ? browserLang : DEFAULT_LOCALE;
}

function getLangSelectHTML() {
  return `<select class="lang-select" id="lang-select" aria-label="Select language" onchange="changeLanguage(this.value)">` +
    Object.entries(LANGUAGE_NAMES).map(([code, label]) =>
      `<option value="${code}">${label}</option>`
    ).join('') +
    `</select>`;
}

function parseLocalizedJSON(text) {
  if (!text) return null;
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try { return JSON.parse(text.slice(start, end + 1)); } catch (err) { return null; }
}

async function translateDictionary(lang, dictionary, cacheKey) {
  if (lang === DEFAULT_LOCALE) return dictionary;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try { return JSON.parse(cached); } catch (err) {}
  }

  const language = LANGUAGE_NAMES[lang] || lang;
  const system = [
    'You are a professional Indian website localizer.',
    `Translate every JSON value into ${language}.`,
    'Keep the exact same JSON keys.',
    'Preserve HTML tags, placeholders, numbers, brand names, legal acronyms, emojis, and punctuation where appropriate.',
    'Return only valid JSON. Do not add markdown or explanation.'
  ].join(' ');

  const response = await fetch('https://nyaysetu-a5vj.onrender.com/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, message: JSON.stringify(dictionary, null, 2) })
  });

  const data = await response.json();
  const translated = parseLocalizedJSON(data.reply);
  if (!translated) throw new Error('Translation service did not return JSON.');
  localStorage.setItem(cacheKey, JSON.stringify(translated));
  return translated;
}

async function fetchTranslationSet(lang) {
  if (translations[lang]) {
    return translations[lang];
  }
  return translateDictionary(lang, BASE_STRINGS, I18N_CACHE_PREFIX + lang);
}

function makeVisibleFallback(lang) {
  if (lang === DEFAULT_LOCALE) return BASE_STRINGS;
  if (LOCAL_TRANSLATIONS[lang]) return { ...BASE_STRINGS, ...LOCAL_TRANSLATIONS[lang] };

  const language = LANGUAGE_NAMES[lang] || lang;
  const hint = LANGUAGE_SCRIPT_HINTS[lang] || language;
  const fallback = {};

  Object.keys(BASE_STRINGS).forEach(key => {
    const value = BASE_STRINGS[key];
    if (key.endsWith('_page_title') || key === 'page_title') {
      fallback[key] = `${language} - NyaySetu`;
    } else if (typeof value === 'string' && value.includes('<br>')) {
      fallback[key] = `${hint}<br>${value}`;
    } else {
      fallback[key] = `${hint} · ${value}`;
    }
  });

  fallback.hero_sub = `${hint} · Live translation for ${language} needs the NyaySetu backend. Start the backend and select this language again to translate the full website.`;
  fallback.cta_sub = `${hint} · Backend translation is required for full ${language} text.`;
  return fallback;
}

function applyTranslations(strings) {
  Object.keys(strings).forEach(key => {
    const value = strings[key];
    document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el => {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    });
    document.querySelectorAll(`[data-i18n-html="${key}"]`).forEach(el => {
      el.innerHTML = value;
    });
    document.querySelectorAll(`[data-i18n-placeholder="${key}"]`).forEach(el => {
      el.placeholder = value;
    });
  });

  const page = document.body?.dataset.page || 'home';
  const pageTitleKey = `${page}_page_title`;
  document.title = strings[pageTitleKey] || strings.page_title || BASE_STRINGS.page_title;
}

function shouldTranslateTextNode(node) {
  const text = node.nodeValue;
  if (!text || !text.trim()) return false;
  const parent = node.parentElement;
  if (!parent) return false;
  if (parent.closest('script, style, code, pre, textarea, select, option, [data-no-auto-i18n]')) return false;
  if (parent.closest('[data-i18n], [data-i18n-html]')) return false;
  if (/^[\s\d.,:+#%₹$€()/-]+$/.test(text)) return false;
  return /[A-Za-z]/.test(text.trim());
}

function getTextNodes(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node => shouldTranslateTextNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

function stableHash(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

async function autoTranslatePage(lang) {
  if (isApplyingI18n && lang === currentLang) return;
  isApplyingI18n = true;
  try {
    const nodes = getTextNodes();
    const originals = [];

    nodes.forEach(node => {
      if (!TEXT_NODE_ORIGINALS.has(node)) TEXT_NODE_ORIGINALS.set(node, node.nodeValue);
      const original = TEXT_NODE_ORIGINALS.get(node).trim();
      if (original && !originals.includes(original)) originals.push(original);
    });

    document.querySelectorAll('input[placeholder], textarea[placeholder], button[title], [aria-label]').forEach(el => {
      ['placeholder', 'title', 'aria-label'].forEach(attr => {
        const value = el.getAttribute(attr);
        if (!value || !/[A-Za-z]/.test(value) || el.hasAttribute(`data-i18n-${attr}`)) return;
        if (!ATTR_ORIGINALS.has(el)) ATTR_ORIGINALS.set(el, {});
        const store = ATTR_ORIGINALS.get(el);
        if (!store[attr]) store[attr] = value;
        if (!originals.includes(store[attr])) originals.push(store[attr]);
      });
    });

    if (lang === DEFAULT_LOCALE) {
      nodes.forEach(node => { node.nodeValue = TEXT_NODE_ORIGINALS.get(node) || node.nodeValue; });
      document.querySelectorAll('input[placeholder], textarea[placeholder], button[title], [aria-label]').forEach(el => {
        const store = ATTR_ORIGINALS.get(el);
        if (!store) return;
        Object.keys(store).forEach(attr => el.setAttribute(attr, store[attr]));
      });
      return;
    }

    const dictionary = {};
    originals.forEach((text, index) => { dictionary[`auto_${index}`] = text; });
    if (!Object.keys(dictionary).length) return;
    const signature = stableHash(JSON.stringify(dictionary));
    const translated = await translateDictionary(lang, dictionary, `${AUTO_CACHE_PREFIX}${lang}-${signature}`);

    const lookup = {};
    Object.keys(dictionary).forEach(key => { lookup[dictionary[key]] = translated[key] || dictionary[key]; });

    nodes.forEach(node => {
      const originalRaw = TEXT_NODE_ORIGINALS.get(node) || node.nodeValue;
      const original = originalRaw.trim();
      if (!lookup[original]) return;
      const lead = originalRaw.match(/^\s*/)?.[0] || '';
      const tail = originalRaw.match(/\s*$/)?.[0] || '';
      node.nodeValue = `${lead}${lookup[original]}${tail}`;
    });

    document.querySelectorAll('input[placeholder], textarea[placeholder], button[title], [aria-label]').forEach(el => {
      const store = ATTR_ORIGINALS.get(el);
      if (!store) return;
      Object.keys(store).forEach(attr => {
        if (lookup[store[attr]]) el.setAttribute(attr, lookup[store[attr]]);
      });
    });
  } finally {
    isApplyingI18n = false;
  }
}

async function loadLanguage(lang) {
  currentLang = LANGUAGE_NAMES[lang] ? lang : DEFAULT_LOCALE;
  isApplyingI18n = true;
  try {
    currentStrings = { ...BASE_STRINGS, ...(await fetchTranslationSet(currentLang)) };
  } catch (err) {
    console.warn('Translation failed, using local fallback.', err);
    currentStrings = makeVisibleFallback(currentLang);
  }

  window.currentStrings = currentStrings;
  applyTranslations(currentStrings);
  isApplyingI18n = false;
  try { await autoTranslatePage(currentLang); } catch (err) {
    isApplyingI18n = false;
    console.warn('Auto translation skipped.', err);
  }

  document.documentElement.lang = currentLang;
  document.documentElement.dir = ['ur', 'sd', 'ks'].includes(currentLang) ? 'rtl' : 'ltr';
  const select = document.getElementById('lang-select');
  if (select) select.value = currentLang;
  localStorage.setItem('ns-lang', currentLang);
  localStorage.setItem('lang', currentLang);
  if (typeof window.onLanguageChange === 'function') window.onLanguageChange(currentLang);
}

function scheduleAutoTranslate() {
  if (isApplyingI18n || currentLang === DEFAULT_LOCALE) return;
  clearTimeout(autoTranslateTimer);
  autoTranslateTimer = setTimeout(async () => {
    try { await autoTranslatePage(currentLang); } catch (err) { console.warn('Dynamic translation skipped.', err); }
  }, 300);
}

function observeDynamicText() {
  if (mutationObserver || !document.body) return;
  mutationObserver = new MutationObserver(mutations => {
    const shouldTranslate = mutations.some(mutation =>
      Array.from(mutation.addedNodes).some(node => node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE)
    );
    if (shouldTranslate) scheduleAutoTranslate();
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

function setLang(lang) {
  changeLanguage(lang);
}

function changeLanguage(lang) {
  return loadLanguage(lang);
}

function initI18n() {
  if (i18nReady) return;
  i18nReady = true;
  document.querySelectorAll('.nav-lang').forEach(slot => {
    if (!slot.querySelector('#lang-select')) slot.innerHTML = getLangSelectHTML();
  });
  observeDynamicText();
  loadLanguage(getSavedLanguage());
}

function getLanguagePrompt(lang) {
  const language = LANGUAGE_NAMES[lang] || LANGUAGE_NAMES.en;
  if (lang === 'en') return 'Respond in clear English.';
  return `Respond in ${language}. Use the natural script for that language and proper Indian legal terminology.`;
}

window.getLangSelectHTML = getLangSelectHTML;
window.setLang = setLang;
window.changeLanguage = changeLanguage;
window.initI18n = initI18n;
window.applyTranslations = applyTranslations;
window.autoTranslatePage = autoTranslatePage;
window.getLanguagePrompt = getLanguagePrompt;
window.currentStrings = currentStrings;
window.onLanguageChange = null;
window.translations = translations;

setTimeout(() => initI18n(), 0);
