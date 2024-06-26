import React from 'react';

export const SearchInput = ({ searchValue, onSearch }) => {
    return (
        <input
            type="text"
            value={searchValue}
            onChange={onSearch}
            placeholder="Buscar "
            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500"
        />
    );
};

