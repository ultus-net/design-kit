export interface ComboboxOption {
  value: string;
  label: string;
}

export function filterOptions(options: ComboboxOption[], query: string): ComboboxOption[] {
  const needle = query.trim().toLowerCase();

  if (!needle) return options;

  return options.filter((option) => option.label.toLowerCase().includes(needle));
}

export function stepIndex(index: number, length: number, delta: number): number {
  if (length === 0) return -1;
  if (index < 0) return delta > 0 ? 0 : length - 1;

  return (index + delta + length) % length;
}
