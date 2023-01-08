import { CartPage } from './components/cart/cart-page';
//import { Product } from './components/product/product';
import { ProductPage } from './components/product-page/product-page';
import './styles-global.scss';
// import { IProduct } from './types';
import Router from './utils/router';
import { ProductList } from './components/productList/productList';
import dataJson from './data/data.json';
import { Filters } from './components/filters/filters';
// import { Observer } from './utils/observer';
import { IFilters, IProduct, IState } from './types';
import { BaseComponent } from './components/baseComponent';
import { Sort } from './components/sort/sort';
import { Search } from './components/search/search';
import { Found } from './components/found/found';
import { ResetBtn } from './components/resetBtn/resetBtn';
import { getCart } from './utils/db';
import { ViewButtons } from './components/viewButtons/viewButtons';
import { CopyBtn } from './components/copyBtn/copyBtn';
import { SearchKeys } from './types';
import { Header } from './components/header/header';

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
  viewMode: 'tile',
};

const data = dataJson;
const categoryList = new Set(data.products.map((product) => product.category));
const brandList = new Set(data.products.map((product) => product.brand));

const minMaxPriceInitial = minMaxValuesFromData(data.products, SearchKeys.price);
const minMaxStockInitial = minMaxValuesFromData(data.products, SearchKeys.stock);

const countItemsCategoryInitial = countItemsForSpan(
  data.products,
  data.products,
  [...categoryList],
  SearchKeys.category
);
const countItemsBrandInitial = countItemsForSpan(data.products, data.products, [...brandList], SearchKeys.brand);

state.products = data.products;
state.filters.price = minMaxPriceInitial;
state.filters.stock = minMaxStockInitial;

const mainElem: HTMLElement | null = document.querySelector('.main');
if (!mainElem) {
  throw new Error('not found main element');
}

const header = new Header();
mainElem.before(header.element);

window.addEventListener('storage', () => {
  header.updateContent();
});

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

const productList = new ProductList(data.products, (id) => {
  mainElem.innerHTML = '';
  mainElem.append(new ProductPage(data.products[id - 1]).element);
  history.pushState(null, '', `/product/${id}`);
});

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
    setViewMode(state.viewMode);
    changeUrl(SearchKeys.price, state);
  },
  (values) => {
    state.filters.stock = [+values[0], +values[1]];
    searchFilterSortUpdateProducts(data.products, state, false, true);
    setViewMode(state.viewMode);
    changeUrl(SearchKeys.stock, state);
  }
);

filters.element.addEventListener('click', (e) => {
  if (e.target instanceof HTMLInputElement) {
    const filterType = e.target.closest('.filter-list')?.previousSibling?.textContent?.toLocaleLowerCase();

    if (filterType === SearchKeys.category || filterType === SearchKeys.brand) {
      const ind = state.filters[filterType].indexOf(e.target.id);
      e.target.checked && ind === -1
        ? state.filters[filterType].push(e.target.id)
        : state.filters[filterType].splice(ind, 1);

      changeUrl(filterType, state);
    }
    searchFilterSortUpdateProducts(data.products, state, false, false);
    setViewMode(state.viewMode);
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
    changeUrl(SearchKeys.sortParam, state);
  }
});

const searchElem = new Search((value) => {
  const searchValue = value;
  state.searchValue = searchValue;
  searchFilterSortUpdateProducts(data.products, state, false, false);
  setViewMode(state.viewMode);
  changeUrl(SearchKeys.searchValue, state);
});

const found = new Found();
const resetBtn = new ResetBtn(() => {
  resetFilters();
});

const viewBtns = new ViewButtons((value) => {
  state.viewMode = value;
  changeUrl(SearchKeys.viewMode, state);
  setViewMode(value);
});

const copyBtn = new CopyBtn();

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
      setViewMode(state.viewMode);

      if (params.urlSearch) {
        const searchParams = new URLSearchParams(params.urlSearch);
        for (const param of searchParams) {
          const key = param[0];
          switch (key) {
            case SearchKeys.category:
            case SearchKeys.brand:
              state.filters[key] = param[1].split(',');
              break;

            case SearchKeys.price:
            case SearchKeys.stock:
              state.filters[key] = param[1].split(',').map((item) => Number(item));
              break;

            case SearchKeys.searchValue:
              state.searchValue = param[1];
              searchElem.updateInput(param[1]);
              break;

            case SearchKeys.sortParam:
              state.sortParam = +param[1];
              sort.selectElem.selectedIndex = +param[1];
              break;

            case SearchKeys.viewMode:
              state.viewMode = param[1];
              viewBtns.updateActiveBtn(param[1]);
              break;
          }
        }
        searchFilterSortUpdateProducts(data.products, state, false, false);
        setViewMode(state.viewMode);
        filters.checkBoxFilters.forEach((item) =>
          item.updateChecked([...state.filters.brand, ...state.filters.category])
        );
      }

      mainElem.replaceChildren();
      bar.append(resetBtn, copyBtn, sort, found, searchElem, viewBtns);
      mainElem.append(bar.element);
      filtersProductsWrapper.append(filters, productList);
      mainElem.append(filtersProductsWrapper.element);
    },
  },
  {
    path: '/cart',
    view: () => {
      mainElem.replaceChildren();
      mainElem.append(new CartPage(data.products, getCart()).element);
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

function minMaxValuesFromData(data: IProduct[], prop: SearchKeys.price | SearchKeys.stock) {
  const arr = data.map((item) => item[prop]);
  const res = [Math.min(...arr), Math.max(...arr)];
  return res;
}

function countItemsForSpan(
  currentData: IProduct[],
  allData: IProduct[],
  filterDataList: string[],
  productProp: SearchKeys.category | SearchKeys.brand
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
  const countItemsCategory = countItemsForSpan(currentProducts, allProducts, [...categoryList], SearchKeys.category);
  const countItemsBrand = countItemsForSpan(currentProducts, allProducts, [...brandList], SearchKeys.brand);

  const minMaxPrice = minMaxValuesFromData(currentProducts, SearchKeys.price);
  const minMaxStock = minMaxValuesFromData(currentProducts, SearchKeys.stock);

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

function changeUrl(filterName: string, state: IState) {
  const urlParams = new URLSearchParams(location.search);

  if (isObjKey<IFilters>(filterName, state.filters)) {
    state.filters[filterName].length
      ? urlParams.set(filterName, state.filters[filterName].join(','))
      : urlParams.delete(filterName);
  }

  if (isObjKey<IState>(filterName, state)) {
    state[filterName] ? urlParams.set(filterName, `${state[filterName]}`) : urlParams.delete(filterName);
  }

  history.pushState(
    null,
    '',
    urlParams.toString().length ? location.pathname + `?${urlParams.toString()}` : location.pathname
  );
}

function isObjKey<T extends object>(key: PropertyKey, obj: T): key is keyof T {
  return key in obj;
}

function setViewMode(viewMode: string) {
  switch (viewMode) {
    case 'list':
      productList.element.classList.add('view-line');
      [...productList.element.children].forEach((item) => item.classList.add('view-line'));
      break;

    case 'tile':
      productList.element.classList.remove('view-line');
      [...productList.element.children].forEach((item) => item.classList.remove('view-line'));
  }
}
