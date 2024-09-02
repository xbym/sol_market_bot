import { initChart, updateChart, resetChart } from './js/chart.js';
import { displayWallet, updateWalletBalance, refreshAllWalletBalances } from './js/wallets.js';
import { executeBatchTrade } from './js/trading.js';
import { electronAPI } from './js/api.js';
import { showPage, setupEventListeners } from './js/ui.js';

let currentTokenAddress = "89jtQzY4uqYUGby5AftFg6SnFNB9gfeptnpxUcY5pump";
const ctx = document.getElementById('price-chart').getContext('2d');

async function initialize() {
    await updateTokenInfo();
    initChart(ctx);
    await initializeWallets();
    
    const initialPrice = await electronAPI.getTokenPrice(currentTokenAddress);
    if (initialPrice) {
        updateChart(initialPrice, new Date());
        document.getElementById('current-price').textContent = initialPrice.toFixed(10) + " SOL";
    }

    setupEventListeners();
}

async function updateTokenInfo() {
    try {
        const tokenInfo = await electronAPI.getTokenInfo(currentTokenAddress);
        document.getElementById('token-info').innerHTML = `
            <p>名称: ${tokenInfo.Data.Name}</p>
            <p>符号: ${tokenInfo.Data.Symbol}</p>
            <p>铸造地址: ${tokenInfo.Mint}</p>
        `;
    } catch (error) {
        console.error('Error updating token info:', error);
        document.getElementById('token-info').innerHTML = '<p>获取代币信息失败</p>';
    }
}

async function initializeWallets() {
    const wallets = await electronAPI.getWallets();
    wallets.forEach(displayWallet);
}

// 确保这些函数在全局范围内可用
window.updateContractAddress = async function() {
    const newAddress = document.getElementById('contract-address').value.trim();
    if (newAddress && newAddress !== currentTokenAddress) {
        currentTokenAddress = newAddress;
        await updateTokenInfo();
        resetChart();
        await electronAPI.updateMonitoredToken(currentTokenAddress);
        await refreshAllWalletBalances();
    }
};

window.generateApiKey = async function() {
    const result = await electronAPI.generateApiKey();
    if (result.success) {
        displayWallet(result.wallet);
    } else {
        alert('生成API密钥和钱包失败: ' + result.error);
    }
};

window.generateWallets = async function() {
    const count = parseInt(document.getElementById('wallet-count').value);
    if (count < 1 || count > 50) {
        alert('请输入1-50之间的数字');
        return;
    }
    const wallets = await electronAPI.generateWallets(count);
    wallets.forEach(displayWallet);
};

window.clearWallets = async function() {
    const result = await electronAPI.clearRegularWallets();
    if (result.success) {
        document.getElementById('wallet-list').innerHTML = '';
        const apiWallets = await electronAPI.getWallets();
        apiWallets.forEach(displayWallet);
    }
};

window.exportWallets = async function() {
    const result = await electronAPI.exportWallets();
    if (result.success) {
        alert(result.message);
    } else {
        alert('导出失败: ' + result.message);
    }
};

window.importWallets = async function() {
    const result = await electronAPI.importWallets();
    if (result.success) {
        alert(result.message);
        result.newWallets.forEach(displayWallet);
    } else {
        alert('导入失败: ' + result.message);
    }
};

electronAPI.onPriceUpdate((event, data) => {
    if (data.tokenAddress === currentTokenAddress) {
        const price = parseFloat(data.price.toFixed(10));
        document.getElementById('current-price').textContent = price + " SOL";
        updateChart(price, data.timestamp);
    }
});

initialize();