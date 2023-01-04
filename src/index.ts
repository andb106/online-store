//import { Product } from './components/product/product';
import { ProductPage } from './components/product-page/product-page';
import './styles-global.scss';
// import { IProduct } from './types';
import Router from './utils/router';
import { ProductList } from './components/productList/productList';
import dataJson from './data/data.json';
import { Filters } from './components/filters/filters';
// import { Observer } from './utils/observer';
import { IProduct, IState } from './types';
import { BaseComponent } from './components/baseComponent';
import { Sort } from './components/sort/sort';
import { Search } from './components/search/search';
import { Found } from './components/found/found';
import { ResetBtn } from './components/resetBtn/resetBtn';

const state: IState = {
  filters: {
    category: [],
    brand: [],
    price: [0, 0],
    stock: [0, 0],
  },
  sortParam: 0,
  searchValue: '',
  products: [],
};

const data = dataJson;
const categoryList = new Set(data.products.map((product) => product.category));
const brandList = new Set(data.products.map((product) => product.brand));

const minMaxPriceInitial = minMaxValuesFromData(data.products, 'price');
const minMaxStockInitial = minMaxValuesFromData(data.products, 'stock');

const countItemsCategoryInitial = countItemsForSpan(data.products, data.products, [...categoryList], 'category');
const countItemsBrandInitial = countItemsForSpan(data.products, data.products, [...brandList], 'brand');

state.products = data.products;
state.filters.price = minMaxPriceInitial;
state.filters.stock = minMaxStockInitial;

const mainElem: HTMLElement | null = document.querySelector('.main');
if (!mainElem) {
  throw new Error('not found main element');
}

const filterData = (data: IProduct[], state: IState) => {
  let res = data;

  if (state.filters.category.length) {
    res = res.filter((product) => {
      return state.filters.category.indexOf(product.category) > -1;
    });
  }

  if (state.filters.brand.length) {
    res = res.filter((product) => {
      return state.filters.brand.indexOf(product.brand) > -1;
    });
  }

  res = res.filter((product) => {
    return product.price >= state.filters.price[0] && product.price <= state.filters.price[1];
  });

  res = res.filter((product) => {
    return product.stock >= state.filters.stock[0] && product.stock <= state.filters.stock[1];
  });

  return res;
};

const productList = new ProductList(data.products);
const filters = new Filters(
  [...categoryList],
  countItemsCategoryInitial,
  [...brandList],
  countItemsBrandInitial,
  minMaxPriceInitial,
  minMaxStockInitial,
  (values) => {
    state.filters.price = [+values[0], +values[1]];
    searchFilterSortUpdateProducts(data.products, state, true, false);
  },
  (values) => {
    state.filters.stock = [+values[0], +values[1]];
    searchFilterSortUpdateProducts(data.products, state, false, true);
  }
);

filters.element.addEventListener('click', (e) => {
  if (e.target instanceof HTMLInputElement) {
    const filterType = e.target.closest('.filter-list')?.previousSibling?.textContent?.toLocaleLowerCase();

    if (filterType === 'category' || filterType === 'brand') {
      const ind = state.filters[filterType].indexOf(e.target.id);
      e.target.checked && ind === -1
        ? state.filters[filterType].push(e.target.id)
        : state.filters[filterType].splice(ind, 1);
    }
    searchFilterSortUpdateProducts(data.products, state, false, false);
  }
});

const filtersProductsWrapper = new BaseComponent('div', 'filters-products');
const bar = new BaseComponent('div', 'bar');

const sort = new Sort();
sort.selectElem.addEventListener('change', (e) => {
  if (e.target instanceof HTMLSelectElement) {
    state.sortParam = +e.target.value;
    const sortedProducts = sortProduct(state.products, +e.target.value);
    productList.updateItems(sortedProducts);
  }
});

const searchElem = new Search((value) => {
  const searchValue = value;
  state.searchValue = searchValue;
  searchFilterSortUpdateProducts(data.products, state, false, false);
});

const found = new Found();
const resetBtn = new ResetBtn(() => {
  resetFilters();
});

