import { useImage } from "react-image";
import styled from "styled-components";
import PlaceholderImage from "../../src/assets/placeholder.png";

const WorldImageImg = styled.img`
    width: 100%;
`;

interface WorldImageProps {
    thumbnailImageUrl: string;
    imageUrl: string;
    title: string;
    className?: string;
}

const WorldImage = ({ thumbnailImageUrl, imageUrl, title, className }: WorldImageProps) => {
    const { src } = useImage({
        srcList: [thumbnailImageUrl, imageUrl, PlaceholderImage],
        useSuspense: false,
    });
    return <WorldImageImg className={className} src={src} title={title} />;
};

export default WorldImage;
