import cv2
import mediapipe as mp

# Hand Module MediaPipe
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Start Webcam
cap = cv2.VideoCapture(0)

with mp_hands.Hands(
        max_num_hands=2,              # number of hands to detect
        min_detection_confidence=0.5, # 손 인식 신뢰도
        min_tracking_confidence=0.5) as hands:
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("카메라 오류")
            break
        
        # 좌우 반전 + RGB 변환
        frame = cv2.flip(frame, 1)
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        
        # 손 감지
        results = hands.process(image)
        
        # 다시 BGR로 전환
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        # 손 감지되었으면 랜드마크 시각화
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    image,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,  # 손가락 뼈대 연결선
                    mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=4),  # 점
                    mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2))  # 선
                
        # 결과 출력
        cv2.imshow('Hand Trackor', image)
        
        if cv2.waitKey(5) & 0xFF == 27:
            break
        
cap.release()
cv2.destroyAllWindows()