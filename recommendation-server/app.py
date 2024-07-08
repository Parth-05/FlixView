import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)

try:
    # Dynamically get the path to the pickle file
    model_path = os.path.join(os.path.dirname(__file__), 'models', 'model.pkl')
    logging.info(f"Loading model from {model_path}")

    # Load model and data from the pickle file
    with open(model_path, 'rb') as f:
        model = pickle.load(f)

    data_new = model['data']
    tfidf_vectorizer = model['tfidf_vectorizer']
    count_vectorizer = model['count_vectorizer']
    cosine_sim_sparse = model['cosine_sim_sparse']
except Exception as e:
    logging.error(f"Error loading model: {e}")
    raise

@app.route('/api/recommend-movies', methods=['POST'])
@cross_origin()
def recommend():
    data = request.json
    title = data.get('title')
    
    if not title:
        return jsonify({"error": "Title parameter is required"}), 400
    
    if title not in data_new['title'].values:
        return jsonify({"error": "Movie title not found"}), 404
    
    recommendations = get_recommendations_with_sparse_and_weights_and_id(title)
    return jsonify(recommendations.to_dict(orient='records')), 200

def get_recommendations_with_sparse_and_weights_and_id(title, cosine_sim=cosine_sim_sparse):
    idx = data_new[data_new['title'] == title].index[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:]  # Exclude the first one as it is the same movie

    # Track unique movie IDs
    unique_movie_ids = set()
    unique_movie_indices = []
    filtered_sim_scores = []

    for sim_score in sim_scores:
        movie_index = sim_score[0]
        movie_id = data_new['movie_id'].iloc[movie_index]
        if movie_id not in unique_movie_ids:
            unique_movie_ids.add(movie_id)
            unique_movie_indices.append(movie_index)
            filtered_sim_scores.append(sim_score)
        if len(unique_movie_indices) == 10:  # Top 10 unique similar movies
            break

    # Incorporate weighted average
    weights = data_new['vote_average'].iloc[unique_movie_indices].values
    weighted_scores = [(unique_movie_indices[i], filtered_sim_scores[i][1] * weights[i]) for i in range(len(filtered_sim_scores))]
    weighted_scores = sorted(weighted_scores, key=lambda x: x[1], reverse=True)
    movie_indices = [i[0] for i in weighted_scores]

    # Prepare the result
    results = data_new[['movie_id', 'title']].iloc[movie_indices]
    return results

if __name__ == '__main__':
    app.run(debug=False)
