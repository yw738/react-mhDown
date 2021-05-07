import { CHANGINPUT } from "./actionTypes";
const defaultStatus = {
  inputValue: "这是属性",
  list: ["1121", "22222", "33333", "44444", "55555"],
  isNowDown:false,//现在是否有下载任务
};
//Reducer 必须是纯函数 不能调用ajax 等等
const reduce = (state = defaultStatus, action) => {
  let { type, value } = action;
  switch (type) {
    case CHANGINPUT:
      state = value;
      return state;
    default:
      return state;
  }
};
export default reduce;
