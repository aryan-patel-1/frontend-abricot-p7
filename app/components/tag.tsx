export type TagStatus = "todo" | "progress" | "done";

type TagProps = {
  className?: string;
  status: TagStatus;
};

const tagStyles: Record<
  TagStatus,
  {
    label: string;
    className: string;
  }
> = {
  todo: {
    label: "À FAIRE",
    className: "bg-[var(--color-todo-bg)] text-[var(--color-todo-text)]",
  },
  progress: {
    label: "EN COURS",
    className: "bg-[var(--color-progress-bg)] text-[var(--color-progress-text)]",
  },
  done: {
    label: "TERMINÉE",
    className: "bg-[var(--color-done-bg)] text-[var(--color-done-text)]",
  },
};

export default function Tag({ className = "", status }: TagProps) {
  const tagStyle = tagStyles[status];

  return (
    <span
      className={`inline-flex h-[25px] min-w-[75px] items-center justify-center rounded-full px-4 text-sm leading-none ${tagStyle.className} ${className}`}
    >
      {tagStyle.label}
    </span>
  );
}
