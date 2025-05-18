# OpenHands model loading and prediction logic

# Inference logic for OpenHands model
# Placeholder: replace with actual OpenHands model loading and prediction
import keras
import numpy as np
from huggingface_hub import hf_hub_download
from tensorflow import keras
import os

# Load model ONCE at startup
os.environ["KERAS_BACKEND"] = "jax"
weights_path = hf_hub_download(repo_id="sid220/asl-now-fingerspelling", filename="asl-now-weights.h5")
model = keras.models.Sequential([
    keras.layers.InputLayer(input_shape=(21, 3), name="flatten_input"),
    keras.layers.Flatten(name="flatten"),
    keras.layers.Dense(128, activation="relu", name="dense"),
    keras.layers.Dense(26, activation="linear", name="dense_1")
])
model.load_weights(weights_path)

def prepare_input(hand_landmarks):
    arr = np.array(hand_landmarks, dtype=np.float32)
    if arr.shape == (21, 3):
        return arr
    elif arr.shape == (63,):
        return arr.reshape((21, 3))
    else:
        raise ValueError(f"Input landmarks must be shape (21, 3) or (63,), got {arr.shape}")

def predict_asl_letter(hand_landmarks):
    input_data = prepare_input(hand_landmarks)
    predictions = model.predict(np.expand_dims(input_data, axis=0), verbose=0)
    asl_letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    predicted_index = int(np.argmax(predictions))
    return asl_letters[predicted_index]

def predict_sign(landmarks):
    input_data = prepare_input(landmarks)
    letter = predict_asl_letter(input_data)
    confidence = 1.0  # Placeholder, as model does not output probability
    return letter, confidence

if __name__ == "__main__":
    test_landmarks = [
        (0.8201, 0.8682, -0.0000),
        (0.8754, 0.8349, 0.0011),
        (0.9299, 0.8482, -0.0033),
        (0.9684, 0.8807, -0.0070),
        (0.9921, 0.9054, -0.0084),
        (0.9359, 0.8901, -0.0306),
        (0.9934, 0.9524, -0.0398),
        (0.9819, 0.9497, -0.0374),
        (0.9652, 0.9361, -0.0326),
        (0.9135, 0.9352, -0.0353),
        (0.9758, 0.9929, -0.0404),
        (0.9683, 0.9872, -0.0343),
        (0.9510, 0.9718, -0.0289),
        (0.8881, 0.9705, -0.0376),
        (0.9433, 1.0201, -0.0390),
        (0.9388, 1.0163, -0.0288),
        (0.9246, 1.0033, -0.0220),
        (0.8644, 0.9945, -0.0393),
        (0.9054, 1.0340, -0.0385),
        (0.9053, 1.0349, -0.0296),
        (0.8959, 1.0273, -0.0225)
    ]

    print(predict_asl_letter(test_landmarks))