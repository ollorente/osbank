// @ts-check
import axios from "axios";

export default axios.create({
  baseURL: `/.netlify/functions/api`,
  // baseURL: `http://localhost:3003`,
  headers: {
    "Content-type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});
