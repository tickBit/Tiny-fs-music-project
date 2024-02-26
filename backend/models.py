from config import db

class Musics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tune_name = db.Column(db.String(160), unique=False, nullable=False)
    file_path = db.Column(db.String(255), unique=False, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "tuneName": self.tune_name,
            "filePath": self.file_path,
        }