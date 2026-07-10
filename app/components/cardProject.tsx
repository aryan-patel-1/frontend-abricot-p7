import Link from "next/link";

import type { Project } from "../services/projectServices";

type CardProjectProps = {
  onEdit?: (project: Project) => void;
  project: Project;
};

function getInitials(name?: string | null) {
  if (!name) {
    return "?";
  }

  // transforme un nom complet en initiales courtes pour l'avatar
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getProgress(project: Project) {
  const completedTasks = project.completedTasks ?? 0;

  // évite une division par zéro quand un projet n'a pas encore de tâche
  if (project._count.tasks === 0) {
    return 0;
  }

  return Math.round((completedTasks / project._count.tasks) * 100);
}

export default function CardProject({ onEdit, project }: CardProjectProps) {
  const progress = getProgress(project);
  const completedTasks = project.completedTasks ?? 0;
  // regroupe le propriétaire et les membres pour afficher le total de l'équipe
  const team = [project.owner, ...project.members.map((member) => member.user)];

  return (
    <article className="relative min-h-[351px] rounded-lg border border-[var(--color-line)] bg-white transition-[border-color,box-shadow] duration-150 hover:border-[var(--color-brand)] hover:shadow-[0_10px_26px_rgba(0,0,0,0.08)] max-[520px]:min-h-[320px]">
      {onEdit ? (
        <button
          type="button"
          aria-label={`Modifier le projet ${project.name}`}
          className="absolute right-[22px] top-[22px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[var(--color-line)] bg-white text-sm leading-none text-[var(--color-muted)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
          onClick={() => onEdit(project)}
        >
          ...
        </button>
      ) : null}

      <Link
        href={`/main/projects/${project.id}`}
        className="flex min-h-[351px] flex-col px-[34px] pb-[31px] pt-[31px] text-inherit no-underline max-[520px]:min-h-[320px] max-[520px]:px-5"
      >
        <h2 className="pr-12 text-xl font-semibold leading-tight text-[var(--color-heading)]">
          {project.name}
        </h2>
        <p className="mt-[10px] max-w-[300px] text-[15px] leading-[17px] text-[var(--color-muted)]">
          {project.description}
        </p>

        <div className="mt-[58px] max-[520px]:mt-10">
          <div className="flex items-center justify-between text-sm leading-none">
            <span className="text-[var(--color-muted)]">Progression</span>
            <span className="text-[var(--color-ink)]">{progress}%</span>
          </div>
          <div className="mt-[16px] h-[6px] overflow-hidden rounded-full bg-[var(--color-line)]">
            <div
              className="h-full rounded-full bg-[var(--color-brand)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-[10px] text-[13px] leading-none text-[var(--color-muted)]">
            {completedTasks}/{project._count.tasks} tâches terminées
          </p>
        </div>

        <div className="mt-auto">
          <p className="text-[13px] leading-none text-[var(--color-muted)]">
            Équipe ({team.length})
          </p>
          <div className="mt-[14px] flex flex-wrap items-center gap-y-2">
            <span className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[13px] leading-none text-[var(--color-ink)]">
              {getInitials(project.owner.name)}
            </span>
            <span className="ml-[7px] inline-flex h-[32px] items-center justify-center rounded-full bg-[var(--color-brand-soft)] px-[16px] text-sm leading-none text-[var(--color-brand)]">
              Propriétaire
            </span>
            {/* décale légèrement les avatars des membres pour créer un groupe compact */}
            {project.members.map((member, memberIndex) => (
              <span
                key={member.id}
                className={`inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#e6e9ee] text-xs leading-none text-[var(--color-ink)] ${
                  memberIndex === 0 ? "ml-[7px]" : "-ml-[3px]"
                }`}
              >
                {getInitials(member.user.name)}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
