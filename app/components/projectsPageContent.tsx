"use client";

import CardProject from "./cardProject";
import Button from "./button";
import type { Project } from "../services/projectServices";

// ce composant affiche l'en-tête et la grille des projets
type ProjectsPageContentProps = {
  isLoadingProjects: boolean;
  projects: Project[];
  projectsError: string;
  onCreateProject: () => void;
  onEditProject: (project: Project) => void;
};

export default function ProjectsPageContent({
  isLoadingProjects,
  projects,
  projectsError,
  onCreateProject,
  onEditProject,
}: ProjectsPageContentProps) {
  return (
    <div className="mx-auto w-full max-w-[1408px] px-4 pb-[78px] pt-[64px] max-[900px]:px-5 max-[900px]:pt-10 max-[520px]:pb-10">
      <header className="flex items-start justify-between gap-8 max-[900px]:flex-col max-[900px]:gap-5">
        <div>
          <h1 className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]">
            Mes projets
          </h1>
          <p className="mt-[14px] text-xl leading-tight text-[var(--color-ink)] max-[520px]:text-base">
            Gérez vos projets
          </p>
        </div>
        <Button
          type="button"
          className="mt-[14px] max-[900px]:mt-0 max-[520px]:w-full"
          onClick={onCreateProject}
        >
          + Créer un projet
        </Button>
      </header>

      {projectsError ? (
        <p className="mt-[65px] rounded border border-[var(--color-error-border)] bg-white px-5 py-4 text-sm text-[var(--color-error)]">
          {projectsError}
        </p>
      ) : null}

      {isLoadingProjects ? (
        <p className="mt-[65px] text-sm text-[var(--color-muted)]">
          Chargement des projets...
        </p>
      ) : null}

      {!isLoadingProjects && !projectsError && projects.length === 0 ? (
        <p className="mt-[65px] text-sm text-[var(--color-muted)]">
          Aucun projet pour le moment.
        </p>
      ) : null}

      {!isLoadingProjects && !projectsError && projects.length > 0 ? (
        <section className="mt-[65px] grid grid-cols-3 gap-x-[18px] gap-y-[19px] max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1 max-[520px]:mt-10">
          {projects.map((project) => (
            <CardProject
              key={project.id}
              project={project}
              onEdit={onEditProject}
            />
          ))}
        </section>
      ) : null}
    </div>
  );
}
