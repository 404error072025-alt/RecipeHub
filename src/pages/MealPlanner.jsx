import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { readMealPlanner, writeMealPlanner } from "../services/storage";
import { useAuth } from "../context/AuthContext";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const slots = [
  { key: "breakfast", label: "Breakfast", icon: "🌅" },
  { key: "lunch", label: "Lunch", icon: "☀️" },
  { key: "dinner", label: "Dinner", icon: "🌙" }
];

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function MealPlanner() {
  const { user } = useAuth();
  const [planner, setPlanner] = useState({});
  const [weekStart, setWeekStart] = useState(getMonday());
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));

  useEffect(() => {
    setPlanner(readMealPlanner(user.id));
  }, [user.id]);

  function getMonday(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getDayDate(index) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return date;
  }

  function removeMeal(date, slot) {
    const key = toDateKey(date);
    const updated = { ...planner };

    if (updated[key]) {
      const day = { ...updated[key] };
      delete day[slot];

      if (Object.keys(day).length === 0) {
        delete updated[key];
      } else {
        updated[key] = day;
      }
    }

    setPlanner(updated);
    writeMealPlanner(user.id, updated);
  }

  const changeWeek = (amount) => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + amount * 7);
    setWeekStart(next);
    setSelectedDate(toDateKey(next));
  };

  const goToDate = (dateValue) => {
    if (!dateValue) return;

    const [year, month, day] = dateValue.split("-").map(Number);
    const date = new Date(year, month - 1, day, 12);
    setSelectedDate(dateValue);
    setWeekStart(getMonday(date));
  };

  const goToTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    goToDate(toDateKey(tomorrow));
  };

  return (
    <div className="app planner-page-app">
      <Navbar />

      <main className="container page-container">
        <div className="page-heading planner-heading">
          <div>
            <span className="eyebrow">
              WEEKLY ORGANIZER
            </span>
            <h1>Meal Planner 📅</h1>
            <p>
              Organize your breakfast, lunch and
              dinner for the week.
            </p>
          </div>

          <div className="week-controls">
            <label className="planner-date-control">
              <span>Go to date</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => goToDate(event.target.value)}
                aria-label="Choose a date to view in the meal planner"
              />
            </label>
            <button
              className="outline-button"
              onClick={goToTomorrow}
            >
              Tomorrow
            </button>
            <button
              className="outline-button"
              onClick={() => changeWeek(-1)}
            >
              ← Previous
            </button>

            <button
              className="outline-button"
              onClick={() => goToDate(toDateKey(new Date()))}
            >
              This Week
            </button>

            <button
              className="outline-button"
              onClick={() => changeWeek(1)}
            >
              Next →
            </button>
          </div>
        </div>

        <div className="planner-grid">
          {days.map((day, index) => {
            const date = getDayDate(index);
            const key = toDateKey(date);

            return (
              <div className="planner-day" key={day}>
                <div className="planner-day-header">
                  <strong>{day}</strong>
                  <span>
                    {date.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short"
                    })}
                  </span>
                </div>

                {slots.map((slot) => {
                  const meal =
                    planner[key]?.[slot.key];

                  return (
                    <div
                      className="planner-slot"
                      key={slot.key}
                    >
                      <div className="slot-title">
                        <span>
                          {slot.icon} {slot.label}
                        </span>

                        {meal && (
                          <button
                            onClick={() =>
                              removeMeal(
                                date,
                                slot.key
                              )
                            }
                            title="Remove meal"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {meal ? (
                        <Link
                          to={`/recipe/${meal.idMeal}`}
                          className="planned-meal"
                        >
                          <img
                            src={meal.strMealThumb}
                            alt={meal.strMeal}
                          />
                          <span>
                            {meal.strMeal}
                          </span>
                        </Link>
                      ) : (
                        <Link
                          to={`/?planDate=${key}&planSlot=${slot.key}`}
                          className="add-meal"
                        >
                          + Add Recipe
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="planner-tip">
          <strong>💡 How to add meals</strong>
          <p>
            Choose a date above, then use <b> "+ Add Recipe"</b>.
            On a recipe page, pick the date and meal slot before saving it.
          </p>
        </div>
      </main>
    </div>
  );
}