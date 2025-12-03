// 프로젝트 매칭 시스템 JavaScript
let projects = [];
let currentProjectId = null;

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadSidebar();
    loadProjects();
    initializeEventListeners();
});

// 사이드바 로드
async function loadSidebar() {
    try {
        const response = await fetch('admin-sidebar.html');
        const sidebarContent = await response.text();
        const sidebar = document.querySelector('.sidebar');

        // style 태그 내용 제거하고 HTML만 삽입
        const htmlContent = sidebarContent.replace(/<style>[\s\S]*?<\/style>/g, '');
        sidebar.innerHTML = htmlContent;

        // 현재 페이지 메뉴 활성화
        setActiveMenuItem();
    } catch (error) {
        console.error('사이드바 로드 실패:', error);
    }
}

// 프로젝트 목록 로드
function loadProjects() {
    // 실제로는 API 호출로 데이터 가져오기
    projects = [
        {
            id: 'PRJ-2024-0847',
            title: '전자상거래 웹사이트 개발',
            description: 'React 기반 전자상거래 플랫폼 개발. 결제 시스템 연동, 상품 관리, 장바구니 기능 구현.',
            category: 'IT01',
            status: 'matching',
            priority: 'high',
            budget: { min: 300, max: 500 },
            duration: '3개월',
            location: '서울',
            created: '2024-11-28',
            deadline: '2024-12-05',
            client: '(주)테크솔루션',
            applicants: 12,
            compatibility: 85,
            estimatedCompletion: '2일 후',
            skills: ['React', 'Node.js', 'MongoDB', 'AWS']
        },
        {
            id: 'PRJ-2024-0846',
            title: '모바일 앱 UI/UX 디자인',
            description: '헬스케어 모바일 앱 전체 UI/UX 디자인. 사용자 경험 중심의 직관적인 인터페이스 설계.',
            category: 'DS05',
            status: 'open',
            priority: 'medium',
            budget: { min: 150, max: 250 },
            duration: '6주',
            location: '원격 가능',
            created: '2024-11-30',
            deadline: '2024-12-07',
            client: '메디케어',
            applicants: 5,
            compatibility: 72,
            estimatedCompletion: '5일 후',
            skills: ['Figma', 'Adobe XD', 'Prototyping']
        }
    ];

    renderProjects();
}

// 이벤트 리스너 초기화
function initializeEventListeners() {
    // 필터 변경 시
    document.getElementById('statusFilter')?.addEventListener('change', filterProjects);
    document.getElementById('categoryFilter')?.addEventListener('change', filterProjects);
    document.getElementById('projectSearch')?.addEventListener('input', filterProjects);

    // 기간 선택 버튼
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadTrendData(this.dataset.period);
        });
    });
}

// 프로젝트 목록 렌더링
function renderProjects(filteredProjects = projects) {
    const projectList = document.getElementById('projectList');
    if (!projectList) return;

    projectList.innerHTML = filteredProjects.map(project => `
        <div class="project-item ${getPriorityClass(project.priority)}">
            <div class="project-header">
                <div class="project-title">
                    <h3>${project.title}</h3>
                    <span class="project-id">#${project.id}</span>
                </div>
                <div class="project-status">
                    <span class="status-badge ${project.status}">${getStatusText(project.status)}</span>
                    <span class="priority-badge ${project.priority}">${getPriorityText(project.priority)}</span>
                </div>
            </div>
            <div class="project-content">
                <div class="project-info">
                    <div class="project-description">
                        <p>${project.description}</p>
                    </div>
                    <div class="project-requirements">
                        <div class="requirement-group">
                            <h4>기술 스택</h4>
                            <div class="skill-tags">
                                ${project.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                        <div class="requirement-group">
                            <h4>예산</h4>
                            <span class="budget-tag">${project.budget.min}-${project.budget.max}만원</span>
                        </div>
                        <div class="requirement-group">
                            <h4>기간</h4>
                            <span class="duration-tag">${project.duration}</span>
                        </div>
                        <div class="requirement-group">
                            <h4>위치</h4>
                            <span class="location-tag">${project.location}</span>
                        </div>
                    </div>
                </div>
                <div class="project-matching">
                    <div class="matching-progress">
                        <div class="progress-item">
                            <span class="label">지원자</span>
                            <span class="value">${project.applicants}명</span>
                        </div>
                        <div class="progress-item">
                            <span class="label">적합도</span>
                            <div class="compatibility-bar">
                                <div class="bar-fill ${getCompatibilityClass(project.compatibility)}" style="width: ${project.compatibility}%"></div>
                                <span class="bar-value">${project.compatibility}%</span>
                            </div>
                        </div>
                        <div class="progress-item">
                            <span class="label">예상 완료</span>
                            <span class="value">${project.estimatedCompletion}</span>
                        </div>
                    </div>
                    <div class="matching-actions">
                        <button class="btn btn-sm btn-primary" onclick="viewProjectDetails('${project.id}')">
                            <i class="fas fa-eye"></i> 상세
                        </button>
                        <button class="btn btn-sm btn-success" onclick="viewCandidates('${project.id}')">
                            <i class="fas fa-users"></i> 지원자
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="editProject('${project.id}')">
                            <i class="fas fa-edit"></i> 수정
                        </button>
                    </div>
                </div>
            </div>
            <div class="project-meta">
                <span class="created-date">생성: ${project.created}</span>
                <span class="deadline">마감: ${project.deadline}</span>
                <span class="client">의뢰인: ${project.client}</span>
            </div>
        </div>
    `).join('');

    updatePagination(filteredProjects.length);
}

