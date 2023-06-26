import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Autocomplete,
  TextField,
  createFilterOptions,
  AutocompleteRenderInputParams,
  Chip,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { SortOption, getWorld } from "./services/WorldService";

const ToolbarContainer = styled(Toolbar)`
  column-gap: ${(props) => props.theme.spacing(1)};
`;

const AppBarContainer = styled(AppBar)`
  z-index: ${(props) => props.theme.zIndex.drawer + 1};
`;

const CustomTextField = styled(TextField)`
  & .MuiFormHelperText-root.Mui-error {
    position: absolute;
    top: 80%;
  }
`;

const SearchTextField = styled(CustomTextField)`
  max-width: 30%;
`;

const HomeLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Header = () => {
  const [sortOption, setSortOption] = useState(SortOption.Favorites);

  const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
    setSortOption(event.target.value as SortOption);
  };
  return (
    <>
      <AppBarContainer position="fixed">
        <ToolbarContainer>
          <HomeLink to={`/`}>
            <Typography variant="h6">Worlds</Typography>
          </HomeLink>

          <SearchTextField
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
                    <Chip
                      {...getTagProps({ index })}
                      key={index}
                      label={option}
                      size="small"
                    />
                  ))}

                  {numTags > limitTags && ` +${numTags - limitTags}`}
                  {/* </div> */}
                </>
              );
            }}
            // onChange={(_0: any, value: any) => goToBroadcaster(value)}

            renderInput={(params: AutocompleteRenderInputParams) => {
              const { InputProps, ...restParams } = params;
              const { startAdornment, ...restInputProps } = InputProps;
              return (
                <CustomTextField
                  {...params}
                  // error={hasUserError}
                  // helperText={hasUserError ? "User does not exist" : ""}
                  label="Search tags"
                  variant="outlined"
                  // size="small"
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
          <IconButton title="Search">
            <SearchIcon />
          </IconButton>
        </ToolbarContainer>
      </AppBarContainer>
    </>
  );
};

export default Header;
