// 매칭 관리 대시보드 JavaScript

// 스킬 분류코드 데이터 (skill-manage.js에서 import)
const categoryData = {
    'IT': { name: 'IT/개발', subcategories: [
        { code: 'IT01', name: '웹 개발', english: 'Web Development' },
        { code: 'IT02', name: '앱 개발', english: 'App Development' },
        { code: 'IT03', name: 'AI/머신러닝', english: 'AI & Machine Learning' },
        { code: 'IT04', name: '데이터 분석', english: 'Data Analytics' },
        { code: 'IT05', name: '보안/인증', english: 'Security & Compliance' },
        { code: 'IT06', name: '클라우드/인프라', english: 'Cloud & Infrastructure' },
        { code: 'IT07', name: '게임 개발', english: 'Game Development' },
        { code: 'IT08', name: '블록체인/Web3', english: 'Blockchain & Web3' }
    ]},
    'DS': { name: '디자인/크리에이티브', subcategories: [
        { code: 'DS05', name: 'UI/UX 디자인', english: 'UI/UX Design' },
        { code: 'DS01', name: '영상 편집', english: 'Video Editing' },
        { code: 'DS03', name: '그래픽 디자인', english: 'Graphic Design' }
    ]},
    'MK': { name: '마케팅/홍보', subcategories: [
        { code: 'MK02', name: 'SNS 마케팅', english: 'SNS Marketing' },
        { code: 'MK01', name: '퍼포먼스 마케팅', english: 'Performance Marketing' }
    ]},
    'WR': { name: '글쓰기/번역', subcategories: [
        { code: 'WR03', name: '번역/통역', english: 'Translation' },
        { code: 'WR02', name: '콘텐츠 글쓰기', english: 'Content Writing' }
    ]}
};

// 매칭 요청 데이터 (mock)
const matchingRequests = [
    {
        id: 'REQ-2024-1284',
        client: '김민준',
        avatar: 'K',
        title: 'React 개발자 긴급 매칭',
        priority: 'urgent',
        category: 'IT01',
        location: '서울 강남구',
        budget: '50-80만원',
        skills: ['React', 'JavaScript', 'TypeScript'],
        experience: 3,
        status: 'matching',
        matchingScore: 95,
        candidatesCount: 3,
        timeAgo: '5분 전'
    },
    {
        id: 'REQ-2024-1283',
        client: '이서연',
        avatar: 'L',
        title: 'UI/UX 디자이너 매칭',
        priority: 'high',
        category: 'DS05',
        location: '경기 성남시',
        budget: '30-50만원',
        skills: ['Figma', 'Adobe XD', 'Sketch'],
        experience: 2,
        status: 'pending',
        matchingScore: 78,
        candidatesCount: 5,
        timeAgo: '15분 전'
    }
];

// 전문가 후보자 데이터 (mock)
const expertCandidates = [
    {
        id: 'EXP-001',
        name: '박지훈',
        avatar: 'P',
        skills: ['React', 'TypeScript', 'Node.js'],
        level: 4.5,
        experience: 5,
        location: '서울 강남구',
        hourlyRate: 8,
        rating: 4.8,
        projects: 127,
        verificationStatus: 'verified',
        availability: 'immediate',
        responseTime: '1시간 내'
    },
    {
        id: 'EXP-002',
        name: '최수빈',
        avatar: 'C',
        skills: ['React', 'JavaScript', 'CSS'],
        level: 4.2,
        experience: 4,
        location: '서울 서초구',
        hourlyRate: 7,
        rating: 4.6,
        projects: 89,
        verificationStatus: 'verified',
        availability: 'tomorrow',
        responseTime: '3시간 내'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    initializeMatchingDashboard();
});

function initializeMatchingDashboard() {
    loadMatchingData();
    setupEventListeners();
    initializeCharts();
}

function setupEventListeners() {
    // 필터링 이벤트
    document.getElementById('statusFilter')?.addEventListener('change', filterMatchingRequests);
    document.getElementById('priorityFilter')?.addEventListener('change', filterMatchingRequests);

    // 기간 선택 이벤트
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectPeriod(this);
        });
    });
}

