import React from 'react';

export const SearchInput = ({ searchValue, onSearch }) => {
    return (
        <input
            type="text"
            value={searchValue}
            onChange={onSearch}
            placeholder="Buscar"
            className="border p-2 rounded"
            style={{ width: '70%', textAlign: 'center' }}
        />
    );
};
``
