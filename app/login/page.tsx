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
import { login, saveAuthSession } from "../services/authServices";

export default function LoginPage() {
  const router = useRouter();
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
      // tente la connexion avec les champs du formulaire
      const session = await login({ email, password });
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
        aria-label="Formulaire de connexion"
      >
        <Logo className="mt-[94px] max-[480px]:mt-14 max-[480px]:w-[min(253px,78vw)]" />

        <div className="mt-[207px] flex w-[282px] flex-col items-center max-[480px]:mt-[140px] max-[480px]:w-full">
          <h1 className="mb-[34px] text-[40px] font-bold leading-[1.1] text-[#d3590b]">
            Connexion
          </h1>

          <form className="flex w-full flex-col gap-[18px]" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              id="password"
              label="Mot de passe"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
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
              className="mt-3 w-[250px] self-center"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <AppLink className="mt-[21px]" href="/mot-de-passe-oublie">
            Mot de passe oublié?
          </AppLink>
        </div>

        <p className="absolute bottom-[93px] left-0 w-full text-center text-sm font-normal leading-[1.2] text-[#111111] max-[480px]:bottom-12">
          Pas encore de compte ?{" "}
          <AppLink className="ml-2" href="/register">
            Créer un compte
          </AppLink>
        </p>
      </section>

      <section
        className="relative min-h-dvh flex-auto overflow-hidden max-[900px]:hidden"
        aria-hidden="true"
      >
        <Image
          src="/img/login-img.webp"
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