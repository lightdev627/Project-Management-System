import { axiosRequest } from "../utils/axiosRequest";

export const editItem = async (listName, ID, data) => {
  data.__metadata = { type: "SP.Data." + listName + "ListItem" };

  return await axiosRequest("patch", listName, `(${ID})`, data);
};
