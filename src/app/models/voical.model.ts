export interface Vocal {
    id: string,
    voiceId: string,
    url: string,
    image: string,
    name: string,
    type: string,
    description: string,
    isPrivate: boolean,
    listeningTime: number,
    artist: Artist,
    createDate: string,
    score: number
}

export interface Artist {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    bio: string,
    gender: string,
    price: number,
    studio: boolean,
    rate: number,
    status: string,
    avatar: number
    countries: string[],
    voiceStyles: string[]
}

export interface LocalData {
    musicTrending: Vocal[],
    audioTrending: Vocal[],
    artTrending: Vocal[],
    musicRecommend: Vocal[],
    audioRecommend: Vocal[],
    artRecommend: Vocal[],
    news: Vocal[]
}

export interface VoiceDemo {
    artist: Artist;
    createDate: string;
    description: string;
    id: string;
    image: string;
    isPrivate: boolean;
    listeningTime: number;
    name: string;
    score: number;
    status: string;
    type: string;
    url: string;
    voiceId: string;
}

export interface VocalRating {
    totalContentRating: number;
    totalRating: number;
    totalVoiceRating: number;
    voicesRating: VoicesRatingDetail[];
}

export interface VoicesRatingDetail {
    avatar: string;
    contentRating: number;
    description: string;
    firstName: string;
    lastName: string;
    reviewDate: string;
    title: string;
    userId: string;
    voiceId: string;
    voiceName: string;
    voiceRating: number;
}

