import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import { Card, Container } from "react-bootstrap";

const HomePageCard = ({ className, item: { name, description, icon } }) => {
  return (
    <Card className={classnames(" m-2 rounded-3  ", className)} border="0">
      <Card.Body className="h-100  border rounded-3">
        <Container className="g-0 d-flex align-items-center">
          <FontAwesomeIcon
            className="color-primary me-3"
            size="lg"
            icon={icon}
          />
          <div>
            <Card.Title className="mb-0 color-primary">{name}</Card.Title>
            <Card.Text>
              <div dangerouslySetInnerHTML={{ __html: description }}></div>
            </Card.Text>
          </div>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default HomePageCard;
