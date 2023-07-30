import { World as VRWorld } from "vrchat";
import styled from "styled-components";
import moment from "moment";
import { Params, useLoaderData, useNavigation } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { getWorld } from "../services/WorldService";
import Tags from "../tags/Tags";
import { Button, CircularProgress, Divider } from "@mui/material";
import WorldImage from "../common/WorldImage";
import WorldDetail from "./WorldDetail";

const WorldContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #121212;
`;
const MainWorldContent = styled.div`
    display: flex;
    justify-content: center;
`;

const WorldInfoContainer = styled.div`
    row-gap: ${(props) => props.theme.spacing(1)};
    padding: ${(props) => props.theme.spacing(2)};
`;

const WorldImageContainer = styled.div``;

const StyledTags = styled(Tags)`
    margin-top: ${(props) => props.theme.spacing(1)};
`;

const StyledButtonContainer = styled.div`
    margin-left: auto;
    margin-right: ${(props) => props.theme.spacing(2)};
`;

const StyledWorldContainerRight = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 33.33%;
`;

const CenteredContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    margin-top: ${(props) => props.theme.spacing(2)};
`;

const WorldDetailsContainer = styled.div`
    margin-top: ${(props) => props.theme.spacing(1)};
    margin-bottom: ${(props) => props.theme.spacing(1)};
`;
const InnerWorldDetailsContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    height: 80px;
`;

const CustomWorldImage = styled(WorldImage)`
    max-height: calc(100vh - 64px - 104px);
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

    if (state === "loading") {
        return (
            <CenteredContainer>
                <CircularProgress size={60} />
            </CenteredContainer>
        );
    }

    if (world === null) return <CenteredContainer>World not found</CenteredContainer>;

    return (
        <>
            {world && (
                <WorldContainer>
                    <MainWorldContent>
                        <WorldImageContainer>
                            <CustomWorldImage thumbnailImageUrl={""} imageUrl={world?.imageUrl} title={world?.name} />
                        </WorldImageContainer>
                        <StyledWorldContainerRight>
                            <WorldInfoContainer>
                                <h2>{world?.name}</h2>
                                <h3>By {world?.authorName}</h3>
                                <div>{world?.description}</div>
                                <StyledTags tags={world?.tags} />
                            </WorldInfoContainer>

                            <StyledButtonContainer>
                                <Button href={`https://vrchat.com/home/world/${world?.id}`} variant="outlined">
                                    View on VR chat
                                </Button>
                            </StyledButtonContainer>
                        </StyledWorldContainerRight>
                    </MainWorldContent>
                    <WorldDetailsContainer>
                        <Divider variant="middle" />
                        <InnerWorldDetailsContainer>
                            <WorldDetail title="Visits" value={world?.visits?.toLocaleString()} />
                            <WorldDetail title="Favorites" value={world?.favorites?.toLocaleString()} />
                            <WorldDetail title="Capacity" value={world?.capacity?.toLocaleString()} />
                            <WorldDetail title="Public Players" value={world?.publicOccupants?.toLocaleString()} />
                            <WorldDetail title="Private Players" value={world?.privateOccupants?.toLocaleString()} />
                            <WorldDetail
                                title="Created"
                                value={moment(world?.created_at).fromNow()}
                                formattedDate={moment(world?.created_at).format("ll")}
                            />
                            {world?.publicationDate !== "none" && (
                                <WorldDetail
                                    title="Published"
                                    value={moment(world?.publicationDate).fromNow()}
                                    formattedDate={moment(world?.publicationDate).format("ll")}
                                />
                            )}
                            <WorldDetail
                                title="Updated"
                                value={moment(world?.updated_at).fromNow()}
                                formattedDate={moment(world?.updated_at).format("ll")}
                            />
                            <WorldDetail title="Popularity" value={world?.popularity?.toLocaleString()} />
                            <WorldDetail title="Heat" value={world?.heat?.toLocaleString()} />
                        </InnerWorldDetailsContainer>
                        <Divider variant="middle" />
                    </WorldDetailsContainer>
                </WorldContainer>
            )}
        </>
    );
};

export default World;
