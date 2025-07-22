import { axiosRequest } from "../utils/axiosRequest";

export const deleteItem = async (listName, ID) => {
  return await axiosRequest("delete", listName, `(${ID})`);
};
