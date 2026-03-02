import torch
import torch.nn as nn
import os
import numpy as np

class MLP(nn.Module):
    def __init__(self, input_dim, num_classes, params):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, params["hidden1"]), nn.GELU(),
            nn.Dropout(params["drop1"]),

            nn.Linear(params["hidden1"], params["hidden2"]), nn.GELU(),
            nn.Dropout(params["drop2"]),

            nn.Linear(params["hidden2"], 32), nn.GELU(),
            nn.Dropout(params["drop3"]),

            nn.Linear(32, num_classes)
        )

    def forward(self, x):
        return self.net(x)

# Global variable to hold the loaded model
bisindo_model = None
# Define mapping from output index to letter (A-Z)
label_classes = [chr(i) for i in range(65, 91)]  # A-Z

def load_bisindo_model(model_path: str):
    """
    Loads the PyTorch BISINDO model from the given path.
    """
    global bisindo_model
    if bisindo_model is not None:
        return bisindo_model

    params = {'hidden1': 128, 'hidden2': 64, 'lr': 0.001, 'drop1': 0.5, 'drop2': 0.3, 'drop3': 0.1, 'batch': 64}
    model = MLP(126, 26, params)
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at: {model_path}")
        
    try:
        # Load the state dictionary
        state_dict = torch.load(model_path, map_location=torch.device('cpu'))
        model.load_state_dict(state_dict)
        model.eval() # Set model to evaluation mode
        bisindo_model = model
        print(f"BISINDO model loaded successfully from {model_path}")
        return bisindo_model
    except Exception as e:
        print(f"Error loading BISINDO model from {model_path}: {e}")
        raise

def normalize_keypoints_world(keypoints):
    kp = np.asarray(keypoints, dtype=np.float64)

    left = kp[:21].copy()
    right = kp[21:].copy()

    def norm_hand(hand):
        if np.allclose(hand, 0):
            return hand

        # Translation
        wrist = hand[0]
        h = hand - wrist

        # Scaling
        scale = np.linalg.norm(h[5])
        if scale < 1e-8:
            scale = 1e-8

        h /= scale
        return h

    left_n = norm_hand(left)
    right_n = norm_hand(right)

    return np.vstack([left_n, right_n])

def predict_letter(hands_data: list) -> tuple[str, float]:
    """
    hands_data format: [{"label": "Left", "landmarks": [[x,y,z], ...]}, ...]
    """
    if bisindo_model is None:
        raise RuntimeError("BISINDO model not loaded. Call load_bisindo_model first.")

    output = np.zeros((42, 3))
    
    for hand_info in hands_data:
        # Pydantic models will be passed as dicts if we call .model_dump() or we can access attributes
        # Since we might pass Pydantic HandData objects, let's handle both
        if isinstance(hand_info, dict):
            label = hand_info.get("label")
            landmarks = hand_info.get("landmarks")
        else:
            label = hand_info.label
            landmarks = hand_info.landmarks
            
        if not landmarks or len(landmarks) == 0:
            continue
            
        # Match 'Left' or 'Right'. Fallback to Right if unexpected.
        idx = 0 if label == 'Left' else 1
        coords = np.array(landmarks)
        
        # Ensure we only take up to 21 landmarks and only if they match the expected shape (21, 3)
        if coords.shape[0] >= 21:
            start = idx * 21
            end = start + 21
            output[start:end, :] = coords[:21, :3]
        
    if not np.any(output):
        return "Unknown", 0.0

    # Normalisasi → flatten → reshape
    features = normalize_keypoints_world(output).reshape(1, -1)
    
    # Prediksi
    x = torch.tensor(features, dtype=torch.float32)
    with torch.no_grad(): 
        logits = bisindo_model(x)
        probs = torch.softmax(logits, dim=1).cpu().numpy()[0]

    pred_idx = np.argmax(probs)
    pred_label = label_classes[pred_idx]
    confidence = float(probs[pred_idx])

    return pred_label, confidence