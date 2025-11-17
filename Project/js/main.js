// Global state
let walletConnected = false;
let currentUser = null;

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const getStartedBtn = document.getElementById('getStarted');
const learnMoreBtn = document.getElementById('learnMore');
const addSkillModal = document.getElementById('addSkillModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelSkillBtn = document.getElementById('cancelSkill');
const skillForm = document.getElementById('skillForm');
const mobileNavToggle = document.getElementById('mobileNavToggle');
const mobileNav = document.getElementById('mobileNav');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is already connected
    const savedWallet = localStorage.getItem('walletConnected');
    if (savedWallet === 'true') {
        connectWallet();
    }

    // Initialize mobile dropdown
    initializeMobileDropdown();

    // Add floating animation to feature cards with delays
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Add hover effects to skill cards
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Initialize event listeners
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', toggleWalletConnection);
    }

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', handleGetStarted);
    }

    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', handleLearnMore);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeAddSkillModal);
    }

    if (cancelSkillBtn) {
        cancelSkillBtn.addEventListener('click', closeAddSkillModal);
    }

    if (skillForm) {
        skillForm.addEventListener('submit', handleSkillSubmission);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === addSkillModal) {
            closeAddSkillModal();
        }
    });

    // Initialize search functionality if on skills page
    initializeSearch();
    
    // Initialize page-specific features
    initializePageSpecificFeatures();
}

// Mobile Dropdown Functionality
function initializeMobileDropdown() {
    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileNav.classList.toggle('active');
            
            // Toggle hamburger icon
            const icon = mobileNavToggle.querySelector('i');
            if (icon) {
                if (mobileNav.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                    document.body.classList.add('no-scroll');
                } else {
                    icon.className = 'fas fa-bars';
                    document.body.classList.remove('no-scroll');
                }
            }
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.header-content') && mobileNav.classList.contains('active')) {
                closeMobileNav();
            }
        });

        // Close mobile nav when clicking on a link
        mobileNav.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                closeMobileNav();
            }
        });

        // Close mobile nav on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMobileNav();
            }
        });
    }
}

function closeMobileNav() {
    if (mobileNav && mobileNavToggle) {
        mobileNav.classList.remove('active');
        const icon = mobileNavToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
        document.body.classList.remove('no-scroll');
    }
}

// Wallet Connection
function toggleWalletConnection() {
    if (!walletConnected) {
        connectWallet();
    } else {
        disconnectWallet();
    }
}

function connectWallet() {
    // Show loading state
    connectWalletBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
    connectWalletBtn.disabled = true;

    // Simulate wallet connection
    setTimeout(() => {
        walletConnected = true;
        currentUser = {
            address: '0x742d35Cc6634C0532925a3b8Dc2388e8a2d35c5a',
            name: 'Crypto Dev',
            avatar: 'CD'
        };
        
        connectWalletBtn.innerHTML = '<i class="fas fa-check"></i> 0x742d...2d35';
        connectWalletBtn.disabled = false;
        connectWalletBtn.classList.add('glow');
        
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('userData', JSON.stringify(currentUser));
        
        showNotification('Wallet connected successfully!', 'success');
        
        // Update UI based on connection
        updateUIForConnection();
    }, 1500);
}

function disconnectWallet() {
    walletConnected = false;
    currentUser = null;
    
    connectWalletBtn.innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
    connectWalletBtn.classList.remove('glow');
    
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('userData');
    
    showNotification('Wallet disconnected', 'info');
    
    // Update UI based on disconnection
    updateUIForConnection();
}

function updateUIForConnection() {
    // Update any UI elements that depend on wallet connection
    const walletDependentElements = document.querySelectorAll('[data-wallet-only]');
    walletDependentElements.forEach(element => {
        if (walletConnected) {
            element.style.display = element.dataset.walletDisplay || 'block';
        } else {
            element.style.display = 'none';
        }
    });
}

