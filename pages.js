import {
  PAGE_REQUEST,
  PAGE_SUCCESS,
  PAGE_ERROR,
  PAGE_NUMBER,
  EDITOR_STATE,
  PAGE_DELETE_SUCCESS,
  SHOW_PAGES_LIST,
  PAGE_CREATE_SUCCESS,
  PAGE_CREATE_ERROR,
  PAGE_EDIT_SUCCESS,
  TOGGLE_MORE_PANEL,
  PAGE_QR_CODE_REQUEST,
  PAGE_QR_CODE_SUCCESS,
  PAGE_QR_CODE_ERROR
} from "constants/actionTypes";

const initialState = {
  loading: false,
  error: null,
  currentPage: null,
  currentPageNum: null,
  editorState: null,
  showPagesList: false,
  showMorePanel: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PAGE_REQUEST:
      return {
        ...state,
        loading: true
      };
    case PAGE_SUCCESS:
    case PAGE_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        currentPage: action.payload,
        currentPageNum: action.payload.sort_index,
        showPagesList: false,
        showMorePanel: false
      };
    case PAGE_EDIT_SUCCESS:
      return {
        ...state,
        currentPage: action.payload
      }
    case PAGE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case PAGE_NUMBER:
      return {
        ...state,
        currentPageNum: action.num
      };
    case EDITOR_STATE:
      return {
        ...state,
        editorState: action.content
      };
    case PAGE_DELETE_SUCCESS:
      return {
        ...state,
        currentPage: null,
        currentPageNum: null
      };
      case SHOW_PAGES_LIST:
      return {
        ...state,
        showPagesList: action.value
      };
    case PAGE_CREATE_ERROR:
      return {
        ...state,
        error: action.error
      }
    case TOGGLE_MORE_PANEL:
      return {
        ...state,
        showMorePanel: !state.showMorePanel
      }
      case PAGE_QR_CODE_REQUEST:
      return {
        ...state,
        loading: true
      };
    case PAGE_QR_CODE_SUCCESS:
      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          qrCodeData: action.payload
        },
        loading: false
      }
    case PAGE_QR_CODE_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      }
    default:
      return state;
  }
};
