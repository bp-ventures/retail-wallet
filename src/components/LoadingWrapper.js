import { Spinner } from "react-bootstrap";
import classnames from "classnames";

const LoadingWrapper = ({ isLoading, size, className, children }) => {
  return isLoading ? (
    <Spinner
      size={size}
      className={classnames("color-primary d-flex", className)}
      animation="border"
    />
  ) : (
    children
  );
};

export default LoadingWrapper;
