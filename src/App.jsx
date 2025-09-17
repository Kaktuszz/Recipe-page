import "./App.css";
import { Provider } from "./components/ui/provider";
import { Navbar } from "./components/Navbar/Navbar";
import { MainPage } from "./pages/MainPage/MainPage";
import { MealPage } from "./pages/MealPage/MealPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { mealCategories, mealAreas, randomTenMeals } from "../data/recipesFetcher";
import { useState, useEffect } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const categoriesData = await mealCategories();
        const areasData = await mealAreas();
        const randomMeals = await randomTenMeals();
        const filteredAreas = areasData.filter((area) => area.strArea !== "Russian");
        setCategories(categoriesData);
        setAreas(filteredAreas);
        setMeals(randomMeals);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <Provider>
      <Router>
        <Navbar categories={categories} areas={areas} />
        <Routes>
          <Route path="/" element={<MainPage meals={meals} isLoading={isLoading} error={error} />} />
          <Route path="/meal/:idMeal" element={<MealPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
