from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origin="*")


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///musicdatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
app.config["UPLOAD_FOLDER"] = "./music/"
app.config["confirm_deleted_rows"] = False

db = SQLAlchemy(app)
