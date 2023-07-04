import axios, { AxiosResponse } from "axios";
import { LimitedWorld, World } from "vrchat";
import worlds from "../mockdata/worlds.json";
import world from "../mockdata/world.json";

export enum SortOption {
    Popularity = "popularity",
    Heat = "heat",
    Trust = "trust",
    Shuffle = "shuffle",
    Random = "random",
    Favorites = "favorites",
    ReportScore = "reportScore",
    ReportCount = "reportCount",
    PublicationDate = "publicationDate",
    LabsPublicationDate = "labsPublicationDate",
    Created = "created",
    CreatedAt = "_created_at",
    Updated = "updated",
    UpdatedAt = "_updated_at",
    Order = "order",
    Relevance = "relevance",
    Magic = "magic",
    Name = "name",
}

export const getWorlds = async (): // searchTerm: string,
// tags: string[],
// sortOption: SortOption
Promise<LimitedWorld[]> => {
    // const response: AxiosResponse<LimitedWorld[]> = await axios.get(
    //   "/api/worlds",
    //   {
    //     method: "GET",
    //   }
    // );
    // return response.data;
    return worlds as LimitedWorld[];
};

export const getWorld = async (id: string): Promise<World> => {
    // const response: AxiosResponse<World> = await axios.get(`/api/world/${id}`, {
    //   method: "GET",
    // });
    // return response.data;

    return world as World;
};
