import Image from "next/image";

import Button from "../components/button";
import TextInput from "../components/input";
import AppLink from "../components/link";
import Logo from "../components/logo";
import "./register.css";

export default function RegisterPage() {
  return (
    <main className="register-page">
      {/* zone de gauche */}
      <section className="register-panel" aria-label="Formulaire d'inscription">
        {/* logo de la page */}
        <Logo className="register-logo" />

        {/* contenu du formulaire */}
        <div className="register-content">
          <h1>Inscription</h1>

          {/* champs du compte */}
          <form className="register-form" action="/dashboard">
            <TextInput id="email" label="Email" name="email" type="email" />
            <TextInput
              id="password"
              label="Mot de passe"
              name="password"
              type="password"
            />

            {/* bouton noir */}
            <Button className="register-submit" type="submit">
              S’inscrire
            </Button>
          </form>
        </div>

        {/* lien vers login */}
        <p className="register-login">
          Déjà inscrit ? <AppLink href="/login">Se connecter</AppLink>
        </p>
      </section>

      {/* image de droite */}
      <section className="register-visual" aria-hidden="true">
        <Image
          src="/img/signup-img.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 0px, calc(100vw - 562px)"
          className="register-image"
        />
      </section>
    </main>
  );
}