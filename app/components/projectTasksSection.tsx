import Image from "next/image";

import TextInput, { InputIcon } from "./input";
import type {
  ProjectDisplayTask,
  ProjectTaskStatusFilter,
  ProjectTaskView,
} from "./projectDetailTypes";
import { statusFilterOptions } from "./projectDetailHelpers";
import ProjectTaskCard from "./projectTaskCard";

type ProjectTasksSectionProps = {
  activeTaskView: ProjectTaskView;
  commenterInitials: string;
  filteredTasks: ProjectDisplayTask[];
  isLoadingTasks: boolean;
  isStatusOpen: boolean;
  onCommentCreated: () => Promise<void>;
  onSearchTextChange: (searchText: string) => void;
  onSelectedStatusChange: (status: ProjectTaskStatusFilter) => void;
  onStatusOpenChange: (isOpen: boolean) => void;
  onTaskViewChange: (view: ProjectTaskView) => void;
  projectId: string;
  searchText: string;
  selectedStatus: ProjectTaskStatusFilter;
  tasks: ProjectDisplayTask[];
  tasksError: string;
};

const taskViewButtonClass =
  "inline-flex h-[45px] min-w-[105px] cursor-pointer items-center justify-center gap-[10px] rounded-lg px-[17px] text-center text-sm leading-none text-[var(--color-brand)] outline-none transition-colors duration-150";
const activeTaskViewButtonClass = "bg-[var(--color-brand-soft)]";
const inactiveTaskViewButtonClass = "bg-white hover:bg-[var(--color-brand-soft)]";

export default function ProjectTasksSection({
  activeTaskView,
  commenterInitials,
  filteredTasks,
  isLoadingTasks,
  isStatusOpen,
  onCommentCreated,
  onSearchTextChange,
  onSelectedStatusChange,
  onStatusOpenChange,
  onTaskViewChange,
  projectId,
  searchText,
  selectedStatus,
  tasks,
  tasksError,
}: ProjectTasksSectionProps) {
  const selectedStatusLabel =
    statusFilterOptions.find((option) => option.value === selectedStatus)?.label ??
    "Statut";

  return (
    <section className="mt-[33px] rounded-lg border border-[var(--color-line)] bg-white px-8 py-[40px] max-[760px]:px-5 max-[520px]:py-6">
      <div className="flex items-center justify-between gap-8 max-[900px]:flex-col max-[900px]:items-start">
        <div>
          <h2 className="text-xl font-semibold leading-tight text-[var(--color-heading)]">
            Tâches
          </h2>
          <p className="mt-[10px] text-base leading-tight text-[var(--color-muted)]">
            Par ordre de priorité
          </p>
        </div>

        <div className="flex items-center gap-[14px] max-[900px]:w-full max-[900px]:flex-wrap">
          <button
            type="button"
            aria-pressed={activeTaskView === "list"}
            className={`${taskViewButtonClass} ${
              activeTaskView === "list"
                ? activeTaskViewButtonClass
                : inactiveTaskViewButtonClass
            }`}
            onClick={() => onTaskViewChange("list")}
          >
            <Image
              src="/img/chips-mes-taches.svg"
              alt=""
              width={16}
              height={16}
              className="block h-4 w-4 flex-none"
            />
            Liste
          </button>
          <button
            type="button"
            aria-pressed={activeTaskView === "calendar"}
            className={`${taskViewButtonClass} ${
              activeTaskView === "calendar"
                ? activeTaskViewButtonClass
                : inactiveTaskViewButtonClass
            }`}
            onClick={() => onTaskViewChange("calendar")}
          >
            <InputIcon
              src="/img/input-icon-calendar-orange.png"
              className="h-[17px] w-[15px]"
            />
            Calendrier
          </button>
          <div className="relative max-[640px]:w-full">
            {/* garde le menu contrôlé par la page pour fermer après le choix */}
            <button
              type="button"
              aria-controls="status-filter-options"
              aria-expanded={isStatusOpen}
              className="inline-flex h-[61px] min-w-[149px] cursor-pointer items-center justify-between rounded-lg border border-[var(--color-line)] bg-white px-[31px] text-sm leading-none text-[var(--color-muted)] max-[640px]:w-full"
              onClick={() => onStatusOpenChange(!isStatusOpen)}
            >
              {selectedStatusLabel}
              <Image
                src={
                  isStatusOpen
                    ? "/img/close-collapse.svg"
                    : "/img/open-collapse.svg"
                }
                alt=""
                width={15}
                height={8}
                className="block h-2 w-[15px] flex-none"
              />
            </button>
            {isStatusOpen ? (
              <div
                id="status-filter-options"
                className="absolute left-0 top-[69px] z-10 w-full rounded-lg border border-[var(--color-line)] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                {statusFilterOptions.map((statusOption) => (
                  <button
                    key={statusOption.value}
                    type="button"
                    className={`block w-full cursor-pointer px-4 py-2 text-left text-sm leading-tight hover:bg-[var(--color-surface-main)] ${
                      selectedStatus === statusOption.value
                        ? "text-[var(--color-brand)]"
                        : "text-[var(--color-muted)]"
                    }`}
                    onClick={() => {
                      onSelectedStatusChange(statusOption.value);
                      onStatusOpenChange(false);
                    }}
                  >
                    {statusOption.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <TextInput
            iconSrc="/img/icone-recherche.svg"
            label="Rechercher une tâche"
            placeholder="Rechercher une tâche"
            type="text"
            className="h-[61px] w-[280px] max-w-none max-[640px]:w-full"
            variant="search"
            value={searchText}
            onChange={(event) => onSearchTextChange(event.target.value)}
          />
        </div>
      </div>

      {/* centralise les états de chargement et la liste filtrée */}
      <div className="mx-auto mt-[41px] flex w-full max-w-[1215px] flex-col gap-[17px]">
        {/* affiche un retour clair pendant le chargement, en erreur ou quand la liste est vide */}
        {isLoadingTasks ? (
          <p className="text-base text-[var(--color-muted)]">
            Chargement des tâches...
          </p>
        ) : null}
        {!isLoadingTasks && tasksError ? (
          <p className="text-base text-[var(--color-error-text)]">
            {tasksError}
          </p>
        ) : null}
        {!isLoadingTasks && !tasksError && tasks.length === 0 ? (
          <p className="text-base text-[var(--color-muted)]">
            Aucune tâche pour ce projet.
          </p>
        ) : null}
        {!isLoadingTasks &&
        !tasksError &&
        tasks.length > 0 &&
        filteredTasks.length === 0 ? (
          <p className="text-base text-[var(--color-muted)]">
            Aucune tâche ne correspond aux filtres.
          </p>
        ) : null}
        {!isLoadingTasks && !tasksError
          ? filteredTasks.map((task) => (
              <ProjectTaskCard
                key={task.id}
                {...task}
                commenterInitials={commenterInitials}
                projectId={projectId}
                onCommentCreated={onCommentCreated}
              />
            ))
          : null}
      </div>
    </section>
  );
}