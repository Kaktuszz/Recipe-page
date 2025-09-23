import { Box, HStack } from "@chakra-ui/react";
import { Input, InputGroup } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { NativeSelect } from "@chakra-ui/react";

export const Navbar = ({ categories, areas, setCategory, setArea }) => {
  const categoryHandler = (e) => {
    setCategory(e.target.value);
  };

  const areaHandler = (e) => {
    setArea(e.target.value);
  };
  return (
    <Box mt="10px" mb="10px" px="10px">
      <Box>
        <InputGroup flex="1" endElement={<LuSearch />}>
          <Input placeholder="Search meals" />
        </InputGroup>
      </Box>
      <Box mt="5px" mb="5px">
        <HStack wrap="wrap">
          <NativeSelect.Root onChange={categoryHandler}>
            <NativeSelect.Field placeholder="Categories">
              {categories.map((category) => (
                <option key={category.idCategory} value={category.strCategory}>
                  {category.strCategory}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <NativeSelect.Root onChange={areaHandler}>
            <NativeSelect.Field placeholder="Countries">
              {areas.map((area, index) => (
                <option key={`a${index}`} value={area.strArea}>
                  {area.strArea}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <NativeSelect.Root>
            <NativeSelect.Field placeholder="Favourites">
              <option value="1">1</option>
              <option value="1">2</option>
              <option value="1">3</option>
              <option value="1">4</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </HStack>
      </Box>
    </Box>
  );
};
