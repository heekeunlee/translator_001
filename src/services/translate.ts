export interface TranslationResult {
    translatedText: string;
    error?: string;
}

export const translateText = async (
    text: string,
    sourceLang: string,
    targetLang: string
): Promise<TranslationResult> => {
    if (!text.trim()) return { translatedText: '' };

    try {
        // Basic language code mapping
        // MyMemory uses 'tl' for Tagalog and 'ceb' for Cebuano
        let src = sourceLang.split('-')[0];
        let tgt = targetLang.split('-')[0];

        // Corrections for MyMemory if needed
        if (sourceLang === 'tl-PH') src = 'tl';
        if (targetLang === 'tl-PH') tgt = 'tl';
        if (sourceLang === 'ceb-PH') src = 'ceb';
        if (targetLang === 'ceb-PH') tgt = 'ceb';

        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${tgt}`
        );

        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const data = await response.json();
        return { translatedText: data.responseData.translatedText };
    } catch (error) {
        console.error('Translation error:', error);
        return { translatedText: '', error: 'Translation failed' };
    }
};
