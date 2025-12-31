// 语音输入模拟器 - 简化版本
class VoiceInputSimulator {
    constructor() {
        this.isRecording = false;
        this.recognition = null;
        this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        this.recognizedText = ''; // 存储所有识别的文本
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
        this.setupEventListeners();
        console.log('🎤 语音输入模块初始化完成');
        console.log('   浏览器支持:', this.isSupported);
    }

    createRecognition() {
        if (!this.isSupported) {
            console.error('❌ 浏览器不支持语音识别');
            console.error('   SpeechRecognition:', typeof window.SpeechRecognition);
            console.error('   webkitSpeechRecognition:', typeof window.webkitSpeechRecognition);
            return null;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        console.log('🔧 创建识别对象，类型:', SpeechRecognition.name);
        
        const recognition = new SpeechRecognition();
        
        // 配置识别参数 - 尝试更兼容的配置
        // 注意：某些浏览器可能不支持 continuous=true
        recognition.continuous = true;
        recognition.interimResults = true;
        
        // 尝试多种语言配置
        recognition.lang = 'zh-CN';
        console.log('🔧 使用语言:', recognition.lang);
        
        recognition.maxAlternatives = 1;
        
        // 尝试设置服务URL（如果支持）
        if (recognition.serviceURI) {
            console.log('🔧 服务URI:', recognition.serviceURI);
        }
        
        console.log('🔧 识别配置:');
        console.log('   continuous:', recognition.continuous);
        console.log('   interimResults:', recognition.interimResults);
        console.log('   lang:', recognition.lang);
        console.log('   maxAlternatives:', recognition.maxAlternatives);
        
        // 验证配置
        if (!recognition.continuous) {
            console.warn('⚠️ continuous 设置失败');
        }
        if (!recognition.interimResults) {
            console.warn('⚠️ interimResults 设置失败');
        }
        
        // 添加音频输入监听（如果支持）
        if (recognition.audio) {
            console.log('✅ 音频输入对象存在');
        }

        // 识别开始
        recognition.onstart = () => {
            console.log('✅ ========== 语音识别已启动 ==========');
            console.log('   识别对象:', recognition);
            console.log('   识别状态: 运行中');
            console.log('   配置确认:');
            console.log('     continuous:', recognition.continuous);
            console.log('     interimResults:', recognition.interimResults);
            console.log('     lang:', recognition.lang);
            this.isRecording = true;
            this.updateButton('recording');
            this.updateStatus('正在聆听，请大声说话...', '#6366f1');
            
            // 设置多个超时检查
            setTimeout(() => {
                if (this.isRecording && (!this.recognizedText || this.recognizedText.length === 0)) {
                    console.log('⚠️ 3秒内没有识别到结果');
                    this.updateStatus('请大声说话，确保麦克风正常工作', '#f59e0b');
                }
            }, 3000);
            
            setTimeout(() => {
                if (this.isRecording && (!this.recognizedText || this.recognizedText.length === 0)) {
                    console.log('⚠️ 5秒内没有识别到结果');
                    this.updateStatus('仍未识别到内容，请检查麦克风', '#f59e0b');
                }
            }, 5000);
            
            setTimeout(() => {
                if (this.isRecording && (!this.recognizedText || this.recognizedText.length === 0)) {
                    console.log('⚠️ 10秒内没有识别到结果');
                    console.log('   可能的原因:');
                    console.log('     1. 麦克风没有声音输入');
                    console.log('     2. 网络连接问题（语音识别需要网络）');
                    console.log('     3. 浏览器兼容性问题');
                    this.updateStatus('识别超时，请检查网络和麦克风', '#ef4444');
                }
            }, 10000);
        };

        // 识别结果 - 关键部分
        recognition.onresult = (event) => {
            console.log('========================================');
            console.log('📝 收到识别结果事件');
            console.log('完整事件对象:', event);
            console.log('结果总数:', event.results.length);
            console.log('当前索引:', event.resultIndex);
            console.log('results类型:', typeof event.results);
            console.log('results是否为数组:', Array.isArray(event.results));
            
            // 详细检查每个结果
            let newText = '';
            for (let i = 0; i < event.results.length; i++) {
                const result = event.results[i];
                console.log(`\n--- 检查结果[${i}] ---`);
                console.log('  result对象:', result);
                console.log('  result类型:', typeof result);
                console.log('  result是否为数组:', Array.isArray(result));
                console.log('  result.length:', result ? result.length : 'null');
                
                if (result) {
                    console.log('  result[0]:', result[0]);
                    console.log('  result[0]类型:', typeof result[0]);
                    
                    if (result[0]) {
                        console.log('  result[0].transcript:', result[0].transcript);
                        console.log('  result[0].confidence:', result[0].confidence);
                        console.log('  result.isFinal:', result.isFinal);
                        
                        if (result[0].transcript) {
                            newText += result[0].transcript;
                            console.log(`  ✅ 结果[${i}]: "${result[0].transcript}" (最终: ${result.isFinal})`);
                        } else {
                            console.log(`  ⚠️ 结果[${i}]没有transcript属性`);
                        }
                    } else {
                        console.log(`  ⚠️ 结果[${i}][0]不存在`);
                    }
                } else {
                    console.log(`  ⚠️ 结果[${i}]为null或undefined`);
                }
            }
            
            console.log('\n📋 本次识别文本:', newText);
            console.log('📋 文本长度:', newText.length);
            
            // 更新累积文本
            if (newText.length > 0) {
                this.recognizedText = newText;
                console.log('📋 累积文本:', this.recognizedText);
                
                // 立即更新到文本框
                this.updateTextArea(this.recognizedText);
            } else {
                console.log('⚠️ 没有识别到文本，跳过更新');
            }
            
            console.log('========================================\n');
        };

        // 识别错误
        recognition.onerror = (event) => {
            console.log('⚠️ ========== 识别错误 ==========');
            console.log('错误类型:', event.error);
            console.log('错误消息:', event.message);
            console.log('完整错误对象:', event);
            
            if (event.error === 'no-speech') {
                console.log('⚠️ 未检测到语音');
                this.updateStatus('未检测到语音，请大声说话', '#f59e0b');
                return;
            }
            
            if (event.error === 'aborted') {
                console.log('⚠️ 识别被中止（正常）');
                return;
            }
            
            if (event.error === 'not-allowed') {
                console.error('❌ 麦克风权限被拒绝');
                this.updateStatus('麦克风权限被拒绝，请在浏览器设置中允许', '#ef4444');
                this.stopRecording();
                return;
            }
            
            if (event.error === 'audio-capture') {
                console.error('❌ 无法访问麦克风');
                this.updateStatus('无法访问麦克风，请检查设备', '#ef4444');
                return;
            }
            
            if (event.error === 'network') {
                console.error('❌ 网络错误');
                this.updateStatus('网络错误，请检查网络连接', '#ef4444');
                return;
            }
            
            console.error('❌ 其他错误:', event.error);
            this.updateStatus('识别错误: ' + event.error, '#ef4444');
        };

        // 识别结束
        recognition.onend = () => {
            console.log('🔚 ========== 识别结束 ==========');
            console.log('录音状态:', this.isRecording);
            console.log('当前保存的文本:', this.recognizedText);
            console.log('文本长度:', this.recognizedText ? this.recognizedText.length : 0);
            
            // 确保文本被保存
            if (this.recognizedText && this.recognizedText.length > 0) {
                console.log('💾 识别结束时保存文本:', this.recognizedText);
                this.updateTextArea(this.recognizedText);
            } else {
                console.log('⚠️ 识别结束时没有文本');
            }
            
            // 如果还在录音，自动重启
            if (this.isRecording) {
                console.log('🔄 自动重启识别...');
                setTimeout(() => {
                    if (this.isRecording && this.recognition) {
                        try {
                            this.recognition.start();
                        } catch (error) {
                            console.error('重启失败:', error);
                            this.stopRecording();
                        }
                    }
                }, 100);
            }
        };

        return recognition;
    }

    setupEventListeners() {
        const voiceBtn = document.getElementById('voice-input-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                if (this.isRecording) {
                    this.stopRecording();
                } else {
                    this.startRecording();
                }
            });
        } else {
            console.error('❌ 未找到语音输入按钮');
        }
    }

    // 测试麦克风权限和功能
    async testMicrophone() {
        return new Promise((resolve, reject) => {
            console.log('🎤 测试麦克风权限...');
            
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    console.log('✅ 麦克风权限已授予');
                    console.log('   音频轨道:', stream.getAudioTracks());
                    
                    // 检查是否有音频轨道
                    const audioTracks = stream.getAudioTracks();
                    if (audioTracks.length === 0) {
                        console.error('❌ 没有音频轨道');
                        stream.getTracks().forEach(track => track.stop());
                        reject(new Error('没有音频轨道'));
                        return;
                    }
                    
                    console.log('   音频轨道信息:');
                    audioTracks.forEach((track, index) => {
                        console.log(`     轨道[${index}]:`, {
                            label: track.label,
                            enabled: track.enabled,
                            muted: track.muted,
                            readyState: track.readyState,
                            settings: track.getSettings()
                        });
                    });
                    
                    // 停止测试流
                    stream.getTracks().forEach(track => track.stop());
                    console.log('✅ 麦克风测试完成');
                    resolve();
                })
                .catch((error) => {
                    console.error('❌ 麦克风权限测试失败:', error);
                    console.error('   错误名称:', error.name);
                    console.error('   错误消息:', error.message);
                    
                    if (error.name === 'NotAllowedError') {
                        reject(new Error('麦克风权限被拒绝'));
                    } else if (error.name === 'NotFoundError') {
                        reject(new Error('未找到麦克风设备'));
                    } else {
                        reject(error);
                    }
                });
        });
    }

    startRecording() {
        console.log('🎤 ========== 开始录音 ==========');
        
        if (this.isRecording) {
            console.log('已经在录音中');
            return;
        }

        if (!this.isSupported) {
            console.log('浏览器不支持，使用模拟');
            this.simulateVoiceInput();
            return;
        }

        // 清空文本
        this.recognizedText = '';
        this.updateTextArea('');

        // 创建识别对象
        this.recognition = this.createRecognition();
        if (!this.recognition) {
            console.error('无法创建识别对象');
            return;
        }

        // 启动
        try {
            this.recognition.start();
            console.log('✅ 识别启动命令已发送');
        } catch (error) {
            console.error('❌ 启动失败:', error);
            if (error.name === 'InvalidStateError') {
                this.recognition = null;
                setTimeout(() => this.startRecording(), 300);
            } else {
                this.simulateVoiceInput();
            }
        }
    }

    stopRecording() {
        console.log('⏹️ ========== 停止录音 ==========');
        
        if (!this.isRecording) {
            return;
        }

        this.isRecording = false;

        // 停止识别
        if (this.recognition) {
            try {
                // 先尝试获取最后的结果
                console.log('🔄 停止前，尝试获取最后结果...');
                // 等待一小段时间，让onresult事件有机会触发
                setTimeout(() => {
                    console.log('💾 停止时保存文本:', this.recognizedText);
                    console.log('💾 文本长度:', this.recognizedText ? this.recognizedText.length : 0);
                    
                    if (this.recognizedText && this.recognizedText.length > 0) {
                        console.log('✅ 有识别文本，更新文本框');
                        this.updateTextArea(this.recognizedText);
                        this.updateStatus('识别完成！', '#10b981');
                    } else {
                        console.log('⚠️ 没有识别到文本');
                        this.updateStatus('未识别到内容，请重试', '#f59e0b');
                    }
                }, 300);
                
                this.recognition.stop();
            } catch (error) {
                console.log('停止时出错（可忽略）:', error.message);
            }
            this.recognition = null;
        }

        // 更新UI
        this.updateButton('stopped');
        this.removeAnimation();
    }

    // 更新文本框 - 使用多种方法确保成功
    updateTextArea(text) {
        console.log('🔧 更新文本框，文本:', text);
        console.log('   文本长度:', text.length);
        
        // 方法1: 通过ID获取
        let textarea = document.getElementById('question');
        
        // 方法2: 如果找不到，尝试其他方式
        if (!textarea) {
            console.warn('⚠️ 通过ID找不到，尝试其他方式...');
            textarea = document.querySelector('textarea#question');
        }
        
        if (!textarea) {
            textarea = document.querySelector('textarea[placeholder*="占卜"]');
        }
        
        if (!textarea) {
            const allTextareas = document.querySelectorAll('textarea');
            console.error('❌ 未找到文本框，当前页面有', allTextareas.length, '个textarea');
            allTextareas.forEach((ta, i) => {
                console.log(`   textarea[${i}]: id="${ta.id}", placeholder="${ta.placeholder}"`);
            });
            return;
        }

        console.log('✅ 找到文本框');
        console.log('   ID:', textarea.id);
        console.log('   更新前值:', textarea.value);
        console.log('   更新前长度:', textarea.value.length);

        // 设置值
        textarea.value = text;
        
        // 使用多种方式确保值被设置
        textarea.setAttribute('value', text);
        textarea.textContent = text;
        
        console.log('   更新后值:', textarea.value);
        console.log('   更新后长度:', textarea.value.length);

        // 触发事件
        ['input', 'change', 'keyup'].forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            textarea.dispatchEvent(event);
        });

        // 聚焦
        textarea.focus();
        textarea.blur();
        textarea.focus();

        // 验证
        setTimeout(() => {
            const currentValue = document.getElementById('question')?.value || '';
            console.log('⏱️ 100ms后验证:');
            console.log('   期望:', text);
            console.log('   实际:', currentValue);
            console.log('   匹配:', currentValue === text);
            
            if (currentValue !== text && text.length > 0) {
                console.error('❌ 值不匹配！强制重新设置');
                const ta = document.getElementById('question');
                if (ta) {
                    ta.value = text;
                    ta.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        }, 100);
    }

    updateButton(state) {
        const voiceBtn = document.getElementById('voice-input-btn');
        if (!voiceBtn) return;

        const icon = voiceBtn.querySelector('.voice-icon');
        const text = voiceBtn.querySelector('.voice-text');

        if (state === 'recording') {
            voiceBtn.classList.add('recording');
            if (icon) icon.textContent = '⏹️';
            if (text) text.textContent = '点击停止录音';
            this.addAnimation();
        } else {
            voiceBtn.classList.remove('recording');
            if (icon) icon.textContent = '🎤';
            if (text) text.textContent = '点击语音输入';
            this.removeAnimation();
        }
    }

    updateStatus(message, color) {
        const voiceStatus = document.getElementById('voice-status');
        if (voiceStatus) {
            voiceStatus.textContent = message;
            voiceStatus.style.color = color;
        }
    }

    simulateVoiceInput() {
        console.log('使用模拟输入');
        this.updateButton('recording');
        this.updateStatus('正在聆听，请说出您的占卜问题...', '#6366f1');
        this.addAnimation();
        
        setTimeout(() => {
            const randomQuestion = this.sampleQuestions[Math.floor(Math.random() * this.sampleQuestions.length)];
            this.recognizedText = randomQuestion;
            this.updateTextArea(randomQuestion);
            this.updateStatus('语音识别完成！', '#10b981');
            
            setTimeout(() => {
                this.updateButton('stopped');
                this.updateStatus('请说出您的占卜问题...', '#9ca3af');
            }, 2000);
        }, 2000);
    }

    addAnimation() {
        const voiceBtn = document.getElementById('voice-input-btn');
        if (!voiceBtn || voiceBtn.querySelector('.voice-waves')) return;

        const waves = document.createElement('div');
        waves.className = 'voice-waves';
        waves.innerHTML = `
            <div class="wave wave-1"></div>
            <div class="wave wave-2"></div>
            <div class="wave wave-3"></div>
        `;
        voiceBtn.appendChild(waves);

        if (!document.getElementById('voice-waves-style')) {
            const style = document.createElement('style');
            style.id = 'voice-waves-style';
            style.textContent = `
                .voice-waves {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    display: flex;
                    gap: 3px;
                    pointer-events: none;
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

    removeAnimation() {
        const voiceBtn = document.getElementById('voice-input-btn');
        if (voiceBtn) {
            const waves = voiceBtn.querySelector('.voice-waves');
            if (waves) waves.remove();
        }
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
            speechSynthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
    }

    loadVoices() {
        this.voices = speechSynthesis.getVoices();
        this.selectedVoice = this.voices.find(voice => 
            voice.lang.includes('zh') || voice.lang.includes('CN')
        ) || this.voices[0];
    }

    speak(text, options = {}) {
        if (!this.isSupported) {
            console.warn('浏览器不支持语音合成');
            return;
        }

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
            if (event.error !== 'interrupted') {
                console.error('语音播报错误:', event.error);
            }
            this.onSpeechEnd();
        };

        speechSynthesis.speak(this.currentUtterance);
    }

    stop() {
        if (this.isSupported) {
            speechSynthesis.cancel();
            this.onSpeechEnd();
        }
    }

    onSpeechStart() {
        const playBtn = document.getElementById('play-audio');
        if (playBtn) {
            playBtn.innerHTML = '<span>⏸️ 停止播报</span>';
            playBtn.classList.add('playing');
        }
    }

    onSpeechEnd() {
        const playBtn = document.getElementById('play-audio');
        if (playBtn) {
            playBtn.innerHTML = '<span>🔊 语音播报</span>';
            playBtn.classList.remove('playing');
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
    
    // 添加全局测试函数
    window.testTextArea = (text) => {
        console.log('🧪 测试文本框更新，文本:', text);
        if (voiceInputSimulator) {
            voiceInputSimulator.updateTextArea(text);
        } else {
            const ta = document.getElementById('question');
            if (ta) {
                ta.value = text;
                console.log('✅ 直接更新成功');
            } else {
                console.error('❌ 未找到文本框');
            }
        }
    };
    
    console.log('💡 提示：可以在控制台输入 testTextArea("测试文本") 来测试文本框更新');
});
