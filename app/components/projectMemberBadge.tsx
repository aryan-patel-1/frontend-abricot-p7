import type { ProjectMember } from "./projectDetailTypes";

export default function ProjectMemberBadge({
  initials,
  name,
  role,
}: ProjectMember) {
  return (
    <span className="inline-flex min-w-0 items-center gap-[7px]">
      <span className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#e5e7eb] text-[13px] leading-none text-[var(--color-ink)]">
        {initials}
      </span>
      <span
        className={`inline-flex h-[32px] max-w-[180px] items-center truncate rounded-full px-[16px] text-[15px] leading-none ${
          role
            ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
            : "bg-[#e5e7eb] text-[var(--color-muted)]"
        }`}
      >
        {role || name}
      </span>
    </span>
  );
}
