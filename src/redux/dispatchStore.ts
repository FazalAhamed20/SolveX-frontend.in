import { AppDispatch } from './Store';

let globalDispatch: AppDispatch | null = null;

export const setGlobalDispatch = (dispatch: AppDispatch) => {
  globalDispatch = dispatch;
};

export const getGlobalDispatch = () => globalDispatch;
