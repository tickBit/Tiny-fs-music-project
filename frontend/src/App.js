import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FileUpload from "./components/FileUpload";

function App() {

  return (
    <div className="container" style={{ width: "600px" }}>
      <div className="my-3">
        <h3>Tiny full stack music project</h3>
      </div>

      <FileUpload />
    </div>
  );
}

export default App;
