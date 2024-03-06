from flask import request, jsonify
from config import app, db
from models import Musics, Comments
import vlc
import os

playing = None

instance = vlc.Instance()
media_player = instance.media_list_player_new()

@app.route("/add_comment/<string:new_comment>/<int:tune_id>", methods=["POST"])
def add_comment(new_comment, tune_id):

    comment = Comments(content=new_comment, post_id=tune_id)

    try:
        db.session.add(comment)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"Comment added: ": "Ok"}), 201

@app.route("/comments", methods=["GET"])
def get_comments():
    comments = Comments.query.all()
    json_comments = list(map(lambda x: x.to_json(), comments))
    return jsonify({"comments": json_comments})

@app.route("/musics", methods=["GET"])
def get_musics():
    
    musics = Musics.query.all()
    
    # the following code is necessary to transform musics intro json string..
    data = list(map(lambda x: x.to_json(), musics))
    for d in data:
        d["comments"] = []
    
    return jsonify({"tunes": data}), 200

@app.route("/stop", methods=["GET"])
def stop_music():
    global media_player, playing

    if playing != None:
        media_player.stop()
        playing = None

    return jsonify({"message": "Stopped playing."}), 200

@app.route("/play/<int:tune_id>", methods=["GET"])
def play_music(tune_id):
    global playing, instance, media_player

    tune = db.session.get(Musics, tune_id)
    
    if playing != None:
        media_player.stop()
        playing = None

    file = tune.file_path
    
    media_list = instance.media_list_new([file])
    media_player.set_media_list(media_list)
    media_player.play()
    
    media_player.set_playback_mode(vlc.PlaybackMode.loop)

    playing = tune_id

    return jsonify({"message": "Playing: " + tune.tune_name}), 200

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
        return jsonify({"message": str(e)}), 500

    try:
        file.save(file_path)
        file.close()
    except Exception as e:
        db.session.rollback()
        return jsonify({"Writing music to server failed:": str(e)}), 500
    
    return jsonify({"message": "New music added!"}), 201

@app.route("/delete_music/<int:tune_id>", methods=["DELETE"])
def delete_music(tune_id):
    global playing, media_player

    if tune_id == playing:
        media_player.stop()
        playing = None

    tune = db.session.get(Musics, tune_id)

    if not tune:
        return jsonify({"message": "Tune not found"}), 404

    # Delete comments related to the tune from database
    comments = Comments.query.all()
    for comment in comments:
        if comment.post_id == tune_id:
            cmnt = db.session.get(Comments, comment.id)
            db.session.delete(cmnt)
            db.session.commit()

    # Delete tune from database
    try:
        db.session.delete(tune)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"Deleting from database failed: ": str(e)}), 500

    try:
        os.remove(tune.file_path)
    except Exception as e:
        db.session.rollback()
        return jsonify({"Deleting the music from the server failed:": str(e)}), 500

    if playing == None:
        return jsonify({"message": "Tune and its comments deleted!"}), 201
    else:
        return jsonify({"message": "Tune and its comments deleted!"}), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
