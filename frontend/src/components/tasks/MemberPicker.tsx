'use client';

import { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAllUsers } from '@/lib/api/users';
import type { UserSummary } from '@/lib/types/user';
import { getAvatarUrl } from '@/lib/utils';
interface MembersPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function MembersPicker({ selectedIds, onChange }: MembersPickerProps) {
  const [users, setUsers] = useState<UserSummary[]>([]);

  useEffect(() => {
    getAllUsers().then(setUsers).catch(() => {});
  }, []);

  const selectedUsers = users.filter((u) => selectedIds.includes(u._id));

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <Popover>
      <PopoverTrigger className="flex flex-wrap items-center gap-1 rounded-md border px-2 py-1.5 text-sm hover:bg-accent w-full text-left">
        {selectedUsers.length > 0 ? (
          <div className="flex -space-x-2">
            {selectedUsers.slice(0, 4).map((u) => (
              <Avatar key={u._id} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={u.avatarUrl || getAvatarUrl(u._id)} />
                <AvatarFallback className="text-xs">
                  {u.fullName?.[0]?.toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">Add members</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="max-h-64 overflow-y-auto space-y-1">
          {users.map((u) => (
            <label
              key={u._id}
              className="flex items-center gap-2 rounded-md p-1.5 text-sm hover:bg-accent cursor-pointer"
            >
              <Checkbox
                checked={selectedIds.includes(u._id)}
                onCheckedChange={() => toggle(u._id)}
              />
              <Avatar className="h-6 w-6">
                <AvatarImage src={u.avatarUrl || getAvatarUrl(u._id)} />
                <AvatarFallback className="text-xs">
                  {u.fullName?.[0]?.toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{u.fullName}</span>
            </label>
          ))}
          {users.length === 0 && (
            <p className="text-xs text-muted-foreground p-2">No users found.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}