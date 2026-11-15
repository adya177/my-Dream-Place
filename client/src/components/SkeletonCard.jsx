import PropTypes from "prop-types";

export default function SkeletonCard({ count = 1, className = "" }) {
  return Array.from({ length: Math.max(1, count) }, (_, index) => <div key={index} className={`skeleton-card ${className}`.trim()} aria-hidden="true"><div className="skeleton-block skeleton-image"/><div className="skeleton-content"><div className="skeleton-block skeleton-line short"/><div className="skeleton-block skeleton-line"/><div className="skeleton-block skeleton-line medium"/></div></div>);
}

SkeletonCard.propTypes = { count: PropTypes.number, className: PropTypes.string };
