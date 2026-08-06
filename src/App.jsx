import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload, Image as ImageIcon, Sparkles, Download, RotateCcw, Check,
  Aperture, Loader2, AlertCircle, Eye, EyeOff, Zap, ExternalLink,
  Settings, X, Sun, Moon, Languages, Gauge, Trash2,
} from "lucide-react";

// ---------- Design tokens ----------
// Light — paper: #F5F6F0 · panel: #FFFFFF · ink: #14161A · ink-soft: #6E7178
// Dark  — paper: #121317 · panel: #1B1D23 · ink: #F3F3EE · ink-soft: #9B9DA6
// accent (cobalt) · flash (signature yellow) #FFD400 stays constant in both themes

const THEME = {
  light: {
    paper: "#F5F6F0",
    panel: "#FFFFFF",
    panelAlt: "#FBFBF8",
    ink: "#14161A",
    inkSoft: "#6E7178",
    solid: "#14161A",
    onSolid: "#FFFFFF",
    accent: "#2B4CFF",
    accentSoft: "rgba(43,76,255,0.1)",
    flash: "#FFD400",
    hairline: "#E3E1D6",
    hairlineStrong: "#D8D6C9",
    mutedBg: "#EDEEE9",
    disabledBg: "#D8D6C9",
    disabledInk: "#8A887C",
    dangerBg: "#FFF1F0",
    danger: "#B3261E",
    success: "#00A868",
    indexColor: "#B8B6A8",
    overlay: "rgba(20,22,26,0.45)",
    shadow: "0 20px 40px rgba(20,22,26,0.12)",
    drawerShadow: "-24px 0 60px rgba(20,22,26,0.18)",
  },
  dark: {
    paper: "#121317",
    panel: "#1B1D23",
    panelAlt: "#202229",
    ink: "#F3F3EE",
    inkSoft: "#9B9DA6",
    solid: "#F3F3EE",
    onSolid: "#14161A",
    accent: "#6E8CFF",
    accentSoft: "rgba(110,140,255,0.16)",
    flash: "#FFD400",
    hairline: "#2A2C34",
    hairlineStrong: "#34363F",
    mutedBg: "#22242B",
    disabledBg: "#2A2C34",
    disabledInk: "#6E7178",
    dangerBg: "#3A211E",
    danger: "#FF6B5E",
    success: "#33D690",
    indexColor: "#54565F",
    overlay: "rgba(0,0,0,0.6)",
    shadow: "0 20px 40px rgba(0,0,0,0.5)",
    drawerShadow: "-24px 0 60px rgba(0,0,0,0.45)",
  },
};

// ---------- i18n ----------

