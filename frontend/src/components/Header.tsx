import { Theme } from '../hooks/useTheme';
import logo from '../assets/logo.png';

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MonitorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const THEMES: { value: Theme; Icon: () => JSX.Element; label: string }[] = [
  { value: 'light', Icon: SunIcon, label: 'Claro' },
  { value: 'system', Icon: MonitorIcon, label: 'Sistema' },
  { value: 'dark', Icon: MoonIcon, label: 'Oscuro' },
];

interface Props {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export default function Header({ theme, setTheme }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#111111] shadow-nav">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo + nombre */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg shadow-card shrink-0 overflow-hidden">
            <img src={logo} alt="AmAli Scrapper" className="w-full h-full object-cover" />
          </div>
          <span className="text-[#242424] dark:text-white font-bold text-base tracking-display">
            AmAli Scrapper
          </span>
        </div>

        {/* Theme toggle */}
        <div
          className="flex items-center gap-0.5 p-1 rounded-lg bg-[#f5f5f5] dark:bg-[#1a1a1a] shadow-inset"
        >
          {THEMES.map(({ value, Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              title={label}
              className={`flex items-center justify-center w-7 h-7 rounded-md transition-all duration-150 ${
                theme === value
                  ? 'bg-white dark:bg-[#242424] text-[#242424] dark:text-white shadow-card'
                  : 'text-[#898989] hover:text-[#242424] dark:hover:text-white'
              }`}
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
