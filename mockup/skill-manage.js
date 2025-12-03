// 스킬 관리 JavaScript

// 분류코드 데이터
const categoryData = {
    'IT': {
        name: 'IT/개발',
        subcategories: [
            { code: 'IT01', name: '웹 개발', english: 'Web Development' },
            { code: 'IT02', name: '앱 개발', english: 'App Development' },
            { code: 'IT03', name: 'AI/머신러닝', english: 'AI & Machine Learning' },
            { code: 'IT04', name: '데이터 분석', english: 'Data Analytics' },
            { code: 'IT05', name: '보안/인증', english: 'Security & Compliance' },
            { code: 'IT06', name: '클라우드/인프라', english: 'Cloud & Infrastructure' },
            { code: 'IT07', name: '게임 개발', english: 'Game Development' },
            { code: 'IT08', name: '블록체인/Web3', english: 'Blockchain & Web3' }
        ]
    },
    'DS': {
        name: '디자인/크리에이티브',
        subcategories: [
            { code: 'DS01', name: '영상 편집', english: 'Video Editing' },
            { code: 'DS02', name: '모션그래픽/3D', english: 'Motion & 3D' },
            { code: 'DS03', name: '그래픽 디자인', english: 'Graphic Design' },
            { code: 'DS04', name: '일러스트/캐릭터', english: 'Illustration' },
            { code: 'DS05', name: 'UI/UX 디자인', english: 'UI/UX Design' },
            { code: 'DS06', name: '제품/산업 디자인', english: 'Product Design' },
            { code: 'DS07', name: '사진/촬영', english: 'Photography' },
            { code: 'DS08', name: '음악/사운드', english: 'Music & Sound' }
        ]
    },
    'MK': {
        name: '마케팅/홍보',
        subcategories: [
            { code: 'MK01', name: '퍼포먼스 마케팅', english: 'Performance Marketing' },
            { code: 'MK02', name: 'SNS 마케팅', english: 'SNS Marketing' },
            { code: 'MK03', name: '콘텐츠 마케팅', english: 'Content Marketing' },
            { code: 'MK04', name: '브랜딩/CI', english: 'Branding & CI' },
            { code: 'MK05', name: 'PR/언론홍보', english: 'PR & Communications' },
            { code: 'MK06', name: '영업/세일즈', english: 'Sales' }
        ]
    },
    'WR': {
        name: '글쓰기/번역',
        subcategories: [
            { code: 'WR01', name: '카피라이팅', english: 'Copywriting' },
            { code: 'WR02', name: '콘텐츠 글쓰기', english: 'Content Writing' },
            { code: 'WR03', name: '번역/통역', english: 'Translation' },
            { code: 'WR04', name: '출판/교정', english: 'Publishing & Editing' }
        ]
    },
    'BZ': {
        name: '비즈니스/경영',
        subcategories: [
            { code: 'BZ01', name: '경영/전략 컨설팅', english: 'Strategy Consulting' },
            { code: 'BZ02', name: '창업/스타트업', english: 'Startup Consulting' },
            { code: 'BZ03', name: '재무/회계', english: 'Finance & Accounting' },
            { code: 'BZ04', name: '세무/기장', english: 'Tax & Bookkeeping' },
            { code: 'BZ05', name: '법률/계약', english: 'Legal & Contracts' },
            { code: 'BZ06', name: '특허/지식재산', english: 'Patent & IP' }
        ]
    },
    'HR': {
        name: 'HR/인사',
        subcategories: [
            { code: 'HR01', name: '채용/헤드헌팅', english: 'Recruiting' },
            { code: 'HR02', name: '인사제도/조직', english: 'HR Systems' },
            { code: 'HR03', name: '노무/급여', english: 'Labor & Payroll' },
            { code: 'HR04', name: '커리어 코칭', english: 'Career Coaching' }
        ]
    },
    'ED': {
        name: '교육/강의',
        subcategories: [
            { code: 'ED01', name: '기업교육/강의', english: 'Corporate Training' },
            { code: 'ED02', name: '외국어 교육', english: 'Language Education' },
            { code: 'ED03', name: '입시/학원', english: 'Academic Tutoring' },
            { code: 'ED04', name: '자격증/실무', english: 'Certification & Skills' }
        ]
    },
    'BD': {
        name: '건축/설계',
        subcategories: [
            { code: 'BD01', name: '건축 설계', english: 'Architecture' },
            { code: 'BD02', name: '토목/조경', english: 'Civil & Landscape' },
            { code: 'BD03', name: '도시/부동산', english: 'Urban & Real Estate' }
        ]
    },
    'IN': {
        name: '인테리어/시공',
        subcategories: [
            { code: 'IN01', name: '인테리어 디자인', english: 'Interior Design' },
            { code: 'IN02', name: '도배/바닥', english: 'Wallpaper & Flooring' },
            { code: 'IN03', name: '주방/욕실', english: 'Kitchen & Bathroom' },
            { code: 'IN04', name: '목공/가구', english: 'Carpentry & Furniture' }
        ]
    },
    'FC': {
        name: '설비/수리',
        subcategories: [
            { code: 'FC01', name: '전기/조명', english: 'Electrical & Lighting' },
            { code: 'FC02', name: '설비/배관', english: 'Plumbing & HVAC' },
            { code: 'FC03', name: '방수/단열', english: 'Waterproofing & Insulation' },
            { code: 'FC04', name: '철거/청소', english: 'Demolition & Cleaning' }
        ]
    },
    'SP': {
        name: '스포츠/피트니스',
        subcategories: [
            { code: 'SP01', name: '골프/라켓', english: 'Golf & Racket Sports' },
            { code: 'SP02', name: '피트니스/PT', english: 'Fitness & Personal Training' },
            { code: 'SP03', name: '요가/필라테스', english: 'Yoga & Pilates' },
            { code: 'SP04', name: '수영/아웃도어', english: 'Swimming & Outdoor' },
            { code: 'SP05', name: '댄스/무술', english: 'Dance & Martial Arts' }
        ]
    },
    'BT': {
        name: '뷰티/패션',
        subcategories: [
            { code: 'BT01', name: '메이크업/헤어', english: 'Makeup & Hair' },
            { code: 'BT02', name: '네일/속눈썹', english: 'Nail & Lash' },
            { code: 'BT03', name: '패션/스타일링', english: 'Fashion & Styling' }
        ]
    },
    'EV': {
        name: '행사/엔터테인먼트',
        subcategories: [
            { code: 'EV01', name: '웨딩/돌잔치', english: 'Wedding & Celebration' },
            { code: 'EV02', name: '행사/컨퍼런스', english: 'Events & Conference' },
            { code: 'EV03', name: 'MC/공연', english: 'MC & Performance' }
        ]
    },
    'LF': {
        name: '생활서비스',
        subcategories: [
            { code: 'LF01', name: '반려동물', english: 'Pet Services' },
            { code: 'LF02', name: '청소/정리', english: 'Cleaning & Organizing' },
            { code: 'LF03', name: '이사/운송', english: 'Moving & Delivery' },
            { code: 'LF04', name: '수리/설치', english: 'Repair & Installation' }
        ]
    },
    'PS': {
        name: '전문서비스',
        subcategories: [
            { code: 'PS01', name: '의료/헬스케어', english: 'Healthcare' },
            { code: 'PS02', name: '공학/제조', english: 'Engineering' },
            { code: 'PS03', name: '물류/무역', english: 'Logistics & Trade' },
            { code: 'PS04', name: '농업/식품', english: 'Agriculture & Food' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeSkillManagement();
});

function initializeSkillManagement() {
    // 이벤트 리스너 초기화
    setupEventListeners();

    // 대분류-중분류 초기화
    updateSubCategoryOptions();

    // 초기 데이터 로드
    loadSkillsData();

    // 차트 초기화
    initializeCharts();
}

function setupEventListeners() {
    // 스킬 검색 필터
    document.getElementById('skillSearchInput').addEventListener('input', filterSkills);
    document.getElementById('mainCategoryFilter').addEventListener('change', handleMainCategoryChange);
    document.getElementById('subCategoryFilter').addEventListener('change', filterSkills);
    document.getElementById('statusFilter').addEventListener('change', filterSkills);

    // 전체 선택 체크박스
    document.getElementById('selectAllSkills').addEventListener('change', function(e) {
        const checkboxes = document.querySelectorAll('#skillsTableBody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
        updateSelectedSkillsCount();
    });

    // 개별 체크박스
    document.querySelectorAll('#skillsTableBody input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedSkillsCount);
    });

    // 페이징 버튼
    document.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled && !this.textContent.includes('chevron')) {
                loadSkillsPage(this.textContent);
            }
        });
    });

    // 범위 슬라이더
    document.querySelectorAll('.range-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const valueSpan = this.nextElementSibling;
            valueSpan.textContent = this.value + '%';
        });
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSkillModal();
        }
    });
}

