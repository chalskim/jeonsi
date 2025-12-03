// 별점 관리 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeRatingManagement();
});

function initializeRatingManagement() {
    // 이벤트 리스너 초기화
    setupEventListeners();

    // 초기 데이터 로드
    loadRatings();

    // 선택된 항목 수 업데이트
    updateSelectedCount();
}

function setupEventListeners() {
    // 검색 필터
    document.getElementById('searchInput').addEventListener('input', filterRatings);
    document.getElementById('ratingFilter').addEventListener('change', filterRatings);
    document.getElementById('periodFilter').addEventListener('change', filterRatings);
    document.getElementById('statusFilter').addEventListener('change', filterRatings);

    // 전체 선택 체크박스
    document.getElementById('selectAll').addEventListener('change', function(e) {
        const checkboxes = document.querySelectorAll('#ratingsTableBody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
        updateSelectedCount();
    });

    // 개별 체크박스
    document.querySelectorAll('#ratingsTableBody input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCount);
    });

    // 페이징 버튼
    document.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                loadPage(this.textContent);
            }
        });
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function filterRatings() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const ratingFilter = document.getElementById('ratingFilter').value;
    const periodFilter = document.getElementById('periodFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const rows = document.querySelectorAll('#ratingsTableBody tr');

    rows.forEach(row => {
        const userName = row.querySelector('.user-name')?.textContent.toLowerCase() || '';
        const serviceName = row.cells[4]?.textContent.toLowerCase() || '';
        const reviewText = row.cells[6]?.textContent.toLowerCase() || '';
        const rating = parseFloat(row.cells[5]?.querySelector('.rating-text')?.textContent) || 0;
        const status = row.cells[8]?.querySelector('.status-badge')?.textContent || '';

        // 검색 필터
        const matchesSearch = userName.includes(searchTerm) ||
                             serviceName.includes(searchTerm) ||
                             reviewText.includes(searchTerm);

        // 평점 필터
        const matchesRating = !ratingFilter || rating == ratingFilter;

        // 기간 필터 (간단한 예시)
        const matchesPeriod = !periodFilter || checkPeriod(row.cells[7]?.textContent, periodFilter);

        // 상태 필터
        const matchesStatus = !statusFilter || status.includes(getStatusText(statusFilter));

        // 모든 필터에 맞는지 확인
        const shouldShow = matchesSearch && matchesRating && matchesPeriod && matchesStatus;

        row.style.display = shouldShow ? '' : 'none';
    });
}

function checkPeriod(dateStr, period) {
    // 실제 구현에서는 날짜 계산 로직이 필요
    return true;
}

function getStatusText(status) {
    const statusMap = {
        'normal': '일반',
        'reported': '신고됨',
        'hidden': '숨김'
    };
    return statusMap[status] || status;
}

function updateSelectedCount() {
    const checkedBoxes = document.querySelectorAll('#ratingsTableBody input[type="checkbox"]:checked');
    const count = checkedBoxes.length;
    document.getElementById('selectedCount').textContent = count;

    // 일괄 작업 버튼 활성화/비활성화
    const bulkActions = document.querySelector('.bulk-actions');
    bulkActions.style.display = count > 0 ? 'flex' : 'none';
}

function loadRatings() {
    // 실제 구현에서는 API 호출로 데이터 로드
    console.log('별점 데이터 로드');
}

function loadPage(page) {
    // 실제 구현에서는 페이지별 데이터 로드
    console.log(`페이지 ${page} 로드`);

    // 페이지 버튼 활성화 상태 업데이트
    document.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent == page) {
            btn.classList.add('active');
        }
    });
}

function viewRating(id) {
    // 실제 구현에서는 해당 ID의 데이터를 API로 가져오기
    const ratingData = getRatingData(id);

    // 모달에 데이터 채우기
    document.getElementById('modalTitle').textContent = '별점 상세 정보';
    document.getElementById('evaluatorName').textContent = ratingData.evaluatorName;
    document.getElementById('evaluatedName').textContent = ratingData.evaluatedName;
    document.getElementById('serviceName').textContent = ratingData.serviceName;
    document.getElementById('ratingDate').textContent = ratingData.ratingDate;
    document.getElementById('ratingContent').value = ratingData.content;
    document.getElementById('adminMemo').value = ratingData.adminMemo || '';

    // 별점 표시 업데이트
    updateRatingStars(ratingData.rating);

    // 상태 배지 업데이트
    updateStatusBadge(ratingData.status);

    // 모달 열기
    openModal();
}

function getRatingData(id) {
    // 실제 데이터 - API 호출로 대체
    const mockData = {
        1: {
            evaluatorName: '김민준',
            evaluatedName: '이서연',
            serviceName: '웹 개발 서비스',
            rating: 5.0,
            ratingDate: '2024-12-01',
            content: '정말 만족스러운 서비스였습니다. 전문성도 높고 소통도 원활했습니다.',
            adminMemo: '',
            status: 'normal'
        },
        2: {
            evaluatorName: '박지혁',
            evaluatedName: '최수아',
            serviceName: '디자인 작업',
            rating: 3.5,
            ratingDate: '2024-11-30',
            content: '디자인은 좋았지만, 소통에 조금 아쉬움이 있었습니다.',
            adminMemo: '소통 개선 필요',
            status: 'normal'
        },
        3: {
            evaluatorName: '정은우',
            evaluatedName: '강하은',
            serviceName: '번역 서비스',
            rating: 2.0,
            ratingDate: '2024-11-29',
            content: '번역 퀄리티가 기대에 미치지 못했습니다.',
            adminMemo: '신고 접수됨 - 검토 필요',
            status: 'reported'
        }
    };

    return mockData[id] || mockData[1];
}

