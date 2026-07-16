import { motion } from "motion/react";
import { Bookmark, Sparkles } from "lucide-react";
import { getCuisinePlaceholder } from "../utils/recipeVisuals.js";

function RecipePlaceholderHeader({
  title,
  cuisine,
  matchScore = null,
  savedLabel = "",
  variant = "card",
  showTitle = false,
  isSaved = false,
  isPending = false,
  onToggleSave = null
}) {
  const placeholderSrc = getCuisinePlaceholder(cuisine);
  const hasMatchScore = Number.isFinite(matchScore);
  const bookmarkLabel = isPending
    ? isSaved
      ? `Removing ${title} from saved recipes`
      : `Saving ${title}`
    : isSaved
      ? `Remove ${title} from saved recipes`
      : `Save ${title}`;

  return (
    <div
      className={`recipe-placeholder recipe-placeholder-${variant}`}
      aria-label={`${cuisine || "Chinese"} cuisine placeholder for ${title}`}
    >
      <img
        className="recipe-placeholder-image"
        src={placeholderSrc}
        alt=""
        aria-hidden="true"
        onError={(event) => {
          const fallbackSrc = getCuisinePlaceholder();

          if (!event.currentTarget.src.endsWith(fallbackSrc)) {
            event.currentTarget.src = fallbackSrc;
          }
        }}
      />
      <span className="recipe-cuisine-label">{cuisine || "Chinese"}</span>

      {hasMatchScore && (
        <span className="recipe-match-badge">
          <Sparkles size={12} strokeWidth={2.2} aria-hidden="true" />
          {matchScore}% match
        </span>
      )}

      {savedLabel && <span className="saved-date-badge">{savedLabel}</span>}

      {onToggleSave && (
        <motion.button
          type="button"
          className={isSaved ? "recipe-save-icon saved" : "recipe-save-icon"}
          aria-label={bookmarkLabel}
          aria-pressed={isSaved}
          title={bookmarkLabel}
          onClick={onToggleSave}
          disabled={isPending}
          whileTap={isPending ? undefined : { scale: 0.9 }}
        >
          <Bookmark
            size={18}
            strokeWidth={2}
            fill={isSaved ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </motion.button>
      )}

      {showTitle && (
        <div className="recipe-placeholder-title">
          <h3>{title}</h3>
        </div>
      )}

    </div>
  );
}

export default RecipePlaceholderHeader;
