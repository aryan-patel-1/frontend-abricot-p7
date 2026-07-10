"use client";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getInitials,
  getProjectMembers,
  getTaskAssigneeOptions,
  matchesProjectTaskFilters,
  sortProjectTasksByDueDate,
  toProjectDisplayTask,
} from "../../../components/projectDetailHelpers";
import type {
  ProjectDisplayTask,
  ProjectTaskStatusFilter,
  ProjectTaskView,
} from "../../../components/projectDetailTypes";
import ProjectDetailContent from "../../../components/projectDetailContent";
import ProjectPageModals from "../../../components/projectPageModals";
import useProjectAiTasks from "../../../components/useProjectAiTasks";
import useSavedAuthUser from "../../../components/useSavedAuthUser";
import { getProjectTasks } from "../../../services/dashboardServices";
import {
  getProject,
  type Project,
  updateProject,
} from "../../../services/projectServices";

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateTaskAiModalOpen, setIsCreateTaskAiModalOpen] = useState(false);
  const [isAiGeneratedTasksModalOpen, setIsAiGeneratedTasksModalOpen] =
    useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<ProjectTaskStatusFilter>("all");
  const [activeTaskView, setActiveTaskView] =
    useState<ProjectTaskView>("list");
  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isEditingProjectTitle, setIsEditingProjectTitle] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [isSavingProjectTitle, setIsSavingProjectTitle] = useState(false);
  const [projectError, setProjectError] = useState("");
  const [tasks, setTasks] = useState<ProjectDisplayTask[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState("");
  const currentUser = useSavedAuthUser();
  // la présence de taskId dans l'url décide directement si la modale est ouverte
  const taskToEditId = searchParams.get("taskId");
  const matchingTasks = tasks.filter((task) =>
    matchesProjectTaskFilters(task, searchText, selectedStatus)
  );
  // en vue calendrier on garde les cartes existantes mais triées par échéance
  const filteredTasks =
    activeTaskView === "calendar"
      ? sortProjectTasksByDueDate(matchingTasks, "asc")
      : matchingTasks;
  // prépare les données d'affichage pour les composants extraits
  const displayedProjectMembers = getProjectMembers(project);
  const taskAssigneeOptions = getTaskAssigneeOptions(project);
  const peopleCount = project ? project.members.length + 1 : 0;
  const commenterInitials = getInitials(
    currentUser?.name || currentUser?.email || "Utilisateur"
  );

  const loadProject = useCallback(async () => {
    try {
      setIsLoadingProject(true);
      setProjectError("");

      const data = await getProject(params.id);

      setProject(data.project);
      setProjectTitle(data.project.name);
    } catch (error) {
      console.error("Impossible de charger le projet.", error);
      setProjectError("Impossible de charger le projet.");
    } finally {
      setIsLoadingProject(false);
    }
  }, [params.id]);

  const loadProjectTasks = useCallback(async () => {
    try {
      setIsLoadingTasks(true);
      setTasksError("");

      const data = await getProjectTasks(params.id);

      // convertit les tâches api avant de les donner au composant d'affichage
      setTasks(data.tasks.map(toProjectDisplayTask));
    } catch (error) {
      console.error("Impossible de charger les tâches du projet.", error);
      setTasksError("Impossible de charger les tâches du projet.");
    } finally {
      setIsLoadingTasks(false);
    }
  }, [params.id]);
  const {
    addGeneratedTasksError,
    aiGenerationError,
    generatedTasks,
    isAddingGeneratedTasks,
    isGeneratingTasksWithAi,
    addGeneratedTasksToProject,
    generateTasksWithAi,
    setGeneratedTasks,
  } = useProjectAiTasks(params.id, loadProjectTasks);

  // recharge la liste quand l'id du projet dans l'url change
  useEffect(() => {
    let isCurrentRequest = true;

    async function loadCurrentProjectTasks() {
      if (!isCurrentRequest) {
        return;
      }

      await loadProjectTasks();
    }

    loadCurrentProjectTasks();

    return () => {
      // évite de modifier le state si la page change avant la réponse api
      isCurrentRequest = false;
    };
  }, [loadProjectTasks]);

  // recharge les informations du projet quand l'id dans l'url change
  useEffect(() => {
    async function loadCurrentProject() {
      await loadProject();
    }

    loadCurrentProject();
  }, [loadProject]);

  function closeEditTaskModal() {
    // retire le paramètre pour éviter de rouvrir la modale au rafraîchissement
    router.replace(pathname, { scroll: false });
  }

  function showAiGeneratedTasks() {
    setIsCreateTaskAiModalOpen(false);
    setIsAiGeneratedTasksModalOpen(true);
  }

  async function addGeneratedTasksAndCloseModal() {
    const isAdded = await addGeneratedTasksToProject();

    if (isAdded) {
      setIsAiGeneratedTasksModalOpen(false);
    }
  }

  function startProjectTitleEdition() {
    if (!project) {
      return;
    }

    setProjectTitle(project.name);
    setProjectError("");
    setIsEditingProjectTitle(true);
  }

  async function saveProjectTitle() {
    if (!project || projectTitle.trim().length < 2 || isSavingProjectTitle) {
      return;
    }

    try {
      setIsSavingProjectTitle(true);
      setProjectError("");

      const data = await updateProject(project.id, {
        name: projectTitle.trim(),
        description: project.description ?? "",
      });

      setProject(data.project);
      setProjectTitle(data.project.name);
      setIsEditingProjectTitle(false);
    } catch (error) {
      console.error("Impossible de modifier le titre du projet.", error);
      setProjectError("Impossible de modifier le titre du projet.");
    } finally {
      setIsSavingProjectTitle(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 pb-[95px] pt-[64px] max-[760px]:px-5 max-[760px]:pt-10 max-[520px]:pb-10">
      <ProjectDetailContent
        activeTaskView={activeTaskView}
        commenterInitials={commenterInitials}
        displayedProjectMembers={displayedProjectMembers}
        filteredTasks={filteredTasks}
        isEditingProjectTitle={isEditingProjectTitle}
        isLoadingProject={isLoadingProject}
        isLoadingTasks={isLoadingTasks}
        isSavingProjectTitle={isSavingProjectTitle}
        isStatusOpen={isStatusOpen}
        peopleCount={peopleCount}
        project={project}
        projectError={projectError}
        projectId={params.id}
        projectTitle={projectTitle}
        searchText={searchText}
        selectedStatus={selectedStatus}
        tasks={tasks}
        tasksError={tasksError}
        onCommentCreated={loadProjectTasks}
        onOpenCreateAiTask={() => setIsCreateTaskAiModalOpen(true)}
        onOpenCreateTask={() => setIsCreateTaskModalOpen(true)}
        onProjectTitleChange={setProjectTitle}
        onSaveProjectTitle={saveProjectTitle}
        onSearchTextChange={setSearchText}
        onSelectedStatusChange={setSelectedStatus}
        onStartProjectTitleEdition={startProjectTitleEdition}
        onStatusOpenChange={setIsStatusOpen}
        onTaskViewChange={setActiveTaskView}
      />

      <ProjectPageModals
        addGeneratedTasksError={addGeneratedTasksError}
        aiGenerationError={aiGenerationError}
        generatedTasks={generatedTasks}
        isAddingGeneratedTasks={isAddingGeneratedTasks}
        isAiGeneratedTasksModalOpen={isAiGeneratedTasksModalOpen}
        isCreateTaskAiModalOpen={isCreateTaskAiModalOpen}
        isCreateTaskModalOpen={isCreateTaskModalOpen}
        isGeneratingTasksWithAi={isGeneratingTasksWithAi}
        projectId={params.id}
        taskAssigneeOptions={taskAssigneeOptions}
        taskToEditId={taskToEditId}
        onAddGeneratedTasksToProject={addGeneratedTasksAndCloseModal}
        onCloseAiGeneratedTasksModal={() => setIsAiGeneratedTasksModalOpen(false)}
        onCloseCreateTaskAiModal={() => setIsCreateTaskAiModalOpen(false)}
        onCloseCreateTaskModal={() => setIsCreateTaskModalOpen(false)}
        onCloseEditTaskModal={closeEditTaskModal}
        onGeneratedTasksChange={setGeneratedTasks}
        onGenerateTasksWithAi={generateTasksWithAi}
        onProjectTasksChanged={loadProjectTasks}
        onShowAiGeneratedTasks={showAiGeneratedTasks}
      />
    </div>
  );
}
