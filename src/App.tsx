import { useState, useEffect } from 'react';
import { Mic, Globe, StopCircle, Volume2, ArrowRightLeft } from 'lucide-react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { translateText } from './services/translate';

function App() {
  const [targetLang, setTargetLang] = useState<'ko-KR' | 'en-US'>('ko-KR');
  // targetLang is the language we want to translate TO.
  // If targetLang is 'ko-KR', source is 'en-US'.
  // If targetLang is 'en-US', source is 'ko-KR'.
  const sourceLang = targetLang === 'ko-KR' ? 'en-US' : 'ko-KR';

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition(sourceLang);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Debounce translation
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (transcript.trim()) {
        setIsTranslating(true);
        const result = await translateText(transcript, sourceLang, targetLang);
        setTranslatedText(result.translatedText || '');
        setIsTranslating(false);
      } else {
        setTranslatedText('');
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [transcript, sourceLang, targetLang]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      setTranslatedText(''); // Clear previous translation when starting new
    }
  };

  const speakTranslation = () => {
    if (!translatedText) return;
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLang;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-6 bg-blue-600 text-white flex items-center justify-between shadow-md">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Filipimo
          </h1>
          <button
            onClick={() => setTargetLang(prev => prev === 'ko-KR' ? 'en-US' : 'ko-KR')}
            className="flex items-center gap-2 text-sm bg-blue-700/50 hover:bg-blue-700 px-4 py-2 rounded-full transition-all border border-blue-400/30 backdrop-blur-sm"
          >
            <span className={sourceLang === 'en-US' ? 'font-bold' : 'opacity-70'}>EN</span>
            <ArrowRightLeft className="w-4 h-4" />
            <span className={sourceLang === 'ko-KR' ? 'font-bold' : 'opacity-70'}>KR</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Area */}
          <div className="bg-gray-50 rounded-2xl p-5 min-h-[140px] border border-gray-200 relative group transition-all hover:border-blue-200">
            <p className="text-gray-400 text-xs mb-2 font-bold tracking-wider uppercase">
              {sourceLang === 'en-US' ? 'Speaking (English)' : 'Speaking (Korean)'}
            </p>
            <p className="text-gray-800 text-xl leading-relaxed font-medium">
              {transcript || <span className="text-gray-400 italic font-normal">Tap microphone to speak...</span>}
            </p>
          </div>

          {/* Translation Area */}
          <div className="bg-blue-50/80 rounded-2xl p-5 min-h-[140px] border border-blue-100 relative group transition-all hover:border-blue-300">
            <div className="flex justify-between items-start mb-2">
              <p className="text-blue-500 text-xs font-bold tracking-wider uppercase">
                {targetLang === 'ko-KR' ? 'Translation (Korean)' : 'Translation (English)'}
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
            <p className="text-blue-900 text-xl leading-relaxed font-semibold">
              {isTranslating ? (
                <span className="animate-pulse opacity-50">Translating...</span>
              ) : (
                translatedText || <span className="opacity-30">...</span>
              )}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-4 pt-2">
            <button
              onClick={handleToggleListening}
              className={`relative p-8 rounded-full shadow-xl transition-all transform hover:scale-105 active:scale-95 ${isListening
                ? 'bg-red-500 text-white shadow-red-200 ring-4 ring-red-100'
                : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
                }`}
            >
              {isListening ? (
                <>
                  <StopCircle className="w-10 h-10 animate-pulse" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-red-500 text-sm font-bold whitespace-nowrap">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
