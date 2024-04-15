const TOKEN = "token_key";
function setToken(token) {
  localStorage.setItem(TOKEN, token); // 将token存储到localStorage中
}
function getToken() {
  return localStorage.getItem(TOKEN); // 从localStorage中获取token
}
function removeToken() {
  localStorage.removeItem(TOKEN); // 从localStorage中删除token
}
export { setToken, getToken, removeToken };
