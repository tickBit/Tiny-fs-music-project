from flask import request, jsonify
from config import app, db
from models import Musics
import vlc
import os

p = None

@app.route("/musics", methods=["GET"])
def get_musics():
    musics = Musics.query.all()
    json_musics = list(map(lambda x: x.to_json(), musics))
    return jsonify({"tunes": json_musics})

@app.route("/stop", methods=["GET"])
def stop_music():
    global p

    if p != None:
        p.stop()
        p = None

    return jsonify({"message": "Stopped playing."}), 200

@app.route("/play/<int:tune_id>", methods=["GET"])
def play_music(tune_id):
    global p

    tune = db.session.get(Musics, tune_id)
    
    if p != None:
        p.stop()
        p = None
    p = vlc.MediaPlayer(tune.file_path)
    p.play()

    return jsonify({"message": "Playing: " + tune.tune_name})

@app.route("/upload", methods=["POST"])
def upload():

    if 'file' not in request.files:
        return 'No file part'
    
    file = request.files['file']

    if file.filename == '':
        return 'No selected file' 

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    
    name = file.filename
    new_tune = Musics(tune_name=name, file_path=file_path)
     
    try:
        db.session.add(new_tune)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    try:
        file.save(file_path)
        file.close()
    except Exception as e:
        db.session.rollback()
        return jsonify({"Writing music to server failed:": str(e)}), 400
    
    return jsonify({"message": "New music added!"}), 201

@app.route("/delete_music/<int:tune_id>", methods=["DELETE"])
def delete_music(tune_id):

    tune = db.session.get(Musics, tune_id)

    if not tune:
        return jsonify({"message": "Tune not found"}), 404

    db.session.delete(tune)
    db.session.commit()

    try:
        os.remove(tune.file_path)
    except Exception as e:
        db.session.rollback()
        return jsonify({"Deleting the music from the server failed:": str(e)}), 500
    
    return jsonify({"message": "Tune deleted!"}), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
