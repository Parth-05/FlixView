## Project Description
![image](https://github.com/Parth-05/FlixView/assets/102514687/ed88c63d-7934-4d40-ad4b-f66d6eb78b34)


This project is a user-friendly website designed to help users search for movies to watch. Utilizing the TMDB API, it provides comprehensive movie information, including synopses, ratings, and trailers, allowing users to make informed choices. Users can easily browse through a vast database of movies and discover new recommendations based on their interests. With intuitive navigation and detailed movie insights, this website aims to enhance the movie discovery process, making it enjoyable and straightforward.

Live Project Link: [FlixView](https://flix-view.vercel.app/)

Sentiment Analysis Model: https://github.com/Parth-05/Movie-Review-Sentiment-Analysis

## Technologies and Languages Used

- **React**: For building a smooth and responsive user interface.
- **SCSS**: For elegant and maintainable styling.
- **Node.js**: For handling API requests and server-side operations.
- **TMDB API**: For retrieving comprehensive movie information including synopses, ratings, and trailers.

## Project Architecture

1. **Frontend Development**:
    - The user interface is developed using React, ensuring a dynamic and responsive experience.
    - SCSS is utilized for styling, providing a clean and maintainable codebase.

2. **Backend Development**:
    - Node.js is used to build the backend server, efficiently handling API requests and server-side operations.
    - MongoDB Atlas is used to securely store user information such as names, emails, and passwords.

3. **API Integration**:
    - The TMDB API is integrated to fetch detailed movie information such as synopses, ratings, and trailers.
    - A FastAPI service, deployed on Render, acts as a wrapper around a Hugging Face-hosted sentiment analysis model. The frontend directly sends user review text to this service for real-time sentiment evaluation.

4. **Movie Discovery**:
    - Users can browse through a vast database of movies and receive recommendations based on their interests.
    - Detailed movie insights are provided to help users make informed choices.

## How to Run the Project

1. Clone the repository:
    git clone https://github.com/Parth-05/FlixView.git

2. Navigate to the project directory:
    cd movie-discovery-website

3. Install the required backend dependencies:
    npm install

4. Run the Node.js backend server:
    node server.js

5. Navigate to the `client` directory and install frontend dependencies:
    cd client
    npm install

6. Start the React frontend:
    npm start

## Conclusion

This project showcases the integration of various technologies and libraries to build an effective movie discovery website. It demonstrates the application of full-stack development skills to create a user-friendly platform for discovering and exploring movies.
