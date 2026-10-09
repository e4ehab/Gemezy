"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  useSuspenseProfile,
  useUpdateProfileName,
} from '@/features/profile/hooks/use-profile';
import {
  CalendarDaysIcon,
  CheckIcon,
  CopyIcon,
  KeyRoundIcon,
  MailIcon,
  MessageCircleIcon,
  UserRoundIcon,
} from 'lucide-react';
import { toast } from '@/components/ui/toast';

export function Profile() {
  const { data: profile } = useSuspenseProfile();
  const updateName = useUpdateProfileName();
  const [name, setName] = useState(profile.name);
  const initials = profile.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const createdAt = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long',
  }).format(profile.createdAt);
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `My Gemezy id: ->>>>             ${profile.publicId}`,
  )}`;

  const copyAccountId = async () => {
    await navigator.clipboard.writeText(profile.publicId);
    toast.success('Account ID copied');
  };

  const saveName = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedName = name.trim();

    if (updatedName.length < 2 || updatedName === profile.name) return;

    updateName.mutate(
      { name: updatedName },
      {
        onSuccess: ({ name: savedName }) => {
          setName(savedName);
          toast.success('Name updated');
        },
        onError: () => toast.error('Could not update your name'),
      },
    );
  };

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 p-6 md:p-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Account</p>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Your personal and account details.</p>
      </header>

      <section className="rounded-lg border bg-card p-6 text-card-foreground">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar className="size-20 border border-border">
            <AvatarImage src={profile.image ?? undefined} alt={profile.name} />
            <AvatarFallback className="text-xl font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="truncate text-2xl font-semibold">{profile.name}</h2>
            <p className="truncate text-muted-foreground">{profile.email}</p>
          </div>
          <Badge variant={profile.emailVerified ? 'default' : 'secondary'}>
            {profile.emailVerified ? <><CheckIcon /> Verified email</> : 'Email not verified'}
          </Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Account details</h2>
        <div className="divide-y rounded-lg border bg-card text-card-foreground">
          <form onSubmit={saveName} className="flex flex-wrap items-end gap-3 p-4">
            <UserRoundIcon className="mb-1 size-5 text-muted-foreground" />
            <div className="min-w-48 flex-1 space-y-1.5">
              <label htmlFor="profile-name" className="text-sm text-muted-foreground">
                Display name
              </label>
              <input
                id="profile-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={100}
                required
                minLength={2}
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                disabled={updateName.isPending}
                className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Button
              type="submit"
              disabled={updateName.isPending || name.trim().length < 2 || name.trim() === profile.name}
            >
              {updateName.isPending ? 'Saving...' : 'Save name'}
            </Button>
          </form>
          <div className="flex flex-wrap items-center gap-3 p-4">
            <KeyRoundIcon className="size-5 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">Gemezy account ID</p>
              <p className="font-mono font-medium">{profile.publicId}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Copy account ID"
              aria-label="Copy account ID"
              onClick={copyAccountId}
            >
              <CopyIcon />
            </Button>
            <a
              className={buttonVariants({ variant: 'outline' })}
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircleIcon />
              Share on WhatsApp
            </a>
          </div>
          <div className="flex items-center gap-3 p-4">
            <MailIcon className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email address</p>
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <CalendarDaysIcon className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Member since</p>
              <p className="font-medium">{createdAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <KeyRoundIcon className="size-5 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Sign-in methods</p>
              <p className="font-medium">
                {profile.accounts
                  .map(({ providerId }) => providerId === 'credential' ? 'Email and password' : providerId)
                  .join(', ') || 'No sign-in method available'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}