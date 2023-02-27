import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import { T } from "../translation";

const LinkWithIcon = ({
  onClick,
  title = T("general.open_link_new_tab"),
  children,
  className,
  icon = faExternalLinkAlt,
}) => {
  return (
    <a
      className={classnames("cursor-pointer", className, {
        "align-items-center d-flex": children,
      })}
      onClick={onClick}
      title={title}
    >
      {children}
      <FontAwesomeIcon
        className={classnames({
          "ms-1": children,
          "icon-xs text-muted mb-0": icon === faExternalLinkAlt,
        })}
        icon={icon}
      />
    </a>
  );
};

export default LinkWithIcon;
