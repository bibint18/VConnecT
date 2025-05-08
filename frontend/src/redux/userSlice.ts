import { createSlice,PayloadAction } from "@reduxjs/toolkit";


export interface UserState{
  userId:string | null;
  name: string | null;
  email: string | null
  isAuthenticated: boolean;
  accessToken:string | null
}
const initialState: UserState = {
  userId:null,
  name:null,
  email:null,
  isAuthenticated:false,
  accessToken:null
}

const userSlice = createSlice({
  name:"user",
  initialState,
  reducers:{
    loginTheUser: (state,action:PayloadAction<{userId:string,name:string,email:string,accessToken:string}>) => {
      state.userId=action.payload.userId
      state.name=action.payload.name
      state.email=action.payload.email
      state.isAuthenticated=true
      state.accessToken=action.payload.accessToken
    },
    logoutTheUser: (state) => {
      state.userId=null
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
