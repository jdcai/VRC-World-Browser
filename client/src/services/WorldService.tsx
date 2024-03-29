import axios, { AxiosResponse } from "axios";
import { LimitedWorld, World } from "vrchat";
// import worlds from "../mockdata/worlds.json";
// import world from "../mockdata/world.json";

export enum SortOption {
    Popularity = "popularity",
    Heat = "heat",
    Shuffle = "shuffle",
    Random = "random",
    Favorites = "favorites",
    "Publication Date" = "publicationDate",
    "Labs Publication Date" = "labsPublicationDate",
    "Recently Created" = "created",
    "Recently Updated" = "updated",
    Order = "order",
    Relevance = "relevance",
    Magic = "magic",
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
        tag.startsWith("system_") ||
        tag.startsWith("admin_") ||
        tag.startsWith("content_") ||
        tag.startsWith("feature_")
            ? tag
            : `author_tag_${tag}`,
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
