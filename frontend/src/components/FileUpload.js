import React, { useState, useEffect } from "react";
import Service from "../services/FileService";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';


const UploadFiles = () => {

    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [files, setMusics] = useState([]);
    const [playing, setPlayState] = useState(false);
    const [tunePlaying, setTunePlaying] = useState(0);

    const selectFile = (event) => {
      setSelectedFiles(event.target.files);
    };

    const upload = () => {
      let currentFile = selectedFiles[0];
  
      setProgress(0);
      setCurrentFile(currentFile);
  
      Service.upload(currentFile, (event) => {
        setProgress(Math.round((100 * event.loaded) / event.total));
      })
        .then((response) => {
          setMessage(response.data.message);
        }).then(() => {
          updateFiles();
        })
        .catch(() => {
          setProgress(0);
          setMessage("Could not upload the file!");
          setCurrentFile(undefined);          
        });

      setSelectedFiles(undefined);

    };
  
    useEffect(() => {
      fetchMusics()
    }, []);

  const fetchMusics = async () => {
      const response = await fetch("http://127.0.0.1:5000/musics");
      const data = await response.json();
      setMusics(data.tunes);
    };

  const updateFiles = () => {
      fetchMusics();
    };

  // delete selected tune
  const onDelete = async (id) => {
        
      try {
          const options = {
              method: "DELETE"
          }
          const response = await fetch(`http://127.0.0.1:5000/delete_music/${id}`, options);
          if (response.status === 200) {
              updateFiles();

          } else {
              console.error("Failed to delete")
          }
      } catch (error) {
          alert(error);
      }    
  }

  // play selected tune
  const playTune = (tune_id) => {
    
      Service.play(tune_id, (response) => {
      }).then((response) => {
        setMessage(response.data.message);
        
      }).catch(() => {
          setMessage("Could not play the tune!"); 
        });
    }

  // stop play the music
  const stopMusic = () => {
    Service.stop((response) => {
    }).then((response) => {
      setMessage(response.data.message);
    }).catch(() => {
      setMessage("Could not stop playing the tune!");
    });
  }

  // change button to play/stop
  const handleButtonClick = (event, file_id) => {
    if (playing === false) {
      playTune(file_id);
      event.target.textContent = "Stop";
      setPlayState(true);
      setTunePlaying(file_id);

    }
    
    if (playing === true && tunePlaying !== file_id && event.target.textContent === "Play") {
      playTune(file_id);
      const btn = document.getElementById("btn"+tunePlaying);
      btn.textContent = "Play";
      event.target.textContent = "Stop";
      setTunePlaying(file_id);
    }
  
    if (playing === true && tunePlaying === file_id && event.target.textContent === "Play") {
      playTune(file_id);
      event.target.textContent = "Play";
      setTunePlaying(file_id);
    }

    if (playing === true && tunePlaying === file_id && event.target.textContent === "Stop") {
      stopMusic();
      event.target.textContent = "Play";
      setPlayState(false);
      setTunePlaying(0);
    }
  }

  return (
    <div>
      {currentFile && (
        <div className="progress">
          <div
            className="progress-bar progress-bar-info progress-bar-striped"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}

      <label className="btn btn-default">
        <input type="file" onChange={selectFile} />
      </label>

      <button
        className="btn btn-success"
        disabled={!selectedFiles}
        onClick={upload}
      >
        Upload
      </button>

      <div className="alert alert-light" role="alert">
        {message}
      </div>

      <div>
            <h3>List of tunes</h3>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Tune</th>
          <th>Delete</th>
          <th>Play/Stop</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file, i) => (
            <tr key={file.id}>
            <td>{i+1}</td>
            <td>{file.tuneName}</td>
            <td><Button variant="primary" onClick={() => onDelete(file.id)}>Delete</Button></td>
            <td><Button id={"btn"+(file.id).toString()} variant="primary" onClick={(event) => handleButtonClick(event, file.id)}>Play</Button></td>
            </tr>
             ))}
      </tbody>
    </Table>
    </div>

    </div>
  );
}

export default UploadFiles;
