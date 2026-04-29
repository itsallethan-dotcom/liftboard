type AvatarProps = {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
};

const sizeMap: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function Avatar({ name, avatarUrl, size = "md" }: AvatarProps) {
  const initials = getInitials(name);
  const sizeClass = sizeMap[size];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${name} avatar`}
        className={`${sizeClass} rounded-full border border-slate-500 object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-full border border-slate-500 bg-slate-800 font-semibold text-slate-100`}
      aria-label={`${name} avatar placeholder`}
      title={name}
    >
      {initials}
    </div>
  );
}
