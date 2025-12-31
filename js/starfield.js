// 3D星空场景管理器
class StarField3D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found:', canvasId);
            return;
        }
        
        // 检查 Three.js 是否加载
        if (typeof THREE === 'undefined') {
            console.error('Three.js 未加载！请检查 CDN 链接');
            alert('Three.js 库加载失败，请检查网络连接');
            return;
        }
        
        console.log('Three.js 版本:', THREE.REVISION);
        console.log('Canvas 元素:', this.canvas);
        console.log('Canvas 尺寸:', this.canvas.clientWidth, 'x', this.canvas.clientHeight);
        
        this.scene = new THREE.Scene();
        
        // 确保有有效的宽高
        const width = this.canvas.clientWidth || 800;
        const height = this.canvas.clientHeight || 600;
        
        if (width === 0 || height === 0) {
            console.warn('Canvas 尺寸为 0，等待尺寸更新...');
            setTimeout(() => {
                this.initWithRetry();
            }, 500);
            return;
        }
        
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            alpha: false, // 不透明，使用黑色背景
            antialias: true, // 抗锯齿
            powerPreference: "high-performance" // 高性能模式
        });
        
        this.stars = [];
        this.constellations = [];
        this.isInteracting = false;
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        
        this.init();
        this.setupEventListeners();
        this.animate();
        
        console.log('星空场景初始化完成');
    }
    
    initWithRetry() {
        const width = this.canvas.clientWidth || 800;
        const height = this.canvas.clientHeight || 600;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            alpha: false,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        console.log('初始化星空场景...');
        const width = this.canvas.clientWidth || 800;
        const height = this.canvas.clientHeight || 600;
        console.log('Canvas尺寸:', width, 'x', height);
        
        // 设置渲染器
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000, 1); // 纯黑背景，突出星星
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 高DPI支持，限制最大2倍
        // 确保输出编码正确，避免颜色失真（r128版本使用outputEncoding）
        if (this.renderer.outputEncoding !== undefined) {
            this.renderer.outputEncoding = THREE.sRGBEncoding;
        }
        if (this.renderer.toneMapping !== undefined) {
            this.renderer.toneMapping = THREE.NoToneMapping; // 禁用色调映射，保持原始颜色
        }
        
        // 设置相机位置
        this.camera.position.z = 5;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        // 初始化场景位置和旋转为0（确保完全静态）
        this.scene.position.set(0, 0, 0);
        this.scene.rotation.set(0, 0, 0);
        
        // 加载背景图片
        this.loadBackgroundImage();
        
        console.log('创建星空粒子...');
        // 创建简洁的白色星星
        this.createStarField();
        
        console.log('创建星座...');
        this.createConstellations();
        
        // 只添加必要的环境光（用于星座的 MeshStandardMaterial）
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        console.log('星空场景初始化完成，星星数量:', this.stars.length);
        console.log('场景对象数量:', this.scene.children.length);
        console.log('场景子对象详情:');
        this.scene.children.forEach((child, index) => {
            console.log(`  对象[${index}]:`, child.type, child);
        });
        
        // 立即渲染一次，确保可见
        this.renderer.render(this.scene, this.camera);
        console.log('首次渲染完成');
        console.log('Canvas实际尺寸:', this.canvas.width, 'x', this.canvas.height);
        console.log('Canvas显示尺寸:', this.canvas.clientWidth, 'x', this.canvas.clientHeight);
        
        // 强制再次渲染，确保显示
        setTimeout(() => {
            this.renderer.render(this.scene, this.camera);
            console.log('延迟渲染完成');
        }, 100);
    }
    
    loadBackgroundImage() {
        // 首先检查URL参数中是否指定了背景图片路径
        const urlParams = new URLSearchParams(window.location.search);
        const customBackground = urlParams.get('background');
        
        // 如果URL参数指定了背景图片，直接加载
        if (customBackground) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
                customBackground,
                (texture) => {
                    console.log('背景图片加载成功:', customBackground);
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    if (texture.encoding !== undefined) {
                        texture.encoding = THREE.sRGBEncoding;
                    }
                    this.scene.background = texture;
                },
                undefined,
                (error) => {
                    console.warn('背景图片加载失败，使用纯黑背景:', customBackground);
                }
            );
            return;
        }
        
        // 如果没有指定背景图片，使用纯黑背景（不尝试加载，避免404错误）
        // 如果需要添加背景图片，请将图片放到 assets 目录，命名为 background.jpg 或 background.png
        // 然后取消下面的注释并修改路径
        /*
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            'assets/background.jpg',
            (texture) => {
                console.log('背景图片加载成功');
                texture.mapping = THREE.EquirectangularReflectionMapping;
                if (texture.encoding !== undefined) {
                    texture.encoding = THREE.sRGBEncoding;
                }
                this.scene.background = texture;
            },
            undefined,
            (error) => {
                console.warn('背景图片加载失败，使用纯黑背景');
            }
        );
        */
    }
    
    createStarField() {
        // 创建纯白色圆形星星纹理
        const createStarTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            
            // 先填充黑色背景，确保没有其他颜色
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0, 0, 64, 64);
            
            // 创建径向渐变，中心亮，边缘透明，确保纯白色
            const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.3, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(32, 32, 32, 0, Math.PI * 2);
            ctx.fill();
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            // 确保纹理格式正确，避免颜色失真
            texture.format = THREE.RGBAFormat;
            // r128版本使用encoding而不是colorSpace
            if (texture.encoding !== undefined) {
                texture.encoding = THREE.sRGBEncoding;
            }
            return texture;
        };
        
        // 创建简洁的白色星星点
        const starCount = 2000; // 星星数量
        const starRange = 50; // 星星分布范围
        
        const starGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // 随机位置
            positions[i3] = (Math.random() - 0.5) * starRange;
            positions[i3 + 1] = (Math.random() - 0.5) * starRange;
            positions[i3 + 2] = (Math.random() - 0.5) * starRange;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // 纯白色星星材质，确保没有其他颜色
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff, // 纯白色
            size: 1, // 星星大小
            map: createStarTexture(), // 使用圆形纹理
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true,
            depthWrite: false,
            alphaTest: 0.1, // 优化透明渲染
            vertexColors: false // 禁用顶点颜色，确保使用材质颜色
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
        this.stars.push(stars);
        
        console.log('白色圆形星星创建完成，数量:', starCount);
    }

    createConstellations() {
        // 北斗七星数据
        const bigDipper = {
            name: '北斗七星',
            description: '中国古代天文学中的重要星宿，属于紫微垣，具有指示方向的作用。',
            stars: [
                { name: '天枢', position: [2, 1, 0], brightness: 1.2 },
                { name: '天璇', position: [1.8, 0.8, 0], brightness: 1.1 },
                { name: '天玑', position: [1.5, 0.5, 0], brightness: 1.0 },
                { name: '天权', position: [1.2, 0.2, 0], brightness: 0.9 },
                { name: '玉衡', position: [0.8, -0.1, 0], brightness: 1.1 },
                { name: '开阳', position: [0.5, -0.4, 0], brightness: 1.0 },
                { name: '摇光', position: [0.2, -0.7, 0], brightness: 1.0 }
            ]
        };

        // 猎户座数据
        const orion = {
            name: '猎户座',
            description: '西方天文学中的著名星座，代表希腊神话中的猎人俄里翁。',
            stars: [
                { name: '参宿四', position: [-2, 1.5, 0], brightness: 1.3 },
                { name: '参宿七', position: [-1.5, -1.5, 0], brightness: 1.2 },
                { name: '参宿一', position: [-2.2, -0.8, 0], brightness: 1.1 },
                { name: '参宿二', position: [-1.8, -0.5, 0], brightness: 1.0 },
                { name: '参宿三', position: [-1.4, -0.2, 0], brightness: 1.0 }
            ]
        };

        // 仙后座（W形状）
        const cassiopeia = {
            name: '仙后座',
            description: '北天星座，形状像字母W或M，代表希腊神话中的仙后卡西俄珀亚。',
            stars: [
                { name: '王良一', position: [-1, 3, -1], brightness: 1.2 },
                { name: '王良二', position: [-0.5, 2.8, -1], brightness: 1.1 },
                { name: '策', position: [0, 2.5, -1], brightness: 1.3 },
                { name: '阁道三', position: [0.5, 2.8, -1], brightness: 1.1 },
                { name: '阁道二', position: [1, 3, -1], brightness: 1.2 }
            ]
        };

        // 天鹅座（十字形）
        const cygnus = {
            name: '天鹅座',
            description: '北天星座，形状像展翅的天鹅，也被称为"北十字"。',
            stars: [
                { name: '天津四', position: [0, 2, 1], brightness: 1.4 },
                { name: '天津一', position: [-0.8, 1.5, 1], brightness: 1.1 },
                { name: '天津二', position: [0.8, 1.5, 1], brightness: 1.1 },
                { name: '天津九', position: [-0.4, 0.5, 1], brightness: 1.0 },
                { name: '天津八', position: [0.4, 0.5, 1], brightness: 1.0 },
                { name: '辇道增七', position: [0, -0.5, 1], brightness: 1.2 }
            ]
        };

        // 天鹰座（鹰形）
        const aquila = {
            name: '天鹰座',
            description: '赤道带星座，形状像展翅的雄鹰，其中最亮的是牛郎星（河鼓二）。',
            stars: [
                { name: '河鼓二', position: [2.5, -1, 0.5], brightness: 1.5 },
                { name: '河鼓一', position: [2, -1.5, 0.5], brightness: 1.1 },
                { name: '河鼓三', position: [3, -1.5, 0.5], brightness: 1.1 },
                { name: '天市左垣一', position: [2.2, -0.5, 0.5], brightness: 1.0 },
                { name: '天市左垣二', position: [2.8, -0.5, 0.5], brightness: 1.0 }
            ]
        };

        // 狮子座（狮子形状）
        const leo = {
            name: '狮子座',
            description: '黄道星座，形状像一头狮子，代表希腊神话中的涅墨亚狮子。',
            stars: [
                { name: '轩辕十四', position: [-2.5, -1.5, -0.5], brightness: 1.4 },
                { name: '轩辕十二', position: [-2, -2, -0.5], brightness: 1.2 },
                { name: '轩辕九', position: [-1.5, -1.8, -0.5], brightness: 1.1 },
                { name: '轩辕十一', position: [-3, -1.8, -0.5], brightness: 1.1 },
                { name: '五帝座一', position: [-2.2, -0.8, -0.5], brightness: 1.3 }
            ]
        };

        // 天蝎座（蝎子形状）
        const scorpius = {
            name: '天蝎座',
            description: '黄道星座，形状像一只蝎子，代表希腊神话中杀死猎户座的毒蝎。',
            stars: [
                { name: '心宿二', position: [1.5, -2.5, -1], brightness: 1.5 },
                { name: '心宿一', position: [1, -2.8, -1], brightness: 1.2 },
                { name: '心宿三', position: [2, -2.8, -1], brightness: 1.2 },
                { name: '房宿一', position: [1.2, -2, -1], brightness: 1.1 },
                { name: '房宿二', position: [1.8, -2, -1], brightness: 1.1 },
                { name: '尾宿一', position: [1.5, -3, -1], brightness: 1.0 }
            ]
        };

        // 小熊座（小北斗）
        const ursaMinor = {
            name: '小熊座',
            description: '北天星座，形状像小勺子，包含北极星（勾陈一），是导航的重要星座。',
            stars: [
                { name: '勾陈一', position: [0, 3.5, 0], brightness: 1.6 },
                { name: '勾陈二', position: [-0.3, 3.2, 0], brightness: 1.2 },
                { name: '勾陈三', position: [-0.6, 2.9, 0], brightness: 1.1 },
                { name: '勾陈四', position: [-0.4, 2.5, 0], brightness: 1.0 },
                { name: '勾陈五', position: [0.2, 2.8, 0], brightness: 1.1 },
                { name: '勾陈六', position: [0.5, 3.1, 0], brightness: 1.0 },
                { name: '勾陈七', position: [0.3, 3.4, 0], brightness: 1.0 }
            ]
        };

        this.createConstellation(bigDipper);
        this.createConstellation(orion);
        this.createConstellation(cassiopeia);
        this.createConstellation(cygnus);
        this.createConstellation(aquila);
        this.createConstellation(leo);
        this.createConstellation(scorpius);
        this.createConstellation(ursaMinor);
    }

    createConstellation(constellationData) {
        const group = new THREE.Group();
        group.userData = constellationData;
        
        // 创建星星
        constellationData.stars.forEach((starData, index) => {
            const starGeometry = new THREE.SphereGeometry(0.08 * starData.brightness, 16, 16); // 增大星座星星
            // 使用 MeshStandardMaterial 支持自发光
            const starMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 1, // 增加亮度
                emissive: 0xffffff, // 添加自发光
                emissiveIntensity: 1.0 // 增强发光强度
            });
            
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.set(...starData.position);
            star.userData = { 
                name: starData.name, 
                constellation: constellationData.name,
                description: constellationData.description
            };
            
            // 添加发光效果
            const glowGeometry = new THREE.SphereGeometry(0.12 * starData.brightness, 16, 16);
            const glowMaterial = new THREE.MeshStandardMaterial({
                color: 0x6366f1,
                transparent: true,
                opacity: 0.6,
                emissive: 0x6366f1,
                emissiveIntensity: 0.5
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            star.add(glow);
            
            group.add(star);
        });
        
        // 创建连线
        if (constellationData.stars.length > 1) {
            const lineGeometry = new THREE.BufferGeometry();
            const positions = [];
            
            for (let i = 0; i < constellationData.stars.length - 1; i++) {
                const star1 = constellationData.stars[i];
                const star2 = constellationData.stars[i + 1];
                
                positions.push(...star1.position);
                positions.push(...star2.position);
            }
            
            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x6366f1,
                transparent: true,
                opacity: 0.7
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            group.add(line);
        }
        
        this.scene.add(group);
        this.constellations.push(group);
    }

    setupEventListeners() {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (event) => {
            isDragging = true;
            this.isInteracting = true;
        });
        
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            if (isDragging) {
                const deltaMove = {
                    x: event.offsetX - previousMousePosition.x,
                    y: event.offsetY - previousMousePosition.y
                };
                
                // 平移场景（而不是旋转），与手势控制保持一致
                this.scene.position.x += deltaMove.x * 0.05;
                this.scene.position.y -= deltaMove.y * 0.05;
                
                // 限制移动范围
                this.scene.position.x = Math.max(-20, Math.min(20, this.scene.position.x));
                this.scene.position.y = Math.max(-20, Math.min(20, this.scene.position.y));
            }
            
            previousMousePosition = {
                x: event.offsetX,
                y: event.offsetY
            };
            
            // 检测星星悬停
            this.checkStarHover();
        });
        
        this.canvas.addEventListener('mouseup', () => {
            isDragging = false;
            this.isInteracting = false;
        });
        
        this.canvas.addEventListener('click', (event) => {
            this.checkStarClick();
        });
        
        // 滚轮缩放
        this.canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            const delta = event.deltaY > 0 ? 1.1 : 0.9;
            this.camera.position.z *= delta;
            this.camera.position.z = Math.max(2, Math.min(10, this.camera.position.z));
        });
        
        // 窗口大小调整
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }

    checkStarHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const intersects = [];
        this.constellations.forEach(constellation => {
            constellation.children.forEach(child => {
                if (child.geometry && child.geometry.type === 'SphereGeometry') {
                    intersects.push(...this.raycaster.intersectObject(child));
                }
            });
        });
        
        if (intersects.length > 0) {
            this.canvas.style.cursor = 'pointer';
            const star = intersects[0].object;
            if (star.userData.name) {
                this.showConstellationInfo(star.userData);
            }
        } else {
            this.canvas.style.cursor = 'grab';
            this.hideConstellationInfo();
        }
    }

    checkStarClick() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const intersects = [];
        this.constellations.forEach(constellation => {
            constellation.children.forEach(child => {
                if (child.geometry && child.geometry.type === 'SphereGeometry') {
                    intersects.push(...this.raycaster.intersectObject(child));
                }
            });
        });
        
        if (intersects.length > 0) {
            const star = intersects[0].object;
            this.onStarClick(star.userData);
        }
    }

    showConstellationInfo(starData) {
        const infoElement = document.getElementById('constellation-info');
        const nameElement = document.getElementById('constellation-name');
        const descElement = document.getElementById('constellation-desc');
        
        if (infoElement && nameElement && descElement) {
            nameElement.textContent = `${starData.name} (${starData.constellation})`;
            descElement.textContent = starData.description;
            infoElement.classList.add('show');
        }
    }

    hideConstellationInfo() {
        const infoElement = document.getElementById('constellation-info');
        if (infoElement) {
            infoElement.classList.remove('show');
        }
    }

    onStarClick(starData) {
        // 播放点击音效
        this.playClickSound();
        
        // 显示详细信息
        alert(`${starData.name}\n\n所属星座：${starData.constellation}\n\n${starData.description}`);
        
        // 触发占卜启动事件
        document.dispatchEvent(new CustomEvent('starClicked', { detail: starData }));
    }

    playClickSound() {
        const clickSound = document.getElementById('click-sound');
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {
                // 忽略音频播放错误
            });
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 完全停止自动旋转，保持静态（等待手势控制）
        // 不进行任何自动旋转
        
        // 简单的星星闪烁效果
        if (this.stars && this.stars.length > 0) {
            this.stars.forEach((starGroup) => {
                if (starGroup && starGroup.material) {
                    // 轻微的闪烁效果
                    starGroup.material.opacity = 0.7 + Math.sin(Date.now() * 0.001) * 0.2;
                }
            });
        }
        
        // 星座发光效果
        if (this.constellations && this.constellations.length > 0) {
            this.constellations.forEach(constellation => {
                if (constellation && constellation.children) {
                    constellation.children.forEach(child => {
                        if (child && child.children && child.children.length > 0) {
                            const glow = child.children[0];
                            if (glow && glow.material) {
                                glow.material.opacity = 0.5 + Math.sin(Date.now() * 0.0015 + child.position.x) * 0.25;
                            }
                        }
                    });
                }
            });
        }
        
        // 确保渲染（无论是否有交互都要渲染）
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        } else {
            console.warn('渲染器、场景或相机未初始化');
        }
    }

    onWindowResize() {
        const rect = this.canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            this.camera.aspect = rect.width / rect.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(rect.width, rect.height);
        }
    }

    resetView() {
        // 重置相机位置、场景旋转和位置
        gsap.to(this.camera.position, {
            duration: 1,
            z: 5,
            ease: "power2.out"
        });
        
        gsap.to(this.scene.rotation, {
            duration: 1,
            x: 0,
            y: 0,
            z: 0,
            ease: "power2.out"
        });
        
        // 重置场景位置（手势控制后的平移）
        gsap.to(this.scene.position, {
            duration: 1,
            x: 0,
            y: 0,
            z: 0,
            ease: "power2.out"
        });
    }

    activateDivination() {
        // 占卜激活动画
        const activationEffect = () => {
            this.constellations.forEach((constellation, index) => {
                setTimeout(() => {
                    constellation.children.forEach(child => {
                        if (child.material && child.material.color) {
                            gsap.to(child.material.color, {
                                duration: 0.5,
                                r: 1,
                                g: 0.4,
                                b: 0.1,
                                yoyo: true,
                                repeat: 3
                            });
                        }
                    });
                }, index * 200);
            });
        };
        
        activationEffect();
        
        // 触发占卜启动事件
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('divinationActivated'));
        }, 2000);
    }
}

