import { LimitedWorld, SortOption, World as VRWorld } from "vrchat";
import styled from "styled-components";
import moment from "moment";
import {
    LoaderFunctionArgs,
    Params,
    useLoaderData,
    useLocation,
    useNavigate,
    useNavigation,
    useParams,
} from "react-router-dom";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { getWorld, getWorlds } from "../services/WorldService";
import Tags from "../tags/Tags";

const WorldContainer = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    background-color: #121212;
`;

const WorldInfoContainer = styled.div`
    padding: 1rem;
    max-width: 33.33%;
`;

const WorldImage = styled.img`
    max-width: 66.67%;
`;

const worldQuery = (worldId: string) => ({
    queryKey: ["world", worldId],
    queryFn: () => getWorld(worldId),
});

export const loader =
    (queryClient: QueryClient) =>
    async ({ params }: { params: Params<string> }) => {
        if (params.worldId) {
            const query = worldQuery(params.worldId);

            return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
        }
        return null;
    };

const World = () => {

    const world = useLoaderData() as VRWorld;
    const { state } = useNavigation();
    if (state === "loading") return <div>Loading...</div>;

    if (world === null) return <div>An error has occurred</div>;

    return (
        <>
            {world && (
                <WorldContainer>
                    <WorldImage src={world.imageUrl} alt={world.name} />
                    <WorldInfoContainer>
                        <h2>{world.name}</h2>
                        <h3>By {world.authorName}</h3>
                        <div>{world.description}</div>
                        <div>{world.favorites} favorites</div>
                        <div>Created {moment(world?.created_at).fromNow()}</div>

                        <Tags tags={world.tags} />
                    </WorldInfoContainer>
                </WorldContainer>
            )}
        </>
    );
};

export default World;
