import { useState, useEffect } from "react";
import { Box, Center, HStack, Tabs } from "@chakra-ui/react";
import { Input, InputGroup } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { NativeSelect } from "@chakra-ui/react";
import { FaHome, FaStar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export const Navbar = ({
  categories,
  areas,
  category,
  area,
  onCategoryChange,
  onAreaChange,
  onSearchSubmit,
  onReset,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("/");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/meal")) return;
    if (location.pathname === "/favourites") {
      setActiveTab("/favourites");
    } else if (location.pathname === "/search") {
      setActiveTab("/search");
    } else if (location.pathname === "/" && (category || area || inputValue)) {
      setActiveTab("/search");
    } else {
      setActiveTab("/");
    }
  }, [location.pathname, category, area, inputValue]);

  const categoryHandler = (e) => onCategoryChange(e.target.value);
  const areaHandler = (e) => onAreaChange(e.target.value);

  const handleSearchChange = (e) => setInputValue(e.target.value);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSearchSubmit(inputValue.trim());
      setInputValue("");
      navigate("/search");
    }
  };

  const handleKeyDown = (e) => e.key === "Enter" && handleSubmit() && onReset();

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);

    if (tabValue === "/") {
      onReset();
      navigate("/");
    } else if (tabValue === "/search") {
      navigate("/search");
    } else if (tabValue === "/favourites") {
      navigate("/favourites");
    }
  };

  return (
    <Box mt="10px" mb="10px" px="10px">
      <Center>
        <Tabs.Root variant="enclosed" size="md" mb="10px" value={activeTab}>
          <Tabs.List>
            <Tabs.Trigger
              value="/"
              px="21px"
              onClick={() => handleTabClick("/")}
            >
              <FaHome /> Main Page
            </Tabs.Trigger>
            <Tabs.Trigger
              value="/search"
              onClick={() => handleTabClick("/search")}
            >
              <LuSearch /> Search
            </Tabs.Trigger>
            <Tabs.Trigger
              value="/favourites"
              onClick={() => handleTabClick("/favourites")}
            >
              <FaStar /> Favourites
            </Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
        </Tabs.Root>
      </Center>
      {activeTab === "/search" && (
        <>
          <Box>
            <InputGroup
              flex="1"
              endElement={<LuSearch onClick={handleSubmit} />}
            >
              <Input
                placeholder="Search meals by name"
                value={inputValue}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
          </Box>
          <Box mt="5px" mb="5px">
            <HStack wrap="wrap">
              <NativeSelect.Root value={category} onChange={categoryHandler}>
                <NativeSelect.Field placeholder="Categories">
                  {categories.map((category) => (
                    <option
                      key={category.idCategory}
                      value={category.strCategory}
                    >
                      {category.strCategory}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>

              <NativeSelect.Root value={area} onChange={areaHandler}>
                <NativeSelect.Field placeholder="Countries">
                  {areas.map((area, index) => (
                    <option key={`a${index}`} value={area.strArea}>
                      {area.strArea}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </HStack>
          </Box>
        </>
      )}
    </Box>
  );
};
