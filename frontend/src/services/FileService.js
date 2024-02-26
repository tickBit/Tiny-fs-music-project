import http from "./http-common";

const upload = (file, onUploadProgress) => {
  let formData = new FormData();

  formData.append("file", file);

  return http.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
}

const play = (id) => { 
  return http.get(`http://127.0.0.1:5000/play/${id}`);
};

const stop = () => {
  return http.get("http://127.0.0.1:5000/stop");
};

// eslint-disable-next-line
export default {
  upload,
  play,
  stop
};
