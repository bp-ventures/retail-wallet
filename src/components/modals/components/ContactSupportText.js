import { T } from "../../translation";
import React from "react";

const ContactSupportText = ({ className, email }) => {
  return (
    <p className={`mb-0 ${className}`}>
      <small>
        <T>transactions.having_issues_with_your_transaction</T>
        <br />
        <T>transactions.contact_anchor_support_at</T> <a href={`mailto:${email}`}>{email}</a>
      </small>
    </p>
  );
};

export default ContactSupportText;
