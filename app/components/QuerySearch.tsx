'use client';

import { useDebounce } from "@/lib/useDebounce";
import { useEffect, useState } from "react";
import { memo } from "react";
type UpdateURLfunction = (key: string, value: string | number) => void;

interface QuerySearchProps {
    updateURL: UpdateURLfunction;
    initialQuery: string;
}

function QuerySearch({updateURL, initialQuery}: QuerySearchProps) {
    const [searchTerm, setSearchTerm] = useState<string>(initialQuery || '');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        const query = debouncedSearchTerm ? debouncedSearchTerm.trim() : '';
        if (query !== initialQuery) {
            updateURL('q', query);
        }
    }, [debouncedSearchTerm, updateURL]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }

    return (
        <div className="w-full text-center">
            <input
                id='querySearch'
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={handleInputChange}
                className="py-3 md:py-2 px-4 outline-none border-b-1 border-gray-300 md:border-b-0 md:rounded-bl-lg md:rounded-br-lg w-full md:w-[570px] bg-white md:bg-[#C0E0F5] text-gray-600 text-sm focus:bg-white"
            />
        </div>
    )
}
export default memo(QuerySearch);