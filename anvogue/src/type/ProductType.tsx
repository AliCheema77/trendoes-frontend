interface Variation {
    color: string;
    colorCode: string;
    colorImage: string;
    image: string;
}

export interface StockColor {
    color: { id: number; name: string; HEX: string }
    quantity: number
}

export interface StockEntry {
    size: { id: number; name: string }
    colors: StockColor[]
}

export interface ProductType {
    id: string,
    category: string,
    type: string,
    name: string,
    gender: string,
    new: boolean,
    sale: boolean,
    isFeatured: boolean,
    rate: number,
    price: number,
    originPrice: number,
    brand: string,
    sold: number,
    quantity: number,
    quantityPurchase: number,
    sizes: Array<string>,
    variation: Variation[],
    thumbImage: Array<string>,
    images: Array<string>,
    description: string,
    action: string,
    slug: string,
    stocksRaw?: StockEntry[],
}