function handleMainCategoryChange() {
    updateSubCategoryOptions();
    filterSkills();
}

function updateSubCategoryOptions() {
    const mainCategoryFilter = document.getElementById('mainCategoryFilter');
    const subCategoryFilter = document.getElementById('subCategoryFilter');
    const selectedMainCategory = mainCategoryFilter.value;

    // 중분류 옵션 초기화
    subCategoryFilter.innerHTML = '<option value="">전체 중분류</option>';

    if (selectedMainCategory && categoryData[selectedMainCategory]) {
        const subcategories = categoryData[selectedMainCategory].subcategories;
        subcategories.forEach(subcat => {
            const option = document.createElement('option');
            option.value = subcat.code;
            option.textContent = `${subcat.code} ${subcat.name}`;
            subCategoryFilter.appendChild(option);
        });
    }
}

function switchTab(tabName, eventTarget) {
    // 탭 버튼 활성화 상태 변경
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    eventTarget.classList.add('active');

    // 탭 콘텐츠 표시/숨김
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.add('active');

    // 해당 탭 데이터 로드
    switch (tabName) {
        case 'overview':
            loadOverviewData();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'skills':
            loadSkillsList();
            break;
        case 'trends':
            loadTrendsData();
            break;
        case 'matching':
            loadMatchingSettings();
            break;
    }
}

