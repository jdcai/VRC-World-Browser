import React, { ChangeEvent, useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Autocomplete,
    TextField,
    AutocompleteRenderInputParams,
    Chip,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";
import { Form, Link, useNavigate, useSearchParams } from "react-router-dom";
import { SortOption, getSortOptionFromString, getTagsFromString } from "./services/WorldService";

const StyledForm = styled(Form)`
    width: 100%;
    display: flex;
    column-gap: ${(props) => props.theme.spacing(1)};
    align-items: center;
`;

const StyledAppBar = styled(AppBar)`
    z-index: ${(props) => props.theme.zIndex.drawer + 1};
`;

const StyledTextField = styled(TextField)`
    & .MuiFormHelperText-root.Mui-error {
        position: absolute;
        top: 80%;
    }
`;

const StyledSearchTextField = styled(StyledTextField)`
    max-width: 30%;
`;

const StyledHomeLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

const Header = () => {
    let [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
    const [sortOption, setSortOption] = useState(getSortOptionFromString(searchParams.get("sort")));

    const [tags, setTags] = useState<string[]>(getTagsFromString(searchParams.get("tags")));
    const [tagInput, setTagInput] = useState<string>("");

    const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
        setSortOption(event.target.value as SortOption);
    };

    const handleTagsChange = (_0: any, value: string[]) => {
        setTags(value);
    };
    const handleTagInputChange = (_0: any, value: string) => {
        setTagInput(value);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const params = new URLSearchParams(formData as any);
        if (!params.get("q")) {
            params.delete("q");
        }
        if (tags.length > 0 || tagInput) {
            if (tagInput) {
                tags.push(tagInput);
                setTagInput("");
            }
            params.set("tags", tags.join());
        } else {
            params.delete("tags");
        }
        params.set("sort", sortOption);
        navigate(`/?${params.toString()}`);
    };

    useEffect(() => {
        setTags(getTagsFromString(searchParams.get("tags")));
        setSortOption(getSortOptionFromString(searchParams.get("sort")));
        setSearchTerm(searchParams.get("q") ?? "");
    }, [searchParams]);

    return (
        <>
            <StyledAppBar position="fixed">
                <Toolbar>
                    {/* Can search world ands authors? */}
                    <StyledForm method="get" id="search-form" role="search" onSubmit={handleSubmit}>
                        <StyledHomeLink to={`/`}>
                            <Typography variant="h6">Worlds</Typography>
                        </StyledHomeLink>
                        <StyledSearchTextField
                            name="q"
                            // defaultValue={searchParams.get("q")}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            // error={hasUserError}
                            // helperText={hasUserError ? "User does not exist" : ""}
                            label="Search"
                            variant="outlined"
                            size="small"
                            fullWidth
                        />

                        <Autocomplete
                            freeSolo
                            multiple
                            id="world-search"
                            fullWidth
                            size="small"
                            options={[]}
                            autoComplete={false}
                            value={tags}
                            onChange={handleTagsChange}
                            inputValue={tagInput}
                            onInputChange={handleTagInputChange}
                            renderTags={(value, getTagProps) => {
                                const numTags = value.length;
                                const limitTags = 5;

                                return (
                                    // <div
                                    //   style={{
                                    //     maxHeight: 20,
                                    //     overflowX: "auto",
                                    //   }}
                                    // >
                                    <>
                                        {value.slice(0, limitTags).map((option, index) => (
                                            // {value.map((option, index) => (
                                            <Chip {...getTagProps({ index })} key={index} label={option} size="small" />
                                        ))}

                                        {numTags > limitTags && ` +${numTags - limitTags}`}
                                        {/* </div> */}
                                    </>
                                );
                            }}
                            renderInput={(params: AutocompleteRenderInputParams) => {
                                // const { InputProps, ...restParams } = params;
                                // const { startAdornment, ...restInputProps } = InputProps;
                                return (
                                    <StyledTextField
                                        {...params}
                                        // error={hasUserError}
                                        // helperText={hasUserError ? "User does not exist" : ""}
                                        label="Search tags"
                                        variant="outlined"
                                        name="tags"
                                        // InputProps={{
                                        //   ...restInputProps,
                                        //   startAdornment: (
                                        //     <div
                                        //       style={{
                                        //         maxHeight: 20,
                                        //         overflowY: "auto",
                                        //       }}
                                        //     >
                                        //       {startAdornment}
                                        //     </div>
                                        //   ),
                                        // }}
                                    />
                                );
                            }}
                        />
                        <Select
                            labelId="label"
                            id="select"
                            onChange={handleSortChange}
                            size="small"
                            name="sort"
                            value={sortOption}
                        >
                            {Object.entries(SortOption).map(([key, value]) => {
                                return (
                                    <MenuItem key={key} value={value}>
                                        {key}
                                    </MenuItem>
                                );
                            })}
                        </Select>

                        <IconButton title="Search" type="submit">
                            <SearchIcon />
                        </IconButton>
                    </StyledForm>
                </Toolbar>
            </StyledAppBar>
        </>
    );
};

export default Header;
