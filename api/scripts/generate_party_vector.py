import os
import sys
import json
import time

try:
    # Get the file path from command line argument
    json_file_path = sys.argv[1]
    
    # Read the JSON data from the file
    with open(json_file_path, 'r') as file:
        preferences = json.load(file)

    print(f"Loaded party preferences: {json.dumps(preferences, indent=2)}", file=sys.stderr)

    # Import and initialize the model only once
    from sentence_transformers import SentenceTransformer
    cache_dir = os.path.join(os.path.dirname(__file__), 'model_cache')
    os.makedirs(cache_dir, exist_ok=True)
    print(f"Using model cache at: {cache_dir}", file=sys.stderr)

    model = SentenceTransformer('paraphrase-MiniLM-L3-v2', cache_folder=cache_dir) 

    # Format the preference data for embedding
    preference_text = []
    
    # Process the available time
    available_time = f"available time: {preferences.get('availableTime', 'not specified')}"
    preference_text.append(available_time)
    
    # Process preferred cuisines
    cuisines = preferences.get('preferredCuisines', [])
    cuisines_text = f"preferred cuisines: {' '.join(cuisines) if cuisines else 'not specified'}"
    preference_text.append(cuisines_text)
    
    # Process price preference
    price_text = f"price preference: {preferences.get('preferredPrice', 'not specified')}"
    preference_text.append(price_text)
    
    # Process ingredients
    ingredients = preferences.get('aggregatedIngredients', [])
    ingredients_text = f"ingredients: {' '.join(ingredients) if ingredients else 'not specified'}"
    preference_text.append(ingredients_text)
    
    # Process allergens
    allergens = preferences.get('excludedAllergens', [])
    allergens_text = f"allergens to avoid: {' '.join(allergens) if allergens else 'none'}"
    preference_text.append(allergens_text)
    
    # Process difficulty
    difficulty_text = f"preferred difficulty: {preferences.get('preferredDifficulty', 'not specified')}"
    preference_text.append(difficulty_text)
    
    # Combine all preference texts
    combined_preference_text = " ".join(preference_text)
    print(f"Combined preference text: {combined_preference_text}", file=sys.stderr)
    
    # Generate embedding
    embedding = model.encode(combined_preference_text)
    
    # Create the result (using party_id as key, but this will be handled in the TypeScript code)
    result = {'party_vector': embedding.tolist()}
    
    # Output the results
    print(json.dumps(result))
except IndexError:
    print("Usage: generate_party_vector.py <preferences_json>", file=sys.stderr)
    sys.exit(1)
except json.JSONDecodeError:
    print("Error: Invalid JSON input", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)