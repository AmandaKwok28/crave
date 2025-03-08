import os
import sys
import json
import numpy as np

try:
    recipe_json = sys.argv[1]
    recipe = json.loads(recipe_json)

    # Combine recipe text fields
    recipe_text = f"{recipe['title']} {recipe['description'] or ''} {' '.join(recipe['ingredients'])} {' '.join(recipe['instructions'])}"
    # print(f"DEBUG - Recipe text: {recipe_text}", file=sys.stderr)

    from sentence_transformers import SentenceTransformer
    cache_dir = os.path.join(os.path.dirname(__file__), 'model_cache') # Cache model locally to improve speed
    os.makedirs(cache_dir, exist_ok=True)
    print(f"Using model cache at: {cache_dir}", file=sys.stderr)

    model = SentenceTransformer('all-MiniLM-L6-v2', cache_folder=cache_dir) 
    # model = SentenceTransformers('all-mpnet-base-v2')  # More accurate

    # Generate embeddings
    embeddings = model.encode(recipe_text) # 384-dimension embeddings

    # Maybe PCA to reduce dimensionality if calcualtion is too slow

    # Output the vector as JSON
    print(json.dumps(embeddings.tolist()))
except IndexError:
    print("Usage: generate_vector.py <recipe_json>", file=sys.stderr)
    sys.exit(1)
except json.JSONDecodeError:
    print("Error: Invalid JSON input", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)