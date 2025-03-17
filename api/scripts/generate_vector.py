import os
import sys
import json
import time



try:
    # Parse the JSON batch input
    recipes_json = sys.argv[1]
    recipes = json.loads(recipes_json)

    # Import and initialize the model only once
    from sentence_transformers import SentenceTransformer
    cache_dir = os.path.join(os.path.dirname(__file__), 'model_cache')
    os.makedirs(cache_dir, exist_ok=True)
    print(f"Using model cache at: {cache_dir}", file=sys.stderr)


    # model = SentenceTransformer('sentence-transformers/paraphrase-TinyBERT-L4-v2', cache_folder=cache_dir) 
    model = SentenceTransformer('paraphrase-MiniLM-L3-v2', cache_folder=cache_dir) 
    # model = SentenceTransformer('all-MiniLM-L6-v2', cache_folder=cache_dir) 
    # model = SentenceTransformers('all-mpnet-base-v2')  # More accurate, slower

    # Process all recipes in batch
    recipe_texts = []
    recipe_ids = []
    
    for recipe in recipes:
        # Prepare the text for embedding
        recipe_text = f"{recipe['title']} {recipe['description'] or ''} {' '.join(recipe['ingredients'])} {' '.join(recipe['instructions'])}"
        recipe_texts.append(recipe_text)
        recipe_ids.append(recipe['id'])

    # Generate embeddings in a single batch call
    embeddings = model.encode(recipe_texts)

    # May use PCA to reduce dimensionality if calcualtion is too slow

    # Create a dictionary mapping recipe ID to its embedding
    result = {}
    for i, recipe_id in enumerate(recipe_ids):
        result[recipe_id] = embeddings[i].tolist()

    # Output the results
    print(json.dumps(result))
except IndexError:
    print("Usage: generate_vector.py <recipe_json>", file=sys.stderr)
    sys.exit(1)
except json.JSONDecodeError:
    print("Error: Invalid JSON input", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)