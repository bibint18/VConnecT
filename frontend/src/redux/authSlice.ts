import { createSlice, PayloadAction} from "@reduxjs/toolkit";

interface AuthState{
  isAuthenticated:boolean;
  accessToken:string | null
}

const initialState: AuthState = {
  isAuthenticated:false,
  accessToken:null
}

const authSlice = createSlice({
  name:"auth",
  initialState,
  reducers:{
    login: (state,action:PayloadAction<{accessToken:string}>) => {
      state.isAuthenticated=true
      state.accessToken=action.payload.accessToken
    },
    logout:(state) => {
      state.isAuthenticated=false;
      state.accessToken=null
    }
  }
})
export const {login,logout} = authSlice.actions
export default authSlice.reducer
