// Ultimate Life Simulator Pro - Complete Game System
        class UltimateLifeSimulator {
            constructor() {
                this.gameState = {
                    // Core stats
                    age: 22,
                    month: 8,
                    money: 1250,
                    health: 75,
                    happiness: 60,
                    reputation: 42,
                    skills: 30,
                    profession: 'Student',
                    relationship: 'Single',
                    
                    // Advanced systems
                    personalityTraits: ['Ambitious', 'Creative'],
                    weather: 'sunny',
                    prestigeLevel: 0,
                    
                    // Skills system
                    subjects: {
                        math: { level: 3, progress: 65 },
                        science: { level: 2, progress: 40 },
                        language: { level: 4, progress: 80 },
                        art: { level: 1, progress: 25 },
                        tech: { level: 2, progress: 55 },
                        business: { level: 2, progress: 35 }
                    },
                    
                    // Goals & Achievements
                    achievements: ['first-job'],
                    lifeGoals: {
                        save100k: { progress: 1.25, target: 100000 },
                        buyHouse: { progress: 0.625, target: 200000 },
                        getMarried: { progress: 0, target: 100 }
                    },
                    
                    // Business & Finance
                    businesses: [],
                    properties: [],
                    monthlyIncome: 0,
                    monthlyExpenses: 800,
                    
                    // Statistics
                    statistics: {
                        totalMoneyEarned: 45230,
                        monthsLived: 264,
                        skillsLearned: 6,
                        businessesOwned: 0,
                        achievementsUnlocked: 5,
                        happinessAverage: 68
                    },
                    
                    // Rivals
                    rivals: [
                        { name: 'Alex', money: 15420, age: 23 }
                    ]
                };
                
                this.achievements = {
                    'first-job': { name: 'First Job', icon: '💼', points: 100 },
                    'millionaire': { name: 'Millionaire', icon: '💰', points: 1000 },
                    'scholar': { name: 'Scholar', icon: '🎓', points: 500 },
                    'homeowner': { name: 'Homeowner', icon: '🏠', points: 400 },
                    'entrepreneur': { name: 'Entrepreneur', icon: '🚀', points: 600 },
                    'married': { name: 'Married', icon: '💍', points: 350 }
                };
                
                this.professions = {
                    'developer': { salary: 75000, requirements: { tech: 3 } },
                    'doctor': { salary: 120000, requirements: { science: 5 } },
                    'teacher': { salary: 45000, requirements: { language: 3 } },
                    'artist': { salary: 35000, requirements: { art: 4 } },
                    'engineer': { salary: 85000, requirements: { math: 4 } },
                    'entrepreneur': { salary: 0, requirements: { business: 3 } }
                };
                
                this.init();
            }

            init() {
                this.bindEvents();
                this.updateDisplay();
                this.startGameLoops();
                this.loadGame();
            }

            bindEvents() {
                // Main action buttons
                document.getElementById('advance-month').addEventListener('click', () => this.advanceMonth());
                document.getElementById('advance-year').addEventListener('click', () => this.advanceYear());
                document.getElementById('open-character').addEventListener('click', () => this.openCharacterTab());

                // Navigation buttons
                document.getElementById('study-btn').addEventListener('click', () => this.showModal('studyModal'));
                document.getElementById('business-btn').addEventListener('click', () => this.showModal('businessModal'));
                document.getElementById('career-btn').addEventListener('click', () => this.showModal('careerModal'));
                document.getElementById('menu-btn').addEventListener('click', () => this.showModal('menuModal'));

                // Study subjects
                document.querySelectorAll('[data-subject]').forEach(card => {
                    const btn = card.querySelector('.card-btn');
                    btn.addEventListener('click', () => {
                        const subject = card.getAttribute('data-subject');
                        this.studySubject(subject);
                    });
                });

                // Career choices
                document.querySelectorAll('[data-profession]').forEach(card => {
                    const btn = card.querySelector('.card-btn');
                    btn.addEventListener('click', () => {
                        const profession = card.getAttribute('data-profession');
                        this.chooseProfession(profession);
                    });
                });

                // Life choices
                document.querySelectorAll('[data-life]').forEach(card => {
                    const btn = card.querySelector('.card-btn');
                    btn.addEventListener('click', () => {
                        const choice = card.getAttribute('data-life');
                        this.makeLifeChoice(choice);
                    });
                });

                // Menu actions
                document.getElementById('achievements-btn').addEventListener('click', () => {
                    this.hideModal('menuModal');
                    this.showModal('achievementsModal');
                });

                document.getElementById('statistics-btn').addEventListener('click', () => {
                    this.hideModal('menuModal');
                    this.showModal('statisticsModal');
                });

                document.getElementById('leaderboard-btn').addEventListener('click', () => {
                    this.hideModal('menuModal');
                    this.showModal('leaderboardModal');
                });

                document.getElementById('life-choices-btn').addEventListener('click', () => {
                    this.hideModal('menuModal');
                    this.showModal('lifeModal');
                });

                document.getElementById('restart-btn').addEventListener('click', () => {
                    this.restartLife();
                });

                // Close buttons
                document.querySelectorAll('.close-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const modal = e.target.closest('.modal');
                        this.hideModal(modal.id);
                    });
                });

                // Close modals when clicking outside
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.addEventListener('click', (e) => {
                        if (e.target.classList.contains('modal')) {
                            this.hideModal(modal.id);
                        }
                    });
                });
            }

            startGameLoops() {
                // Auto-save every 30 seconds
                setInterval(() => {
                    this.autoSave();
                }, 30000);

                // Update weather every 2 minutes
                setInterval(() => {
                    this.updateWeather();
                }, 120000);

                // Update rivals every minute
                setInterval(() => {
                    this.updateRivals();
                }, 60000);
            }

            // Core Game Mechanics
            advanceMonth() {
                this.gameState.month++;
                if (this.gameState.month > 12) {
                    this.gameState.month = 1;
                    this.gameState.age++;
                }

                // Calculate monthly income
                let monthlyIncome = this.getProfessionIncome() / 12;
                
                // Add business income
                this.gameState.businesses.forEach(business => {
                    monthlyIncome += business.income;
                });

                // Add property income
                this.gameState.properties.forEach(property => {
                    monthlyIncome += property.income;
                });

                // Monthly expenses
                let monthlyExpenses = this.gameState.monthlyExpenses;

                // Apply income and expenses
                this.gameState.money += monthlyIncome - monthlyExpenses;

                // Age-related changes
                if (this.gameState.age > 30) {
                    this.gameState.health = Math.max(0, this.gameState.health - 1);
                }

                // Random events
                this.randomMonthlyEvent();

                // Update statistics
                this.gameState.statistics.monthsLived++;
                this.gameState.statistics.totalMoneyEarned += Math.max(0, monthlyIncome);

                // Check achievements
                this.checkAchievements();

                // Update life goals
                this.updateLifeGoals();

                this.updateDisplay();
                this.showNotification(`Month ${this.gameState.month}! Net: $${Math.floor(monthlyIncome - monthlyExpenses)} 📅`, 'success');
            }

            advanceYear() {
                for (let i = 0; i < 12; i++) {
                    this.advanceMonth();
                }
                this.showNotification(`🎉 Happy New Year! You're now ${this.gameState.age} years old!`, 'success');
            }

            openCharacterTab() {
                // Cycle through different character representations
                const characters = ['🧑‍💼', '👨‍💻', '👩‍⚕️', '👨‍🎨', '👩‍🏫', '🧑‍🚀'];
                const current = document.getElementById('player-character').textContent;
                const currentIndex = characters.indexOf(current);
                const nextIndex = (currentIndex + 1) % characters.length;
                
                document.getElementById('player-character').textContent = characters[nextIndex];
                this.showNotification('Character updated! 🎭', 'success');
            }

            // Study System
            studySubject(subject) {
                const subjectData = this.gameState.subjects[subject];
                const progressGain = Math.floor(Math.random() * 20) + 10;
                
                subjectData.progress += progressGain;
                
                if (subjectData.progress >= 100) {
                    subjectData.level++;
                    subjectData.progress = 0;
                    this.gameState.skills = Math.min(100, this.gameState.skills + 10);
                    this.gameState.statistics.skillsLearned++;
                    
                    if (subjectData.level >= 10) {
                        this.unlockAchievement('scholar');
                    }
                    
                    this.showNotification(`Level Up! ${subject.toUpperCase()} Level ${subjectData.level}! 🎓`, 'success');
                } else {
                    this.gameState.skills = Math.min(100, this.gameState.skills + 2);
                    this.showNotification(`Studied ${subject}! +${progressGain}% progress 📚`, 'success');
                }

                this.gameState.happiness = Math.min(100, this.gameState.happiness + 5);
                this.hideModal('studyModal');
                this.updateDisplay();
                this.updateSubjectDisplay(subject);
            }

            updateSubjectDisplay(subject) {
                const card = document.querySelector(`[data-subject="${subject}"]`);
                if (card) {
                    const progressFill = card.querySelector('.progress-fill');
                    const statusSpan = card.querySelector('.status');
                    
                    progressFill.style.width = this.gameState.subjects[subject].progress + '%';
                    statusSpan.textContent = `Level ${this.gameState.subjects[subject].level}`;
                }
            }

            // Career System
            chooseProfession(profession) {
                const professionData = this.professions[profession];
                
                // Check requirements
                let canChoose = true;
                let missingRequirements = [];
                
                for (const [skill, requiredLevel] of Object.entries(professionData.requirements)) {
                    if (this.gameState.subjects[skill].level < requiredLevel) {
                        canChoose = false;
                        missingRequirements.push(`${skill} Level ${requiredLevel}`);
                    }
                }
                
                if (canChoose) {
                    this.gameState.profession = profession.charAt(0).toUpperCase() + profession.slice(1);
                    this.gameState.reputation = Math.min(100, this.gameState.reputation + 15);
                    this.gameState.happiness = Math.min(100, this.gameState.happiness + 20);
                    
                    this.hideModal('careerModal');
                    this.updateDisplay();
                    this.showNotification(`Congratulations! You're now a ${this.gameState.profession}! 🎉`, 'success');
                    
                    if (!this.gameState.achievements.includes('first-job')) {
                        this.unlockAchievement('first-job');
                    }
                } else {
                    this.showNotification(`Need: ${missingRequirements.join(', ')} 📚`, 'warning');
                }
            }

            getProfessionIncome() {
                if (this.gameState.profession === 'Student') return 0;
                
                const professionKey = this.gameState.profession.toLowerCase();
                const professionData = this.professions[professionKey];
                
                if (professionData) {
                    let salary = professionData.salary;
                    
                    // Entrepreneur special case
                    if (professionKey === 'entrepreneur') {
                        salary = this.gameState.businesses.reduce((total, business) => total + business.income * 12, 0);
                    }
                    
                    return salary;
                }
                
                return 30000; // Default salary
            }

            // Business System
            startBusiness(businessType) {
                const businesses = {
                    'store': { name: 'Corner Store', cost: 25000, income: 2500 },
                    'coffee': { name: 'Coffee Shop', cost: 40000, income: 4200 },
                    'tech': { name: 'Tech Startup', cost: 75000, income: 8000 },
                    'restaurant': { name: 'Restaurant', cost: 60000, income: 6500 }
                };
                
                const business = businesses[businessType];
                
                if (this.gameState.money >= business.cost) {
                    this.gameState.money -= business.cost;
                    this.gameState.businesses.push({
                        name: business.name,
                        income: business.income,
                        type: businessType
                    });
                    
                    this.gameState.statistics.businessesOwned++;
                    this.unlockAchievement('entrepreneur');
                    
                    this.hideModal('businessModal');
                    this.updateDisplay();
                    this.showNotification(`${business.name} launched! Monthly income: $${business.income} 🚀`, 'success');
                } else {
                    this.showNotification(`Need $${business.cost} to start this business! 💸`, 'error');
                }
            }

            buyProperty(propertyType) {
                const properties = {
                    'apartment': { name: 'Apartment Building', cost: 200000, income: 3000 },
                    'office': { name: 'Office Complex', cost: 350000, income: 5000 }
                };
                
                const property = properties[propertyType];
                
                if (this.gameState.money >= property.cost) {
                    this.gameState.money -= property.cost;
                    this.gameState.properties.push({
                        name: property.name,
                        income: property.income,
                        type: propertyType
                    });
                    
                    this.unlockAchievement('homeowner');
                    
                    this.hideModal('businessModal');
                    this.updateDisplay();
                    this.showNotification(`${property.name} purchased! Monthly rent: $${property.income} 🏢`, 'success');
                } else {
                    this.showNotification(`Need $${property.cost} for this property! 💸`, 'error');
                }
            }

            // Life Choices System
            makeLifeChoice(choice) {
                const choices = {
                    'dating': {
                        cost: 2400,
                        effect: () => {
                            this.gameState.happiness += 20;
                            if (Math.random() > 0.5) {
                                this.gameState.relationship = 'Dating';
                            }
                        }
                    },
                    'house': {
                        cost: 200000,
                        effect: () => {
                            this.gameState.happiness += 25;
                            this.gameState.reputation += 10;
                            this.unlockAchievement('homeowner');
                        }
                    },
                    'travel': {
                        cost: 15000,
                        effect: () => {
                            this.gameState.happiness += 20;
                            this.gameState.health += 10;
                        }
                    },
                    'luxury': {
                        cost: 50000,
                        effect: () => {
                            this.gameState.happiness += 15;
                            this.gameState.reputation += 20;
                        }
                    },
                    'family': {
                        cost: 25000,
                        effect: () => {
                            if (this.gameState.relationship !== 'Single') {
                                this.gameState.happiness += 30;
                                this.gameState.relationship = 'Married';
                                this.unlockAchievement('married');
                                return true;
                            } else {
                                this.showNotification('You need to find love first! 💕', 'warning');
                                return false;
                            }
                        }
                    },
                    'health': {
                        cost: 5000,
                        effect: () => {
                            this.gameState.health = Math.min(100, this.gameState.health + 25);
                            this.gameState.monthlyExpenses += 417; // $5000/year
                        }
                    }
                };

                const choiceData = choices[choice];
                
                if (this.gameState.money >= choiceData.cost) {
                    this.gameState.money -= choiceData.cost;
                    const success = choiceData.effect();
                    
                    if (success !== false) {
                        this.hideModal('lifeModal');
                        this.updateDisplay();
                        this.showNotification(`${choice.charAt(0).toUpperCase() + choice.slice(1)} choice made! 🎉`, 'success');
                    }
                } else {
                    this.showNotification(`Need $${choiceData.cost} for this choice! 💸`, 'error');
                }
            }

            // Achievement System
            unlockAchievement(achievementId) {
                if (!this.gameState.achievements.includes(achievementId)) {
                    this.gameState.achievements.push(achievementId);
                    this.gameState.statistics.achievementsUnlocked++;
                    
                    const achievement = this.achievements[achievementId];
                    this.showAchievement(achievement.icon, achievement.name);
                    this.gameState.reputation = Math.min(100, this.gameState.reputation + 10);
                }
            }

            showAchievement(icon, name) {
                const popup = document.getElementById('achievement-popup');
                document.getElementById('achievement-icon').textContent = icon;
                document.getElementById('achievement-text').textContent = name;
                
                popup.classList.add('show');
                
                setTimeout(() => {
                    popup.classList.remove('show');
                }, 3000);
            }

            checkAchievements() {
                // Check millionaire achievement
                if (this.gameState.money >= 1000000) {
                    this.unlockAchievement('millionaire');
                }
                
                // Check scholar achievement
                Object.values(this.gameState.subjects).forEach(subject => {
                    if (subject.level >= 10) {
                        this.unlockAchievement('scholar');
                    }
                });
            }

            updateLifeGoals() {
                // Update save 100k goal
                this.gameState.lifeGoals.save100k.progress = (this.gameState.money / this.gameState.lifeGoals.save100k.target) * 100;
                
                // Update buy house goal
                this.gameState.lifeGoals.buyHouse.progress = (this.gameState.money / this.gameState.lifeGoals.buyHouse.target) * 100;
                
                // Update marriage goal
                const relationshipProgress = {
                    'Single': 0,
                    'Dating': 50,
                    'Married': 100
                };
                this.gameState.lifeGoals.getMarried.progress = relationshipProgress[this.gameState.relationship] || 0;
                
                // Update goal display
                const goals = document.querySelectorAll('.goal-fill');
                goals[0].style.width = Math.min(100, this.gameState.lifeGoals.save100k.progress) + '%';
                goals[1].style.width = Math.min(100, this.gameState.lifeGoals.buyHouse.progress) + '%';
                goals[2].style.width = Math.min(100, this.gameState.lifeGoals.getMarried.progress) + '%';
            }

            // Random Events
            randomMonthlyEvent() {
                if (Math.random() < 0.3) { // 30% chance
                    const events = [
                        {
                            message: "Found money on the street! 💰",
                            effect: () => { this.gameState.money += Math.floor(Math.random() * 500) + 100; }
                        },
                        {
                            message: "Got a bonus at work! 🎉",
                            effect: () => { this.gameState.money += Math.floor(Math.random() * 2000) + 500; }
                        },
                        {
                            message: "Made a new friend! 👥",
                            effect: () => { this.gameState.happiness += 10; this.gameState.reputation += 5; }
                        },
                        {
                            message: "Caught a cold... 🤧",
                            effect: () => { this.gameState.health -= 10; this.gameState.happiness -= 5; }
                        },
                        {
                            message: "Learned something new! 📚",
                            effect: () => { this.gameState.skills += 5; this.gameState.happiness += 5; }
                        }
                    ];
                    
                    const event = events[Math.floor(Math.random() * events.length)];
                    event.effect();
                    this.showNotification(event.message, 'success');
                }
            }

            // Weather System
            updateWeather() {
                const weathers = [
                    { icon: '☀️', name: 'Sunny', happiness: 5 },
                    { icon: '🌧️', name: 'Rainy', happiness: -2 },
                    { icon: '☁️', name: 'Cloudy', happiness: 0 },
                    { icon: '❄️', name: 'Snowy', happiness: 3 }
                ];
                
                const weather = weathers[Math.floor(Math.random() * weathers.length)];
                this.gameState.weather = weather.name.toLowerCase();
                
                document.getElementById('weather-icon').textContent = weather.icon;
                document.getElementById('weather-text').textContent = weather.name;
                
                this.gameState.happiness = Math.max(0, Math.min(100, this.gameState.happiness + weather.happiness));
                this.updateDisplay();
            }

            // Rival System
            updateRivals() {
                this.gameState.rivals.forEach(rival => {
                    rival.money += Math.floor(Math.random() * 2000) + 500;
                    
                    if (Math.random() > 0.95) {
                        rival.age++;
                    }
                });
                
                // Update rival display
                const rivalDisplay = document.getElementById('rival-display');
                if (this.gameState.rivals.length > 0) {
                    const topRival = this.gameState.rivals[0];
                    rivalDisplay.textContent = `🏆 Rival: ${topRival.name} ($${topRival.money.toLocaleString()})`;
                }
            }

            // Background System
            updateBackground() {
                const bgOverlay = document.getElementById('background-overlay');
                
                if (this.gameState.money >= 1000000) {
                    bgOverlay.className = 'background-overlay bg-millionaire';
                } else if (this.gameState.money >= 100000) {
                    bgOverlay.className = 'background-overlay bg-rich';
                } else if (this.gameState.money >= 25000) {
                    bgOverlay.className = 'background-overlay bg-middle';
                } else {
                    bgOverlay.className = 'background-overlay bg-poor';
                }
            }

            // UI Management
            showModal(modalId) {
                document.getElementById(modalId).classList.remove('hidden');
            }

            hideModal(modalId) {
                document.getElementById(modalId).classList.add('hidden');
            }

            showNotification(message, type = 'success') {
                const notification = document.getElementById('notification');
                notification.textContent = message;
                notification.className = `notification ${type} show`;
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }

            // Display Updates
            updateDisplay() {
                // Update HUD bars
                document.getElementById('health-fill').style.width = this.gameState.health + '%';
                document.getElementById('happiness-fill').style.width = this.gameState.happiness + '%';
                document.getElementById('reputation-fill').style.width = this.gameState.reputation + '%';
                document.getElementById('skills-fill').style.width = this.gameState.skills + '%';

                // Update stats
                document.getElementById('money').textContent = '$' + this.gameState.money.toLocaleString();
                document.getElementById('reputation-text').textContent = '⭐ ' + this.gameState.reputation;
                document.getElementById('age').textContent = 'Age: ' + this.gameState.age;
                document.getElementById('month').textContent = 'Month: ' + this.gameState.month;
                document.getElementById('profession').textContent = this.gameState.profession;
                document.getElementById('relationship').textContent = this.gameState.relationship;

                // Update prestige indicator
                document.getElementById('prestige-indicator').textContent = `⭐ Prestige ${this.gameState.prestigeLevel}`;

                // Update statistics in modal
                document.getElementById('total-money-earned').textContent = '$' + this.gameState.statistics.totalMoneyEarned.toLocaleString();
                document.getElementById('months-lived').textContent = this.gameState.statistics.monthsLived;
                document.getElementById('skills-learned').textContent = this.gameState.statistics.skillsLearned;
                document.getElementById('businesses-owned').textContent = this.gameState.statistics.businessesOwned;
                document.getElementById('achievements-unlocked').textContent = this.gameState.statistics.achievementsUnlocked;
                document.getElementById('happiness-average').textContent = this.gameState.statistics.happinessAverage + '%';

                // Update achievement score
                const achievementScore = this.gameState.achievements.reduce((total, achievementId) => {
                    return total + (this.achievements[achievementId]?.points || 0);
                }, 0);
                document.getElementById('achievement-score').textContent = achievementScore;
                document.getElementById('unlocked-count').textContent = this.gameState.achievements.length;

                // Update background
                this.updateBackground();

                // Update life goals
                this.updateLifeGoals();
            }

            // Save/Load System
            autoSave() {
                try {
                    localStorage.setItem('ultimateLifeSimulator', JSON.stringify(this.gameState));
                } catch (error) {
                    console.error('Auto-save failed:', error);
                }
            }

            loadGame() {
                try {
                    const saved = localStorage.getItem('ultimateLifeSimulator');
                    if (saved) {
                        const savedState = JSON.parse(saved);
                        this.gameState = { ...this.gameState, ...savedState };
                        this.updateDisplay();
                        this.showNotification('Game loaded successfully! 💾', 'success');
                    }
                } catch (error) {
                    console.error('Load failed:', error);
                }
            }

            restartLife() {
                if (confirm('Are you sure you want to start a new life? This will reset all progress!')) {
                    localStorage.removeItem('ultimateLifeSimulator');
                    location.reload();
                }
            }
        }

        // Initialize the game
        const game = new UltimateLifeSimulator();

        // Initialize Element SDK
        const defaultConfig = {
            background_color: "#0f0f23",
            primary_color: "#e94560",
            secondary_color: "#4ecdc4",
            text_color: "#ffffff",
            accent_color: "#feca57",
            font_family: "Inter",
            font_size: 16,
            game_title: "Ultimate Life Simulator Pro",
            player_name: "Player",
            difficulty_mode: "Normal"
        };

        async function onConfigChange(config) {
            // Update colors
            const root = document.documentElement;
            root.style.setProperty('--bg-color', config.background_color || defaultConfig.background_color);
            root.style.setProperty('--primary-color', config.primary_color || defaultConfig.primary_color);
            root.style.setProperty('--secondary-color', config.secondary_color || defaultConfig.secondary_color);
            root.style.setProperty('--text-color', config.text_color || defaultConfig.text_color);
            root.style.setProperty('--accent-color', config.accent_color || defaultConfig.accent_color);

            // Update font
            const customFont = config.font_family || defaultConfig.font_family;
            document.body.style.fontFamily = `${customFont}, Arial, sans-serif`;

            // Update font size
            const baseSize = config.font_size || defaultConfig.font_size;
            document.body.style.fontSize = `${baseSize}px`;

            // Update text content
            const titleElements = document.querySelectorAll('h2');
            titleElements.forEach(el => {
                if (el.textContent.includes('Ultimate Life Simulator')) {
                    el.textContent = config.game_title || defaultConfig.game_title;
                }
            });
        }

        function mapToCapabilities(config) {
            return {
                recolorables: [
                    {
                        get: () => config.background_color || defaultConfig.background_color,
                        set: (value) => {
                            config.background_color = value;
                            if (window.elementSdk) window.elementSdk.setConfig({ background_color: value });
                        }
                    },
                    {
                        get: () => config.primary_color || defaultConfig.primary_color,
                        set: (value) => {
                            config.primary_color = value;
                            if (window.elementSdk) window.elementSdk.setConfig({ primary_color: value });
                        }
                    },
                    {
                        get: () => config.secondary_color || defaultConfig.secondary_color,
                        set: (value) => {
                            config.secondary_color = value;
                            if (window.elementSdk) window.elementSdk.setConfig({ secondary_color: value });
                        }
                    },
                    {
                        get: () => config.text_color || defaultConfig.text_color,
                        set: (value) => {
                            config.text_color = value;
                            if (window.elementSdk) window.elementSdk.setConfig({ text_color: value });
                        }
                    },
                    {
                        get: () => config.accent_color || defaultConfig.accent_color,
                        set: (value) => {
                            config.accent_color = value;
                            if (window.elementSdk) window.elementSdk.setConfig({ accent_color: value });
                        }
                    }
                ],
                borderables: [],
                fontEditable: {
                    get: () => config.font_family || defaultConfig.font_family,
                    set: (value) => {
                        config.font_family = value;
                        if (window.elementSdk) window.elementSdk.setConfig({ font_family: value });
                    }
                },
                fontSizeable: {
                    get: () => config.font_size || defaultConfig.font_size,
                    set: (value) => {
                        config.font_size = value;
                        if (window.elementSdk) window.elementSdk.setConfig({ font_size: value });
                    }
                }
            };
        }

        function mapToEditPanelValues(config) {
            return new Map([
                ["game_title", config.game_title || defaultConfig.game_title],
                ["player_name", config.player_name || defaultConfig.player_name],
                ["difficulty_mode", config.difficulty_mode || defaultConfig.difficulty_mode]
            ]);
        }

        // Initialize Element SDK
        if (window.elementSdk) {
            window.elementSdk.init({
                defaultConfig,
                onConfigChange,
                mapToCapabilities,
                mapToEditPanelValues
            });
        }