function loadSkillsData() {
    // 초기 데이터 로드
    loadOverviewData();
    loadCategories();
    loadSkillsList();
}

function loadOverviewData() {
    // 실제 구현에서는 API 호출로 데이터 로드
    console.log('개요 데이터 로드');
}

function loadCategories() {
    // 실제 구현에서는 API 호출로 카테고리 데이터 로드
    console.log('카테고리 데이터 로드');
}

function loadSkillsList() {
    // 실제 구현에서는 API 호출로 스킬 목록 로드
    console.log('스킬 목록 로드');
}

function loadTrendsData() {
    // 실제 구현에서는 API 호출로 트렌드 데이터 로드
    console.log('트렌드 데이터 로드');
    drawTrendChart();
}

function loadMatchingSettings() {
    // 실제 구현에서는 API 호출로 매칭 설정 로드
    console.log('매칭 설정 로드');
}

function filterSkills() {
    const searchTerm = document.getElementById('skillSearchInput').value.toLowerCase();
    const mainCategoryFilter = document.getElementById('mainCategoryFilter').value;
    const subCategoryFilter = document.getElementById('subCategoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const rows = document.querySelectorAll('#skillsTableBody tr');

    rows.forEach(row => {
        const skillName = row.querySelector('.skill-name')?.textContent.toLowerCase() || '';
        const categoryTag = row.querySelector('.category-tag');
        const statusBadge = row.querySelector('.status-badge');

        // 카테고리 코드나 텍스트 가져오기
        let categoryCode = '';
        let categoryText = '';
        if (categoryTag) {
            categoryCode = categoryTag.getAttribute('data-category-code') || '';
            categoryText = categoryTag.textContent.toLowerCase() || '';
        }

        const statusText = statusBadge ? statusBadge.textContent.toLowerCase() : '';

        // 검색 필터
        const matchesSearch = skillName.includes(searchTerm);

        // 대분류 필터
        const matchesMainCategory = !mainCategoryFilter ||
            categoryCode.startsWith(mainCategoryFilter) ||
            getMainCategoryFromText(categoryText) === mainCategoryFilter;

        // 중분류 필터
        const matchesSubCategory = !subCategoryFilter || categoryCode === subCategoryFilter;

        // 상태 필터
        const matchesStatus = !statusFilter || statusText.includes(getStatusText(statusFilter));

        // 모든 필터에 맞는지 확인
        const shouldShow = matchesSearch && matchesMainCategory && matchesSubCategory && matchesStatus;

        row.style.display = shouldShow ? '' : 'none';
    });
}

function getMainCategoryFromText(categoryText) {
    // 텍스트에서 대분류 코드를 유추
    if (categoryText.includes('개발') || categoryText.includes('it') || categoryText.includes('프론트') || categoryText.includes('백엔드')) return 'IT';
    if (categoryText.includes('디자인') || categoryText.includes('ui') || categoryText.includes('ux') || categoryText.includes('그래픽')) return 'DS';
    if (categoryText.includes('마케팅') || categoryText.includes('sns') || categoryText.includes('광고')) return 'MK';
    if (categoryText.includes('번역') || categoryText.includes('글쓰기') || categoryText.includes('카피')) return 'WR';
    if (categoryText.includes('비즈니스') || categoryText.includes('경영') || categoryText.includes('재무')) return 'BZ';
    if (categoryText.includes('hr') || categoryText.includes('인사') || categoryText.includes('채용')) return 'HR';
    if (categoryText.includes('교육') || categoryText.includes('강의') || categoryText.includes('외국어')) return 'ED';
    if (categoryText.includes('건축') || categoryText.includes('설계') || categoryText.includes('토목')) return 'BD';
    if (categoryText.includes('인테리어') || categoryText.includes('시공') || categoryText.includes('도배')) return 'IN';
    if (categoryText.includes('설비') || categoryText.includes('수리') || categoryText.includes('전기')) return 'FC';
    if (categoryText.includes('스포츠') || categoryText.includes('피트니스') || categoryText.includes('골프')) return 'SP';
    if (categoryText.includes('뷰티') || categoryText.includes('패션') || categoryText.includes('메이크업')) return 'BT';
    if (categoryText.includes('행사') || categoryText.includes('웨딩') || categoryText.includes('mc')) return 'EV';
    if (categoryText.includes('생활') || categoryText.includes('청소') || categoryText.includes('반려')) return 'LF';
    if (categoryText.includes('의료') || categoryText.includes('공학') || categoryText.includes('물류')) return 'PS';

    return '';
}

function getStatusText(statusValue) {
    const statusMap = {
        'active': '활성',
        'inactive': '비활성'
    };
    return statusMap[statusValue] || '';
}

function updateSelectedSkillsCount() {
    const checkedBoxes = document.querySelectorAll('#skillsTableBody input[type="checkbox"]:checked');
    // 선택된 항목 수 표시 (필요한 경우)
    console.log(`선택된 스킬: ${checkedBoxes.length}개`);
}

function loadSkillsPage(page) {
    // 실제 구현에서는 페이지별 데이터 로드
    console.log(`스킬 페이지 ${page} 로드`);

    // 페이지 버튼 활성화 상태 업데이트
    document.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent == page) {
            btn.classList.add('active');
        }
    });
}

