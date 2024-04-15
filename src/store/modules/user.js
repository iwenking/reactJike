import { createSlice } from "@reduxjs/toolkit";
import { removeToken } from "@/utils";
import { setToken as _setToken, getToken } from "@/utils";
import { loginAPI, getProfileAPI } from "@/apis/user";

const userStore = createSlice({
  name: "user",
  initialState: {
    //数据状态
    token: getToken() || "",
    userInfo: {},
  },
  //同步修改方法
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      //存入本地
      _setToken(action.payload);
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    clearUserInfo(state) {
      state.token = "";
      state.userInfo = {};
      removeToken();
    },
  },
});

//解构actionCreater
const { setToken, setUserInfo, clearUserInfo } = userStore.actions;
//获取reducer函数
const userReducer = userStore.reducer;

//异步方法 完成登录获取token
const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    //1、发送异步请求
    const res = await loginAPI(loginForm);
    //2、提交同步action进行token的存入
    dispatch(setToken(res.data.token));
  };
};

//获取用户信息
const fetchUserInfo = () => {
  return async (dispatch) => {
    const res = await getProfileAPI();
    dispatch(setUserInfo(res.data));
  };
};

export { fetchLogin, fetchUserInfo, clearUserInfo };
export default userReducer;
