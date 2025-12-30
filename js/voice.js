// 语音输入模拟器
class VoiceInputSimulator {
    constructor() {
        this.isRecording = false;
        this.recognition = null;
        this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        this.sampleQuestions = [
            '我的事业发展如何？',
            '最近的感情运势怎么样？',
            '我应该如何提升自己的财运？',
            '今年适合投资吗？',
            '我的学业运势如何？',
            '什么时候适合结婚？',
            '我的健康状况需要注意什么？',
            '如何改善人际关系？'
        ];
        this.init();
    }

    init() {
        this.setupVoiceRecognition();
        this.setupEventListeners();
    }

    setupVoiceRecognition() {
        if (this.isSupported) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'zh-CN';

            this.recognition.onstart = () => {
                this.onRecordingStart();
            };

            this.recognition.onresult = (event) => {
                const result = event.results[0][0].transcript;
                this.onRecognitionResult(result);
            };

            this.recognition.onerror = (event) => {
                console.error('语音识别错误:', event.error);
                this.onRecordingError(event.error);
            };

            this.recognition.onend = () => {
                this.onRecordingEnd();
            };
        }
    }

    setupEventListeners() {
        const voiceBtn = document.getElementById('voice-input-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                this.toggleRecording();
            });
        }
    }

    toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        if (this.isSupported && this.recognition) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('启动语音识别失败:', error);
                this.simulateVoiceInput();
            }
        } else {
            // 模拟语音输入
            this.simulateVoiceInput();
        }
    }

    stopRecording() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
        }
    }

    simulateVoiceInput() {
        this.onRecordingStart();
        
        // 模拟录音过程
        setTimeout(() => {
            const randomQuestion = this.sampleQuestions[Math.floor(Math.random() * this.sampleQuestions.length)];
            this.onRecognitionResult(randomQuestion);
            this.onRecordingEnd();
        }, 2000 + Math.random() * 2000); // 2-4秒随机延迟
    }

    onRecordingStart() {
        this.isRecording = true;
        const voiceBtn = document.getElementById('voice-input-btn');
        const voiceStatus = document.getElementById('voice-status');
        
        if (voiceBtn) {
            voiceBtn.classList.add('recording');
            voiceBtn.querySelector('.voice-icon').textContent = '⏹️';
            voiceBtn.querySelector('.voice-text').textContent = '正在录音...';
        }
        
        if (voiceStatus) {
            voiceStatus.textContent = '请说出您的占卜问题...';
            voiceStatus.style.color = '#6366f1';
        }

        // 添加录音动画效果
        this.addRecordingAnimation();
    }

    onRecognitionResult(result) {
        const questionInput = document.getElementById('question');
        if (questionInput) {
            questionInput.value = result;
            
            // 添加打字机效果
            this.typewriterEffect(questionInput, result);
        }

        const voiceStatus = document.getElementById('voice-status');
        if (voiceStatus) {
            voiceStatus.textContent = '语音识别完成！';
            voiceStatus.style.color = '#10b981';
        }
    }

    onRecordingEnd() {
        this.isRecording = false;
        const voiceBtn = document.getElementById('voice-input-btn');
        
        if (voiceBtn) {
            voiceBtn.classList.remove('recording');
            voiceBtn.querySelector('.voice-icon').textContent = '🎤';
            voiceBtn.querySelector('.voice-text').textContent = '点击语音输入';
        }

        this.removeRecordingAnimation();
    }

    onRecordingError(error) {
        this.isRecording = false;
        const voiceStatus = document.getElementById('voice-status');
        
        if (voiceStatus) {
            voiceStatus.textContent = '语音识别失败，请重试';
            voiceStatus.style.color = '#ef4444';
        }

        this.onRecordingEnd();
    }

    addRecordingAnimation() {
        const voiceBtn = document.getElementById('voice-input-btn');
        if (voiceBtn) {
            // 创建音波动画
            const waves = document.createElement('div');
            waves.className = 'voice-waves';
            waves.innerHTML = `
                <div class="wave wave-1"></div>
                <div class="wave wave-2"></div>
                <div class="wave wave-3"></div>
            `;
            voiceBtn.appendChild(waves);

            // 添加CSS动画
            const style = document.createElement('style');
            style.textContent = `
                .voice-waves {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    display: flex;
                    gap: 3px;
                }
                
                .wave {
                    width: 3px;
                    height: 20px;
                    background: rgba(255, 255, 255, 0.7);
                    border-radius: 2px;
                    animation: waveAnimation 1s ease-in-out infinite;
                }
                
                .wave-1 { animation-delay: 0s; }
                .wave-2 { animation-delay: 0.2s; }
                .wave-3 { animation-delay: 0.4s; }
                
                @keyframes waveAnimation {
                    0%, 100% { height: 10px; }
                    50% { height: 25px; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    removeRecordingAnimation() {
        const voiceBtn = document.getElementById('voice-input-btn');
        if (voiceBtn) {
            const waves = voiceBtn.querySelector('.voice-waves');
            if (waves) {
                waves.remove();
            }
        }
    }

    typewriterEffect(element, text) {
        element.value = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.value += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }
}

// 语音播报模拟器
class TextToSpeechSimulator {
    constructor() {
        this.isSupported = 'speechSynthesis' in window;
        this.voices = [];
        this.currentUtterance = null;
        this.init();
    }

    init() {
        if (this.isSupported) {
            this.loadVoices();
            
            // 监听语音列表加载完成
            speechSynthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
    }

    loadVoices() {
        this.voices = speechSynthesis.getVoices();
        // 优先选择中文语音
        this.selectedVoice = this.voices.find(voice => 
            voice.lang.includes('zh') || voice.lang.includes('CN')
        ) || this.voices[0];
    }

    speak(text, options = {}) {
        if (!this.isSupported) {
            console.warn('浏览器不支持语音合成');
            this.simulateAudioPlayback(text);
            return;
        }

        // 停止当前播放
        this.stop();

        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.voice = this.selectedVoice;
        this.currentUtterance.rate = options.rate || 0.8;
        this.currentUtterance.pitch = options.pitch || 1;
        this.currentUtterance.volume = options.volume || 0.8;

        this.currentUtterance.onstart = () => {
            this.onSpeechStart();
        };

        this.currentUtterance.onend = () => {
            this.onSpeechEnd();
        };

        this.currentUtterance.onerror = (event) => {
            // 如果是用户主动中断，不显示错误
            if (event.error !== 'interrupted') {
                console.error('语音播报错误:', event.error);
            }
            this.onSpeechEnd();
        };

        speechSynthesis.speak(this.currentUtterance);
    }

    stop() {
        if (this.isSupported) {
            // 停止所有语音合成，包括正在播放和排队的
            speechSynthesis.cancel();
            // 停止后更新按钮状态
            this.onSpeechEnd();
        }
    }

    onSpeechStart() {
        const playBtn = document.getElementById('play-audio');
        if (playBtn) {
            playBtn.innerHTML = '<span>⏸️ 停止播报</span>';
            playBtn.classList.add('playing');
        }

        // 添加播放动画
        this.addSpeechAnimation();
    }

    onSpeechEnd() {
        const playBtn = document.getElementById('play-audio');
        if (playBtn) {
            playBtn.innerHTML = '<span>🔊 语音播报</span>';
            playBtn.classList.remove('playing');
        }

        this.removeSpeechAnimation();
    }

    simulateAudioPlayback(text) {
        this.onSpeechStart();
        
        // 根据文本长度模拟播放时间
        const duration = Math.max(3000, text.length * 100);
        
        setTimeout(() => {
            this.onSpeechEnd();
        }, duration);
    }

    addSpeechAnimation() {
        const resultSection = document.getElementById('result-section');
        if (resultSection) {
            resultSection.classList.add('speech-playing');
            
            // 添加音频可视化效果
            const visualizer = document.createElement('div');
            visualizer.className = 'audio-visualizer';
            visualizer.innerHTML = `
                <div class="bar bar-1"></div>
                <div class="bar bar-2"></div>
                <div class="bar bar-3"></div>
                <div class="bar bar-4"></div>
                <div class="bar bar-5"></div>
            `;
            
            const resultContainer = document.querySelector('.result-container');
            if (resultContainer) {
                resultContainer.appendChild(visualizer);
            }

            // 添加CSS动画
            const style = document.createElement('style');
            style.textContent = `
                .audio-visualizer {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 4px;
                    margin: 1rem 0;
                }
                
                .bar {
                    width: 4px;
                    height: 20px;
                    background: var(--gradient-primary);
                    border-radius: 2px;
                    animation: audioBar 1s ease-in-out infinite;
                }
                
                .bar-1 { animation-delay: 0s; }
                .bar-2 { animation-delay: 0.1s; }
                .bar-3 { animation-delay: 0.2s; }
                .bar-4 { animation-delay: 0.3s; }
                .bar-5 { animation-delay: 0.4s; }
                
                @keyframes audioBar {
                    0%, 100% { height: 10px; }
                    50% { height: 30px; }
                }
                
                .speech-playing .divination-reading {
                    animation: textHighlight 2s ease-in-out infinite;
                }
                
                @keyframes textHighlight {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    removeSpeechAnimation() {
        const resultSection = document.getElementById('result-section');
        if (resultSection) {
            resultSection.classList.remove('speech-playing');
        }

        const visualizer = document.querySelector('.audio-visualizer');
        if (visualizer) {
            visualizer.remove();
        }
    }
}

// 全局实例
let voiceInputSimulator;
let textToSpeechSimulator;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    voiceInputSimulator = new VoiceInputSimulator();
    textToSpeechSimulator = new TextToSpeechSimulator();
});

