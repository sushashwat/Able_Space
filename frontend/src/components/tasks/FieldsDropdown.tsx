'use client';

import { Settings2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface FieldsDropdownProps {
  fields: Record<string, boolean>;
  onChange: (key: string, value: boolean) => void;
  labels: Record<string, string>;
}

export function FieldsDropdown({ fields, onChange, labels }: FieldsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent">
        <Settings2 className="h-4 w-4" />
        Fields
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(labels).map(([key, label]) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={fields[key]}
            onCheckedChange={(v) => onChange(key, !!v)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}