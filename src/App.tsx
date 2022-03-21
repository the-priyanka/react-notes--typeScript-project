import axios from "axios";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import List from "./components/List";
import SearchForm from "./components/SearchForm";
import storiesReducer from "./components/storiesReducer";
import useSemiPersistentState from "./components/useSemiPersistentState";
// import axios from "axios";
// import storiesReducer from "./components/storyReducer";
// import { useCallback, useEffect, useReducer, useState } from "react";
// import List from "./components/List";
// import useSemiPersistentState from "./components/useSemiPersistentState";
// import SearchForm from "./components/SearchForm";
// import styled from "styled-components";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    "search",
    "React"
  );

  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    try {
      const result = await axios.get(url);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  const handleSearchInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    e.preventDefault();
  };

  return (
    <div>
      <h1>My Hacker Stories ....</h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <hr />

      {stories.isError && <h2>Something went wrong ....</h2>}

      {stories.isLoading ? (
        <h2>Loading....</h2>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

// const StyledContainer = styled.div`
//   height: 100vw;
//   padding: 20px;
//   background: #83a4d4;
//   background: linear-gradient(to left, #b6fbff, #83a4d4);
//   color: #171212;
// `;
// const StyledHeadlinePrimary = styled.h1`
//   font-size: 48px;
//   font-weight: 300;
//   letter-spacing: 2px;
// `;

// export const StyledItem = styled.li`
//   display: flex;
//   align-items: center;
//   padding-bottom: 5px;
// `;
// export const StyledColumn = styled.span`
//   padding: 0 5px;
//   white-space: nowrap;
//   overflow: hidden;
//   white-space: nowrap;
//   text-overflow: ellipsis;
//   a {
//     color: inherit;
//   }
//   width: ${(props) => props.width};
// `;

// export const StyledButton = styled.button`
//   background: transparent;
//   border: 1px solid #171212;
//   padding: 5px;
//   cursor: pointer;
//   transition: all 0.1s ease-in;
//   &:hover {
//     background: #171212;
//     color: #ffffff;
//   }
// `;
// export const StyledButtonSmall = styled(StyledButton)`
//   padding: 5px;
// `;
// export const StyledButtonLarge = styled(StyledButton)`
//   padding: 10px;
// `;
// export const StyledSearchForm = styled.form`
//   padding: 10px 0 20px 0;
//   display: flex;
//   align-items: baseline;
// `;

// export const StyledLabel = styled.label`
//   border-top: 1px solid #171212;
//   border-left: 1px solid #171212;
//   padding-left: 5px;
//   font-size: 24px;
// `;
// export const StyledInput = styled.input`
//   border: none;
//   border-bottom: 1px solid #171212;
//   background-color: transparent;
//   font-size: 24px;
// `;
export default App;