// Modal Controls
function openAddSkillModal() {
    if (!walletConnected) {
        showNotification('Please connect your wallet first!', 'warning');
        if (connectWalletBtn) {
            connectWalletBtn.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }
    
    if (addSkillModal) {
        addSkillModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeAddSkillModal() {
    if (addSkillModal) {
        addSkillModal.style.display = 'none';
        document.body.style.overflow = '';
        if (skillForm) {
            skillForm.reset();
        }
    }
}

// Button Handlers
function handleGetStarted() {
    if (!walletConnected) {
        showNotification('Please connect your wallet first!', 'warning');
        if (connectWalletBtn) {
            connectWalletBtn.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        openAddSkillModal();
    }
}

function handleLearnMore() {
    showNotification('Explore our features and documentation!', 'info');
}

// Skill Form Submission
function handleSkillSubmission(e) {
    e.preventDefault();
    
    const skillName = document.getElementById('skillName').value;
    const skillCategory = document.getElementById('skillCategory').value;
    const skillLevel = document.getElementById('skillLevel').value;
    const skillProof = document.getElementById('skillProof').value;
    
    // Show loading state
    const submitBtn = skillForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        closeAddSkillModal();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        showNotification(`"${skillName}" skill submitted for verification!`, 'success');
        
        // If we're on the dashboard, refresh the skills list
        if (window.location.pathname.includes('dashboard.html') || 
            window.location.pathname.includes('profile.html')) {
            setTimeout(() => {
                showNotification('Skills list updated!', 'info');
            }, 1000);
        }
    }, 2000);
}

// Search Functionality
function initializeSearch() {
    const searchBox = document.getElementById('searchSkills');
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    
    if (searchBox) {
        searchBox.addEventListener('input', filterSkills);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterSkills);
    }
    
    if (levelFilter) {
        levelFilter.addEventListener('change', filterSkills);
    }
}

function filterSkills() {
    const searchTerm = document.getElementById('searchSkills')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const level = document.getElementById('levelFilter')?.value || '';
    
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        const skillName = card.querySelector('.skill-name').textContent.toLowerCase();
        const skillCategory = card.querySelector('.skill-category').textContent;
        const skillLevel = card.querySelector('.skill-level').textContent;
        
        const matchesSearch = skillName.includes(searchTerm);
        const matchesCategory = !category || skillCategory === category;
        const matchesLevel = !level || skillLevel === level;
        
        if (matchesSearch && matchesCategory && matchesLevel) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                          type === 'warning' ? 'exclamation-triangle' : 
                          type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility function to get current user
function getCurrentUser() {
    if (currentUser) {
        return currentUser;
    }
    
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
        return JSON.parse(savedUser);
    }
    
    return null;
}

// Page-specific initializations
function initializePageSpecificFeatures() {
    // Dashboard specific features
    if (window.location.pathname.includes('dashboard.html')) {
        const addSkillBtn = document.getElementById('addSkillBtn');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', openAddSkillModal);
        }
    }
    
    // Profile specific features
    if (window.location.pathname.includes('profile.html')) {
        const editProfileBtn = document.getElementById('editProfileBtn');
        const addSkillProfileBtn = document.getElementById('addSkillProfileBtn');
        const shareProfileBtn = document.getElementById('shareProfileBtn');
        
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', openEditProfileModal);
        }
        if (addSkillProfileBtn) {
            addSkillProfileBtn.addEventListener('click', openAddSkillModal);
        }
        if (shareProfileBtn) {
            shareProfileBtn.addEventListener('click', shareProfile);
        }
    }
    
    // DAO specific features
    if (window.location.pathname.includes('dao.html')) {
        document.querySelectorAll('.vote-btn').forEach(button => {
            button.addEventListener('click', handleVote);
        });
    }
}

// Profile specific functions
function openEditProfileModal() {
    const editProfileModal = document.getElementById('editProfileModal');
    const user = getCurrentUser();
    
    if (editProfileModal && user) {
        const profileNameInput = document.getElementById('profileNameInput');
        const profileBioInput = document.getElementById('profileBioInput');
        const profileAvatarInput = document.getElementById('profileAvatarInput');
        
        if (profileNameInput) profileNameInput.value = user.name || 'Crypto Dev';
        if (profileBioInput) profileBioInput.value = user.bio || 'Full-stack blockchain developer with 5+ years of experience building decentralized applications.';
        if (profileAvatarInput) profileAvatarInput.value = user.avatar || 'CD';
        
        editProfileModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function shareProfile() {
    const profileUrl = window.location.href;
    
    // Simulate sharing
    if (navigator.share) {
        navigator.share({
            title: 'My Proof of Skill Profile',
            text: 'Check out my verified skills on Proof of Skill!',
            url: profileUrl
        })
        .then(() => showNotification('Profile shared successfully!', 'success'))
        .catch(() => copyToClipboard(profileUrl));
    } else {
        copyToClipboard(profileUrl);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => showNotification('Profile URL copied to clipboard!', 'success'))
        .catch(() => showNotification('Failed to copy URL', 'error'));
}

// DAO specific functions
function handleVote(event) {
    if (!walletConnected) {
        showNotification('Please connect your wallet to vote!', 'warning');
        return;
    }
    
    const button = event.currentTarget;
    const proposalId = button.dataset.proposal;
    const isYesVote = button.classList.contains('vote-yes');
    
    // Show loading state
    button.classList.add('loading');
    button.disabled = true;
    
    setTimeout(() => {
        button.classList.remove('loading');
        button.disabled = false;
        showNotification(`Vote ${isYesVote ? 'for' : 'against'} proposal ${proposalId} submitted!`, 'success');
        
        // Update vote count (in a real app, this would come from the blockchain)
        const voteCount = button.textContent.match(/\((\d+)%\)/);
        if (voteCount) {
            const currentPercent = parseInt(voteCount[1]);
            const newPercent = isYesVote ? currentPercent + 1 : currentPercent - 1;
            button.innerHTML = button.innerHTML.replace(/\(\d+%\)/, `(${newPercent}%)`);
        }
    }, 1500);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        getCurrentUser,
        connectWallet,
        disconnectWallet
    };
}
