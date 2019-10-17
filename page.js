import { action } from 'utils/redux';
import {
  PAGE_REQUEST, PAGE_SUCCESS, PAGE_ERROR,
  PAGE_CREATE_REQUEST, PAGE_CREATE_SUCCESS, PAGE_CREATE_ERROR,
  PAGE_DELETE_REQUEST, PAGE_DELETE_SUCCESS, PAGE_DELETE_ERROR,
  PAGE_EDIT_REQUEST, PAGE_EDIT_SUCCESS, PAGE_EDIT_ERROR,
  PAGE_NUMBER, EDITOR_STATE, SHOW_PAGES_LIST, TOGGLE_MORE_PANEL,
  PAGE_QR_CODE_REQUEST, PAGE_QR_CODE_SUCCESS, PAGE_QR_CODE_ERROR
} from 'constants/actionTypes';

export const page = {
  request: (courseId, moduleId, pageNum) => action(PAGE_REQUEST, {courseId, moduleId, pageNum}),
  success: payload => action(PAGE_SUCCESS, {payload}),
  failure: error => action(PAGE_ERROR, {error})
};

export const createPage = {
  request: (courseId, moduleId, data, query) => action(PAGE_CREATE_REQUEST, {courseId, moduleId, data, query}),
  success: payload => action(PAGE_CREATE_SUCCESS, {payload}),
  failure: error => action(PAGE_CREATE_ERROR, {error})
};

export const deletePage = {
  request: (courseId, moduleId, pageNum) => action(PAGE_DELETE_REQUEST, {courseId, moduleId, pageNum}),
  success: payload => action(PAGE_DELETE_SUCCESS, {payload}),
  failure: error => action(PAGE_DELETE_ERROR, {error})
};

export const editPage = {
  request: (courseId, moduleId, pageNum, data) => action(PAGE_EDIT_REQUEST, {courseId, moduleId, pageNum ,data}),
  success: payload => action(PAGE_EDIT_SUCCESS, {payload}),
  failure: error => action(PAGE_EDIT_ERROR, {error})
};

export const getDataForQrCode = {
  request: (userId, pageId) => action(PAGE_QR_CODE_REQUEST, {userId, pageId}),
  success: payload => action(PAGE_QR_CODE_SUCCESS, {payload}),
  failure: error => action(PAGE_QR_CODE_ERROR, {error})
};

export const setCurrentPageNum = num => action(PAGE_NUMBER, { num });
export const editorState = content => action(EDITOR_STATE, {content});
export const showPagesList = value => action(SHOW_PAGES_LIST, {value});

export const toggleMorePanel = () => action(TOGGLE_MORE_PANEL);