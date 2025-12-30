// 手势识别控制器 - 简化版本，先确保摄像头能调用
class GestureController {
    constructor(starField3D) {
        this.starField3D = starField3D;
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.hands = null;
        this.isActive = false;
        this.lastHandPosition = null;
        this.lastPinchDistance = null;
        this.smoothingFactor = 0.3;
        
        this.init();
    }

    async init() {
        // 先创建UI元素（在启动摄像头之前）
        this.createUI();
        
        // 然后启动摄像头
        const cameraStarted = await this.startCamera();
        if (!cameraStarted) {
            this.showGestureHint('无法启动摄像头，请检查权限设置', true);
            return;
        }
        
        // 最后初始化手势识别
        await this.initMediaPipe();
    }

    createUI() {
        // 先清理旧的视频容器（如果存在）
        const oldContainer = document.querySelector('.gesture-video-container');
        if (oldContainer) {
            oldContainer.remove();
        }

        // 找到手势控制面板，将摄像头添加到它的内部
        const gestureHint = document.querySelector('.gesture-hint');
        if (!gestureHint) {
            console.warn('未找到手势控制面板，使用默认位置');
            this.createUIAtDefaultPosition();
            return;
        }

        // 创建视频容器
        const videoContainer = document.createElement('div');
        videoContainer.className = 'gesture-video-container';
        videoContainer.style.cssText = `
            position: relative;
            width: 100%;
            height: 200px;
            margin-top: 1rem;
            border-radius: 8px;
            overflow: hidden;
            background: #000;
            border: 1px solid rgba(102, 102, 241, 0.3);
        `;

        // 创建视频元素
        this.video = document.createElement('video');
        this.video.autoplay = true;
        this.video.playsInline = true;
        this.video.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            transform: scaleX(-1);
        `;
        videoContainer.appendChild(this.video);

        // 创建画布用于绘制手部关键点
        this.canvas = document.createElement('canvas');
        this.canvas.width = 300;
        this.canvas.height = 200;
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        `;
        videoContainer.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // 将视频容器添加到手势控制面板内部（在按钮之前）
        const gestureBtn = gestureHint.querySelector('.gesture-btn');
        if (gestureBtn) {
            gestureBtn.parentNode.insertBefore(videoContainer, gestureBtn);
        } else {
            gestureHint.appendChild(videoContainer);
        }
    }

