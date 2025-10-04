import { Search, Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ThemeToggle } from "./ThemeToggle";

export function AdminTopbar() {
  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left: Logo (Mobile) */}
      <div className="flex items-center gap-4 flex-1">
        <div className="lg:hidden">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white">AD</span>
          </div>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents, users, delegations..."
            className="pl-10 bg-muted border-0"
          />
        </div>
      </div>

      {/* Right: Theme, Notifications & User */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-3">
              <div className="flex flex-col gap-1">
                <p>New translation request submitted</p>
                <span className="text-muted-foreground">2 minutes ago</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3">
              <div className="flex flex-col gap-1">
                <p>Delegation approved: EU Partnership</p>
                <span className="text-muted-foreground">1 hour ago</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3">
              <div className="flex flex-col gap-1">
                <p>Document signed: Agreement 2025-001</p>
                <span className="text-muted-foreground">3 hours ago</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt="Admin User" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AU
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@system.com</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}