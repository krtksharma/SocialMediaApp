import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getMyInfo = createAsyncThunk('user/getMyInfo',async () => {
    try {
        const res = await axiosClient.get('/users/getMyInfo');
        return res.data.result;
    } catch (e) {
        return Promise.reject(e);
    }
});


export const updateMyProfile = createAsyncThunk('user/updateProfile',async (data) => {
    try { 
        const res = await axiosClient.put('/users/updateUser',data);
        console.log(res.data," api called");
        return res.data.result;
    } catch (e) {
        return Promise.reject(e);
    }
});


const appConfigSlice = createSlice({
    name : "appConfig",
    initialState : {
        isLoading : false,
        myProfile : {},
        toastData: {},

    },
    reducers:{
        setLoading : (state, action) => {
            state.isLoading = action.payload;
        },
        showToast: (state, action) => {
            state.toastData = action.payload;
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(getMyInfo.fulfilled,(state, action) =>{
            state.myProfile = action.payload.User;
        }).addCase(updateMyProfile.fulfilled,(state, action) =>{
            state.myProfile = action.payload.User;
        })
    }
})

export default appConfigSlice.reducer;

export const { setLoading, showToast  } = appConfigSlice.actions;
