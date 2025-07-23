import { axiosRequest } from "../utils/axiosRequest";

export const getItem = async (listName, keys, details) => {
  
  let items = await axiosRequest("get", listName, details);
  
  items = items.map((it) => {
    const temp = {};
    keys.map((key) => (temp[key] = it[key]));
    return temp;
  });
  
  return items;
};
