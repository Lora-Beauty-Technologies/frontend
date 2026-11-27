const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const MenuIcon = () => (<svg {...base}><path d="M4 6h16M4 12h16M4 18h16" /></svg>);
export const CloseIcon = () => (<svg {...base} width={14} height={14}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const BackIcon = () => (<svg {...base}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
export const ChevronIcon = () => (<svg {...base} width={18} height={18}><path d="M9 6l6 6-6 6" /></svg>);
export const CheckIcon = () => (<svg {...base} width={16} height={16}><path d="M5 12l5 5 9-10" /></svg>);
export const LockIcon = () => (<svg {...base} width={16} height={16}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>);
