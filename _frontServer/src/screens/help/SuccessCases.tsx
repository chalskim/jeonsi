import React from 'react'
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons'

type Story = {
  id: string
  title: string
  meta: { label: string; value: string }[]
  paragraphs: string[]
  bullets: string[]
  resultLabel: string
  resultText: string
}

const stories: Story[] = [
  {
    id: '1',
    title: '1. 스타트업을 위한 파트타임 CMO',
    meta: [
      { label: '전문가', value: '김민수 (34세, 중견 IT기업 PM 출신 마케터)' },
      { label: '고객사', value: '시드 단계 테크 스타트업 (직원 7명)' },
      { label: '활용 방식', value: '주 5시간, 월 100만 원' }
    ],
    paragraphs: [
      '초기 스타트업의 가장 큰 고민은 “무엇을, 누구에게, 어떻게 팔 것인가”였습니다. 테크 역량은 충분했지만, 마케팅은 ‘감’으로만 하던 상황이었죠. 전시를 통해 합류한 김민수 CMO는 시장·경쟁사·고객 인터뷰에 집중하며 체계적인 마케팅 시스템을 구축했습니다.'
    ],
    bullets: [
      '타겟 고객 세분화 및 핵심 가치 제안 정의',
      '채널 전략 정립 (검색광고, 콘텐츠 마케팅 등)',
      '획득–활성–유지 퍼널 설계'
    ],
    resultLabel: '🚀 성과',
    resultText: '고객 획득 비용(CAC) 40% 감소, 월간 활성 사용자 수(MAU) 200% 증가. 6개월 후, 대표는 김민수에게 정규직 CMO 전환을 제안했습니다.'
  },
  {
    id: '2',
    title: '2. 퇴직 재무 전문가의 월간 자문',
    meta: [
      { label: '전문가', value: '이영희 (52세, 대기업 재무팀 출신)' },
      { label: '고객사', value: '성장기 스타트업 (직원 25명)' },
      { label: '활용 방식', value: '월 4회 자문, 월 150만 원' }
    ],
    paragraphs: [
      '매출은 오르지만 통장 잔고는 늘 빠듯했던 성장기 스타트업. 대표와 팀리더들은 ‘감’으로 재무를 관리하고 있었습니다. 전시에 합류한 이영희 전문가는 매달 4회, 딱 필요한 만큼만 시간을 쓰며 재무의 뼈대를 세워주었습니다.'
    ],
    bullets: [
      '스타트업 눈높이에 맞춘 손익계산서·현금흐름표 재구성',
      '3년치 재무 시뮬레이션 모델 구축',
      '투자자 미팅용 피치덱 재무 파트 직접 코칭'
    ],
    resultLabel: '🚀 성과',
    resultText: '시리즈 A 투자 유치 30억 원 성공. 이후 월 2회 회계 자문을 추가하여 재무 건전성을 유지하고, 1년 계약 후 주저 없이 재계약을 선택했습니다.'
  },
  {
    id: '3',
    title: '3. 풀타임 프리랜서 마케터의 다중 계약',
    meta: [
      { label: '전문가', value: '박유진 (29세, 브랜드 마케터)' },
      { label: '고객사', value: 'D2C 패션 브랜드 2곳' },
      { label: '활용 방식', value: '각사 주 10시간, 월 200만 원 (총 월 400만 원)' }
    ],
    paragraphs: [
      '프리랜서 마케터 박유진은 단기 캠페인 위주의 프로젝트를 전전하며 수입 편차가 컸습니다. 전시에 가입한 뒤, 두 개의 D2C 패션 브랜드와 각각 리테이너 형태로 계약을 맺으며 안정적인 파트너십을 구축했습니다.'
    ],
    bullets: [
      '브랜드 톤앤매너 정리 및 콘텐츠 시리즈 기획',
      '시즌/캠페인 단위 룩북·촬영 기획 및 바이럴 전략 수립',
      '인플루언서 협업 구조 설계'
    ],
    resultLabel: '🚀 성과',
    resultText: '브랜드 인지도 150% 이상 상승, 온라인 매출 평균 80% 증가. 박유진 본인의 월 수입도 이전 대비 40% 상승하며 안정화되었습니다.'
  },
  {
    id: '4',
    title: '4. UI/UX 디자이너의 앱 개선 프로젝트',
    meta: [
      { label: '전문가', value: '최지혜 (31세, IT기업 UI/UX 디자이너)' },
      { label: '고객사', value: '핀테크 스타트업' },
      { label: '활용 방식', value: '주 8시간, 3개월 프로젝트' }
    ],
    paragraphs: [
      '핀테크 스타트업의 앱은 기능은 많았지만, 유저들이 “어디서 뭘 눌러야 할지 모르겠다”는 피드백이 계속 나왔습니다. 가입 후 첫 주 안에 절반 가까운 사용자가 이탈하는 문제가 있었습니다.'
    ],
    bullets: [
      '사용자 여정 맵(Journey Map) 제작 및 고객 인터뷰',
      '가입 플로우 축소 및 불필요한 입력 항목 제거',
      '핵심 기능을 홈 화면 상단에 재배치'
    ],
    resultLabel: '🚀 성과',
    resultText: '앱 이탈률 35% 감소, 앱스토어 평점 3.2점 → 4.5점으로 상승. 이 프로젝트를 계기로 2개의 신규 프로젝트를 추가로 수주하게 되었습니다.'
  },
  {
    id: '5',
    title: '5. 콘텐츠 전문가의 브랜드 스토리텔링',
    meta: [
      { label: '전문가', value: '정현우 (36세, 출판사 편집자 출신)' },
      { label: '고객사', value: '지속가능 패션 브랜드' },
      { label: '활용 방식', value: '월 20시간, 월 120만 원' }
    ],
    paragraphs: [
      '지속가능성을 내세우는 패션 브랜드는 많았지만, “이야기” 없이 표어만 외치는 경우가 많았습니다. 이 브랜드 역시 제품은 좋았지만, 고객에게 ‘왜 이 브랜드여야 하는지’가 전달되지 않았습니다.'
    ],
    bullets: [
      '창업 스토리, 원단 선택 과정, 생산 공정 등을 스토리 아크로 엮어냄',
      '3개월간 블로그·뉴스레터·브랜드 저널 콘텐츠 50개 제작',
      '인터뷰, 에세이, 팩트 리포트 등 다양한 포맷 실험'
    ],
    resultLabel: '🚀 성과',
    resultText: '브랜드 홈페이지 월간 방문자 300% 증가, 친환경/지속가능 관련 언론 보도 3회 확보. 고객들이 SNS에서 브랜드 철학을 자발적으로 언급하기 시작했습니다.'
  },
  {
    id: '6',
    title: '6. HR 컨설턴트의 조직 문화 개선',
    meta: [
      { label: '전문가', value: '강민정 (48세, HR 컨설턴트)' },
      { label: '고객사', value: '50인 규모 IT 기업' },
      { label: '활용 방식', value: '월 2회 자문, 6개월 프로젝트' }
    ],
    paragraphs: [
      '급성장하며 인원이 빠르게 늘었지만, 그만큼 불만과 이직도 함께 증가하고 있었습니다. 평가가 공정하지 않다는 말, 보상이 불투명하다는 말이 내부 익명 게시판에 자주 올라왔습니다.'
    ],
    bullets: [
      '전 직원 설문조사 및 주요 인력 인터뷰 진행',
      '기존 평가·보상 시스템 분석 및 문제점 도출',
      '직무·역할 기반 평가체계로 재설계 및 문서화'
    ],
    resultLabel: '🚀 성과',
    resultText: '직원 만족도 25% 상승, 연간 이직률 40% 감소. 외부 기관에서 우수 일하기 기업으로 선정되는 성과를 거두었습니다.'
  },
  {
    id: '7',
    title: '7. 개발자의 기술적 문제 해결',
    meta: [
      { label: '전문가', value: '박상현 (38세, 풀스택 개발자)' },
      { label: '고객사', value: '이커머스 스타트업' },
      { label: '활용 방식', value: '주 10시간, 2개월 프로젝트' }
    ],
    paragraphs: [
      '프로모션 때마다 서버가 다운되고, 페이지 로딩이 느려 고객 불만이 쌓이고 있었습니다. 내부 개발자는 있었지만, 성능 최적화와 인프라 설계 경험은 부족했습니다.'
    ],
    bullets: [
      '서버 아키텍처 점검 및 스케일링 전략 재설계',
      '캐싱·쿼리 최적화·이미지 경량화 작업',
      '결제 플로우 병목 구간 분석 및 개선'
    ],
    resultLabel: '🚀 성과',
    resultText: '페이지 로딩 속도 60% 개선, 결제 전환율 25% 증가. 오래된 코드를 정리해 기술 부채 70% 감소를 달성했습니다.'
  },
  {
    id: '8',
    title: '8. 데이터 분석가의 비즈니스 인사이트 제공',
    meta: [
      { label: '전문가', value: '이수진 (33세, 데이터 분석가)' },
      { label: '고객사', value: '온라인 교육 플랫폼' },
      { label: '활용 방식', value: '월 15시간, 3개월 계약' }
    ],
    paragraphs: [
      '여러 마케팅 실험을 하고 있었지만, 무엇이 효과가 있는지 ‘감’으로만 판단하고 있었습니다. “데이터를 쌓기는 하는데, 아무도 안 본다”는 말이 나올 정도였습니다.'
    ],
    bullets: [
      '데이터 파이프라인 정리 및 대시보드 구축',
      '유입 채널별 전환율, 강의별 이탈 구간 분석',
      '할인·쿠폰 정책별 LTV(고객 생애 가치) 비교'
    ],
    resultLabel: '🚀 성과',
    resultText: '수강 완료율 35% 증가, 재구매율 45% 상승. 경영진 회의에서 데이터 기반 의사결정이 정착되었습니다.'
  },
  {
    id: '9',
    title: '9. 브랜딩 전문가의 스타트업 아이덴티티 구축',
    meta: [
      { label: '전문가', value: '김지아 (41세, 브랜딩 에이전시 대표)' },
      { label: '고객사', value: 'B2B SaaS 스타트업' },
      { label: '활용 방식', value: '주 8시간, 4개월 프로젝트' }
    ],
    paragraphs: [
      '기술력은 좋았지만 “우리 회사는 어떤 회사인가요?”라는 질문에 팀원마다 다른 답을 하는 상황이었습니다. 투자자, 고객, 파트너에게 일관된 인상을 주지 못하고 있었습니다.'
    ],
    bullets: [
      '창업팀 워크숍을 통한 브랜드 미션·비전·핵심 메시지 정리',
      '브랜드 아이덴티티(BI) 및 로고, 컬러 시스템 재정립',
      '웹사이트·세일즈 자료·홍보물에 일관되게 적용'
    ],
    resultLabel: '🚀 성과',
    resultText: '브랜드 인지도 200% 증가, 계약 전환율 30% 상승. 팀원들이 회사에 대해 이야기할 때 사용하는 공통 언어가 생겼습니다.'
  },
  {
    id: '10',
    title: '10. 법률 전문가의 계약 검토 및 자문',
    meta: [
      { label: '전문가', value: '윤석규 (55세, 변호사)' },
      { label: '고객사', value: '투자 유치 준비 중인 스타트업' },
      { label: '활용 방식', value: '월 4회 자문, 6개월 계약' }
    ],
    paragraphs: [
      '투자 유치와 함께 각종 계약서가 쏟아지기 시작했지만, 내부에는 법률 전문가가 없었습니다. 투자계약, 주주간 계약, NDA 등 법률 문서가 쌓이면서 “이대로 사인해도 되나?”가 늘 문제였습니다.'
    ],
    bullets: [
      '투자 관련 계약서 15건 이상 검토 및 수정 제안',
      '지식재산권(IP) 보유 구조 점검 및 정비',
      '직원·프리랜서 계약서 표준 템플릿 설계'
    ],
    resultLabel: '🚀 성과',
    resultText: '지식재산권 관련 잠재 리스크 90% 감소, 법적 분쟁 가능성을 사전 차단. 결과적으로 시리즈 A 투자 50억 원 유치 성공에 기여했습니다.'
  },
  {
    id: '11',
    title: '11. 시니어 CMO + 디자이너·마케터 3개월 전문 파트너',
    meta: [
      { label: '전문 파트너 구성', value: '시니어 CMO 1명, 브랜드 디자이너 1명, 퍼포먼스 마케터 1명' },
      { label: '고객사', value: '8인 D2C 패션 브랜드' },
      { label: '활용 방식', value: '3개월 단기 프로젝트, 총 1,500만 원' }
    ],
    paragraphs: [
      '브랜딩과 성과 광고를 동시에 잡고 싶었지만, 인하우스 인력과 예산이 부족한 상황이었습니다. 전시는 시니어 CMO를 리더로, 브랜드 디자이너·퍼포먼스 마케터로 구성된 3인 전문 파트너를 매칭했습니다.'
    ],
    bullets: [
      '브랜드 포지셔닝·타깃 세그먼트 재정의',
      '신규 상세페이지 템플릿·룩북 제작',
      '성과 광고 구조 재설계 및 예산 재배분'
    ],
    resultLabel: '🚀 성과',
    resultText: '3개월 동안 ROAS 170% → 260% 개선, 재구매율 35% 상승. 프로젝트 종료 후 시니어 CMO는 월 4회 자문 패키지로 전환되었습니다.'
  },
  {
    id: '12',
    title: '12. 3개월 브랜드 리뉴얼 프로젝트 전문 파트너',
    meta: [
      { label: '전문 파트너 구성', value: '브랜딩 리더 1명, BX 디자이너 1명, 카피라이터 1명' },
      { label: '고객사', value: '라이프스타일 D2C 브랜드 (직원 12명)' },
      { label: '활용 방식', value: '3개월 단기 프로젝트, 총 1,200만 원' }
    ],
    paragraphs: [
      '신규 고객 유입은 꾸준했지만, 브랜드가 남지 않는다는 피드백이 반복되었습니다. 대표는 “브랜드를 한 번에 정리해 줄 팀”을 원했고, 전시는 브랜딩 시니어 리더와 디자이너, 카피라이터로 구성된 3인 전문 파트너로 매칭했습니다.'
    ],
    bullets: [
      '브랜드 미션·비전·키메시지 재정의 워크숍',
      '로고·컬러·타이포 등 BX 전면 리뉴얼',
      '패키지 디자인·상세페이지 톤앤매너 통합'
    ],
    resultLabel: '🎨 성과',
    resultText: '리뉴얼 론칭 후 3개월간 재구매율 50% 증가, 인스타그램 태그 수 3배 증가. “이제야 우리 브랜드 같다”는 내부 피드백과 함께, 전문 파트너의 추가 캠페인 프로젝트가 이어졌습니다.'
  },
  {
    id: '13',
    title: '13. 신규 서비스 론칭을 위한 올인원 전문 파트너',
    meta: [
      { label: '전문 파트너 구성', value: '시니어 PM 1명, UX 디자이너 1명, 프론트엔드 개발자 1명, 마케터 1명' },
      { label: '고객사', value: '40인 규모 B2B SaaS 기업' },
      { label: '활용 방식', value: '4개월 단기 프로젝트, 총 3,000만 원' }
    ],
    paragraphs: [
      '내부 TF는 있었지만, 신규 서비스 론칭 경험자와 실행 인력이 동시에 부족했습니다. 전시는 론칭 경험이 풍부한 시니어 PM을 리더로, UX·개발·마케팅이 모두 포함된 4인 전문 파트너를 구성해 투입했습니다.'
    ],
    bullets: [
      '시장·경쟁사 분석 및 MVP 범위 정의',
      '프로토타입 설계, 사용자 테스트, 린 MVP 구현',
      '론칭 캠페인 플랜 및 온·오프라인 채널 운영'
    ],
    resultLabel: '🚀 성과',
    resultText: '예정일 대비 2주 빠르게 론칭에 성공, 베타 3개월 동안 유료 전환율 18% 달성. 내부에서는 이후 프로젝트에도 이 전문 파트너를 다시 부르자는 의견이 나왔습니다.'
  },
  {
    id: '14',
    title: '14. HR 제도 구축을 위한 시니어 + 주니어 전문 파트너',
    meta: [
      { label: '전문 파트너 구성', value: '시니어 HR 컨설턴트 1명, 주니어 HR 리서처 1명' },
      { label: '고객사', value: '80인 규모 IT 스타트업' },
      { label: '활용 방식', value: '3개월 단기 프로젝트, 월 160만 원 × 3개월' }
    ],
    paragraphs: [
      '인원이 50명을 넘어서며 평가·보상·OKR 제도가 필요해졌지만, 내부에 경험자가 없었습니다. 전시는 시니어 HR 컨설턴트와 실행을 도와줄 주니어 HR 리서처로 구성된 2인 전문 파트너를 제안했습니다.'
    ],
    bullets: [
      '전 직원 설문 및 직무별 인터뷰 설계·실행',
      '직군·레벨 기준 평가 기준과 등급 체계 설계',
      'OKR 프로세스 및 연간 HR 캘린더 정리'
    ],
    resultLabel: '💼 성과',
    resultText: '도입 첫 해, 평가 프로세스 만족도 30% 상승, 이직률 20% 감소. 프로젝트 종료 후 시니어 HR과는 월 1회 자문 계약으로 전환되었습니다.'
  },
  {
    id: '15',
    title: '15. 집 인테리어에서 배운 ‘전문 파트너 매칭’ 방식',
    meta: [
      { label: '상황', value: '인테리어 업체 대신 목수·도배사·전기 기사님을 직접 섭외' },
      { label: '역할', value: '나는 인테리어 PM, 기사님들은 각각 전문 전문 파트너' },
      { label: '핵심 포인트', value: '비용 절감 vs. 조율 부담의 트레이드오프' }
    ],
    paragraphs: [
      '집 인테리어 공사를 준비하면서, 인테리어 회사 한 곳에 맡기면 견적이 너무 높았습니다. 그래서 직접 목수, 도배사, 전기, 타일 기사님을 각각 섭외해 진행했죠. 전체 일정 조율, 견적 비교, 공정 순서와 품질 관리는 모두 내가 PM처럼 책임져야 했습니다.',
      '전시는 이 경험을 비즈니스 버전 셀프 인테리어로 풀어냅니다. 기업이 마케팅, 디자인, 개발, 재무 등 여러 역할이 동시에 필요한 프로젝트를 할 때, 개별 프리랜서를 한 명씩 찾는 대신, 전시가 검증된 시니어 리더와 실행 전문 파트너를 한 번에 묶어 제안합니다.'
    ],
    bullets: [],
    resultLabel: '💡 인사이트',
    resultText: '집 인테리어에서의 “업체 한 곳 vs 내가 직접 사람 모으기” 고민처럼, 기업도 “에이전시 vs 개별 프리랜서” 사이에서 항상 고민합니다. 전시는 그 사이에서 시니어 리더 + 프로젝트 전문 파트너를 한 번에 매칭해 주는 셀프 인테리어형 솔루션을 지향합니다.'
  }
]

