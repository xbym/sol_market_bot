export async function executeBatchTrade() {
    const selectedWallets = Array.from(document.querySelectorAll('.wallet-checkbox:checked'))
        .map(checkbox => checkbox.dataset.publicKey);

    if (selectedWallets.length === 0) {
        alert('请选择至少一个钱包');
        return;
    }

    const slippageInput = parseFloat(document.getElementById('trade-slippage').value);
    if (isNaN(slippageInput) || slippageInput < 0 || slippageInput > 100) {
        alert('请输入0到100之间的滑点百分比');
        return;
    }

    const mode = document.getElementById('trade-mode').value;
    const sellPercentage = mode === 'sell' ? parseFloat(document.getElementById('sell-percentage').value) : null;

    const tradeParams = {
        mode: mode,
        token: document.getElementById('trade-token').value,
        amount: mode === 'buy' ? parseFloat(document.getElementById('trade-amount').value) : sellPercentage,
        amountInSol: document.getElementById('amount-in-sol').checked,
        slippage: slippageInput / 100,
        priorityFee: parseFloat(document.getElementById('trade-priority-fee').value)
    };

    const delay = parseInt(document.getElementById('trade-delay').value);

    document.getElementById('trade-results').innerHTML = '';

    window.electronAPI.executeBatchTrade(selectedWallets, tradeParams, delay);
}