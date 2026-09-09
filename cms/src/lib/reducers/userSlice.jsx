import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jwt: null,
  id: null,
  name: "",
  email: "",
  roles: [],
  permissions: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserInfo: (state, value) => {
      state.id = value.payload.id;
      state.name = value.payload.username;
      state.email = value.payload.email;
      state.roles = value.payload.roles;
      state.permissions = value.payload.permissions;
    },
    updateJwtState: (state, value) => {
      state.jwt = value.payload;
    },
    updateUserIdState: (state, value) => {
      state.id = value.payload;
    },
    updateUserNameState: (state, value) => {
      state.name = value.payload;
    },
  },
});

export const {
  updateUserInfo,
  updateJwtState,
  updateUserIdState,
  updateUserNameState,
} = userSlice.actions;

export const user = (state) => state.user;
export const jwtToken = (state) => state.user.jwt;
export const userId = (state) => state.user.id;
export const username = (state) => state.user.name;

export default userSlice.reducer;
