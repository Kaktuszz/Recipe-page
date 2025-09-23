import "./App.css";
import { Provider } from "./components/ui/provider";
import { Navbar } from "./components/Navbar/Navbar";
import { MainPage } from "./pages/MainPage/MainPage";
import { MealPage } from "./pages/MealPage/MealPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  mealCategories,
  mealAreas,
  randomTenMeals,
  mealsByCategory
} from "../data/recipesFetcher";
import { useState, useEffect } from "react";
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if(categories.length == 0){
          const categoriesData = await mealCategories();
          const areasData = await mealAreas();
          const filteredAreas = areasData.filter(
            (area) => area.strArea !== "Russian"
          );
          setCategories(categoriesData);
          setAreas(filteredAreas);
        }
        
        if(category == ""){
          const randomMeals = await randomTenMeals();
          setMeals(randomMeals);
        }else{
          const filteredMeals = await mealsByCategory(category);
          setMeals(filteredMeals);
        }

      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    
      fetchData();
 
    
  }, [category, area]);
  return (
    <Provider>
      <Router>
        <Navbar categories={categories} areas={areas} setCategory={setCategory} setArea={setArea} />
        <Routes>
          <Route
            path="/"
            element={
              <MainPage meals={meals} isLoading={isLoading} error={error} category={category} />
            }
          />
          <Route path="/meal/:idMeal" element={<MealPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
