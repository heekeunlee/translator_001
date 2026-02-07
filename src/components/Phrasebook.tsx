import { useState } from 'react';
import { Volume2, Phone } from 'lucide-react';
import { PHRASE_CATEGORIES, EMERGENCY_NUMBERS } from '../data/phrases';

export default function Phrasebook() {
    const [activeCategory, setActiveCategory] = useState(PHRASE_CATEGORIES[0].id);

    const speak = (text: string) => {
        // Try to speak in Cebuano or Filipino
        const utterance = new SpeechSynthesisUtterance(text);
        // Try Cebuano first, then Filipino, then generic
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang === 'ceb-PH') || voices.find(v => v.lang === 'fil-PH') || null;
        if (voice) utterance.voice = voice;
        utterance.lang = 'fil-PH'; // Fallback lang code
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden mt-8">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
                <h2 className="font-bold text-blue-900 flex items-center gap-2">
                    <span>🌴</span> Cebu Travel Essentials
                </h2>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto p-2 gap-2 scrollbar-hide">
                {PHRASE_CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-1 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${activeCategory === cat.id
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        {cat.label.split(' ')[0]}
                    </button>
                ))}
            </div>

            {/* Phrases Grid */}
            <div className="p-4 grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                {PHRASE_CATEGORIES.find(c => c.id === activeCategory)?.phrases.map((phrase, idx) => (
                    <div key={idx} className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer group" onClick={() => speak(phrase.local)}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-xs font-bold mb-1">{phrase.ko}</p>
                                <p className="text-blue-900 text-xl font-bold">{phrase.local}</p>
                                <p className="text-blue-400 text-sm font-medium">{phrase.pronunciation}</p>
                            </div>
                            <button className="p-2 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity">
                                <Volume2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Emergency Numbers */}
            <div className="p-4 bg-red-50 border-t border-red-100">
                <h3 className="text-red-800 font-bold text-sm mb-3 flex items-center gap-2">
                    <span>🚨</span> Emergency Contacts
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    {EMERGENCY_NUMBERS.map((num, idx) => (
                        <a key={idx} href={`tel:${num.number}`} className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-100 hover:shadow-sm transition-shadow">
                            <span className="text-gray-700 font-medium">{num.label}</span>
                            <div className="flex items-center gap-2 text-red-600 font-bold">
                                <Phone className="w-4 h-4" />
                                {num.number}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