const I18N = {
  ru: {
    brand: "Карточка",
    heroTitle: "Из фото — в карточку",
    heroDesc: "Загрузите фото товара, настройте сцену — Gemini перерисует окружение, сохранив сам товар без изменений.",
    sectionPhoto: "Фото товара",
    sectionFormat: "Формат",
    sectionTone: "Цветовой тон",
    sectionBackdrop: "Фон / сцена",
    sectionLighting: "Освещение",
    sectionComposition: "Композиция",
    sectionBadge: "Бейдж",
    sectionText: "Текст на карточке",
    dropTitle: "Перетащите фото сюда",
    dropHint: "или нажмите, чтобы выбрать файл",
    titlePlaceholder: "Название товара",
    pricePlaceholder: "Цена, напр. 2 990 ₽",
    generateAI: "Сгенерировать с AI",
    generateLocal: "Собрать карточку",
    generatingAI: "Gemini рисует сцену…",
    generatingComposite: "Собираем карточку…",
    previewEmpty: "Здесь появится превью карточки",
    previewHint: "Настройте сцену слева и нажмите «Сгенерировать»",
    previewError: "Не получилось — исправьте настройки слева и попробуйте снова",
    scanAI: "ЗАПРОС К GEMINI 2.5 FLASH IMAGE",
    scanComposite: "НАКЛАДЫВАЕМ ТЕКСТ И БЕЙДЖИ",
    download: "Скачать",
    again: "Заново",
    geminiConnected: "GEMINI ПОДКЛЮЧЁН",
    localMode: "ЛОКАЛЬНЫЙ РЕЖИМ",
    settingsBtn: "Настройки",
    settingsTitle: "Настройки",
    apiKeyLabel: "Gemini API-ключ",
    apiKeyPlaceholder: "Вставьте ключ из Google AI Studio",
    getKey: "Получить ключ",
    storedLocally: "Хранится только у вас",
    noKeyHint: "Без ключа карточка соберётся локально — фото + оформление, без AI-перерисовки сцены.",
    themeLabel: "Тема оформления",
    themeLight: "Светлая",
    themeDark: "Тёмная",
    languageLabel: "Язык интерфейса",
    exportLabel: "Формат экспорта",
    exportPngDesc: "без потерь, крупнее файл",
    exportJpgDesc: "компактнее, для соцсетей",
    signatureLabel: "Фирменные элементы",
    signatureDesc: "Уголки видоискателя и подпись тона в углу карточки",
    dataLabel: "Локальные данные",
    dataDesc: "Ключ и настройки хранятся только в этом браузере",
    clearBtn: "Очистить всё",
    clearConfirm: "Точно очистить?",
    close: "Закрыть",
    tones: {
      neutral: { label: "Нейтральный", desc: "белый / серый, чисто" },
      warm: { label: "Тёплый", desc: "песочный, кремовый" },
      cool: { label: "Холодный", desc: "голубой, стальной" },
      pastel: { label: "Пастель", desc: "мягкие приглушённые" },
      earthy: { label: "Земляной", desc: "терракота, оливка" },
      mono: { label: "Монохром", desc: "тёмный, контрастный" },
      vibrant: { label: "Яркий", desc: "насыщенные акценты" },
      mint: { label: "Мятный", desc: "свежий, зелёный" },
    },
    backdrops: {
      studio: "Студийный фон", marble: "Мрамор", wood: "Дерево", fabric: "Ткань/шёлк",
      nature: "Природа", urban: "Городской", gradient: "Абстрактный градиент", geometric: "Геометрия",
    },
    lighting: {
      soft: "Мягкий рассеянный", dramatic: "Драматичный боковой", golden: "Золотой час",
      softbox: "Софтбокс студийный", neon: "Неоновый акцент",
    },
    compositions: {
      front: "Анфас по центру", angle: "Ракурс 3/4", flatlay: "Флэтлей сверху", closeup: "Крупный план",
    },
    platforms: {
      square: "Квадрат 1:1", portrait: "Маркетплейс 4:5", story: "Сторис 9:16",
    },
    badges: {
      none: "Без бейджа", hit: "Хит продаж", sale: "Скидка", new: "Новинка", premium: "Premium",
    },
  },
  uk: {
    brand: "Картка",
    heroTitle: "З фото — у картку",
    heroDesc: "Завантажте фото товару, налаштуйте сцену — Gemini перемалює оточення, зберігши сам товар без змін.",
    sectionPhoto: "Фото товару",
    sectionFormat: "Формат",
    sectionTone: "Кольоровий тон",
    sectionBackdrop: "Фон / сцена",
    sectionLighting: "Освітлення",
    sectionComposition: "Композиція",
    sectionBadge: "Бейдж",
    sectionText: "Текст на картці",
    dropTitle: "Перетягніть фото сюди",
    dropHint: "або натисніть, щоб обрати файл",
    titlePlaceholder: "Назва товару",
    pricePlaceholder: "Ціна, напр. 1 299 ₴",
    generateAI: "Згенерувати з AI",
    generateLocal: "Зібрати картку",
    generatingAI: "Gemini малює сцену…",
    generatingComposite: "Збираємо картку…",
    previewEmpty: "Тут з'явиться прев'ю картки",
    previewHint: "Налаштуйте сцену зліва і натисніть «Згенерувати»",
    previewError: "Не вийшло — виправте налаштування зліва і спробуйте знову",
    scanAI: "ЗАПИТ ДО GEMINI 2.5 FLASH IMAGE",
    scanComposite: "НАКЛАДАЄМО ТЕКСТ І БЕЙДЖ",
    download: "Завантажити",
    again: "Спочатку",
    geminiConnected: "GEMINI ПІДКЛЮЧЕНО",
    localMode: "ЛОКАЛЬНИЙ РЕЖИМ",
    settingsBtn: "Налаштування",
    settingsTitle: "Налаштування",
    apiKeyLabel: "Gemini API-ключ",
    apiKeyPlaceholder: "Вставте ключ із Google AI Studio",
    getKey: "Отримати ключ",
    storedLocally: "Зберігається лише у вас",
    noKeyHint: "Без ключа картка збереться локально — фото + оформлення, без AI-перемальовування сцени.",
    themeLabel: "Тема оформлення",
    themeLight: "Світла",
    themeDark: "Темна",
    languageLabel: "Мова інтерфейсу",
    exportLabel: "Формат експорту",
    exportPngDesc: "без втрат, більший файл",
    exportJpgDesc: "компактніше, для соцмереж",
    signatureLabel: "Фірмові елементи",
    signatureDesc: "Кутики видошукача та підпис тону в куті картки",
    dataLabel: "Локальні дані",
    dataDesc: "Ключ і налаштування зберігаються лише в цьому браузері",
    clearBtn: "Очистити все",
    clearConfirm: "Точно очистити?",
    close: "Закрити",
    tones: {
      neutral: { label: "Нейтральний", desc: "білий / сірий, чисто" },
      warm: { label: "Теплий", desc: "піщаний, кремовий" },
      cool: { label: "Холодний", desc: "блакитний, сталевий" },
      pastel: { label: "Пастель", desc: "м'які приглушені" },
      earthy: { label: "Земляний", desc: "теракота, оливка" },
      mono: { label: "Монохром", desc: "темний, контрастний" },
      vibrant: { label: "Яскравий", desc: "насичені акценти" },
      mint: { label: "М'ятний", desc: "свіжий, зелений" },
    },
    backdrops: {
      studio: "Студійний фон", marble: "Мармур", wood: "Дерево", fabric: "Тканина/шовк",
      nature: "Природа", urban: "Міський", gradient: "Абстрактний градієнт", geometric: "Геометрія",
    },
    lighting: {
      soft: "М'яке розсіяне", dramatic: "Драматичне бокове", golden: "Золота година",
      softbox: "Софтбокс студійний", neon: "Неоновий акцент",
    },
    compositions: {
      front: "Анфас по центру", angle: "Ракурс 3/4", flatlay: "Флетлей зверху", closeup: "Великий план",
    },
    platforms: {
      square: "Квадрат 1:1", portrait: "Маркетплейс 4:5", story: "Сторіс 9:16",
    },
    badges: {
      none: "Без бейджа", hit: "Хіт продажів", sale: "Знижка", new: "Новинка", premium: "Premium",
    },
  },
  en: {
    brand: "CardStudio",
    heroTitle: "From photo to product card",
    heroDesc: "Upload a product photo and tune the scene — Gemini repaints the environment while keeping the product itself untouched.",
    sectionPhoto: "Product photo",
    sectionFormat: "Format",
    sectionTone: "Color tone",
    sectionBackdrop: "Backdrop / scene",
    sectionLighting: "Lighting",
    sectionComposition: "Composition",
    sectionBadge: "Badge",
    sectionText: "Card text",
    dropTitle: "Drag a photo here",
    dropHint: "or click to choose a file",
    titlePlaceholder: "Product title",
    pricePlaceholder: "Price, e.g. $29.90",
    generateAI: "Generate with AI",
    generateLocal: "Assemble card",
    generatingAI: "Gemini is painting the scene…",
    generatingComposite: "Assembling the card…",
    previewEmpty: "Your card preview will appear here",
    previewHint: "Tune the scene on the left and hit “Generate”",
    previewError: "Something went wrong — adjust the settings on the left and try again",
    scanAI: "REQUESTING GEMINI 2.5 FLASH IMAGE",
    scanComposite: "COMPOSITING TEXT & BADGE",
    download: "Download",
    again: "Start over",
    geminiConnected: "GEMINI CONNECTED",
    localMode: "LOCAL MODE",
    settingsBtn: "Settings",
    settingsTitle: "Settings",
    apiKeyLabel: "Gemini API key",
    apiKeyPlaceholder: "Paste your key from Google AI Studio",
    getKey: "Get a key",
    storedLocally: "Stored only on your device",
    noKeyHint: "Without a key the card is assembled locally — photo + layout, no AI scene repaint.",
    themeLabel: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    languageLabel: "Interface language",
    exportLabel: "Export format",
    exportPngDesc: "lossless, larger file",
    exportJpgDesc: "smaller, for social",
    signatureLabel: "Signature elements",
    signatureDesc: "Viewfinder corners and the tone tag in the card corner",
    dataLabel: "Local data",
    dataDesc: "The key and settings are stored only in this browser",
    clearBtn: "Clear everything",
    clearConfirm: "Confirm clear?",
    close: "Close",
    tones: {
      neutral: { label: "Neutral", desc: "white / grey, clean" },
      warm: { label: "Warm", desc: "sandy, cream" },
      cool: { label: "Cool", desc: "blue, steel" },
      pastel: { label: "Pastel", desc: "soft muted" },
      earthy: { label: "Earthy", desc: "terracotta, olive" },
      mono: { label: "Monochrome", desc: "dark, high-contrast" },
      vibrant: { label: "Vibrant", desc: "saturated accents" },
      mint: { label: "Mint", desc: "fresh green" },
    },
    backdrops: {
      studio: "Studio backdrop", marble: "Marble", wood: "Wood", fabric: "Fabric / silk",
      nature: "Nature", urban: "Urban", gradient: "Abstract gradient", geometric: "Geometric",
    },
    lighting: {
      soft: "Soft diffused", dramatic: "Dramatic side", golden: "Golden hour",
      softbox: "Studio softbox", neon: "Neon accent",
    },
    compositions: {
      front: "Centered front", angle: "3/4 angle", flatlay: "Top-down flat lay", closeup: "Close-up",
    },
    platforms: {
      square: "Square 1:1", portrait: "Marketplace 4:5", story: "Story 9:16",
    },
    badges: {
      none: "No badge", hit: "Bestseller", sale: "Sale", new: "New", premium: "Premium",
    },
  },
};

