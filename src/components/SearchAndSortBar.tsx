import React from "react";
import { Flex, Input } from "@chakra-ui/react";
import NativeSortSelect from "../components/NativeSortSelect";

interface SearchAndSortBarProps {
    search: string;
    setSearch: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
}

const SearchAndSortBar: React.FC<SearchAndSortBarProps> = ({ search, setSearch, sortBy, setSortBy }) => (
    <Flex mb={4} align="center" wrap="wrap">
        <Input placeholder="Search by name, course, availability or skills"
               value={search}
               onChange={e => setSearch(e.target.value)}
               maxW="300px"
               mr={4}
               />
        <NativeSortSelect value={sortBy} onChange={setSortBy} />
    </Flex>
);

export default SearchAndSortBar;