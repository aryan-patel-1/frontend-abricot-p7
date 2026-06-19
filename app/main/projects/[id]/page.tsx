"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Button from "../../../components/button";
import { InputIcon } from "../../../components/input";
import SearchBar from "../../../components/searchBar";

type ProjectMember = {
  initials: string;
  name: string;
  role?: string;
};

type TaskStatus = "todo" | "progress" | "done";

type Task = {
  id: string;
  status: TaskStatus;
};

const projectMembers: ProjectMember[] = [
  { initials: "AD", name: "Anne Dupont", role: "Propriétaire" },
  { initials: "BD", name: "Bertrand Dupont" },
  { initials: "AD", name: "Anne Dupont" },
];

const tasks: Task[] = [
  { id: "task-auth-todo", status: "todo" },
  { id: "task-auth-progress", status: "progress" },
  { id: "task-auth-done", status: "done" },
  { id: "task-auth-second-todo", status: "todo" },
];

const statusStyles: Record<
  TaskStatus,
  {
    label: string;
    className: string;
  }
> = {
  todo: {
    label: "À faire",
    className: "bg-[var(--color-todo-bg)] text-[var(--color-todo-text)]",
  },
  progress: {
    label: "En cours",
    className: "bg-[var(--color-progress-bg)] text-[var(--color-progress-text)]",
  },
  done: {
    label: "Terminée",
    className: "bg-[var(--color-done-bg)] text-[var(--color-done-text)]",
  },
};

function MemberBadge({ initials, name, role }: ProjectMember) {
  return (
    <span className="inline-flex items-center gap-[7px]">
      <span className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#e5e7eb] text-xs leading-none text-[var(--color-ink)]">
        {initials}
      </span>
      <span
        className={`inline-flex h-[28px] items-center rounded-full px-[15px] text-[15px] leading-none ${
          role
            ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
            : "bg-[#e5e7eb] text-[var(--color-muted)]"
        }`}
      >
        {role || name}
      </span>
    </span>
  );
}

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const statusStyle = statusStyles[status];

  return (
    <span
      className={`inline-flex h-[28px] items-center rounded-full px-4 text-[15px] leading-none ${statusStyle.className}`}
    >
      {statusStyle.label}
    </span>
  );
}

