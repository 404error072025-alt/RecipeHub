import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMealById } from "../services/mealApi";
import { useAuth } from "../context/AuthContext";
import {
  readFavoriteMeals,
  readMealPlanner,
  writeFavoriteMeals,
  writeMealPlanner
} from "../services/storage";

const mealSlots = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" }
];

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function RecipeDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const requestedDate = searchParams.get("planDate");
  const requestedSlot = searchParams.get("planSlot");

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const [planDate, setPlanDate] = useState(
    requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate)
      ? requestedDate
      : getLocalDateKey(new Date())
  );
  const [planSlot, setPlanSlot] = useState(
    mealSlots.some((slot) => slot.value === requestedSlot)
      ? requestedSlot
      : "dinner"
  );

  useEffect(() => {
    loadMeal();
  }, [id, user.id]);

  useEffect(() => {
    setPlanDate(
      requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate)
        ? requestedDate
        : getLocalDateKey(new Date())
    );
    setPlanSlot(
      mealSlots.some((slot) => slot.value === requestedSlot)
        ? requestedSlot
        : "dinner"
    );
  }, [requestedDate, requestedSlot]);

  const loadMeal = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMealById(id);

      if (!data) {
        setError("Recipe not found.");
        return;
      }

      setMeal(data);

      const favorites = readFavoriteMeals(user.id);

      setFavorite(
        favorites.some(
          (item) => item.idMeal === data.idMeal
        )
      );
    } catch {
      setError(
        "Unable to load recipe details."
      );
    } finally {
      setLoading(false);
    }
  };

  const ingredients = [];

  if (meal) {
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient?.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure?.trim() || ""
        });
      }
    }
  }

  const toggleFavorite = () => {
    if (!meal) return;

    const favorites = readFavoriteMeals(user.id);

    const exists = favorites.some(
      (item) => item.idMeal === meal.idMeal
    );

    const updated = exists
      ? favorites.filter(
          (item) => item.idMeal !== meal.idMeal
        )
      : [...favorites, meal];

    writeFavoriteMeals(user.id, updated);

    setFavorite(!exists);
  };

  const addToPlanner = () => {
    if (!meal) return;

    const planner = readMealPlanner(user.id);

    const updated = {
      ...planner,
      [planDate]: {
        ...(planner[planDate] || {}),
        [planSlot]: meal
      }
    };

    writeMealPlanner(user.id, updated);

    setAdded(true);

    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="app">
        <Navbar />
        <div className="loading large">
          <div className="spinner"></div>
          <p>Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="app">
        <Navbar />
        <main className="container">
          <div className="error-box details-error">
            <p>{error || "Recipe not found."}</p>
            <Link to="/" className="primary-button inline">
              Back to Recipes
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />

      <main className="container">
        <Link to="/" className="back-link">
          ← Back to Recipes
        </Link>

        <section className="details-card">
          <div className="details-image">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
            />
          </div>

          <div className="details-content">
            <span className="eyebrow">
              {meal.strCategory || "RECIPE"}
            </span>

            <h1>{meal.strMeal}</h1>

            <div className="meta-row">
              {meal.strArea && (
                <span>🌍 {meal.strArea}</span>
              )}

              {meal.strTags && (
                <span>🏷️ {meal.strTags}</span>
              )}
            </div>

            <div className="details-actions">
              <button
                className={
                  favorite
                    ? "primary-button saved-button"
                    : "primary-button"
                }
                onClick={toggleFavorite}
              >
                {favorite
                  ? "❤️ Saved"
                  : "🤍 Add Favorite"}
              </button>

              <button
                className="outline-button"
                onClick={addToPlanner}
              >
                {added ? "✅ Added to Planner" : "📅 Add to Planner"}
              </button>
            </div>

            <div className="planner-selection">
              <label>
                <span>Plan for</span>
                <input
                  type="date"
                  value={planDate}
                  onChange={(event) => setPlanDate(event.target.value)}
                  aria-label="Choose a date for this recipe"
                />
              </label>
              <label>
                <span>Meal</span>
                <select
                  value={planSlot}
                  onChange={(event) => setPlanSlot(event.target.value)}
                  aria-label="Choose a meal time"
                >
                  {mealSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        <section className="recipe-info-grid">
          <div className="ingredients-panel">
            <span className="eyebrow">
              INGREDIENTS
            </span>

            <h2>What You'll Need</h2>

            <div className="ingredients-list">
              {ingredients.map((item, index) => (
                <div
                  className="ingredient"
                  key={`${item.ingredient}-${index}`}
                >
                  <span>
                    {item.ingredient}
                  </span>
                  <strong>
                    {item.measure}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <div className="instructions-panel">
            <span className="eyebrow">
              INSTRUCTIONS
            </span>

            <h2>How to Prepare</h2>

            <div className="instructions">
              {meal.strInstructions
                ?.split(/\r?\n/)
                .filter(Boolean)
                .map((step, index) => (
                  <div
                    className="instruction-step"
                    key={index}
                  >
                    <div className="step-number">
                      {index + 1}
                    </div>
                    <p>{step}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {meal.strYoutube && (
          <section className="video-panel">
            <span className="eyebrow">
              VIDEO
            </span>
            <h2>Cooking Video</h2>
            <a
              href={meal.strYoutube}
              target="_blank"
              rel="noreferrer"
              className="youtube-button"
            >
              ▶ Watch on YouTube
            </a>
          </section>
        )}
      </main>
    </div>
  );
}