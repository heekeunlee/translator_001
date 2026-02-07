export interface Phrase {
    ko: string;
    en: string;
    local: string;
    pronunciation: string;
}

export interface PhraseCategory {
    id: string;
    label: string;
    icon: string;
    phrases: Phrase[];
}

export const PHRASE_CATEGORIES: PhraseCategory[] = [
    {
        id: 'basic',
        label: '기본 (Basic)',
        icon: '👋',
        phrases: [
            { ko: '안녕하세요', en: 'Hello', local: 'Kumusta', pronunciation: '꾸무스타' },
            { ko: '감사합니다', en: 'Thank you', local: 'Salamat', pronunciation: '살라맛' },
            { ko: '네', en: 'Yes', local: 'Oo', pronunciation: '오오' },
            { ko: '아니오', en: 'No', local: 'Dili', pronunciation: '딜리' },
            { ko: '잠시만요', en: 'Wait a moment', local: 'Kadiyot lang', pronunciation: '카디욧 랑' },
        ]
    },
    {
        id: 'transport',
        label: '이동 (Transport)',
        icon: '🚕',
        phrases: [
            { ko: '여기서 멈춰주세요', en: 'Stop here', local: 'Para!', pronunciation: '빠라!' },
            { ko: '얼마에요?', en: 'How much?', local: 'Pila ni?', pronunciation: '필라 니?' },
            { ko: '화장실 어디에요?', en: 'Where is the CR?', local: 'Asa ang CR?', pronunciation: '아사 앙 씨알?' },
            { ko: '직진해주세요', en: 'Go straight', local: 'Derecho lang', pronunciation: '데레초 랑' },
        ]
    },
    {
        id: 'dining',
        label: '식사 (Dining)',
        icon: '🍽️',
        phrases: [
            { ko: '정말 맛있어요!', en: 'Delicious', local: 'Lami kaayo!', pronunciation: '라미 카아요!' },
            { ko: '계산서 주세요', en: 'Bill please', local: 'Bill please', pronunciation: '빌 플리즈' },
            { ko: '물 좀 주세요', en: 'Water please', local: 'Tubig palihug', pronunciation: '투빅 팔리훅' },
            { ko: '메뉴판 주세요', en: 'Menu please', local: 'Menu palihug', pronunciation: '메뉴 팔리훅' },
        ]
    },
    {
        id: 'shopping',
        label: '쇼핑 (Shopping)',
        icon: '🛍️',
        phrases: [
            { ko: '너무 비싸요', en: 'Too expensive', local: 'Mahal kaayo', pronunciation: '마할 카아요' },
            { ko: '깎아주세요', en: 'Discount please', local: 'Hangyo', pronunciation: '항요' },
            { ko: '이거 주세요', en: 'I will take this', local: 'Kini lang', pronunciation: '키니 랑' },
        ]
    },
    {
        id: 'emergency',
        label: '긴급 (Emergency)',
        icon: '🚨',
        phrases: [
            { ko: '도와주세요!', en: 'Help!', local: 'Tabang!', pronunciation: '따방!' },
            { ko: '병원으로 가주세요', en: 'Go to hospital', local: 'Adto ta sa Hospital', pronunciation: '아또 타 사 호스피탈' },
            { ko: '경찰을 불러주세요', en: 'Call police', local: 'Tawag ug Pulis', pronunciation: '타와그 우그 풀리스' },
        ]
    }
];

export const EMERGENCY_NUMBERS = [
    { label: 'Tourist Police', number: '112' }, // General emergency
    { label: 'Cebu Emergency', number: '161' }, // Local emergency
    { label: 'Korean Consulate', number: '032-231-1516' } // Consulate in Cebu
];
