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
    const [comments, setComments] = useState([]);
    const [commentsOn, setCommentsOn] = useState(0);

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
          setComments([]);
        })
        .catch(() => {
          setProgress(0);
          setMessage("Could not upload the file!");
          setCurrentFile(undefined);          
        });

      setSelectedFiles(undefined);

    };
  
    useEffect(() => {
      fetchMusics();
      fetchComments();
    }, []);


  const fetchMusics = async () => {
      const response = await fetch("http://127.0.0.1:5000/musics");
      const data = await response.json();
      setMusics(data.tunes);
      
    };

  const fetchComments = async () => {
      const response = await fetch(`http://127.0.0.1:5000/comments`);
      const data = await response.json();
      setComments(data.comments);
  };

  const updateFiles = () => {
      fetchMusics();
      fetchComments();
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

  // delete selected tune
  const addComment = async (comment, tune_id) => {
        
    try {
        const options = {
            method: "POST"
        }
        const response = await fetch(`http://127.0.0.1:5000/add_comment/${comment}/${tune_id}`, options);
        if (response.status === 201) {
            console.log("New comment saved!");
            fetchComments();
        } else {
            console.error("Failed to delete");
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

  const handleAddCmtButtonClick = (event, file_id) => {
    let commentTxt = document.getElementById("txt"+file_id);
    addComment(commentTxt.value, file_id);
    commentTxt.value = "";
  }

  const handleCmtButtonClick = (file_id) => {
  if (commentsOn !== file_id) setCommentsOn(file_id); else setCommentsOn(0);
  }

  return (
    <div className="main">
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

  <div className="list">
            <h3>List of tunes</h3>
  <div>
    <Table className="htable" bordered>
    <thead>
        <tr>
          <th className="th1">#</th>
          <th className="th2">Tune</th>
          <th className="th3">Delete</th>
          <th className="th4">Play/Stop</th>
          <th className="th5">Comments</th>
        </tr>
      </thead>
    </Table>
      {files.map((file, i) => (
        <div key={"tdiv"+i}>
      <Table striped bordered hover>
      <tbody>
            <tr key={file.id}>
            <td className="th1">{i+1}</td>
            <td className="th2">{file.tuneName}</td>
            <td className="th3"><Button variant="primary" onClick={() => onDelete(file.id)}>Delete</Button></td>
            <td className="th4"><Button id={"btn"+(file.id).toString()} variant="primary" onClick={(event) => handleButtonClick(event, file.id)}>Play</Button></td>
            <td className="th5"><Button id={"cmt"+(file.id).toString()} variant="primary" onClick={() => handleCmtButtonClick(file.id)}>Comments</Button></td>
            </tr>
      </tbody>
      </Table>
        {commentsOn === file.id ?
          <div className="divComments">
          <h4>Comments</h4>
          {comments.map((comment, j) => (
            <div key={"divp"+(j+1)}>
              {comment.postId === file.id ?
            <p>{comment.content}</p>
                : null}
            </div>
          ))}
          <textarea className="commentArea" id={"txt"+(file.id).toString()}></textarea>
          <br/>
          <Button className="commentButton" id={"btncmt"+(file.id).toString()} variant="primary" onClick={(event) => handleAddCmtButtonClick(event, file.id)}>Add comment</Button> 
          
          </div>
          : null}
          </div>
          ))}
          </div>
          </div>
          </div>
  );    
}

export default UploadFiles;
