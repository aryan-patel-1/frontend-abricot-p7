import Image from "next/image";

type IconButtonProps = {
  className?: string;
};

export default function IconButton({ className = "" }: IconButtonProps) {
  return (
    <Image
      src="/img/icone-recherche.svg"
      alt=""
      width={14}
      height={14}
      aria-hidden="true"
      className={`block flex-none ${className}`}
    />
  );
}
