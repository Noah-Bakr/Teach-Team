"use client";

import React from "react";
import { NativeSelect } from "@chakra-ui/react";

interface SortSelectProps {
    value: string;
    onChange: (value: string) => void;
}

const NativeSortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => {
    return (
        <NativeSelect.Root size="sm" width="240px">
            <NativeSelect.Field
                placeholder="Sort by"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="course">Course Name</option>
                <option value="availability">Availability</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
        </NativeSelect.Root>
    );
};

export default NativeSortSelect;
