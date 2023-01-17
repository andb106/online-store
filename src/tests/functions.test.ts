import { IProduct } from './../types/index';
import {
  filterData,
  minMaxValuesFromData,
  countItemsForSpan,
  searchProducts,
  sortProduct,
} from '../utils/functionsFromIndex';
import * as dataJson from '../data/data.json';
import { IState, SearchKeys } from '../types';
import { addMoreToCart, addToCart, CartData, checkProductInCart, getCart, getCartNumberData, removeFromCart } from '../utils/db';

const initialState: IState = {
  filters: {
    category: [],
    brand: [],
    price: [0, 10000],
    stock: [0, 10000],
  },
  sortParam: 0,
  searchValue: '',
  products: [],
  viewMode: 'tile',
};

describe('filterData function', () => {
  test('should work correctly without filters', () => {
    const state = {
      ...initialState,
    };
    const result = filterData(dataJson.products, state);

    expect(result.length).toBe(100);
  });

  test('should work correctly price filters', () => {
    const state = {
      ...initialState,
      filters: {
        ...initialState.filters,
        price: [100, 500],
      },
    };
    const result = filterData(dataJson.products, state);

    expect(result.length).toBe(7);
  });

  test('should work correctly stock filters', () => {
    const state = {
      ...initialState,
      filters: {
        ...initialState.filters,
        stock: [100, 500],
      },
    };
    const result = filterData(dataJson.products, state);

    expect(result.length).toBe(34);
  });

  test('should work correctly various filters', () => {
    const state = {
      ...initialState,
      filters: {
        ...initialState.filters,
        category: ['smartphones'],
        brand: ['Apple', 'OPPO'],
        price: [100, 900],
        stock: [20, 130],
      },
    };
    const result = filterData(dataJson.products, state);

    expect(result.length).toBe(3);
  });
});

describe('minMaxValuesFromData function', () => {
  test('should work correctly for price', () => {
    const result = minMaxValuesFromData(dataJson.products, SearchKeys.price);
    expect(result).toEqual([10, 1749]);
  });

  test('should work correctly for stock', () => {
    const result = minMaxValuesFromData(dataJson.products, SearchKeys.stock);
    expect(result).toEqual([2, 150]);
  });
});

describe('countItemsForSpan function', () => {
  test('should work correctly for initial data', () => {
    const categoryList = new Set(dataJson.products.map((product) => product.category));
    const result = countItemsForSpan(dataJson.products, dataJson.products, [...categoryList], SearchKeys.category);
    const expectRes = [
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
      [5, 5],
    ];
    expect(result).toEqual(expectRes);
  });

  test('should work correctly for filtered data', () => {
    const categoryList = new Set(dataJson.products.map((product) => product.category));
    const result = countItemsForSpan(
      dataJson.products.filter((product) => product.price > 100),
      dataJson.products,
      [...categoryList],
      SearchKeys.category
    );
    const expectRes = [
      [5, 5],
      [5, 5],
      [1, 5],
      [0, 5],
      [0, 5],
      [0, 5],
      [1, 5],
      [1, 5],
      [1, 5],
      [1, 5],
      [0, 5],
      [0, 5],
      [1, 5],
      [0, 5],
      [0, 5],
      [0, 5],
      [0, 5],
      [0, 5],
      [5, 5],
      [0, 5],
    ];
    expect(result).toEqual(expectRes);
  });
});

describe('searchProducts function', () => {
  test('should work correctly for empty string', () => {
    const result = searchProducts(dataJson.products, '');
    expect(result.length).toBe(100);
  });

  test('should work correctly for search string', () => {
    const result = searchProducts(dataJson.products, 'ab');
    expect(result.length).toBe(21);
  });
});

describe('sortProduct function', () => {
  test('should work correctly for right SortParam', () => {
    const expectRes = dataJson.products.sort((a, b) => a.price - b.price);
    const result = sortProduct(dataJson.products, 1);
    expect(result).toEqual(expectRes);
  });

  test('should work correctly for wrong sortParam', () => {
    const result = sortProduct(dataJson.products, 111);
    expect(result).toEqual(dataJson.products);
  });
});

describe('add more product to cart function', () => {
  test('should work correctly with enough product in stock', () => {
    const product = dataJson.products[0];
    const result = addMoreToCart(product, product.stock / 2);
    expect(result).toEqual(true);
  });
  test('should work correctly with lack of product in stock', () => {
    const product = dataJson.products[0];
    const result = addMoreToCart(product, product.stock * 2);
    expect(result).toEqual(false);
  });
})

