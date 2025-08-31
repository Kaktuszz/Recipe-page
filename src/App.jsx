import "./App.css";
import { Provider } from "./components/ui/provider";
import { Navbar } from "./components/Navbar/Navbar";
import { MainPage } from "./pages/MainPage/MainPage";
import { MealPage } from "./pages/MealPage/MealPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Provider>
      
      {/* <MealPage
        image="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        mealName="Spaghetti Boloneise"
        instructions="Put a large non-stick frying pan on a low heat. Cook the onion slowly in the oil and butter until soft but not brown – this should take about 15 mins. Add the potatoes, cover the pan and cook for a further 15-20 mins, stirring occasionally to make sure they fry evenly.\r\nWhen the potatoes are soft and the onion is shiny, crush 2 garlic cloves and stir in, followed by the beaten eggs.\r\nPut the lid back on the pan and leave the tortilla to cook gently. After 20 mins, the edges and base should be golden, the top set but the middle still a little wobbly. To turn it over, slide it onto a plate and put another plate on top, turn the whole thing over and slide it back into the pan to finish cooking. Once cooked, transfer to a plate and serve the tortilla warm or cold, scattered with the chopped parsley.\r\nTo accompany, take slices of warmed baguette, stab all over with a fork and rub with the remaining garlic, pile on grated tomatoes and season with sea salt and a drizzle of olive oil."
        category="Meat"
      /> */}
      <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/meal/:idMeal" element={<MealPage />} />
      </Routes>
      
      </Router>
    </Provider>
  );
}

export default App;
