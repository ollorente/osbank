// @ts-check
import axios from "axios";

export default axios.create({
  baseURL: `/.netlify/functions`,
  headers: {
    "Content-type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});
