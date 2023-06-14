import { LimitedWorld, World as VRWorld } from "vrchat";
import styled from "styled-components";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWorld } from "../services/WorldService";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

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

type WorldProps = {
  world: LimitedWorld;
};

const World = () => {
  const location = useLocation();
  const world: LimitedWorld = location.state.world;

  const {
    isLoading,
    error,
    data: detailedWorld,
    // isFetching,
  } = useQuery<VRWorld, Error>({
    queryKey: ["world", world.id],
    queryFn: () => getWorld(world.id),
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error has occurred: {error.message}</div>;

  const tagPrefix = "author_tag_";
  const formatTag = (tag: string) => {
    return tag.startsWith(tagPrefix) ? tag.slice(tagPrefix.length) : tag;
  };
  const searchTag = (tag: string) => {
    console.log(tag);
  };
  return (
    <>
      {world && (
        <WorldContainer>
          <WorldImage src={world.imageUrl} alt={world.name} />
          <WorldInfoContainer>
            <h2>{world.name}</h2>
            <h3>By {world.authorName}</h3>
            <div>{detailedWorld.description}</div>
            <div>{world.favorites} favorites</div>
            <div>Created {moment(world?.created_at).fromNow()}</div>
            <Stack direction="row" spacing={1}>
              {world.tags.map((tag) => (
                <Chip onClick={() => searchTag(tag)} label={formatTag(tag)} />
              ))}
            </Stack>
          </WorldInfoContainer>
        </WorldContainer>
      )}
    </>
  );
};

export default World;
