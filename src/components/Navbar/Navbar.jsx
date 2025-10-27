import { useState, useEffect, useRef } from "react";
import {
  Box,
  Center,
  HStack,
  Tabs,
  Portal,
  Spinner,
  Span,
  Combobox,
  useListCollection,
  NativeSelect,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { FaHome, FaStar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { receiptByName } from "../../../data/recipesFetcher"; // adjust path if needed

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchTimeout = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { collection, set } = useListCollection({
    initialItems: [],
    itemToString: (item) => item.strMeal,
    itemToValue: (item) => item.strMeal,
  });

  useEffect(() => {
    if (fetchTimeout.current) clearTimeout(fetchTimeout.current);

    if (!inputValue || inputValue.trim().length < 2) {
      set([]);
      return;
    }

    fetchTimeout.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await receiptByName(inputValue);
        set(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(fetchTimeout.current);
  }, [inputValue, set]);

  useEffect(() => {
    if (location.pathname.startsWith("/meal")) return;
    if (location.pathname === "/favourites") setActiveTab("/favourites");
    else if (location.pathname === "/search") setActiveTab("/search");
    else if (location.pathname === "/" && (category || area || inputValue))
      setActiveTab("/search");
    else setActiveTab("/");
  }, [location.pathname, category, area, inputValue]);

  const categoryHandler = (e) => onCategoryChange(e.target.value);
  const areaHandler = (e) => onAreaChange(e.target.value);

  const handleEnter = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      onSearchSubmit(inputValue.trim());
      navigate("/search");
    }
  };

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
            <Tabs.Trigger value="/" px="21px" onClick={() => handleTabClick("/")}>
              <FaHome /> Main Page
            </Tabs.Trigger>
            <Tabs.Trigger value="/search" onClick={() => handleTabClick("/search")}>
              <LuSearch /> Search
            </Tabs.Trigger>
            <Tabs.Trigger value="/favourites" onClick={() => handleTabClick("/favourites")}>
              <FaStar /> Favourites
            </Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
        </Tabs.Root>
      </Center>

      {activeTab === "/search" && (
        <>
          <Box>
            <Combobox.Root
              width="100%"
              collection={collection}
              onInputValueChange={(e) => setInputValue(e.inputValue)}
              positioning={{ sameWidth: true, placement: "bottom-start" }}
            >
              <Combobox.Control>
                <Combobox.Input
                  placeholder="Search meals by name..."
                  onKeyDown={handleEnter}
                />
                <Combobox.IndicatorGroup>
                  {loading && <Spinner size="xs" />}
                  <Combobox.ClearTrigger />
                  <Combobox.Trigger />
                </Combobox.IndicatorGroup>
              </Combobox.Control>

              <Portal>
                <Combobox.Positioner>
                  <Combobox.Content minW="sm">
                    {loading ? (
                      <HStack p="2">
                        <Spinner size="xs" borderWidth="1px" />
                        <Span>Loading...</Span>
                      </HStack>
                    ) : error ? (
                      <Span p="2" color="fg.error">
                        Error fetching
                      </Span>
                    ) : collection.items?.length ? (
                      collection.items.map((meal) => (
                        <Combobox.Item key={meal.idMeal} item={meal}>
                          <HStack justify="space-between" textStyle="sm">
                            <Span fontWeight="medium" truncate>
                              {meal.strMeal}
                            </Span>
                            <Span color="fg.muted" truncate>
                              {meal.strCategory ?? ""}
                            </Span>
                          </HStack>
                          <Combobox.ItemIndicator />
                        </Combobox.Item>
                      ))
                    ) : (
                      inputValue && (
                        <Span p="2" color="fg.muted">
                          No results found
                        </Span>
                      )
                    )}
                  </Combobox.Content>
                </Combobox.Positioner>
              </Portal>
            </Combobox.Root>
          </Box>

          {/* Filters */}
          <Box mt="5px" mb="5px">
            <HStack wrap="wrap">
              <NativeSelect.Root value={category} onChange={categoryHandler}>
                <NativeSelect.Field placeholder="Categories">
                  {categories.map((category) => (
                    <option key={category.idCategory} value={category.strCategory}>
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