describe('check product in cart function', () => {
  test('should work correctly with existed product in cart', () => {
    const product = dataJson.products[0];
    addToCart(product.id, 1, product.price);
    const result = checkProductInCart(product.id);
    expect(result).toEqual(true);
  });
  test('should work correctly without existed product in cart', () => {
    const product = {
      id: dataJson.products.length + 5,
      title: "Test product",
      description: "Test product description",
      price: 100,
      discountPercentage: 15,
      rating: 5,
      stock: 80,
      brand: "Test brand",
      category: "Test category",
      thumbnail: "Test thumbnail",
      images: ["Test img"]
    }
    const result = checkProductInCart(product.id);
    expect(result).toEqual(false);
  });
})

describe('remove product from cart function', () => {
  test('should work correctly with pieces of product in cart', () => {
    const product = {
      id: dataJson.products.length + 5,
      title: "Test product",
      description: "Test product description",
      price: 100,
      discountPercentage: 15,
      rating: 5,
      stock: 80,
      brand: "Test brand",
      category: "Test category",
      thumbnail: "Test thumbnail",
      images: ["Test img"]
    }
    addToCart(product.id, 5, product.price);
    const result = removeFromCart(product, 3, dataJson.products);
    expect(result).toEqual(true);
  });
  test('should work correctly with product in cart', () => {
    const product = {
      id: dataJson.products.length + 7,
      title: "Test product",
      description: "Test product description",
      price: 100,
      discountPercentage: 15,
      rating: 5,
      stock: 80,
      brand: "Test brand",
      category: "Test category",
      thumbnail: "Test thumbnail",
      images: ["Test img"]
    }
    addToCart(product.id, 1, product.price);
    const result = removeFromCart(product, 1, dataJson.products);
    expect(result).toEqual(false);
  });
})

describe('get cart items function', () => {
  test('should work correctly with empty cart', () => {
    localStorage.clear();
    const result = getCart();
    expect(result).toEqual([]);
  });
  test('should work correctly with not empty cart', () => {
    localStorage.clear();
    const product = {
      id: dataJson.products.length + 5,
      title: "Test product",
      description: "Test product description",
      price: 100,
      discountPercentage: 15,
      rating: 5,
      stock: 80,
      brand: "Test brand",
      category: "Test category",
      thumbnail: "Test thumbnail",
      images: ["Test img"]
    }
    const product2 = {
      id: dataJson.products.length + 6,
      title: "Test product",
      description: "Test product description",
      price: 100,
      discountPercentage: 15,
      rating: 5,
      stock: 80,
      brand: "Test brand",
      category: "Test category",
      thumbnail: "Test thumbnail",
      images: ["Test img"]
    }
    const expected = [{
      productId: dataJson.products.length + 5,
      number: 1
    },{
      productId: dataJson.products.length + 6,
      number: 1
    },];
    addToCart(product.id, 1, product.price);
    addToCart(product2.id, 1, product2.price);
    const result = getCart();
    expect(result).toEqual(expected);
  });
})

describe('get number data from cart item function', () => {
  test('should work correctly for total price', () => {
    localStorage.clear();
    const product = {
      id: dataJson.products.length + 5,
      title: "Test product",
      description: "Test product description",
      price: 100,
      discountPercentage: 15,
      rating: 5,
      stock: 80,
      brand: "Test brand",
      category: "Test category",
      thumbnail: "Test thumbnail",
      images: ["Test img"]
    }
    const product2 = {
      id: dataJson.products.length + 6,
      title: "Test product",
      description: "Test product description",
      price: 150,
      discountPercentage: 15,
      rating: 5,
      stock: 80,
      brand: "Test brand",
      category: "Test category",
      thumbnail: "Test thumbnail",
      images: ["Test img"]
    }
    addToCart(product.id, 1, product.price);
    addToCart(product2.id, 1, product2.price);
    const result = getCartNumberData(CartData.totalPrice)
    expect(result).toEqual(250);
  });
  test('should work correctly for total count', () => {
    localStorage.clear();
    const product = {
      id: dataJson.products.length + 5,
      title: "Test product",
      description: "Test product description",
      price: 100,
      discountPercentage: 15,
      rating: 5,
      stock: 80,
      brand: "Test brand",
      category: "Test category",
      thumbnail: "Test thumbnail",
      images: ["Test img"]
    }
    const product2 = {
      id: dataJson.products.length + 6,
      title: "Test product",
      description: "Test product description",
      price: 150,
      discountPercentage: 15,
      rating: 5,
      stock: 80,
      brand: "Test brand",
      category: "Test category",
      thumbnail: "Test thumbnail",
      images: ["Test img"]
    }
    addToCart(product.id, 1, product.price);
    addToCart(product2.id, 7, product2.price);
    const result = getCartNumberData(CartData.totalCount)
    expect(result).toEqual(8);
  });
});
