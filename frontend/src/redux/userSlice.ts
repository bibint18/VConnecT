import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface UserState{
  name: string | null;
  email: string | null
  isAuthenticated: boolean;
  accessToken:string | null
}
const initialState: UserState = {
  name:null,
  email:null,
  isAuthenticated:false,
  accessToken:null
}

const userSlice = createSlice({
  name:"user",
  initialState,
  reducers:{
    loginTheUser: (state,action:PayloadAction<{name:string,email:string,accessToken:string}>) => {
      state.name=action.payload.name
      state.email=action.payload.email
      state.isAuthenticated=true
      state.accessToken=action.payload.accessToken
    },
    logoutTheUser: (state) => {
      state.name=null
      state.email=null;
      state.isAuthenticated=false
      state.accessToken=null
    },
    updateProfile:(state,action: PayloadAction<{name:string}>) => {
      state.name=action.payload.name ?? state.name
    }
  }
})

export const {loginTheUser,logoutTheUser,updateProfile} = userSlice.actions
export default userSlice.reducer