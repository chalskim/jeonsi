import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Linking } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FontAwesome5 } from '@expo/vector-icons'

type Category = 'all' | 'news' | 'seminar' | 'support' | 'industry' | 'update'
type Attachment = { name: string; size: string }
type NewsItem = {
  id: number
  category: Exclude<Category, 'all'>
  title: string
  preview: string
  content: string
  date: string
  source: string
  views: number
  unread: boolean
  featured: boolean
  externalUrl: string
  attachments: Attachment[]
}

export default function NewsNoticeList() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category>('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [modalItem, setModalItem] = useState<NewsItem | null>(null)

  const itemsPerPage = 10

  const goBackSmart = () => {
    const prev = (route as any)?.params?.prev
    if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
      ;(navigation as any).goBack()
      return
    }
    if (typeof prev === 'string') {
      navigation.navigate(prev)
      return
    }
    navigation.navigate('Home')
  }

  const data = useMemo<NewsItem[]>(() => [
    {
      id: 1,
      category: 'support',
      title: '[정부지원] 중소기업 디지털 전환 자금 지원 사업',
      preview: '중소벤처기업진흥공단에서 진행하는 디지털 전환 자금 지원 사업에 참여하세요. 최대 2억원까지 지원 가능!',
      content: `중소벤처기업진흥공단에서 진행하는 디지털 전환 자금 지원 사업에 참여하세요.

🎯 사업 목적: 중소기업의 디지털 전환 가속화 및 경쟁력 강화

💰 지원 내용:
- 디지털 전환 자금: 최대 2억원 (업체당)
- 기술개발비: 최대 1억원
- 인건비: 최대 5천만원
- 시설비/장비비: 최대 5천만원

📅 신청 기간: 2023년 4월 1일 ~ 4월 30일
🏢 신청 기관: 중소벤처기업진흥공단 홈페이지

👥 지원 대상:
- 설립 3년 이상 7년 미만 중소기업
- 직원 수 5인 이상 50인 미만
- 최근 3년간 매출액 10억원 이상
- 디지털 전환 계획 보유 기업

📋 제출 서류:
- 사업계획서
- 재무제표 (최근 3개년)
- 사업자등록증
- 법인등기부등본
- 디지털 전환 계획서

✨ 평가 기준:
- 사업의 혁신성 (40%)
- 기술력 및 실행 가능성 (30%)
- 시장성 및 성장 가능성 (20%)
- 기업의 재무 건전성 (10%)

문의사항:
- 중소벤처기업진흥공단: 1544-7447
- 이메일: digital@kised.or.kr

많은 관심과 참여 부탁드립니다!`,
      date: '2023-03-18',
      source: '중소벤처기업진흥공단',
      views: 4520,
      unread: true,
      featured: true,
      externalUrl: 'https://www.kised.or.kr/',
      attachments: [
        { name: '디지털전환_지원사업_안내.pdf', size: '2.4MB' },
        { name: '신청서_양식.hwp', size: '156KB' },
        { name: '사업계획서_작성가이드.pdf', size: '1.8MB' }
      ]
    },
    {
      id: 2,
      category: 'seminar',
      title: '[무료] 클라우드 보안 전문가 양성 과정 신청',
      preview: '정부 지원으로 진행되는 클라우드 보안 전문가 양성 과정에 참여하세요. 무료로 최신 기술을 배우고 자격증 취득 기회까지!',
      content: `정부 지원으로 진행되는 클라우드 보안 전문가 양성 과정에 참여하세요.

📅 교육 일정: 2023년 4월 3일 ~ 4월 28일 (4주)
⏰ 시간: 매주 월/수/금 19:00 ~ 22:00
📍 장소: 온라인 (Zoom)

🎯 교육 내용:
- 클라우드 아키텍처 기초
- AWS/Azure/GCP 보안 설정
- 컨테이너 보안 (Docker, Kubernetes)
- DevSecOps 실무
- 클라우드 보안 자격증 대비

✨ 혜택:
- 전액 무료 교육 (정부 지원)
- 교육 자료 제공
- 수료증 발급
- 취업 지원 프로그램 연계

👥 모집 인원: 30명 (선착순)
📝 신청 방법: 아래 링크를 통해 온라인 신청

많은 관심과 참여 부탁드립니다!`,
      date: '2023-03-15',
      source: '한국정보보호진흥원',
      views: 3420,
      unread: true,
      featured: true,
      externalUrl: 'https://www.kisa.or.kr/',
      attachments: [
        { name: '교육_커리큘럼.pdf', size: '245KB' },
        { name: '신청서_양식.docx', size: '56KB' }
      ]
    },
    {
      id: 3,
      category: 'support',
      title: '[정부지원] 여성 기업인 창업 자금 지원',
      preview: '여성창업기업지원센터에서 여성 기업인 대상 창업 자금 지원 사업을 진행합니다. 최대 5천만원까지 무상 지원!',
      content: `여성창업기업지원센터에서 여성 기업인 대상 창업 자금 지원 사업을 진행합니다.

🎯 사업 목적: 여성의 경제 활동 참여 확대 및 창업 활성화

💰 지원 내용:
- 창업 자금: 최대 5천만원 (무상)
- 사업화 자금: 최대 3천만원
- 마케팅 자금: 최대 2천만원

📅 신청 기간: 2023년 4월 10일 ~ 5월 10일
🏢 신청 기관: 여성창업기업지원센터

👥 지원 대상:
- 만 19세 이상 여성
- 창업 3년 미만 기업가
- 또는 창업을 준비하는 여성

📋 제출 서류:
- 창업계획서
- 사업자등록증 (기존 사업자)
- 주민등록등본
- 본인서약서

✨ 평가 기준:
- 사업의 혁신성 (40%)
- 시장성 및 성장 가능성 (30%)
- 실행 가능성 (20%)
- 창업자의 역량 (10%)

문의사항:
- 여성창업기업지원센터: 1577-2274
- 이메일: support@womenbiz.or.kr

여성 기업인분들의 많은 참여를 기다립니다!`,
      date: '2023-03-14',
      source: '여성창업기업지원센터',
      views: 3890,
      unread: true,
      featured: false,
      externalUrl: 'https://www.womenbiz.or.kr/',
      attachments: [
        { name: '창업자금_지원_안내.pdf', size: '1.2MB' },
        { name: '창업계획서_양식.hwp', size: '98KB' }
      ]
    },
    {
      id: 4,
      category: 'news',
      title: '프리랜서 시장, 2023년 1조원 규모 성장 전망',
      preview: '경제 불확실성 속에서도 기업들은 유연한 인력 운용을 선호하며 프리랜서 시장은 꾸준히 성장하고 있습니다.',
      content: `경제 불확실성 속에서도 기업들은 유연한 인력 운용을 선호하며 프리랜서 시장은 꾸준히 성장하고 있습니다.

최근 시장조사기관에 따르면, 국내 프리랜서 시장은 2023년 약 1조원 규모에 이를 것으로 전망됩니다. 이는 전년 대비 15% 이상의 성장률입니다.

주요 성장 요인:
1. 기업의 비용 절감 압박
2. 유연근무제 확산
3. 디지털 전환 가속화
4. Z세대의 일하는 방식 변화

특히 IT/개발, 마케팅, 디자인 분야에서 프리랜서 수요가 급증하고 있으며, 고숙련 전문가일수록 시장 가치가 높아지는 추세입니다.

업계 관계자는 "앞으로도 플랫폼 기반의 프리랜서 매칭 시장이 더욱 활성화될 것"이라고 전망했습니다.`,
      date: '2023-03-12',
      source: '경제일보',
      views: 2156,
      unread: true,
      featured: false,
      externalUrl: 'https://www.kyunghyang.com/',
      attachments: []
    },
    {
      id: 5,
      category: 'industry',
      title: 'ISO 27001 인증 기업, 계약 우선권 확대',
      preview: '정부가 공공기관 및 대기업의 정보보안 인증 의무화를 확대하면서 ISO 27001 인증 기업들의 계약 우선권이 커지고 있습니다.',
      content: `정부가 공공기관 및 대기업의 정보보안 인증 의무화를 확대하면서 ISO 27001 인증 기업들의 계약 우선권이 커지고 있습니다.

방송통신위원회는 올해 하반기부터 정보보안 관리체계(ISMS) 인증 의무 대상을 현재 1,800여 개사에서 2,500여 개사로 확대할 예정입니다.

주요 변경 내용:
- 대상 기업 확대 (연간 매출 100억원 이상)
- 인증 범위 확대 (클라우드 서비스 포함)
- 정기 심사 주기 단축 (2년 → 1년)

이로 인해 ISO 27001 인증을 보유한 기업들은 공공 조달 및 대기업 협력 시 우대를 받을 수 있게 됩니다.

실제로 삼성SDS, LG CNS 등 대기업들은 협력사 선정 시 정보보안 인증을 필수 요건으로 적용하고 있습니다.

전문가들은 "정보보안 인증은 이제 선택이 아닌 필수"라며 "관련 전문가 수요가 계속 증가할 것"이라고 말했습니다.`,
      date: '2023-03-10',
      source: 'IT동아',
      views: 1879,
      unread: false,
      featured: false,
      externalUrl: 'https://www.itdonga.com/',
      attachments: [
        { name: 'ISMS_인증_가이드라인.pdf', size: '1.2MB' }
      ]
    },
    {
      id: 6,
      category: 'support',
      title: '[정부지원] 청년 창업 사업화 자금 지원',
      preview: '고용노동부에서 청년 창업가 대상 사업화 자금 지원 사업을 진행합니다. 최대 1억원까지 지원되니 꼭 신청하세요!',
      content: `고용노동부에서 청년 창업가 대상 사업화 자금 지원 사업을 진행합니다.

🎯 사업 목적: 청년 창업 활성화 및 양질의 일자리 창출

💰 지원 내용:
- 사업화 자금: 최대 1억원
- 인건비: 최대 5천만원
- 개발비: 최대 3천만원

📅 신청 기간: 2023년 4월 5일 ~ 4월 25일
🏢 신청 기관: 고용노동부 청년창업포털

👥 지원 대상:
- 만 19세 ~ 34세 청년
- 창업 1년 미만 기업가
- 4인 이하 기업

📋 제출 서류:
- 사업계획서
- 재무제표
- 사업자등록증
- 신분증 사본

✨ 평가 기준:
- 사업의 혁신성 (40%)
- 고용 창출 효과 (30%)
- 성장 가능성 (20%)
- 청년의 역량 (10%)

문의사항:
- 고용노동부 청년창업지원센터: 1644-2044
- 이메일: youth@moel.go.kr

청년 창업가분들의 적극적인 참여를 바랍니다!`,
      date: '2023-03-08',
      source: '고용노동부',
      views: 5670,
      unread: false,
      featured: true,
      externalUrl: 'https://www.moel.go.kr/',
      attachments: [
        { name: '청년창업_지원_안내.pdf', size: '3.2MB' },
        { name: '신청서_작성_매뉴얼.pdf', size: '890KB' }
      ]
    },
    {
      id: 7,
      category: 'update',
      title: '전시 플랫폼, 전문가 커뮤니티 베타 버전 오픈',
      preview: '전문가들 간의 지식 공유와 네트워킹을 위한 커뮤니티 기능이 베타 버전으로 오픈되었습니다.',
      content: `전문가들 간의 지식 공유와 네트워킹을 위한 커뮤니티 기능이 베타 버전으로 오픈되었습니다.

새롭게 오픈된 커뮤니티 기능:
1. 전문가 그룹 채팅
2. 기술 Q&A 게시판
3. 사이드 프로젝트 팀원 모집
4. 지식 공유 웨비나 예약

베타 기간 동안의 특별 혜택:
- 그룹 생성 무료 (월 5개)
- 웨비나 예약 우선권
- 프로필 프리미엄 기능 1개월 무료

많은 참여와 피드백 부탁드립니다!

📧 문의: community@jeonsi.com`,
      date: '2023-03-08',
      source: '전시 운영팀',
      views: 934,
      unread: false,
      featured: false,
      externalUrl: '',
      attachments: []
    },
    {
      id: 8,
      category: 'seminar',
      title: '[온라인] 스타트업 재무 전략 무료 웨비나',
      preview: '성공적인 스타트업 운영을 위한 재무 전략 웨비나를 무료로 개최합니다. 투자 유치부터 현금흐름 관리까지!',
      content: `성공적인 스타트업 운영을 위한 재무 전략 웨비나를 무료로 개최합니다.

📅 일시: 2023년 3월 25일 (토) 14:00 ~ 16:00
📍 장소: 온라인 (YouTube Live)

🎯 주요 내용:
- 스타트업 투자 유치 전략
- IR 자료 작성 노하우
- 현금흐름 관리 실전 팁
- 재무 모델링 기초
- 투자자와의 협상 전략

👥 발표자:
- 김투자 (벤처캐피탈 파트너)
- 이재무 (스타트업 CFO)

✨ 참여 혜택:
- 무료 참여
- 발표 자료 제공
- Q&A 세션
- 참여증 발급

📝 신청: 아래 링크를 통해 사전 신청 (선착순 500명)

스타트업 창업을 준비하시는 분들께 꼭 필요한 정보가 될 것입니다!`,
      date: '2023-03-05',
      source: '스타트업허브',
      views: 2765,
      unread: false,
      featured: true,
      externalUrl: 'https://www.startuphub.kr/',
      attachments: [
        { name: '웨비나_소개서.pdf', size: '890KB' }
      ]
    }
  ], [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    let list = data.filter((n) => {
      if (!term) return true
      const s = `${n.title}\n${n.preview}\n${n.content}`.toLowerCase()
      return s.includes(term)
    })
    if (category !== 'all') list = list.filter((n) => n.category === category)
    return list
  }, [data, search, category])

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const pageItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filtered.slice(start, end)
  }, [filtered, page])

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(t)
  }, [search, category, page])

  const openItem = (item: NewsItem) => {
    setModalItem(item)
    item.views += 1
    if (item.unread) item.unread = false
  }

  const chip = (code: Category, label: string) => {
    const on = category === code
    return (
      <TouchableOpacity key={code} style={[styles.filterChip, on && styles.filterChipActive]} activeOpacity={0.85} onPress={() => { setCategory(code); setPage(1) }}>
        <Text style={[styles.filterChipText, on && styles.filterChipTextActive]}>{label}</Text>
      </TouchableOpacity>
    )
  }

  const categoryBadge = (c: NewsItem['category']) => {
    const m = c === 'news' ? { cls: styles.categoryNews, label: '뉴스' } :
      c === 'seminar' ? { cls: styles.categorySeminar, label: '무료 세미나' } :
      c === 'support' ? { cls: styles.categorySupport, label: '정부지원' } :
      c === 'industry' ? { cls: styles.categoryIndustry, label: '산업 동향' } :
      { cls: styles.categoryUpdate, label: '플랫폼 소식' }
    return (
      <View style={[styles.newsCategory, m.cls]}><Text style={styles.newsCategoryText}>{m.label}</Text></View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }] }>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>뉴스 및 공지</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>뉴스 및 공지</Text>
          <Text style={styles.pageSubtitle}>외부 뉴스, 무료 세미나, 정부지원, 산업 동향 등 다양한 정보를 확인하세요</Text>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TextInput style={styles.searchInput} placeholder="뉴스 및 공지 검색..." value={search} onChangeText={setSearch} returnKeyType="search" onSubmitEditing={() => setPage(1)} />
            <TouchableOpacity style={styles.searchButton} activeOpacity={0.85} onPress={() => setPage(1)}>
              <FontAwesome5 name="search" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.filterChips}>
            {chip('all', '전체')}
            {chip('news', '뉴스')}
            {chip('seminar', '무료 세미나')}
            {chip('support', '정부지원')}
            {chip('industry', '산업 동향')}
            {chip('update', '플랫폼 소식')}
          </View>
        </View>

        <View style={styles.list}>
          {loading && (
            <View style={styles.loading}><View style={styles.spinner} /><Text style={styles.loadingText}>뉴스 및 공지를 불러오는 중...</Text></View>
          )}
          {!loading && pageItems.length === 0 && (
            <View style={styles.empty}>
              <FontAwesome5 name="newspaper" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>뉴스 및 공지가 없습니다</Text>
              <Text style={styles.emptyDesc}>등록된 뉴스 및 공지가 없습니다.</Text>
            </View>
          )}

          {!loading && pageItems.map((item) => {
            const unread = item.unread
            const featured = item.featured
            return (
              <TouchableOpacity key={item.id} style={[styles.card, unread && styles.cardUnread, featured && styles.cardFeatured]} activeOpacity={0.9} onPress={() => openItem(item)}>
                {featured ? <View style={styles.featuredBadge}><Text style={styles.featuredText}>추천</Text></View> : null}
                <View style={styles.cardHeader}>
                  <View>{categoryBadge(item.category)}</View>
                  <Text style={styles.newsDate}>{item.date}</Text>
                </View>
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text style={styles.newsPreview} numberOfLines={2}>{item.preview}</Text>
                <View style={styles.cardFooter}>
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}><FontAwesome5 name="globe" size={12} color="#6B7280" /><Text style={styles.metaText}>{item.source}</Text></View>
                    <View style={styles.metaItem}><FontAwesome5 name="eye" size={12} color="#6B7280" /><Text style={styles.metaText}>{item.views}</Text></View>
                    {item.attachments.length > 0 ? (
                      <View style={styles.metaItem}><FontAwesome5 name="paperclip" size={12} color="#6B7280" /><Text style={styles.metaText}>{item.attachments.length}</Text></View>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={styles.pagination}>
          {totalPages > 1 && (
            <View style={styles.paginationRow}>
              <TouchableOpacity style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]} disabled={page === 1} onPress={() => setPage((p) => Math.max(1, p - 1))}>
                <FontAwesome5 name="chevron-left" size={12} color={page === 1 ? '#9CA3AF' : '#111827'} />
              </TouchableOpacity>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                const num = start + idx
                const active = num === page
                return (
                  <TouchableOpacity key={`p-${num}`} style={[styles.pageBtn, active && styles.pageBtnActive]} onPress={() => setPage(num)}>
                    <Text style={[styles.pageNumber, active && styles.pageNumberActive]}>{num}</Text>
                  </TouchableOpacity>
                )
              })}
              <TouchableOpacity style={[styles.pageBtn, page === totalPages && styles.pageBtnDisabled]} disabled={page === totalPages} onPress={() => setPage((p) => Math.min(totalPages, p + 1))}>
                <FontAwesome5 name="chevron-right" size={12} color={page === totalPages ? '#9CA3AF' : '#111827'} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={!!modalItem} animationType="slide" transparent onRequestClose={() => setModalItem(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalItem(null)}>
              <FontAwesome5 name="times" size={20} color="#6B7280" />
            </TouchableOpacity>
            {modalItem && (
              <ScrollView contentContainerStyle={styles.modalBody}>
                <Text style={styles.modalTitle}>{modalItem.title}</Text>
                <View style={styles.modalMetaRow}>
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}><Text style={styles.metaText}>{modalItem.category === 'news' ? '뉴스' : modalItem.category === 'seminar' ? '무료 세미나' : modalItem.category === 'support' ? '정부지원' : modalItem.category === 'industry' ? '산업 동향' : '플랫폼 소식'}</Text></View>
                    <View style={styles.metaItem}><Text style={styles.metaText}>{modalItem.date}</Text></View>
                    <View style={styles.metaItem}><Text style={styles.metaText}>{modalItem.source}</Text></View>
                    <View style={styles.metaItem}><FontAwesome5 name="eye" size={12} color="#6B7280" /><Text style={styles.metaText}>{modalItem.views}</Text></View>
                  </View>
                </View>
                <Text style={styles.modalContentText}>{modalItem.content}</Text>
                {!!modalItem.externalUrl ? (
                  <TouchableOpacity style={styles.externalLink} onPress={() => Linking.openURL(modalItem.externalUrl)}>
                    <FontAwesome5 name="external-link-alt" size={14} color="#2563EB" />
                    <Text style={styles.externalLinkText}>원문 보기</Text>
                  </TouchableOpacity>
                ) : null}
                {modalItem.attachments.length > 0 ? (
                  <View style={styles.attachmentsSection}>
                    <Text style={styles.attachmentsTitle}>첨부 파일</Text>
                    {modalItem.attachments.map((a, i) => (
                      <View key={`${a.name}-${i}`} style={styles.attachmentItem}>
                        <FontAwesome5 name="file-pdf" size={16} color="#2563EB" />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.attachmentName}>{a.name}</Text>
                          <Text style={styles.attachmentSize}>{a.size}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#dee2e6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: 40 },

  pageHeader: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#dee2e6', padding: 16 },
  pageTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  pageSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 4 },

  searchSection: { backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 16, marginTop: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  searchInput: { flex: 1, borderWidth: 1.8, borderColor: '#E5E7EB', borderRadius: 25, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#ffffff', fontSize: 14 },
  searchButton: { marginLeft: 8, backgroundColor: '#2563EB', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 },
  filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F3F4F6' },
  filterChipActive: { backgroundColor: '#2563EB' },
  filterChipText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  filterChipTextActive: { color: '#FFFFFF' },

  list: { paddingHorizontal: 16, paddingTop: 8 },
  loading: { alignItems: 'center', paddingVertical: 20 },
  spinner: { width: 24, height: 24, borderRadius: 12, borderWidth: 4, borderColor: 'rgba(0,0,0,0.1)', borderTopColor: '#2563EB' },
  loadingText: { marginTop: 8, color: '#6B7280', fontSize: 13 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginTop: 8 },
  emptyDesc: { fontSize: 13, color: '#6B7280', marginTop: 4 },

  card: { backgroundColor: '#ffffff', borderRadius: 8, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  cardUnread: { borderLeftWidth: 4, borderLeftColor: '#2563EB' },
  cardFeatured: { borderLeftWidth: 4, borderLeftColor: '#DC2626' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  newsCategory: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  newsCategoryText: { fontSize: 11, fontWeight: '700' },
  categoryNews: { backgroundColor: 'rgba(23,162,184,0.2)' },
  categorySeminar: { backgroundColor: 'rgba(40,167,69,0.2)' },
  categoryIndustry: { backgroundColor: 'rgba(255,193,7,0.2)' },
  categoryUpdate: { backgroundColor: 'rgba(111,66,193,0.2)' },
  categorySupport: { backgroundColor: 'rgba(220,53,69,0.2)' },
  newsDate: { color: '#6B7280', fontSize: 12 },
  newsTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  newsPreview: { color: '#6B7280', fontSize: 13 },
  cardFooter: { marginTop: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#6B7280' },
  featuredBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#DC2626', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 3 },
  featuredText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },

  pagination: { paddingHorizontal: 16, paddingVertical: 14 },
  paginationRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  pageBtn: { minWidth: 36, height: 36, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  pageBtnDisabled: { opacity: 0.5 },
  pageBtnActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  pageNumber: { color: '#111827', fontSize: 13 },
  pageNumberActive: { color: '#FFFFFF', fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modalContent: { width: '100%', maxWidth: 800, maxHeight: '85%', backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden' },
  modalClose: { position: 'absolute', right: 12, top: 12, zIndex: 10 },
  modalBody: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 10 },
  modalMetaRow: { paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 12 },
  modalContentText: { fontSize: 14, color: '#374151', lineHeight: 22 },
  externalLink: { marginTop: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#2563EB', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8 },
  externalLinkText: { color: '#2563EB', fontSize: 13, fontWeight: '700' },
  attachmentsSection: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12 },
  attachmentsTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
  attachmentItem: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, padding: 10, marginBottom: 8 },
  attachmentName: { fontSize: 13, color: '#111827', fontWeight: '600' },
  attachmentSize: { fontSize: 12, color: '#6B7280' }
})

