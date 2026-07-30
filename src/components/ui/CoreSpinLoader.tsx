import { useEffect, useState } from 'react';
import './CoreSpinLoader.css';

const LOADING_STATES = [
  'Initializing',
  'Fetching Data..',
];

type CoreSpinLoaderProps = {
  fullscreen?: boolean;
  panel?: boolean;
  label?: string;
};

export function CoreSpinLoader({ fullscreen = false, panel = false, label }: CoreSpinLoaderProps) {
  const [loadingText, setLoadingText] = useState(LOADING_STATES[0]);

  useEffect(() => {
    if (label) return undefined;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_STATES.length;
      setLoadingText(LOADING_STATES[i]);
    }, 1000);
    return () => clearInterval(interval);
  }, [label]);

  const className = [
    'core-spin-loader',
    fullscreen ? 'core-spin-loader--fullscreen' : '',
    panel ? 'core-spin-loader--panel' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={className}
      role="status"
      aria-live="polite"
      aria-label={label || loadingText}
    >
      <div className="core-spin-loader__orbit">
        <div className="core-spin-loader__glow" />
        <div className="core-spin-loader__ring-dashed" />
        <div className="core-spin-loader__ring-main" />
        <div className="core-spin-loader__ring-reverse" />
        <div className="core-spin-loader__ring-inner" />
        <div className="core-spin-loader__dot-orbit">
          <div className="core-spin-loader__dot" />
        </div>
        <div className="core-spin-loader__dot-orbit core-spin-loader__dot-orbit--teal">
          <div className="core-spin-loader__dot core-spin-loader__dot--teal" />
        </div>
        <div className="core-spin-loader__core" />
      </div>
      <div className="core-spin-loader__text-wrap">
        <span key={label || loadingText} className="core-spin-loader__text">
          {label || loadingText}
        </span>
      </div>
    </div>
  );
}
