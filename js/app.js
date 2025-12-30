// 主应用控制器
class CosmicResonanceApp {
    constructor() {
        this.isLoaded = false;
        this.currentSection = 'welcome';
        this.starField3D = null;
        this.backgroundStarfield = null;
        this.gestureController = null;
        this.soundEnabled = true;
        this.isFullscreen = false;
        
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupEventListeners();
        this.setupCustomCursor();
        this.setupSoundSystem();
        
        // 延迟初始化以确保页面完全加载
        setTimeout(() => {
            this.initializeComponents();
        }, 1000);
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        // 模拟加载过程
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                // 加载完成，显示主应用
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        app.classList.remove('hidden');
                        this.onAppLoaded();
                    }, 500);
                }, 500);
            }
            
            const progressBar = document.querySelector('.loading-progress');
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
        }, 200);
    }

    onAppLoaded() {
        this.isLoaded = true;
        
        // 初始化背景星空
        this.backgroundStarfield = new BackgroundStarfield('starfield-bg');
        
        // 播放欢迎动画
        this.playWelcomeAnimation();
        
        // 开始播放环境音效
        this.playAmbientSound();
    }

    initializeComponents() {
        // 初始化3D星空（延迟加载，确保DOM已准备好）
        setTimeout(() => {
            const canvas = document.getElementById('starfield-canvas');
            if (canvas) {
                console.log('找到星空画布，开始初始化...');
                try {
                    this.starField3D = new StarField3D('starfield-canvas');
                    console.log('星空场景创建成功');
                } catch (error) {
                    console.error('星空场景创建失败:', error);
                }
            } else {
                console.warn('未找到星空画布元素');
            }
        }, 1000);
    }

    setupEventListeners() {
        // 开始体验按钮
        const startBtn = document.getElementById('start-experience');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startExperience();
            });
        }

        // 激活占卜按钮
        const activateBtn = document.getElementById('activate-divination');
        if (activateBtn) {
            activateBtn.addEventListener('click', () => {
                this.activateDivination();
            });
        }

        // 重置视角按钮
        const resetBtn = document.getElementById('reset-view');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetStarfieldView();
            });
        }

        // 音效开关
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                this.toggleSound();
            });
        }

        // 全屏按钮
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // 进度指示器点击
        document.querySelectorAll('.progress-step').forEach(step => {
            step.addEventListener('click', () => {
                const section = step.dataset.section;
                if (section && this.canNavigateToSection(section)) {
                    this.navigateToSection(section);
                }
            });
        });

        // 键盘快捷键
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });

        // 窗口失焦时暂停动画
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // 启用手势控制按钮（使用事件委托，确保元素存在时能绑定）
        document.addEventListener('click', (event) => {
            // 检查点击的是按钮本身或按钮内的元素
            const target = event.target;
            if (target && (target.id === 'enable-gesture' || target.closest('#enable-gesture'))) {
                event.preventDefault();
                event.stopPropagation();
                console.log('手势控制按钮被点击');
                this.enableGestureControl();
            }
        });
        
        // 也尝试直接绑定（延迟绑定，确保元素已存在）
        setTimeout(() => {
            const enableGestureBtn = document.getElementById('enable-gesture');
            if (enableGestureBtn) {
                console.log('找到手势控制按钮，直接绑定事件');
                enableGestureBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('手势控制按钮被点击（直接绑定）');
                    this.enableGestureControl();
                });
            } else {
                console.warn('未找到手势控制按钮');
            }
        }, 2000);
    }

    setupCustomCursor() {
        let cursor = document.querySelector('body::after');
        
        document.addEventListener('mousemove', (e) => {
            // 更新自定义光标位置
            document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
            document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
        });

        // 添加CSS变量支持
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --cursor-x: 0px;
                --cursor-y: 0px;
            }
            
            body::after {
                left: var(--cursor-x);
                top: var(--cursor-y);
                transform: translate(-50%, -50%);
            }
            
            .interactive-element:hover {
                transform: scale(1.05);
                transition: transform 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    }

    setupSoundSystem() {
        // 预加载音频文件
        const ambientSound = document.getElementById('ambient-sound');
        const clickSound = document.getElementById('click-sound');
        
        if (ambientSound) {
            ambientSound.volume = 0.3;
            ambientSound.loop = true;
        }
        
        if (clickSound) {
            clickSound.volume = 0.5;
        }
    }

    playWelcomeAnimation() {
        const titleElement = document.querySelector('.main-title');
        const featuresElement = document.querySelector('.feature-highlights');
        const startBtnElement = document.querySelector('.start-btn');
        
        // 标题动画
        if (titleElement) {
            gsap.fromTo(titleElement, 
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
            );
        }
        
        // 功能特性动画
        if (featuresElement) {
            gsap.fromTo(featuresElement.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 0.5, ease: "power2.out" }
            );
        }
        
        // 开始按钮动画
        if (startBtnElement) {
            gsap.fromTo(startBtnElement,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.6, delay: 1.2, ease: "back.out(1.7)" }
            );
        }
    }

    startExperience() {
        this.playClickSound();
        this.navigateToSection('starfield');
        
        // 显示引导提示
        setTimeout(() => {
            this.showGuidanceMessage('尝试拖拽鼠标旋转星空，滚轮缩放，点击星座了解详情');
        }, 1000);
    }

    activateDivination() {
        this.playClickSound();
        
        if (this.starField3D) {
            this.starField3D.activateDivination();
        }
        
        // 延迟跳转到输入界面
        setTimeout(() => {
            this.navigateToSection('input');
        }, 2500);
    }

    resetStarfieldView() {
        this.playClickSound();
        
        if (this.starField3D) {
            this.starField3D.resetView();
        }
    }

    navigateToSection(sectionName) {
        if (!this.canNavigateToSection(sectionName)) {
            return;
        }

        // 隐藏当前区域
        const currentSection = document.getElementById(`${this.currentSection}-section`);
        if (currentSection) {
            currentSection.classList.remove('active');
        }

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

        this.currentSection = sectionName;
        
        // 区域切换动画
        this.playTransitionAnimation(targetSection);
    }

    canNavigateToSection(sectionName) {
        // 定义导航规则
        const navigationRules = {
            'welcome': true,
            'starfield': true,
            'input': true,
            'process': false, // 只能通过占卜流程进入
            'result': false   // 只能通过占卜完成进入
        };

        return navigationRules[sectionName] || false;
    }

    playTransitionAnimation(targetElement) {
        if (targetElement) {
            gsap.fromTo(targetElement,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundToggle = document.getElementById('sound-toggle');
        const ambientSound = document.getElementById('ambient-sound');
        
        if (soundToggle) {
            soundToggle.textContent = this.soundEnabled ? '🔊' : '🔇';
        }
        
        if (ambientSound) {
            if (this.soundEnabled) {
                ambientSound.play().catch(() => {});
            } else {
                ambientSound.pause();
            }
        }
    }

    toggleFullscreen() {
        if (!this.isFullscreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
        
        this.isFullscreen = !this.isFullscreen;
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.textContent = this.isFullscreen ? '⛶' : '⛶';
        }
    }

    playAmbientSound() {
        if (this.soundEnabled) {
            const ambientSound = document.getElementById('ambient-sound');
            if (ambientSound) {
                ambientSound.play().catch(() => {
                    // 自动播放被阻止，等待用户交互
                    document.addEventListener('click', () => {
                        ambientSound.play().catch(() => {});
                    }, { once: true });
                });
            }
        }
    }

    playClickSound() {
        if (this.soundEnabled) {
            const clickSound = document.getElementById('click-sound');
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(() => {});
            }
        }
    }

    handleKeyboardShortcuts(event) {
        // 如果用户在输入框或文本框中输入，不处理快捷键
        const isInputFocused = event.target.tagName === 'INPUT' || 
                               event.target.tagName === 'TEXTAREA' ||
                               event.target.isContentEditable;
        
        if (isInputFocused) {
            return; // 在输入框中输入时，不处理快捷键
        }
        
        // ESC键退出全屏
        if (event.key === 'Escape' && this.isFullscreen) {
            this.toggleFullscreen();
        }
        
        // 空格键切换音效
        if (event.key === ' ' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            event.preventDefault();
            this.toggleSound();
        }
        
        // 数字键快速导航（仅在非输入状态下）
        const sectionMap = {
            '1': 'welcome',
            '2': 'starfield',
            '3': 'input'
        };
        
        if (sectionMap[event.key]) {
            this.navigateToSection(sectionMap[event.key]);
        }
    }

    handleVisibilityChange() {
        const ambientSound = document.getElementById('ambient-sound');
        
        if (document.hidden) {
            // 页面失焦，暂停音频
            if (ambientSound && !ambientSound.paused) {
                ambientSound.pause();
            }
        } else {
            // 页面获得焦点，恢复音频
            if (ambientSound && this.soundEnabled) {
                ambientSound.play().catch(() => {});
            }
        }
    }

    showGuidanceMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'guidance-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(102, 102, 241, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 10000;
            animation: guidanceSlide 5s ease forwards;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
        
        // 添加动画CSS
        if (!document.querySelector('#guidance-animation-style')) {
            const style = document.createElement('style');
            style.id = 'guidance-animation-style';
            style.textContent = `
                @keyframes guidanceSlide {
                    0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    10%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 性能优化方法
    optimizePerformance() {
        // 减少动画频率
        if (this.starField3D) {
            this.starField3D.setLowPerformanceMode(true);
        }
        
        // 减少粒子数量
        if (this.backgroundStarfield) {
            this.backgroundStarfield.reduceDensity();
        }
    }

    // 启用手势控制
    enableGestureControl() {
        console.log('enableGestureControl 被调用');
        console.log('starField3D:', this.starField3D);
        console.log('当前section:', this.currentSection);
        
        if (!this.starField3D) {
            console.warn('星空未加载完成');
            this.showGuidanceMessage('请先等待星空加载完成');
            return;
        }

        if (this.gestureController) {
            // 如果已经启用，则关闭
            console.log('关闭手势控制，清理资源...');
            this.gestureController.stop();
            this.gestureController = null;
            
            // 确保清理所有遗留元素
            const videoContainers = document.querySelectorAll('.gesture-video-container');
            videoContainers.forEach(container => container.remove());
            
            const btn = document.getElementById('enable-gesture');
            if (btn) {
                btn.textContent = '启用手势控制';
                btn.style.background = 'var(--gradient-primary)';
            }
            this.showGuidanceMessage('手势控制已关闭');
            return;
        }

        // 创建手势控制器
        try {
            console.log('正在启用手势控制...');
            console.log('星空场景对象:', this.starField3D);
            console.log('星空场景位置:', this.starField3D ? this.starField3D.scene.position : 'N/A');
            
            if (!this.starField3D || !this.starField3D.scene) {
                this.showGuidanceMessage('星空场景未加载，请稍候再试');
                return;
            }
            
            this.gestureController = new GestureController(this.starField3D);
            const btn = document.getElementById('enable-gesture');
            if (btn) {
                btn.textContent = '关闭手势控制';
                btn.style.background = 'rgba(239, 68, 68, 0.8)';
            }
            this.showGuidanceMessage('手势控制已启动：左右摆手移动星空，两指缩放');
        } catch (error) {
            console.error('启用手势控制失败:', error);
            // 尝试使用简化版本
            try {
                console.log('尝试使用简化模式...');
                this.gestureController = new SimpleGestureController(this.starField3D);
                const btn = document.getElementById('enable-gesture');
                if (btn) {
                    btn.textContent = '关闭手势控制';
                    btn.style.background = 'rgba(239, 68, 68, 0.8)';
                }
                this.showGuidanceMessage('使用基础手势模式');
            } catch (e) {
                console.error('简化模式也失败:', e);
                this.showGuidanceMessage('手势控制启动失败: ' + e.message);
            }
        }
    }

    // 错误处理
    handleError(error, context) {
        console.error(`错误发生在 ${context}:`, error);
        
        // 显示用户友好的错误信息
        this.showGuidanceMessage('抱歉，发生了一些技术问题，请刷新页面重试');
    }
}

// 工具函数
const Utils = {
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 随机数生成
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // 角度转弧度
    degToRad(degrees) {
        return degrees * (Math.PI / 180);
    },

    // 弧度转角度
    radToDeg(radians) {
        return radians * (180 / Math.PI);
    }
};

// 全局应用实例
let cosmicApp;

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    try {
        cosmicApp = new CosmicResonanceApp();
    } catch (error) {
        console.error('应用初始化失败:', error);
    }
});

// 页面卸载前清理
window.addEventListener('beforeunload', () => {
    if (cosmicApp) {
        // 清理资源
        const ambientSound = document.getElementById('ambient-sound');
        if (ambientSound) {
            ambientSound.pause();
        }
    }
});

// 错误捕获
window.addEventListener('error', (event) => {
    if (cosmicApp) {
        cosmicApp.handleError(event.error, '全局错误');
    }
});

// 未处理的Promise拒绝
window.addEventListener('unhandledrejection', (event) => {
    if (cosmicApp) {
        cosmicApp.handleError(event.reason, 'Promise拒绝');
    }
});

