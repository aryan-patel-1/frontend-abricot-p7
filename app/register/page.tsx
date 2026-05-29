"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import Button from "../components/button";
import TextInput from "../components/input";
import AppLink from "../components/link";
import Logo from "../components/logo";
import { ApiError } from "../services/api";
import { register, saveAuthSession } from "../services/authServices";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // empêche le navigateur de recharger la page
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // crée le compte avec les champs du formulaire
      const session = await register({
        email: email.trim(),
        name: name.trim() || undefined,
        password,
      });
      // sauvegarde la session reçue avant de changer de page
      saveAuthSession(session);
      router.push("/main/dashboard");
    } catch (err) {
      // affiche le message clair renvoyé par le service api
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-dvh w-full bg-[#f7f7f7] font-[Ag,Arial,Helvetica,sans-serif] text-[#111111] max-[900px]:block">
      <section
        className="relative flex min-h-dvh w-[562px] flex-[0_0_562px] flex-col items-center bg-[#f7f7f7] max-[900px]:w-full max-[480px]:flex-auto max-[480px]:px-6"
        aria-label="Formulaire d'inscription"
      >
        <Logo className="mt-[113px] max-[480px]:mt-14 max-[480px]:w-[min(253px,78vw)]" />

        <div className="mt-[170px] flex w-[282px] flex-col items-center max-[480px]:mt-[140px] max-[480px]:w-full">
          <h1 className="mb-[34px] text-[40px] font-bold leading-[1.1] text-[#d3590b]">
            Inscription
          </h1>

          <form className="flex w-full flex-col gap-[18px]" onSubmit={handleSubmit}>
            <TextInput
              autoComplete="name"
              id="name"
              label="Nom"
              name="name"
              onChange={(event) => setName(event.target.value)}
              required
              type="text"
              value={name}
            />
            <TextInput
              autoComplete="email"
              id="email"
              label="Email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
            <TextInput
              autoComplete="new-password"
              id="password"
              label="Mot de passe"
              minLength={8}
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              pattern={
                "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}"
              }
              required
              title="Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)."
              type="password"
              value={password}
            />

            {error ? (
              <p
                className="w-full rounded-md border border-[#ffccc7] bg-[#fff1f0] px-3 py-2.5 text-sm leading-[1.4] text-[#9f1d12]"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <Button
              className="mt-3 w-[218px] self-center"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Inscription..." : "S'inscrire"}
            </Button>
          </form>
        </div>

        <p className="absolute bottom-[109px] left-0 w-full text-center text-sm font-normal leading-[1.2] text-[#111111] max-[480px]:bottom-12">
          Déjà inscrit ?{" "}
          <AppLink className="ml-2" href="/login">
            Se connecter
          </AppLink>
        </p>
      </section>

      <section
        className="relative min-h-dvh flex-auto overflow-hidden max-[900px]:hidden"
        aria-hidden="true"
      >
        <Image
          src="/img/signup-img.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 0px, calc(100vw - 562px)"
          className="object-cover object-center"
        />
      </section>
    </main>
  );
}
