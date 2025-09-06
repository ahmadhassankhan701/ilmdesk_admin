import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "#262626",
    fontFamily: "Helvetica",
    fontSize: "12px",
    padding: "30px 50px",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
    marginTop: 10,
  },
  brand: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
    marginTop: 30,
  },
  brandImage: {
    width: 400,
    height: 200,
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
  },
  textBold: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  spaceY: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
  },
  billTo: {
    marginBottom: 10,
  },
});
