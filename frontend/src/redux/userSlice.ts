import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface UserState{
  name: string | null;
  email: string | null
  isAuthenticated: boolean
}
const initialState: UserState = {
  name:null,
  email:null,
  isAuthenticated:false
}

const userSlice = createSlice({
  name:"user",
  initialState,
  reducers:{
    loginTheUser: (state,action:PayloadAction<{name:string,email:string}>) => {
      state.name=action.payload.name
      state.email=action.payload.email
      state.isAuthenticated=true
    },
    logoutTheUser: (state) => {
      state.name=null
      state.email=null;
      state.isAuthenticated=false
    }
  }
})

export const {loginTheUser,logoutTheUser} = userSlice.actions
export default userSlice.reducer