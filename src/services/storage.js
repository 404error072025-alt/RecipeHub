function readStoredJson(key, fallback, isValid) {
  let serialized;

  try {
    serialized = localStorage.getItem(key);
  } catch (error) {
    console.error(`Unable to read "${key}" from local storage.`, error);
    return fallback;
  }

  if (serialized === null) {
    return fallback;
  }

  try {
    const value = JSON.parse(serialized);

    if (!isValid(value)) {
      console.error(`Stored data for "${key}" has an invalid format.`);
      return fallback;
    }

    return value;
  } catch (error) {
    console.error(`Unable to parse stored data for "${key}".`, error);
    return fallback;
  }
}

function isFavoriteList(value) {
  return Array.isArray(value) && value.every(
    (meal) => meal && typeof meal === "object" && typeof meal.idMeal === "string"
  );
}

function isMealPlanner(value) {
  return value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.values(value).every((day) =>
      day !== null &&
      typeof day === "object" &&
      !Array.isArray(day) &&
      Object.values(day).every(
        (meal) => meal && typeof meal === "object" && typeof meal.idMeal === "string"
      )
    );
}

function getUserStorageKey(key, userId) {
    if (userId === null || userId === undefined || userId === "") {
      throw new Error("A signed-in user is required to access saved data.");
    }

    return `${key}:user:${userId}`;
}

export function readFavoriteMeals(userId) {
    return readStoredJson(getUserStorageKey("recipeFavorites", userId), [], isFavoriteList);
}

export function writeFavoriteMeals(userId, meals) {
    localStorage.setItem(getUserStorageKey("recipeFavorites", userId), JSON.stringify(meals));
}

export function readMealPlanner(userId) {
    return readStoredJson(getUserStorageKey("mealPlanner", userId), {}, isMealPlanner);
}

export function writeMealPlanner(userId, planner) {
    localStorage.setItem(getUserStorageKey("mealPlanner", userId), JSON.stringify(planner));
}