function updateRatingStars(rating) {
    const container = document.getElementById('modalRating');
    const stars = container.querySelectorAll('i');
    const ratingText = container.querySelector('.rating-text');

    // 별점 숨기기
    stars.forEach(star => star.style.display = 'none');

    // 별점 계산 및 표시
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars[i].className = 'fas fa-star';
            stars[i].style.display = 'inline';
        } else if (i === fullStars && hasHalfStar) {
            stars[i].className = 'fas fa-star-half-alt';
            stars[i].style.display = 'inline';
        } else {
            stars[i].className = 'far fa-star';
            stars[i].style.display = 'inline';
        }
    }

    ratingText.textContent = rating.toFixed(1);
}

function updateStatusBadge(status) {
    const badge = document.getElementById('ratingStatus');
    badge.className = 'status-badge';

    switch (status) {
        case 'normal':
            badge.classList.add('normal');
            badge.textContent = '일반';
            break;
        case 'reported':
            badge.classList.add('reported');
            badge.textContent = '신고됨';
            break;
        case 'hidden':
            badge.classList.add('hidden');
            badge.textContent = '숨김';
            break;
    }
}

function editRating(id) {
    viewRating(id);
    document.getElementById('ratingContent').removeAttribute('readonly');
    document.getElementById('modalTitle').textContent = '별점 수정';
}

function deleteRating(id) {
    if (confirm('정말로 이 별점을 삭제하시겠습니까?')) {
        // 실제 구현에서는 API 호출로 삭제
        console.log(`별점 ID ${id} 삭제`);

        // 테이블에서 해당 행 제거
        const row = document.querySelector(`tr:has(button[onclick*="deleteRating(${id})"])`);
        if (row) {
            row.remove();
        }

        showNotification('별점이 삭제되었습니다.');
    }
}

function deleteRatingConfirm() {
    if (confirm('정말로 이 별점을 삭제하시겠습니까?')) {
        closeModal();
        showNotification('별점이 삭제되었습니다.');
    }
}

function hideRating() {
    if (confirm('이 별점을 숨기시겠습니까?')) {
        closeModal();
        showNotification('별점이 숨겨졌습니다.');
    }
}

function hideSelected() {
    const selectedCheckboxes = document.querySelectorAll('#ratingsTableBody input[type="checkbox"]:checked');

    if (selectedCheckboxes.length === 0) {
        showNotification('선택된 항목이 없습니다.');
        return;
    }

    if (confirm(`선택된 ${selectedCheckboxes.length}개의 별점을 숨기시겠습니까?`)) {
        // 실제 구현에서는 API 호출로 상태 변경
        selectedCheckboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const statusBadge = row.querySelector('.status-badge');
            statusBadge.className = 'status-badge hidden';
            statusBadge.textContent = '숨김';
        });

        // 선택 해제
        document.getElementById('selectAll').checked = false;
        updateSelectedCount();

        showNotification('선택된 별점이 숨겨졌습니다.');
    }
}

function deleteSelected() {
    const selectedCheckboxes = document.querySelectorAll('#ratingsTableBody input[type="checkbox"]:checked');

    if (selectedCheckboxes.length === 0) {
        showNotification('선택된 항목이 없습니다.');
        return;
    }

    if (confirm(`정말로 선택된 ${selectedCheckboxes.length}개의 별점을 삭제하시겠습니까?`)) {
        // 실제 구현에서는 API 호출로 삭제
        selectedCheckboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            row.remove();
        });

        // 선택 해제
        document.getElementById('selectAll').checked = false;
        updateSelectedCount();

        showNotification('선택된 별점이 삭제되었습니다.');
    }
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('ratingFilter').value = '';
    document.getElementById('periodFilter').value = '';
    document.getElementById('statusFilter').value = '';

    filterRatings();
    showNotification('필터가 초기화되었습니다.');
}

function exportRatings() {
    // 실제 구현에서는 CSV/Excel 내보내기 기능
    console.log('별점 데이터 내보내기');

    // 간단한 CSV 생성 예시
    let csv = '평가자,피평가자,서비스명,평점,평가내용,평가일,상태\n';

    document.querySelectorAll('#ratingsTableBody tr').forEach(row => {
        if (row.style.display !== 'none') {
            const cells = row.querySelectorAll('td');
            const data = [
                cells[2]?.querySelector('.user-name')?.textContent || '',
                cells[3]?.querySelector('.user-name')?.textContent || '',
                cells[4]?.textContent || '',
                cells[5]?.querySelector('.rating-text')?.textContent || '',
                cells[6]?.textContent || '',
                cells[7]?.textContent || '',
                cells[8]?.querySelector('.status-badge')?.textContent || ''
            ];
            csv += data.map(cell => `"${cell}"`).join(',') + '\n';
        }
    });

    // 다운로드
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ratings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showNotification('별점 데이터가 내보내기 되었습니다.');
}

function saveRating() {
    // 실제 구현에서는 API 호출로 저장
    const adminMemo = document.getElementById('adminMemo').value;
    console.log('관리자 메모 저장:', adminMemo);

    closeModal();
    showNotification('저장되었습니다.');
}

function openModal() {
    const modal = document.getElementById('ratingModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('ratingModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function showNotification(message) {
    // 알림 생성
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // 3초 후 자동 제거
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 알림 애니메이션
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);