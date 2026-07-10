"use client";

import type {
  ProjectDisplayTask,
  ProjectMember,
  ProjectTaskStatusFilter,
  ProjectTaskView,
} from "./projectDetailTypes";
import ProjectContributorsSection from "./projectContributorsSection";
import ProjectHeader from "./projectHeader";
import ProjectTasksSection from "./projectTasksSection";
import type { Project } from "../services/projectServices";

// ce composant affiche les sections principales de la page détail projet
type ProjectDetailContentProps = {
  activeTaskView: ProjectTaskView;
  commenterInitials: string;
  displayedProjectMembers: ProjectMember[];
  filteredTasks: ProjectDisplayTask[];
  isEditingProjectTitle: boolean;
  isLoadingProject: boolean;
  isLoadingTasks: boolean;
  isSavingProjectTitle: boolean;
  isStatusOpen: boolean;
  peopleCount: number;
  project: Project | null;
  projectError: string;
  projectId: string;
  projectTitle: string;
  searchText: string;
  selectedStatus: ProjectTaskStatusFilter;
  tasks: ProjectDisplayTask[];
  tasksError: string;
  onCommentCreated: () => Promise<void>;
  onOpenCreateAiTask: () => void;
  onOpenCreateTask: () => void;
  onProjectTitleChange: (title: string) => void;
  onSaveProjectTitle: () => void;
  onSearchTextChange: (searchText: string) => void;
  onSelectedStatusChange: (status: ProjectTaskStatusFilter) => void;
  onStartProjectTitleEdition: () => void;
  onStatusOpenChange: (isOpen: boolean) => void;
  onTaskViewChange: (view: ProjectTaskView) => void;
};

export default function ProjectDetailContent({
  activeTaskView,
  commenterInitials,
  displayedProjectMembers,
  filteredTasks,
  isEditingProjectTitle,
  isLoadingProject,
  isLoadingTasks,
  isSavingProjectTitle,
  isStatusOpen,
  peopleCount,
  project,
  projectError,
  projectId,
  projectTitle,
  searchText,
  selectedStatus,
  tasks,
  tasksError,
  onCommentCreated,
  onOpenCreateAiTask,
  onOpenCreateTask,
  onProjectTitleChange,
  onSaveProjectTitle,
  onSearchTextChange,
  onSelectedStatusChange,
  onStartProjectTitleEdition,
  onStatusOpenChange,
  onTaskViewChange,
}: ProjectDetailContentProps) {
  return (
    <>
      <ProjectHeader
        isEditingProjectTitle={isEditingProjectTitle}
        isLoadingProject={isLoadingProject}
        isSavingProjectTitle={isSavingProjectTitle}
        project={project}
        projectError={projectError}
        projectTitle={projectTitle}
        onOpenCreateAiTask={onOpenCreateAiTask}
        onOpenCreateTask={onOpenCreateTask}
        onProjectTitleChange={onProjectTitleChange}
        onSaveProjectTitle={onSaveProjectTitle}
        onStartProjectTitleEdition={onStartProjectTitleEdition}
      />

      <ProjectContributorsSection
        members={displayedProjectMembers}
        peopleCount={peopleCount}
      />

      <ProjectTasksSection
        activeTaskView={activeTaskView}
        commenterInitials={commenterInitials}
        filteredTasks={filteredTasks}
        isLoadingTasks={isLoadingTasks}
        isStatusOpen={isStatusOpen}
        projectId={projectId}
        searchText={searchText}
        selectedStatus={selectedStatus}
        tasks={tasks}
        tasksError={tasksError}
        onCommentCreated={onCommentCreated}
        onSearchTextChange={onSearchTextChange}
        onSelectedStatusChange={onSelectedStatusChange}
        onStatusOpenChange={onStatusOpenChange}
        onTaskViewChange={onTaskViewChange}
      />
    </>
  );
}
