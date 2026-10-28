import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { readFavoriteMeals, writeFavoriteMeals } from "../services/storage";
import { useAuth } from "../context/AuthContext";

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, [user.id]);

  const loadFavorites = () => {
    setFavorites(readFavoriteMeals(user.id));
  };

  const removeFavorite = (meal) => {
    const updated = favorites.filter(
      (item) => item.idMeal !== meal.idMeal
    );

    writeFavoriteMeals(user.id, updated);

    setFavorites(updated);
  };

  return (
    <div className="app favorites-page-app">
      <Navbar />

      <main className="container page-container">
        <div className="page-heading">
          <span className="eyebrow">
            YOUR COLLECTION
          </span>
          <h1>Favorite Recipes ❤️</h1>
          <p>
            Your saved recipes are all in one place.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <div>🍽️</div>
            <h2>No Favorite Recipes</h2>
            <p>
              Explore recipes and tap the heart icon
              to save your favorites.
            </p>
          </div>
        ) : (
          <div className="recipe-grid">
            {favorites.map((meal) => (
              <RecipeCard
                key={meal.idMeal}
                meal={meal}
                favorite
                onFavorite={removeFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}