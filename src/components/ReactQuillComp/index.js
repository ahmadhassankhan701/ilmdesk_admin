import React, { useMemo, useRef } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
const ReactQuillComp = ({ value, setValue }) => {
  const quillRef = useRef();
  const randomId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const imageHandler = () => {
    try {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
      input.onchange = async () => {
        const file = input.files[0];
        const formData = new FormData();
        const quillObj = quillRef?.current?.getEditor();
        const range = quillObj?.getSelection();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");
        const storageRef = ref(storage, `ClassTheoryImages/${randomId()}`);
        await uploadBytes(storageRef, file);
        const imgUrl = await getDownloadURL(storageRef);
        quillObj?.editor?.insertEmbed(range.index, "image", imgUrl);
        const htmlContent = quillObj?.root?.innerHTML;
        setValue(htmlContent);
      };
    } catch (error) {
      console.log(error);
    }
  };
  const memoizedMods = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        [{ script: "sub" }, { script: "super" }],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };
  const memoizedFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "script",
    "link",
    "image",
  ];
  const modules = useMemo(() => memoizedMods, []);
  const formats = useMemo(() => memoizedFormats, []);

  return (
    <ReactQuill
      theme="snow"
      ref={quillRef}
      modules={modules}
      formats={formats}
      value={value}
      onChange={setValue}
      style={{
        width: "100%",
      }}
      placeholder="Write the description..."
    />
  );
};
ReactQuillComp.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};
export default ReactQuillComp;
