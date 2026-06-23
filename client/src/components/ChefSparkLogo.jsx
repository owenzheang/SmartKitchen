function ChefSparkLogo({ size = 24, strokeWidth = 2, className = "", ...props }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M15 37c-5.2 0-9-4-9-9.5 0-5.1 3.2-8.9 7.9-9.4 1.3-6 6.5-10.1 13.3-10.1h9.6c7 0 12 4.1 13.3 10.1 4.7.5 7.9 4.3 7.9 9.4 0 5.5-3.8 9.5-9 9.5H38.5l-2.9-3.3h-7.2L25.5 37H15Z" />
      <path d="M18 37v15h28V37" />
      <path d="M18 43.5c8.5-2.4 19.5-2.4 28 0" />
      <path d="M18 49.5h28" />
      <path d="M28 52v5h8v-5" />
      <path d="M32 2v6" />
      <path d="M7 10l4 2.4" />
      <path d="M3 27h5" />
      <path d="M7 44l4-2.4" />
      <path d="M57 10l-4 2.4" />
      <path d="M61 27h-5" />
      <path d="M57 44l-4-2.4" />
    </svg>
  );
}

export default ChefSparkLogo;
