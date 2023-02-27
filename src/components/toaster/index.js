import classnames from "classnames";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { Toast } from "react-bootstrap";
import { ToasterContext } from "../../contexts";
const Toaster = () => {
  const {
    showToaster,
    setShowToaster,
    toasterText,
    setToasterText,
    isSuccess,
    setIsSuccess,
  } = useContext(ToasterContext);
  const { pathname } = useRouter();

  useEffect(() => {
    if (!showToaster) {
      //removing success class on toaster hide
      setTimeout(() => setIsSuccess(false), 1000);
    }
  }, [showToaster]);

  return (
    <Toast
      onClose={() => {
        setShowToaster(false);
        setToasterText("");
      }}
      show={showToaster}
      delay={8000}
      autohide
      className={classnames("toaster py-3 pe-2 w-75", {
        "position-fixed ": pathname !== "/transactions",
        "position-relative": pathname === "/transactions",
        "border-left-4-success": isSuccess,
        "border-left-4-danger": !isSuccess,
      })}
    >
      <Toast.Header className="border-0 d-flex align-items-center">
        <h6
          className="me-auto ms-2 mb-0"
          dangerouslySetInnerHTML={{ __html: toasterText }}
        ></h6>
      </Toast.Header>
    </Toast>
  );
};

export default Toaster;
