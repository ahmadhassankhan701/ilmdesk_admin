import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { db, storage } from "../../../firebase"; // Firebase config
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import {
  AddCircleOutline,
  ArrowCircleRight,
  Camera,
  Cancel,
  Delete,
  Edit,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "@emotion/styled";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ReactQuillComp from "components/ReactQuillComp";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CourseModules = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [editValue, setEditValue] = useState({
    name: "",
    id: null,
  });
  const [details, setDetails] = useState({
    title: "",
    subject: "",
    price: "0",
    image: "",
    difficulty: "beginner",
    desc: "",
  });
  const fetchHierarchy = async () => {
    const ref = doc(db, "courses", id);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
      return;
    }
    const courseData = snapshot.data();
    console.log(courseData);
    if (courseData) {
      setDetails({
        title: courseData.title,
        subject: courseData.subject,
        price: courseData.price,
        image: courseData.image,
        difficulty: courseData.difficulty,
        desc: courseData.desc || "",
      });
      setModules(courseData.modules || []);
    }
  };
  const handleAdd = async () => {
    const ref = doc(db, "courses", id);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
      toast.error("Please submit course details first");
      return;
    }
    const trimmedName = newItemName.trim();
    if (!trimmedName) {
      toast.error("Module name cannot be empty");
      return;
    }
    const courseRef = doc(db, "courses", id);
    // Check if the module already exists
    const existingModule = modules.find(
      (module) => module.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existingModule) {
      toast.error("Module with this name already exists");
      return;
    }
    const dataToAdd = {
      name: trimmedName,
      createdAt: new Date(),
      id: randomId(),
    };
    // Update the course document to add the new module
    await updateDoc(courseRef, {
      modules: [...modules, dataToAdd],
    });
    setModules((prev) => [...prev, dataToAdd]);
    setNewItemName("");
  };
  const handleImageInput = async (e) => {
    try {
      setImageLoading(true);
      const file = e.target.files[0];
      if (file === undefined || file === null) {
        return;
      }
      const formData = new FormData();
      formData.append("document", file);
      const filedata = [...formData];
      const filename = filedata[0][1].name;
      const fileExtension = filename.split(".").pop();
      const fileSize = filedata[0][1].size;
      if (fileExtension !== "png" && fileExtension !== "jpg" && fileExtension !== "jpeg") {
        setImageLoading(false);
        toast.error("File type should be png, jpg or jpeg");
        return;
      }
      if (fileSize > 2000000) {
        setImageLoading(false);
        toast.error("File size should not exceed 2MB");
        return;
      }
      const path = `CoursesImages/${randomId()}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setDetails({ ...details, image: url });
      setImageLoading(false);
      toast.success("Image uploaded successfully");
    } catch (error) {
      setImageLoading(false);
      toast.error("Error uploading image");
      console.log(error);
    }
  };
  const randomId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  useEffect(() => {
    fetchHierarchy();
  }, []);

  const handleDelete = async (moduleId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this module? This will delete relevant data."
    );
    if (!confirm) return;
    const courseRef = doc(db, "courses", id);
    const courseDocRef = doc(db, "CourseTheory", moduleId);
    const quizzesRef = collection(db, "CourseQuizzes");
    // Delete all quizzes associated with this module
    const quizzesQuery = query(quizzesRef, where("moduleId", "==", moduleId));
    const quizzesSnapshot = await getDocs(quizzesQuery);
    // Update the course document to remove the module
    await updateDoc(courseRef, {
      modules: modules.filter((module) => module.id !== moduleId),
    });
    // Delete the document
    await deleteDoc(courseDocRef);
    const deleteQuizPromises = quizzesSnapshot.docs.map((quizDoc) =>
      deleteDoc(doc(quizzesRef, quizDoc.id))
    );
    await Promise.all(deleteQuizPromises);
    // Remove the module from the local state
    setModules((prev) => prev.filter((module) => module.id !== moduleId));
  };
  const handleEdit = async () => {
    if (!editValue.name.trim()) {
      toast.error("Module name cannot be empty");
      return;
    }
    const courseRef = doc(db, "courses", id);
    // Update the course document to change the module name
    await updateDoc(courseRef, {
      modules: modules.map((module) =>
        module.id === editValue.id ? { ...module, name: editValue.name } : module
      ),
    });
    const updatedModules = modules.map((module) =>
      module.id === editValue.id ? { ...module, name: editValue.name } : module
    );
    setModules(updatedModules);
    // Clear the edit value and refresh the hierarchy
    setEditValue({ name: "", id: null });
    setNewItemName(""); // Clear new item input when editing
  };
  const handleSubmit = async () => {
    if (!details.title.trim() || !details.subject.trim()) {
      toast.error("Course title and subject cannot be empty");
      return;
    }
    if (!details.image) {
      toast.error("Please upload a course image");
      return;
    }
    if (isNaN(details.price) || details.price < 0) {
      toast.error("Price must be a valid number greater than or equal to 0");
      return;
    }
    if (!details.desc || details.desc.trim() === "") {
      toast.error("Course description cannot be empty");
      return;
    }
    const courseRef = doc(db, "courses", id);
    try {
      // Check if the course already exists
      const courseSnapshot = await getDoc(courseRef);
      if (!courseSnapshot.exists()) {
        await addDoc(collection(db, "courses"), {
          title: details.title,
          subject: details.subject,
          price: details.price,
          image: details.image,
          difficulty: details.difficulty,
          desc: details.desc,
          modules: [],
        });
      } else {
        await updateDoc(courseRef, {
          title: details.title,
          subject: details.subject,
          price: details.price,
          image: details.image,
          difficulty: details.difficulty,
          desc: details.desc,
        });
      }
      toast.success("Course details updated successfully");
      navigate(-1); // Navigate back to the previous page
    } catch (error) {
      console.error("Error updating course details:", error);
      toast.error("Failed to update course details");
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2} lineHeight={0}>
                <MDTypography variant="h5">Course Modules</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Find the modules for your course below. You can add, edit, or delete the modules
                  needed.
                </MDTypography>
              </MDBox>
              <div className="p-8 max-w-4xl mx-auto">
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"column"}
                >
                  <Avatar src={details.image} sx={{ width: 150, height: 150, mx: "auto" }} />
                  {/* <img src={details.image} alt="course profile" width={200} height={150} /> */}
                  {imageLoading ? (
                    <CircularProgress color="primary" />
                  ) : (
                    <IconButton
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      onChange={(e) => handleImageInput(e)}
                    >
                      <Camera />
                      <VisuallyHiddenInput type="file" accept="image/png, image/gif, image/jpeg" />
                    </IconButton>
                  )}
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  gap={1}
                  m={2}
                >
                  <TextField
                    id="outlined-basic"
                    label="Course Title"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ style: { fontSize: 14 } }}
                    sx={{
                      ".MuiInputBase-input": { fontSize: "0.9rem" },
                      mb: 2,
                    }}
                    inputProps={{
                      style: {
                        height: "20px",
                      },
                    }}
                    value={details.title}
                    onChange={(e) => setDetails({ ...details, title: e.target.value })}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Subject"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ style: { fontSize: 14 } }}
                    sx={{
                      ".MuiInputBase-input": { fontSize: "0.9rem" },
                      mb: 2,
                    }}
                    inputProps={{
                      style: {
                        height: "20px",
                      },
                    }}
                    value={details.subject}
                    onChange={(e) => {
                      const val = e.target.value;
                      const newValue = val.toLowerCase().trim();
                      setDetails({ ...details, subject: newValue });
                    }}
                  />
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  gap={1}
                  m={2}
                >
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label" sx={{ fontSize: 14 }}>
                      Difficulty
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Difficulty"
                      sx={{ fontSize: 14, height: 44 }}
                      inputProps={{
                        style: {
                          height: "20px",
                        },
                      }}
                      value={details.difficulty || ""}
                      onChange={(e) => setDetails({ ...details, difficulty: e.target.value })}
                    >
                      <MenuItem value={"beginner"} sx={{ fontSize: 14 }}>
                        Beginner
                      </MenuItem>
                      <MenuItem value={"intermediate"} sx={{ fontSize: 14 }}>
                        Intermediate
                      </MenuItem>
                      <MenuItem value={"expert"} sx={{ fontSize: 14 }}>
                        Expert
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    id="outlined-basic"
                    label="Price (Rs)"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ style: { fontSize: 14 } }}
                    sx={{
                      ".MuiInputBase-input": { fontSize: "0.9rem" },
                    }}
                    inputProps={{
                      type: "number",
                      style: {
                        height: "20px",
                      },
                    }}
                    value={details.price}
                    onChange={(e) => setDetails({ ...details, price: e.target.value })}
                  />
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  gap={1}
                  m={2}
                >
                  <ReactQuillComp
                    value={details.desc || ""}
                    setValue={(value) => setDetails((prev) => ({ ...prev, desc: value }))}
                    placeholder="Write course description here..."
                  />
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "green",
                    color: "#fff",
                    mx: 2,
                    "&:hover": { bgcolor: "darkgreen" },
                  }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
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
                    placeholder={`Add New Module`}
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                </MDBox>
                <div className="flex gap-4 mb-6">
                  {modules
                    ?.slice() // to avoid mutating original data
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .map((item) => (
                      <MDBox
                        key={item.id}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        p={2}
                        lineHeight={0}
                      >
                        <Card sx={{ mb: 1, width: "100%", cursor: "pointer" }}>
                          {editValue.id === item.id ? (
                            <MDBox
                              p={2}
                              display={"flex"}
                              alignItems={"center"}
                              justifyContent={"space-between"}
                              sx={{ width: "100%" }}
                            >
                              <OutlinedInput
                                fullWidth
                                value={editValue.name}
                                onChange={(e) =>
                                  setEditValue({ ...editValue, name: e.target.value })
                                }
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="save edit"
                                      edge="end"
                                      onClick={() => {
                                        handleEdit();
                                      }}
                                    >
                                      <ArrowCircleRight sx={{ color: "gray" }} />
                                    </IconButton>
                                    <IconButton
                                      aria-label="save edit"
                                      edge="end"
                                      onClick={() => {
                                        setEditValue({ name: "", id: null });
                                      }}
                                    >
                                      <Cancel sx={{ color: "gray" }} />
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                            </MDBox>
                          ) : (
                            <MDBox
                              p={2}
                              lineHeight={0}
                              display={"flex"}
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <MDTypography variant="h5">{item.name}</MDTypography>
                              <Box display={"flex"} gap={2}>
                                <ArrowCircleRight
                                  sx={{ color: "gray", cursor: "pointer" }}
                                  fontSize="medium"
                                  onClick={() => navigate(`/courses/theory/${item.id}/${id}`)}
                                />
                                <Edit
                                  sx={{ color: "gray", cursor: "pointer" }}
                                  fontSize="medium"
                                  onClick={() => {
                                    setEditValue({ name: item.name, id: item.id });
                                    setNewItemName(""); // Clear new item input when editing
                                  }}
                                />
                                <Delete
                                  sx={{ color: "gray", cursor: "pointer" }}
                                  fontSize={"medium"}
                                  onClick={() => handleDelete(item.id)}
                                />
                              </Box>
                            </MDBox>
                          )}
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

export default CourseModules;
