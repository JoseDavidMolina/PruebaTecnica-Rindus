import React from 'react';

interface SearchBarProps {
  inputLocation: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ inputLocation, handleInputChange, handleSearch }) => {
  return (
    <div>
      <input
        type="text"
        value={inputLocation}
        onChange={handleInputChange}
        placeholder="Enter location"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;