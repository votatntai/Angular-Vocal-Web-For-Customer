export interface Customer {
    id: string,
    username: string,
    firstName: string,
    avatar: string,
    lastName: string,
    email: string,
    phone: string,
    bio: string,
    gender: string,
    studio: boolean,
    price: number,
    rate: number,
    status: string,
    countries: string[],
    voiceStyles: string[],
    voiceDemos: string[],
}
