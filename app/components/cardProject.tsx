import type { MockProject } from "../mocks/mocksData";

type CardProjectProps = {
  project: MockProject;
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

function getProgress(project: MockProject) {
  // évite une division par zéro quand un projet n'a pas encore de tâche
  if (project._count.tasks === 0) {
    return 0;
  }

  return Math.round((project.completedTasks / project._count.tasks) * 100);
}

export default function CardProject({ project }: CardProjectProps) {
  const progress = getProgress(project);
  // regroupe le propriétaire et les membres pour afficher le total de l'équipe
  const team = [project.owner, ...project.members.map((member) => member.user)];

  return (
    <article className="flex min-h-[351px] flex-col rounded-lg border border-[var(--color-line)] bg-white px-[34px] pb-[31px] pt-[31px]">
      <h2 className="text-xl font-semibold leading-tight text-[var(--color-heading)]">
        {project.name}
      </h2>
      <p className="mt-[10px] max-w-[300px] text-[15px] leading-[17px] text-[var(--color-muted)]">
        {project.description}
      </p>

      <div className="mt-[58px]">
        <div className="flex items-center justify-between text-xs leading-none">
          <span className="text-[var(--color-muted)]">Progression</span>
          <span className="text-[var(--color-ink)]">{progress}%</span>
        </div>
        <div className="mt-[16px] h-[6px] overflow-hidden rounded-full bg-[var(--color-line)]">
          <div
            className="h-full rounded-full bg-[var(--color-brand)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-[10px] text-[11px] leading-none text-[var(--color-muted)]">
          {project.completedTasks}/{project._count.tasks} tâches terminées
        </p>
      </div>

      <div className="mt-auto">
        <p className="text-[11px] leading-none text-[var(--color-muted)]">
          Équipe ({team.length})
        </p>
        <div className="mt-[14px] flex items-center">
          <span className="inline-flex h-[27px] w-[27px] items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[11px] leading-none text-[var(--color-ink)]">
            {getInitials(project.owner.name)}
          </span>
          <span className="ml-[7px] inline-flex h-[27px] items-center justify-center rounded-full bg-[var(--color-brand-soft)] px-[15px] text-sm leading-none text-[var(--color-brand)]">
            Propriétaire
          </span>
          {/* décale légèrement les avatars des membres pour créer un groupe compact */}
          {project.members.map((member, memberIndex) => (
            <span
              key={member.id}
              className={`inline-flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#e6e9ee] text-[10px] leading-none text-[var(--color-ink)] ${
                memberIndex === 0 ? "ml-[7px]" : "-ml-[3px]"
              }`}
            >
              {getInitials(member.user.name)}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
