import { axiosRequest } from "../utils/axiosRequest";

export const addItem = async (listName, data) => {
  
  data.__metadata = { type: `SP.Data.${listName}ListItem` };

  return await axiosRequest('post', listName, null, data);
};
