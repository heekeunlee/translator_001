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
        // Basic language code mapping (MyMemory uses 2-letter codes mostly)
        const src = sourceLang.split('-')[0];
        const tgt = targetLang.split('-')[0];

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
