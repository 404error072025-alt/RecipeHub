# Recipe Finder & Meal Planner

A React mini project using TheMealDB API.

## Features
- Login and Register
- Protected routes
- Recipe search
- Category filtering
- Random recipe
- Recipe details
- Ingredients and measurements
- Cooking instructions
- YouTube recipe link
- Favorite recipes
- Weekly meal planner with date picker and week navigation
- Schedule recipes for any date and breakfast, lunch or dinner
- Remove planned meals
- Responsive design
- Django session authentication
- LocalStorage for favorites and planner data

## Run

Start the Django backend by following [README_DJANGO.md](./README_DJANGO.md), then start the frontend:

```powershell
npm install
npm run dev
```

Then open the Vite URL, normally:
http://localhost:5173

## Important
Passwords are managed by Django and are not stored in browser localStorage. Favorites and meal-planner entries remain in localStorage on this browser.
