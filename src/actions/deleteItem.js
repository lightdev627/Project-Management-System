import { axiosRequest } from "../utils/axiosRequest";

export const deleteItem = async (listName, IDs) => {
  await IDs.map(ID => {
    axiosRequest("delete", listName, `(${ID})`);
  })
  return;
};
