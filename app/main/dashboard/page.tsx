type DashboardView = "list" | "kanban";
type TaskStatus = "todo" | "progress" | "done";

type Task = {
  id: number;
  status: TaskStatus;
};

const activeDashboardView: DashboardView = "list";

const tasks: Task[] = [
  { id: 1, status: "todo" },
  { id: 2, status: "progress" },
  { id: 3, status: "todo" },
  { id: 4, status: "todo" },
  { id: 5, status: "todo" },
  { id: 6, status: "todo" },
];

const kanbanColumns: {
  status: TaskStatus;
  title: string;
  count: number;
  tasks: Task[];
}[] = [
  {
    status: "todo",
    title: "À faire",
    count: 4,
    tasks: Array.from({ length: 4 }, (_, index) => ({
      id: 100 + index,
      status: "todo",
    })),
  },
  {
    status: "progress",
    title: "En cours",
    count: 4,
    tasks: Array.from({ length: 4 }, (_, index) => ({
      id: 200 + index,
      status: "progress",
    })),
  },
  {
    status: "done",
    title: "Terminées",
    count: 4,
    tasks: Array.from({ length: 4 }, (_, index) => ({
      id: 300 + index,
      status: "done",
    })),
  },
];

const statusStyles: Record<
  TaskStatus,
  {
    label: string;
    className: string;
  }
> = {
  todo: {
    label: "À faire",
    className: "bg-[#ffdede] text-[#ff3b3b]",
  },
  progress: {
    label: "En cours",
    className: "bg-[#ffe8bd] text-[#f08900]",
  },
  done: {
    label: "Terminée",
    className: "bg-[#e5fff0] text-[#18bd63]",
  },
};

function FolderIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px] flex-none text-[#9ca3af]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h4.38c.73 0 1.44.29 1.95.81L13.27 6H18.5A2.5 2.5 0 0 1 21 8.5v.75H3v-2.5Z" />
      <path d="M3.06 10.75h17.88l-2.01 6.7A3.25 3.25 0 0 1 15.82 19.75H6.18a3.25 3.25 0 0 1-3.11-2.3l-1.01-3.36a2.75 2.75 0 0 1 1-3.34Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[17px] w-[17px] flex-none text-[#6b7280]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="3.5"
        y="4.75"
        width="17"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M7.5 2.75v4M16.5 2.75v4M3.5 9.25h17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.25 13.25h.01M12 13.25h.01M15.75 13.25h.01M8.25 16.75h.01M12 16.75h.01"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[17px] w-[17px] flex-none text-[#6b7280]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M5.75 4A2.75 2.75 0 0 0 3 6.75v7.5A2.75 2.75 0 0 0 5.75 17H7.5v2.19c0 .64.72 1.02 1.25.65L12.8 17h5.45A2.75 2.75 0 0 0 21 14.25v-7.5A2.75 2.75 0 0 0 18.25 4H5.75Zm1.5 4.25h9.5a.75.75 0 0 1 0 1.5h-9.5a.75.75 0 0 1 0-1.5Zm0 4h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1 0-1.5Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px] text-[#6b7280]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="10.75"
        cy="10.75"
        r="6.25"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m15.5 15.5 4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckListIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M8.25 7h9.5M8.25 12h9.5M8.25 17h9.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="m3.75 7 1.1 1.1 2.2-2.35M3.75 12l1.1 1.1 2.2-2.35M3.75 17l1.1 1.1 2.2-2.35"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KanbanIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 3.5v3M16 3.5v3M4 9h16M8 13h2.25M13.75 13H16M8 16.25h2.25M13.75 16.25H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const statusStyle = statusStyles[status];

  return (
    <span
      className={`inline-flex h-[25px] min-w-[75px] items-center justify-center rounded-full px-4 text-sm leading-none ${statusStyle.className}`}
    >
      {statusStyle.label}
    </span>
  );
}

function TaskMeta() {
  return (
    <div className="flex flex-wrap items-center gap-x-[13px] gap-y-2 text-[13px] leading-none text-[#667085]">
      <span className="inline-flex items-center gap-[7px]">
        <FolderIcon />
        <span>Nom du projet</span>
      </span>
      <span className="h-[17px] w-px bg-[#9ca3af]" aria-hidden="true" />
      <span className="inline-flex items-center gap-[7px]">
        <CalendarIcon />
        <span>9 mars</span>
      </span>
      <span className="h-[17px] w-px bg-[#9ca3af]" aria-hidden="true" />
      <span className="inline-flex items-center gap-[7px]">
        <MessageIcon />
        <span>2</span>
      </span>
    </div>
  );
}

