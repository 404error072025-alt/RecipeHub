const API_URL = "https://www.themealdb.com/api/json/v1/1";

async function request(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TheMealDB request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data) {
    throw new Error("Invalid API response.");
  }

  return data;
}

export async function searchMeals(query) {
  const data = await request(
    `${API_URL}/search.php?s=${encodeURIComponent(query)}`
  );

  return data.meals || [];
}

export async function getMealById(id) {
  const data = await request(
    `${API_URL}/lookup.php?i=${encodeURIComponent(id)}`
  );

  return data.meals?.[0] || null;
}

export async function getMealsByCategory(category) {
  const data = await request(
    `${API_URL}/filter.php?c=${encodeURIComponent(category)}`
  );

  return data.meals || [];
}

export async function getCategories() {
  const data = await request(`${API_URL}/categories.php`);
  return data.categories || [];
}

export async function getRandomMeal() {
  const data = await request(`${API_URL}/random.php`);
  return data.meals?.[0] || null;
}