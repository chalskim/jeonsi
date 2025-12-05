import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Pressable, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import SideMenu from './sidemenu'
import DateTimePicker from '@react-native-community/datetimepicker'
import common from '../../data/common.json'

type Banner = { id: string; title: string; desc: string; color: string; cta: string }
type Stat = { id: string; title: string; value: string; change: string; icon: string; color: string }
type Urgent = { id: string; badge: string; title: string; company: string; price: string; deadline: string; roles?: string[] }
type Expert = { id: string; badge?: string; title: string; company: string; price: string; rating: number }
type CardItem = { id: string; badge?: string; title: string; company: string; price: string; roles?: string[] }
type FilterKey = 'short' | 'experts' | 'education' | 'recruitment'

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()
  const bannerRef = useRef<ScrollView | null>(null)
  const [bannerIndex, setBannerIndex] = useState(0)
  const screenWidth = Dimensions.get('window').width
  const mainTabs = ['단기 의뢰', '전문가', '교육', '구인'] as const
  const [activeMainTab, setActiveMainTab] = useState<typeof mainTabs[number]>('단기 의뢰')
  const [sideOpen, setSideOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [expandedSearch, setExpandedSearch] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterKey>('short')
  const [selectedMajorCode, setSelectedMajorCode] = useState('ALL')
  const [selectedMiddleCode, setSelectedMiddleCode] = useState('ALL')
  const [selectedRegionCode, setSelectedRegionCode] = useState('ALL')
  const [majorOpen, setMajorOpen] = useState(false)
  const [middleOpen, setMiddleOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)

  const banners = useMemo<Banner[]>(
    () => [
      { id: 'b1', title: '🎉 단기 프로젝트 전문가 매칭', desc: '필요한 전문가를 하루 만에 찾아보세요', cta: '의뢰 등록', color: '#5B86E5' },
      { id: 'b2', title: '🏆 최고의 전문가들이 모인 곳', desc: '검증된 전문가들과 프로젝트를 진행하세요', cta: '전문가 보기', color: '#8E2DE2' },
      { id: 'b3', title: '🔒 실무 중심 교육 프로그램', desc: '업계 최고 전문가들의 직접 교육으로 성장하세요', cta: '교육 신청', color: '#F2994A' },
      { id: 'b4', title: '🌟 최적의 인재를 찾는 곳', desc: '전문 인재 채용 성공률 98%', cta: '채용 공고 등록', color: '#0BA360' },
    ],
    []
  )

  const stats = useMemo<Stat[]>(
    () => [
      { id: 's1', title: '전체 전문가', value: '2,847', change: '+127', icon: 'users', color: '#3B82F6' },
      { id: 's2', title: '인증 전문가', value: '2,156', change: '+89', icon: 'check-circle', color: '#10B981' },
      { id: 's3', title: '진행 프로젝트', value: '847', change: '+23', icon: 'project-diagram', color: '#F59E0B' },
      { id: 's4', title: '완료 매칭', value: '8,234', change: '+156', icon: 'handshake', color: '#EF4444' },
      { id: 's5', title: '평균 만족도', value: '4.7', change: '+0.2', icon: 'star', color: '#FBBF24' },
    ],
    []
  )

  const urgents = useMemo<Urgent[]>(
    () => [
      { id: 'u1', badge: '🔥 긴급', title: '파트타임 CMO (마케팅 총괄)', company: '㈜테크솔루션 · 원격', price: '월 150만원', deadline: '즉시 투입', roles: ['마케팅', '브랜딩', '성장 전략'] },
      { id: 'u2', badge: '⚡ 즉시', title: '파트타임 CFO (IR/재무 자문)', company: '㈜핀테크코리아 · 원격', price: '월 200만원', deadline: '3월 초 투입', roles: ['재무/IR', '법무'] },
      { id: 'u3', badge: '🚀 긴급', title: '파트타임 HR 리드 (조직문화 설계)', company: '㈜디지털이노베이션 · 하이브리드', price: '월 120만원', deadline: '2월 말 투입', roles: ['HR/조직문화', '평가/보상'] },
      { id: 'u4', badge: '⚡ 즉시', title: 'UI/UX 디자이너', company: 'IT기업 · 하이브리드', price: '프로젝트당 180만원', deadline: '주 2회, 2주', roles: ['디자인', 'UI/UX'] },
    ],
    []
  )

  const experts = useMemo<Expert[]>(
    () => [
      { id: 'e1', badge: '신규', title: 'ISO 27001 인증 컨설턴트', company: '한국품질인증원 · 경기 성남', price: '800만원', rating: 5 },
      { id: 'e2', badge: '인기', title: '정보보호 관리체계 구축 전문가', company: '대기업 · 서울', price: '1,200만원', rating: 4 },
      { id: 'e3', badge: '인기', title: '네트워크 보안 관리자', company: '글로벌 클라우드 · 원격', price: '시간당 12만원', rating: 3.5 },
      { id: 'e4', badge: '추천', title: '데이터 분석 전문가', company: '데이터 기업 · 판교', price: '900만원', rating: 4.5 },
    ],
    []
  )

  const generalShort = useMemo<CardItem[]>(
    () => [
      { id: 'gs1', badge: '신규', title: 'D2C 브랜드 마케터 파트너', company: '㈜오늘의패션 · 원격', price: '월 100만원', roles: ['마케팅', '브랜딩', '콘텐츠'] },
      { id: 'gs2', badge: '인기', title: '시니어 백엔드 개발자 (MVP)', company: '㈜스타트업A · 원격', price: '월 180만원', roles: ['개발', '클라우드/인프라'] },
      { id: 'gs3', badge: '추천', title: '앱 UI/UX 디자이너 (리뉴얼)', company: '㈜앱컴퍼니 · 협업', price: '300만원', roles: ['디자인', '사용자 리서치'] },
      { id: 'gs4', badge: '신규', title: '데이터 분석 및 대시보드 구축 (1개월)', company: '㈜데이터랩 · 서울 강남구', price: '600만원' },
      { id: 'gs5', badge: '인기', title: '마케팅 전략 컨설팅 (6주)', company: '㈜브랜드마케팅 · 경기 분당', price: '450만원' },
    ],
    []
  )

  const generalExperts = useMemo<CardItem[]>(
    () => [
      { id: 'ge1', badge: '신규', title: '최PM 전문가', company: '애자일/스크럼 마스터 8년', price: '시간당 14만원' },
      { id: 'ge2', badge: '인기', title: '정디자이너 전문가', company: 'UI/UX 디자이너 7년', price: '시간당 10만원' },
      { id: 'ge3', badge: '추천', title: '이HR 전문가', company: 'HR 전략/조직문화 12년', price: '시간당 13만원' },
      { id: 'ge4', badge: '신규', title: '백엔드 개발자', company: 'Java/Spring 6년', price: '시간당 11만원' },
      { id: 'ge5', badge: '인기', title: '프론트엔드 개발자', company: 'React/Vue 5년', price: '시간당 11만원' },
      { id: 'ge6', badge: '추천', title: '콘텐츠 기획자', company: '웹/앱 기획 4년', price: '시간당 9만원' },
    ],
    []
  )

  const generalEducation = useMemo<CardItem[]>(
    () => [
      { id: 'ed1', badge: '신규', title: '데이터 사이언스 입문', company: '데이터스쿨', price: '150만원' },
      { id: 'ed2', badge: '인기', title: '디지털 마케팅 실전 과정', company: '마케팅랩', price: '60만원' },
      { id: 'ed3', badge: '추천', title: '재무 모델링 및 IR 실무', company: '파이낸스아카데미', price: '180만원' },
      { id: 'ed4', badge: '신규', title: 'Node.js 백엔드 개발', company: '코딩웍스', price: '200만원' },
      { id: 'ed5', badge: '인기', title: '기획자를 위한 Figma 실무', company: '디자인스쿨', price: '90만원' },
      { id: 'ed6', badge: '추천', title: '스타트업 법률 가이드', company: '법무법인 청음', price: '30만원' },
    ],
    []
  )

  const generalRecruitment = useMemo<CardItem[]>(
    () => [
      { id: 'rc1', badge: '신규', title: '시니어 정보보안 엔지니어 채용', company: '㈜테크솔루션', price: '연봉 8,000만원' },
      { id: 'rc2', badge: '인기', title: '클라우드 아키텍트 채용', company: '㈜클라우드테크', price: '연봉 1억원' },
      { id: 'rc3', badge: '추천', title: '백엔드 개발자 채용', company: '㈜소프트웨어하우스', price: '연봉 7,000만원' },
      { id: 'rc4', badge: '신규', title: '프로덕트 매니저 채용', company: '㈜스타트업A', price: '연봉 9,000만원' },
      { id: 'rc5', badge: '인기', title: 'UX/UI 디자이너 채용', company: '㈜디자인스튜디오B', price: '연봉 6,000만원' },
      { id: 'rc6', badge: '추천', title: '마케팅 전문가 채용', company: '㈜브랜드C', price: '연봉 6,500만원' },
    ],
    []
  )

  const menuCategories = useMemo(() => [
    {
      title: '마이페이지',
      icon: 'user-circle',
      items: [
        { label: '내정보(개인)', icon: 'user-circle' },
        { label: '내정보(기업)', icon: 'building' },
      ],
    },
    {
      title: '성공사례',
      icon: 'trophy',
      items: [
        { id: 'success-cases', label: '성공사례', icon: 'trophy' },
      ],
    },
    {
      title: '목록 및 등록',
      icon: 'list',
      items: [
        { label: '단기의뢰 목록 및 등록', icon: 'handshake' },
        { label: '전문가 목록 및 등록', icon: 'user-tie' },
        { label: '전문 교육 목록 및 등록', icon: 'graduation-cap' },
        { label: '구인 목록 및 등록', icon: 'certificate' },
      ],
    },
    {
      title: '일정/북마크',
      icon: 'calendar-alt',
      items: [
        { label: '일정관리(개인)', icon: 'calendar-alt' },
        { label: '일정관리(기업)', icon: 'calendar-alt' },
        { label: '북마크(개인)', icon: 'bookmark' },
        { label: '북마크(기업)', icon: 'building' },
      ],
    },
    {
      title: '장바구니/결제',
      icon: 'shopping-cart',
      items: [
        { label: '기업 장바구니', icon: 'shopping-basket' },
        { label: '개인 장바구니', icon: 'shopping-bag' },
        { label: '기업 결제관리', icon: 'credit-card' },
        { label: '개인 결제관리', icon: 'wallet' },
      ],
    },
    {
      title: '설정/도움말',
      icon: 'cogs',
      items: [
        { label: '설정', icon: 'cogs' },
        { label: 'QA질문', icon: 'question-circle' },
      ],
    },
    {
      title: '공지/로그인',
      icon: 'bell',
      items: [
        { label: '뉴스/공지 사항', icon: 'bell' },
        { label: '로그인', icon: 'sign-in-alt' },
      ],
    },
    {
      title: '관리자',
      icon: 'tools',
      items: [
        { label: '사용자/콘텐츠 관리', icon: 'users-cog' },
        { label: 'Q&A 답변 관리', icon: 'comments' },
        { label: '공고 관리', icon: 'bullhorn' },
        { label: '공지 관리', icon: 'newspaper' },
        { label: '베너 광고 관리', icon: 'bullhorn' },
      ],
    },
  ], [])

  const majorOptions = useMemo(() => [{ code: 'ALL', name: '전체' }, ...common.majorCategories.map((c) => ({ code: c.code, name: c.name }))], [])
  const middleOptions = useMemo(() => {
    const list = selectedMajorCode === 'ALL' ? common.middleCategories : common.middleCategories.filter((m) => m.majorCode === selectedMajorCode)
    return [{ code: 'ALL', name: '전체' }, ...list.map((m) => ({ code: m.code, name: m.name }))]
  }, [selectedMajorCode])
  const regionOptions = useMemo(() => [{ code: 'ALL', name: '전체' }, ...common.regions.map((r) => ({ code: r.short_en, name: r.ko }))], [])

  useEffect(() => {
    if (!expandedSearch) {
      setMajorOpen(false)
      setMiddleOpen(false)
      setRegionOpen(false)
      setStartOpen(false)
      setEndOpen(false)
    }
  }, [expandedSearch])

  const formatDate = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (bannerIndex + 1) % banners.length
      setBannerIndex(next)
      bannerRef.current?.scrollTo({ x: next * screenWidth, animated: true })
    }, 5000)
    return () => clearInterval(timer)
  }, [bannerIndex, banners.length, screenWidth])

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F7F6', paddingTop: insets.top }}>
      <View style={styles.appHeader}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.7} onPress={() => setSideOpen((v) => !v)}>
          <FontAwesome5 name="bars" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>전시(專時)</Text>
        <View style={styles.headerRight}>
          <View style={styles.notificationWrapper}>
            <FontAwesome5 name="bell" size={20} color="#6B7280" />
            <View style={styles.notificationBadge}><Text style={styles.badgeText}>3</Text></View>
          </View>
          <FontAwesome5 name="user-circle" size={22} color="#6B7280" />
        </View>
      </View>

      {sideOpen && <Pressable style={styles.overlay} onPress={() => setSideOpen(false)} />}
      <SideMenu open={sideOpen} onClose={() => setSideOpen(false)} categories={menuCategories} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchSection}>
          <Text style={styles.searchTitle}>필요할 때 딱, 전문가의 시간 한 조각 – 전시</Text>
          <View style={styles.searchControls}>
            <View style={styles.searchBar}>
              <TextInput style={styles.searchInput} placeholder="단기 의뢰, 전문가, 교육, 구인 검색..." value={searchText} onChangeText={setSearchText} />
              <TouchableOpacity style={styles.searchButton} activeOpacity={0.8}><Text style={styles.searchButtonText}>검색</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.detailedSearchButton, expandedSearch && styles.detailedSearchButtonActive]} activeOpacity={0.8} onPress={() => setExpandedSearch((v) => !v)}>
              <FontAwesome5 name="sliders-h" size={16} color={expandedSearch ? '#FFFFFF' : '#111827'} />
            </TouchableOpacity>
          </View>
          <View style={styles.quickFilters}>
            {(['short','experts','education','recruitment'] as FilterKey[]).map((key) => {
              const label = key === 'short' ? '단기 의뢰' : key === 'experts' ? '전문가' : key === 'education' ? '교육' : '구인'
              const active = activeFilter === key
              return (
                <TouchableOpacity key={key} style={[styles.filterChip, active && styles.filterChipActive]} activeOpacity={0.8} onPress={() => setActiveFilter(key)}>
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {expandedSearch && (
          <View style={styles.expandedSearch}>
            <View style={styles.filterPanel}>
              <View style={styles.filterGroup}><Text style={styles.filterGroupTitle}>지역</Text>
                <Pressable style={styles.selectBox} onPress={() => setRegionOpen((v) => !v)}>
                  <Text style={styles.selectValue}>{(regionOptions.find((o) => o.code === selectedRegionCode)?.name) || '전체'}</Text>
                  <FontAwesome5 name={regionOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
                </Pressable>
                {regionOpen && (
                  <View style={styles.dropdown}>
                    <ScrollView style={styles.dropdownScroll}>
                      {regionOptions.map((opt) => (
                        <TouchableOpacity key={opt.code} style={[styles.dropdownItem, selectedRegionCode === opt.code && styles.dropdownItemActive]} activeOpacity={0.8} onPress={() => { setSelectedRegionCode(opt.code); setRegionOpen(false) }}>
                          <Text style={[styles.dropdownItemText, selectedRegionCode === opt.code && styles.dropdownItemTextActive]}>{opt.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
              <View style={styles.filterGroup}><Text style={styles.filterGroupTitle}>카테고리</Text>
                <Pressable style={styles.selectBox} onPress={() => setMajorOpen((v) => !v)}>
                  <Text style={styles.selectValue}>{(majorOptions.find((o) => o.code === selectedMajorCode)?.name) || '전체'}</Text>
                  <FontAwesome5 name={majorOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
                </Pressable>
                {majorOpen && (
                  <View style={styles.dropdown}>
                    <ScrollView style={styles.dropdownScroll}>
                      {majorOptions.map((opt) => (
                        <TouchableOpacity key={opt.code} style={[styles.dropdownItem, selectedMajorCode === opt.code && styles.dropdownItemActive]} activeOpacity={0.8} onPress={() => { setSelectedMajorCode(opt.code); setSelectedMiddleCode('ALL'); setMajorOpen(false) }}>
                          <Text style={[styles.dropdownItemText, selectedMajorCode === opt.code && styles.dropdownItemTextActive]}>{opt.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
              <View style={styles.filterGroup}><Text style={styles.filterGroupTitle}>중분류</Text>
                <Pressable style={styles.selectBox} onPress={() => setMiddleOpen((v) => !v)}>
                  <Text style={styles.selectValue}>{(middleOptions.find((o) => o.code === selectedMiddleCode)?.name) || '전체'}</Text>
                  <FontAwesome5 name={middleOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
                </Pressable>
                {middleOpen && (
                  <View style={styles.dropdown}>
                    <ScrollView style={styles.dropdownScroll}>
                      {middleOptions.map((opt) => (
                        <TouchableOpacity key={opt.code} style={[styles.dropdownItem, selectedMiddleCode === opt.code && styles.dropdownItemActive]} activeOpacity={0.8} onPress={() => { setSelectedMiddleCode(opt.code); setMiddleOpen(false) }}>
                          <Text style={[styles.dropdownItemText, selectedMiddleCode === opt.code && styles.dropdownItemTextActive]}>{opt.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
              <View style={styles.filterGroup}><Text style={styles.filterGroupTitle}>기간</Text>
                <View style={styles.dateRow}>
                  <Pressable style={[styles.selectBox, { flex: 1 }]} onPress={() => setStartOpen((v) => !v)}>
                    <Text style={styles.selectValue}>{startDate ? formatDate(startDate) : '시작일'}</Text>
                    <FontAwesome5 name={startOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
                  </Pressable>
                  <Pressable style={[styles.selectBox, { flex: 1 }]} onPress={() => setEndOpen((v) => !v)}>
                    <Text style={styles.selectValue}>{endDate ? formatDate(endDate) : '종료일'}</Text>
                    <FontAwesome5 name={endOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
                  </Pressable>
                </View>
                {startOpen && (
                  <View style={styles.dropdown}>
                    <DateTimePicker value={startDate || new Date()} mode="date" display="default" onChange={(e, d) => { if (d) { setStartDate(d); if (endDate && d > endDate) setEndDate(null) } setStartOpen(false) }} />
                  </View>
                )}
                {endOpen && (
                  <View style={styles.dropdown}>
                    <DateTimePicker value={endDate || (startDate || new Date())} minimumDate={startDate || undefined} mode="date" display="default" onChange={(e, d) => { if (d) setEndDate(d); setEndOpen(false) }} />
                  </View>
                )}
              </View>
            </View>
            {activeFilter === 'short' && (
              <View style={styles.filterPanel}>
                <View style={styles.filterGroup}><Text style={styles.filterGroupTitle}>근무 형태</Text>
                  <View style={styles.filterOptions}>
                    <View style={styles.tag}><Text style={styles.tagText}>원격</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>오프라인</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>하이브리드</Text></View>
                  </View>
                </View>
                <View style={styles.filterGroup}><Text style={styles.filterGroupTitle}>요일</Text>
                  <View style={styles.daysRow}>
                    {['월','화','수','목','금','토','일'].map((d) => (
                      <View key={d} style={styles.dayChip}><Text style={styles.dayChipText}>{d}</Text></View>
                    ))}
                  </View>
                </View>
              </View>
            )}
            {activeFilter === 'experts' && (
              <View style={styles.filterPanel}>
                <View style={styles.filterGroup}><Text style={styles.filterGroupTitle}>전문 분야</Text>
                  <View style={styles.filterOptions}>
                    <View style={styles.tag}><Text style={styles.tagText}>ISMS-P</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>ISO 27001</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>클라우드 보안</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>네트워크 보안</Text></View>
                  </View>
                </View>
                <View style={styles.filterGroup}><Text style={styles.filterGroupTitle}>가능 요일</Text>
                  <View style={styles.daysRow}>
                    {['월','화','수','목','금','토','일'].map((d) => (
                      <View key={d} style={styles.dayChip}><Text style={styles.dayChipText}>{d}</Text></View>
                    ))}
                  </View>
                </View>
              </View>
            )}
            {activeFilter === 'education' && (
              <View style={styles.filterPanel}>
                <View style={styles.filterGroup}><Text style={styles.filterGroupTitle}>교육 형태</Text>
                  <View style={styles.filterOptions}>
                    <View style={styles.tag}><Text style={styles.tagText}>온라인</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>오프라인</Text></View>
                  </View>
                </View>
                <View style={styles.filterGroup}><Text style={styles.filterGroupTitle}>교육 요일</Text>
                  <View style={styles.daysRow}>
                    {['월','화','수','목','금','토','일'].map((d) => (
                      <View key={d} style={styles.dayChip}><Text style={styles.dayChipText}>{d}</Text></View>
                    ))}
                  </View>
                </View>
              </View>
            )}
            {activeFilter === 'recruitment' && (
              <View style={styles.filterPanel}>
                <View style={styles.filterGroup}><Text style={styles.filterGroupTitle}>고용 형태</Text>
                  <View style={styles.filterOptions}>
                    <View style={styles.tag}><Text style={styles.tagText}>정규직</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>계약직</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>인턴</Text></View>
                  </View>
                </View>
              </View>
            )}
            <View style={styles.filterFooter}>
              <TouchableOpacity style={styles.resetBtn} activeOpacity={0.8}><Text style={styles.resetBtnText}>초기화</Text></TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} activeOpacity={0.8}><Text style={styles.applyBtnText}>적용</Text></TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.bannerCarousel}>
          <ScrollView
            ref={bannerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth)
              setBannerIndex(index)
            }}
            scrollEventThrottle={16}
          >
            {banners.map((b) => (
              <View key={b.id} style={[styles.bannerSlide, { width: screenWidth, backgroundColor: b.color }]}> 
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>{b.title}</Text>
                  <Text style={styles.bannerDesc}>{b.desc}</Text>
                  <TouchableOpacity style={styles.bannerButton} activeOpacity={0.8}>
                    <Text style={styles.bannerButtonText}>{b.cta}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.bannerDots}>
            {banners.map((b, i) => (
              <TouchableOpacity key={b.id} activeOpacity={0.8} onPress={() => { setBannerIndex(i); bannerRef.current?.scrollTo({ x: i * screenWidth, animated: true }) }}>
                <View style={[styles.bannerDot, i === bannerIndex && styles.bannerDotActive]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.tabNav}>
          {mainTabs.map((t) => {
            const active = activeMainTab === t
            return (
              <TouchableOpacity key={t} style={[styles.tabButton, active && styles.tabButtonActive]} activeOpacity={0.8} onPress={() => setActiveMainTab(t)}>
                <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{t}</Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {activeMainTab === '단기 의뢰' && (
          <>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="fire" size={16} color="#DC2626" /><Text style={styles.sectionTitle}> 긴급 의뢰 </Text></View></View>
            <View style={styles.section}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
                {urgents.map((u) => (
                  <TouchableOpacity key={u.id} style={styles.urgentCard} activeOpacity={0.85} onPress={() => navigation.navigate('ShortTermRequestsDetail', { prev: 'Home' })}>
                    <Text style={styles.urgentBadge}>{u.badge}</Text>
                    <Text style={styles.urgentTitle}>{u.title}</Text>
                    {Array.isArray(u.roles) && u.roles.length > 0 ? (
                      <View style={styles.roleTagsRow}>
                        {u.roles.map((r) => (
                          <View key={r} style={styles.roleTag}><Text style={styles.roleTagText}>{r}</Text></View>
                        ))}
                      </View>
                    ) : null}
                    <Text style={styles.urgentCompany}>{u.company}</Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.urgentPrice}>{u.price}</Text>
                      <Text style={styles.urgentDeadline}>{u.deadline}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="briefcase" size={16} color="#374151" /><Text style={styles.sectionTitle}> 일반 의뢰 </Text></View></View>
            <View style={styles.cardGrid}>
              {generalShort.map((c) => (
                <TouchableOpacity key={c.id} style={styles.gridCard} activeOpacity={0.85} onPress={() => navigation.navigate('ShortTermRequestsDetail', { prev: 'Home' })}>
                  {c.badge ? <Text style={styles.gridBadge}>{c.badge}</Text> : null}
                  <Text style={styles.gridTitle}>{c.title}</Text>
                  {Array.isArray(c.roles) && c.roles.length > 0 ? (
                    <View style={styles.roleTagsRow}>
                      {c.roles.map((r) => (
                        <View key={r} style={styles.roleTag}><Text style={styles.roleTagText}>{r}</Text></View>
                      ))}
                    </View>
                  ) : null}
                  <Text style={styles.gridCompany}>{c.company}</Text>
                  <View style={styles.cardFooter}><Text style={styles.gridPrice}>{c.price}</Text></View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {activeMainTab === '전문가' && (
          <>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="star" size={16} color="#F59E0B" /><Text style={styles.sectionTitle}> 추천 전문가 </Text></View></View>
            <View style={styles.section}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
                {experts.map((e) => (
                  <TouchableOpacity key={e.id} style={styles.expertCard} activeOpacity={0.85} onPress={() => navigation.navigate('ExpertsDetail', { prev: 'Home' })}>
                    {e.badge ? <Text style={styles.expertBadge}>{e.badge}</Text> : null}
                    <Text style={styles.expertTitle}>{e.title}</Text>
                    <Text style={styles.expertCompany}>{e.company}</Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.expertPrice}>{e.price}</Text>
                      <View style={styles.expertRatingRow}>
                        {Array.from({ length: 5 }).map((_, i) => {
                          const filled = e.rating >= i + 1
                          const half = !filled && e.rating > i && e.rating < i + 1
                          return (
                            <FontAwesome5 key={i} name={half ? 'star-half-alt' : filled ? 'star' : 'star'} size={14} color="#F59E0B" />
                          )
                        })}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="users" size={16} color="#374151" /><Text style={styles.sectionTitle}> 전문가 목록 </Text></View></View>
            <View style={styles.cardGrid}>
              {generalExperts.map((c) => (
                <TouchableOpacity key={c.id} style={styles.gridCard} activeOpacity={0.85}  onPress={() => navigation.navigate('ExpertsDetail', { prev: 'Home' })}>
                  {c.badge ? <Text style={styles.gridBadge}>{c.badge}</Text> : null}
                  <Text style={styles.gridTitle}>{c.title}</Text>
                  <Text style={styles.gridCompany}>{c.company}</Text>
                  <View style={styles.cardFooter}><Text style={styles.gridPrice}>{c.price}</Text></View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {activeMainTab === '교육' && (
          <>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="fire" size={16} color="#DC2626" /><Text style={styles.sectionTitle}> 추천 전문교육 </Text></View></View>
            <View style={styles.section}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
                {generalEducation.slice(0,3).map((c) => (
                  <TouchableOpacity key={c.id} style={styles.urgentCard} activeOpacity={0.85} onPress={() => navigation.navigate('EducationDetail', { prev: 'Home' })}>
                    <Text style={styles.urgentBadge}>{c.badge || '추천'}</Text>
                    <Text style={styles.urgentTitle}>{c.title}</Text>
                    <Text style={styles.urgentCompany}>{c.company}</Text>
                    <View style={styles.cardFooter}><Text style={styles.urgentPrice}>{c.price}</Text><Text style={styles.urgentDeadline}>개강 예정</Text></View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="graduation-cap" size={16} color="#374151" /><Text style={styles.sectionTitle}> 전문 교육 과정 </Text></View></View>
            <View style={styles.cardGrid}>
              {generalEducation.map((c) => (
                <TouchableOpacity key={c.id} style={styles.gridCard} activeOpacity={0.85} onPress={() => navigation.navigate('EducationDetail', { prev: 'Home' })}>
                  {c.badge ? <Text style={styles.gridBadge}>{c.badge}</Text> : null}
                  <Text style={styles.gridTitle}>{c.title}</Text>
                  <Text style={styles.gridCompany}>{c.company}</Text>
                  <View style={styles.cardFooter}><Text style={styles.gridPrice}>{c.price}</Text></View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {activeMainTab === '구인' && (
          <>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="fire" size={16} color="#DC2626" /><Text style={styles.sectionTitle}> 긴급 채용 </Text></View></View>
            <View style={styles.section}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
                {generalRecruitment.slice(0,3).map((c) => (
                  <TouchableOpacity key={c.id} style={styles.urgentCard} activeOpacity={0.85}>
                    <Text style={styles.urgentBadge}>{c.badge || '긴급'}</Text>
                    <Text style={styles.urgentTitle}>{c.title}</Text>
                    <Text style={styles.urgentCompany}>{c.company}</Text>
                    <View style={styles.cardFooter}><Text style={styles.urgentPrice}>{c.price}</Text><Text style={styles.urgentDeadline}>마감 임박</Text></View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="briefcase" size={16} color="#374151" /><Text style={styles.sectionTitle}> 채용 공고 </Text></View></View>
            <View style={styles.cardGrid}>
              {generalRecruitment.map((c) => (
                <TouchableOpacity key={c.id} style={styles.gridCard} activeOpacity={0.85}>
                  {c.badge ? <Text style={styles.gridBadge}>{c.badge}</Text> : null}
                  <Text style={styles.gridTitle}>{c.title}</Text>
                  <Text style={styles.gridCompany}>{c.company}</Text>
                  <View style={styles.cardFooter}><Text style={styles.gridPrice}>{c.price}</Text></View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  appHeader: { height: 60, backgroundColor: '#FFFFFF', paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notificationWrapper: { position: 'relative', marginRight: 12 },
  notificationBadge: { position: 'absolute', top: -6, right: -10, backgroundColor: '#DC2626', borderRadius: 10, paddingHorizontal: 5, paddingVertical: 2 },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },

  content: { paddingBottom: 20 },

  searchSection: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 16 },
  searchTitle: { fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 12 },
  searchControls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12 },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 24, alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6 },
  searchInput: { flex: 1, fontSize: 14, color: '#111827', paddingVertical: 6 },
  searchButton: { backgroundColor: '#2563EB', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginLeft: 8 },
  searchButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  detailedSearchButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  detailedSearchButtonActive: { backgroundColor: '#2563EB' },
  quickFilters: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F3F4F6' },
  filterChipActive: { backgroundColor: '#2563EB' },
  filterChipText: { fontSize: 13, color: '#374151', fontWeight: '700' },
  filterChipTextActive: { color: '#FFFFFF' },

  expandedSearch: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12 },
  filterPanel: { gap: 12 },
  filterGroup: { marginBottom: 8 },
  filterGroupTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 8 },
  filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F3F4F6' },
  tagText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F3F4F6' },
  dayChipText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  filterFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  resetBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F3F4F6' },
  resetBtnText: { fontSize: 13, color: '#374151', fontWeight: '700' },
  applyBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#2563EB' },
  applyBtnText: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
  optionsRow: { paddingRight: 16, flexDirection: 'row', gap: 8 },
  optionChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F3F4F6' },
  optionChipActive: { backgroundColor: '#2563EB' },
  optionChipText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  optionChipTextActive: { color: '#FFFFFF' },
  dateRow: { flexDirection: 'row', gap: 8 },
  selectBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  selectValue: { fontSize: 13, color: '#111827', fontWeight: '600' },
  dropdown: { marginTop: 6, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 8 },
  dropdownScroll: { maxHeight: 220 },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 10 },
  dropdownItemActive: { backgroundColor: '#F3F4F6' },
  dropdownItemText: { fontSize: 13, color: '#374151' },
  dropdownItemTextActive: { fontWeight: '700', color: '#111827' },

  bannerCarousel: { backgroundColor: '#FFFFFF', marginBottom: 16 },
  bannerSlide: { height: 180, alignItems: 'center', justifyContent: 'center' },
  bannerContent: { width: '80%', alignItems: 'center' },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
  bannerDesc: { fontSize: 13, color: '#FFFFFF', marginBottom: 12, textAlign: 'center' },
  bannerButton: { borderWidth: 1, borderColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  bannerButtonText: { color: '#FFFFFF', fontWeight: '700' },
  bannerDots: { position: 'absolute', bottom: 10, width: '100%', flexDirection: 'row', justifyContent: 'center' },
  bannerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 4 },
  bannerDotActive: { backgroundColor: '#FFFFFF' },

  tabNav: { backgroundColor: '#FFFFFF', flexDirection: 'row' },
  tabButton: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  tabButtonActive: {},
  tabButtonText: { fontSize: 14, color: '#374151', fontWeight: '600' },
  tabButtonTextActive: { color: '#2563EB', fontWeight: '700' },

  section: { paddingHorizontal: 16, paddingVertical: 12 },
  hScroll: { paddingRight: 16 },

  sectionHeader: { paddingHorizontal: 16, paddingTop: 8 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginLeft: 6 },

  urgentCard: { minWidth: 280, backgroundColor: '#FFFFFF', borderRadius: 8, padding: 14, marginRight: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  urgentBadge: { alignSelf: 'flex-start', fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: '#F59E0B', color: '#111827', fontWeight: '700', marginBottom: 8 },
  urgentTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  urgentCompany: { fontSize: 13, color: '#6B7280', marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  urgentPrice: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  urgentDeadline: { fontSize: 12, color: '#DC2626' },

  expertCard: { minWidth: 280, backgroundColor: '#FFFFFF', borderRadius: 8, padding: 14, marginRight: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  expertBadge: { alignSelf: 'flex-start', fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: '#F59E0B', color: '#111827', fontWeight: '700', marginBottom: 8 },
  expertTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  expertCompany: { fontSize: 13, color: '#6B7280', marginBottom: 10 },
  expertPrice: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  roleTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  roleTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: '#E5E7EB' },
  roleTagText: { fontSize: 12, color: '#6B7280' },
  expertRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },

  cardGrid: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridCard: { width: '47%', backgroundColor: '#FFFFFF', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  gridBadge: { alignSelf: 'flex-start', fontSize: 11, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: '#F59E0B', color: '#111827', fontWeight: '700', marginBottom: 6 },
  gridTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  gridCompany: { fontSize: 12, color: '#6B7280', marginBottom: 10 },
  gridPrice: { fontSize: 13, fontWeight: '700', color: '#2563EB' },

  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' },
  
  sideDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 },
})
