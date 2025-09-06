import { Page, Text, View, Document, Image, Svg, Circle, PDFViewer } from "@react-pdf/renderer";
import { styles } from "./PDFStyles";
import { Box, IconButton, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import PropTypes from "prop-types";
const style = {
  width: "100%",
  height: "100%",
  bgcolor: "lightgray",
  border: "none",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  overflow: "auto",
};
const CircularProgress = ({ percentage, radius = 100, strokeWidth = 5 }) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${((percentage + 1) / 100) * circumference} ${circumference}`;

  return (
    <Svg width={radius * 2} height={radius * 2}>
      <Circle
        cx={radius}
        cy={radius}
        r={radius - strokeWidth / 2}
        stroke="#ccc"
        strokeWidth={strokeWidth}
        fill="#fff"
      />
      <Circle
        cx={radius}
        cy={radius}
        r={radius - strokeWidth / 2}
        stroke="red"
        strokeWidth={strokeWidth}
        fill="#fff"
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        transform={`rotate(-90 ${radius} ${radius})`}
        style={{ transition: "stroke-dasharray 0.3s ease 0s" }}
      />
      <Text
        x={radius}
        y={radius}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: 20, color: "green" }}
      >
        {`${percentage}%`}
      </Text>
    </Svg>
  );
};
function PDFQuizDownload({ result, open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };
  const logo = "/ilmlogo.png"; // Replace with the path to your logo image
  const sadImage = "/sad.jpg";
  const happyImage = "/happy.jpg";
  const ResultPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.brand}>
          <View>
            <Image src={logo} style={styles.brandImage} />
          </View>
          <View style={styles.spaceY}>
            <Text style={styles.textBold}>IlmDesk</Text>
            <Text>The Leading Global Marketplace for Learning and Instruction</Text>
            <Text>Near Shaukat Khanum Hospital, Lahore, Punjab</Text>
          </View>
        </View>
        {result &&
          result.length > 0 &&
          result.map((summary, index) => (
            <View style={{ height: "100%" }} key={index}>
              <View
                style={{
                  width: "100%",
                  height: "90%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ display: "flex", gap: 10, flexDirection: "column" }}>
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: "25px",
                          fontWeight: "700",
                          color: "#000",
                          marginBottom: 5,
                        }}
                      >
                        {summary.studentName.toUpperCase()}
                      </Text>
                      <Text
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "gray",
                          marginBottom: 5,
                        }}
                      >
                        Student ID: {summary.studentId}
                      </Text>
                      <Text
                        style={{
                          fontSize: "18px",
                          fontWeight: "500",
                          color: "gray",
                          marginBottom: 2,
                        }}
                      >
                        Points: {summary.correct} / {summary.correct + summary.incorrect}
                      </Text>
                    </View>
                    {summary.percentage > 50 ? (
                      <Image
                        src={happyImage}
                        style={{ width: 150, height: 150, borderRadius: 20 }}
                        alt="happy"
                      />
                    ) : (
                      <Image
                        src={sadImage}
                        style={{ width: 200, height: 200, borderRadius: 20 }}
                        alt="sad"
                      />
                    )}
                  </View>
                  <View
                    style={{
                      width: "100%",
                      borderWidth: 2,
                      borderColor: "lightgray",
                      marginTop: 5,
                      marginBottom: 2,
                    }}
                  />
                  <View
                    style={{
                      width: "80%",
                      borderWidth: 2,
                      borderColor: "lightgray",
                      marginTop: 5,
                      marginBottom: 2,
                    }}
                  />
                </View>

                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <CircularProgress percentage={summary.percentage} />
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "gray",
                      marginBottom: 1,
                      marginTop: 5,
                    }}
                  >
                    Answers
                  </Text>
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                      marginTop: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color: "gray",
                        marginBottom: 1,
                      }}
                    >
                      Attempted
                    </Text>
                    <Text
                      style={{
                        borderRadius: 50,
                        backgroundColor: "gray",
                        padding: 10,
                        color: "#fff",
                      }}
                    >
                      {summary.attempted}
                    </Text>
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "gray",
                        marginBottom: 1,
                      }}
                    >
                      Correct
                    </Text>
                    <Text
                      style={{
                        borderRadius: 50,
                        backgroundColor: "gray",
                        padding: 10,
                        color: "#fff",
                      }}
                    >
                      {summary.correct}
                    </Text>
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "gray",
                        marginBottom: 1,
                      }}
                    >
                      Incorrect
                    </Text>
                    <Text
                      style={{
                        borderRadius: 50,
                        backgroundColor: "gray",
                        padding: 10,
                        color: "#fff",
                      }}
                    >
                      {summary.incorrect}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
      </Page>
    </Document>
  );
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={style}>
          <Box
            height={"100vh"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"flex-end"}
              width={"100%"}
              bgcolor={"rgb(60, 60, 60)"}
            >
              <IconButton
                onClick={handleClose}
                size="small"
                sx={{
                  zIndex: 2,
                  color: "red",
                  mr: 3,
                  mt: 1,
                  bgcolor: "gray",
                }}
                color="gray"
              >
                <Close sx={{ color: "#fff", fontSize: 13 }} />
              </IconButton>
            </Box>
            <PDFViewer width="100%" height="100%" frameBorder={0}>
              <ResultPDF />
            </PDFViewer>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

// Setting default values for the props of Bill
PDFQuizDownload.defaultProps = {
  noGutter: false,
};
CircularProgress.defaultProps = {
  noGutter: false,
};
// Typechecking props for the Bill
CircularProgress.propTypes = {
  percentage: PropTypes.number.isRequired,
  radius: PropTypes.number,
  strokeWidth: PropTypes.number,
};
PDFQuizDownload.propTypes = {
  result: PropTypes.arrayOf(PropTypes.object).isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
export default PDFQuizDownload;
