# Tiny full stack music project

Little full stack project to freshen a bit my forgotten React skills..

File uploader is based on the following tutorial:
https://www.bezkoder.com/react-hooks-file-upload/

Disclamer: This is my first React project after 4 years, when I had one week assignment on React :-)

The app isn't perfect: For example, if you upload one file twice, the system might not work correctly yet.

## Instructions

- go to the backend drawer
- create virtual environment: python -m venv .venv
- activate the environment: .venv\Scripts\activate (I trust the Linux people know how to activate it :) )
- install the requirements: pip install -r requirements.txt
- python main.py starts the backend server
- PLEASE NOTICE, that you must CREATE "music" drawer into the backend drawer in order the upload to work!

When the server on the backend is running, go to the fronend drawer. Install the Node modules:

- npm install
- (it installs many deprecated modules, please feel free to update them)
- start the frontend app: npm start

When the app is running, you can upload music to the backend server and play it from the frontend..
