import { useState, useEffect } from "react";
import {
  Card,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  CardContent,
  Typography,
  Button,
  Backdrop,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { db, storage } from "../../../firebase"; // Firebase config
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  where,
  query,
  getDocs,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddCircleOutline,
  Camera,
  Cancel,
  CloudUpload,
  RemoveCircleOutline,
  Visibility,
} from "@mui/icons-material";
import styled from "@emotion/styled";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import ReactQuillComp from "components/ReactQuillComp";
import QuizCard from "./components/QuizCard";
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
const CourseTheory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState({ youtubeLinks: [], pdfs: [] });
  const [details, setDetails] = useState({
    title: "",
    subject: "",
    price: "0",
    image: "",
    difficulty: "beginner",
  });
  const [quizzes, setQuizzes] = useState([]);
  const [theory, setTheory] = useState("");
  const [newYouTube, setNewYouTube] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const loaderImage = "/loader.gif";

  const fetchContent = async () => {
    const docRef = doc(db, "CourseTheory", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setContent({
        ...content,
        youtubeLinks: data.youtubeLinks,
        pdfs: data.pdfs,
      });
      setTheory(data.theory);
      setDetails({
        title: data.title,
        subject: data.subject,
        price: data.price,
        image: data.image,
        difficulty: data.difficulty,
      });
    }
  };
  const fetchQuizzes = async () => {
    const quizzesRef = collection(db, "CourseQuizzes");
    const q = query(quizzesRef, where("courseId", "==", id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size == 0) {
      return;
    }
    let quizzesData = [];
    querySnapshot.forEach((doc) => {
      quizzesData.push({ key: doc.id, ...doc.data() });
    });
    setQuizzes(quizzesData);
  };
  const handleAddContent = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "CourseTheory", id);
      const docSnap = await getDoc(docRef);
      const updatedContent = {
        ...details,
        theory,
        youtubeLinks: content.youtubeLinks,
        pdfs: content.pdfs,
      };
      if (docSnap.exists()) {
        await updateDoc(docRef, updatedContent);
      } else {
        const collecRef = collection(db, "CourseTheory");
        await addDoc(collecRef, updatedContent);
      }
      setLoading(false);
      toast.success("Data Added");
      navigate(-1);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
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
  const handleFileInput = async (e) => {
    try {
      const file = e.target.files[0];
      if (file === undefined || file === null) {
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("document", file);
      const filedata = [...formData];
      const filename = filedata[0][1].name;
      const path = `CoursePDFFiles/${id}/${randomId()}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      content.pdfs.push({
        name: filename,
        path,
        fileUrl: url,
      });
      setLoading(false);
      toast.success("File uploaded");
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  const handleRemove = async (path, index) => {
    try {
      setLoading(true);
      const fileRef = ref(storage, path);
      // Delete the file
      await deleteObject(fileRef);
      let tempArr = content.pdfs;
      tempArr.splice(index, 1);
      setContent({ ...content, pdfs: [...tempArr] });
      setLoading(false);
      toast.error("File deleted");
    } catch (error) {
      setLoading(false);
      toast.error("File not deleted");
      console.log(error);
    }
  };
  const handleQuizDelete = async (quizId) => {
    try {
      setLoading(true);
      const docRef = doc(db, "CourseQuizzes", quizId);
      await deleteDoc(docRef);
      fetchQuizzes();
      setLoading(false);
      toast.error("Quiz Deleted");
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  const handleQuizEdit = (quizId) => {
    navigate(`/courses/quiz/${id}/${quizId}`);
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
  useEffect(() => {
    fetchContent();
    fetchQuizzes();
  }, [id]);
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
              <MDBox p={2} lineHeight={0}>
                <MDTypography variant="h5">Course Theory</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Add content here
                </MDTypography>
                <MDBox py={1} lineHeight={0}>
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
                          <VisuallyHiddenInput
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                          />
                        </IconButton>
                      )}
                    </Box>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      gap={1}
                      mt={2}
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
                      mb={2}
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
                    <ReactQuillComp value={theory} setValue={setTheory} />
                    <OutlinedInput
                      id="outlined-youtube-link"
                      type={"text"}
                      fullWidth
                      color={"primary"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={"add item"}
                            edge="end"
                            onClick={() => {
                              content.youtubeLinks.push(newYouTube);
                              setNewYouTube("");
                            }}
                          >
                            {<AddCircleOutline sx={{ color: "gray" }} />}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder={`Add Video Code`}
                      value={newYouTube}
                      onChange={(e) => setNewYouTube(e.target.value)}
                      sx={{ my: 2 }}
                    />
                    {content.youtubeLinks?.map((link, index) => (
                      <Card sx={{ mb: 2 }} key={index}>
                        <MDBox>
                          <Cancel
                            sx={{ color: "gray", m: 2, cursor: "pointer" }}
                            onClick={() => {
                              let tempArr = content.youtubeLinks;
                              tempArr.splice(index, 1);
                              setContent({
                                ...content,
                                youtubeLinks: [...tempArr],
                              });
                            }}
                          />
                        </MDBox>
                        <CardContent>
                          <iframe
                            src={`https://www.youtube.com/embed/${link}`}
                            width="100%"
                            height="400"
                            title={`YouTube Video ${index + 1}`}
                          ></iframe>
                        </CardContent>
                      </Card>
                    ))}

                    <MDBox display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                      <MDTypography variant={"h5"} my={2} fontWeight={"bold"} color={"#212333"}>
                        Add PDF Files
                      </MDTypography>
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUpload />}
                        onChange={(e) => handleFileInput(e)}
                        sx={{
                          color: "#fff",
                          backgroundColor: "#FF0000",
                          "&:hover": { backgroundColor: "#E30B5C" },
                        }}
                      >
                        PDF file
                        <VisuallyHiddenInput type="file" accept="pdf" />
                      </Button>
                    </MDBox>
                    <MDBox my={2}>
                      {content.pdfs.map((item, index) => (
                        <MDBox
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          key={index}
                          mb={2}
                        >
                          <Typography variant={"h6"}>{item.name}</Typography>
                          <MDBox display={"flex"} gap={3}>
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                textDecoration: "none",
                                color: "#212333",
                              }}
                            >
                              <Visibility color="secondary" style={{ cursor: "pointer" }} />
                            </a>
                            <RemoveCircleOutline
                              onClick={() => handleRemove(item.path, index)}
                              color="error"
                              style={{ cursor: "pointer" }}
                            />
                          </MDBox>
                        </MDBox>
                      ))}
                    </MDBox>

                    <Button
                      variant="contained"
                      fullWidth
                      color="primary"
                      sx={{ mt: 2, color: "#fff" }}
                      onClick={handleAddContent}
                    >
                      Submit
                    </Button>
                    <MDBox
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      mt={2}
                    >
                      <MDTypography variant={"h5"} my={2} fontWeight={"bold"} color={"#212333"}>
                        Quizzes
                      </MDTypography>
                      <Button
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<AddCircleOutline />}
                        onClick={async () => {
                          const docRef = doc(db, "CourseTheory", id);
                          const docSnap = await getDoc(docRef);
                          if (docSnap.exists()) {
                            navigate(`/courses/quiz/${id}/123`);
                          } else {
                            toast.error("Please submit theory first");
                            return;
                          }
                        }}
                        sx={{
                          color: "#fff",
                          backgroundColor: "green",
                          "&:hover": { backgroundColor: "green" },
                        }}
                      >
                        Add New
                      </Button>
                    </MDBox>
                    {quizzes &&
                      quizzes.map((item) => (
                        <MDBox my={2} key={item.key}>
                          <QuizCard
                            title={item.quizTitle}
                            mode={item.mode}
                            duration={item.duration}
                            difficulty={item.difficulty}
                            handleDelete={() => handleQuizDelete(item.key)}
                            handleEdit={() => handleQuizEdit(item.key)}
                          />
                        </MDBox>
                      ))}
                  </div>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default CourseTheory;
