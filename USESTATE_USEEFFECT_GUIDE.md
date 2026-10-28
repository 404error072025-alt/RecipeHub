# useState + useEffect + Django Authentication

The project uses `useState` for form values, loading/error state, recipe state, favorites and planner state.

`useEffect` is used for initial authentication checks, API-related side effects, and existing LocalStorage synchronization.

Login and registration are handled by Django through `/api/auth/login/` and `/api/auth/register/`. The browser no longer stores the user's password in LocalStorage.
