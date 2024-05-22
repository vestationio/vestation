import { clsx } from "clsx";
import { Player } from "@lottiefiles/react-lottie-player";
import css from "./Background.module.scss";

type BackgroundProps = {
  className?: string;
};

export default function Background({ className }: BackgroundProps) {
  return (
    <div className={clsx(css.Background, className)}>
      <Player
        autoplay
        loop
        src="/lottie/circle-top-left/data.json"
        className={css.Background__top_left}
      />
      <Player
        autoplay
        loop
        src="/lottie/circle-bottom-right/data.json"
        className={css.Background__bottom_right}
      />
      <Player autoplay loop src="/lottie/star/data.json" className={css.Background__star1} />
      <Player autoplay loop src="/lottie/star/data.json" className={css.Background__star2} />
    </div>
  );
}
