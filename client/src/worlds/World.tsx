import { World as VRWorld } from "vrchat";
import styled from "styled-components";
import moment from "moment";
import { Params, useLoaderData, useNavigation } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { getWorld } from "../services/WorldService";
import Tags from "../tags/Tags";
import { Button } from "@mui/material";

const WorldContainer = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    background-color: #121212;
`;

const WorldInfoContainer = styled.div`
    row-gap: ${(props) => props.theme.spacing(1)};
    padding: ${(props) => props.theme.spacing(2)};
`;

const WorldImage = styled.img`
    max-width: 66.67%;
`;
const StyledTags = styled(Tags)`
    margin-top: ${(props) => props.theme.spacing(1)};
`;

const StyledButtonContainer = styled.div`
    margin-top: auto;
    margin-left: auto;
    margin-right: ${(props) => props.theme.spacing(2)};
`;

const StyledWorldContainerRight = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 33.33%;
`;

const worldQuery = (worldId: string) => ({
    queryKey: ["world", worldId],
    queryFn: () => getWorld(worldId),
});

export const loader =
    (queryClient: QueryClient) =>
    async ({ params }: { params: Params<string> }) => {
        // console.log("world", params);
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
                    <StyledWorldContainerRight>
                        <WorldInfoContainer>
                            <h2>{world.name}</h2>
                            <h3>By {world.authorName}</h3>
                            <div>{world.description}</div>
                            <div>{world.favorites?.toLocaleString()} favorites</div>
                            <div>Updated {moment(world.updated_at).fromNow()}</div>
                            <div>Created {moment(world.created_at).fromNow()}</div>

                            <StyledTags tags={world.tags} />
                        </WorldInfoContainer>
                        <StyledButtonContainer>
                            <Button href={`https://vrchat.com/home/world/${world.id}`} variant="outlined">
                                View on VR chat
                            </Button>
                        </StyledButtonContainer>
                    </StyledWorldContainerRight>
                </WorldContainer>
            )}
        </>
    );
};

export default World;
