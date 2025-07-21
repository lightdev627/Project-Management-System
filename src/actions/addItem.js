import { axiosRequest } from "../utils/axiosRequest";

export const addItem = async (list, data) => {
  data.__metadata = { type: "SP.Data." + list + "ListItem" };

  return await axiosRequest("post", list, null, data);
};
