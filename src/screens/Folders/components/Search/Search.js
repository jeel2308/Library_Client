/**--external-- */
import React from 'react';
import { Input, InputGroup, InputLeftElement, Box } from '@chakra-ui/react';
import { BiSearch } from 'react-icons/bi';
import { IconContext } from 'react-icons';

/**--relative-- */
import { searchIconStyle, inputGroupStyle, inputStyle } from './SearchStyles';
import classes from './Search.module.scss';

const Search = (props) => {
  const { value, onChange } = props;
  return (
    <Box className={classes.container}>
      <InputGroup style={inputGroupStyle} size="lg">
        <InputLeftElement className={classes.inputLeftElementContainer}>
          <IconContext.Provider value={searchIconStyle}>
            <BiSearch />
          </IconContext.Provider>
        </InputLeftElement>
        <Input
          placeholder="Search collections"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      </InputGroup>
    </Box>
  );
};

export default Search;

Search.displayName = 'Search';
