"use client";

import { useEffect, useState } from "react";

import ProjectsPageContent from "../../components/projectsPageContent";
import ProjectsPageModals from "../../components/projectsPageModals";
import useProjectContributors from "../../components/useProjectContributors";
import useSavedAuthUser from "../../components/useSavedAuthUser";
import {
  addContributor,
  createProject,
  deleteProject,
  getProjects,
  type Project,
  updateProject,
} from "../../services/projectServices";

// extrait les membres déjà associés pour initialiser la modale de modification
function getProjectContributorIds(project: Project | null) {
  return project?.members.map((member) => member.user.id) ?? [];
}

export default function ProjectsPage() {
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
  const [projectsError, setProjectsError] = useState("");
  const [formError, setFormError] = useState("");
  const [editFormError, setEditFormError] = useState("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isUpdatingProject, setIsUpdatingProject] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const user = useSavedAuthUser();
  const { contributors, contributorsError } = useProjectContributors(
    user,
    isCreateModalOpen || isEditModalOpen
  );
  const canAddProject =
    title.trim() !== "" && description.trim() !== "" && !isCreatingProject;
  const canUpdateProject =
    editTitle.trim() !== "" &&
    editDescription.trim() !== "" &&
    !isUpdatingProject;
  const canDeleteProject = projectToEdit?.userRole === "ADMIN" && !isDeletingProject;

  useEffect(() => {
    async function loadProjects() {
      setIsLoadingProjects(true);
      setProjectsError("");

      try {
        const data = await getProjects();
        setProjects(data.projects);
      } catch (error) {
        console.error("Impossible de charger les projets.", error);
        setProjectsError("Impossible de charger les projets. Veuillez réessayer.");
      } finally {
        setIsLoadingProjects(false);
      }
    }

    loadProjects();
  }, []);

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
    setIsDeletingProject(false);
  }

  function toggleContributor(contributorId: string) {
    setSelectedContributorIds((currentContributorIds) =>
      currentContributorIds.includes(contributorId)
        ? currentContributorIds.filter((id) => id !== contributorId)
        : [...currentContributorIds, contributorId]
    );
  }

  function toggleEditContributor(contributorId: string) {
    setSelectedEditContributorIds((currentContributorIds) =>
      currentContributorIds.includes(contributorId)
        ? currentContributorIds.filter((id) => id !== contributorId)
        : [...currentContributorIds, contributorId]
    );
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
        setProjects((currentProjects) => [data.project!, ...currentProjects]);
        setProjectsError("");
        setIsLoadingProjects(false);
      }

      resetCreateForm();
      closeCreateModal();
    } catch (error) {
      console.error("Impossible de créer le projet.", error);
      setFormError("Impossible de créer le projet. Veuillez réessayer.");
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
      console.error("Impossible de modifier le projet.", error);
      setEditFormError("Impossible de modifier le projet. Veuillez réessayer.");
    } finally {
      setIsUpdatingProject(false);
    }
  }

  async function handleDeleteProject() {
    if (!projectToEdit || !canDeleteProject) {
      return;
    }

    const shouldDeleteProject = window.confirm(
      `Supprimer le projet "${projectToEdit.name}" ?`
    );

    if (!shouldDeleteProject) {
      return;
    }

    setIsDeletingProject(true);
    setEditFormError("");

    try {
      const data = await deleteProject(projectToEdit.id);
      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== data.projectId)
      );
      closeEditModal();
    } catch (error) {
      console.error("Impossible de supprimer le projet.", error);
      setEditFormError("Impossible de supprimer le projet. Veuillez réessayer.");
    } finally {
      setIsDeletingProject(false);
    }
  }

  return (
    <>
      <ProjectsPageContent
        isLoadingProjects={isLoadingProjects}
        projects={projects}
        projectsError={projectsError}
        onCreateProject={() => setIsCreateModalOpen(true)}
        onEditProject={openEditModal}
      />

      <ProjectsPageModals
        canAddProject={canAddProject}
        canDeleteProject={canDeleteProject}
        canUpdateProject={canUpdateProject}
        contributors={contributors}
        contributorsError={contributorsError}
        description={description}
        editDescription={editDescription}
        editFormError={editFormError}
        editTitle={editTitle}
        formError={formError}
        isContributorsOpen={isContributorsOpen}
        isCreateModalOpen={isCreateModalOpen}
        isCreatingProject={isCreatingProject}
        isDeletingProject={isDeletingProject}
        isEditContributorsOpen={isEditContributorsOpen}
        isEditModalOpen={isEditModalOpen}
        isUpdatingProject={isUpdatingProject}
        projectToEdit={projectToEdit}
        selectedContributorIds={selectedContributorIds}
        selectedEditContributorIds={selectedEditContributorIds}
        title={title}
        onCloseCreateModal={closeCreateModal}
        onCloseEditModal={closeEditModal}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onDescriptionChange={setDescription}
        onEditDescriptionChange={setEditDescription}
        onEditTitleChange={setEditTitle}
        onIsContributorsOpenChange={setIsContributorsOpen}
        onIsEditContributorsOpenChange={setIsEditContributorsOpen}
        onTitleChange={setTitle}
        onToggleContributor={toggleContributor}
        onToggleEditContributor={toggleEditContributor}
        onUpdateProject={handleUpdateProject}
      />
    </>
  );
}
