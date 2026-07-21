"use client";

import AiGeneratedTasksModal from "./aiGeneratedTasksModal";
import CreateTaskAiModal from "./createTaskAiModal";
import CreateTaskModal from "./createTaskModal";
import EditTaskModal from "./editTaskModal";
import type { AiGeneratedTask, TaskAssigneeOption } from "./taskModalTypes";

// monte uniquement les modales nécessaires à l'état courant du projet
type ProjectPageModalsProps = {
  addGeneratedTasksError: string;
  aiGenerationError: string;
  generatedTasks: AiGeneratedTask[];
  isAddingGeneratedTasks: boolean;
  isAiGeneratedTasksModalOpen: boolean;
  isCreateTaskAiModalOpen: boolean;
  isCreateTaskModalOpen: boolean;
  isGeneratingTasksWithAi: boolean;
  projectId: string;
  taskAssigneeOptions: TaskAssigneeOption[];
  taskToEditId: string | null;
  onAddGeneratedTasksToProject: () => Promise<void>;
  onCloseAiGeneratedTasksModal: () => void;
  onCloseCreateTaskAiModal: () => void;
  onCloseCreateTaskModal: () => void;
  onCloseEditTaskModal: () => void;
  onGeneratedTasksChange: (tasks: AiGeneratedTask[]) => void;
  onGenerateTasksWithAi: (prompt: string) => Promise<boolean>;
  onProjectTasksChanged: () => Promise<void>;
  onShowAiGeneratedTasks: () => void;
};

export default function ProjectPageModals({
  addGeneratedTasksError,
  aiGenerationError,
  generatedTasks,
  isAddingGeneratedTasks,
  isAiGeneratedTasksModalOpen,
  isCreateTaskAiModalOpen,
  isCreateTaskModalOpen,
  isGeneratingTasksWithAi,
  projectId,
  taskAssigneeOptions,
  taskToEditId,
  onAddGeneratedTasksToProject,
  onCloseAiGeneratedTasksModal,
  onCloseCreateTaskAiModal,
  onCloseCreateTaskModal,
  onCloseEditTaskModal,
  onGeneratedTasksChange,
  onGenerateTasksWithAi,
  onProjectTasksChanged,
  onShowAiGeneratedTasks,
}: ProjectPageModalsProps) {
  return (
    <>
      {isCreateTaskModalOpen ? (
        <CreateTaskModal
          assigneeOptions={taskAssigneeOptions}
          projectId={projectId}
          onCreated={onProjectTasksChanged}
          onClose={onCloseCreateTaskModal}
        />
      ) : null}
      {isCreateTaskAiModalOpen ? (
        <CreateTaskAiModal
          generationError={aiGenerationError}
          isGeneratingTasks={isGeneratingTasksWithAi}
          onClose={onCloseCreateTaskAiModal}
          onGenerateTasks={onGenerateTasksWithAi}
          onShowResult={onShowAiGeneratedTasks}
        />
      ) : null}
      {isAiGeneratedTasksModalOpen ? (
        <AiGeneratedTasksModal
          addError={addGeneratedTasksError}
          generatedTasks={generatedTasks}
          generationError={aiGenerationError}
          isAddingTasks={isAddingGeneratedTasks}
          isGeneratingTasks={isGeneratingTasksWithAi}
          onAddTasks={onAddGeneratedTasksToProject}
          onGeneratedTasksChange={onGeneratedTasksChange}
          onGenerateTasks={onGenerateTasksWithAi}
          onClose={onCloseAiGeneratedTasksModal}
        />
      ) : null}
      {taskToEditId ? (
        <EditTaskModal
          assigneeOptions={taskAssigneeOptions}
          projectId={projectId}
          taskId={taskToEditId}
          onClose={onCloseEditTaskModal}
          onSaved={onProjectTasksChanged}
        />
      ) : null}
    </>
  );
}
