import React from "react";

const features = [
  {
    icon: "⌕",
    title: "Find your next favorite",
    description: "Search recipes and explore cuisines from around the world."
  },
  {
    icon: "♥",
    title: "Keep recipes close",
    description: "Save the meals you love in one personal collection."
  },
  {
    icon: "▦",
    title: "Plan the whole week",
    description: "Build a simple breakfast, lunch, and dinner plan."
  }
];

export default function AuthShowcase() {
  return (
    <aside className="auth-showcase">
      <div className="showcase-brand">
        <span className="showcase-brand-icon" aria-hidden="true">🍊</span>
        <span>Recipe<span className="showcase-brand-accent">Hub</span></span>
      </div>

      <p className="showcase-eyebrow">YOUR KITCHEN, A LITTLE MORE INSPIRED</p>
      <h2>Good food starts with a <span>great idea.</span></h2>
      <p className="showcase-description">
        RecipeHub brings recipe discovery and weekly meal planning together,
        so deciding what to cook feels like the best part.
      </p>

      <ul className="showcase-features">
        {features.map((feature) => (
          <li key={feature.title}>
            <span className="showcase-feature-icon" aria-hidden="true">{feature.icon}</span>
            <span>
              <strong>{feature.title}</strong>
              <span className="showcase-feature-description">{feature.description}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="showcase-note">Discover it. Save it. Make it yours.</p>
    </aside>
  );
}