function addCategory() {
    // 카테고리 추가 로직
    const categoryName = prompt('추가할 카테고리명을 입력하세요:');
    if (categoryName) {
        console.log('카테고리 추가:', categoryName);
        showNotification('카테고리가 추가되었습니다.');
    }
}

function editCategory(id) {
    // 카테고리 수정 로직
    console.log('카테고리 수정 ID:', id);
    showNotification('카테고리 수정 기능은 준비 중입니다.');
}

function deleteCategory(id) {
    if (confirm('정말로 이 카테고리를 삭제하시겠습니까?\n관련 스킬도 함께 처리됩니다.')) {
        console.log('카테고리 삭제 ID:', id);
        showNotification('카테고리가 삭제되었습니다.');
    }
}

function addNewSkill() {
    // 새 스킬 추가 모달 열기
    openSkillModal('add');
}

function viewSkill(id) {
    // 스킬 상세 정보 조회
    const skillData = getSkillData(id);
    openSkillModal('view', skillData);
}

function editSkill(id) {
    // 스킬 수정
    const skillData = getSkillData(id);
    openSkillModal('edit', skillData);
}

function deleteSkill(id) {
    if (confirm('정말로 이 스킬을 삭제하시겠습니까?')) {
        // 실제 구현에서는 API 호출로 삭제
        console.log(`스킬 ID ${id} 삭제`);

        // 테이블에서 해당 행 제거
        const row = document.querySelector(`tr:has(button[onclick*="deleteSkill(${id})"])`);
        if (row) {
            row.remove();
        }

        showNotification('스킬이 삭제되었습니다.');
    }
}

function getSkillData(id) {
    // 실제 데이터 - API 호출로 대체
    const mockData = {
        1: {
            name: 'React',
            category: 'IT01',
            description: 'Facebook에서 개발한 UI 라이브러리',
            verificationRequired: true,
            certificationList: 'React Certification, JavaScript 기본',
            minExperience: 2,
            status: 'active'
        },
        2: {
            name: 'Python',
            category: 'IT01',
            description: '다목적 프로그래밍 언어',
            verificationRequired: false,
            certificationList: 'Python 입증 자격증',
            minExperience: 1,
            status: 'active'
        },
        3: {
            name: 'Figma',
            category: 'DS05',
            description: '웹기반 협업 디자인 툴',
            verificationRequired: false,
            certificationList: '',
            minExperience: 0,
            status: 'active'
        }
    };

    return mockData[id] || mockData[1];
}

