from __future__ import annotations
from config import db

class Musics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tune_name = db.Column(db.String(160), unique=False, nullable=False)
    file_path = db.Column(db.String(255), unique=False, nullable=False)
    comments = db.relationship('Comments', backref='musics')

    def __repr__(self):
        return f'{str(self.tune_name)}'

    def to_json(self):
        return {
            "id": self.id,
            "tuneName": self.tune_name,
            "filePath": self.file_path,
            "comments": self.comments,
        }
    
class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('musics.id'))
    content = db.Column(db.Text)

    #def __repr__(self):
    #    return f'{str(self.content)}'

    def to_json(self):
        return {
            "id": self.id,
            "content": self.content,
            "postId": self.post_id,
        }
