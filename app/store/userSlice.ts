import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tenants: tenant | null;
}

interface tenant {
  id: number;
  name: string;
  address: string;
}

export interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
})

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;