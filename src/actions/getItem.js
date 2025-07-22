import { axiosRequest } from "../utils/axiosRequest";

export const getItem = async (listName, keys, details) => {
  
  return await axiosRequest("get", listName, details);
};