const LANGUAGES = [
  { id: "uk", native: "Українська" },
  { id: "ru", native: "Русский" },
  { id: "en", native: "English" },
];

const TONES = [
  { id: "neutral", swatch: "linear-gradient(135deg,#FAFAF7,#E4E4DD)", prompt: "clean neutral white and light grey studio tones" },
  { id: "warm", swatch: "linear-gradient(135deg,#FBEFDD,#E8B98C)", prompt: "warm sandy, cream and caramel tones" },
  { id: "cool", swatch: "linear-gradient(135deg,#DCE6FF,#8FA6D6)", prompt: "cool steel-blue and ice tones" },
  { id: "pastel", swatch: "linear-gradient(135deg,#F6DDE8,#D6E8F6)", prompt: "soft muted pastel tones, pink and mint" },
  { id: "earthy", swatch: "linear-gradient(135deg,#E3C7A5,#8A7B5C)", prompt: "earthy terracotta, olive and clay tones" },
  { id: "mono", swatch: "linear-gradient(135deg,#3A3D45,#101114)", prompt: "moody monochrome charcoal and black tones, high contrast" },
  { id: "vibrant", swatch: "linear-gradient(135deg,#FF8A65,#7C4DFF)", prompt: "vibrant saturated color-blocked tones" },
  { id: "mint", swatch: "linear-gradient(135deg,#D8F3E3,#7FC9A0)", prompt: "fresh mint and sage green tones" },
];

const BACKDROPS = [
  { id: "studio", prompt: "seamless professional studio backdrop" },
  { id: "marble", prompt: "polished marble surface" },
  { id: "wood", prompt: "natural wooden table surface" },
  { id: "fabric", prompt: "draped silk fabric background" },
  { id: "nature", prompt: "soft natural outdoor setting with foliage, blurred background" },
  { id: "urban", prompt: "minimal urban concrete setting" },
  { id: "gradient", prompt: "smooth abstract gradient background" },
  { id: "geometric", prompt: "minimalist geometric shapes background" },
];

