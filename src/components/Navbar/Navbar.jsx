import { Box, Button, HStack } from "@chakra-ui/react";
import { Input, InputGroup } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

export const Navbar = () => {
  return (
    <Box mt="10px" mb="10px"  px="10px">
      <Box>
        <InputGroup flex="1" endElement={<LuSearch />}>
          <Input placeholder="Search meals" />
        </InputGroup>
      </Box>
      <Box mt="5px" mb="5px">
        <HStack  wrap="wrap">
          <Button size="xs" variant="ghost">Categories</Button>
          <Button size="xs"  variant="ghost">Countries</Button>
          <Button size="xs"  variant="ghost">Favourites</Button>
        </HStack>
      </Box>
      </Box>
  );
};
