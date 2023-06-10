import { LimitedWorld, World as VRWorld } from "vrchat";
import styled from "styled-components";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWorld } from "../services/WorldService";

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
    data: worldData,
    // isFetching,
  } = useQuery<VRWorld, Error>({
    queryKey: ["world", world.id],
    queryFn: () => getWorld(world.id),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <>
      {world && (
        <WorldContainer>
          <WorldImage src={world.imageUrl} alt={world.name} />
          <WorldInfoContainer>
            <h2>{world.name}</h2>
            <h3>By {world.authorName}</h3>
            <div>{worldData.description}</div>
            <div>{world.favorites} favorites</div>
            <div>Created {moment(world?.created_at).fromNow()}</div>
          </WorldInfoContainer>
        </WorldContainer>
      )}
    </>
  );
};

export default World;
