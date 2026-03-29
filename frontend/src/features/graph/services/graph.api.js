import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ""}/api/graph`,
  withCredentials: true,
});

export const getGraph = async () => {
  const res = await api.get("/");
  return res.data;
};
