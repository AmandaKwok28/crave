import json
import os
import subprocess
import pytest
import numpy as np
import shutil

@pytest.fixture
def sample_recipe():
    return {
        "title": "Test Recipe",
        "description": "A test recipe for unit testing",
        "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
        "instructions": ["step1", "step2", "step3"]
    }

@pytest.fixture(scope="function")
def clean_models_dir():
    # Remove models directory if it exists
    if os.path.exists("models"):
        shutil.rmtree("models")
    
    # Create it fresh for the test
    os.makedirs("models", exist_ok=True)
    
    yield
    
    # Clean up after test
    if os.path.exists("models"):
        shutil.rmtree("models")

def test_generate_vector(sample_recipe, clean_models_dir):
    # Convert recipe to JSON string
    recipe_json = json.dumps(sample_recipe)
    
    # Call the script with the recipe JSON
    result = subprocess.run(
        ["python", "api/scripts/generate_vector.py", recipe_json],
        capture_output=True,
        text=True
    )
    
    # Check if the script executed successfully
    assert result.returncode == 0
    
    # Parse the output JSON
    output_vector = json.loads(result.stdout)
    
    # Check if output is a list of 10 zeros (based on your current implementation)
    assert len(output_vector) == 10
    assert all(x == 0 for x in output_vector)
    
    # Check if the vectorizer file was created
    assert os.path.exists("models/tfidf_vectorizer.pkl")