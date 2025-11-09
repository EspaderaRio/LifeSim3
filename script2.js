// Ultimate Life Simulator Pro - Expanded v2
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

            // Investments
            investments: {
                savings: 0,
                stocks: 0,
                crypto: 0
            },

            // Education
            education: {
                enrolled: null,
                monthsRemaining: 0
            },

            // Housing & lifestyle
            housing: null, // "apartment", "villa", "mansion"

            // Specialization
            specialization: null,

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
            ],

            // History log
            history: []
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

        // Housing tiers
        this.housingTiers = {
            'apartment': { cost: 100000, happiness: 5, prestige: 1, monthlyMaintenance: 200 },
            'villa': { cost: 500000, happiness: 15, prestige: 3, monthlyMaintenance: 750 },
            'mansion': { cost: 1500000, happiness: 30, prestige: 5, monthlyMaintenance: 2500 }
        };

        // Education programs
        this.educationPrograms = {
            'Bachelors': { cost: 40000, months: 24, unlocks: 'Engineer' },
            'Masters': { cost: 80000, months: 36, unlocks: 'Doctor' },
            'PhD': { cost: 120000, months: 48, unlocks: 'Scientist' }
        };

        this.init();
    }

    init() {
        this.initializeUI();
        this.bindEvents();
        this.updateDisplay();
        this.startGameLoops();
        this.loadGame(1);
    }

    bindEvents() {
        // existing binds (kept as-is)
        const safeGet = (id) => document.getElementById(id) || { addEventListener: () => {} };
        safeGet('advance-month').addEventListener('click', () => this.advanceMonth());
        safeGet('advance-year').addEventListener('click', () => this.advanceYear());
        safeGet('open-character').addEventListener('click', () => this.openCharacterTab());

        safeGet('study-btn').addEventListener('click', () => this.showModal('studyModal'));
        safeGet('business-btn').addEventListener('click', () => this.showModal('businessModal'));
        safeGet('career-btn').addEventListener('click', () => this.showModal('careerModal'));
        safeGet('menu-btn').addEventListener('click', () => this.showModal('menuModal'));

        document.querySelectorAll('[data-subject]').forEach(card => {
            const btn = card.querySelector('.card-btn');
            if (btn) btn.addEventListener('click', () => {
                const subject = card.getAttribute('data-subject');
                this.studySubject(subject);
            });
        });

        document.querySelectorAll('[data-profession]').forEach(card => {
            const btn = card.querySelector('.card-btn');
            if (btn) btn.addEventListener('click', () => {
                const profession = card.getAttribute('data-profession');
                this.chooseProfession(profession);
            });
        });

        document.querySelectorAll('[data-life]').forEach(card => {
            const btn = card.querySelector('.card-btn');
            if (btn) btn.addEventListener('click', () => {
                const choice = card.getAttribute('data-life');
                this.makeLifeChoice(choice);
            });
        });

        safeGet('achievements-btn').addEventListener('click', () => { this.hideModal('menuModal'); this.showModal('achievementsModal'); });
        safeGet('statistics-btn').addEventListener('click', () => { this.hideModal('menuModal'); this.showModal('statisticsModal'); });
        safeGet('leaderboard-btn').addEventListener('click', () => { this.hideModal('menuModal'); this.showModal('leaderboardModal'); });
        safeGet('life-choices-btn').addEventListener('click', () => { this.hideModal('menuModal'); this.showModal('lifeModal'); });
        safeGet('restart-btn').addEventListener('click', () => this.restartLife());

        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal && modal.id) this.hideModal(modal.id);
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal')) this.hideModal(modal.id);
            });
        });

        // Save/load to slots buttons (if present)
        safeGet('save-slot-1').addEventListener('click', () => this.saveGame(1));
        safeGet('save-slot-2').addEventListener('click', () => this.saveGame(2));
        safeGet('load-slot-1').addEventListener('click', () => this.loadGame(1));
        safeGet('load-slot-2').addEventListener('click', () => this.loadGame(2));
    }

    startGameLoops() {
        // Auto-save every 30 seconds to slot 1
        setInterval(() => this.autoSave(), 30000);

        // Update weather every 2 minutes
        setInterval(() => this.updateWeather(), 120000);

        // Update rivals every minute
        setInterval(() => this.updateRivals(), 60000);

        // Passive investment update every minute
        setInterval(() => this.updateInvestments(), 60000);
    }

    // Core Game Mechanics
    advanceMonth() {
        this.gameState.month++;
        if (this.gameState.month > 12) {
            this.gameState.month = 1;
            this.gameState.age++;
        }

        // Profession income
        let monthlyIncome = this.getProfessionIncome() / 12;

        // Business & property income
        this.gameState.businesses.forEach(b => monthlyIncome += b.income);
        this.gameState.properties.forEach(p => monthlyIncome += p.income);

        // Housing maintenance
        if (this.gameState.housing) {
            const tier = this.housingTiers[this.gameState.housing];
            if (tier) this.gameState.monthlyExpenses += tier.monthlyMaintenance;
        }

        // Apply income and expenses
        this.gameState.money += monthlyIncome - this.gameState.monthlyExpenses;

        // Age-related changes
        if (this.gameState.age > 30) this.gameState.health = Math.max(0, this.gameState.health - 1);

        // Trait effects
        this.applyTraitEffects();

        // Random events & social
        this.randomMonthlyEvent();
        this.updateSocialLife();

        // Investments growth
        this.updateInvestments();

        // Education progression
        this.progressEducation();

        // Possible global event
        if (Math.random() < 0.03) this.triggerGlobalEvent();

        // Career progression
        this.updateCareerProgress();

        // Update statistics
        this.gameState.statistics.monthsLived++;
        this.gameState.statistics.totalMoneyEarned += Math.max(0, monthlyIncome);

        // Check achievements
        this.checkAchievements();

        // Update life goals
        this.updateLifeGoals();

        // Save history snippet
        this.logEvent(`Month ${this.gameState.month}, Age ${this.gameState.age}. Net change: $${Math.floor(monthlyIncome - this.gameState.monthlyExpenses)}`);

        // Refresh UI
        this.updateDisplay();
        this.showNotification(`Month ${this.gameState.month}! Net: $${Math.floor(monthlyIncome - this.gameState.monthlyExpenses)} 📅`, 'success');
    }

    advanceYear() {
        for (let i = 0; i < 12; i++) this.advanceMonth();
        this.showNotification(`🎉 Happy New Year! You're now ${this.gameState.age} years old!`, 'success');
    }

    openCharacterTab() {
        const characters = ['🧑‍💼', '👨‍💻', '👩‍⚕️', '👨‍🎨', '👩‍🏫', '🧑‍🚀'];
        const el = document.getElementById('player-character');
        const current = el ? el.textContent : characters[0];
        const currentIndex = characters.indexOf(current);
        const nextIndex = (currentIndex + 1) % characters.length;
        if (el) el.textContent = characters[nextIndex];
        this.showNotification('Character updated! 🎭', 'success');
    }

    // -- Trait Effects
    applyTraitEffects() {
        const traits = this.gameState.personalityTraits;
        if (traits.includes('Ambitious')) {
            this.gameState.skills = Math.min(100, this.gameState.skills + 1);
            this.gameState.reputation = Math.min(100, this.gameState.reputation + 0.5);
        }
        if (traits.includes('Lazy')) {
            this.gameState.monthlyExpenses = Math.max(0, this.gameState.monthlyExpenses - 50);
            this.gameState.skills = Math.max(0, this.gameState.skills - 0.5);
        }
        if (traits.includes('Creative')) {
            if (this.gameState.profession.toLowerCase() === 'artist') this.gameState.money += 200; // small creative bonus
        }
        if (traits.includes('Charismatic')) {
            // slightly increase chance of positive social events
            this.gameState.reputation = Math.min(100, this.gameState.reputation + 0.3);
        }
    }

    // Study System (unchanged but small tweak)
    studySubject(subject) {
        const subjectData = this.gameState.subjects[subject];
        if (!subjectData) return;
        const progressGain = Math.floor(Math.random() * 20) + 10;
        subjectData.progress += progressGain;
        if (subjectData.progress >= 100) {
            subjectData.level++;
            subjectData.progress = 0;
            this.gameState.skills = Math.min(100, this.gameState.skills + 10);
            this.gameState.statistics.skillsLearned++;
            if (subjectData.level >= 10) this.unlockAchievement('scholar');
            this.showNotification(`Level Up! ${subject.toUpperCase()} Level ${subjectData.level}! 🎓`, 'success');
        } else {
            this.gameState.skills = Math.min(100, this.gameState.skills + 2);
            this.showNotification(`Studied ${subject}! +${progressGain}% progress 📚`, 'success');
        }
        this.gameState.happiness = Math.min(100, this.gameState.happiness + 5);
        this.hideModal('studyModal');
        this.updateDisplay();
        this.updateSubjectDisplay(subject);
        this.logEvent(`Studied ${subject} (+${progressGain}%)`);
    }

    updateSubjectDisplay(subject) {
        const card = document.querySelector(`[data-subject="${subject}"]`);
        if (card) {
            const progressFill = card.querySelector('.progress-fill');
            const statusSpan = card.querySelector('.status');
            if (progressFill) progressFill.style.width = this.gameState.subjects[subject].progress + '%';
            if (statusSpan) statusSpan.textContent = `Level ${this.gameState.subjects[subject].level}`;
        }
    }

    // Career System (keeps earlier checks)
    chooseProfession(profession) {
        const professionData = this.professions[profession];
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
            if (!this.gameState.achievements.includes('first-job')) this.unlockAchievement('first-job');
            this.logEvent(`Became a ${this.gameState.profession}`);
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
            if (professionKey === 'entrepreneur') salary = this.gameState.businesses.reduce((total, business) => total + business.income * 12, 0);
            // specialization bonus
            if (this.gameState.specialization && professionKey.includes(this.gameState.specialization.toLowerCase())) salary *= 1.1;
            return salary;
        }
        return 30000;
    }

    // Business System (unchanged)
    startBusiness(businessType) {
        const businesses = {
            'store': { name: 'Corner Store', cost: 25000, income: 2500 },
            'coffee': { name: 'Coffee Shop', cost: 40000, income: 4200 },
            'tech': { name: 'Tech Startup', cost: 75000, income: 8000 },
            'restaurant': { name: 'Restaurant', cost: 60000, income: 6500 }
        };
        const business = businesses[businessType];
        if (!business) return;
        if (this.gameState.money >= business.cost) {
            this.gameState.money -= business.cost;
            this.gameState.businesses.push({ name: business.name, income: business.income, type: businessType });
            this.gameState.statistics.businessesOwned++;
            this.unlockAchievement('entrepreneur');
            this.hideModal('businessModal');
            this.updateDisplay();
            this.showNotification(`${business.name} launched! Monthly income: $${business.income} 🚀`, 'success');
            this.logEvent(`Started business: ${business.name}`);
        } else this.showNotification(`Need $${business.cost} to start this business! 💸`, 'error');
    }

    buyProperty(propertyType) {
        const properties = {
            'apartment': { name: 'Apartment Building', cost: 200000, income: 3000 },
            'office': { name: 'Office Complex', cost: 350000, income: 5000 }
        };
        const property = properties[propertyType];
        if (!property) return;
        if (this.gameState.money >= property.cost) {
            this.gameState.money -= property.cost;
            this.gameState.properties.push({ name: property.name, income: property.income, type: propertyType });
            this.unlockAchievement('homeowner');
            this.hideModal('businessModal');
            this.updateDisplay();
            this.showNotification(`${property.name} purchased! Monthly rent: $${property.income} 🏢`, 'success');
            this.logEvent(`Bought property: ${property.name}`);
        } else this.showNotification(`Need $${property.cost} for this property! 💸`, 'error');
    }

    // Housing purchase
    buyHousing(tierKey) {
        const tier = this.housingTiers[tierKey];
        if (!tier) return;
        if (this.gameState.money >= tier.cost) {
            this.gameState.money -= tier.cost;
            this.gameState.housing = tierKey;
            this.gameState.happiness = Math.min(100, this.gameState.happiness + tier.happiness);
            this.gameState.prestigeLevel += tier.prestige;
            this.showNotification(`Purchased ${tierKey}! Home sweet home 🏡`, 'success');
            this.logEvent(`Bought housing: ${tierKey}`);
            this.updateDisplay();
        } else this.showNotification(`Need $${tier.cost} to buy ${tierKey}! 💸`, 'error');
    }

    // Life Choices
    makeLifeChoice(choice) {
        const choices = {
            'dating': {
                cost: 2400,
                effect: () => {
                    this.gameState.happiness += 20;
                    if (Math.random() > 0.5) this.gameState.relationship = 'Dating';
                }
            },
            'house': {
                cost: 200000,
                effect: () => {
                    this.gameState.happiness += 25; this.gameState.reputation += 10; this.unlockAchievement('homeowner');
                }
            },
            'travel': {
                cost: 15000,
                effect: () => { this.gameState.happiness += 20; this.gameState.health += 10; }
            },
            'luxury': {
                cost: 50000,
                effect: () => { this.gameState.happiness += 15; this.gameState.reputation += 20; }
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
                effect: () => { this.gameState.health = Math.min(100, this.gameState.health + 25); this.gameState.monthlyExpenses += 417; }
            }
        };
        const choiceData = choices[choice];
        if (!choiceData) return;
        if (this.gameState.money >= choiceData.cost) {
            this.gameState.money -= choiceData.cost;
            const success = choiceData.effect();
            if (success !== false) {
                this.hideModal('lifeModal');
                this.updateDisplay();
                this.showNotification(`${choice.charAt(0).toUpperCase() + choice.slice(1)} choice made! 🎉`, 'success');
                this.logEvent(`Made life choice: ${choice}`);
            }
        } else this.showNotification(`Need $${choiceData.cost} for this choice! 💸`, 'error');
    }

    // Achievement System
    unlockAchievement(achievementId) {
        if (!this.gameState.achievements.includes(achievementId)) {
            this.gameState.achievements.push(achievementId);
            this.gameState.statistics.achievementsUnlocked++;
            const achievement = this.achievements[achievementId];
            if (achievement) this.showAchievement(achievement.icon, achievement.name);
            this.gameState.reputation = Math.min(100, this.gameState.reputation + 10);
            this.logEvent(`Unlocked achievement: ${achievementId}`);
        }
    }

    showAchievement(icon, name) {
        const popup = document.getElementById('achievement-popup');
        if (popup) {
            const iconEl = document.getElementById('achievement-icon');
            const textEl = document.getElementById('achievement-text');
            if (iconEl) iconEl.textContent = icon;
            if (textEl) textEl.textContent = name;
            popup.classList.add('show');
            setTimeout(() => popup.classList.remove('show'), 3000);
        }
    }

    checkAchievements() {
        if (this.gameState.money >= 1000000) this.unlockAchievement('millionaire');
        Object.values(this.gameState.subjects).forEach(s => { if (s.level >= 10) this.unlockAchievement('scholar'); });
    }

    updateLifeGoals() {
        this.gameState.lifeGoals.save100k.progress = (this.gameState.money / this.gameState.lifeGoals.save100k.target) * 100;
        this.gameState.lifeGoals.buyHouse.progress = (this.gameState.money / this.gameState.lifeGoals.buyHouse.target) * 100;
        const relationshipProgress = { 'Single': 0, 'Dating': 50, 'Married': 100 };
        this.gameState.lifeGoals.getMarried.progress = relationshipProgress[this.gameState.relationship] || 0;
        const goals = document.querySelectorAll('.goal-fill');
        if (goals[0]) goals[0].style.width = Math.min(100, this.gameState.lifeGoals.save100k.progress) + '%';
        if (goals[1]) goals[1].style.width = Math.min(100, this.gameState.lifeGoals.buyHouse.progress) + '%';
        if (goals[2]) goals[2].style.width = Math.min(100, this.gameState.lifeGoals.getMarried.progress) + '%';
    }

    // Random Events
    randomMonthlyEvent() {
        if (Math.random() < 0.3) {
            const events = [
                { message: "Found money on the street! 💰", effect: () => { this.gameState.money += Math.floor(Math.random() * 500) + 100; } },
                { message: "Got a bonus at work! 🎉", effect: () => { this.gameState.money += Math.floor(Math.random() * 2000) + 500; } },
                { message: "Made a new friend! 👥", effect: () => { this.gameState.happiness += 10; this.gameState.reputation += 5; } },
                { message: "Caught a cold... 🤧", effect: () => { this.gameState.health -= 10; this.gameState.happiness -= 5; } },
                { message: "Learned something new! 📚", effect: () => { this.gameState.skills += 5; this.gameState.happiness += 5; } }
            ];
            const event = events[Math.floor(Math.random() * events.length)];
            event.effect();
            this.showNotification(event.message, 'success');
            this.logEvent(`Event: ${event.message}`);
        }
    }

    // Social System
    updateSocialLife() {
        const baseChance = 0.25 + (this.gameState.personalityTraits.includes('Charismatic') ? 0.1 : 0);
        if (Math.random() < baseChance) {
            const events = [
                { message: "You reconnected with an old friend! 👋", happiness: 10 },
                { message: "You argued with a coworker 😠", happiness: -8 },
                { message: "You went on a date 💕", happiness: 15, relationship: "Dating" }
            ];
            const ev = events[Math.floor(Math.random() * events.length)];
            this.gameState.happiness = Math.min(100, Math.max(0, this.gameState.happiness + (ev.happiness || 0)));
            if (ev.relationship) this.gameState.relationship = ev.relationship;
            this.showNotification(ev.message, ev.happiness >= 0 ? 'success' : 'warning');
            this.logEvent(`Social: ${ev.message}`);
        }
    }

    // Investments
    updateInvestments() {
        // simple monthly interest model applied every call (which may be per-minute in loops)
        const interestSavings = 0.0005; // small per-minute increment
        const stockFluct = (Math.random() - 0.5) * 0.02; // -1%..+1%
        const cryptoFluct = (Math.random() - 0.5) * 0.05; // -2.5%..+2.5%

        this.gameState.investments.savings += this.gameState.investments.savings * interestSavings;
        this.gameState.investments.stocks += this.gameState.investments.stocks * stockFluct;
        this.gameState.investments.crypto += this.gameState.investments.crypto * cryptoFluct;

        // Occasionally notify
        if (Math.random() < 0.05) this.showNotification('Investment markets moved 📈', 'info');
    }

    invest(type, amount) {
        if (this.gameState.money < amount) return this.showNotification('Not enough money to invest', 'error');
        if (!['savings','stocks','crypto'].includes(type)) return;
        this.gameState.money -= amount;
        this.gameState.investments[type] += amount;
        this.showNotification(`Invested $${amount} into ${type}`, 'success');
        this.logEvent(`Invested ${amount} in ${type}`);
    }

    // Education
    enrollEducation(programKey) {
        const program = this.educationPrograms[programKey];
        if (!program) return this.showNotification('Invalid program', 'error');
        if (this.gameState.money < program.cost) return this.showNotification(`Need $${program.cost} to enroll`, 'error');
        this.gameState.money -= program.cost;
        this.gameState.education.enrolled = programKey;
        this.gameState.education.monthsRemaining = program.months;
        this.showNotification(`Enrolled in ${programKey}`, 'success');
        this.logEvent(`Enrolled: ${programKey}`);
    }

    progressEducation() {
        if (!this.gameState.education.enrolled) return;
        this.gameState.education.monthsRemaining--;
        if (this.gameState.education.monthsRemaining <= 0) {
            const prog = this.educationPrograms[this.gameState.education.enrolled];
            if (prog) {
                this.gameState.profession = prog.unlocks;
                this.showNotification(`${this.gameState.education.enrolled} completed! Profession unlocked: ${prog.unlocks}`, 'success');
                this.unlockAchievement('scholar');
                this.logEvent(`Completed education: ${this.gameState.education.enrolled}`);
            }
            this.gameState.education.enrolled = null;
            this.gameState.education.monthsRemaining = 0;
        }
    }

    // Prestige / Rebirth
    prestigeLife() {
        if (this.gameState.money >= 1000000) {
            this.gameState.prestigeLevel++;
            // Soft reset but keep some progress
            const preserved = {
                prestigeLevel: this.gameState.prestigeLevel,
                achievements: this.gameState.achievements.slice(),
                personalityTraits: this.gameState.personalityTraits.slice()
            };
            this.gameState = Object.assign(this.gameState, {
                age: 22, month: 1, money: 1000, health: 75, happiness: 60, reputation: 42,
                skills: 10 * this.gameState.prestigeLevel, profession: 'Student', relationship: 'Single',
                businesses: [], properties: [], investments: { savings: 0, stocks: 0, crypto: 0 }, education: { enrolled: null, monthsRemaining: 0 }, housing: null
            });
            // merge preserved
            this.gameState.prestigeLevel = preserved.prestigeLevel;
            this.gameState.achievements = preserved.achievements;
            this.gameState.personalityTraits = preserved.personalityTraits;

            this.showNotification(`Reborn with Prestige ${this.gameState.prestigeLevel}! 🌟`, 'success');
            this.logEvent(`Prestiged to level ${this.gameState.prestigeLevel}`);
            this.updateDisplay();
        } else this.showNotification('You need $1,000,000 to prestige!', 'warning');
    }

    // Global Events
    triggerGlobalEvent() {
        const events = [
            { name: 'Economic Boom 💹', effect: () => { this.gameState.money += 10000; } },
            { name: 'Recession 😓', effect: () => { this.gameState.money = Math.floor(this.gameState.money * 0.9); } },
            { name: 'Pandemic 🦠', effect: () => { this.gameState.health = Math.max(0, this.gameState.health - 10); } },
            { name: 'Invention of AI 🤖', effect: () => { this.gameState.skills += 5; } }
        ];
        const ev = events[Math.floor(Math.random() * events.length)];
        ev.effect();
        this.showNotification(`Global Event: ${ev.name}`, 'info');
        this.logEvent(`Global event: ${ev.name}`);
    }

    // Career promotions
    updateCareerProgress() {
        if (this.gameState.profession !== 'Student' && Math.random() < 0.2) {
            const bonus = Math.floor(Math.random() * 5000) + 2000;
            this.gameState.money += bonus;
            // small chance to increase salary
            if (Math.random() < 0.1) {
                const key = this.gameState.profession.toLowerCase();
                if (this.professions[key]) this.professions[key].salary = Math.floor(this.professions[key].salary * 1.05);
                this.showNotification(`You got a raise! +$${bonus} 💼`, 'success');
                this.logEvent(`Promotion raise: ${bonus}`);
            } else {
                this.showNotification(`Performance bonus: +$${bonus} 💼`, 'success');
                this.logEvent(`Bonus: ${bonus}`);
            }
        }
    }

    // Activities
    dailyActivity(type) {
        const activities = {
            'workout': { health: +10, happiness: +5 },
            'social_media': { happiness: +15, reputation: +10, health: -5 },
            'streaming': { money: +200, happiness: +10, reputation: +5 }
        };
        const a = activities[type];
        if (!a) return;
        Object.keys(a).forEach(stat => {
            if (this.gameState.hasOwnProperty(stat)) this.gameState[stat] = Math.min(100, Math.max(0, this.gameState[stat] + a[stat]));
            else if (this.gameState[stat] === undefined) this.gameState[stat] = a[stat];
        });
        this.showNotification(`You did ${type.replace('_',' ')}! 💪`, 'success');
        this.logEvent(`Activity: ${type}`);
        this.updateDisplay();
    }

    // Rival System (unchanged)
    updateRivals() {
        this.gameState.rivals.forEach(rival => {
            rival.money += Math.floor(Math.random() * 2000) + 500;
            if (Math.random() > 0.95) rival.age++;
        });
        const rivalDisplay = document.getElementById('rival-display');
        if (this.gameState.rivals.length > 0 && rivalDisplay) {
            const topRival = this.gameState.rivals[0];
            rivalDisplay.textContent = `🏆 Rival: ${topRival.name} ($${topRival.money.toLocaleString()})`;
        }
    }
    // ===================== DYNAMIC LIFE GOALS SYSTEM ===================== //