function loadMatchingData() {
    renderMatchingRequests(matchingRequests);
    updateStatistics();
    renderPopularCategories();
}

function renderMatchingRequests(requests) {
    const container = document.getElementById('matchingList');
    if (!container) return;

    container.innerHTML = '';

    requests.forEach(request => {
        const requestElement = createMatchingRequestElement(request);
        container.appendChild(requestElement);
    });
}

function createMatchingRequestElement(request) {
    const div = document.createElement('div');
    div.className = `matching-item ${request.priority}`;
    div.innerHTML = `
        <div class="matching-header">
            <span class="request-id">#${request.id}</span>
            <span class="priority-badge ${request.priority}">${getPriorityText(request.priority)}</span>
            <span class="time-ago">${request.timeAgo}</span>
        </div>
        <div class="matching-content">
            <div class="client-info">
                <div class="client-avatar">${request.avatar}</div>
                <div class="client-details">
                    <h4>${request.client}</h4>
                    <p class="request-title">${request.title}</p>
                    <div class="requirements">
                        <span class="skill-tag">${getCategoryName(request.category)}</span>
                        <span class="location-tag">${request.location}</span>
                        <span class="budget-tag">${request.budget}</span>
                    </div>
                </div>
            </div>
            <div class="matching-info">
                <div class="matching-score">
                    <span class="score-label">매칭 점수</span>
                    <span class="score-value ${getScoreClass(request.matchingScore)}">${request.matchingScore}%</span>
                </div>
                <div class="candidates-count">
                    <span class="count-label">후보</span>
                    <span class="count-value">${request.candidatesCount}명</span>
                </div>
                <div class="status-info">
                    <span class="status-badge ${request.status}">${getStatusText(request.status)}</span>
                </div>
            </div>
            <div class="matching-actions">
                <button class="btn btn-sm btn-primary" onclick="viewMatchingDetails('${request.id}')">
                    <i class="fas fa-eye"></i> 상세
                </button>
                <button class="btn btn-sm btn-success" onclick="showCandidates('${request.id}')">
                    <i class="fas fa-users"></i> 후보 보기
                </button>
                <button class="btn btn-sm btn-warning" onclick="manuallyMatch('${request.id}')">
                    <i class="fas fa-hand-pointer"></i> 수동 매칭
                </button>
            </div>
        </div>
    `;
    return div;
}

function calculateMatchingScore(requestSkills, candidateSkills) {
    let totalScore = 0;
    let maxScore = 0;

    requestSkills.forEach(reqSkill => {
        maxScore += 100;

        const exactMatch = candidateSkills.find(candSkill =>
            candSkill.toLowerCase() === reqSkill.toLowerCase());

        if (exactMatch) {
            totalScore += 100; // 정확히 일치
        } else {
            // 관련 스킬 체크
            const relatedScore = checkRelatedSkills(reqSkill, candidateSkills);
            totalScore += relatedScore;
        }
    });

    return Math.round((totalScore / maxScore) * 100);
}

function checkRelatedSkills(requiredSkill, candidateSkills) {
    const relatedSkills = {
        'react': ['javascript', 'typescript', 'html', 'css', 'node.js'],
        'javascript': ['react', 'vue', 'angular', 'typescript', 'node.js'],
        'typescript': ['javascript', 'react', 'angular', 'node.js'],
        'figma': ['sketch', 'adobe xd', 'ui design', 'ux design', 'prototyping'],
        'python': ['django', 'flask', 'data analysis', 'machine learning', 'ai'],
        'node.js': ['javascript', 'express', 'mongodb', 'react', 'vue']
    };

    const related = relatedSkills[requiredSkill.toLowerCase()] || [];
    let score = 0;

    candidateSkills.forEach(skill => {
        if (related.some(relatedSkill =>
            skill.toLowerCase() === relatedSkill.toLowerCase())) {
            score += 60; // 관련 스킬 점수
        }
    });

    return Math.min(score, 60); // 최대 60점
}

