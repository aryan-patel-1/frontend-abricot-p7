"use client";

import type { AuthUser } from "../services/authServices";
import type { Project } from "../services/projectServices";
import ProjectFormModal from "./projectFormModal";

// ce composant rassemble les modales de création et modification des projets
type ProjectsPageModalsProps = {
  canAddProject: boolean;
  canDeleteProject: boolean;
  canUpdateProject: boolean;
  contributors: AuthUser[];
  contributorsError: string;
  description: string;
  editDescription: string;
  editFormError: string;
  editTitle: string;
  formError: string;
  isContributorsOpen: boolean;
  isCreatingProject: boolean;
  isDeletingProject: boolean;
  isEditContributorsOpen: boolean;
  isEditModalOpen: boolean;
  isUpdatingProject: boolean;
  isCreateModalOpen: boolean;
  projectToEdit: Project | null;
  selectedContributorIds: string[];
  selectedEditContributorIds: string[];
  title: string;
  onCloseCreateModal: () => void;
  onCloseEditModal: () => void;
  onCreateProject: () => void;
  onDeleteProject: () => void;
  onDescriptionChange: (description: string) => void;
  onEditDescriptionChange: (description: string) => void;
  onEditTitleChange: (title: string) => void;
  onIsContributorsOpenChange: (isOpen: boolean) => void;
  onIsEditContributorsOpenChange: (isOpen: boolean) => void;
  onTitleChange: (title: string) => void;
  onToggleContributor: (contributorId: string) => void;
  onToggleEditContributor: (contributorId: string) => void;
  onUpdateProject: () => void;
};

export default function ProjectsPageModals({
  canAddProject,
  canDeleteProject,
  canUpdateProject,
  contributors,
  contributorsError,
  description,
  editDescription,
  editFormError,
  editTitle,
  formError,
  isContributorsOpen,
  isCreatingProject,
  isDeletingProject,
  isEditContributorsOpen,
  isEditModalOpen,
  isUpdatingProject,
  isCreateModalOpen,
  projectToEdit,
  selectedContributorIds,
  selectedEditContributorIds,
  title,
  onCloseCreateModal,
  onCloseEditModal,
  onCreateProject,
  onDeleteProject,
  onDescriptionChange,
  onEditDescriptionChange,
  onEditTitleChange,
  onIsContributorsOpenChange,
  onIsEditContributorsOpenChange,
  onTitleChange,
  onToggleContributor,
  onToggleEditContributor,
  onUpdateProject,
}: ProjectsPageModalsProps) {
  return (
    <>
      {isCreateModalOpen ? (
        <ProjectFormModal
          canSubmit={canAddProject}
          contributors={contributors}
          contributorsError={contributorsError}
          description={description}
          error={formError}
          isContributorsOpen={isContributorsOpen}
          isSubmitting={isCreatingProject}
          mode="create"
          selectedContributorIds={selectedContributorIds}
          submitLabel="Ajouter un projet"
          submittingLabel="Ajout..."
          title={title}
          onClose={onCloseCreateModal}
          onContributorsOpenChange={onIsContributorsOpenChange}
          onDescriptionChange={onDescriptionChange}
          onSubmit={onCreateProject}
          onTitleChange={onTitleChange}
          onToggleContributor={onToggleContributor}
        />
      ) : null}

      {isEditModalOpen && projectToEdit ? (
        <ProjectFormModal
          canDeleteProject={canDeleteProject}
          canSubmit={canUpdateProject}
          contributors={contributors}
          contributorsError={contributorsError}
          description={editDescription}
          error={editFormError}
          isContributorsOpen={isEditContributorsOpen}
          isDeleting={isDeletingProject}
          isSubmitting={isUpdatingProject}
          mode="edit"
          project={projectToEdit}
          selectedContributorIds={selectedEditContributorIds}
          submitLabel="Enregistrer"
          submittingLabel="Enregistrement..."
          title={editTitle}
          onClose={onCloseEditModal}
          onContributorsOpenChange={onIsEditContributorsOpenChange}
          onDelete={onDeleteProject}
          onDescriptionChange={onEditDescriptionChange}
          onSubmit={onUpdateProject}
          onTitleChange={onEditTitleChange}
          onToggleContributor={onToggleEditContributor}
        />
      ) : null}
    </>
  );
}
