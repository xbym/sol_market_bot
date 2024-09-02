import { electronAPI } from './api.js';
import { refreshAllWalletBalances } from './wallets.js';
import { executeBatchTrade } from './trading.js';

export function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

export function setupEventListeners() {
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.getAttribute('data-page');
            showPage(pageId);
        });
    });

    // 使用 window 对象上的全局函数
    document.getElementById('update-contract').addEventListener('click', window.updateContractAddress);
    document.getElementById('generate-api-key').addEventListener('click', window.generateApiKey);
    document.getElementById('generate-wallets').addEventListener('click', window.generateWallets);
    document.getElementById('refresh-balances').addEventListener('click', refreshAllWalletBalances);
    document.getElementById('clear-wallets').addEventListener('click', window.clearWallets);
    document.getElementById('export-wallets').addEventListener('click', window.exportWallets);
    document.getElementById('import-wallets').addEventListener('click', window.importWallets);
    document.getElementById('execute-batch-trade').addEventListener('click', executeBatchTrade);
}