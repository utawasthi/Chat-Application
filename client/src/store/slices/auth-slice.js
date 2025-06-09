const createAuthSlice = (set) => ({
  userInfo : undefined,
  setUserInfo : (userInfo) => {
    // console.log("updating the userInfo in the zustand store");
    set({userInfo})},
});

/* userInfo --> is the state 
  setUserInfo is the action --> a function that updates userInfo
  it uses the set function provided by zustand to update the value of userInfo the store
*/
export default createAuthSlice