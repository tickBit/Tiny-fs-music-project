# Tiny full stack music project

Little full stack project to freshen a bit my forgotten React skills..

File uploader is based on the following tutorial: https://www.bezkoder.com/react-hooks-file-upload/

Disclamer: This is my first React project after 4 years, when I had one week assignment on React :-)

The app isn't perfect: For example, if you upload one file twice, the system might not work correctly yet.

## Instructions

- go to the backend drawer
- create virtual environment: python -m venv .venv
- activate the environment: .venv\Scripts\activate (I trust the Linux people know how to activate it :) )
- install the requirements: pip install -r requirements.txt
- python main.py starts the backend server
- PLEASE NOTICE, that you must CREATE "music" drawer onto the backend drawer in order the upload to work!

When the server on the backend is running, go to the fronend drawer. Install the Node modules:

- npm install
- (it installs many deprecated modules, please feel free to update them)
- start the frontend app: npm start

When the app is running, you can upload music to the backend server and play it from the frontend.

![Tiny-fs-music-project](https://github.com/tickBit/Tiny-fs-music-project/assets/61118857/0b6d32ef-2b2c-4b72-ae19-9f57634f90c1)

Music in the picture is written by me...

## Bugs

- if user presses delete at a tune, that is playing, the app doesn't work properly.. I'm trying to find time to fix this..
