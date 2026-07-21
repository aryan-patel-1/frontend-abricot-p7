"use client";

import { useState } from "react";

import { createTask } from "../services/dashboardServices";
import { requestAiGeneratedTasks } from "../services/aiTaskServices";
import type { AiGeneratedTask } from "./taskModalTypes";

const initialAiGeneratedTasks: AiGeneratedTask[] = [];

// centralise la prévisualisation IA puis la création des tâches validées
export default function useProjectAiTasks(
  projectId: string,
  onProjectTasksChanged: () => Promise<void>
) {
  const [generatedTasks, setGeneratedTasks] = useState<AiGeneratedTask[]>(
    initialAiGeneratedTasks
  );
  const [isGeneratingTasksWithAi, setIsGeneratingTasksWithAi] = useState(false);
  const [isAddingGeneratedTasks, setIsAddingGeneratedTasks] = useState(false);
  const [aiGenerationError, setAiGenerationError] = useState("");
  const [addGeneratedTasksError, setAddGeneratedTasksError] = useState("");

  async function generateTasksWithAi(prompt: string) {
    if (isGeneratingTasksWithAi) {
      return false;
    }

    try {
      setIsGeneratingTasksWithAi(true);
      setAiGenerationError("");
      setAddGeneratedTasksError("");

      const tasksGeneratedByAi = await requestAiGeneratedTasks(prompt);

      setGeneratedTasks(tasksGeneratedByAi);
      return true;
    } catch (error) {
      setAiGenerationError(
        error instanceof Error
          ? error.message
          : "Impossible de générer les tâches."
      );
      return false;
    } finally {
      setIsGeneratingTasksWithAi(false);
    }
  }

  async function addGeneratedTasksToProject() {
    if (generatedTasks.length === 0 || isAddingGeneratedTasks) {
      return;
    }

    try {
      setIsAddingGeneratedTasks(true);
      setAddGeneratedTasksError("");

      for (const generatedTask of generatedTasks) {
        await createTask(projectId, {
          title: generatedTask.title,
          description: generatedTask.description,
          dueDate: null,
          status: "TODO",
          assigneeIds: [],
        });
      }

      await onProjectTasksChanged();
      setGeneratedTasks([]);
      return true;
    } catch (error) {
      console.error("Impossible d'ajouter les tâches générées.", error);
      setAddGeneratedTasksError("Impossible d'ajouter les tâches générées.");
      return false;
    } finally {
      setIsAddingGeneratedTasks(false);
    }
  }

  return {
    addGeneratedTasksError,
    aiGenerationError,
    generatedTasks,
    isAddingGeneratedTasks,
    isGeneratingTasksWithAi,
    addGeneratedTasksToProject,
    generateTasksWithAi,
    setGeneratedTasks,
  };
}
