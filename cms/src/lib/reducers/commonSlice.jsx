import { createSlice } from "@reduxjs/toolkit";
import { getLandingPageName } from "@/helper/GlobalValueHelper";

const initialState = {
  page: getLandingPageName(),
  action: "",
  menuOpen: true,
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    updatePageState: (state, value) => {
      state.page = value.payload;
    },
    updateActionState: (state, value) => {
      state.action = value.payload;
    },
    updateMenuOpenState: (state, value) => {
      state.menuOpen = value.payload;
    },
  },
});

export const { updateMenuOpenState, updateActionState, updatePageState } =
  commonSlice.actions;

export const menuOpen = (state) => state.common.menuOpen;

export const pageName = (state) => state.common.page;

export const actionName = (state) => state.common.action;

export default commonSlice.reducer;