updateWeather() {
  // Preserve the name "updateWeather" but run life-goal logic
  if (!this.gameState.lifeGoals) this.gameState.lifeGoals = [];

  // Base pool of possible random goals
  const goalPool = [
    { title: "Buy your first car 🚗", condition: gs => gs.money >= 5000 },
    { title: "Own a house 🏠", condition: gs => gs.reputation >= 60 && gs.money >= 100000 },
    { title: "Reach 100 happiness 🌈", condition: gs => gs.happiness >= 100 },
    { title: "Get a high-paying job 💼", condition: gs => gs.skills >= 80 && gs.money >= 20000 },
    { title: "Travel abroad 🌍", condition: gs => gs.money >= 30000 && gs.happiness >= 70 },
    { title: "Become famous ⭐", condition: gs => gs.reputation >= 100 },
    { title: "Build a business 🏢", condition: gs => gs.money >= 50000 && gs.skills >= 60 },
    { title: "Reach $1,000,000 💰", condition: gs => gs.money >= 1000000 },
    { title: "Find love ❤️", condition: gs => gs.relationship && gs.relationship !== "Single" }
  ];

  // If the player has fewer than 3 active goals, add a random one
  if (this.gameState.lifeGoals.filter(g => !g.completed).length < 3) {
    const newGoal = goalPool[Math.floor(Math.random() * goalPool.length)];
    const alreadyHas = this.gameState.lifeGoals.some(g => g.title === newGoal.title);
    if (!alreadyHas) {
      this.gameState.lifeGoals.push({
        title: newGoal.title,
        condition: newGoal.condition.toString(), // store as string for save compatibility
        completed: false
      });
      this.showNotification(`🎯 New Life Goal: ${newGoal.title}`, "info");
    }
  }

  // Check progress
  for (let goal of this.gameState.lifeGoals) {
    if (!goal.completed) {
      const condFn = eval("(" + goal.condition + ")");
      if (condFn(this.gameState)) {
        goal.completed = true;
        this.showNotification(`✅ Goal Completed: ${goal.title}`, "success");
        this.gameState.happiness += 10;
        this.gameState.reputation += 8;
      }
    }
  }
}

