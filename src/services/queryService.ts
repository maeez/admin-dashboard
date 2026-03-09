import axios from "axios";

const API = axios.create({
  baseURL: "https://dummyjson.com",
});

export const getProducts = async () => {
  const res = await API.get("/products");
  return res.data.products;
};

export const getProduct = async (id: number) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (data: any) => {
  const res = await API.post("/products/add", data);
  return res.data;
};

export const updateProduct = async (id: number, data: any) => {
  const res = await API.patch(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};

export const getUsers = async () => {
  const res = await API.get("/users");
  return res.data.users;
};

export const getUser = async (id: number) => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};

export const createUser = async (data: any) => {
  const res = await API.post("/users/add", data);
  return res.data;
};

export const updateUser = async (id: number, data: any) => {
  const res = await API.patch(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await API.delete(`/users/${id}`);
  return res.data;
};
