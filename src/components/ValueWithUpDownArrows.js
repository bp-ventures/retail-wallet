import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";

const ValueWithUpDownArrows = ({ value, valuePostFix, emptyPlaceHolder }) => {
  if (!value) return emptyPlaceHolder ? emptyPlaceHolder : "";
  const isDecreasing = value < 0;
  return (
    <div
      className={classnames("text-success d-flex align-items-center", {
        "text-danger": isDecreasing,
      })}
    >
      <FontAwesomeIcon
        className="icon-sm me-1 rotate-z-40"
        icon={isDecreasing ? faArrowDown : faArrowUp}
      />
      {value}
      {valuePostFix}
    </div>
  );
};

export default ValueWithUpDownArrows;
