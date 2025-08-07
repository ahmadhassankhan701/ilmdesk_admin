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

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/payments/data/authorsTableData";
import { useEffect, useState } from "react";
import { arrayUnion, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Backdrop } from "@mui/material";
import { db } from "../../firebase";
function Tables() {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const loaderImage = "/loader.gif";
  useEffect(() => {
    fetchContent();
  }, []);
  const fetchContent = async () => {
    try {
      setLoading(true);
      const docsRef = collection(db, "Payments");
      const snapshot = await getDocs(docsRef);
      if (snapshot.size === 0) {
        setLoading(false);
        toast.error("No data found");
        return;
      }
      let items = [];
      snapshot.docs.forEach((doc) => {
        const data = {
          key: doc.id,
          userId: doc.data().userId,
          courseId: doc.data().courseId,
          username: doc.data().userName || "John Doe",
          userImage: "", // or valid URL
          courseName: doc.data().courseName || "Chemistry Basics",
          amount: doc.data().amount,
          status: doc.data().status,
          paidAt: doc.data().paidAt,
          receipt: doc.data().receiptUrl,
        };
        items.push(data);
      });
      setPayments(items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  const handleReject = async (payId) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return false;
    try {
      setLoading(true);
      const docRef = doc(db, `Payments/${payId}`);
      await deleteDoc(docRef);
      toast.error("Payment Rejected");
      const updatedPayments = [...payments];
      const filtered = updatedPayments.filter((pay) => pay.key !== payId);
      setPayments(filtered);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Could not delete");
      console.log(error);
    }
  };
  const handleApprove = async (payId, userId, courseId) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return false;
    try {
      setLoading(true);
      const docRef = doc(db, `Payments/${payId}`);
      const courseRef = doc(db, `courses/${courseId}`);
      await updateDoc(docRef, { status: "approved", confirmedAt: new Date() });
      await updateDoc(courseRef, {
        students: arrayUnion(userId),
      });
      fetchContent();
      toast.success("Payment Approved");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Could not approve. Try again");
      console.log(error);
    }
  };
  const { columns, rows } = authorsTableData(payments, handleReject, handleApprove);

  return (
    <DashboardLayout>
      <Backdrop open={loading} style={{ zIndex: 9999 }}>
        <img src={loaderImage} alt="loader" />
      </Backdrop>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Payments Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
