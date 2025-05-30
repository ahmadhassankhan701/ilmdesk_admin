/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import defaultImage from "assets/images/team-2.jpg"; // fallback image
import moment from "moment";

export default function authorsTableData(payments = [], handleReject, handleApprove) {
  const Author = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image || defaultImage} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  const Action = ({ paymentId, receipt, userId, courseId, status }) => (
    <MDBox display="flex" alignItems="center" gap={1}>
      <a
        href={receipt}
        target="_blank"
        rel="noreferrer"
        style={{
          textDecoration: "none",
        }}
      >
        <MDBadge
          badgeContent="View"
          color="secondary"
          variant="gradient"
          size="sm"
          sx={{ cursor: "pointer" }}
        />
      </a>
      {status === "pending" && (
        <MDBox>
          <MDBadge
            badgeContent="Accept"
            color="success"
            variant="gradient"
            size="sm"
            sx={{ cursor: "pointer" }}
            onClick={() => handleApprove(paymentId, userId, courseId)}
          />
          <MDBadge
            badgeContent="Reject"
            color="error"
            variant="gradient"
            size="sm"
            sx={{ cursor: "pointer" }}
            onClick={() => handleReject(paymentId)}
          />
        </MDBox>
      )}
    </MDBox>
  );

  return {
    columns: [
      { Header: "username", accessor: "username", width: "20%", align: "left" },
      { Header: "course name", accessor: "coursename", align: "left" },
      { Header: "amount", accessor: "amount", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "paid at", accessor: "paidAt", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: payments.map((payment) => ({
      username: <Author image={payment.userImage} name={payment.username} />,
      coursename: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {payment.courseName}
        </MDTypography>
      ),
      amount: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {payment.amount} Rs
        </MDTypography>
      ),
      status: (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent={payment.status}
            color={payment.status === "approved" ? "success" : "warning"}
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
      paidAt: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {moment(payment.paidAt.seconds * 1000).format("DD MMM, YYYY hh:mm A")}
        </MDTypography>
      ),
      action: (
        <Action
          paymentId={payment.key}
          receipt={payment.receipt}
          userId={payment.userId}
          courseId={payment.courseId}
          status={payment.status}
        />
      ),
    })),
  };
}
