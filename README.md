# Wine Reviews

Wine aroma wheel and scatter plot interactive visualization tool that helps user’s select wines of their preference. Created a flask web application to run this tool on server and hosted it on Google Cloud. Check the live demo in the below link:
https://winereviews.appspot.com/wine

This project is divided into 2 parts
a. Data Cleaning and Aroma Categorization: This folder contains code on data cleaning and aroma labeling using each wine description and aroma wheel.
b. WineReviewsVisualization: This folder contains code to create Interactive D3 Visualization using data generated in step 1.

How to run this application?

Run Locally:

To Run the application locally, you need to install python and
flask (pip install flask)

1) open command prompt from the "WineReviewsVisualization" folder
use command: python main.py

2) Application runs on a server

3) Go to Browser, type http://localhost:<portnumber>/wines
ex: http://127.0.0.1:5000/wines
 
 
How to host on Google cloud:
Please refer to the below link on hosting your flask application on google cloud(supports python 2.7.x versions only)
https://cloud.google.com/appengine/docs/standard/python/getting-started/python-standard-env

1. create virtual environment in project folder and activate it
python -m virtualenv env
env\Scripts\activate

2. create config files -  app.yaml, appengine_config.py, and requirements.txt(check these files in WineReviewsVisualization folder)

3. install requirements in project folder:
pip install -t lib -r requirements.txt

deploy on cloud:
gcloud app deploy --project winereviews

browse on web: 
gcloud app browse --project=winereviews
