import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jwt: null,
  id: null,
  name: "",
  email: "",
  phone: "",
  isEmailVerified: false,
  isSmsVerified: false,
  avatarId: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserInfo: (state, value) => {
      state.id = value.payload.id;
      state.name = value.payload.name;
      state.email = value.payload.email;
      state.phone = value.payload.phone;
      state.avatarId = value.payload.avatarId;
      state.isEmailVerified = value.payload.isEmailVerified;
      state.isSmsVerified = value.payload.isSmsVerified;
    },
    updateJwtState: (state, value) => {
      state.jwt = value.payload;
    },
  },
});

export const { updateUserInfo, updateJwtState } = userSlice.actions;

export const user = state => state.user;
export const jwtToken = state => state.user.jwt;
export const userId = state => state.user.id;
export const name = state => state.user.name;
export const email = state => state.user.email;
export const phone = state => state.user.phone;

export default userSlice.reducer;
