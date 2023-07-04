import { Chip } from "@mui/material";
import styled from "styled-components";

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${(props) => props.theme.spacing(1)};
`;

const tagPrefix = "author_tag_";

const formatTag = (tag: string) => {
    return tag.startsWith(tagPrefix) ? tag.slice(tagPrefix.length) : tag;
};

type TagsProps = {
    tags: string[];
};
const searchTag = (tag: string) => {
    console.log(tag);
};

const Tags = ({ tags }: TagsProps) => {
    return (
        <TagContainer>
            {tags.map((tag) => (
                <Chip key={tag} onClick={() => searchTag(tag)} label={formatTag(tag)} size="small" />
            ))}
        </TagContainer>
    );
};

export default Tags;
