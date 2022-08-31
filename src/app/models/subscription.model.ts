export interface IsSubscription {
    isSubscription: boolean,
    subscriptionExpired: string
}

export interface Subscription {
    id: number,
    title: string,
    amount: number,
    duration: number
}
