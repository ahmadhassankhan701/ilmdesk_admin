import { useState, useEffect } from "react";
import { Card, Grid, Backdrop, Box } from "@mui/material";
import {
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { db } from "../../../firebase"; // Firebase config
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { Cancel, CloudUpload } from "@mui/icons-material";
import styled from "@emotion/styled";
import { toast } from "react-toastify";
import ReactQuillComp from "components/ReactQuillComp";
import * as XLSX from "xlsx";
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
const Quizzes = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    mode: "online",
    quizTitle: "",
    quizNumber: "",
    duration: "",
    difficulty: "beginner",
  });
  const [questions, setQuestions] = useState([
    { question: "", explanation: "", options: ["", "", "", ""], correctOption: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const loaderImage = "/loader.gif";

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctOption = value;
    setQuestions(updatedQuestions);
  };
  const handleExplanationChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].explanation = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctOption: 0 }]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const fetchQuiz = async () => {
    const docRef = doc(db, "CourseQuizzes", quizId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setDetails({
        ...details,
        mode: data.mode,
        difficulty: data.difficulty,
        quizTitle: data.quizTitle,
        quizNumber: data.quizNumber,
        duration: data.duration,
      });
      setQuestions(data.questions || []);
    }
  };

  const handleCreateQuiz = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "CourseQuizzes", quizId);
      const docSnap = await getDoc(docRef);
      const updatedContent = {
        ...details,
        questions,
        courseId,
      };
      if (docSnap.exists()) {
        await updateDoc(docRef, updatedContent);
      } else {
        const collecRef = collection(db, "CourseQuizzes");
        await addDoc(collecRef, updatedContent);
      }
      setLoading(false);
      toast.success("Quiz Added");
      navigate(-1);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  const handleFileInput = (e) => {
    try {
      setLoading(true);
      const file = e.target.files[0];
      const reader = new FileReader();

      if (file) {
        reader.onload = (event) => {
          const result = event.target.result;
          const workbook = XLSX.read(result, { type: "binary" });

          const allQuestions = [];

          workbook.SheetNames.forEach((sheet) => {
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

            const formattedQuestions = rows
              .map((row) => {
                const options = [
                  row["Option 1"] || "",
                  row["Option 2"] || "",
                  row["Option 3"] || "",
                  row["Option 4"] || "",
                ];
                if (
                  !row["Question"] ||
                  typeof row["Question"] !== "string" ||
                  !row["Question"].trim()
                ) {
                  return null;
                }
                if (!Array.isArray(options) || options.length < 2) {
                  return null;
                }
                if (!row["Correct Option"]) {
                  return null;
                }

                return {
                  question: row["Question"],
                  options,
                  correctOption: Math.max(0, Math.min(3, (row["Correct Option"] || 1) - 1)),
                  explanation: row["Explanation"] || "",
                };
              })
              .filter(Boolean);

            allQuestions.push(...formattedQuestions);
          });

          setQuestions((prev) => [...prev, ...allQuestions]);
          toast.success("Question Added");
        };
      }

      reader.readAsBinaryString(file);
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error parsing file:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuiz();
  }, [courseId && quizId]);
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
                <MDTypography variant="h5">Curriculum</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Find classes and relevant topics here
                </MDTypography>
                <MDBox py={1} lineHeight={0}>
                  <div className="p-8 max-w-4xl mx-auto">
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      gap={1}
                      mt={2}
                    >
                      <TextField
                        id="outlined-basic"
                        label="Quiz Title"
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
                        value={details.quizTitle}
                        onChange={(e) => setDetails({ ...details, quizTitle: e.target.value })}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Quiz Number"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ style: { fontSize: 14 } }}
                        sx={{
                          ".MuiInputBase-input": { fontSize: "0.9rem" },
                          mb: 2,
                        }}
                        inputProps={{
                          type: "number",
                          style: {
                            height: "20px",
                          },
                        }}
                        value={details.quizNumber}
                        onChange={(e) => setDetails({ ...details, quizNumber: e.target.value })}
                      />
                    </Box>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      gap={1}
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
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label" sx={{ fontSize: 14 }}>
                          Mode
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Mode"
                          sx={{ fontSize: 14, height: 44 }}
                          value={details.mode || ""}
                          onChange={(e) => setDetails({ ...details, mode: e.target.value })}
                        >
                          <MenuItem value={"online"} sx={{ fontSize: 14 }}>
                            Online
                          </MenuItem>
                          <MenuItem value={"offline"} sx={{ fontSize: 14 }}>
                            Offline
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {details.mode && details.mode === "online" && (
                        <TextField
                          id="outlined-basic"
                          label="Duration (mins)"
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
                          value={details.duration}
                          onChange={(e) => setDetails({ ...details, duration: e.target.value })}
                        />
                      )}
                    </Box>
                    <Box>
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        my={3}
                      >
                        <Typography
                          textAlign={"center"}
                          my={2}
                          fontSize={16}
                          fontWeight={"bold"}
                          color={"#212333"}
                        >
                          Add Questions
                        </Typography>
                        <Button
                          component="label"
                          role={undefined}
                          variant="contained"
                          tabIndex={-1}
                          startIcon={<CloudUpload />}
                          onChange={(e) => handleFileInput(e)}
                          size="small"
                          sx={{
                            color: "#A0AAB4",
                            backgroundColor: "primary.dark",
                            fontSize: 14,
                            textTransform: "none",
                            "&:hover": { backgroundColor: "primary.light" },
                          }}
                        >
                          Upload file
                          <VisuallyHiddenInput type="file" accept=".xlsx, .xls" />
                        </Button>
                      </Box>
                      {questions.map((q, qIndex) => (
                        <div key={qIndex} className="mb-4 p-4 border rounded">
                          <Card sx={{ mb: 2 }}>
                            <CardContent>
                              <Box
                                display={"flex"}
                                justifyContent={"flex-end"}
                                alignItems={"center"}
                              >
                                <IconButton onClick={() => removeQuestion(qIndex)}>
                                  <Cancel />
                                </IconButton>
                              </Box>
                              <TextField
                                fullWidth
                                label={`Question ${qIndex + 1}`}
                                value={q.question}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                sx={{ mb: 2 }}
                              />
                              {q.options.map((opt, oIndex) => (
                                <TextField
                                  key={oIndex}
                                  fullWidth
                                  label={`Option ${oIndex + 1}`}
                                  value={opt}
                                  onChange={(e) =>
                                    handleOptionChange(qIndex, oIndex, e.target.value)
                                  }
                                  sx={{ mb: 1 }}
                                />
                              ))}
                              <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Correct Option</InputLabel>
                                <Select
                                  value={q.correctOption}
                                  onChange={(e) =>
                                    handleCorrectOptionChange(qIndex, e.target.value)
                                  }
                                  sx={{ height: 44 }}
                                >
                                  {q.options.map((_, i) => (
                                    <MenuItem key={i} value={i}>
                                      Option {i + 1}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <ReactQuillComp
                                value={q.explanation || ""}
                                setValue={(val) => handleExplanationChange(qIndex, val)}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                      <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                        <Button
                          variant="contained"
                          onClick={addQuestion}
                          sx={{
                            mb: 3,
                            color: "#fff",
                            bgcolor: "green",
                            "&:hover": { bgcolor: "green" },
                          }}
                        >
                          Add Question
                        </Button>
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      color="primary"
                      onClick={handleCreateQuiz}
                      sx={{ color: "#fff" }}
                    >
                      Submit Quiz
                    </Button>
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

export default Quizzes;
