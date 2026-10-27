import React from "react";
import { Link } from "react-router-dom";

export default function RecipeCard({
  meal,
  favorite,
  onFavorite,
  plannerDate,
  plannerSlot
}) {
  const recipeUrl = plannerDate
    ? `/recipe/${meal.idMeal}?planDate=${plannerDate}&planSlot=${plannerSlot}`
    : `/recipe/${meal.idMeal}`;

  return (
    <article className="recipe-card">
      <div className="recipe-image-wrap">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="recipe-image"
        />

        <button
          className={
            favorite
              ? "heart-button saved"
              : "heart-button"
          }
          onClick={() => onFavorite(meal)}
          aria-label="Toggle favorite"
        >
          {favorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="recipe-card-content">
        <span className="recipe-category">
          {meal.strCategory || "Recipe"}
        </span>

        <h3>{meal.strMeal}</h3>

        {meal.strArea && (
          <p className="recipe-area">
            🌍 {meal.strArea}
          </p>
        )}

        <Link
          className="view-recipe"
          to={recipeUrl}
        >
          View Recipe →
        </Link>
      </div>
    </article>
  );
}