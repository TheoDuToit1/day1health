const loaderLetters = ['L', 'O', 'A', 'D', 'I', 'N', 'G'];

type SiteLoaderProps = {
  overlay?: boolean;
};

export function SiteLoader({ overlay = false }: SiteLoaderProps) {
  return (
    <div className={`site-loader-shell${overlay ? ' site-loader-overlay' : ''}`} role="status" aria-label="Loading">
      <div className="site-loader-grid" aria-hidden="true">
        {loaderLetters.map((letter) => (
          <div className="site-loader-cube" key={letter}>
            <div className="site-loader-face site-loader-face-front">{letter}</div>
            <div className="site-loader-face site-loader-face-back" />
            <div className="site-loader-face site-loader-face-right" />
            <div className="site-loader-face site-loader-face-left" />
            <div className="site-loader-face site-loader-face-top" />
            <div className="site-loader-face site-loader-face-bottom" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
