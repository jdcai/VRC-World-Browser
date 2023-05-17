import { useEffect, useState } from "react";
import { getWorlds } from "./services/WorldService";
import { LimitedWorld } from "vrchat";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import moment from "moment";

const WorldsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 1rem;
`;

const WorldContainer = styled.div`
  display: inline-block;
`;

const WorldImageContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const WorldThumbnail = styled.img`
  width: 100%;
`;

const WorldTitle = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-height: 24px;
  font-weight: 600;
`;

const WorldBroadcaster = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-height: 24px;
`;

const WorldInfo = styled.div`
  position: absolute;
  background-color: #12121299;
  margin: 1rem;
  padding: 0px 0.4rem;
`;

const FavoriteCount = styled(WorldInfo)`
  bottom: 0;
`;

const CreatedDate = styled(WorldInfo)`
  bottom: 0;
  right: 0;
`;

function App() {
  const {
    isLoading,
    error,
    data: worlds,
    // isFetching,
  } = useQuery<LimitedWorld[], Error>({
    queryKey: ["worldData"],
    queryFn: getWorlds,
  });

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <h1>World browser</h1>
      <WorldsContainer>
        {worlds &&
          worlds.map((world) => {
            return (
              <WorldContainer key={world.id}>
                <WorldImageContainer>
                  <WorldThumbnail
                    src={world?.thumbnailImageUrl}
                    alt={world?.name}
                  ></WorldThumbnail>
                  <FavoriteCount>{world?.favorites} favorites</FavoriteCount>
                  <CreatedDate>
                    {moment(world?.created_at).fromNow()}
                  </CreatedDate>
                </WorldImageContainer>
                <WorldTitle title={world?.name}>{world?.name}</WorldTitle>
                <WorldBroadcaster>{world?.authorName}</WorldBroadcaster>
              </WorldContainer>
            );
          })}
      </WorldsContainer>
    </>
  );
}

export default App;
