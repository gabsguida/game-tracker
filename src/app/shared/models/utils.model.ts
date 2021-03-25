interface IGame {
    title: string,
    salePrice: string,
    normalPrice: string,
    thumb: string,
    percentage?: number,
    normalPriceNumeric?: number,
    salePriceNumeric?: number
}

export { IGame }