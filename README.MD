# Karaoke App

## Overview

The Karaoke App is a full-stack application that allows users to search for videos on YouTube and add them to a party playlist. The app is built with Node.js, Express.js, and MongoDB, and is deployed to Render.

## Environment Variables

The app requires the following environment variables to be set:

- `MONGO_URI`: the MongoDB connection string
- `YOUTUBE_API_KEY`: the YouTube API key
- `PORT`: the port number to listen on

## Getting Environment Variables

### MONGO_URI

To get the `MONGO_URI` environment variable, follow these steps:

1. Go to the MongoDB Atlas website and sign up for an account.
2. Create a new cluster and note the connection string.

### YOUTUBE_API_KEY

To get the `YOUTUBE_API_KEY` environment variable, follow these steps:

1. Go to the Google Cloud Console website and sign up for an account.
2. Create a new project and navigate to the API Library page.
3. Search for the YouTube Data API v3 and click on the result.
4. Click on the "Enable" button and follow the instructions to create credentials for your project.
5. Note the API key.

### PORT

You can set the `PORT` environment variable to any value you like. The default value is 5000.

## Running the Project

To run the project, you'll need to install the dependencies and start the server. Here are the steps to follow:

1. Clone the repository and navigate to the project directory.
2. Install the dependencies with `npm install`.
3. Set the environment variables using the following commands:

## Deploy

The app is deployed on the [render](https://render.com/) website at the following URI: <https://backend-karaoke-app.onrender.com>