// 背景星空粒子系统
class BackgroundStarfield {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.stars = [];
        this.shootingStars = [];
        this.init();
    }

    init() {
        this.createStars();
        this.createShootingStars();
        this.animate();
    }

    createStars() {
        const starCount = 150;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'bg-star';
            star.style.cssText = `
                position: absolute;
                background: white;
                border-radius: 50%;
                animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite alternate;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            // 随机大小
            const size = Math.random() * 3 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            
            // 随机位置
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            // 随机透明度
            star.style.opacity = Math.random() * 0.8 + 0.2;
            
            this.container.appendChild(star);
            this.stars.push(star);
        }
    }

    createShootingStars() {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% 概率
                this.createShootingStar();
            }
        }, 3000);
    }

    createShootingStar() {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        shootingStar.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: linear-gradient(45deg, #fff, transparent);
            border-radius: 50%;
            animation: shoot 2s linear forwards;
        `;
        
        // 随机起始位置
        shootingStar.style.left = Math.random() * 50 + '%';
        shootingStar.style.top = Math.random() * 50 + '%';
        
        this.container.appendChild(shootingStar);
        
        // 动画结束后移除
        setTimeout(() => {
            if (shootingStar.parentNode) {
                shootingStar.parentNode.removeChild(shootingStar);
            }
        }, 2000);
    }

    animate() {
        // 鼠标视差效果
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            this.stars.forEach((star, index) => {
                const speed = (index % 3 + 1) * 0.3;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                
                star.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes shoot {
        0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateX(300px) translateY(300px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
