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
  InputGroup,
  Dialog,
  Button,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { FaHome, FaStar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { receiptByName } from "../../../data/recipesFetcher";
import { BreadCrumbs } from "../BreadCrumbs/BreadCrumbs";
import { AlertDialog } from "../../components/AlertDialog/AlertDialog";

export const Navbar = ({
  categories,
  areas,
  category,
  area,
  onCategoryChange,
  onAreaChange,
  onSearchSubmit,
  onReset,
  cookingMode,
  setCookingMode,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingPath, setPendingPath] = useState(null);
  const fetchTimeout = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  let pageList = [];

  if (location.pathname.startsWith("/meal")) {
    const fromLabel = location.state?.fromLabel ?? "Main Page";
    const fromPath = location.state?.fromPath ?? "/";
    const mealName = location.state?.mealName ?? "Meal";

    pageList = [
      { name: fromLabel, path: fromPath },
      { name: mealName, path: location.pathname },
    ];
  } else if (location.pathname.startsWith("/converter")) {
    if (location.state?.breadcrumbs) {
      pageList = location.state.breadcrumbs.concat({
        name: "Converter",
        path: "/converter",
      });
    } else {
      const fromLabel = location.state?.fromLabel ?? "Main Page";
      const mealName = location.state?.mealName ?? "Meal";
      pageList = [
        { name: fromLabel, path: location.state?.fromPath ?? "/" },
        { name: mealName, path: location.state?.mealPath ?? "/meal" },
        { name: "Converter", path: "/converter" },
      ];
    }
  }

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

  const categoryHandler = (e) => onCategoryChange(e.target.value);
  const areaHandler = (e) => onAreaChange(e.target.value);

  const handleEnter = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      e.stopPropagation();
      onSearchSubmit(inputValue.trim());
      navigate("/search");
    }
  };

  const handleTabClick = (tabValue) => {
    if (tabValue === "/") {
      if (cookingMode) {
        setPendingPath("/");
      } else {
        setCookingMode(false);
        onReset?.();
        navigate("/");
      }
    } else if (tabValue === "/search") {
      if (cookingMode) {
        setPendingPath("/search");
      } else {
        setCookingMode(false);
        onReset?.();
        navigate("/search");
      }
    } else if (tabValue === "/favourites") {
      if (cookingMode) {
        setPendingPath("/favourites");
      } else {
        setCookingMode(false);
        onReset?.();
        navigate("/favourites");
      }
    }
  };

  const confirmNavigation = () => {
    onReset?.();
    if (pendingPath) {
      navigate(pendingPath);
    }
    setCookingMode(false);
    setPendingPath(null);
  };

  const cancelNavigation = () => {
    setPendingPath(null);
  };

  return (
    <Box mt="10px" mb="10px" px="10px">
      <AlertDialog
        open={!!pendingPath}
        onOpenChange={(details) => !details.open && cancelNavigation()}
        title="Enabled Shopping Mode"
        bodyText="You really want to leave this page?"
        onNo={cancelNavigation}
        onYes={confirmNavigation}
      />

      <Center>
        <Tabs.Root
          variant="enclosed"
          size="md"
          mb="10px"
          value={location.pathname}
        >
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

      {location.pathname === "/search" && (
        <Center w="100%">
          <Box w="100%" maxW="1180px">
            <Box>
              <Combobox.Root
                width="100%"
                collection={collection}
                onInputValueChange={(e) => setInputValue(e.inputValue)}
                positioning={{ sameWidth: true, placement: "bottom-start" }}
              >
                <Combobox.Control>
                  <InputGroup startElement={<LuSearch />}>
                    <Combobox.Input
                      placeholder="Search meals by name..."
                      onKeyDown={handleEnter}
                    />
                  </InputGroup>
                  <Combobox.IndicatorGroup>
                    {loading && <Spinner size="xs" />}
                    <Combobox.ClearTrigger />
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
                          <Combobox.Item
                            key={meal.idMeal}
                            item={meal}
                            onClick={() =>
                              navigate(`/meal/${meal.idMeal}`, {
                                state: {
                                  fromPath: location.pathname,
                                  fromLabel:
                                    location.pathname === "/favourites"
                                      ? "Favourites"
                                      : location.pathname === "/search"
                                      ? "Search"
                                      : "Main Page",
                                  mealName: meal.strMeal,
                                },
                              })
                            }
                          >
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
          </Box>
        </Center>
      )}

      <Box w="100%">
        <Center w="100%" px="10px">
          <Box w="100%" maxW="1202px">
            {(location.pathname.startsWith("/meal") ||
              location.pathname.startsWith("/converter")) && (
              <BreadCrumbs pageList={pageList} />
            )}
          </Box>
        </Center>
      </Box>
    </Box>
  );
};
