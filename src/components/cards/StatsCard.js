import classnames from "classnames";
import { Card } from "react-bootstrap";

const StatsCard = ({ className, label, value = "-" }) => {
  return (
    <Card className={classnames("d-flex h-100", className)} border="0">
      <Card.Body>
        <Card.Title>
          <strong>{value}</strong>
        </Card.Title>
        <Card.Text>{label}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;
