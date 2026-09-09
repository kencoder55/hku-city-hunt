import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./reducers/commonSlice";
import userReducer from "./reducers/userSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      common: commonReducer,
      user: userReducer,
    },
  });
};
