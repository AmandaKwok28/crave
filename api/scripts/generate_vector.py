#!/usr/bin/env python3
# filepath: /Users/shawnwang/2025JHU/team-05/api/scripts/generate_vector.py

import os
import sys
import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle

# Load the recipe data from command line argument
recipe_json = sys.argv[1]
recipe = json.loads(recipe_json)

# Combine recipe text fields
recipe_text = f"{recipe['title']} {recipe['description'] or ''} {' '.join(recipe['ingredients'])} {' '.join(recipe['instructions'])}"

# Either load a pre-trained vectorizer or create a new one
try:
    with open('models/tfidf_vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)
except FileNotFoundError:
    vectorizer = TfidfVectorizer(max_features=100)
    # You would train this on a corpus of recipes
    # For now, just fit on this single recipe
    vectorizer.fit([recipe_text])
    
    # Save for future use
    os.makedirs('models', exist_ok=True)
    with open('models/tfidf_vectorizer.pkl', 'wb') as f:
        pickle.dump(vectorizer, f)

# Transform the recipe text to a vector
vector = vectorizer.transform([recipe_text]).toarray()[0]

# Output the vector as JSON
print(json.dumps(vector.tolist()))