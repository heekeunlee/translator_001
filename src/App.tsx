import { useState, useEffect, useRef } from 'react';
import { Mic, StopCircle, Volume2, ChevronDown, Camera, X } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { translateText } from './services/translate';

type LanguageCode = 'en-US' | 'tl-PH' | 'ceb-PH';

interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'tl-PH', label: 'Tagalog', flag: '🇵🇭' },
  { code: 'ceb-PH', label: 'Cebuano', flag: '🏝️' },
];

function App() {
  const [foreignLang, setForeignLang] = useState<LanguageCode>('en-US');
  const [direction, setDirection] = useState<'FOREIGN_TO_KR' | 'KR_TO_FOREIGN'>('KR_TO_FOREIGN');

  const sourceLang = direction === 'FOREIGN_TO_KR' ? foreignLang : 'ko-KR';
  const targetLang = direction === 'FOREIGN_TO_KR' ? 'ko-KR' : foreignLang;

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition(sourceLang);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // OCR State
  const [ocrText, setOcrText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentForeignLang = LANGUAGES.find(l => l.code === foreignLang)!;

  // Combined input text (Speech takes precedence only if actively listening/transcribing, otherwise show OCR if available)
  const displayText = isListening ? transcript : (ocrText || transcript);

  // Debounce translation
  useEffect(() => {
    const textToTranslate = displayText;

    const timer = setTimeout(async () => {
      if (textToTranslate.trim()) {
        setIsTranslating(true);
        const result = await translateText(textToTranslate, sourceLang, targetLang);
        setTranslatedText(result.translatedText || '');
        setIsTranslating(false);
      } else {
        setTranslatedText('');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [displayText, sourceLang, targetLang]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setOcrText(''); // Clear OCR text when starting speech
      startListening();
      setTranslatedText('');
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isListening) stopListening();
    setIsScanning(true);
    setOcrText('');
    setTranslatedText('');

    try {
      // Basic mapping for Tesseract
      // Note: Tesseract language codes: 'eng', 'kor', 'ceb', 'tgl' (Tagalog)
      let tessLang = 'eng';
      if (sourceLang === 'ko-KR') tessLang = 'kor';
      else if (sourceLang === 'tl-PH') tessLang = 'tgl';
      else if (sourceLang === 'ceb-PH') tessLang = 'ceb';

      const worker = await createWorker(tessLang);

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      setOcrText(text.replace(/\s+/g, ' ').trim());
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Failed to scan text. Please try again.");
    } finally {
      setIsScanning(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const speakTranslation = () => {
    if (!translatedText) return;
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLang;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-100">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-between shadow-lg">
          <h1 className="text-xl font-bold flex items-center gap-2 drop-shadow-md">
            <span className="text-2xl">🍧</span>
            HaloHalo Talk
          </h1>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full hover:bg-white/30 transition-all text-sm font-medium border border-white/30"
            >
              <span>{currentForeignLang.flag}</span>
              <span>{currentForeignLang.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl overflow-hidden z-10 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setForeignLang(lang.code);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-blue-50 transition-colors ${foreignLang === lang.code ? 'bg-blue-50 font-bold text-blue-600' : 'text-gray-700'}`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Direction Toggle */}
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-full flex relative w-full max-w-[280px]">
              <button
                onClick={() => setDirection('KR_TO_FOREIGN')}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all duration-300 z-10 ${direction === 'KR_TO_FOREIGN' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                KR → {currentForeignLang.label}
              </button>
              <button
                onClick={() => setDirection('FOREIGN_TO_KR')}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all duration-300 z-10 ${direction === 'FOREIGN_TO_KR' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {currentForeignLang.label} → KR
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-gray-50 rounded-2xl p-5 min-h-[140px] border-2 border-dashed border-gray-200 relative group transition-all hover:border-blue-200 hover:bg-white">
            <p className="text-gray-400 text-xs mb-2 font-bold tracking-wider uppercase flex justify-between">
              <span>{direction === 'FOREIGN_TO_KR' ? currentForeignLang.label : 'Korean'}</span>
              <span className="flex gap-2">
                {isScanning && <span className="text-blue-500 animate-pulse">Scanning...</span>}
                {isListening && <span className="text-blue-500 animate-pulse">● Rec</span>}
              </span>
            </p>
            <p className="text-gray-600 text-base leading-relaxed font-normal break-words">
              {displayText || <span className="text-gray-400 italic">Tap microphone to speak or camera to scan...</span>}
            </p>
          </div>

          {/* Translation Area */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 min-h-[140px] border border-blue-100 relative group transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-2">
              <p className="text-blue-500 text-xs font-bold tracking-wider uppercase">
                {direction === 'FOREIGN_TO_KR' ? 'Korean' : currentForeignLang.label}
              </p>
              {translatedText && (
                <button
                  onClick={speakTranslation}
                  className="p-2 -mr-2 -mt-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                  title="Listen"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-gray-900 text-3xl leading-snug font-bold break-words">
              {isTranslating ? (
                <span className="animate-pulse opacity-50 flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
              ) : (
                translatedText || <span className="opacity-30">...</span>
              )}
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-8 pt-4 pb-8">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />

            <button
              onClick={handleCameraClick}
              disabled={isListening || isScanning}
              className="p-4 rounded-full bg-white text-blue-500 shadow-lg border border-blue-100 hover:bg-blue-50 active:scale-95 transition-all disabled:opacity-50"
              title="Snap & Translate"
            >
              <Camera className="w-6 h-6" />
            </button>

            <button
              onClick={handleToggleListening}
              className={`relative p-8 rounded-full shadow-xl transition-all transform hover:scale-105 active:scale-95 ${isListening
                  ? 'bg-blue-500 text-white shadow-blue-200 ring-4 ring-blue-100'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-200 hover:shadow-blue-300'
                }`}
            >
              {isListening ? (
                <>
                  <StopCircle className="w-10 h-10 animate-pulse" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-blue-100 text-sm font-bold whitespace-nowrap">
                    Stop
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-10 h-10" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-sm font-medium whitespace-nowrap">
                    Tap to Speak
                  </span>
                </>
              )}
            </button>

            <button
              onClick={() => { setOcrText(''); setTranslatedText(''); }}
              className="p-4 rounded-full bg-white text-gray-400 shadow-lg border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
              title="Clear"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
