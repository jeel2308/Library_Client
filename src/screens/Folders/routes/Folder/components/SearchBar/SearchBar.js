/**--external-- */
import React, { useRef } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { IconContext } from 'react-icons';
import { BiSearch, BiX } from 'react-icons/bi';

/**--relative-- */
import { iconStyle, inputStyle, inputAddonStyle } from './SearchBarStyles';

const SearchBar = (props) => {
  const { value, onChange } = props;

  const inputRef = useRef();

  const onCloseIconClick = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <InputGroup size="md" borderRadius="8px" padding={1}>
      <InputLeftElement pointerEvents="none" style={inputAddonStyle}>
        <IconContext.Provider value={iconStyle}>
          <BiSearch />
        </IconContext.Provider>
      </InputLeftElement>
      <Input
        value={value}
        onChange={onInputChange}
        style={inputStyle}
        ref={inputRef}
        placeholder="Search links by title or url"
      />
      <InputRightElement
        style={inputAddonStyle}
        onClick={onCloseIconClick}
        cursor="pointer"
      >
        <IconContext.Provider value={iconStyle}>
          <BiX />
        </IconContext.Provider>
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchBar;

SearchBar.displayName = 'SearchBar';