function calculateTrustScore(expert) {
    const weights = {
        verification: 0.3,
        rating: 0.25,
        completion: 0.2,
        response: 0.15,
        experience: 0.1
    };

    const scores = {
        verification: expert.verificationStatus === 'verified' ? 100 : 50,
        rating: (expert.rating / 5) * 100, // 5점 만점
        completion: (expert.projects / Math.max(expert.projects, 1)) * 100,
        response: getResponseTimeScore(expert.responseTime),
        experience: Math.min((expert.experience / 10) * 100, 100) // 10년 기준
    };

    let totalScore = 0;
    for (const [key, weight] of Object.entries(weights)) {
        totalScore += scores[key] * weight;
    }

    return Math.round(totalScore);
}

function getResponseTimeScore(responseTime) {
    if (responseTime === 'immediate') return 100;
    if (responseTime === '1시간 내') return 90;
    if (responseTime === '3시간 내') return 75;
    if (responseTime === '24시간 내') return 60;
    return 40;
}

function updateStatistics() {
    const stats = {
        total: matchingRequests.length,
        completed: matchingRequests.filter(r => r.status === 'completed').length,
        pending: matchingRequests.filter(r => r.status === 'pending').length,
        matching: matchingRequests.filter(r => r.status === 'matching').length,
        urgent: matchingRequests.filter(r => r.priority === 'urgent').length,
        cancelled: matchingRequests.filter(r => r.status === 'cancelled').length
    };

    // 통계 카드 업데이트 (실제 구현에서는 DOM 요소 업데이트)
    console.log('매칭 통계:', stats);
}

function renderPopularCategories() {
    const categoryCount = {};

    matchingRequests.forEach(request => {
        const mainCategory = request.category.substring(0, 2);
        categoryCount[mainCategory] = (categoryCount[mainCategory] || 0) + 1;
    });

    const categories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

    const container = document.querySelector('.category-stats');
    if (!container) return;

    container.innerHTML = '';
    categories.forEach(([code, count]) => {
        const category = categoryData[code];
        if (category) {
            const percentage = Math.round((count / matchingRequests.length) * 100);
            const element = createCategoryStatElement(category.name, count, percentage);
            container.appendChild(element);
        }
    });
}

function createCategoryStatElement(name, count, percentage) {
    const div = document.createElement('div');
    div.className = 'category-stat';
    div.innerHTML = `
        <span class="category-icon">🎯</span>
        <div class="category-info">
            <span class="category-name">${name}</span>
            <span class="category-count">${count}건</span>
            <span class="category-percentage">${percentage}%</span>
        </div>
    `;
    return div;
}

function viewMatchingDetails(requestId) {
    const request = matchingRequests.find(r => r.id === requestId);
    if (!request) return;

    const modal = document.getElementById('matchingModal');
    const title = document.getElementById('modalTitle');

    if (title) title.textContent = `매칭 상세 정보: ${requestId}`;

    // 모달 내용 업데이트
    updateModalContent(request);

    if (modal) modal.classList.add('show');
}

function showCandidates(requestId) {
    const request = matchingRequests.find(r => r.id === requestId);
    if (!request) return;

    const modal = document.getElementById('candidatesModal');
    const candidatesList = document.getElementById('candidatesList');

    if (candidatesList) {
        candidatesList.innerHTML = '';
        expertCandidates.forEach(expert => {
            const score = calculateMatchingScore(request.skills, expert.skills);
            const candidateElement = createCandidateElement(expert, score);
            candidatesList.appendChild(candidateElement);
        });
    }

    if (modal) modal.classList.add('show');
}