function TaskCard({
  status,
  variant = "list",
}: {
  status: TaskStatus;
  variant?: "list" | "kanban";
}) {
  if (variant === "kanban") {
    return (
      <article className="min-h-[229px] rounded-lg border border-[#d9dde4] bg-white px-[39px] py-[29px]">
        <div className="mb-[9px] flex items-start justify-between gap-4">
          <h3 className="text-[18px] font-semibold leading-tight text-[#111111]">
            Nom de la tâche
          </h3>
          <StatusBadge status={status} />
        </div>
        <p className="mb-[34px] text-[15px] leading-none text-[#667085]">
          Description de la tâche
        </p>
        <TaskMeta />
        <button
          type="button"
          aria-disabled="true"
          className="mt-[31px] inline-flex h-[51px] w-[121px] items-center justify-center rounded-lg border-0 bg-[#1f1f1f] text-base leading-none text-white"
        >
          Voir
        </button>
      </article>
    );
  }

  return (
    <article className="grid min-h-[162px] grid-cols-[minmax(0,1fr)_160px] items-center gap-6 rounded-lg border border-[#d9dde4] bg-white px-[39px] py-[24px] max-[700px]:grid-cols-1">
      <div>
        <h3 className="mb-[10px] text-[18px] font-semibold leading-tight text-[#111111]">
          Nom de la tâche
        </h3>
        <p className="mb-[35px] text-[15px] leading-none text-[#667085]">
          Description de la tâche
        </p>
        <TaskMeta />
      </div>
      <div className="flex h-full flex-col items-end justify-between gap-6 max-[700px]:h-auto max-[700px]:items-start">
        <StatusBadge status={status} />
        <button
          type="button"
          aria-disabled="true"
          className="inline-flex h-[51px] w-[121px] items-center justify-center rounded-lg border-0 bg-[#1f1f1f] text-base leading-none text-white"
        >
          Voir
        </button>
      </div>
    </article>
  );
}

function ViewTabs({ activeView }: { activeView: DashboardView }) {
  const baseClass =
    "inline-flex h-[45px] items-center gap-[10px] rounded-lg px-[17px] text-sm leading-none text-[#d3590b]";
  const activeClass = "bg-[#fde3d3]";
  const inactiveClass = "bg-white";

  return (
    <div className="flex flex-wrap items-center gap-[10px]">
      <button
        type="button"
        aria-pressed={activeView === "list"}
        aria-disabled="true"
        className={`${baseClass} ${
          activeView === "list" ? activeClass : inactiveClass
        }`}
      >
        <CheckListIcon />
        <span>Liste</span>
      </button>
      <button
        type="button"
        aria-pressed={activeView === "kanban"}
        aria-disabled="true"
        className={`${baseClass} ${
          activeView === "kanban" ? activeClass : inactiveClass
        }`}
      >
        <KanbanIcon />
        <span>Kanban</span>
      </button>
    </div>
  );
}

function DashboardHeader() {
  return (
    <div className="flex items-start justify-between gap-8 max-[760px]:flex-col">
      <div>
        <h1 className="text-[25px] font-semibold leading-tight text-[#222222]">
          Tableau de bord
        </h1>
        <p className="mt-[14px] text-xl leading-tight text-[#111111]">
          Bonjour Alice Dupont, voici un aperçu de vos projets et tâches
        </p>
      </div>
      <button
        type="button"
        aria-disabled="true"
        className="mt-[7px] inline-flex h-[50px] items-center justify-center rounded-lg border-0 bg-[#1f1f1f] px-[27px] text-base leading-none text-white max-[760px]:mt-0"
      >
        + Créer un projet
      </button>
    </div>
  );
}

function ListView() {
  return (
    <section className="mt-[30px] rounded-lg border border-[#d9dde4] bg-white px-[59px] py-[39px] max-[760px]:px-5">
      <div className="mb-[41px] flex items-center justify-between gap-8 max-[760px]:flex-col max-[760px]:items-start">
        <div>
          <h2 className="text-xl font-semibold leading-tight text-[#222222]">
            Mes tâches assignées
          </h2>
          <p className="mt-[10px] text-base leading-tight text-[#667085]">
            Par ordre de priorité
          </p>
        </div>
        <label className="flex h-[63px] w-full max-w-[357px] items-center justify-between rounded-lg border border-[#d9dde4] bg-white px-[31px] text-[15px] text-[#667085]">
          <span className="sr-only">Rechercher une tâche</span>
          <input
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] leading-none text-[#111111] outline-none placeholder:text-[#667085]"
            placeholder="Rechercher une tâche"
            readOnly
          />
          <SearchIcon />
        </label>
      </div>
      <div className="space-y-[17px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} status={task.status} />
        ))}
      </div>
    </section>
  );
}

function KanbanView() {
  return (
    <section className="mt-[51px] grid grid-cols-3 gap-[22px] max-[1100px]:grid-cols-1">
      {kanbanColumns.map((column) => (
        <div
          key={column.status}
          className="rounded-lg border border-[#ffd1cb] bg-white px-[23px] pb-[39px] pt-[41px]"
        >
          <div className="mb-[41px] flex items-center gap-[13px]">
            <h2 className="text-xl font-semibold leading-tight text-[#222222]">
              {column.title}
            </h2>
            <span className="inline-flex h-[25px] min-w-[40px] items-center justify-center rounded-full bg-[#e2e5eb] px-4 text-sm leading-none text-[#7a8390]">
              {column.count}
            </span>
          </div>
          <div className="space-y-4">
            {column.tasks.map((task) => (
              <TaskCard key={task.id} status={task.status} variant="kanban" />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1300px] px-[30px] pb-[57px] pt-[94px] max-[760px]:px-5 max-[760px]:pt-12">
      <DashboardHeader />
      <div className="mt-[60px]">
        <ViewTabs activeView={activeDashboardView} />
      </div>
      {activeDashboardView === "list" ? <ListView /> : <KanbanView />}
    </div>
  );
}
