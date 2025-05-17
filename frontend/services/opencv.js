let videoElement;
let canvasElement;
let context;

function initOpenCV(videoId, canvasId) {
    videoElement = document.getElementById(videoId);
    canvasElement = document.getElementById(canvasId);
    context = canvasElement.getContext('2d');

    // Load OpenCV
    cv.onRuntimeInitialized = () => {
        startVideo();
    };
}

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            videoElement.srcObject = stream;
            videoElement.play();
            processVideo();
        })
        .catch((err) => {
            console.error('Error accessing webcam: ', err);
        });
}

function processVideo() {
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    let src = cv.imread(canvasElement);
    let dst = new cv.Mat();
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(src, src, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(src, dst, 50, 100, 3, false);
    cv.imshow(canvasElement, dst);
    src.delete(); 
    dst.delete();
    requestAnimationFrame(processVideo);
}

export { initOpenCV };