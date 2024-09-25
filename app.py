from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
import openai
import pandas as pd

app = Flask(__name__, static_folder='movie-recommender-app/build', static_url_path='/')
CORS(app)

# OpenAI API Key
app.secret_key = 'asdkmjansdknas'
openai.api_key = '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'

# Load movie dataset
def getAllMovies():
    data = pd.read_csv('main_data.csv')  # Ensure the CSV file path is correct
    return list(data['movie_title'].str.capitalize())

# Serve the React app
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Handle 404 errors by serving the React app (for frontend routes)
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

# Chatbot API route
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')

    if not message:
        return jsonify({'error': 'No message provided!'}), 400

    try:
        # Send message to OpenAI's GPT-3.5-turbo and get response
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": message}
            ]
        )
        bot_message = completion.choices[0].message['content']
        return jsonify({'response': bot_message})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API to get all movies for search bar
@app.route('/api/movies', methods=['GET'])
@cross_origin()
def movies():
    # Return all movies from the dataset
    movies = getAllMovies()
    result = {'arr': movies}
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
