import axios from "axios";

if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "/api";
} else if (process.env.NODE_ENV === "test") {
  axios.defaults.baseURL = "http://test998/";
} else if (process.env.NODE_ENV === "production") {
  axios.defaults.baseURL = "http://localhost/";
} else if (process.env.NODE_ENV === "build") {
  axios.defaults.baseURL = "http://build/demo";
}

axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.timeout = 20000;

export function get(url, data) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params:data
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
