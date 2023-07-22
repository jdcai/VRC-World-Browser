import { SortOption, getSortOptionFromString, getWorlds } from "../services/WorldService";
import { LimitedWorld } from "vrchat";
import { QueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import moment from "moment";
import { Link, redirect, useLoaderData, useNavigation } from "react-router-dom";
import Tags from "../tags/Tags";
import { CircularProgress, Typography } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

const WorldsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: ${(props) => props.theme.spacing(2)};
    margin: ${(props) => props.theme.spacing(2)};
`;

const WorldContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const WorldImageContainer = styled.div`
    position: relative;
    cursor: pointer;
`;

const WorldThumbnail = styled.img`
    width: 100%;
`;

const TruncatedTypography = styled(Typography)`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

const WorldTitle = styled(TruncatedTypography)`
    min-height: 24px;
    font-weight: 600;
`;

const WorldBroadcaster = styled(TruncatedTypography)`
    min-height: 24px;
`;

const WorldInfo = styled.div`
    position: absolute;
    background-color: #121212;
    margin: ${(props) => props.theme.spacing(2)};
    padding: 0px ${(props) => props.theme.spacing(1)};
`;

const FavoriteCount = styled(WorldInfo)`
    bottom: 0;
    display: flex;
    align-items: center;
`;

const UpdatedData = styled(WorldInfo)`
    bottom: 0;
    right: 0;
`;
const NoDecorationLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

const CenteredContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    margin-top: ${(props) => props.theme.spacing(2)};
`;

const worldsQuery = (q: string | null, tags: string[] | undefined, sort: string) => ({
    queryKey: ["worlds", { q, tags, sort }],
    queryFn: () => getWorlds(q, tags, sort as SortOption),
});

export const loader =
    (queryClient: QueryClient) =>
    async ({ request }: any) => {
        const url = new URL(request.url);
        const q = url.searchParams.get("q");
        let tags = url.searchParams.get("tags")?.split(",");
        let sort = url.searchParams.get("sort");

        if (!q && !tags && !sort) {
            return redirect("/?tags=system_approved&sort=random");
        }
        sort = getSortOptionFromString(url.searchParams.get("sort"));
        if (sort === SortOption.Random) {
            // Invalidate query early if it has random sort since results will change
            queryClient.invalidateQueries(["worlds", { sort: "random" }], {
                predicate: (query) => {
                    const lastFetchTime = query.state.dataUpdatedAt;
                    const currentTime = Date.now();
                    const elapsedTime = currentTime - lastFetchTime;
                    return elapsedTime > 15 * 1000;
                },
            });
            return queryClient.fetchQuery(worldsQuery(q, tags, sort));
        }
        return (
            queryClient.getQueryData(worldsQuery(q, tags, sort).queryKey) ??
            (await queryClient.fetchQuery(worldsQuery(q, tags, sort)))
        );
    };

function Worlds() {
    const worlds = useLoaderData() as LimitedWorld[];
    const { state } = useNavigation();

    if (state === "loading") {
        return (
            <CenteredContainer>
                <CircularProgress size={60} />
            </CenteredContainer>
        );
    }

    if (!worlds || worlds.length === 0) return <CenteredContainer>No results found</CenteredContainer>;

    return (
        <>
            <WorldsContainer>
                {worlds &&
                    worlds.map((world) => {
                        if (!world) {
                            return null;
                        }
                        return (
                            <WorldContainer key={world?.id}>
                                <NoDecorationLink to={`/world/${world?.id}`} state={{ world }}>
                                    <WorldImageContainer>
                                        <WorldThumbnail
                                            src={world?.thumbnailImageUrl}
                                            alt={world?.name}
                                        ></WorldThumbnail>
                                        <FavoriteCount>
                                            {world?.favorites?.toLocaleString() ?? 0}{" "}
                                            <StarOutlineIcon fontSize="small" />
                                        </FavoriteCount>
                                        <UpdatedData>Updated {moment(world?.updated_at).fromNow()}</UpdatedData>
                                    </WorldImageContainer>
                                </NoDecorationLink>
                                <WorldTitle variant="body1">
                                    <NoDecorationLink to={`/world/${world?.id}`} state={{ world }} title={world?.name}>
                                        {world?.name}
                                    </NoDecorationLink>
                                </WorldTitle>
                                <WorldBroadcaster variant="body2">
                                    {/* <NoDecorationLink
                                        to={`/author/${world?.authorId}`}
                                        state={{ world }}
                                        title={world?.authorName}
                                    >
                                        {world?.authorName}
                                    </NoDecorationLink> */}
                                    {world?.authorName}
                                </WorldBroadcaster>
                                <Tags tags={world?.tags} />
                            </WorldContainer>
                        );
                    })}
            </WorldsContainer>
        </>
    );
}

export default Worlds;
