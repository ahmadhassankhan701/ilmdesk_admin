import { useState, useEffect } from "react";
import { Backdrop, Card, Grid } from "@mui/material";
import { db } from "../../firebase"; // Firebase config
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useNavigate } from "react-router-dom";
import CourseCard from "./theory/components/CourseCard";
import MDButton from "components/MDButton";
import { toast } from "react-toastify";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const loaderImage = "/loader.gif";

  const fetchData = async () => {
    const ref = collection(db, "CourseTheory");
    const snapshot = await getDocs(ref);
    let allCourses = [];
    if (snapshot.size > 0)
      snapshot.docs.forEach((doc) => allCourses.push({ key: doc.id, ...doc.data() }));
    setCourses(allCourses);
  };

  const handleEdit = (id) => {
    navigate(`/courses/theory/${id}`);
  };
  const handleDelete = async (courseId) => {
    try {
      const confirm = window.confirm(
        "Fatal! This will delete everything about this course. Are you sure?"
      );
      if (!confirm) return;

      setLoading(true);
      const docRef = doc(db, "CourseTheory", courseId);
      await deleteDoc(docRef);
      const q = query(collection(db, "CourseQuizzes"), where("courseId", "==", courseId));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((docSnap) => {
        return deleteDoc(doc(db, "CourseQuizzes", docSnap.id));
      });

      await Promise.all(deletePromises);
      fetchData();
      setLoading(false);
      toast.error("Course Deleted");
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <Backdrop open={loading} style={{ zIndex: 9999 }}>
        <img src={loaderImage} alt="loader" />
      </Backdrop>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox
                p={2}
                lineHeight={0}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <MDBox>
                  <MDTypography variant="h5">Course</MDTypography>
                  <MDTypography variant="button" color="text" fontWeight="regular">
                    Find data related to courses
                  </MDTypography>
                </MDBox>
                <MDButton
                  color={"secondary"}
                  variant={"contained"}
                  size={"small"}
                  onClick={() => navigate("/courses/theory/123")}
                >
                  Add New
                </MDButton>
              </MDBox>
              <div className="p-8 max-w-4xl mx-auto">
                <div className="flex gap-4 mb-6">
                  {courses.map((item) => (
                    <CourseCard
                      key={item.key}
                      title={item.title}
                      subject={item.subject}
                      price={item.price}
                      difficulty={item.difficulty}
                      handleEdit={() => handleEdit(item.key)}
                      handleDelete={() => handleDelete(item.key)}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Courses;
