export async function displayWallet(wallet) {
    const walletList = document.getElementById('wallet-list');
    const walletItem = document.createElement('div');
    walletItem.className = 'wallet-item';
    walletItem.innerHTML = `
        <input type="checkbox" class="wallet-checkbox" data-public-key="${wallet.publicKey}">
        <p>地址: ${wallet.publicKey}</p>
        <p>类型: ${wallet.type === 'api' ? 'API钱包' : '普通钱包'}</p>
        <p>SOL余额: <span class="sol-balance">加载中...</span></p>
        <p class="token-balance">代币余额: 加载中...</p>
    `;
    walletList.appendChild(walletItem);
    await updateWalletBalance(wallet.publicKey);
}

export async function updateWalletBalance(publicKey) {
    try {
        const balance = await window.electronAPI.getWalletBalance(publicKey);
        const walletItem = Array.from(document.getElementsByClassName('wallet-item')).find(item => item.innerHTML.includes(publicKey));
        if (walletItem) {
            walletItem.querySelector('.sol-balance').textContent = balance.solBalance.toFixed(9) + ' SOL';
            const tokenBalanceElement = walletItem.querySelector('.token-balance');
            if (balance.tokenBalance > 0) {
                tokenBalanceElement.textContent = `${balance.tokenAddress} 余额: ${balance.tokenBalance}`;
            } else {
                tokenBalanceElement.textContent = `${balance.tokenAddress} 余额: 0`;
            }
        }
    } catch (error) {
        console.error('Error updating wallet balance:', error);
    }
}

export async function refreshAllWalletBalances() {
    const wallets = await window.electronAPI.getWallets();
    for (const wallet of wallets) {
        await updateWalletBalance(wallet.publicKey);
    }
}