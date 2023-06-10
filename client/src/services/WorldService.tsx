import axios, { AxiosResponse } from "axios";
import { LimitedWorld, World } from "vrchat";

export const getWorlds = async (): Promise<LimitedWorld[]> => {
  // const response: AxiosResponse<LimitedWorld[]> = await axios.get(
  //   "/api/worlds",
  //   {
  //     method: "GET",
  //   }
  // );
  // return response.data;
};
export const getWorld = async (id: string): Promise<World> => {
  // const response: AxiosResponse<World> = await axios.get(`/api/world/${id}`, {
  //   method: "GET",
  // });
  // return response.data;
};
