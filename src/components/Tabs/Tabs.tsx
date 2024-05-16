import { clsx } from "clsx";
import css from "./Tabs.module.scss";

type TabsProps = {
  className?: string;
  tabs: string[];
  activeIdx: number;
  onTabChange: (idx: number) => void;
};

export default function Tabs({ className, tabs, activeIdx, onTabChange }: TabsProps) {
  return (
    <div className={clsx(css.Tabs, className)}>
      {tabs.map((tab, idx) => (
        <button
          key={tab}
          className={clsx(css.Tab, idx === activeIdx && css.active)}
          onClick={() => onTabChange(idx)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
