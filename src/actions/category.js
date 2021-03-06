import ActionTypes from './ActionTypes';
import Category from '../models/Category';
import axios from 'axios';
import { API_ROOT, BUDGET_LIMIT, BUDGET_ABOVE } from '../constants/AppConstants';

// Categories SHOW ALL
export const categoriesAll_REQ = () => ({
  type: ActionTypes.CATEGORIES_ALL_REQ,
});
export const categoriesAll_OK = (categoryList) => ({
  type: ActionTypes.CATEGORIES_ALL_OK,
  categoryList: categoryList
});
export const categoriesAll_X = () => ({
  type: ActionTypes.CATEGORIES_ALL_X,
});

export function fetchAllCategories() {
  return async (dispatch, getState) => {
    dispatch(categoriesAll_REQ());
    const ajaxReq = {
      method: 'get',
      url: API_ROOT + '/category/all'
    };
    axios(ajaxReq)
    .then((response) => {
      const categoryList = response.data;
      dispatch(categoriesAll_OK(categoryList));
      dispatch(fetchRndCategory());
    })
    .catch((error) => {
      console.log(error);
      dispatch(categoriesAll_X());
    })
    .then(() => {
      return { type: null };
    });
  }
};

// Filters GET
export const categoriesFilter_REQ = () => ({
  type: ActionTypes.CATEGORIES_FILTER_REQ,
});
export const categoriesFilter_OK = (filteredIds) => ({
  type: ActionTypes.CATEGORIES_FILTER_OK,
  filteredIds: filteredIds
});
export const categoriesFilter_X = () => ({
  type: ActionTypes.CATEGORIES_FILTER_X,
});

export function fetchFilteredIds() {
  return async (dispatch, getState) => {
    dispatch(categoriesFilter_REQ());
    const ajaxReq = {
      method: 'get',
      url: API_ROOT + '/category/idsByBudgetLimit/?limit=' + BUDGET_LIMIT + '&above=' + BUDGET_ABOVE
    };
    axios(ajaxReq)
    .then((response) => {
      let filteredIds = response.data;
      dispatch(categoriesFilter_OK(filteredIds));      
    })
    .catch((error) => {
      console.log(error);
      dispatch(categoriesFilter_X());
    })
    .then(() => {
      return { type: null };
    });
  }
};

// Category ADD
export const categoryAdd_REQ = () => ({
  type: ActionTypes.CATEGORY_ADD_REQ,
});
export const categoryAdd_OK = () => ({
  type: ActionTypes.CATEGORY_ADD_OK,
});
export const categoryAdd_X = () => ({
  type: ActionTypes.CATEGORY_ADD_X,
});

export function addCategory(category) {
  return async (dispatch, getState) => {
    dispatch(categoryAdd_REQ());
    const ajaxReq = {
      method: 'post',
      url: API_ROOT + '/add_category',
      data: {
        id: Number(category.id),
        name: category.name,
        budget: Number(category.budget)
      }
    };
    axios(ajaxReq)
    .then(() => {
      dispatch(categoryAdd_OK());
      dispatch(fetchAllCategories());
    })
    .catch((error) => {
      console.log(error);
      dispatch(categoryAdd_X());
    })
    .then(() => {
      return { type: null };
    });
  }
};

// Category GET RANDOM
export const categoryRnd_REQ = () => ({
  type: ActionTypes.CATEGORY_RND_REQ,
});
export const categoryRnd_OK = (categoryRnd) => ({
  type: ActionTypes.CATEGORY_RND_OK,
  categoryRnd: categoryRnd,
});
export const categoryRnd_X = (categoryDef) => ({
  type: ActionTypes.CATEGORY_RND_X,
  categoryRnd: categoryDef,
});

export function fetchRndCategory() {
  return async (dispatch, getState) => {
    dispatch(categoryRnd_REQ());
    const categoryList = getState().categories.categoryList;
    if (categoryList.length === 0) {
      dispatch(categoryRnd_X([new Category('00', 'Category List is Empty', 0,)]));
    } else {
      const categoryRnd = [categoryList[Math.floor(Math.random() * categoryList.length)]];
      dispatch(categoryRnd_OK(categoryRnd));
    }
  }
};

// Category DELETE
export const categoryDel_REQ = () => ({
  type: ActionTypes.CATEGORY_DEL_REQ,
});
export const categoryDel_OK = () => ({
  type: ActionTypes.CATEGORY_DEL_OK,
});
export const categoryDel_X = () => ({
  type: ActionTypes.CATEGORY_DEL_X,
});

export function deleteCategory(idToChk) {
  return async (dispatch, getState) => {
    dispatch(categoryDel_REQ());
    const ajaxReq = {
      method: 'delete',
      url: API_ROOT + '/delete_category',
      params: {
        id: idToChk
      }
    };
    axios(ajaxReq)
    .then(() => {
      dispatch(categoryDel_OK());
      dispatch(fetchAllCategories());
    })
    .catch((error) => {
      console.log(error);
      dispatch(categoryDel_X());
    })
    .then(() => {
      return { type: null };
    });
  }
};