function openSkillModal(mode, skillData = null) {
    const modal = document.getElementById('skillModal');
    const title = document.getElementById('skillModalTitle');

    // 모드에 따라 제목 설정
    switch (mode) {
        case 'add':
            title.textContent = '스킬 추가';
            break;
        case 'view':
            title.textContent = '스킬 상세 정보';
            break;
        case 'edit':
            title.textContent = '스킬 수정';
            break;
    }

    // 데이터가 있으면 폼에 채우기
    if (skillData) {
        document.getElementById('skillNameInput').value = skillData.name;
        document.getElementById('skillCategorySelect').value = skillData.category;
        document.getElementById('skillDescription').value = skillData.description;
        document.getElementById('verificationRequired').checked = skillData.verificationRequired;
        document.getElementById('certificationList').value = skillData.certificationList;
        document.getElementById('minExperience').value = skillData.minExperience;

        // 조회 모드에서는 입력 필드 비활성화
        const isReadOnly = mode === 'view';
        document.getElementById('skillNameInput').readOnly = isReadOnly;
        document.getElementById('skillCategorySelect').disabled = isReadOnly;
        document.getElementById('skillDescription').readOnly = isReadOnly;
        document.getElementById('verificationRequired').disabled = isReadOnly;
        document.getElementById('certificationList').readOnly = isReadOnly;
        document.getElementById('minExperience').readOnly = isReadOnly;
    } else {
        // 폼 초기화
        document.getElementById('skillNameInput').value = '';
        document.getElementById('skillCategorySelect').value = '';
        document.getElementById('skillDescription').value = '';
        document.getElementById('verificationRequired').checked = false;
        document.getElementById('certificationList').value = '';
        document.getElementById('minExperience').value = '';

        // 입력 필드 활성화
        document.getElementById('skillNameInput').readOnly = false;
        document.getElementById('skillCategorySelect').disabled = false;
        document.getElementById('skillDescription').readOnly = false;
        document.getElementById('verificationRequired').disabled = false;
        document.getElementById('certificationList').readOnly = false;
        document.getElementById('minExperience').readOnly = false;
    }

    // 모달 열기
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSkillModal() {
    const modal = document.getElementById('skillModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function saveSkill() {
    // 스킬 정보 저장
    const skillData = {
        name: document.getElementById('skillNameInput').value,
        category: document.getElementById('skillCategorySelect').value,
        description: document.getElementById('skillDescription').value,
        verificationRequired: document.getElementById('verificationRequired').checked,
        certificationList: document.getElementById('certificationList').value,
        minExperience: document.getElementById('minExperience').value
    };

    // 필수 필드 검증
    if (!skillData.name || !skillData.category || !skillData.description) {
        alert('필수 정보를 모두 입력해주세요.');
        return;
    }

    // 실제 구현에서는 API 호출로 저장
    console.log('스킬 저장:', skillData);

    closeSkillModal();
    showNotification('스킬이 저장되었습니다.');

    // 스킬 목록 새로고침
    loadSkillsList();
}

function exportSkills() {
    // 스킬 데이터 내보내기
    console.log('스킬 데이터 내보내기');

    // 간단한 CSV 생성 예시
    let csv = '스킬명,카테고리,보유사용자,숙련도,인증여부,수요지수,상태\n';

    document.querySelectorAll('#skillsTableBody tr').forEach(row => {
        if (row.style.display !== 'none') {
            const cells = row.querySelectorAll('td');
            const data = [
                cells[2]?.querySelector('.skill-name')?.textContent.trim() || '',
                cells[3]?.querySelector('.category-tag')?.textContent || '',
                cells[4]?.textContent || '',
                cells[5]?.querySelector('.level-text')?.textContent || '',
                cells[6]?.querySelector('.verification-badge')?.textContent || '',
                cells[7]?.querySelector('.demand-index')?.textContent || '',
                cells[8]?.querySelector('.status-badge')?.textContent || ''
            ];
            csv += data.map(cell => `"${cell}"`).join(',') + '\n';
        }
    });

    // 다운로드
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `skills_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showNotification('스킬 데이터가 내보내기 되었습니다.');
}

function initializeCharts() {
    // 차트 초기화
    console.log('차트 초기화');
}

function drawTrendChart() {
    // 트렌드 차트 그리기 (실제 구현에서는 Chart.js 등 라이브러리 사용)
    const chartContainer = document.querySelector('.trend-chart');
    if (chartContainer) {
        chartContainer.innerHTML = `
            <canvas id="trendChartCanvas"></canvas>
            <div class="chart-placeholder">
                <i class="fas fa-chart-line" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <p>수요 동향 차트</p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">실제 구현에서는 Chart.js로 데이터 시각화</p>
            </div>
        `;
    }
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
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 알림 애니메이션 스타일 추가
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
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

    .chart-placeholder {
        text-align: center;
        color: var(--text-muted);
    }
`;
document.head.appendChild(notificationStyle);