new Router([
  {
    path: 'page 404',
    view: () => {
      mainElem.innerHTML = '';
      mainElem.innerHTML = '404 page';
    },
  },
  {
    path: '/',
    view: (params) => {
      resetFilters();

      if (params.urlSearch) {
        const test2 = new URLSearchParams(params.urlSearch);
        for (const param of test2) {
          const key = param[0];
          if (key === 'category' || key === 'brand') {
            const value = param[1].split(',');
            state.filters[key] = value;
          }
          if (key === 'price' || key === 'stock') {
            const value = param[1].split(',').map((item) => Number(item));
            state.filters[key] = value;
          }
        }
        searchFilterSortUpdateProducts(data.products, state, false, false);
        filters.checkBoxFilters.forEach((item) =>
          item.updateChecked([...state.filters.brand, ...state.filters.category])
        );
      } else {
        console.log('no params.urlSearch');
      }

      mainElem.replaceChildren();
      bar.element.append(resetBtn.element);
      bar.element.append(sort.element);
      bar.element.append(found.element);
      bar.element.append(searchElem.element);
      mainElem.append(bar.element);
      filtersProductsWrapper.element.append(filters.element, productList.element);
      mainElem.append(filtersProductsWrapper.element);
    },
  },
  {
    path: '/cart',
    view: () => {
      mainElem.innerHTML = '';
      mainElem.innerHTML = 'cart page';
    },
  },
  {
    path: '/product/:id', // id - product id, but in data-array get position (id - 1) !
    view: (params) => {
      const len = data.products.length;
      mainElem.innerHTML = '';
      if (+params.id - 1 >= 0 && +params.id - 1 < len) {
        mainElem.append(new ProductPage(data.products[+params.id - 1]).element);
      } else {
        mainElem.innerHTML = `Product with id ${params.id} not found`;
      }
    },
  },
]);

function minMaxValuesFromData(data: IProduct[], prop: keyof Pick<IProduct, 'price' | 'stock'>) {
  const arr = data.map((item) => item[prop]);
  const res = [Math.min(...arr), Math.max(...arr)];
  return res;
}

function countItemsForSpan(
  currentData: IProduct[],
  allData: IProduct[],
  filterDataList: string[],
  productProp: keyof Pick<IProduct, 'category' | 'brand'>
) {
  const res: number[][] = [];
  filterDataList.forEach((prop) => {
    const countItemsCurrent = currentData.filter((product) => product[productProp] === prop).length;
    const countItemsAll = allData.filter((product) => product[productProp] === prop).length;
    res.push([countItemsCurrent, countItemsAll]);
  });
  return res;
}

function updateFiltersValues(
  currentProducts: IProduct[],
  allProducts: IProduct[],
  isCallingInPrice = false,
  isCallingInStock = false
) {
  const countItemsCategory = countItemsForSpan(currentProducts, allProducts, [...categoryList], 'category');
  const countItemsBrand = countItemsForSpan(currentProducts, allProducts, [...brandList], 'brand');

  const minMaxPrice = minMaxValuesFromData(currentProducts, 'price');
  const minMaxStock = minMaxValuesFromData(currentProducts, 'stock');

  filters.checkBoxFilters[0].updateList(countItemsCategory);
  filters.checkBoxFilters[1].updateList(countItemsBrand);

  if (!isCallingInPrice && !isCallingInStock) {
    filters.sliderFilters[0].slider?.set(minMaxPrice);
    filters.sliderFilters[1].slider?.set(minMaxStock);
  }

  if (isCallingInPrice) {
    filters.sliderFilters[1].slider?.set(minMaxStock);
  }

  if (isCallingInStock) {
    filters.sliderFilters[0].slider?.set(minMaxPrice);
  }
}

function sortProduct(products: IProduct[], sortParam: number) {
  switch (sortParam) {
    case 1:
      return products.sort((a, b) => a.price - b.price);
    case 2:
      return products.sort((a, b) => b.price - a.price);
    case 3:
      return products.sort((a, b) => a.rating - b.rating);
    case 4:
      return products.sort((a, b) => b.rating - a.rating);
    default:
      return products;
  }
}

function searchProducts(data: IProduct[], searchValue: string) {
  const res = data.filter((product) => {
    const strFromProps = Object.values(product).slice(1, -2).join(' ').toLowerCase();
    if (strFromProps.includes(searchValue)) {
      return true;
    } else {
      return false;
    }
  });
  return res;
}

function searchFilterSortUpdateProducts(
  allProducts: IProduct[],
  state: IState,
  isCallingInPrice = false,
  isCallingInStock = false
) {
  const searchedData = searchProducts(allProducts, state.searchValue);
  let resFilteredData = filterData(searchedData, state);
  resFilteredData = sortProduct(resFilteredData, state.sortParam);
  productList.updateItems(resFilteredData);
  state.products = resFilteredData;
  updateFiltersValues(resFilteredData, allProducts, isCallingInPrice, isCallingInStock);
  found.updateCount(state.products.length);
}

function resetFilters() {
  state.products = data.products;
  state.searchValue = '';
  state.filters.price = minMaxPriceInitial;
  state.filters.stock = minMaxStockInitial;
  state.filters.brand = [];
  state.filters.category = [];
  state.sortParam = 0;
  searchFilterSortUpdateProducts(data.products, state, false, false);
  sort.selectElem.selectedIndex = 0;
  searchElem.resetInput();
  filters.checkBoxFilters.forEach((filter) => {
    filter.resetChecked();
  });
}
