import cv2
import mediapipe as mp

# Hand Module MediaPipe
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Start Webcam
cap = cv2.VideoCapture(0)

with mp_hands.Hands(
        max_num_hands=2,              # number of hands to detect
        min_detection_confidence=0.5, # minimum confidence for detection
        min_tracking_confidence=0.5) as hands:
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("Camera error")
            break
        
        # Reverse left and right + RGB conversion
        frame = cv2.flip(frame, 1)
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        
        # Detect hands
        results = hands.process(image)
        
        # Convert back to BGR
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        # Vsualize landmarks
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    image,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,  # finger connections
                    mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=4),  # Dots
                    mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2))  # Lines
                
        # Print hand landmarks
        cv2.imshow('Hand Trackor', image)
        
        if cv2.waitKey(5) & 0xFF == 27:
            break
        
cap.release()
cv2.destroyAllWindows()