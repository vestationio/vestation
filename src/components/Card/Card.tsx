import { clsx } from "clsx";
import css from "./Card.module.scss";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

function Card({ className, children }: CardProps) {
  return (
    <div className={clsx(css.card, className)}>
      <div className={css.card__inner}>{children}</div>
    </div>
  );
}

function Heading({ className, children }: CardProps) {
  return <h2 className={clsx(css.heading, className)}>{children}</h2>;
}

function Pane({ className, children, small }: { small?: boolean } & CardProps) {
  return <div className={clsx(css.pane, small && css.small, className)}>{children}</div>;
}

Card.Heading = Heading;
Card.Pane = Pane;

export default Card;
