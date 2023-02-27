import classnames from "classnames";
import { map } from "lodash";
import { useContext, useEffect } from "react";
import { Button, Container, Nav } from "react-bootstrap";
import { AuthContext } from "../../contexts";

const TabHeader = ({ tabs, activeTab, setIsAddAssetModalVisible }) => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Container className="d-flex justify-content-between">
      <Nav className="flex-row mb-2 " variant="pills">
        {map(tabs, ({ eventKey, text }, index) => (
          <Nav.Item key={index}>
            <Nav.Link
              className={classnames("cursor-pointer rounded-pill me-2", {
                " color-primary fw-bold": activeTab === eventKey,
                "text-muted bg-black bg-opacity-10": activeTab !== eventKey,
              })}
              eventKey={eventKey}
            >
              {text}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <div className="d-flex p-3 pe-0">
        {isLoggedIn && (
          <Button
            variant="outline-primary"
            className={classnames("btn-sm action-btn")}
            onClick={() => {
              setIsAddAssetModalVisible(true);
            }}
          >
            Add Asset
          </Button>
        )}
      </div>
    </Container>
  );
};

export default TabHeader;
