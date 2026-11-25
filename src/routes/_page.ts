export interface TokenEntry {
  value: string;
  status: string;
  source?: string;
}

export interface Mode {
  tokens: Record<string, TokenEntry>;
}

export interface Pair {
  foreground: string;
  background: string;
  label: string;
  minimum: number;
}

export const themePairs: Pair[] = [
  { foreground: 'text', background: 'page', label: 'Body text on page', minimum: 4.5 },
  { foreground: 'text', background: 'raised', label: 'Body text on raised surface', minimum: 4.5 },
  { foreground: 'text', background: 'sunken', label: 'Body text on sunken surface', minimum: 4.5 },
  { foreground: 'text-muted', background: 'page', label: 'Muted text on page', minimum: 4.5 },
  {
    foreground: 'text-muted',
    background: 'raised',
    label: 'Muted text on raised surface',
    minimum: 4.5
  },
  { foreground: 'link', background: 'page', label: 'Link on page', minimum: 4.5 },
  { foreground: 'on-accent', background: 'accent', label: 'Button label on accent', minimum: 4.5 },
  {
    foreground: 'on-accent',
    background: 'accent-hover',
    label: 'Button label on accent hover',
    minimum: 4.5
  },
  { foreground: 'on-danger', background: 'danger', label: 'Button label on danger', minimum: 4.5 },
  { foreground: 'chrome-text', background: 'chrome', label: 'Chrome text on chrome', minimum: 4.5 },
  { foreground: 'accent-strong', background: 'page', label: 'Accent strong on page', minimum: 3 },
  { foreground: 'border', background: 'page', label: 'Border on page', minimum: 3 },
  { foreground: 'border', background: 'raised', label: 'Border on raised surface', minimum: 3 },
  { foreground: 'border', background: 'sunken', label: 'Border on sunken surface', minimum: 3 },
  { foreground: 'focus', background: 'page', label: 'Focus ring on page', minimum: 3 },
  { foreground: 'text', background: 'accent-tint', label: 'Body text on accent tint', minimum: 4.5 },
  { foreground: 'success', background: 'page', label: 'Success on page', minimum: 4.5 },
  { foreground: 'success', background: 'raised', label: 'Success on raised surface', minimum: 4.5 },
  { foreground: 'success', background: 'success-tint', label: 'Success on success tint', minimum: 4.5 },
  { foreground: 'warning', background: 'page', label: 'Warning on page', minimum: 4.5 },
  { foreground: 'warning', background: 'raised', label: 'Warning on raised surface', minimum: 4.5 },
  { foreground: 'warning', background: 'warning-tint', label: 'Warning on warning tint', minimum: 4.5 },
  { foreground: 'danger', background: 'page', label: 'Danger on page', minimum: 4.5 },
  { foreground: 'danger', background: 'raised', label: 'Danger on raised surface', minimum: 4.5 },
  { foreground: 'danger', background: 'danger-tint', label: 'Danger on danger tint', minimum: 4.5 },
  { foreground: 'info', background: 'page', label: 'Info on page', minimum: 4.5 },
  { foreground: 'info', background: 'raised', label: 'Info on raised surface', minimum: 4.5 },
  { foreground: 'info', background: 'info-tint', label: 'Info on info tint', minimum: 4.5 },
  { foreground: 'review', background: 'page', label: 'Review on page', minimum: 4.5 },
  { foreground: 'review', background: 'raised', label: 'Review on raised surface', minimum: 4.5 },
  { foreground: 'review', background: 'review-tint', label: 'Review on review tint', minimum: 4.5 }
];

const toRgb = (hex: string): [number, number, number] => {
  const clean = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((offset) => parseInt(clean.slice(offset, offset + 2), 16) / 255);
  if (r === undefined || g === undefined || b === undefined) throw new Error(`Invalid hex: ${hex}`);
  return [r, g, b];
};

const channel = (value: number): number =>
  value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

const luminance = (hex: string): number => {
  const [r, g, b] = toRgb(hex).map(channel);
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
};

export const contrastRatio = (foreground: string, background: string): number => {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05);
};

export const ratioText = (ratio: number): string => `${ratio.toFixed(2)}:1`;