function createCandidateElement(expert, matchingScore) {
    const div = document.createElement('div');
    div.className = 'candidate-item';
    div.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <div class="client-avatar">${expert.avatar}</div>
            <div style="flex: 1;">
                <h4 style="margin: 0 0 5px 0;">${expert.name}</h4>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 5px;">
                    ${expert.skills.map(skill =>
                        `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9rem; color: var(--text-muted);">
                    <span><i class="fas fa-star"></i> ${expert.rating}/5.0</span>
                    <span><i class="fas fa-briefcase"></i> ${expert.experience}년 경력</span>
                    <span><i class="fas fa-clock"></i> ${expert.responseTime}</span>
                    <span><i class="fas fa-won-sign"></i> ${expert.hourlyRate}만원/시간</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <div>
                        <span class="score-label">매칭 점수: </span>
                        <span class="score-value ${getScoreClass(matchingScore)}">${matchingScore}%</span>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="selectCandidate('${expert.id}')">
                        <i class="fas fa-check"></i> 선택
                    </button>
                </div>
            </div>
        </div>
    `;
    return div;
}

function manuallyMatch(requestId) {
    const request = matchingRequests.find(r => r.id === requestId);
    if (!request) return;

    if (confirm(`${requestId} 요청에 대해 수동 매칭을 진행하시겠습니까?`)) {
        showNotification('수동 매칭이 시작되었습니다.');
        // 실제 구현에서는 매칭 프로세스 시작
        console.log('수동 매칭 시작:', requestId);
    }
}

function selectCandidate(expertId) {
    const expert = expertCandidates.find(e => e.id === expertId);
    if (!expert) return;

    if (confirm(`${expert.name} 전문가를 선택하시겠습니까?`)) {
        showNotification(`${expert.name} 전문가가 선택되었습니다.`);
        closeCandidatesModal();
    }
}

function confirmMatching() {
    showNotification('매칭이 확정되었습니다.');
    closeCandidatesModal();
    closeMatchingModal();
}

function filterMatchingRequests() {
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const priorityFilter = document.getElementById('priorityFilter')?.value || '';

    const filteredRequests = matchingRequests.filter(request => {
        const matchesStatus = !statusFilter || request.status === statusFilter;
        const matchesPriority = !priorityFilter || request.priority === priorityFilter;
        return matchesStatus && matchesPriority;
    });

    renderMatchingRequests(filteredRequests);
}

function selectPeriod(button) {
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');

    const period = button.dataset.period;
    updateTrendChart(period);
}

function updateTrendChart(period) {
    // 실제 구현에서는 Chart.js로 차트 업데이트
    console.log(`${period} 기간 매칭 트렌드 업데이트`);
}

function initializeCharts() {
    drawTrendChart();
}

function drawTrendChart() {
    const chartContainer = document.querySelector('.chart-placeholder');
    if (chartContainer) {
        // 실제 구현에서는 Chart.js로 데이터 시각화
        console.log('매칭 트렌드 차트 그리기');
    }
}

function openMatchingAlgorithm() {
    showNotification('매칭 알고리즘 설정을 엽니다.');
    // 매칭 설정 페이지로 이동
}

function refreshMatchingData() {
    showNotification('매칭 데이터를 새로고칩니다.');
    loadMatchingData();
    initializeCharts();
}

function closeMatchingModal() {
    const modal = document.getElementById('matchingModal');
    if (modal) modal.classList.remove('show');
}

function closeCandidatesModal() {
    const modal = document.getElementById('candidatesModal');
    if (modal) modal.classList.remove('show');
}

function updateModalContent(request) {
    // 모달 내용 업데이트 로직
    console.log('모달 내용 업데이트:', request);
}

// 유틸리티 함수
function getPriorityText(priority) {
    const priorityMap = {
        'urgent': '긴급',
        'high': '높음',
        'normal': '보통',
        'low': '낮음'
    };
    return priorityMap[priority] || priority;
}

function getStatusText(status) {
    const statusMap = {
        'pending': '대기 중',
        'matching': '매칭 중',
        'completed': '완료',
        'cancelled': '취소됨'
    };
    return statusMap[status] || status;
}

function getScoreClass(score) {
    if (score >= 90) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
}

function getCategoryName(categoryCode) {
    for (const [mainCategory, data] of Object.entries(categoryData)) {
        const subcategory = data.subcategories.find(sub => sub.code === categoryCode);
        if (subcategory) {
            return `${subcategory.code} ${subcategory.name}`;
        }
    }
    return categoryName;
}

function showNotification(message) {
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

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}