const LIGHTING = [
  { id: "soft", prompt: "soft diffused even lighting" },
  { id: "dramatic", prompt: "dramatic side lighting with defined shadows" },
  { id: "golden", prompt: "warm golden-hour lighting" },
  { id: "softbox", prompt: "bright studio softbox lighting, e-commerce style" },
  { id: "neon", prompt: "subtle neon rim-light accent" },
];

const COMPOSITIONS = [
  { id: "front", prompt: "centered front-facing composition" },
  { id: "angle", prompt: "three-quarter angle composition" },
  { id: "flatlay", prompt: "top-down flat-lay composition" },
  { id: "closeup", prompt: "close-up detail composition" },
];

const PLATFORMS = [
  { id: "square", ratio: "1:1", w: 1024, h: 1024 },
  { id: "portrait", ratio: "4:5", w: 1024, h: 1280 },
  { id: "story", ratio: "9:16", w: 1024, h: 1820 },
];

const BADGES = [
  { id: "none" },
  { id: "hit", color: "#2B4CFF" },
  { id: "sale", color: "#FF3B30" },
  { id: "new", color: "#00A868" },
  { id: "premium", color: "#14161A" },
];

const MODEL = "gemini-2.5-flash-image";
const PREFS_KEY = "card-studio-prefs";
const API_KEY_KEY = "gemini-api-key";

