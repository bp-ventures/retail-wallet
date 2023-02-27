import { Spinner, Button } from "react-bootstrap";
import classnames from "classnames";
import { T } from "../translation";

const LoadingButton = ({
  disabled,
  isLoading,
  loadingText,
  variant,
  className,
  onClick,
  children,
}) => {
  return (
    <Button
      disabled={disabled || isLoading}
      variant={variant}
      className={className}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          {loadingText && <T>{loadingText}</T>}
          <Spinner
            className={classnames({
              "ms-2": loadingText,
            })}
            animation="border"
            role="status"
            size="sm"
          />
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
