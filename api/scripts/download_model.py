#!/usr/bin/env python3
import os
import time
import random
from sentence_transformers import SentenceTransformer

def download_model_with_retry(model_name, cache_dir, max_retries=5):
    """Download the model with exponential backoff retry logic"""
    os.makedirs(cache_dir, exist_ok=True)
    print(f"Downloading model to: {os.path.abspath(cache_dir)}")
    
    for attempt in range(1, max_retries + 1):
        try:
            print(f"Download attempt {attempt}/{max_retries}")
            # This will download the model and cache it
            model = SentenceTransformer(model_name, cache_folder=cache_dir)
            print(f"Successfully downloaded model to {cache_dir}")
            return model
        except Exception as e:
            print(f"Attempt {attempt} failed: {e}")
            if attempt < max_retries:
                # Exponential backoff with jitter
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                print(f"Retrying in {wait_time:.2f} seconds...")
                time.sleep(wait_time)
            else:
                print(f"All {max_retries} attempts failed, giving up.")
                raise

if __name__ == "__main__":
    cache_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model_cache")
    download_model_with_retry("paraphrase-MiniLM-L3-v2", cache_dir)
    print("Download complete!")