export default function SuccessCases() {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const navigation = useNavigation<any>()
  const isSmall = width < 640
  const isMedium = width >= 640 && width < 1024
  const isLarge = width >= 1024
  const columns = isLarge ? 3 : isMedium ? 2 : 1

  return (
    <View style={[styles.container, { paddingTop: insets.top }] }>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.page, isSmall ? { paddingHorizontal: 12 } : { paddingHorizontal: 16 }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <FontAwesome5 name="chevron-left" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.pageHeader}>
            <Text style={[styles.headerH1, isSmall && { fontSize: 24 }, !isSmall && { fontSize: 30 }]}>전시(專時) 플랫폼 성공 사례</Text>
            <Text style={styles.headerP}>전문가의 시간과 프로젝트 전문 파트너가 어떻게 비즈니스 성장으로 이어졌는지 보여주는 샘플입니다.</Text>
            <Text style={styles.headerP}>시니어 파트타임 & 단기 프로젝트 전문 파트너 매칭 관점에서 정리한 목업 화면입니다.</Text>
          </View>

          <View style={[columns === 3 ? styles.gridThree : columns === 2 ? styles.gridTwo : styles.gridOne] }>
            {stories.map((s) => (
              <View key={s.id} style={styles.card}>
                <Text style={[styles.cardTitle, isSmall && { fontSize: 16 }, !isSmall && { fontSize: 16 }]}>{s.title}</Text>
                <View style={styles.storyMeta}>
                  {s.meta.map((m, i) => (
                    <View key={i} style={styles.metaLine}>
                      <Text style={styles.metaStrong}>{m.label}:</Text>
                      <Text style={styles.metaValue}>{m.value}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.storyContent}>
                  {s.paragraphs.map((p, i) => (
                    <Text key={i} style={styles.paragraph}>{p}</Text>
                  ))}
                  {s.bullets.length > 0 && (
                    <View style={styles.ul}>
                      {s.bullets.map((b, i) => (
                        <View key={i} style={styles.li}>
                          <Text style={styles.bullet}>•</Text>
                          <Text style={styles.liText}>{b}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.resultsBox}>
                  <Text style={styles.resultsStrong}>{s.resultLabel}</Text>
                  <Text style={styles.resultsText}>{s.resultText}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7'
  },
  scrollContent: {
    paddingBottom: 40
  },
  page: {
    maxWidth: 1120,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: 32
  },
  headerTop: {
    alignSelf: 'flex-start',
    marginBottom: 8
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  pageHeader: {
    marginBottom: 32
  },
  headerH1: {
    color: '#111827',
    marginBottom: 8
  },
  headerP: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 2
  },
  gridThree: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14
  },
  gridTwo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14
  },
  gridOne: {
    gap: 12
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: 'rgba(15,23,42,0.08)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
    borderLeftWidth: 4,
    borderLeftColor: '#0056b3',
    width: '100%'
  },
  cardTitle: {
    color: '#111827',
    marginBottom: 6
  },
  storyMeta: {
    marginBottom: 8
  },
  metaLine: {
    flexDirection: 'row',
    marginBottom: 2
  },
  metaStrong: {
    fontSize: 11,
    color: '#6b7280',
    marginRight: 6
  },
  metaValue: {
    fontSize: 11,
    color: '#6b7280',
    flex: 1
  },
  storyContent: {
    marginBottom: 8
  },
  paragraph: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 4
  },
  ul: {
    paddingLeft: 16
  },
  li: {
    flexDirection: 'row',
    marginBottom: 3
  },
  bullet: {
    width: 16,
    textAlign: 'center',
    color: '#374151'
  },
  liText: {
    flex: 1,
    fontSize: 13,
    color: '#374151'
  },
  resultsBox: {
    marginTop: 3,
    marginBottom: 2,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#e9f5ff',
    borderWidth: 1,
    borderColor: '#e0e7ff',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745'
  },
  resultsStrong: {
    fontSize: 12,
    color: '#111827',
    marginBottom: 3
  },
  resultsText: {
    fontSize: 12,
    color: '#111827'
  }
})
