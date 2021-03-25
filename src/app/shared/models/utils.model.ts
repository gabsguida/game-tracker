interface IGame {
    title: string,
    salePrice: string,
    normalPrice: string,
    thumb: string,
    percentage?: number,
    normalPriceNumeric?: number,
    salePriceNumeric?: number
    dealID?: string
    dealRating: string
    gameID: string
    internalName: string
    isOnSale: string
    lastChange: number
    metacriticLink: string
    metacriticScore: string
    releaseDate: number
    savings: string
    steamAppID: null
    steamRatingCount: string
    steamRatingPercent: string
    steamRatingText: string
    storeID: string
}

export { IGame }