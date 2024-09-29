from flask import Flask, request, jsonify, session, send_from_directory
from flask_bcrypt import Bcrypt  # pip install Flask-Bcrypt
from flask_cors import CORS, cross_origin  # pip install Flask-Cors
import openai
import pandas as pd
from models import db, User

app = Flask(__name__, static_folder='movie-recommender-app/build', static_url_path='/')

# Configurations
app.config['SECRET_KEY'] = 'asdkmjansdknas'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flaskdb.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)

# Initialize the database
db.init_app(app)
with app.app_context():
    db.create_all()

# OpenAI API Key
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

# Signup route
@app.route('/signup', methods=["POST"])
def signup():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "Email already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })

# Login route
@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized Access"}), 401

    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })

if __name__ == '__main__':
    app.run(debug=True)
