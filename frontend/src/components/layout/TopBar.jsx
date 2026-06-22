import { LogOut, Menu, ShieldAlert } from 'lucide-react';
import {
  Root as DropdownRoot,
  Trigger as DropdownTrigger,
  Portal as DropdownPortal,
  Content as DropdownContent,
  Label as DropdownLabel,
  Separator as DropdownSeparator,
  Item as DropdownItem,
} from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { useAuthContext } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/lib/constants';

export function TopBar({ onMenuClick }) {
  const { user, logout } = useAuthContext();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="md:hidden">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldAlert className="h-5 w-5" />
          </span>
        </div>
      </div>

      <DropdownRoot>
        <DropdownTrigger asChild>
          <button className="flex items-center gap-2 rounded-full p-1 hover:bg-accent">
            <UserAvatar user={user} size="sm" />
            <div className="hidden text-left md:block">
              <div className="text-sm font-medium leading-tight">{user?.name}</div>
              <div className="text-[11px] text-muted-foreground leading-tight">
                {ROLE_LABELS[user?.role] ?? user?.role}
              </div>
            </div>
          </button>
        </DropdownTrigger>
        <DropdownPortal>
          <DropdownContent
            align="end"
            sideOffset={6}
            className="z-50 min-w-[200px] rounded-md border border-border bg-popover p-1 shadow-md"
          >
            <DropdownLabel className="px-3 py-2 text-sm font-semibold">
              {user?.name}
            </DropdownLabel>
            <div className="px-3 pb-2 text-xs text-muted-foreground">{user?.email}</div>
            <DropdownSeparator className="my-1 h-px bg-border" />
            <DropdownItem
              onSelect={logout}
              className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm text-destructive outline-none data-[highlighted]:bg-accent"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </DropdownItem>
          </DropdownContent>
        </DropdownPortal>
      </DropdownRoot>
    </header>
  );
}