// ===================== GOAL MANAGEMENT UI ===================== //
showGoalsMenu() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>🎯 Life Goals</h2>
      <div id="goal-list"></div>
      <input type="text" id="custom-goal" placeholder="Enter your own goal...">
      <button id="add-goal">Add Goal</button>
    </div>
  `;
  document.body.appendChild(modal);

  const list = modal.querySelector("#goal-list");
  const renderGoals = () => {
    list.innerHTML = this.gameState.lifeGoals.map(
      g => `<p>${g.completed ? "✅" : "⏳"} ${g.title}</p>`
    ).join("");
  };
  renderGoals();

  modal.querySelector("#add-goal").onclick = () => {
    const text = modal.querySelector("#custom-goal").value.trim();
    if (text) {
      this.gameState.lifeGoals.push({
        title: text,
        condition: "() => false", // manual goals tracked by user
        completed: false
      });
      this.showNotification(`Added custom goal: ${text}`, "success");
      renderGoals();
      modal.querySelector("#custom-goal").value = "";
    }
  };

  modal.querySelector(".close").onclick = () => modal.remove();
}

// ===================== LINK UI BUTTON ===================== //
initializeUI() {
  console.log("UI initialized.");

  // Example: make sure all UI elements exist and show initial values
  const safeText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  // Basic stats (assuming your HTML has these IDs)
  safeText('age', this.gameState.age);
  safeText('money', `$${this.gameState.money.toLocaleString()}`);
  safeText('profession', this.gameState.profession);
  safeText('relationship', this.gameState.relationship);

  // Example UI update for subjects
  Object.entries(this.gameState.subjects).forEach(([key, data]) => {
    const card = document.querySelector(`[data-subject="${key}"]`);
    if (card) {
      const progress = card.querySelector('.progress-fill');
      if (progress) progress.style.width = `${data.progress}%`;
      const status = card.querySelector('.status');
      if (status) status.textContent = `Level ${data.level}`;
    }
  });

  // You can expand this later to dynamically create or reset panels, modals, etc.
}




    // Background System
    updateBackground() {
        const bgOverlay = document.getElementById('background-overlay');
        if (!bgOverlay) return;
        if (this.gameState.money >= 1000000) bgOverlay.className = 'background-overlay bg-millionaire';
        else if (this.gameState.money >= 100000) bgOverlay.className = 'background-overlay bg-rich';
        else if (this.gameState.money >= 25000) bgOverlay.className = 'background-overlay bg-middle';
        else bgOverlay.className = 'background-overlay bg-poor';
    }

    // UI Management
    showModal(modalId) { const el = document.getElementById(modalId); if (el) el.classList.remove('hidden'); }
    hideModal(modalId) { const el = document.getElementById(modalId); if (el) el.classList.add('hidden'); }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        if (!notification) return console.log(`${type.toUpperCase()}: ${message}`);
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    // Display Updates
    updateDisplay() {
        ['health','happiness','reputation','skills'].forEach(stat => {
            const fill = document.getElementById(`${stat}-fill`);
            if (fill) fill.style.width = (this.gameState[stat] || 0) + '%';
        });
        const moneyEl = document.getElementById('money'); if (moneyEl) moneyEl.textContent = '$' + (this.gameState.money || 0).toLocaleString();
        const rep = document.getElementById('reputation-text'); if (rep) rep.textContent = '⭐ ' + (this.gameState.reputation || 0);
        const ageEl = document.getElementById('age'); if (ageEl) ageEl.textContent = 'Age: ' + this.gameState.age;
        const monthEl = document.getElementById('month'); if (monthEl) monthEl.textContent = 'Month: ' + this.gameState.month;
        const profEl = document.getElementById('profession'); if (profEl) profEl.textContent = this.gameState.profession;
        const relEl = document.getElementById('relationship'); if (relEl) relEl.textContent = this.gameState.relationship;
        const prestigeEl = document.getElementById('prestige-indicator'); if (prestigeEl) prestigeEl.textContent = `⭐ Prestige ${this.gameState.prestigeLevel}`;

        // Stats modal
        const totalMoneyEl = document.getElementById('total-money-earned'); if (totalMoneyEl) totalMoneyEl.textContent = '$' + (this.gameState.statistics.totalMoneyEarned || 0).toLocaleString();
        const monthsLivedEl = document.getElementById('months-lived'); if (monthsLivedEl) monthsLivedEl.textContent = this.gameState.statistics.monthsLived;

        // Achievement score
        const achievementScore = this.gameState.achievements.reduce((t,id)=> t + (this.achievements[id]?.points||0), 0);
        const achievementScoreEl = document.getElementById('achievement-score'); if (achievementScoreEl) achievementScoreEl.textContent = achievementScore;
        const unlockedCountEl = document.getElementById('unlocked-count'); if (unlockedCountEl) unlockedCountEl.textContent = this.gameState.achievements.length;

        // Update background
        this.updateBackground();

        // Update life goals
        this.updateLifeGoals();
    }

    // Save/Load System (multiple slots)
    autoSave() { this.saveGame(1); }
    saveGame(slot = 1) {
        try {
            localStorage.setItem(`ultimateLifeSimulator_slot${slot}`, JSON.stringify(this.gameState));
            this.showNotification(`Game saved to slot ${slot}! 💾`, 'success');
            this.logEvent(`Saved to slot ${slot}`);
        } catch (error) { console.error('Save failed', error); this.showNotification('Save failed', 'error'); }
    }
    loadGame(slot = 1) {
        try {
            const saved = localStorage.getItem(`ultimateLifeSimulator_slot${slot}`);
            if (saved) {
                const savedState = JSON.parse(saved);
                this.gameState = { ...this.gameState, ...savedState };
                this.updateDisplay();
                this.showNotification(`Loaded save slot ${slot} ✅`, 'success');
                this.logEvent(`Loaded slot ${slot}`);
            }
        } catch (error) { console.error('Load failed', error); this.showNotification('Load failed', 'error'); }
    }

    restartLife() {
        if (confirm('Are you sure you want to start a new life? This will reset all progress!')) {
            localStorage.removeItem('ultimateLifeSimulator_slot1');
            location.reload();
        }
    }

    // History / Logging
    logEvent(message) {
        if (!this.gameState.history) this.gameState.history = [];
        this.gameState.history.push({ message, time: new Date().toLocaleString() });
        if (this.gameState.history.length > 200) this.gameState.history.shift();
    }
}

// Initialize the game (expose globally)
window.game = new UltimateLifeSimulator();

// Optional helper API to interact in console
window.uls = {
    invest: (t,a) => window.game.invest(t,a),
    prestige: () => window.game.prestigeLife(),
    enroll: p => window.game.enrollEducation(p),
    buyHousing: t => window.game.buyHousing(t),
    daily: t => window.game.dailyActivity(t),
    save: s => window.game.saveGame(s),
    load: s => window.game.loadGame(s)
};
