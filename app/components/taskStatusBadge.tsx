export type TaskStatus = "todo" | "progress" | "done";

const statusStyles: Record<
  TaskStatus,
  {
    label: string;
    className: string;
  }
> = {
  todo: {
    label: "À faire",
    className: "bg-[var(--color-todo-bg)] text-[var(--color-todo-text)]",
  },
  progress: {
    label: "En cours",
    className: "bg-[var(--color-progress-bg)] text-[var(--color-progress-text)]",
  },
  done: {
    label: "Terminée",
    className: "bg-[var(--color-done-bg)] text-[var(--color-done-text)]",
  },
};

export default function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const statusStyle = statusStyles[status];

  return (
    <span
      className={`inline-flex h-[28px] items-center rounded-full px-4 text-[15px] leading-none ${statusStyle.className}`}
    >
      {statusStyle.label}
    </span>
  );
}