function TaskCard({ id, status }: Task) {
  const [areCommentsOpen, setAreCommentsOpen] = useState(false);

  return (
    <article className="rounded-lg border border-[var(--color-line)] bg-white px-[39px] py-[34px]">
      <div className="grid grid-cols-[minmax(0,1fr)_56px] gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold leading-tight text-[var(--color-ink)]">
              Authentification JWT
            </h3>
            <TaskStatusBadge status={status} />
          </div>
          <p className="mt-[10px] text-base leading-tight text-[var(--color-muted)]">
            Implémenter le système d&apos;authentification avec tokens JWT
          </p>
        </div>
        <button
          type="button"
          aria-label="Options de la tâche"
          className="flex h-[56px] w-[56px] items-center justify-center justify-self-end rounded-lg border border-[var(--color-line)] bg-white text-sm leading-none text-[var(--color-muted)]"
        >
          ...
        </button>
      </div>

      <div className="mt-[32px] flex flex-wrap items-center gap-x-[8px] gap-y-3 text-sm leading-none text-[var(--color-muted)]">
        <span>Échéance :</span>
        <InputIcon
          src="/img/input-icon-calendar.svg"
          className="h-[17px] w-[15px]"
        />
        <span className="text-[var(--color-ink)]">9 mars</span>
      </div>

      <div className="mt-[28px] flex flex-wrap items-center gap-x-[8px] gap-y-3 text-sm leading-none text-[var(--color-muted)]">
        <span>Assigné à :</span>
        <MemberBadge initials="BD" name="Bertrand Dupont" />
        <MemberBadge initials="AD" name="Anne Dupont" />
      </div>

      <div className="mt-[29px] border-t border-[var(--color-line)] pt-[25px]">
        <button
          type="button"
          aria-controls={`${id}-comments`}
          aria-expanded={areCommentsOpen}
          className="flex w-full cursor-pointer items-center justify-between gap-5 text-left text-base leading-none text-[var(--color-ink)]"
          onClick={() => setAreCommentsOpen(!areCommentsOpen)}
        >
          <span>Commentaires (1)</span>
          <Image
            src={
              areCommentsOpen
                ? "/img/close-collapse.svg"
                : "/img/open-collapse.svg"
            }
            alt=""
            width={15}
            height={8}
            aria-hidden="true"
            className="block h-2 w-[15px] flex-none"
          />
        </button>
        {areCommentsOpen ? (
          <div id={`${id}-comments`} className="mt-[27px] space-y-[18px]">
            <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-[16px]">
              <span className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#e5e7eb] text-xs leading-none text-[var(--color-ink)]">
                BD
              </span>
              <div className="rounded-lg bg-[#f3f4f6] px-[20px] pb-[20px] pt-[18px]">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-base font-normal leading-tight text-[var(--color-ink)]">
                    Bertrand Dupont
                  </p>
                  <span className="text-sm leading-tight text-[var(--color-muted)]">
                    23 mars, 11:20
                  </span>
                </div>
                <p className="mt-[18px] text-sm leading-tight text-[var(--color-ink)]">
                  Attention à bien gérer l&apos;expiration des tokens et le refresh
                  automatique côté client.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-[16px]">
              <span className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-xs leading-none text-[var(--color-brand)]">
                AD
              </span>
              <div className="rounded-lg bg-[#f9fafb] px-[20px] py-[18px]">
                <textarea
                  aria-label="Ajouter un commentaire"
                  className="min-h-[92px] w-full resize-none border-0 bg-transparent p-0 text-sm leading-tight text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink)]"
                  placeholder="Ajouter un commentaire..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled
                className="inline-flex h-[49px] w-[210px] items-center justify-center rounded-lg bg-[#e5e7eb] text-base leading-none text-[#9ca3af]"
              >
                Envoyer
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function CreateTaskModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5 py-8">
      <section
        aria-labelledby="create-task-title"
        aria-modal="true"
        role="dialog"
        className="relative w-full max-w-[598px] rounded-lg bg-white px-[73px] pb-[78px] pt-[82px] shadow-[0_20px_45px_rgba(0,0,0,0.18)] max-[640px]:px-6 max-[640px]:py-14"
      >
        <button
          type="button"
          aria-label="Fermer la modale"
          className="absolute right-[37px] top-[37px] flex h-5 w-5 cursor-pointer items-center justify-center"
          onClick={onClose}
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

        <form className="flex flex-col">
          <h2
            id="create-task-title"
            className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]"
          >
            Créer une tâche
          </h2>

          <label className="mt-[42px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Titre*
            <input
              type="text"
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-base text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
            />
          </label>

          <label className="mt-[26px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Description*
            <input
              type="text"
              className="h-[53px] rounded border border-[var(--color-field-line)] bg-white px-3.5 text-base text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
            />
          </label>

          <label className="mt-[26px] flex flex-col gap-[7px] text-sm leading-[1.2] text-[var(--color-ink)]">
            Échéance*
            <span className="flex h-[53px] items-center rounded border border-[var(--color-field-line)] bg-white px-3.5">
              <input
                type="text"
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-base text-[var(--color-ink)] outline-none"
              />
              <InputIcon
                src="/img/input-icon-calendar.svg"
                className="h-[17px] w-[15px]"
              />
            </span>
          </label>

          <div className="mt-[26px]">
            <p className="text-sm leading-[1.2] text-[var(--color-ink)]">
              Assigné à :
            </p>
            <button
              type="button"
              className="mt-[7px] flex h-[53px] w-full cursor-pointer items-center justify-between rounded border border-[var(--color-field-line)] bg-white px-4 text-left text-sm text-[var(--color-muted)]"
            >
              <span>Choisir un ou plusieurs collaborateurs</span>
              <Image
                src="/img/open-collapse.svg"
                alt=""
                width={15}
                height={8}
                aria-hidden="true"
                className="block h-2 w-[15px] flex-none"
              />
            </button>
          </div>

          <div className="mt-[26px]">
            <p className="text-sm leading-[1.2] text-[var(--color-ink)]">
              Statut :
            </p>
            <div className="mt-[16px] flex flex-wrap gap-3">
              {(["todo", "progress", "done"] as TaskStatus[]).map((status) => (
                <TaskStatusBadge key={status} status={status} />
              ))}
            </div>
          </div>

          <Button
            type="button"
            disabled
            className="mt-[56px] w-[201px] bg-[#e5e7eb] text-sm text-[#9CA3AF] hover:bg-[#e5e7eb] disabled:opacity-100"
          >
            + Ajouter une tâche
          </Button>
        </form>
      </section>
    </div>
  );
}

function CreateTaskAiModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5 py-8">
      <section
        aria-labelledby="create-task-ai-title"
        aria-modal="true"
        role="dialog"
        className="relative flex min-h-[797px] w-full max-w-[598px] flex-col rounded-lg bg-white px-[52px] pb-[78px] pt-[82px] shadow-[0_20px_45px_rgba(0,0,0,0.18)] max-[640px]:min-h-[640px] max-[640px]:px-6 max-[640px]:py-14"
      >
        <button
          type="button"
          aria-label="Fermer la modale"
          className="absolute right-[37px] top-[37px] flex h-5 w-5 cursor-pointer items-center justify-center"
          onClick={onClose}
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

        <h2
          id="create-task-ai-title"
          className="flex items-center gap-[10px] text-[25px] font-semibold leading-tight text-[var(--color-heading)]"
        >
          <Image
            src="/img/IA-icon-orange.png"
            alt=""
            width={19}
            height={19}
            aria-hidden="true"
            className="block h-[19px] w-[19px] flex-none"
          />
          Créer une tâche
        </h2>

        <div className="mt-auto rounded-full bg-[#f9fafb] px-[32px] py-[18px]">
          <div className="flex items-center gap-4">
            <input
              type="text"
              aria-label="Décrire les tâches à ajouter"
              placeholder="Décrivez les tâches que vous souhaitez ajouter..."
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-xs text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink)]"
            />
            <button
              type="button"
              aria-label="Envoyer la demande"
              className="flex h-[24px] w-[24px] flex-none items-center justify-center rounded-full bg-[var(--color-brand)] text-white"
            >
              <Image
                src="/img/IA-icon-white.svg"
                alt=""
                width={12}
                height={12}
                aria-hidden="true"
                className="block h-3 w-3"
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProjectPage() {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateTaskAiModalOpen, setIsCreateTaskAiModalOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 pb-[95px] pt-[64px] max-[760px]:px-5 max-[760px]:pt-10">
      <header className="flex items-start justify-between gap-8 max-[760px]:flex-col">
        <div className="flex min-w-0 flex-1 items-start gap-[15px]">
          <Link
            href="/main/projects"
            aria-label="Retour aux projets"
            className="mt-0 flex h-[55px] w-[55px] flex-none items-center justify-center rounded-lg border border-[var(--color-line)] bg-white"
          >
            <Image
              src="/img/back-arrow.svg"
              alt=""
              width={14}
              height={11}
              aria-hidden="true"
              className="block h-[11px] w-[14px]"
            />
          </Link>
          <div className="pt-1">
            <div className="flex flex-wrap items-baseline gap-x-[17px] gap-y-2">
              <h1 className="text-[25px] font-semibold leading-tight text-[var(--color-heading)]">
                Nom du projet
              </h1>
              <button
                type="button"
                className="text-sm leading-none text-[var(--color-brand)] underline underline-offset-2"
              >
                Modifier
              </button>
            </div>
            <p className="mt-[15px] max-w-[760px] text-xl leading-tight text-[var(--color-muted)]">
              Développement de la nouvelle version de l&apos;API REST avec
              authentification JWT
            </p>
          </div>
        </div>

        <div className="mt-[18px] flex flex-none items-center gap-3 max-[760px]:mt-0 max-[520px]:w-full max-[520px]:flex-col">
          <Button
            type="button"
            className="whitespace-nowrap px-[18px] max-[520px]:w-full"
            onClick={() => setIsCreateTaskModalOpen(true)}
          >
            Créer une tâche
          </Button>
          <Button
            type="button"
            className="gap-3 whitespace-nowrap bg-[var(--color-brand)] px-[24px] hover:!bg-[var(--color-brand)] max-[520px]:w-full"
            onClick={() => setIsCreateTaskAiModalOpen(true)}
          >
            <Image
              src="/img/IA-icon-white.svg"
              alt=""
              width={17}
              height={17}
              aria-hidden="true"
              className="block h-[17px] w-[17px]"
            />
            IA
          </Button>
        </div>
      </header>

      <section className="mt-[50px] flex min-h-[66px] items-center justify-between gap-6 rounded-lg bg-[#f3f4f6] px-8 py-5 max-[900px]:flex-col max-[900px]:items-start max-[640px]:px-5">
        <div className="flex flex-wrap items-baseline gap-[10px]">
          <h2 className="text-xl font-semibold leading-tight text-[var(--color-heading)]">
            Contributeurs
          </h2>
          <span className="text-base leading-tight text-[var(--color-muted)]">
            3 personnes
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-[9px]">
          {projectMembers.map((member, memberIndex) => (
            <MemberBadge
              key={`${member.name}-${memberIndex}`}
              initials={member.initials}
              name={member.name}
              role={member.role}
            />
          ))}
        </div>
      </section>

      <section className="mt-[33px] rounded-lg border border-[var(--color-line)] bg-white px-8 py-[40px] max-[760px]:px-5">
        <div className="flex items-center justify-between gap-8 max-[900px]:flex-col max-[900px]:items-start">
          <div>
            <h2 className="text-xl font-semibold leading-tight text-[var(--color-heading)]">
              Tâches
            </h2>
            <p className="mt-[10px] text-base leading-tight text-[var(--color-muted)]">
              Par ordre de priorité
            </p>
          </div>

          <div className="flex items-center gap-[14px] max-[900px]:flex-wrap">
            <button
              type="button"
              className="inline-flex h-[45px] items-center gap-[10px] rounded-lg bg-[var(--color-brand-soft)] px-[17px] text-sm leading-none text-[var(--color-brand)]"
            >
              <Image
                src="/img/chips-mes-taches.svg"
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
                className="block h-4 w-4 flex-none"
              />
              Liste
            </button>
            <button
              type="button"
              className="inline-flex h-[45px] items-center gap-[10px] rounded-lg bg-white px-[17px] text-sm leading-none text-[var(--color-brand)]"
            >
              <InputIcon
                src="/img/input-icon-calendar-orange.png"
                className="h-[17px] w-[15px]"
              />
              Calendrier
            </button>
            <div className="relative">
              <button
                type="button"
                aria-controls="status-filter-options"
                aria-expanded={isStatusOpen}
                className="inline-flex h-[61px] min-w-[149px] cursor-pointer items-center justify-between rounded-lg border border-[var(--color-line)] bg-white px-[31px] text-sm leading-none text-[var(--color-muted)]"
                onClick={() => setIsStatusOpen(!isStatusOpen)}
              >
                Statut
                <Image
                  src={
                    isStatusOpen
                      ? "/img/close-collapse.svg"
                      : "/img/open-collapse.svg"
                  }
                  alt=""
                  width={15}
                  height={8}
                  aria-hidden="true"
                  className="block h-2 w-[15px] flex-none"
                />
              </button>
              {isStatusOpen ? (
                <div
                  id="status-filter-options"
                  className="absolute left-0 top-[69px] z-10 w-full rounded-lg border border-[var(--color-line)] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                >
                  {["À faire", "En cours", "Terminée"].map((statusLabel) => (
                    <button
                      key={statusLabel}
                      type="button"
                      className="block w-full cursor-pointer px-4 py-2 text-left text-sm leading-tight text-[var(--color-muted)] hover:bg-[var(--color-surface-main)]"
                    >
                      {statusLabel}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <SearchBar
              label="Rechercher une tâche"
              placeholder="Rechercher une tâche"
              type="text"
              className="h-[61px] w-[280px] max-w-none max-[640px]:w-full"
            />
          </div>
        </div>

        <div className="mx-auto mt-[41px] flex w-full max-w-[1215px] flex-col gap-[17px]">
          {tasks.map((task) => (
            <TaskCard key={task.id} id={task.id} status={task.status} />
          ))}
        </div>
      </section>
      {isCreateTaskModalOpen ? (
        <CreateTaskModal onClose={() => setIsCreateTaskModalOpen(false)} />
      ) : null}
      {isCreateTaskAiModalOpen ? (
        <CreateTaskAiModal onClose={() => setIsCreateTaskAiModalOpen(false)} />
      ) : null}
    </div>
  );
}
