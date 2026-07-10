import Image from "next/image";

type CommentProps = {
  className?: string;
};

export default function Comment({ className = "" }: CommentProps) {
  return (
    <Image
      src="/img/icon-tache-liste.svg"
      alt=""
      width={15}
      height={15}
      className={`block flex-none ${className}`}
    />
  );
}
