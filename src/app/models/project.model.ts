export interface Project {
    id: string,
    poster: Poster,
    name: string,
    minAge: number,
    maxAge: number,
    price: number,
    description: string,
    status: string,
    responseDeadline: string,
    projectDeadline: string,
    createDate: string,
    updateDate: string,
    artistsStatus: ArtistsStatus[],
    countries: string[],
    voiceStyles: string[],
    genders: string[],
    usagePurposes: string[]
}

export interface Poster {
    id: string,
    username: string,
    firstName: string,
    avatar: string,
    lastName: string,
    email: string,
    phone: string,
    gender: string,
    role: string,
    status: string,
    createDate: string,
    updateDate: string
}

export interface ArtistsStatus {
    id: string,
    status: string
}