import { clsx } from "clsx";
import css from "./Card.module.scss";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export default function Card({ className, children }: CardProps) {
  return <div className={clsx(css.Card, className)}>{children}</div>;
}
