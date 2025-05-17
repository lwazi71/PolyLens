export const detectHands = (image, hands) => {
    const results = hands.process(image);
    return results.multiHandLandmarks || [];
};

export const drawHands = (image, hands, drawingUtils) => {
    if (hands.length > 0) {
        hands.forEach(hand => {
            drawingUtils.drawLandmarks(image, hand);
        });
    }
};