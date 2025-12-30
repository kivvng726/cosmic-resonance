// 占卜引擎
class DivinationEngine {
    constructor() {
        this.isProcessing = false;
        this.currentStep = 0;
        this.steps = [
            { id: 'step-1', name: '连接NASA数据库', duration: 2000 },
            { id: 'step-2', name: '查询紫金山天文台', duration: 1500 },
            { id: 'step-3', name: 'AI智能分析', duration: 3000 },
            { id: 'step-4', name: '生成专属内容', duration: 2500 }
        ];
        
        this.planetaryData = {
            sun: { name: '太阳', symbol: '☉', influence: '生命力、领导力、自我表达' },
            moon: { name: '月亮', symbol: '☽', influence: '情感、直觉、内在需求' },
            mercury: { name: '水星', symbol: '☿', influence: '沟通、思维、学习能力' },
            venus: { name: '金星', symbol: '♀', influence: '爱情、美感、价值观' },
            mars: { name: '火星', symbol: '♂', influence: '行动力、勇气、竞争力' },
            jupiter: { name: '木星', symbol: '♃', influence: '扩展、智慧、机遇' },
            saturn: { name: '土星', symbol: '♄', influence: '责任、限制、成熟' }
        };
        
        this.constellations = {
            '北斗七星': {
                description: '紫微垣的重要组成，主管帝王之事，象征权威与指引',
                fortune: '星河璀璨照前程，智慧如光破迷津',
                advice: '当前正值运势上升期，宜把握机遇，积极进取'
            },
            '猎户座': {
                description: '西方天空的猎人，象征勇气与冒险精神',
                fortune: '猎户当空志气昂，勇敢追梦必辉煌',
                advice: '适合开拓新领域，发挥个人才能，但需注意平衡'
            }
        };
        
        this.sampleReadings = [
            {
                text: '根据您的出生星图分析，当前火星位于您的事业宫，与木星形成三分相，这是一个极为有利的星象配置。您的创造力和执行力都处于高峰期，特别适合开展新的项目或寻求突破。水星在您的沟通宫逆行即将结束，意味着之前在交流和决策方面的障碍将逐渐消除。建议您在接下来的一个月内积极行动，把握这难得的机遇期。同时，金星的和谐相位也为您的人际关系带来正面影响，合作伙伴关系将更加稳固。',
                aspects: '火星 ♂ 三分 木星 ♃ | 太阳 ☉ 六分 金星 ♀ | 水星 ☿ 逆行结束',
                fortune: '星河璀璨照前程，智慧如光破迷津'
            },
            {
                text: '您的星盘显示，太阳与金星在您的感情宫形成合相，这预示着近期在人际关系方面会有积极的发展。月亮位于您的财帛宫，暗示着财运稳步上升，但需要注意理性投资。土星在您的健康宫提醒您要关注身体状况，保持规律的作息。当前的星象配置特别有利于学习和自我提升，建议您可以考虑参加一些培训课程或深造计划。',
                aspects: '太阳 ☉ 合相 金星 ♀ | 月亮 ☽ 位于财帛宫 | 土星 ♄ 位于健康宫',
                fortune: '月明星稀好时光，贵人相助事业昌'
            },
            {
                text: '从紫微斗数的角度分析，您的命宫主星为紫微星，具有领导才能和高贵气质。当前大限走入财帛宫，正是积累财富的好时机。流年遇到天机星，表示您的智慧和策略能力将得到充分发挥。建议您在决策时多听取他人意见，集思广益。同时，注意与长辈的关系，他们可能为您带来重要的指导和帮助。',
                aspects: '紫微星 主导命宫 | 天机星 影响流年 | 财帛宫 大限所在',
                fortune: '紫微高照福满堂，天机妙算显智光'
            }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 开始占卜按钮
        const startBtn = document.getElementById('start-divination');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startDivination();
            });
        }

        // 重新占卜按钮
        const newBtn = document.getElementById('new-divination');
        if (newBtn) {
            newBtn.addEventListener('click', () => {
                this.resetDivination();
            });
        }

        // 语音播报按钮
        const audioBtn = document.getElementById('play-audio');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                // 检查是否正在播报
                if (audioBtn.classList.contains('playing')) {
                    // 如果正在播报，停止播报
                    this.stopAudioReading();
                } else {
                    // 如果没有播报，开始播报
                    this.playAudioReading();
                }
            });
        }

        // 分享结果按钮
        const shareBtn = document.getElementById('share-result');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareResult();
            });
        }

        // 监听星星点击事件
        document.addEventListener('starClicked', (event) => {
            this.onStarClicked(event.detail);
        });

        // 监听占卜激活事件
        document.addEventListener('divinationActivated', () => {
            this.onDivinationActivated();
        });
    }

    startDivination() {
        const birthDate = document.getElementById('birth-date').value;
        const question = document.getElementById('question').value;

        if (!birthDate || !question.trim()) {
            this.showError('请填写完整的出生日期和占卜问题');
            return;
        }

        this.isProcessing = true;
        this.currentStep = 0;

        // 切换到处理界面
        this.switchToSection('process');
        
        // 开始处理步骤
        this.processSteps();
    }

    processSteps() {
        if (this.currentStep >= this.steps.length) {
            // 所有步骤完成，显示结果
            setTimeout(() => {
                this.showResults();
            }, 500);
            return;
        }

        const step = this.steps[this.currentStep];
        const stepElement = document.getElementById(step.id);
        
        if (stepElement) {
            // 激活当前步骤
            stepElement.classList.add('active');
            
            // 播放步骤音效
            this.playStepSound();
            
            // 模拟处理时间
            setTimeout(() => {
                this.currentStep++;
                this.processSteps();
            }, step.duration);
        }
    }

    showResults() {
        this.isProcessing = false;
        
        // 生成占卜结果
        const result = this.generateDivinationResult();
        
        // 显示结果
        this.displayResult(result);
        
        // 切换到结果界面
        this.switchToSection('result');
    }

    generateDivinationResult() {
        const birthDate = document.getElementById('birth-date').value;
        const question = document.getElementById('question').value;
        
        // 根据生日计算星座等信息
        const birthInfo = this.calculateBirthInfo(birthDate);
        
        // 随机选择一个解读模板
        const template = this.sampleReadings[Math.floor(Math.random() * this.sampleReadings.length)];
        
        // 个性化处理
        const personalizedReading = this.personalizeReading(template, birthInfo, question);
        
        return personalizedReading;
    }

    calculateBirthInfo(birthDate) {
        const date = new Date(birthDate);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // 简单的星座计算
        let zodiacSign = '';
        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) {
            zodiacSign = '白羊座';
        } else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) {
            zodiacSign = '金牛座';
        } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
            zodiacSign = '双子座';
        } else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) {
            zodiacSign = '巨蟹座';
        } else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
            zodiacSign = '狮子座';
        } else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
            zodiacSign = '处女座';
        } else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
            zodiacSign = '天秤座';
        } else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) {
            zodiacSign = '天蝎座';
        } else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) {
            zodiacSign = '射手座';
        } else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) {
            zodiacSign = '摩羯座';
        } else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) {
            zodiacSign = '水瓶座';
        } else {
            zodiacSign = '双鱼座';
        }
        
        return {
            zodiacSign,
            birthDate,
            month,
            day
        };
    }

    personalizeReading(template, birthInfo, question) {
        // 根据问题类型调整解读重点
        let focusArea = '综合运势';
        if (question.includes('事业') || question.includes('工作')) {
            focusArea = '事业发展';
        } else if (question.includes('感情') || question.includes('爱情')) {
            focusArea = '感情运势';
        } else if (question.includes('财运') || question.includes('投资')) {
            focusArea = '财富运势';
        } else if (question.includes('健康')) {
            focusArea = '健康状况';
        }

        // 个性化文本
        const personalizedText = template.text.replace(
            '根据您的出生星图分析',
            `根据您${birthInfo.zodiacSign}的星图分析，针对您关于"${focusArea}"的问题`
        );

        return {
            ...template,
            text: personalizedText,
            birthInfo,
            focusArea
        };
    }

    displayResult(result) {
        // 显示占卜文本
        const readingElement = document.getElementById('divination-reading');
        if (readingElement) {
            this.typewriterEffect(readingElement, result.text);
        }

        // 显示行星相位
        const aspectsElement = document.getElementById('planetary-aspects');
        if (aspectsElement) {
            setTimeout(() => {
                aspectsElement.innerHTML = `
                    <h3>行星相位分析</h3>
                    <p style="color: var(--text-muted); margin-bottom: 1rem;">${result.aspects}</p>
                    <div style="background: rgba(102, 102, 241, 0.1); padding: 1rem; border-radius: 10px;">
                        <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">重点关注</h4>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">${result.focusArea} - ${result.birthInfo.zodiacSign}</p>
                    </div>
                `;
            }, 2000);
        }

        // 显示签文
        const poemElement = document.getElementById('fortune-poem');
        if (poemElement) {
            setTimeout(() => {
                poemElement.querySelector('.poem-content').innerHTML = `
                    <div style="font-size: 1.4rem; margin-bottom: 0.5rem;">${result.fortune}</div>
                    <div style="font-size: 0.9rem; opacity: 0.8;">— 寰宇回响 专属签文 —</div>
                `;
                poemElement.style.animation = 'fadeInUp 1s ease';
            }, 3000);
        }

        // 显示插画占位符
        const artElement = document.getElementById('constellation-art');
        if (artElement) {
            setTimeout(() => {
                artElement.innerHTML = `
                    <div class="art-placeholder">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">🌌</div>
                        <p>专属星象插画</p>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">
                            ${result.birthInfo.zodiacSign} × ${result.focusArea}
                        </p>
                    </div>
                `;
            }, 1500);
        }
    }

    typewriterEffect(element, text) {
        element.innerHTML = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 30);
    }

    playAudioReading() {
        const readingText = document.getElementById('divination-reading').textContent;
        const fortuneText = document.getElementById('fortune-poem').textContent;
        const fullText = readingText + '。' + fortuneText;
        
        if (textToSpeechSimulator) {
            textToSpeechSimulator.speak(fullText, {
                rate: 0.8,
                pitch: 1.1,
                volume: 0.9
            });
        }
    }

    stopAudioReading() {
        if (textToSpeechSimulator) {
            textToSpeechSimulator.stop();
        }
    }

    shareResult() {
        const readingText = document.getElementById('divination-reading').textContent;
        const fortuneText = document.getElementById('fortune-poem').textContent;
        
        const shareText = `寰宇回响 - 我的星象占卜结果\n\n${readingText}\n\n${fortuneText}\n\n体验地址：${window.location.href}`;
        
        if (navigator.share) {
            navigator.share({
                title: '寰宇回响 - 我的星象占卜结果',
                text: shareText,
                url: window.location.href
            }).catch(console.error);
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(shareText).then(() => {
                this.showMessage('占卜结果已复制到剪贴板');
            }).catch(() => {
                // 降级方案
                const textArea = document.createElement('textarea');
                textArea.value = shareText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showMessage('占卜结果已复制到剪贴板');
            });
        }
    }

    resetDivination() {
        // 重置表单
        document.getElementById('birth-date').value = '';
        document.getElementById('question').value = '';
        
        // 重置步骤状态
        this.steps.forEach(step => {
            const stepElement = document.getElementById(step.id);
            if (stepElement) {
                stepElement.classList.remove('active');
            }
        });
        
        // 返回输入界面
        this.switchToSection('input');
        
        this.isProcessing = false;
        this.currentStep = 0;
    }

    onStarClicked(starData) {
        // 星星被点击时的处理
        this.showMessage(`您点击了 ${starData.name}，这将影响您的占卜结果`);
        
        // 可以根据点击的星星调整占卜参数
        this.selectedStar = starData;
    }

    onDivinationActivated() {
        // 占卜被激活时自动跳转到输入界面
        this.switchToSection('input');
        this.showMessage('占星术已激活，请输入您的信息开始占卜');
    }

    switchToSection(sectionName) {
        // 隐藏所有区域
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // 显示目标区域
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // 更新进度指示器
        document.querySelectorAll('.progress-step').forEach(step => {
            step.classList.remove('active');
        });
        
        const activeStep = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeStep) {
            activeStep.classList.add('active');
        }
    }

    showMessage(message) {
        // 创建消息提示
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-toast';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 10000;
            animation: messageSlide 3s ease forwards;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
        
        // 添加动画CSS
        if (!document.querySelector('#message-animation-style')) {
            const style = document.createElement('style');
            style.id = 'message-animation-style';
            style.textContent = `
                @keyframes messageSlide {
                    0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showError(message) {
        this.showMessage('❌ ' + message);
    }

    playStepSound() {
        // 播放步骤音效（如果有的话）
        const clickSound = document.getElementById('click-sound');
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {
                // 忽略音频播放错误
            });
        }
    }
}

// 全局实例
let divinationEngine;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    divinationEngine = new DivinationEngine();
});

