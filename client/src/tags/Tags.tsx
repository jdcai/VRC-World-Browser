import { Chip } from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${(props) => props.theme.spacing(1)};
`;

// Todo: handle admin and system tags
const tagPrefix = "author_tag_";

type TagsProps = {
    tags: string[];
};

const Tags = ({ tags, ...props }: TagsProps) => {
    let [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const formatTag = (tag: string) => {
        return tag.startsWith(tagPrefix) ? tag.slice(tagPrefix.length) : tag;
    };

    const searchTag = (tag: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("q");

        newSearchParams.set("tags", formatTag(tag));

        navigate(`/?${newSearchParams.toString()}`);
    };

    return (
        <TagContainer {...props}>
            {tags.map((tag) => (
                <Chip
                    // component={Link}
                    // to={`/?tags=${formatTag(tag)}`}
                    onClick={() => searchTag(tag)}
                    key={tag}
                    label={formatTag(tag)}
                    size="small"
                    // clickable
                />
            ))}
        </TagContainer>
    );
};

export default Tags;
