import axios, { AxiosResponse } from "axios";
import { LimitedWorld, World } from "vrchat";
// import worlds from "../mockdata/worlds.json";
// import world from "../mockdata/world.json";

export enum SortOption {
    Popularity = "popularity",
    Heat = "heat",
    Trust = "trust",
    Shuffle = "shuffle",
    Random = "random",
    Favorites = "favorites",
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

export const getSortOptionFromString = (sort: string | null) => {
    return sort !== null && Object.values(SortOption).includes(sort as SortOption)
        ? (sort as SortOption)
        : SortOption.Random;
};

export const getTagsFromString = (tags: string | null) => {
    return tags?.split(",") ?? [];
};

export const getWorlds = async (
    q: string | null,
    tags: string[] | undefined,
    sort: SortOption,
): Promise<LimitedWorld[] | null> => {
    const formattedTags = tags?.map((tag) =>
        !tag.startsWith("system_") && !tag.startsWith("admin_") ? `author_tag_${tag}` : tag,
    );
    try {
        const response: AxiosResponse<LimitedWorld[]> = await axios.get("/api/worlds", {
            method: "GET",
            params: {
                q,
                tags: formattedTags,
                sort,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.status);
            console.error(error.response);
        } else {
            console.error(error);
        }
        return null;
    }
    // return worlds as LimitedWorld[];
};

export const getWorld = async (id: string): Promise<World | null> => {
    try {
        const response: AxiosResponse<World> = await axios.get(`/api/world/${id}`, {
            method: "GET",
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.status);
            console.error(error.response);
        } else {
            console.error(error);
        }
        return null;
    }

    // return world as World;
};
