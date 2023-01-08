export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface IRoute {
  path: string;
  view: (params: { [k: string]: string }) => void;
}

export interface ICartItem {
  productId: number;
  number: number;
}

export interface IState {
  [SearchKeys.sortParam]: number;
  [SearchKeys.searchValue]: string;
  [SearchKeys.viewMode]: string;
  filters: IFilters;
  products: IProduct[];
}

export interface IFilters {
  [SearchKeys.category]: string[];
  [SearchKeys.brand]: string[];
  [SearchKeys.price]: number[];
  [SearchKeys.stock]: number[];
}

export type SliderCallBack = (values: (string | number)[]) => void;

export type SliderOptions = {
  caption: string;
  min: number;
  max: number;
  callback: SliderCallBack;
};

export interface IPromocode {
  title: string;
  percentage: number;
}

export enum SearchKeys {
  category = 'category',
  brand = 'brand',
  price = 'price',
  stock = 'stock',
  sortParam = 'sortParam',
  searchValue = 'searchValue',
  viewMode = 'viewMode',
}
