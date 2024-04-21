import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.scss";

const modules = {
  toolbar: [
    ["bold", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    [{ "code-block": "code-block" }],
  ],
};

const Editor = ({ value, onChange, placeholder }) => {
  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Editor;
