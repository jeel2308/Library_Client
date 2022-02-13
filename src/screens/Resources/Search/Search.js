/**--external-- */
import React from 'react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { BiSearch } from 'react-icons/bi';
import { IconContext } from 'react-icons';

/**--relative-- */
import {
  searchIconStyle,
  inputStyle,
  inputGroupStyle,
  inputLeftElementStyle,
} from './SearchStyles';
const Search = (props) => {
  const { value, onChange } = props;
  return (
    <InputGroup style={inputGroupStyle}>
      <InputLeftElement style={inputLeftElementStyle}>
        <IconContext.Provider value={searchIconStyle}>
          <BiSearch />
        </IconContext.Provider>
      </InputLeftElement>
      <Input
        placeholder="search"
        value={value}
        variant="unstyled"
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </InputGroup>
  );
};

export default Search;

Search.displayName = 'Search';
