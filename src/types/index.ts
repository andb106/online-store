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
  filters: IFilters;
  sortParam: number;
  searchValue: string;
  products: IProduct[];
}

export interface IFilters {
  category: string[];
  brand: string[];
  price: number[];
  stock: number[];
}

export type SliderCallBack = (values: (string | number)[]) => void;

export type SliderOptions = {
  caption: string;
  min: number;
  max: number;
  callback: SliderCallBack;
};

export interface IPromocode {
  title: string,
  percentage: number
}
