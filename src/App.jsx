import "./App.css";
import { Provider } from "./components/ui/provider";
import { Navbar } from "./components/Navbar/Navbar";
import { MainPage } from "./pages/MainPage/MainPage";
import { MealPage } from "./pages/MealPage/MealPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import {
  mealCategories,
  mealAreas,
  randomTenMeals,
  mealsByCategory,
  mealsByArea,
  receiptByName,
  mealsByAreaAndCategory,
} from "../data/recipesFetcher";
import { useState, useEffect } from "react";
import { getMealsFromLocalStorage } from "../data/localDataFunctions";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [meals, setMeals] = useState([]);
  const [favouriteMeals, setFavouriteMeals] = useState([]);
  const [error, setError] = useState(null);

  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [favouritesUpdate, setFavouritesUpdate] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await mealCategories();
        const areasData = await mealAreas();
        const filteredAreas = areasData.filter((a) => a.strArea !== "Russian");
        setCategories(categoriesData);
        setAreas(filteredAreas);
      } catch (err) {
        setError("Failed to load initial data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      if (categories.length === 0) return;
      setIsLoading(true);
      setError(null);

      try {
        let mealData = [];

        if (searchTerm) {
          mealData = await receiptByName(searchTerm);
        } else if (category && area) {
          mealData = await mealsByAreaAndCategory(area, category);
        } else if (area) {
          mealData = await mealsByArea(area);
        } else if (category) {
          mealData = await mealsByCategory(category);
        } else {
          mealData = await randomTenMeals();
        }

        if (!mealData) {
          setError("No meals found for your selection.");
          setMeals([]);
        } else {
          setMeals(mealData);
        }
      } catch (err) {
        setError("Failed to load meals");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, [category, area, searchTerm, categories]);

  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/favourites") {
      const favs = getMealsFromLocalStorage();
      setFavouriteMeals(favs);
    }
  }, [favouritesUpdate, location.pathname]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchTerm("");
  };

  const handleAreaChange = (newArea) => {
    setArea(newArea);
    setSearchTerm("");
  };

  const handleSearchSubmit = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCategory("");
    setArea("");
  };

  const resetToRandom = () => {
    setSearchTerm("");
    setCategory("");
    setArea("");
  };

  const titleString =
    searchTerm || [area, category].filter(Boolean).join(" ") || "";

  return (
    <Provider>
      <Navbar
        categories={categories}
        areas={areas}
        category={category}
        area={area}
        onCategoryChange={handleCategoryChange}
        onAreaChange={handleAreaChange}
        onSearchSubmit={handleSearchSubmit}
        onReset={resetToRandom}
        
      />

      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              meals={meals}
              isLoading={isLoading}
              error={error}
              category={category || area}
              title={titleString}
              isFavourites={false}
            />
          }
        />

        <Route
          path="/search"
          element={
            <MainPage
              meals={meals}
              isLoading={isLoading}
              error={error}
              category={category || area}
              title={titleString}
              isFavourites={false}
            />
          }
        />

        <Route
          path="/meal/:idMeal"
          element={
            <MealPage
              setFavouritesUpdate={setFavouritesUpdate}
              favouritesUpdate={favouritesUpdate}
            />
          }
        />

        <Route
          path="/favourites"
          element={
            <MainPage
              meals={favouriteMeals}
              isLoading={false}
              error={null}
              category="Favourites"
              title="Favourites"
              isFavourites={true}
            />
          }
        />
      </Routes>
    </Provider>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
