import Image from "next/image";

import Button from "../components/button";
import TextInput from "../components/input";
import AppLink from "../components/link";
import Logo from "../components/logo";
import "./login.css";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-panel" aria-label="Formulaire de connexion">
        <Logo className="login-logo" />

        <div className="login-content">
          <h1>Connexion</h1>

          <form className="login-form" action="/dashboard">
            <TextInput id="email" label="Email" name="email" type="email" />
            <TextInput
              id="password"
              label="Mot de passe"
              name="password"
              type="password"
            />

            <Button className="login-submit" type="submit">
              Se connecter
            </Button>
          </form>

          <AppLink className="login-forgot-link" href="/mot-de-passe-oublie">
            Mot de passe oublié?
          </AppLink>
        </div>

        <p className="login-register">
          Pas encore de compte ? <AppLink href="/register">Créer un compte</AppLink>
        </p>
      </section>

      <section className="login-visual" aria-hidden="true">
        <Image
          src="/img/login-img.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 0px, calc(100vw - 562px)"
          className="login-image"
        />
      </section>
    </main>
  );
}