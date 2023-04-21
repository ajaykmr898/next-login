import Link from "next/link";
import { useState, useEffect } from "react";

import { Spinner } from "components";
import { Layout } from "components/users";
import { userService } from "services";

export default Index;

function Index() {
  const [files, setFiles] = useState(null);

  function readInput(input) {
    const dt = new DataTransfer();
    if (input.files && input.files[0]) {
      for (let i = 0; i < input.files.length; i++) {
        let file = input.files[i];
        let fileName = file.name;
        let fi = fileName.split(".");
        let fls = fi.length;
        let fe = fi[fls - 1];
        if (fls > 1 && fe.includes("M")) {
          dt.items.add(file);
        }
      }
      input.files = dt.files;
      setFiles(input.files);
    }
  }

  function deleteItem(index) {
    const dt = new DataTransfer();
    const input = document.getElementById("filesInput");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (parseInt(index) !== i) {
        dt.items.add(file);
      }
    }

    input.files = dt.files;
    setFiles(input.files);
    console.log(input.files);
  }

  function getFileName(f) {
    let nameL = f.name.length;
    let nameS = f.name;
    let nameF = "";
    if (nameL > 25) {
      nameS = f.name.substring(0, 20);
      nameF = "..." + f.name.substring(f.name.length - 4, f.name.length);
    }
    return nameS + nameF;
  }

  return (
    <Layout>
      <form id="uploadFile" method="POST" encType="multipart/form-data">
        <div id="FileUpload">
          <div className="wrapper">
            <div className="image-upload-wrap">
              <input
                id="filesInput"
                className="file-upload-input"
                type="file"
                name="files[]"
                accept=".M*"
                multiple
                onChange={(event) => {
                  readInput(event.target);
                }}
              />
              <div className="drag-text">
                <h3>Drag and drop files or click to upload</h3>
              </div>
            </div>
          </div>
          {files &&
            files.length > 0 &&
            Object.keys(files).map((f, i) => (
              <div key={i} className="uploaded">
                <div className="file">
                  <div className="file__name">
                    <i className="fa fa-file delete"></i>
                    <p>{getFileName(files[i])}</p>
                    <i
                      className="fas fa-times delete"
                      onClick={() => deleteItem(i)}
                    ></i>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </form>
      <div id="filenames"></div>
      <button type="button" className="w-100 btn btn-lg btn-warning">
        Upload
      </button>
    </Layout>
  );
}
