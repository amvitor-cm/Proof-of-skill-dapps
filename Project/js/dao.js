// DAO-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDAO();
});

function initializeDAO() {
    // Add event listeners for vote buttons
    document.querySelectorAll('.vote-btn').forEach(button => {
        button.addEventListener('click', handleVote);
    });
    
    // Update DAO stats
    updateDAOStats();
}

function handleVote(event) {
    if (typeof walletConnected !== 'undefined' && !walletConnected) {
        if (typeof showNotification === 'function') {
            showNotification('Please connect your wallet to vote!', 'warning');
        }
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
        
        if (typeof showNotification === 'function') {
            showNotification(`Vote ${isYesVote ? 'for' : 'against'} proposal ${proposalId} submitted!`, 'success');
        }
        
        // Update vote count (in a real app, this would come from the blockchain)
        const voteCount = button.textContent.match(/\((\d+)%\)/);
        if (voteCount) {
            const currentPercent = parseInt(voteCount[1]);
            const newPercent = isYesVote ? currentPercent + 1 : currentPercent - 1;
            button.innerHTML = button.innerHTML.replace(/\(\d+%\)/, `(${newPercent}%)`);
        }
    }, 1500);
}

function updateDAOStats() {
    // Simulate loading stats from API
    setTimeout(() => {
        const activeProposals = document.getElementById('activeProposals');
        const totalVotes = document.getElementById('totalVotes');
        const yourVotes = document.getElementById('yourVotes');
        const votingPower = document.getElementById('votingPower');
        
        if (activeProposals) activeProposals.textContent = '12';
        if (totalVotes) totalVotes.textContent = '5.2K';
        
        // Check if wallet is connected
        const isConnected = typeof walletConnected !== 'undefined' && walletConnected;
        if (yourVotes) yourVotes.textContent = isConnected ? '24' : '0';
        if (votingPower) votingPower.textContent = isConnected ? '150' : '0';
    }, 500);
}
