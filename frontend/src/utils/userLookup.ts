// src/utils/userLookup.ts

import { useState, useEffect } from "react";
import { UserUI } from "@/types/userTypes";
import { fetchAllUsers } from "@/services/userService";

export function useUserLookup(): Record<number, UserUI> {
    const [lookup, setLookup] = useState<Record<number, UserUI>>({});

    useEffect(() => {
        fetchAllUsers()
            .then((users: UserUI[]) => {
                const newMap = users.reduce<Record<number, UserUI>>((acc, user) => {
                    acc[user.id] = user;
                    return acc;
                }, {});
                setLookup(newMap);
            })
            .catch((err) => console.error(err));
    }, []);

    return lookup;
}
