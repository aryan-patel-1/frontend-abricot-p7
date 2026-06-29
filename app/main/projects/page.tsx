"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

import Button from "../../components/button";
import CardProject from "../../components/cardProject";
import { mockUsers } from "../../mocks/mocksData";
import { getSavedAuthUser, type AuthUser } from "../../services/authServices";
import { isUsingMockData } from "../../services/dataProvider";
import {
  addContributor,
  createProject,
  getProjects,
  searchUsers,
  type Project,
  updateProject,
} from "../../services/projectServices";

// lit l'utilisateur sauvegardé seulement côté navigateur
function readSavedUser() {
  return getSavedAuthUser();
}

// côté serveur localStorage n'existe pas, donc on garde l'utilisateur vide
function readSavedUserOnServer() {
  return null;
}

// met à jour les projets si la session change dans un autre onglet
function watchSavedUserChanges(onUserChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onUserChange);

  return () => window.removeEventListener("storage", onUserChange);
}

function isMockAccount(user: AuthUser | null) {
  return mockUsers.some((mockUser) => mockUser.id === user?.id);
}

function getProjectContributorIds(project: Project | null) {
  return project?.members.map((member) => member.user.id) ?? [];
}

export default function ProjectsPage() {
  // garde l'état de la modale et des champs du formulaire en local
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isContributorsOpen, setIsContributorsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditContributorsOpen, setIsEditContributorsOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedContributorIds, setSelectedContributorIds] = useState<
    string[]
  >([]);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [selectedEditContributorIds, setSelectedEditContributorIds] = useState<
    string[]
  >([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [apiContributors, setApiContributors] = useState<AuthUser[]>([]);
  const [contributorsError, setContributorsError] = useState("");
  const [projectsError, setProjectsError] = useState("");
  const [formError, setFormError] = useState("");
  const [editFormError, setEditFormError] = useState("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isUpdatingProject, setIsUpdatingProject] = useState(false);

  // récupère la session sauvegardée sans casser le rendu côté serveur
  const user = useSyncExternalStore(
    watchSavedUserChanges,
    readSavedUser,
    readSavedUserOnServer
  );
  const contributors =
    isUsingMockData() || isMockAccount(user)
      ? mockUsers.filter((mockUser) => mockUser.id !== user?.id)
      : apiContributors;

  useEffect(() => {
    async function loadProjects() {
      setIsLoadingProjects(true);
      setProjectsError("");

      try {
        const data = await getProjects();
        setProjects(data.projects);
      } catch (error) {
        setProjectsError(
          error instanceof Error
            ? error.message
            : "Impossible de charger les projets."
        );
      } finally {
        setIsLoadingProjects(false);
      }
    }

    loadProjects();
  }, []);

  useEffect(() => {
    if (!isCreateModalOpen && !isEditModalOpen) {
      return;
    }

    if (isUsingMockData() || isMockAccount(user)) {
      return;
    }

    async function loadContributors() {
      setContributorsError("");

      try {
        const data = await searchUsers("co");
        setApiContributors(
          data.users.filter((apiUser) => apiUser.id !== user?.id)
        );
      } catch (error) {
        setApiContributors([]);
        setContributorsError(
          error instanceof Error
            ? error.message
            : "Impossible de charger les contributeurs."
        );
      }
    }

    loadContributors();
  }, [isCreateModalOpen, isEditModalOpen, user]);

  // active le bouton seulement quand les champs obligatoires sont remplis
  const canAddProject =
    title.trim() !== "" && description.trim() !== "" && !isCreatingProject;
  const canUpdateProject =
    editTitle.trim() !== "" &&
    editDescription.trim() !== "" &&
    !isUpdatingProject;

  function closeCreateModal() {
    setIsCreateModalOpen(false);
    setIsContributorsOpen(false);
    setFormError("");
  }

  function openEditModal(project: Project) {
    setProjectToEdit(project);
    setEditTitle(project.name);
    setEditDescription(project.description ?? "");
    setSelectedEditContributorIds(getProjectContributorIds(project));
    setEditFormError("");
    setIsEditContributorsOpen(false);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    setIsEditContributorsOpen(false);
    setProjectToEdit(null);
    setEditFormError("");
  }

  function toggleContributor(contributorId: string) {
    // ajoute ou retire un contributeur sans modifier directement l'ancien tableau
    setSelectedContributorIds((currentContributorIds) => {
      if (currentContributorIds.includes(contributorId)) {
        return currentContributorIds.filter((id) => id !== contributorId);
      }

      return [...currentContributorIds, contributorId];
    });
  }

  function toggleEditContributor(contributorId: string) {
    setSelectedEditContributorIds((currentContributorIds) => {
      if (currentContributorIds.includes(contributorId)) {
        return currentContributorIds.filter((id) => id !== contributorId);
      }

      return [...currentContributorIds, contributorId];
    });
  }

  function getContributorsLabel() {
    // affiche un texte d'aide tant qu'aucun contributeur n'est choisi
    if (selectedContributorIds.length === 0) {
      return "Choisir un ou plusieurs collaborateurs";
    }

    return contributors
      .filter((contributor) => selectedContributorIds.includes(contributor.id))
      .map((contributor) => contributor.name || contributor.email)
      .join(", ");
  }

  function getEditContributorsLabel() {
    if (selectedEditContributorIds.length === 0) {
      return "Choisir un ou plusieurs collaborateurs";
    }

    return contributors
      .filter((contributor) => selectedEditContributorIds.includes(contributor.id))
      .map((contributor) => contributor.name || contributor.email)
      .join(", ");
  }

  function resetCreateForm() {
    setTitle("");
    setDescription("");
    setSelectedContributorIds([]);
    setFormError("");
  }

  async function handleCreateProject() {
    if (!canAddProject) {
      return;
    }

    const selectedContributorEmails = contributors
      .filter((contributor) => selectedContributorIds.includes(contributor.id))
      .map((contributor) => contributor.email);

    setIsCreatingProject(true);
    setFormError("");

    try {
      const data = await createProject({
        name: title.trim(),
        description: description.trim(),
        contributors: selectedContributorEmails,
      });

      if (data.project) {
        const createdProject = data.project;
        setProjects((currentProjects) => [createdProject, ...currentProjects]);
        setProjectsError("");
        setIsLoadingProjects(false);
      }

      resetCreateForm();
      closeCreateModal();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Impossible de créer le projet."
      );
    } finally {
      setIsCreatingProject(false);
    }
  }

  async function handleUpdateProject() {
    if (!canUpdateProject || !projectToEdit) {
      return;
    }

    const currentContributorIds = getProjectContributorIds(projectToEdit);
    const contributorEmailsToAdd = contributors
      .filter(
        (contributor) =>
          selectedEditContributorIds.includes(contributor.id) &&
          !currentContributorIds.includes(contributor.id)
      )
      .map((contributor) => contributor.email);

    setIsUpdatingProject(true);
    setEditFormError("");

    try {
      const data = await updateProject(projectToEdit.id, {
        name: editTitle.trim(),
        description: editDescription.trim(),
      });

      for (const email of contributorEmailsToAdd) {
        await addContributor(projectToEdit.id, { email });
      }

      const refreshedProjects = await getProjects();
      setProjects(refreshedProjects.projects);
      setProjectToEdit(data.project);
      closeEditModal();
    } catch (error) {
      setEditFormError(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le projet."
      );
    } finally {
      setIsUpdatingProject(false);
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1408px] px-4 pb-[78px] pt-[64px] max-[760px]:px-5 max-[760px]:pt-12">
        <header className="flex items-start justify-between gap-8 max-[760px]:flex-col">
          <div>
            <h1 className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]">
              Mes projets
            </h1>
            <p className="mt-[14px] text-xl leading-tight text-[var(--color-ink)]">
              Gérez vos projets
            </p>
          </div>
          <Button
            type="button"
            className="mt-[14px] max-[760px]:mt-0"
            onClick={() => setIsCreateModalOpen(true)}
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
          <section className="mt-[65px] grid grid-cols-3 gap-x-[18px] gap-y-[19px] max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
            {projects.map((project) => (
              <CardProject
                key={project.id}
                project={project}
                onEdit={openEditModal}
              />
            ))}
          </section>
        ) : null}
      </div>

      {/* affiche la modale uniquement après le clic sur le bouton de création */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5 py-8">
          <section
            aria-modal="true"
            role="dialog"
            aria-labelledby="create-project-title"
            className="relative min-h-[616px] w-full max-w-[598px] rounded-lg bg-white px-[73px] pb-[79px] pt-[82px] shadow-[0_20px_45px_rgba(0,0,0,0.18)] max-[640px]:min-h-0 max-[640px]:px-6 max-[640px]:py-14"
          >
            <button
              type="button"
              aria-label="Fermer la modale"
              className="absolute right-[37px] top-[37px] flex h-5 w-5 cursor-pointer items-center justify-center"
              onClick={closeCreateModal}
            >
              <Image
                src="/img/cross-black.png"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
                className="block h-5 w-5"
              />
            </button>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleCreateProject();
              }}
              className="flex flex-col"
            >
              <h2
                id="create-project-title"
                className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]"
              >
                Créer un projet
              </h2>

              <label className="mt-[42px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
                Titre*
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-base text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
                />
              </label>

              <label className="mt-[26px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
                Description*
                <input
                  type="text"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-base text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
                />
              </label>

              <div className="relative mt-[26px]">
                <p className="text-sm leading-[1.2] text-[var(--color-ink)]">
                  Contributeurs
                </p>
                <button
                  type="button"
                  className="mt-[7px] flex h-[53px] w-full cursor-pointer items-center justify-between rounded border border-[var(--color-field-line)] bg-white px-4 text-left text-sm text-[var(--color-muted)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
                  onClick={() => setIsContributorsOpen(!isContributorsOpen)}
                >
                  <span className="truncate">{getContributorsLabel()}</span>
                  <span className="ml-4 h-3 w-3 rotate-45 border-b border-r border-[var(--color-ink)]" />
                </button>

                {/* ouvre la liste de contributeurs comme un menu déroulant simple */}
                {isContributorsOpen && (
                  <div className="absolute left-0 right-0 top-[82px] z-10 rounded border border-[var(--color-field-line)] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                    {contributors.map((contributor) => (
                      <label
                        key={contributor.id}
                        className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-surface-main)]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedContributorIds.includes(
                            contributor.id
                          )}
                          onChange={() => toggleContributor(contributor.id)}
                          className="h-4 w-4 accent-[var(--color-brand)]"
                        />
                        {contributor.name || contributor.email}
                      </label>
                    ))}
                    {contributors.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-[var(--color-muted)]">
                        Aucun contributeur disponible
                      </p>
                    ) : null}
                  </div>
                )}
                {contributorsError ? (
                  <p className="mt-2 text-xs text-[var(--color-error)]">
                    {contributorsError}
                  </p>
                ) : null}
              </div>

              {formError ? (
                <p className="mt-6 text-sm text-[var(--color-error)]">
                  {formError}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={!canAddProject}
                className="mt-[56px] w-[181px] bg-[#e5e7eb] text-[#9ca3af] hover:bg-[#e5e7eb] disabled:opacity-100"
              >
                {isCreatingProject ? "Ajout..." : "Ajouter un projet"}
              </Button>
            </form>
          </section>
        </div>
      )}

      {isEditModalOpen && projectToEdit ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5 py-8">
          <section
            aria-modal="true"
            role="dialog"
            aria-labelledby="edit-project-title"
            className="relative min-h-[616px] w-full max-w-[598px] rounded-lg bg-white px-[73px] pb-[79px] pt-[82px] shadow-[0_20px_45px_rgba(0,0,0,0.18)] max-[640px]:min-h-0 max-[640px]:px-6 max-[640px]:py-14"
          >
            <button
              type="button"
              aria-label="Fermer la modale"
              className="absolute right-[37px] top-[37px] flex h-5 w-5 cursor-pointer items-center justify-center"
              onClick={closeEditModal}
            >
              <Image
                src="/img/cross-black.png"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
                className="block h-5 w-5"
              />
            </button>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleUpdateProject();
              }}
              className="flex flex-col"
            >
              <h2
                id="edit-project-title"
                className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]"
              >
                Modifier un projet
              </h2>

              <label className="mt-[42px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
                Titre*
                <input
                  type="text"
                  value={editTitle}
                  disabled={isUpdatingProject}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-base text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
                />
              </label>

              <label className="mt-[26px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
                Description*
                <input
                  type="text"
                  value={editDescription}
                  disabled={isUpdatingProject}
                  onChange={(event) => setEditDescription(event.target.value)}
                  className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-base text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
                />
              </label>

              <div className="relative mt-[26px]">
                <p className="text-sm leading-[1.2] text-[var(--color-ink)]">
                  Contributeurs
                </p>
                <button
                  type="button"
                  className="mt-[7px] flex h-[53px] w-full cursor-pointer items-center justify-between rounded border border-[var(--color-field-line)] bg-white px-4 text-left text-sm text-[var(--color-muted)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
                  onClick={() =>
                    setIsEditContributorsOpen(!isEditContributorsOpen)
                  }
                >
                  <span className="truncate">{getEditContributorsLabel()}</span>
                  <span className="ml-4 h-3 w-3 rotate-45 border-b border-r border-[var(--color-ink)]" />
                </button>

                {isEditContributorsOpen ? (
                  <div className="absolute left-0 right-0 top-[82px] z-10 max-h-[220px] overflow-y-auto rounded border border-[var(--color-field-line)] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                    {contributors.map((contributor) => (
                      <label
                        key={contributor.id}
                        className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-surface-main)]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEditContributorIds.includes(
                            contributor.id
                          )}
                          disabled={isUpdatingProject}
                          onChange={() => toggleEditContributor(contributor.id)}
                          className="h-4 w-4 accent-[var(--color-brand)]"
                        />
                        {contributor.name || contributor.email}
                      </label>
                    ))}
                    {contributors.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-[var(--color-muted)]">
                        Aucun contributeur disponible
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {contributorsError ? (
                  <p className="mt-2 text-xs text-[var(--color-error)]">
                    {contributorsError}
                  </p>
                ) : null}
              </div>

              {editFormError ? (
                <p className="mt-6 text-sm text-[var(--color-error)]">
                  {editFormError}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={!canUpdateProject}
                className="mt-[56px] w-[181px]"
              >
                {isUpdatingProject ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