// 프로젝트 필터링
function filterProjects() {
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const searchTerm = document.getElementById('projectSearch')?.value.toLowerCase() || '';

    const filteredProjects = projects.filter(project => {
        const statusMatch = !statusFilter || project.status === statusFilter;
        const categoryMatch = !categoryFilter || project.category === categoryFilter;
        const searchMatch = !searchTerm ||
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm);

        return statusMatch && categoryMatch && searchMatch;
    });

    renderProjects(filteredProjects);
}

// 프로젝트 상세 보기
function viewProjectDetails(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    currentProjectId = projectId;

    const modal = document.getElementById('projectModal');
    const detailContent = document.getElementById('projectDetail');

    detailContent.innerHTML = `
        <div class="detail-grid">
            <div class="detail-section">
                <h4>기본 정보</h4>
                <div class="detail-item">
                    <label>프로젝트 ID</label>
                    <span>#${project.id}</span>
                </div>
                <div class="detail-item">
                    <label>제목</label>
                    <span>${project.title}</span>
                </div>
                <div class="detail-item">
                    <label>상태</label>
                    <span class="status-badge ${project.status}">${getStatusText(project.status)}</span>
                </div>
                <div class="detail-item">
                    <label>우선순위</label>
                    <span class="priority-badge ${project.priority}">${getPriorityText(project.priority)}</span>
                </div>
            </div>

            <div class="detail-section">
                <h4>프로젝트 설명</h4>
                <p>${project.description}</p>
            </div>

            <div class="detail-section">
                <h4>기술 요구사항</h4>
                <div class="skill-tags">
                    ${project.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>

            <div class="detail-section">
                <h4>조건 정보</h4>
                <div class="condition-grid">
                    <div class="condition-item">
                        <label>예산</label>
                        <span>${project.budget.min}-${project.budget.max}만원</span>
                    </div>
                    <div class="condition-item">
                        <label>기간</label>
                        <span>${project.duration}</span>
                    </div>
                    <div class="condition-item">
                        <label>위치</label>
                        <span>${project.location}</span>
                    </div>
                    <div class="condition-item">
                        <label>마감일</label>
                        <span>${project.deadline}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4>매칭 정보</h4>
                <div class="matching-stats">
                    <div class="stat-item">
                        <span class="stat-label">지원자 수</span>
                        <span class="stat-value">${project.applicants}명</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">평균 적합도</span>
                        <span class="stat-value">${project.compatibility}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">예상 완료</span>
                        <span class="stat-value">${project.estimatedCompletion}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

// 지원자 목록 보기
function viewCandidates(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    currentProjectId = projectId;

    const modal = document.getElementById('candidatesModal');
    const candidatesList = document.getElementById('candidatesList');

    // 실제로는 API 호출로 지원자 데이터 가져오기
    const mockCandidates = [
        {
            id: 'CAND-001',
            name: '김현우',
            avatar: 'KH',
            skills: ['React', 'Node.js', 'MongoDB'],
            experience: '5년',
            rating: 4.8,
            score: 92,
            projects: 23
        },
        {
            id: 'CAND-002',
            name: '이서진',
            avatar: 'LS',
            skills: ['React', 'TypeScript', 'AWS'],
            experience: '3년',
            rating: 4.6,
            score: 87,
            projects: 15
        },
        {
            id: 'CAND-003',
            name: '박지민',
            avatar: 'PJ',
            skills: ['React', 'Redux', 'GraphQL'],
            experience: '4년',
            rating: 4.7,
            score: 89,
            projects: 18
        }
    ];

    candidatesList.innerHTML = mockCandidates.map(candidate => `
        <div class="candidate-item">
            <div class="candidate-avatar">${candidate.avatar}</div>
            <div class="candidate-info">
                <h4>${candidate.name}</h4>
                <div class="candidate-skills">
                    ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="candidate-meta">
                    <span><i class="fas fa-briefcase"></i> ${candidate.experience}</span>
                    <span><i class="fas fa-star"></i> ${candidate.rating}</span>
                    <span><i class="fas fa-project-diagram"></i> ${candidate.projects}개 프로젝트</span>
                </div>
            </div>
            <div class="candidate-score">
                <div class="score-circle">${candidate.score}</div>
                <div class="score-label">적합도</div>
                <button class="btn btn-sm btn-primary" onclick="selectCandidate('${candidate.id}')">
                    선택
                </button>
            </div>
        </div>
    `).join('');

    modal.style.display = 'flex';
}

// 프로젝트 생성
function createProject() {
    // 프로젝트 생성 모달 또는 페이지 이동
    alert('프로젝트 생성 기능 - 구현 예정');
}

// 프로젝트 수정
function editProject(projectId) {
    viewProjectDetails(projectId);
    // 수정 모드로 전환
}

// 데이터 새로고침
function refreshProjects() {
    loadProjects();
    showNotification('프로젝트 데이터가 새로고침되었습니다.');
}

// 트렌드 데이터 로드
function loadTrendData(period) {
    console.log(`${period} 기간 트렌드 데이터 로드 - 구현 예정`);
}

// 지원자 선택
function selectCandidate(candidateId) {
    console.log(`지원자 ${candidateId} 선택`);
}

// 최종 매칭 확정
function confirmProjectMatching() {
    if (!currentProjectId) return;

    const project = projects.find(p => p.id === currentProjectId);
    if (project) {
        project.status = 'completed';
        renderProjects();
        closeCandidatesModal();
        showNotification(`${project.title} 매칭이 완료되었습니다.`);
    }
}

// 모달 닫기
function closeProjectModal() {
    document.getElementById('projectModal').style.display = 'none';
    currentProjectId = null;
}

function closeCandidatesModal() {
    document.getElementById('candidatesModal').style.display = 'none';
    currentProjectId = null;
}

// 변경사항 저장
function saveProjectChanges() {
    if (!currentProjectId) return;

    showNotification('프로젝트 정보가 저장되었습니다.');
    closeProjectModal();
}

// 도우미 함수
function getPriorityClass(priority) {
    return `${priority}-priority`;
}

function getCompatibilityClass(score) {
    if (score >= 80) return '';
    if (score >= 60) return 'medium';
    return 'low';
}

function getStatusText(status) {
    const statusMap = {
        'open': '모집 중',
        'matching': '매칭 중',
        'in_progress': '진행 중',
        'completed': '완료',
        'cancelled': '취소'
    };
    return statusMap[status] || status;
}

function getPriorityText(priority) {
    const priorityMap = {
        'urgent': '긴급',
        'high': '높음',
        'medium': '보통',
        'low': '낮음'
    };
    return priorityMap[priority] || priority;
}

function updatePagination(totalItems) {
    // 페이징 업데이트 로직
}

function showNotification(message) {
    // 알림 표시 로직
    console.log(message);
}

// 윈도우 외부 클릭 시 모달 닫기
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        currentProjectId = null;
    }
}