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
} from "@mui/material";
import { db, storage } from "../../../firebase"; // Firebase config
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  where,
  query,
  getDocs,
  deleteDoc,
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
const EditClassesContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState({ youtubeLinks: [], pdfs: [] });
  const [quizzes, setQuizzes] = useState([]);
  const [theory, setTheory] = useState("");
  const [newYouTube, setNewYouTube] = useState("");
  const [loading, setLoading] = useState(false);
  const loaderImage = "/loader.gif";

  const fetchTopicContent = async () => {
    const docRef = doc(db, "ClassesTheory", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setContent({
        ...content,
        youtubeLinks: docSnap.data().youtubeLinks,
        pdfs: docSnap.data().pdfs,
      });
      setTheory(docSnap.data().theory);
    }
  };
  const fetchQuizzes = async () => {
    const quizzesRef = collection(db, "ClassQuizzes");
    const q = query(quizzesRef, where("topicId", "==", id));
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
      const docRef = doc(db, "ClassesTheory", id);
      const docSnap = await getDoc(docRef);
      const updatedContent = {
        theory,
        youtubeLinks: content.youtubeLinks,
        pdfs: content.pdfs,
      };
      if (docSnap.exists()) {
        await updateDoc(docRef, updatedContent);
      } else {
        await setDoc(docRef, updatedContent);
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
      const path = `ClassPDFFiles/${id}/${randomId()}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setContent({
        ...content,
        pdfs: [...content.pdfs, { name: filename, path, fileUrl: url }],
      });
      e.target.value = ""; // Reset the input field
      setLoading(false);
      toast.success("File uploaded. Remember to save the content.");
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
      const docRef = doc(db, "ClassesTheory", id);
      const docSnap = await getDoc(docRef);
      const updatedPdfs = docSnap.data().pdfs.filter((_, i) => i !== index);
      await updateDoc(docRef, { pdfs: updatedPdfs });
      setContent({
        ...content,
        pdfs: updatedPdfs,
      });
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
      const docRef = doc(db, "ClassQuizzes", quizId);
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
    navigate(`/classes/quiz/${id}/${quizId}`);
  };
  useEffect(() => {
    fetchTopicContent();
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
                <MDTypography variant="h5">Theory</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Add content here
                </MDTypography>
                <MDBox py={1} lineHeight={0}>
                  <div className="p-8 max-w-4xl mx-auto">
                    <MDTypography variant="h5" gutterBottom>
                      {content.name || "Topic Content"}
                    </MDTypography>

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
                      Add Content
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
                          const docRef = doc(db, "ClassesTheory", id);
                          const docSnap = await getDoc(docRef);
                          if (docSnap.exists()) {
                            navigate(`/classes/quiz/${id}/123`);
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

export default EditClassesContent;