    createUIAtDefaultPosition() {
        // 先清理旧的元素（如果存在）
        const oldVideo = document.querySelector('video[style*="position: fixed"][style*="top: 20px"]');
        const oldCanvas = document.querySelector('canvas[style*="position: fixed"][style*="top: 20px"]');
        if (oldVideo) oldVideo.remove();
        if (oldCanvas) oldCanvas.remove();

        // 备用方案：如果找不到面板，使用默认位置
        this.video = document.createElement('video');
        this.video.autoplay = true;
        this.video.playsInline = true;
        this.video.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 200px;
            height: 150px;
            border-radius: 10px;
            border: 2px solid rgba(102, 102, 241, 0.5);
            z-index: 1000;
            transform: scaleX(-1);
            opacity: 0.9;
            object-fit: cover;
            background: #000;
        `;
        document.body.appendChild(this.video);

        this.canvas = document.createElement('canvas');
        this.canvas.width = 200;
        this.canvas.height = 150;
        this.canvas.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 200px;
            height: 150px;
            border-radius: 10px;
            z-index: 1001;
            pointer-events: none;
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    async startCamera() {
        try {
            // 检查浏览器支持
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                this.showGestureHint('您的浏览器不支持摄像头访问', true);
                return false;
            }

            // 请求摄像头权限
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            });

            // 如果视频元素还没创建，先创建
            if (!this.video) {
                this.createUI();
            }

            this.video.srcObject = stream;
            
            // 等待视频加载
            await new Promise((resolve, reject) => {
                this.video.onloadedmetadata = () => {
                    this.video.play()
                        .then(() => {
                            this.isActive = true;
                            this.showGestureHint('摄像头已启动');
                            resolve();
                        })
                        .catch(reject);
                };
                this.video.onerror = reject;
            });

            return true;
        } catch (error) {
            console.error('摄像头启动失败:', error);
            let errorMsg = '无法访问摄像头';
            
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                errorMsg = '摄像头权限被拒绝，请在浏览器设置中允许';
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                errorMsg = '未找到摄像头设备';
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                errorMsg = '摄像头被其他应用占用';
            }
            
            this.showGestureHint(errorMsg, true);
            return false;
        }
    }

    async initMediaPipe() {
        try {
            // 使用更简单的方式加载 MediaPipe
            if (typeof Hands === 'undefined') {
                // 动态加载 MediaPipe Hands
                const handsScript = document.createElement('script');
                handsScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands';
                handsScript.type = 'module';
                
                await new Promise((resolve, reject) => {
                    handsScript.onload = resolve;
                    handsScript.onerror = () => {
                        console.warn('MediaPipe 加载失败，使用基础手势模式');
                        resolve(); // 不阻止，继续使用基础模式
                    };
                    document.head.appendChild(handsScript);
                });
            }

            // 如果 MediaPipe 可用，初始化它
            if (typeof Hands !== 'undefined') {
                this.hands = new Hands({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                    }
                });

                this.hands.setOptions({
                    maxNumHands: 1,
                    modelComplexity: 1,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });

                this.hands.onResults((results) => {
                    this.onHandsResults(results);
                });

                // 开始处理视频
                this.processVideo();
                this.showGestureHint('手势识别已启动');
            } else {
                // 使用基础模式（仅显示摄像头）
                this.showGestureHint('摄像头已启动（基础模式）');
            }
        } catch (error) {
            console.warn('MediaPipe 初始化失败，使用基础模式:', error);
            this.showGestureHint('摄像头已启动（基础模式）');
        }
    }

    async processVideo() {
        if (!this.isActive || !this.video || this.video.readyState !== 4) {
            if (this.isActive) {
                requestAnimationFrame(() => this.processVideo());
            }
            return;
        }

        if (this.hands) {
            try {
                await this.hands.send({ image: this.video });
            } catch (error) {
                console.error('手势检测错误:', error);
            }
        }

        requestAnimationFrame(() => this.processVideo());
    }

    onHandsResults(results) {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            
            // 绘制手部关键点
            this.drawHandLandmarks(landmarks);

            // 检测手势并控制星空
            if (this.starField3D && this.starField3D.scene) {
                this.detectGestures(landmarks);
            } else {
                console.warn('手势控制：星空场景未准备好');
            }
        } else {
            // 没有检测到手，重置状态
            this.lastHandPosition = null;
            this.lastPinchDistance = null;
        }
    }

    drawHandLandmarks(landmarks) {
        this.ctx.strokeStyle = '#6366f1';
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = '#6366f1';

        // 绘制关键点
        // 注意：由于视频是镜像的，绘制时也需要镜像 X 坐标
        landmarks.forEach((landmark) => {
            const x = (1 - landmark.x) * this.canvas.width; // 镜像 X 坐标
            const y = landmark.y * this.canvas.height;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        });

        // 高亮显示关键点（手腕、拇指、食指）
        const keyPoints = [0, 4, 8];
        keyPoints.forEach(index => {
            if (landmarks[index]) {
                const x = (1 - landmarks[index].x) * this.canvas.width; // 镜像 X 坐标
                const y = landmarks[index].y * this.canvas.height;
                this.ctx.fillStyle = '#f59e0b';
                this.ctx.beginPath();
                this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        });
    }

    detectGestures(landmarks) {
        if (!this.starField3D || !landmarks || landmarks.length < 9) {
            // 调试信息
            if (!this.starField3D) {
                console.warn('starField3D 未初始化');
            }
            return;
        }

        // 获取关键点
        const wrist = landmarks[0];
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];

        // 检测左右摆手（基于手腕的水平移动）
        // 注意：由于视频使用了 scaleX(-1) 镜像，需要反转 X 坐标
        if (this.lastHandPosition) {
            // 反转 X 坐标（因为视频是镜像的）
            const deltaX = -(wrist.x - this.lastHandPosition.x);
            const smoothedDeltaX = deltaX * this.smoothingFactor;
            
            // 控制星空左右平移（而不是旋转）
            if (Math.abs(smoothedDeltaX) > 0.003) {
                // 移动整个场景（包括所有星星）- 增大移动速度
                this.starField3D.scene.position.x += smoothedDeltaX * 40;
                
                // 增大移动范围，让操作更灵活
                this.starField3D.scene.position.x = Math.max(-30, Math.min(30, this.starField3D.scene.position.x));
            }
        }

        // 检测放大缩小手势（基于拇指和食指的距离）
        const pinchDistance = this.calculateDistance(thumbTip, indexTip);
        
        if (this.lastPinchDistance !== null) {
            const distanceChange = pinchDistance - this.lastPinchDistance;
            const smoothedChange = distanceChange * this.smoothingFactor;
            
            // 控制缩放（距离变大 = 放大，距离变小 = 缩小）
            // 注意：相机 z 值越小 = 越近 = 看起来越大，所以需要反转
            if (Math.abs(smoothedChange) > 0.002) {
                // 增大缩放灵敏度，让缩放更明显
                const zoomSensitivity = 5.0;
                // 反转：距离变大时，相机拉近（z减小），看起来放大
                const zoomFactor = 1 - smoothedChange * zoomSensitivity;
                
                if (this.starField3D && this.starField3D.camera) {
                    this.starField3D.camera.position.z *= zoomFactor;
                    
                    // 扩大缩放范围，让缩放更灵活
                    this.starField3D.camera.position.z = Math.max(1.5, Math.min(30, this.starField3D.camera.position.z));
                    
                    // 调试信息
                    if (Math.random() < 0.05) {
                        console.log('手势控制 - 相机距离:', this.starField3D.camera.position.z.toFixed(2), '距离变化:', smoothedChange.toFixed(4), '缩放因子:', zoomFactor.toFixed(4));
                    }
                } else {
                    console.warn('starField3D 或 camera 不存在');
                }
            }
        }

        // 更新上一帧的位置
        this.lastHandPosition = { x: wrist.x, y: wrist.y };
        this.lastPinchDistance = pinchDistance;
    }

    calculateDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        const dz = (point1.z || 0) - (point2.z || 0);
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    showGestureHint(message, isError = false) {
        let hintElement = document.getElementById('gesture-status');
        if (!hintElement) {
            hintElement = document.createElement('div');
            hintElement.id = 'gesture-status';
            hintElement.style.cssText = `
                position: fixed;
                top: 180px;
                right: 20px;
                background: ${isError ? 'rgba(239, 68, 68, 0.9)' : 'rgba(102, 102, 241, 0.9)'};
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                z-index: 1002;
                font-size: 12px;
                max-width: 200px;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            `;
            document.body.appendChild(hintElement);
        }

        hintElement.textContent = message;
        hintElement.style.background = isError 
            ? 'rgba(239, 68, 68, 0.9)' 
            : 'rgba(102, 102, 241, 0.9)';

        if (!isError) {
            setTimeout(() => {
                if (hintElement) {
                    hintElement.style.transition = 'opacity 0.5s';
                    hintElement.style.opacity = '0';
                    setTimeout(() => {
                        if (hintElement && hintElement.parentNode) {
                            hintElement.parentNode.removeChild(hintElement);
                        }
                    }, 500);
                }
            }, 3000);
        }
    }

    stop() {
        this.isActive = false;
        
        if (this.video && this.video.srcObject) {
            const tracks = this.video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }

        if (this.video && this.video.parentNode) {
            this.video.parentNode.removeChild(this.video);
        }

        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        const hintElement = document.getElementById('gesture-status');
        if (hintElement && hintElement.parentNode) {
            hintElement.parentNode.removeChild(hintElement);
        }
    }
}

// 简化版手势控制器（备用方案）
class SimpleGestureController {
    constructor(starField3D) {
        this.starField3D = starField3D;
        this.video = null;
        this.isActive = false;
        
        this.init();
    }

    async init() {
        const cameraStarted = await this.startCamera();
        if (cameraStarted) {
            this.showGestureHint('摄像头已启动（基础模式）');
        }
    }

    async startCamera() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                this.showGestureHint('您的浏览器不支持摄像头访问', true);
                return false;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            });

            // 尝试在手势面板中创建，如果找不到则使用默认位置
            const gestureHint = document.querySelector('.gesture-hint');
            if (gestureHint) {
                const videoContainer = document.createElement('div');
                videoContainer.className = 'gesture-video-container';
                videoContainer.style.cssText = `
                    position: relative;
                    width: 100%;
                    height: 150px;
                    margin-top: 1rem;
                    border-radius: 8px;
                    overflow: hidden;
                    background: #000;
                `;

                this.video = document.createElement('video');
                this.video.autoplay = true;
                this.video.playsInline = true;
                this.video.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transform: scaleX(-1);
                `;
                videoContainer.appendChild(this.video);
                gestureHint.appendChild(videoContainer);
            } else {
                this.video = document.createElement('video');
                this.video.autoplay = true;
                this.video.playsInline = true;
                this.video.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 200px;
                    height: 150px;
                    border-radius: 10px;
                    border: 2px solid rgba(102, 102, 241, 0.5);
                    z-index: 1000;
                    transform: scaleX(-1);
                    opacity: 0.9;
                    object-fit: cover;
                    background: #000;
                `;
                document.body.appendChild(this.video);
            }

            this.video.srcObject = stream;
            await this.video.play();
            this.isActive = true;
            return true;
        } catch (error) {
            console.error('摄像头启动失败:', error);
            let errorMsg = '无法访问摄像头';
            
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                errorMsg = '摄像头权限被拒绝，请在浏览器设置中允许';
            } else if (error.name === 'NotFoundError') {
                errorMsg = '未找到摄像头设备';
            } else if (error.name === 'NotReadableError') {
                errorMsg = '摄像头被其他应用占用';
            }
            
            this.showGestureHint(errorMsg, true);
            return false;
        }
    }

    showGestureHint(message, isError = false) {
        let hintElement = document.getElementById('gesture-status');
        if (!hintElement) {
            hintElement = document.createElement('div');
            hintElement.id = 'gesture-status';
            hintElement.style.cssText = `
                position: fixed;
                top: 180px;
                right: 20px;
                background: ${isError ? 'rgba(239, 68, 68, 0.9)' : 'rgba(102, 102, 241, 0.9)'};
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                z-index: 1002;
                font-size: 12px;
                max-width: 200px;
            `;
            document.body.appendChild(hintElement);
        }
        hintElement.textContent = message;
    }

    stop() {
        this.isActive = false;
        if (this.video && this.video.srcObject) {
            const tracks = this.video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        if (this.video && this.video.parentNode) {
            this.video.parentNode.removeChild(this.video);
        }
    }
}
