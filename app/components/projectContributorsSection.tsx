import type { ProjectMember } from "./projectDetailTypes";
import ProjectMemberBadge from "./projectMemberBadge";

type ProjectContributorsSectionProps = {
  members: ProjectMember[];
  peopleCount: number;
};

function getPeopleLabel(peopleCount: number) {
  return peopleCount <= 1
    ? `${peopleCount} personne`
    : `${peopleCount} personnes`;
}

export default function ProjectContributorsSection({
  members,
  peopleCount,
}: ProjectContributorsSectionProps) {
  return (
    <section className="mt-[50px] flex min-h-[66px] items-center justify-between gap-6 rounded-lg bg-[#f3f4f6] px-8 py-5 max-[900px]:flex-col max-[900px]:items-start max-[640px]:px-5 max-[520px]:mt-8">
      <div className="flex flex-wrap items-baseline gap-[10px]">
        <h2 className="text-xl font-semibold leading-tight text-[var(--color-heading)]">
          Contributeurs
        </h2>
        <span className="text-base leading-tight text-[var(--color-muted)]">
          {getPeopleLabel(peopleCount)}
        </span>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-[9px]">
        {/* affiche les badges déjà préparés par le helper de la page projet */}
        {members.map((member, memberIndex) => (
          <ProjectMemberBadge
            key={`${member.name}-${memberIndex}`}
            initials={member.initials}
            name={member.name}
            role={member.role}
          />
        ))}
      </div>
    </section>
  );
}