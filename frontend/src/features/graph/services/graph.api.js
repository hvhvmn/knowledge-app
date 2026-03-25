import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/graph",
  withCredentials: true,
});

export const getGraph = async () => {
  const res = await api.get("/");
  return res.data;
};
