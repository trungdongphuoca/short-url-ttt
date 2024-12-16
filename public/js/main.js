document.getElementById('urlForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = document.getElementById('url').value;
    const customCode = document.getElementById('customCode').value;
    
    try {
        const response = await fetch('/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, customCode }),
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('shortUrl').value = data.shortUrl;
            document.getElementById('result').style.display = 'block';
            
            const tableBody = document.querySelector('.table tbody');
            if (tableBody) {
                const newRow = createHistoryRow({
                    original_url: url,
                    short_code: data.shortCode,
                    clicks: 0,
                    baseUrl: window.location.origin
                });
                
                if (document.querySelector('.text-center.text-muted')) {
                    document.querySelector('.card-body').innerHTML = `
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>URL gốc</th>
                                        <th>URL rút gọn</th>
                                        <th>Lượt click</th>
                                        <th>Thống kê</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${newRow}
                                </tbody>
                            </table>
                        </div>
                    `;
                } else {
                    tableBody.insertAdjacentHTML('afterbegin', newRow);
                }
            }
            
            document.getElementById('urlForm').reset();
        } else {
            alert('Có lỗi xảy ra: ' + data.error);
        }
    } catch (err) {
        alert('Có lỗi xảy ra khi kết nối với server');
    }
});

function createHistoryRow(data) {
    return `
        <tr>
            <td>
                <div class="text-truncate" style="max-width: 250px;">
                    <a href="${data.original_url}" target="_blank" title="${data.original_url}">
                        ${data.original_url}
                    </a>
                </div>
            </td>
            <td>
                <div class="input-group">
                    <input type="text" class="form-control form-control-sm" 
                           value="${data.baseUrl}/${data.short_code}" 
                           readonly>
                    <button class="btn btn-outline-secondary btn-sm" 
                            onclick="copyUrl(this)" 
                            data-url="${data.baseUrl}/${data.short_code}">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
            </td>
            <td>
                <span class="badge bg-primary">0</span>
            </td>
            <td>
                <a href="/stats/${data.short_code}" 
                   class="btn btn-info btn-sm">
                    Chi tiết
                </a>
            </td>
        </tr>
    `;
}

function copyToClipboard() {
    const shortUrl = document.getElementById('shortUrl');
    shortUrl.select();
    document.execCommand('copy');
    alert('Đã sao chép URL vào clipboard!');
}

function copyUrl(button) {
    const url = button.getAttribute('data-url');
    const tempInput = document.createElement('input');
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    const originalText = button.innerHTML;
    button.innerHTML = 'Đã copy!';
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 1000);
} 