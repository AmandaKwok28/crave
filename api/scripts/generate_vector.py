import os
import sys
import json
import time



try:
    # Get the file path from command line argument
    json_file_path = sys.argv[1]
    
    # Read the JSON data from the file
    with open(json_file_path, 'r') as file:
        recipes = json.load(file)

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
        # add tags, next: number of likes + bookmarks
        recipe_text = f"{recipe['title']} {recipe['description'] or ''} {' '.join(recipe['ingredients'])} {' '.join(recipe['instructions'])}"
        recipe_texts.append(recipe_text)
        recipe_tags = f"meal types: {' '.join(recipe['mealTypes']) if len(recipe['mealTypes']) > 0 else 'not listed'}, " \
              f"difficulty: {recipe['difficulty'] if recipe['difficulty'] else 'not listed'}, " \
              f"cuisine: {recipe['cuisine'] if recipe['cuisine'] else 'not listed'}, " \
              f"allergens: {' '.join(recipe['allergens']) if len(recipe['allergens']) > 0 else 'not listed'}, " \
              f"sources: {' '.join(recipe['sources']) if len(recipe['sources']) > 0 else 'not listed'}, " \
              f"prep time: {recipe['prepTime'] if recipe['prepTime'] else 'not listed'}"


        # recipe_tags = f" meal types: {' '.join(recipe['mealTypes'])}, difficulty: {recipe['difficulty']}, cuisine: {recipe['cuisine']}, allergens: {' '.join(recipe['allergens'])}, sources: {' '.join(recipe['sources'])}, prep time: {recipe['prepTime']}"
        recipe_texts.append(recipe_tags)
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