function useGoogleFonts() {
  useEffect(() => {
    if (document.getElementById("card-studio-fonts")) return;
    const link = document.createElement("link");
    link.id = "card-studio-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

function buildPrompt({ tone, backdrop, lighting, composition }) {
  const t = TONES.find((x) => x.id === tone);
  const b = BACKDROPS.find((x) => x.id === backdrop);
  const l = LIGHTING.find((x) => x.id === lighting);
  const c = COMPOSITIONS.find((x) => x.id === composition);
  return (
    `Turn this product photo into a professional, high-end e-commerce marketing image. ` +
    `Keep the product itself completely unchanged — exact shape, proportions, color, logo, and texture must be preserved with full fidelity, do not distort, warp or reinterpret the product. ` +
    `Place it in a ${b.prompt}, with ${l.prompt}, in ${t.prompt}. Use a ${c.prompt}. ` +
    `Add a soft realistic contact shadow beneath the product so it looks physically grounded in the scene. ` +
    `The result should look like a polished marketplace listing photo shot by a professional product photographer. ` +
    `Do not add any text, price tags, watermarks or logos to the image — leave clean space near the edges for captions to be added separately.`
  );
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function generateWithGemini({ apiKey, base64, mimeType, prompt, aspectRatio }) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType, data: base64 } },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: { aspectRatio },
        },
      }),
    }
  );

  if (!res.ok) {
    let detail = "";
    try {
      const errJson = await res.json();
      detail = errJson?.error?.message || "";
    } catch {
      detail = await res.text();
    }
    if (res.status === 400 && /API key/i.test(detail)) throw new Error("Неверный API-ключ.");
    if (res.status === 403) throw new Error("Доступ запрещён — проверьте ключ и включён ли биллинг в Google AI Studio.");
    if (res.status === 429) throw new Error("Превышен лимит запросов — подождите немного и попробуйте снова.");
    throw new Error(detail || `Ошибка Gemini API (${res.status})`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find((p) => p.inlineData);
  if (!imgPart) {
    const blockReason = data?.promptFeedback?.blockReason;
    if (blockReason) throw new Error(`Запрос заблокирован модерацией (${blockReason}).`);
    throw new Error("Модель не вернула изображение. Попробуйте другой стиль.");
  }
  return `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}`;
}

export default function CardStudio() {
  useGoogleFonts();

  const [photoFile, setPhotoFile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoImg, setPhotoImg] = useState(null);

  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("ru");
  const [exportFormat, setExportFormat] = useState("png");
  const [signature, setSignature] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [clearArmed, setClearArmed] = useState(false);

  const [tone, setTone] = useState("neutral");
  const [backdrop, setBackdrop] = useState("studio");
  const [lighting, setLighting] = useState("soft");
  const [composition, setComposition] = useState("front");
  const [platform, setPlatform] = useState("portrait");
  const [badge, setBadge] = useState("none");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const [phase, setPhase] = useState("idle"); // idle | uploading-ai | compositing | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [resultUrl, setResultUrl] = useState(null);

  const canvasRef = useRef(null);

  const c = THEME[theme];
  const tt = I18N[lang];

  // ---- load persisted key + preferences once ----
  useEffect(() => {
    try {
      const storedKey = window.localStorage.getItem(API_KEY_KEY);
      if (storedKey) setApiKey(storedKey);
      const storedPrefs = window.localStorage.getItem(PREFS_KEY);
      if (storedPrefs) {
        const p = JSON.parse(storedPrefs);
        if (p.theme === "light" || p.theme === "dark") setTheme(p.theme);
        if (p.lang === "ru" || p.lang === "uk" || p.lang === "en") setLang(p.lang);
        if (p.exportFormat === "png" || p.exportFormat === "jpeg") setExportFormat(p.exportFormat);
        if (typeof p.signature === "boolean") setSignature(p.signature);
      }
    } catch {
      // localStorage unavailable (private mode etc.) — fine, prefs just won't persist
    } finally {
      setPrefsLoaded(true);
    }
  }, []);

  // ---- persist preferences on change ----
  useEffect(() => {
    if (!prefsLoaded) return;
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify({ theme, lang, exportFormat, signature }));
    } catch {
      // best effort
    }
  }, [theme, lang, exportFormat, signature, prefsLoaded]);

  // revert the "confirm clear" arm state after a few seconds
  useEffect(() => {
    if (!clearArmed) return;
    const id = setTimeout(() => setClearArmed(false), 4000);
    return () => clearTimeout(id);
  }, [clearArmed]);

  const persistKey = (val) => {
    setApiKey(val);
    try {
      window.localStorage.setItem(API_KEY_KEY, val);
    } catch {
      // best effort — key still works for this session even if save fails
    }
  };

  const clearAllData = () => {
    if (!clearArmed) {
      setClearArmed(true);
      return;
    }
    try {
      window.localStorage.removeItem(API_KEY_KEY);
      window.localStorage.removeItem(PREFS_KEY);
    } catch {
      // best effort
    }
    setApiKey("");
    setTheme("light");
    setExportFormat("png");
    setSignature(true);
    setClearArmed(false);
  };

  const onFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setPhotoImg(img);
      setPhoto(url);
      setPhotoFile(file);
      setResultUrl(null);
      setPhase("idle");
    };
    img.src = url;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onFile(e.dataTransfer.files?.[0]);
  };

  const composite = useCallback(async (baseImage, platformCfg) => {
    const canvas = canvasRef.current;
    const W = platformCfg.w;
    const H = platformCfg.h;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // cover-fit the base (AI or local) image
    const scale = Math.max(W / baseImage.width, H / baseImage.height);
    const dw = baseImage.width * scale;
    const dh = baseImage.height * scale;
    ctx.drawImage(baseImage, (W - dw) / 2, (H - dh) / 2, dw, dh);

    const dark = tone === "mono";
    const textColor = dark ? "#F5F6F0" : "#14161A";
    const softColor = dark ? "rgba(245,246,240,0.72)" : "rgba(20,22,26,0.6)";
    const m = Math.round(W * 0.045);
    const tr = I18N[lang];

    await document.fonts.ready;

    // subtle bottom gradient so text stays legible over any scene
    if (title || price) {
      const grad = ctx.createLinearGradient(0, H * 0.72, 0, H);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, dark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.75)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, H * 0.72, W, H * 0.28);
    }

    if (signature) {
      // viewfinder corner brackets — signature element
      const bl = Math.round(W * 0.035);
      ctx.strokeStyle = dark ? "rgba(255,255,255,0.55)" : "rgba(20,22,26,0.5)";
      ctx.lineWidth = 2.5;
      const drawCorner = (x, y, hx, vy) => {
        ctx.beginPath();
        ctx.moveTo(x, y + bl * vy);
        ctx.lineTo(x, y);
        ctx.lineTo(x + bl * hx, y);
        ctx.stroke();
      };
      drawCorner(m, m, 1, 1);
      drawCorner(W - m, m, -1, 1);
      drawCorner(m, H - m, 1, -1);
      drawCorner(W - m, H - m, -1, -1);
    }

    if (badge !== "none") {
      const b = BADGES.find((x) => x.id === badge);
      const label = tr.badges[badge].toUpperCase();
      const fs = Math.round(W * 0.024);
      ctx.font = `700 ${fs}px Manrope`;
      const textW = ctx.measureText(label).width;
      const padX = fs;
      const bw = textW + padX * 2;
      const bh = fs * 2.1;
      const bx = m + 4;
      const by = m + 26;
      ctx.fillStyle = b.color;
      roundRect(ctx, bx, by, bw, bh, bh / 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.textBaseline = "middle";
      ctx.fillText(label, bx + padX, by + bh / 2 + 1);
    }

    let ty = H - m - 8;
    if (price) {
      const fs = Math.round(W * 0.05);
      ctx.font = `600 ${fs}px Fraunces`;
      ctx.fillStyle = textColor;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(price, m, ty);
      ty -= fs * 1.25;
    }
    if (title) {
      const fs = Math.round(W * 0.032);
      ctx.font = `500 ${fs}px Manrope`;
      ctx.fillStyle = softColor;
      wrapText(ctx, title, m, ty, W - m * 2, fs * 1.25, 2);
    }

    if (signature) {
      ctx.font = `500 ${Math.round(W * 0.016)}px IBM Plex Mono`;
      ctx.fillStyle = softColor;
      ctx.textAlign = "right";
      ctx.fillText(`${tr.tones[tone].label.toUpperCase()} · AI`, W - m, H - m - 8);
    }

    const mime = exportFormat === "jpeg" ? "image/jpeg" : "image/png";
    return exportFormat === "jpeg" ? canvas.toDataURL(mime, 0.92) : canvas.toDataURL(mime);
  }, [tone, badge, title, price, signature, exportFormat, lang]);

  const generate = async () => {
    if (!photoImg || !photoFile) return;
    setErrorMsg("");
    setResultUrl(null);
    const platformCfg = PLATFORMS.find((p) => p.id === platform);

    try {
      let baseImage = photoImg;

      if (apiKey.trim()) {
        setPhase("uploading-ai");
        const base64 = await fileToBase64(photoFile);
        const prompt = buildPrompt({ tone, backdrop, lighting, composition });
        const dataUrl = await generateWithGemini({
          apiKey: apiKey.trim(),
          base64,
          mimeType: photoFile.type || "image/jpeg",
          prompt,
          aspectRatio: platformCfg.ratio,
        });
        const aiImg = await loadImage(dataUrl);
        baseImage = aiImg;
      }

      setPhase("compositing");
      const finalUrl = await composite(baseImage, platformCfg);
      setResultUrl(finalUrl);
      setPhase("done");
    } catch (err) {
      setErrorMsg(err.message || "Не удалось сгенерировать карточку.");
      setPhase("error");
    }
  };

  const reset = () => {
    setPhoto(null);
    setPhotoImg(null);
    setPhotoFile(null);
    setResultUrl(null);
    setTitle("");
    setPrice("");
    setBadge("none");
    setPhase("idle");
    setErrorMsg("");
  };

  const busy = phase === "uploading-ai" || phase === "compositing";
  const downloadExt = exportFormat === "jpeg" ? "jpg" : "png";

  return (
    <div
      style={{ fontFamily: "Manrope, sans-serif", background: c.paper, color: c.ink, transition: "background-color .2s ease, color .2s ease" }}
      className="min-h-screen w-full"
    >
      <canvas ref={canvasRef} className="hidden" />

      <header className="border-b" style={{ borderColor: c.hairline, transition: "border-color .2s ease" }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: c.solid }}>
              <Aperture size={16} color={c.flash} strokeWidth={2.2} />
            </div>
            <span style={{ fontFamily: "Fraunces, serif" }} className="text-lg font-medium tracking-tight">{tt.brand}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div
              className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
              style={{ background: c.panel, border: `1px solid ${c.hairline}`, color: c.inkSoft, fontFamily: "IBM Plex Mono, monospace" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: apiKey ? c.success : c.hairlineStrong }} />
              {apiKey ? tt.geminiConnected : tt.localMode}
            </div>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label={tt.settingsBtn}
              className="icon-btn relative w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: c.panel, border: `1px solid ${c.hairline}`, color: c.ink }}
            >
              <Settings size={16} />
              {!apiKey && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                  style={{ background: c.flash, border: `2px solid ${c.paper}` }}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[400px_1fr] gap-8">
        <div className="space-y-6">
          <div>
            <h1 style={{ fontFamily: "Fraunces, serif" }} className="text-[2rem] leading-[1.1] font-medium tracking-tight mb-2">
              {tt.heroTitle}
            </h1>
            <p style={{ color: c.inkSoft }} className="text-[15px] leading-relaxed">
              {tt.heroDesc}
            </p>
          </div>

          <Section index="01" title={tt.sectionPhoto} c={c}>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative rounded-2xl border-2 border-dashed cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 py-8 text-center"
              style={{ borderColor: photo ? c.accent : c.hairlineStrong, background: c.panel }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onFile(e.target.files?.[0])}
                style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
              />
              {photo ? (
                <img src={photo} alt="товар" className="h-24 rounded-lg object-contain" />
              ) : (
                <>
                  <Upload size={22} color={c.inkSoft} />
                  <span className="text-sm font-medium">{tt.dropTitle}</span>
                  <span className="text-xs" style={{ color: c.inkSoft }}>{tt.dropHint}</span>
                </>
              )}
            </label>
          </Section>

          <Section index="02" title={tt.sectionFormat} c={c}>
            <ButtonRow>
              {PLATFORMS.map((p) => (
                <Pill key={p.id} active={platform === p.id} onClick={() => setPlatform(p.id)} c={c}>{tt.platforms[p.id]}</Pill>
              ))}
            </ButtonRow>
          </Section>

          <Section index="03" title={tt.sectionTone} c={c}>
            <div className="grid grid-cols-2 gap-2.5">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className="rounded-xl overflow-hidden text-left transition-all"
                  style={{ border: tone === t.id ? `2px solid ${c.accent}` : "2px solid transparent", boxShadow: "0 1px 2px rgba(20,22,26,0.06)" }}
                >
                  <div style={{ background: t.swatch, height: 40 }} />
                  <div className="px-2.5 py-1.5" style={{ background: c.panel }}>
                    <div className="text-[12px] font-semibold flex items-center gap-1">
                      {tt.tones[t.id].label}
                      {tone === t.id && <Check size={11} color={c.accent} />}
                    </div>
                    <div style={{ color: c.inkSoft }} className="text-[10px]">{tt.tones[t.id].desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          <Section index="04" title={tt.sectionBackdrop} c={c}>
            <ButtonRow>
              {BACKDROPS.map((b) => (
                <Pill key={b.id} active={backdrop === b.id} onClick={() => setBackdrop(b.id)} c={c}>{tt.backdrops[b.id]}</Pill>
              ))}
            </ButtonRow>
          </Section>

          <Section index="05" title={tt.sectionLighting} c={c}>
            <ButtonRow>
              {LIGHTING.map((l) => (
                <Pill key={l.id} active={lighting === l.id} onClick={() => setLighting(l.id)} c={c}>{tt.lighting[l.id]}</Pill>
              ))}
            </ButtonRow>
          </Section>

          <Section index="06" title={tt.sectionComposition} c={c}>
            <ButtonRow>
              {COMPOSITIONS.map((cm) => (
                <Pill key={cm.id} active={composition === cm.id} onClick={() => setComposition(cm.id)} c={c}>{tt.compositions[cm.id]}</Pill>
              ))}
            </ButtonRow>
          </Section>

          <Section index="07" title={tt.sectionBadge} c={c}>
            <ButtonRow>
              {BADGES.map((b) => (
                <Pill key={b.id} active={badge === b.id} onClick={() => setBadge(b.id)} c={c}>{tt.badges[b.id]}</Pill>
              ))}
            </ButtonRow>
          </Section>

          <Section index="08" title={tt.sectionText} c={c}>
            <div className="space-y-2.5">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={tt.titlePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={{ border: `1px solid ${c.hairline}`, background: c.panel, color: c.ink }}
              />
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={tt.pricePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={{ border: `1px solid ${c.hairline}`, background: c.panel, color: c.ink }}
              />
            </div>
          </Section>

          <button
            onClick={generate}
            disabled={!photoImg || busy}
            className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity"
            style={{
              background: !photoImg ? c.disabledBg : c.solid,
              color: !photoImg ? c.disabledInk : c.onSolid,
              cursor: !photoImg || busy ? "not-allowed" : "pointer",
            }}
          >
            {busy ? <Loader2 size={16} className="animate-spin" color={c.flash} /> : apiKey ? <Sparkles size={16} color={c.flash} /> : <Zap size={16} color={c.flash} />}
            {phase === "uploading-ai" ? tt.generatingAI : phase === "compositing" ? tt.generatingComposite : apiKey ? tt.generateAI : tt.generateLocal}
          </button>
          {errorMsg && (
            <div className="flex items-start gap-2 text-sm p-3 rounded-lg" style={{ background: c.dangerBg, color: c.danger }}>
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-8 self-start">
          <div
            className="rounded-3xl p-6 sm:p-10 flex items-center justify-center min-h-[480px] relative overflow-hidden"
            style={{ background: c.panel, border: `1px solid ${c.hairline}` }}
          >
            {!photo && (
              <div className="text-center" style={{ color: c.inkSoft }}>
                <ImageIcon size={32} className="mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm">{tt.previewEmpty}</p>
              </div>
            )}

            {photo && phase === "idle" && !resultUrl && (
              <div className="text-center max-w-xs">
                <img src={photo} alt="товар" className="max-h-64 mx-auto rounded-xl mb-4 object-contain" />
                <p className="text-sm" style={{ color: c.inkSoft }}>{tt.previewHint}</p>
              </div>
            )}

            {busy && (
              <div className="w-full max-w-sm text-center">
                <div className="relative rounded-2xl overflow-hidden mb-5" style={{ aspectRatio: "4/5", background: c.mutedBg }}>
                  <img src={photo} alt="товар" className="w-full h-full object-contain p-8 opacity-60" />
                  <div className="scan-line" style={{ "--flash": c.flash }} />
                </div>
                <p style={{ fontFamily: "IBM Plex Mono, monospace", color: c.inkSoft }} className="text-xs tracking-wide">
                  {phase === "uploading-ai" ? tt.scanAI : tt.scanComposite}
                </p>
              </div>
            )}

            {phase === "error" && (
              <div className="text-center max-w-xs">
                <AlertCircle size={28} className="mx-auto mb-3" color={c.danger} />
                <p className="text-sm" style={{ color: c.inkSoft }}>{tt.previewError}</p>
              </div>
            )}

            {resultUrl && phase === "done" && (
              <div className="w-full max-w-sm">
                <div className="rounded-2xl overflow-hidden mb-5" style={{ boxShadow: c.shadow }}>
                  <img src={resultUrl} alt="готовая карточка" className="w-full block" />
                </div>
                <div className="flex gap-2.5">
                  <a
                    href={resultUrl}
                    download={`card.${downloadExt}`}
                    className="flex-1 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-1.5"
                    style={{ background: c.solid, color: c.onSolid }}
                  >
                    <Download size={15} color={c.flash} />
                    {tt.download}
                  </a>
                  <button
                    onClick={reset}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-1.5"
                    style={{ border: `1px solid ${c.hairline}`, color: c.inkSoft }}
                  >
                    <RotateCcw size={15} />
                    {tt.again}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0"
            style={{ background: c.overlay, animation: "fadeIn .18s ease" }}
            onClick={() => setSettingsOpen(false)}
          />
          <div
            className="relative w-full sm:w-[420px] h-full overflow-y-auto drawer-in"
            style={{ background: c.panel, borderLeft: `1px solid ${c.hairline}`, boxShadow: c.drawerShadow }}
          >
            <div
              className="sticky top-0 flex items-center justify-between px-6 py-5 border-b backdrop-blur"
              style={{ borderColor: c.hairline, background: c.panel }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: c.solid }}>
                  <Settings size={15} color={c.flash} />
                </div>
                <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-lg font-medium tracking-tight">{tt.settingsTitle}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label={tt.close}
                className="icon-btn w-8 h-8 rounded-full flex items-center justify-center"
                style={{ border: `1px solid ${c.hairline}`, color: c.inkSoft }}
              >
                <X size={15} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-7">
              <Section index="01" title={tt.apiKeyLabel} c={c}>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => persistKey(e.target.value)}
                    placeholder={tt.apiKeyPlaceholder}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-lg text-sm outline-none"
                    style={{ border: `1px solid ${c.hairline}`, background: c.panelAlt, color: c.ink, fontFamily: "IBM Plex Mono, monospace" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: c.inkSoft }}
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs flex items-center gap-1"
                    style={{ color: c.accent }}
                  >
                    {tt.getKey} <ExternalLink size={11} />
                  </a>
                  <span className="text-xs" style={{ color: c.inkSoft }}>{tt.storedLocally}</span>
                </div>
                {!apiKey && (
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: c.inkSoft }}>
                    {tt.noKeyHint}
                  </p>
                )}
              </Section>

              <Section index="02" title={tt.themeLabel} c={c}>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setTheme("light")}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: theme === "light" ? c.solid : c.panelAlt,
                      color: theme === "light" ? c.onSolid : c.ink,
                      border: `1px solid ${theme === "light" ? c.solid : c.hairline}`,
                    }}
                  >
                    <Sun size={15} color={theme === "light" ? c.flash : c.inkSoft} />
                    {tt.themeLight}
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: theme === "dark" ? c.solid : c.panelAlt,
                      color: theme === "dark" ? c.onSolid : c.ink,
                      border: `1px solid ${theme === "dark" ? c.solid : c.hairline}`,
                    }}
                  >
                    <Moon size={15} color={theme === "dark" ? c.flash : c.inkSoft} />
                    {tt.themeDark}
                  </button>
                </div>
              </Section>

              <Section index="03" title={tt.languageLabel} c={c}>
                <ButtonRow>
                  {LANGUAGES.map((l) => (
                    <Pill key={l.id} active={lang === l.id} onClick={() => setLang(l.id)} c={c}>
                      <span className="flex items-center gap-1.5">
                        <Languages size={12} style={{ opacity: lang === l.id ? 1 : 0.5 }} />
                        {l.native}
                      </span>
                    </Pill>
                  ))}
                </ButtonRow>
              </Section>

              <Section index="04" title={tt.exportLabel} c={c}>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setExportFormat("png")}
                    className="text-left px-3.5 py-2.5 rounded-lg transition-colors"
                    style={{
                      background: exportFormat === "png" ? c.accentSoft : c.panelAlt,
                      border: `1px solid ${exportFormat === "png" ? c.accent : c.hairline}`,
                    }}
                  >
                    <div className="text-sm font-semibold flex items-center gap-1">
                      PNG
                      {exportFormat === "png" && <Check size={12} color={c.accent} />}
                    </div>
                    <div className="text-[11px]" style={{ color: c.inkSoft }}>{tt.exportPngDesc}</div>
                  </button>
                  <button
                    onClick={() => setExportFormat("jpeg")}
                    className="text-left px-3.5 py-2.5 rounded-lg transition-colors"
                    style={{
                      background: exportFormat === "jpeg" ? c.accentSoft : c.panelAlt,
                      border: `1px solid ${exportFormat === "jpeg" ? c.accent : c.hairline}`,
                    }}
                  >
                    <div className="text-sm font-semibold flex items-center gap-1">
                      JPEG
                      {exportFormat === "jpeg" && <Check size={12} color={c.accent} />}
                    </div>
                    <div className="text-[11px]" style={{ color: c.inkSoft }}>{tt.exportJpgDesc}</div>
                  </button>
                </div>
              </Section>

              <Section index="05" title={tt.signatureLabel} c={c}>
                <div className="flex items-center justify-between gap-4 p-3.5 rounded-lg" style={{ background: c.panelAlt, border: `1px solid ${c.hairline}` }}>
                  <div className="flex items-start gap-2.5">
                    <Gauge size={16} color={c.inkSoft} className="mt-0.5 shrink-0" />
                    <p className="text-xs leading-relaxed" style={{ color: c.inkSoft }}>{tt.signatureDesc}</p>
                  </div>
                  <Switch checked={signature} onChange={setSignature} c={c} />
                </div>
              </Section>

              <Section index="06" title={tt.dataLabel} c={c}>
                <div className="flex items-center justify-between gap-4 p-3.5 rounded-lg" style={{ background: c.dangerBg }}>
                  <p className="text-xs leading-relaxed" style={{ color: c.danger }}>{tt.dataDesc}</p>
                  <button
                    onClick={clearAllData}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap"
                    style={{ background: clearArmed ? c.danger : "transparent", color: clearArmed ? "#FFFFFF" : c.danger, border: `1px solid ${c.danger}` }}
                  >
                    <Trash2 size={13} />
                    {clearArmed ? tt.clearConfirm : tt.clearBtn}
                  </button>
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scan-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--flash, #FFD400), transparent);
          box-shadow: 0 0 16px 2px rgba(255,212,0,0.6);
          animation: scan 1.6s ease-in-out infinite;
        }
        @keyframes scan { 0% { top: 4%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 92%; opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .scan-line { animation: none; top: 50%; } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .icon-btn { transition: transform .15s ease, opacity .15s ease; }
        .icon-btn:hover { transform: translateY(-1px); opacity: 0.8; }
        .icon-btn:active { transform: translateY(0); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .drawer-in { animation: drawerIn .22s cubic-bezier(.16,1,.3,1); }
        @keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) { .drawer-in { animation: none; } }
      `}</style>
    </div>
  );
}

function Section({ index, title, children, c }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span style={{ fontFamily: "IBM Plex Mono, monospace", color: c.indexColor }} className="text-[11px] tracking-wider">{index}</span>
        <h2 className="text-[13px] font-semibold tracking-wide">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ButtonRow({ children }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Pill({ active, onClick, children, c }) {
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors"
      style={{
        background: active ? c.solid : c.panel,
        color: active ? c.onSolid : c.ink,
        border: active ? `1px solid ${c.solid}` : `1px solid ${c.hairline}`,
      }}
    >
      {children}
    </button>
  );
}

function Switch({ checked, onChange, c }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex items-center shrink-0 transition-colors"
      style={{
        width: 40, height: 24, borderRadius: 999,
        background: checked ? c.accent : c.hairlineStrong,
        border: `1px solid ${checked ? c.accent : c.hairline}`,
      }}
    >
      <span
        className="block rounded-full transition-transform"
        style={{ width: 18, height: 18, background: "#FFFFFF", transform: `translateX(${checked ? 18 : 2}px)`, boxShadow: "0 1px 2px rgba(0,0,0,0.25)" }}
      />
    </button>
  );
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(" ");
  let line = "";
  let lines = [];
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  lines = lines.slice(0, maxLines);
  lines.forEach((l, i) => ctx.fillText(l.trim(), x, y - (lines.length - 1 - i) * lineHeight));
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}