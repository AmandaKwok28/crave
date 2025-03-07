import json
import numpy as np

vector = np.zeros(10)

# Output the vector as JSON
print(json.dumps(vector.tolist()))