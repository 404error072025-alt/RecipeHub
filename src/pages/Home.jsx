import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import {
  getCategories,
  getMealsByCategory,
  getRandomMeal,
  searchMeals
} from "../services/mealApi";
import { readFavoriteMeals, writeFavoriteMeals } from "../services/storage";
import { useAuth } from "../context/AuthContext";

const defaultCategories = ["Chicken", "Beef", "Dessert", "Vegetarian", "Pasta", "Seafood", "Breakfast", "Vegan"];

export default function Home() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [categoryImages, setCategoryImages] = useState({});
  const [activeCategory, setActiveCategory] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const categoryTrackRef = useRef(null);

  useEffect(() => {
    loadCategories();
    handleRandom();
  }, []);

  useEffect(() => {
    setFavorites(readFavoriteMeals(user.id));
  }, [user.id]);

  useEffect(() => {
    if (!categories.length || !categoryTrackRef.current) return;

    const track = categoryTrackRef.current;
    const firstGroup = track.firstElementChild;
    const secondGroup = track.lastElementChild;

    if (!firstGroup || !secondGroup) return;

    const totalWidth = firstGroup.scrollWidth + secondGroup.scrollWidth;
    const halfWidth = totalWidth / 2;
    let offset = 0;
    let lastTime = 0;
    let animationFrameId;

    const animate = (time) => {
      if (!lastTime) {
        lastTime = time;
      }

      const delta = time - lastTime;
      offset -= delta * 0.08;

      if (Math.abs(offset) >= halfWidth) {
        offset = 0;
      }

      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      lastTime = time;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [categories.length]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();

      if (data.length) {
        setCategories(data.map((item) => item.strCategory));
        setCategoryImages(
          Object.fromEntries(data.map((item) => [item.strCategory, item.strCategoryThumb]))
        );
      }
    } catch {
      // Keep built-in categories if API fails.
    }
  };

  const handleSearch = async (event) => {
    event?.preventDefault();

    if (!query.trim()) {
      handleRandom();
      return;
    }

    try {
      setLoading(true);
      setError("");
      setActiveCategory("");

      const result = await searchMeals(query.trim());
      setMeals(result);

      if (!result.length) {
        setError(
          `No recipes found for "${query}".`
        );
      }
    } catch (err) {
      setError(
        "Unable to search recipes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCategory = async (category) => {
    if (category === activeCategory) return;

    try {
      setLoading(true);
      setError("");
      setActiveCategory(category);
      setQuery("");

      const result =
        await getMealsByCategory(category);

      setMeals(result);
    } catch {
      setError(
        "Unable to load this category."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRandom = async () => {
    try {
      setLoading(true);
      setError("");
      setActiveCategory("");

      const meal = await getRandomMeal();

      setMeals(meal ? [meal] : []);
    } catch {
      setError(
        "Unable to load a random recipe."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (meal) => {
    const exists = favorites.some(
      (item) => item.idMeal === meal.idMeal
    );

    const updated = exists
      ? favorites.filter(
          (item) => item.idMeal !== meal.idMeal
        )
      : [...favorites, meal];

    setFavorites(updated);

    writeFavoriteMeals(user.id, updated);
  };

  const favoriteIds = new Set(favorites.map((item) => item.idMeal));
  const plannerDate = searchParams.get("planDate");
  const plannerSlot = searchParams.get("planSlot");

  return (
    <div className="app">
      <Navbar />

      <main className="home-main">
        <section className="hero-section">
          <div className="container hero-content">
            <span className="eyebrow">
              THEMEALDB RECIPE COLLECTION
            </span>

            <h1>
              Find Your Next
              <span> Delicious Meal</span>
            </h1>

            <p>
              Search thousands of recipes, explore
              ingredients, save favorites, and plan
              your meals for the week.
            </p>

            <form
              className="search-box"
              onSubmit={handleSearch}
            >
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search recipes... e.g. chicken"
              />

              <button>
                <span aria-hidden="true">🔎</span> Search
              </button>
            </form>
          </div>
        </section>

        <section className="category-bar container">
          <div className="section-title-row">
            <div>
              <span className="eyebrow">
                EXPLORE
              </span>
              <h2>Recipe Categories</h2>
            </div>

            <button
              className="outline-button"
              onClick={handleRandom}
            >
              <span aria-hidden="true">🎲</span> Random Recipe
            </button>
          </div>

          <div className="category-cards" role="region" aria-label="Recipe categories">
            <div className="category-track" ref={categoryTrackRef}>
              <div className="category-group">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-card ${
                      activeCategory === category
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleCategory(category)}
                  >
                    {categoryImages[category] ? (
                      <img src={categoryImages[category]} alt="" />
                    ) : (
                      <span className="category-image-fallback" aria-hidden="true">🍽️</span>
                    )}
                    <span>{category}</span>
                  </button>
                ))}
              </div>
              <div className="category-group" aria-hidden="true">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-card ${
                      activeCategory === category
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleCategory(category)}
                    tabIndex={-1}
                  >
                    {categoryImages[category] ? (
                      <img src={categoryImages[category]} alt="" />
                    ) : (
                      <span className="category-image-fallback" aria-hidden="true">🍽️</span>
                    )}
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="recipes-section container">
          <div className="section-title-row">
            <div>
              <span className="eyebrow">
                RECIPES
              </span>
              <h2>
                {activeCategory
                  ? `${activeCategory} Recipes`
                  : query
                  ? `Results for "${query}"`
                  : "Featured Recipe"}
              </h2>
            </div>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Finding delicious recipes...</p>
            </div>
          )}

          {!loading && error && (
            <div className="error-box">
              <p>{error}</p>
              <button onClick={handleRandom}>
                Try Random Recipe
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            meals.length > 0 && (
              <div className="recipe-grid">
                {meals.map((meal) => (
                  <RecipeCard
                    key={meal.idMeal}
                    meal={meal}
                    favorite={favoriteIds.has(
                      meal.idMeal
                    )}
                    onFavorite={toggleFavorite}
                    plannerDate={plannerDate}
                    plannerSlot={plannerSlot}
                  />
                ))}
              </div>
            )}
        </section>
      </main>

      <footer>
        © 2026 RecipeHub • Built with React &
        TheMealDB
      </footer>
    </div>
  );
}