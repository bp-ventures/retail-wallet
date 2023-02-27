import { map } from "lodash";
import { Col, Row } from "react-bootstrap";
import { HomePageCard } from "../../../components/cards";
import { HomePageCardsList } from "../../../consts/";
import classnames from "classnames";
import { GlobalStateContext } from "../../../contexts";
import { useContext } from "react";

const FeatureCards = () => {
  const { isDarkTheme } = useContext(GlobalStateContext);

  return (
    <Row
      className={classnames("rounded-3 pt-3 mt-4", {
        "bg-white": !isDarkTheme,
        "bg-transparent": !isDarkTheme,
      })}
    >
      {map(HomePageCardsList, (item) => (
        <Col xs="12" md="6" className="h-100">
          <HomePageCard
            className={classnames({
              "bg-light": !isDarkTheme,
            })}
            item={item}
          />
        </Col>
      ))}
    </Row>
  );
};

export default FeatureCards;
