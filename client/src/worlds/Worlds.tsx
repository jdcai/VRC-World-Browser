import { SortOption, getSortOptionFromString, getWorlds } from "../services/WorldService";
import { LimitedWorld } from "vrchat";
import { QueryClient, useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import moment from "moment";
import { Link, useLoaderData, Await, defer, useNavigation } from "react-router-dom";
import Tags from "../tags/Tags";
import { Typography } from "@mui/material";

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
`;

const CreatedDate = styled(WorldInfo)`
    bottom: 0;
    right: 0;
`;
const NoDecorationLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

const worldsQuery = (q: string | null, tags: string[] | undefined, sort: string) => ({
    queryKey: ["worlds", q, tags, sort],
    queryFn: () => getWorlds(q, tags, sort as SortOption),
});

export const loader =
    (queryClient: QueryClient) =>
    async ({ request }: any) => {
        const url = new URL(request.url);
        const q = url.searchParams.get("q");
        const tags = url.searchParams.get("tags")?.split(",");
        const sort = getSortOptionFromString(url.searchParams.get("sort"));
        console.log("test");
        if (!queryClient.getQueryData(worldsQuery(q, tags, sort).queryKey)) {
            await queryClient.fetchQuery(worldsQuery(q, tags, sort));
        }
        return { q, tags, sort };
    };

function Worlds() {
    const { q, tags, sort } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>;
    const { state } = useNavigation();
    const {
        isLoading,
        error,
        data: worlds,
        // isFetching,
    } = useQuery<LimitedWorld[] | null, Error>(worldsQuery(q, tags, sort));
    if (state === "loading") {
        return <div>Loading...</div>;
    }

    if (worlds === null) return <div>An error has occurred</div>;

    return (
        <>
            <WorldsContainer>
                {worlds &&
                    worlds.map((world) => {
                        return (
                            <WorldContainer key={world.id}>
                                <NoDecorationLink to={`/world/${world.id}`} state={{ world }}>
                                    <WorldImageContainer>
                                        <WorldThumbnail src={world.thumbnailImageUrl} alt={world.name}></WorldThumbnail>
                                        <FavoriteCount>{world.favorites} favorites</FavoriteCount>
                                        <CreatedDate>{moment(world.created_at).fromNow()}</CreatedDate>
                                    </WorldImageContainer>
                                </NoDecorationLink>
                                <WorldTitle variant="body1">
                                    <NoDecorationLink to={`/world/${world.id}`} state={{ world }} title={world.name}>
                                        {world.name}
                                    </NoDecorationLink>
                                </WorldTitle>
                                <WorldBroadcaster variant="body2">
                                    <NoDecorationLink
                                        to={`/author/${world.authorId}`}
                                        state={{ world }}
                                        title={world.authorName}
                                    >
                                        {world.authorName}
                                    </NoDecorationLink>
                                </WorldBroadcaster>
                                <Tags tags={world.tags} />
                            </WorldContainer>
                        );
                    })}
            </WorldsContainer>
        </>
    );
}

export default Worlds;