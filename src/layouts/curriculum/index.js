import { useState, useEffect } from "react";
import { Card, Grid, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { db } from "../../firebase"; // Firebase config
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { AddCircleOutline, UndoOutlined } from "@mui/icons-material";

const Curriculum = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [data, setData] = useState([]);
  const [newItemName, setNewItemName] = useState("");

  const fetchData = async (collectionName, field, value) => {
    const ref = collection(db, collectionName);
    const q = value ? query(ref, where(field, "==", value)) : ref;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };
  const fetchHierarchy = async () => {
    if (!selectedClass) setData(await fetchData("classes"));
    else if (!selectedSubject) setData(await fetchData("subjects", "classID", selectedClass));
    else if (!selectedBranch) setData(await fetchData("branches", "subjectID", selectedSubject));
    else if (!selectedChapter) setData(await fetchData("chapters", "branchID", selectedBranch));
    else setData(await fetchData("topics", "chapterID", selectedChapter));
  };

  const handleClick = (setter, id) => {
    if (setter) {
      setter(id);
      if (setter === setSelectedClass) setSelectedSubject(null);
      if (setter === setSelectedSubject) setSelectedBranch(null);
      if (setter === setSelectedBranch) setSelectedChapter(null);
    }
  };

  const goBack = () => {
    if (selectedChapter) setSelectedChapter(null);
    else if (selectedBranch) setSelectedBranch(null);
    else if (selectedSubject) setSelectedSubject(null);
    else if (selectedClass) setSelectedClass(null);
  };
  const handleAdd = async () => {
    const collectionName = selectedChapter
      ? "topics"
      : selectedBranch
      ? "chapters"
      : selectedSubject
      ? "branches"
      : selectedClass
      ? "subjects"
      : "classes";

    const dataToAdd = {
      name: newItemName,
      ...(selectedClass && { classID: selectedClass }),
      ...(selectedSubject && { subjectID: selectedSubject }),
      ...(selectedBranch && { branchID: selectedBranch }),
      ...(selectedChapter && { chapterID: selectedChapter }),
    };

    await addDoc(collection(db, collectionName), dataToAdd);
    setNewItemName("");
    fetchHierarchy();
  };
  const getCurrentLevel = () => {
    if (selectedChapter) return "Topic";
    if (selectedBranch) return "Chapter";
    if (selectedSubject) return "Branch";
    if (selectedClass) return "Subject";
    return "Class";
  };

  useEffect(() => {
    fetchHierarchy();
  }, [selectedClass, selectedSubject, selectedBranch, selectedChapter]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2} lineHeight={0}>
                <MDTypography variant="h5">Curriculum</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Find classes and relevant topics here
                </MDTypography>
                <MDBox p={1} lineHeight={0}>
                  {(selectedClass || selectedSubject || selectedBranch || selectedChapter) && (
                    <UndoOutlined sx={{ color: "gray", cursor: "pointer" }} onClick={goBack} />
                  )}
                </MDBox>
              </MDBox>
              <div className="p-8 max-w-4xl mx-auto">
                <MDBox
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  p={2}
                  lineHeight={0}
                >
                  <OutlinedInput
                    id="outlined-new-item"
                    type={"text"}
                    fullWidth
                    color={"primary"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton aria-label={"add item"} edge="end" onClick={handleAdd}>
                          {<AddCircleOutline sx={{ color: "gray" }} />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder={`Add New ${getCurrentLevel()}`}
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                </MDBox>
                <div className="flex gap-4 mb-6">
                  {data.map((item) => (
                    <MDBox
                      key={item.id}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      p={2}
                      lineHeight={0}
                      onClick={() =>
                        selectedChapter
                          ? (() => {})()
                          : handleClick(
                              selectedClass
                                ? selectedSubject
                                  ? selectedBranch
                                    ? setSelectedChapter
                                    : setSelectedBranch
                                  : setSelectedSubject
                                : setSelectedClass,
                              item.id
                            )
                      }
                    >
                      <Card sx={{ mb: 1, width: "100%", cursor: "pointer" }}>
                        <MDBox
                          p={2}
                          lineHeight={0}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <MDTypography variant="h5">{item.name}</MDTypography>
                        </MDBox>
                      </Card>
                    </MDBox>
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

export default Curriculum;
