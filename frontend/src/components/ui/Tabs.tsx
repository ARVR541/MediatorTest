import { clsx } from 'clsx';

export interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
}

export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <div className="inline-flex flex-wrap rounded-xl border border-accentDeep/20 bg-surface p-1">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={clsx(
            'focus-ring rounded-lg px-4 py-2 text-sm font-medium transition',
            value === item.key ? 'bg-accentDeep text-white' : 'text-accentDeep hover:bg-accentDeep/10',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
