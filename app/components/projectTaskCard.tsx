"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { createTaskComment } from "../services/dashboardServices";
import { InputIcon } from "./input";
import type { ProjectDisplayTask } from "./projectDetailTypes";
import ProjectMemberBadge from "./projectMemberBadge";
import TaskStatusBadge from "./taskStatusBadge";

type ProjectTaskCardProps = ProjectDisplayTask & {
  commenterInitials: string;
  onCommentCreated: () => Promise<void>;
  projectId: string;
};

function formatDueDate(dueDate: string | null) {
  if (!dueDate) {
    return "Non définie";
  }

  // transforme la date api en date courte lisible dans la carte
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  }).format(new Date(dueDate));
}

function formatCommentDate(createdAt: string | null) {
  if (!createdAt) {
    return "";
  }

  // affiche la date du commentaire dans un format court pour la carte
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

export default function ProjectTaskCard({
  id,
  title,
  description,
  status,
  dueDate,
  assignees,
  comments,
  commenterInitials,
  onCommentCreated,
  projectId,
}: ProjectTaskCardProps) {
  const [areCommentsOpen, setAreCommentsOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [commentError, setCommentError] = useState("");
  const canSendComment = commentContent.trim() !== "";

  async function handleSendComment() {
    if (!canSendComment || isSendingComment) {
      return;
    }

    try {
      setIsSendingComment(true);
      setCommentError("");

      await createTaskComment(projectId, id, {
        content: commentContent.trim(),
      });
      setCommentContent("");
      // recharge les tâches pour récupérer le commentaire avec sa date api
      await onCommentCreated();
    } catch (error) {
      console.error("Impossible d'ajouter le commentaire.", error);
      setCommentError("Impossible d'ajouter le commentaire.");
    } finally {
      setIsSendingComment(false);
    }
  }

  return (
    <article className="rounded-lg border border-[var(--color-line)] bg-white px-[39px] py-[34px] max-[640px]:px-5 max-[520px]:py-6">
      <div className="grid grid-cols-[minmax(0,1fr)_56px] gap-6 max-[520px]:grid-cols-1">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold leading-tight text-[var(--color-ink)]">
              {title}
            </h3>
            <TaskStatusBadge status={status} />
          </div>
          <p className="mt-[10px] text-base leading-tight text-[var(--color-muted)]">
            {description || "Aucune description"}
          </p>
        </div>
        {/* le paramètre taskId dans l'url ouvre la modale avec cette tâche */}
        <Link
          href={`?taskId=${id}`}
          aria-label="Options de la tâche"
          className="flex h-[56px] w-[56px] items-center justify-center justify-self-end rounded-lg border border-[var(--color-line)] bg-white text-sm leading-none text-[var(--color-muted)] max-[520px]:justify-self-start"
        >
          ...
        </Link>
      </div>

      <div className="mt-[32px] flex flex-wrap items-center gap-x-[8px] gap-y-3 text-sm leading-none text-[var(--color-muted)]">
        <span>Échéance :</span>
        <InputIcon
          src="/img/input-icon-calendar.svg"
          className="h-[17px] w-[15px]"
        />
        <span className="text-[var(--color-ink)]">{formatDueDate(dueDate)}</span>
      </div>

      <div className="mt-[28px] flex flex-wrap items-center gap-x-[8px] gap-y-3 text-sm leading-none text-[var(--color-muted)]">
        <span>Assigné à :</span>
        {assignees.length > 0 ? (
          assignees.map((assignee) => (
            <ProjectMemberBadge
              key={assignee.name}
              initials={assignee.initials}
              name={assignee.name}
            />
          ))
        ) : (
          <span className="text-[var(--color-ink)]">Non assignée</span>
        )}
      </div>

      <div className="mt-[29px] border-t border-[var(--color-line)] pt-[25px]">
        <button
          type="button"
          aria-controls={`${id}-comments`}
          aria-expanded={areCommentsOpen}
          className="flex w-full cursor-pointer items-center justify-between gap-5 text-left text-base leading-none text-[var(--color-ink)]"
          onClick={() => setAreCommentsOpen(!areCommentsOpen)}
        >
          <span>Commentaires ({comments.length})</span>
          <Image
            src={
              areCommentsOpen
                ? "/img/close-collapse.svg"
                : "/img/open-collapse.svg"
            }
            alt=""
            width={15}
            height={8}
            className="block h-2 w-[15px] flex-none"
          />
        </button>
        {areCommentsOpen ? (
          <div id={`${id}-comments`} className="mt-[27px] space-y-[18px]">
            {/* affiche les commentaires renvoyés avec la tâche par l'api */}
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="grid grid-cols-[28px_minmax(0,1fr)] gap-[16px]"
                >
                  <span className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#e5e7eb] text-xs leading-none text-[var(--color-ink)]">
                    {comment.authorInitials}
                  </span>
                  <div className="rounded-lg bg-[#f3f4f6] px-[20px] pb-[20px] pt-[18px]">
                    <div className="flex items-start justify-between gap-4 max-[520px]:flex-col max-[520px]:gap-1">
                      <p className="text-base font-normal leading-tight text-[var(--color-ink)]">
                        {comment.authorName}
                      </p>
                      {comment.createdAt ? (
                        <span className="text-sm leading-tight text-[var(--color-muted)]">
                          {formatCommentDate(comment.createdAt)}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-[18px] text-sm leading-tight text-[var(--color-ink)]">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                Aucun commentaire pour cette tâche.
              </p>
            )}

            <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-[16px]">
              <span className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-xs leading-none text-[var(--color-brand)]">
                {commenterInitials}
              </span>
              <div className="rounded-lg bg-[#f9fafb] px-[20px] py-[18px]">
                <textarea
                  aria-label="Ajouter un commentaire"
                  value={commentContent}
                  className="min-h-[92px] w-full resize-none border-0 bg-transparent p-0 text-sm leading-tight text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink)]"
                  placeholder="Ajouter un commentaire..."
                  disabled={isSendingComment}
                  onChange={(event) => setCommentContent(event.target.value)}
                />
              </div>
            </div>

            {commentError ? (
              <p className="text-sm text-[var(--color-error-text)]">
                {commentError}
              </p>
            ) : null}

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!canSendComment || isSendingComment}
                className={`inline-flex min-h-[49px] w-[210px] items-center justify-center rounded-lg px-4 py-3 text-center text-base leading-tight max-[520px]:w-full ${
                  canSendComment
                    ? "bg-[var(--color-action)] text-white hover:bg-[var(--color-ink)]"
                    : "bg-[#e5e7eb] text-[var(--color-muted)]"
                }`}
                onClick={handleSendComment}
              >
                {isSendingComment ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
