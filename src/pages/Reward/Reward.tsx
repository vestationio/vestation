import Card from "~/components/Card";
import css from "../Dashboard/Dashboard.module.scss";

export default function Reward() {
  return (
    <div className={css.dashboard}>
      <div className={css.dashboard__row}>
        <Card>
          <Card.Heading>Reward</Card.Heading>
        </Card>
      </div>
    </div>
  );
}
