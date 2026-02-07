import { useState, useEffect, useRef, useCallback } from 'react';

// Extend the window object to support webkitSpeechRecognition
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export const useSpeechRecognition = (lang: string = 'en-US') => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
        const SpeechRecognitionAPI = SpeechRecognition || webkitSpeechRecognition;

        if (!SpeechRecognitionAPI) {
            console.error("Browser doesn't support Speech Recognition");
            return;
        }

        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = lang;

        recognitionRef.current.onresult = (event: any) => {
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                currentTranscript += event.results[i][0].transcript;
            }
            setTranscript(currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [lang]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (error) {
                console.error("Failed to start speech recognition:", error);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    return { isListening, transcript, startListening, stopListening };
};
