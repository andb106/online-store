import './styles-global.scss';
import { CartPage } from './components/cart/cart-page';
import { ProductPage } from './components/product-page/product-page';
import Router from './utils/router';
import { ProductList } from './components/productList/productList';
import dataJson from './data/data.json';
import { Filters } from './components/filters/filters';
import { IProduct, IState, SearchKeys } from './types';
import { BaseComponent } from './components/baseComponent';
import { Sort } from './components/sort/sort';
import { Search } from './components/search/search';
import { Found } from './components/found/found';
import { ResetBtn } from './components/resetBtn/resetBtn';
import { ViewButtons } from './components/viewButtons/viewButtons';
import { CopyBtn } from './components/copyBtn/copyBtn';
import { Header } from './components/header/header';
import { getCart } from './utils/db';
import {
  filterData,
  minMaxValuesFromData,
  countItemsForSpan,
  sortProduct,
  searchProducts,
  changeUrl,
} from './utils/functionsFromIndex';

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
const newData = data.products.filter((product) => product.images.length > 3);
const categoryList = new Set(newData.map((product) => product.category));
const brandList = new Set(newData.map((product) => product.brand));

const minMaxPriceInitial = minMaxValuesFromData(newData, SearchKeys.price);
const minMaxStockInitial = minMaxValuesFromData(newData, SearchKeys.stock);

const countItemsCategoryInitial = countItemsForSpan(newData, newData, [...categoryList], SearchKeys.category);
const countItemsBrandInitial = countItemsForSpan(newData, newData, [...brandList], SearchKeys.brand);

state.products = newData;
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

const productList = new ProductList(newData, (id) => {
  mainElem.innerHTML = '';
  mainElem.append(new ProductPage(newData[id - 1], newData).element);
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
    searchFilterSortUpdateProducts(newData, state, true, false);
    setViewMode(state.viewMode);
    changeUrl(SearchKeys.price, state);
  },
  (values) => {
    state.filters.stock = [+values[0], +values[1]];
    searchFilterSortUpdateProducts(newData, state, false, true);
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
    searchFilterSortUpdateProducts(newData, state, false, false);
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
    setViewMode(state.viewMode);
    changeUrl(SearchKeys.sortParam, state);
  }
});

const searchElem = new Search((value) => {
  const searchValue = value;
  state.searchValue = searchValue;
  searchFilterSortUpdateProducts(newData, state, false, false);
  setViewMode(state.viewMode);
  changeUrl(SearchKeys.searchValue, state);
});

const found = new Found();
const resetBtn = new ResetBtn(() => {
  resetFilters();
  setViewMode(state.viewMode);
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
      mainElem.innerHTML = `
      <div class="page-404">
        <h2 class="page-404__error">404</h2>
        <span class="page-404__text">Page not found</span>
      </div>
      `;
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
        searchFilterSortUpdateProducts(newData, state, false, false);
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
      mainElem.append(new CartPage(newData, getCart(), false).element);
    },
  },
  {
    path: '/product/:id', // id - product id, but in data-array get position (id - 1) !
    view: (params) => {
      const len = newData.length;
      mainElem.innerHTML = '';
      if (+params.id - 1 >= 0 && +params.id - 1 < len) {
        mainElem.append(new ProductPage(newData[+params.id - 1], newData).element);
      } else {
        mainElem.innerHTML = `Product with id ${params.id} not found`;
      }
    },
  },
]);

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
  state.products = newData;
  state.searchValue = '';
  state.filters.price = minMaxPriceInitial;
  state.filters.stock = minMaxStockInitial;
  state.filters.brand = [];
  state.filters.category = [];
  state.sortParam = 0;
  searchFilterSortUpdateProducts(newData, state, false, false);
  sort.selectElem.selectedIndex = 0;
  searchElem.resetInput();
  filters.checkBoxFilters.forEach((filter) => {
    filter.resetChecked();
  });
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
