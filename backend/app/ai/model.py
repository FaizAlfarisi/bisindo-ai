import torch
import torch.nn as nn
import os
import numpy as np

# Define the MLP model architecture
# This should match the architecture of bisindo_model.pth
class MLP(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(MLP, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.fc2(out)
        return out

# Global variable to hold the loaded model
bisindo_model = None
# Define mapping from output index to letter (A-Z)
LETTER_MAP = {i: chr(65 + i) for i in range(26)}

def load_bisindo_model(model_path: str):
    """
    Loads the PyTorch BISINDO model from the given path.
    """
    global bisindo_model
    if bisindo_model is not None:
        return bisindo_model

    # Determine input_size, hidden_size, output_size based on your trained model
    # For a typical MediaPipe Hands output (21 landmarks * 3 coords = 63 features)
    # These sizes should match the actual bisindo_model.pth
    input_size = 63
    hidden_size = 128 # Example hidden size, adjust to your actual model
    output_size = 26  # A-Z

    model = MLP(input_size, hidden_size, output_size)
    
    # Ensure the model path is correct
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at: {model_path}")
        
    try:
        # Load the state dictionary, handling potential device mismatches
        state_dict = torch.load(model_path, map_location=torch.device('cpu'))
        # Adjust state_dict keys if they don't match the MLP class (e.g., if trained with DataParallel)
        # For simplicity, assuming direct match here.
        model.load_state_dict(state_dict)
        model.eval() # Set model to evaluation mode
        bisindo_model = model
        print(f"BISINDO model loaded successfully from {model_path}")
        return bisindo_model
    except Exception as e:
        print(f"Error loading BISINDO model from {model_path}: {e}")
        raise

def predict_letter(landmarks: list[float]) -> tuple[str, float]:
    """
    Performs inference on the given landmarks using the loaded BISINDO model.
    Returns the predicted letter and its confidence score.
    """
    if bisindo_model is None:
        raise RuntimeError("BISINDO model not loaded. Call load_bisindo_model first.")

    # Convert landmarks to a PyTorch tensor
    # Ensure the input matches the model's expected input_size (e.g., 1x63)
    input_tensor = torch.tensor(landmarks, dtype=torch.float32).unsqueeze(0) # Add batch dimension

    with torch.no_grad(): # Disable gradient calculation for inference
        output = bisindo_model(input_tensor)
        probabilities = torch.softmax(output, dim=1) # Get probabilities
        confidence, predicted_idx = torch.max(probabilities, 1) # Get highest confidence and index

    predicted_letter = LETTER_MAP.get(predicted_idx.item(), "Unknown")
    return predicted_letter, confidence.item()
