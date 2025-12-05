import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type TabCode = 'company' | 'project' | 'expert' | 'education' | 'trainee' | 'job' | 'notice'

type BookmarkItem = {
  id: number
  title: string
  desc: string
  thumbUri?: string
  iconName?: string
  price?: string
  metaTags?: string[]
  badge?: string
  badgeType?: 'new' | 'hot' | 'urgent'
  rating?: string
  ratingCount?: number
}

export default function BookmarkList() {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()

  const [activeTab, setActiveTab] = useState<TabCode>('company')
  const [search, setSearch] = useState('')

  const companies = useMemo<BookmarkItem[]>(() => ([
    { id: 1, title: '테크솔루션즈', desc: 'IT/소프트웨어 · 50-100명 · 서울 강남구', thumbUri: 'https://picsum.photos/seed/comp1/100/100', metaTags: ['저장: 2024.12.01'], badge: '채용중', badgeType: 'new' },
    { id: 2, title: '그린마케팅', desc: '마케팅/광고 · 10-50명 · 서울 마포구', thumbUri: 'https://picsum.photos/seed/comp2/100/100', metaTags: ['저장: 2024.11.28'] },
    { id: 3, title: '파이낸스플러스', desc: '금융/핀테크 · 100-200명 · 서울 여의도', thumbUri: 'https://picsum.photos/seed/comp3/100/100', metaTags: ['저장: 2024.11.20'] },
  ]), [])

  const projects = useMemo<BookmarkItem[]>(() => ([
    { id: 11, title: '스타트업 IR 자료 작성 지원', desc: '인노베이션랩 · IR, 투자유치, 재무모델링', iconName: 'chart-line', price: '300-500만원', metaTags: ['4주'], badge: 'D-3', badgeType: 'urgent' },
    { id: 12, title: 'B2B SaaS 제품 UI/UX 개선', desc: '소프트웨어웍스 · UI/UX, 사용자경험, 프로토타이핑', iconName: 'palette', price: '200-300만원', metaTags: ['3주', 'D-7'] },
    { id: 13, title: '온라인 쇼핑몰 마케팅 전략 컨설팅', desc: '패션플레이스 · 마케팅, 성장전략, 콘텐츠기획', iconName: 'bullhorn', price: '150-250만원', metaTags: ['2주', 'D-15'] },
    { id: 14, title: '모바일 앱 MVP 개발', desc: '헬스케어스타트업 · React Native, Firebase', iconName: 'code', price: '500-800만원', metaTags: ['8주', 'D-21'] },
  ]), [])

  const experts = useMemo<BookmarkItem[]>(() => ([
    { id: 21, title: '이영희', desc: '재무 컨설턴트 · 재무모델링, IR, 투자유치', thumbUri: 'https://picsum.photos/seed/expert1/100/100', rating: '4.8', ratingCount: 23, price: '15만원/시간' },
    { id: 22, title: '박준호', desc: '마케팅 전문가 · 성장마케팅, 콘텐츠전략, 브랜딩', thumbUri: 'https://picsum.photos/seed/expert2/100/100', rating: '5.0', ratingCount: 15, price: '12만원/시간', badge: '인기', badgeType: 'hot' },
    { id: 23, title: '최유진', desc: 'UI/UX 디자이너 · UI디자인, UX리서치, 프로토타이핑', thumbUri: 'https://picsum.photos/seed/expert3/100/100', rating: '4.2', ratingCount: 8, price: '10만원/시간' },
    { id: 24, title: '김선우', desc: 'HR 전문가 · 인사제도, 조직문화, 성과관리', thumbUri: 'https://picsum.photos/seed/expert4/100/100', rating: '4.6', ratingCount: 12, price: '8만원/시간' },
    { id: 25, title: '정다은', desc: '데이터 분석가 · Python, SQL, 데이터시각화', thumbUri: 'https://picsum.photos/seed/expert5/100/100', rating: '4.9', ratingCount: 31, price: '13만원/시간' },
  ]), [])

  const educations = useMemo<BookmarkItem[]>(() => ([
    { id: 31, title: '프리랜서를 위한 세무/법무 가이드', desc: '박세무 세무사 · 온라인 강의', iconName: 'file-invoice-dollar', price: '15만원', metaTags: ['시작: 2024.12.10'] },
    { id: 32, title: '시니어 PM을 위한 리더십 워크숍', desc: '김리더 전 이베이코리아 PM · 오프라인 워크숍', iconName: 'users', price: '25만원', metaTags: ['시작: 2024.12.15'], badge: '인기', badgeType: 'hot' },
    { id: 33, title: '데이터 기반 제품 전략 수립', desc: '이데이터 전 네이버 데이터 분석가 · 온라인 강의', iconName: 'chart-bar', price: '20만원', metaTags: ['시작: 2025.01.05'] },
  ]), [])

  const trainees = useMemo<BookmarkItem[]>(() => ([
    { id: 41, title: '정민우', desc: '백엔드 개발자 양성과정 · 스파르타코딩클럽', thumbUri: 'https://picsum.photos/seed/trainee4/100/100', metaTags: ['경희대 소프트웨어융합학과', 'Java', 'Spring', 'MySQL'] },
    { id: 42, title: '한소희', desc: '디지털 마케팅 전문가 과정 · 구글 아카데미', thumbUri: 'https://picsum.photos/seed/trainee5/100/100', metaTags: ['이화여대 경영학과', 'Google Ads', 'SEO', 'GA4'] },
    { id: 43, title: '오준혁', desc: '클라우드 엔지니어 양성과정 · AWS 교육센터', thumbUri: 'https://picsum.photos/seed/trainee6/100/100', metaTags: ['KAIST 전산학부', 'AWS', 'K8s', 'Linux'] },
  ]), [])

  const jobs = useMemo<BookmarkItem[]>(() => ([
    { id: 51, title: '시니어 프로덕트 매니저', desc: '테크혁신 · 정규직 · 서울', thumbUri: 'https://picsum.photos/seed/job1/100/100', price: '7,000-9,000만원', metaTags: ['PM', 'Agile'], badge: 'D-5', badgeType: 'urgent' },
    { id: 52, title: '마케팅 리드', desc: '그로스컴퍼니 · 계약직 6개월 · 서울', thumbUri: 'https://picsum.photos/seed/job2/100/100', price: '5,500-7,000만원', metaTags: ['디지털마케팅', '팀관리'] },
    { id: 53, title: '프론트엔드 개발자', desc: '디자인스튜디오 · 정규직 · 서울/재택', thumbUri: 'https://picsum.photos/seed/job3/100/100', price: '5,000-7,000만원', metaTags: ['React', 'TypeScript'] },
    { id: 54, title: '데이터 분석가 (주니어)', desc: '핀테크랩 · 정규직 · 판교', thumbUri: 'https://picsum.photos/seed/job4/100/100', price: '4,000-5,500만원', metaTags: ['Python', 'SQL'] },
  ]), [])

  const notices = useMemo<BookmarkItem[]>(() => ([
    { id: 61, title: '[중요] 2024년 연말 정산 안내', desc: '프리랜서 분들을 위한 연말정산 가이드를 안내드립니다.', iconName: 'bullhorn', metaTags: ['2024.12.01', '조회 1,234'], badge: 'NEW', badgeType: 'new' },
    { id: 62, title: '전시(專時) 겨울 이벤트 안내', desc: '첫 프로젝트 등록 시 수수료 50% 할인 이벤트', iconName: 'gift', metaTags: ['2024.11.25', '조회 2,567'] },
  ]), [])

  const tabs = useMemo(() => ([
    { code: 'company' as TabCode, label: '기업', icon: 'building', count: companies.length },
    { code: 'project' as TabCode, label: '단기 의뢰', icon: 'briefcase', count: projects.length },
    { code: 'expert' as TabCode, label: '전문가', icon: 'user-tie', count: experts.length },
    { code: 'education' as TabCode, label: '교육', icon: 'graduation-cap', count: educations.length },
    { code: 'trainee' as TabCode, label: '교육생', icon: 'user-graduate', count: trainees.length },
    { code: 'job' as TabCode, label: '채용 공고', icon: 'clipboard-list', count: jobs.length },
    { code: 'notice' as TabCode, label: '공지', icon: 'bell', count: notices.length },
  ]), [companies.length, projects.length, experts.length, educations.length, trainees.length, jobs.length, notices.length])

  const dataByTab = useMemo(() => ({
    company: companies,
    project: projects,
    expert: experts,
    education: educations,
    trainee: trainees,
    job: jobs,
    notice: notices,
  }), [companies, projects, experts, educations, trainees, jobs, notices])

  const goBackSmart = () => {
    if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
      ;(navigation as any).goBack()
      return
    }
    navigation.navigate('RecruitmentList')
  }

  const removeItem = (id: number) => {
    Alert.alert('삭제', '해당 항목을 북마크에서 제거했습니다.')
  }

  const filtered = useMemo(() => {
    const items = dataByTab[activeTab]
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) => it.title.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q) || (it.metaTags || []).some((m) => m.toLowerCase().includes(q)))
  }, [activeTab, dataByTab, search])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>북마크</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.section}> 
          <View style={styles.pageTitle}>
            <Text style={styles.pageTitleText}>저장한 항목을 확인하고 관리하세요</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabNav}>
            {tabs.map((t) => (
              <TouchableOpacity key={`tab-${t.code}`} style={[styles.tabBtn, activeTab === t.code && styles.tabBtnOn]} onPress={() => setActiveTab(t.code)}>
                <FontAwesome5 name={t.icon as any} size={14} color={activeTab === t.code ? '#FFFFFF' : '#6B7280'} />
                <Text style={[styles.tabBtnText, activeTab === t.code && styles.tabBtnTextOn]}>{t.label}</Text>
                <View style={[styles.tabCount, activeTab === t.code && styles.tabCountOn]}><Text style={[styles.tabCountText, activeTab === t.code && styles.tabCountTextOn]}>{t.count}</Text></View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.filterBar}>
            <View style={styles.searchBox}>
              <FontAwesome5 name="search" size={14} color="#6B7280" style={{ position: 'absolute', left: 12, top: 12 }} />
              <TextInput style={[styles.input, { paddingLeft: 34 }]} value={search} onChangeText={setSearch} placeholder={
                activeTab === 'company' ? '기업명 검색' : activeTab === 'project' ? '프로젝트 검색' : activeTab === 'expert' ? '전문가 검색' : activeTab === 'education' ? '교육 과정 검색' : activeTab === 'trainee' ? '교육생 검색' : activeTab === 'job' ? '채용 공고 검색' : '공지 검색'
              } />
            </View>
            <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8} onPress={() => Alert.alert('정렬', '정렬 옵션은 실제 서비스에서 제공됩니다.')}>
              <FontAwesome5 name="sort" size={14} color="#374151" />
              <Text style={styles.filterBtnText}>정렬</Text>
            </TouchableOpacity>
          </View>

          <View style={{ rowGap: 12 }}>
            {filtered.length === 0 ? (
              <View style={styles.emptyState}><FontAwesome5 name="inbox" size={48} color="#D1D5DB" /><Text style={styles.emptyTitle}>저장된 항목이 없습니다</Text></View>
            ) : (
              filtered.map((it) => (
                <View key={`it-${activeTab}-${it.id}`} style={styles.listItem}>
                  <View style={[styles.itemThumb, (activeTab === 'expert' || activeTab === 'trainee') && styles.itemThumbCircle]}>
                    {it.thumbUri ? (<Image source={{ uri: it.thumbUri }} style={styles.thumbImage} />) : (<FontAwesome5 name={(it.iconName || 'folder') as any} size={20} color="#6B7280" />)}
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={styles.itemTitleRow}>
                      <Text numberOfLines={1} style={styles.itemTitle}>{it.title}</Text>
                      {it.badge ? (
                        <View style={[styles.badge, it.badgeType === 'new' ? styles.badgeNew : it.badgeType === 'hot' ? styles.badgeHot : styles.badgeUrgent]}>
                          <Text style={styles.badgeText}>{it.badge}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text numberOfLines={1} style={styles.itemDesc}>{it.desc}</Text>
                    <View style={styles.itemMetaRow}>
                      {it.rating ? (
                        <View style={styles.ratingRow}><FontAwesome5 name="star" size={12} color="#F59E0B" /><Text style={styles.ratingText}>{it.rating}</Text><Text style={styles.ratingCountText}>({it.ratingCount})</Text></View>
                      ) : null}
                      {it.price ? (<Text style={styles.price}>{it.price}</Text>) : null}
                      {(it.metaTags || []).map((m, i) => (
                        <View key={`mt-${it.id}-${i}`} style={styles.metaTag}><FontAwesome5 name="tag" size={11} color="#6B7280" /><Text style={styles.metaTagText}>{m}</Text></View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.itemActions}>
                    {activeTab === 'company' ? (
                      <TouchableOpacity style={styles.btnOutline} onPress={() => Alert.alert('상세보기', '기업 상세 화면은 실제 서비스에서 제공됩니다.')}><Text style={styles.btnOutlineText}>상세보기</Text></TouchableOpacity>
                    ) : null}
                    {activeTab === 'project' ? (
                      <TouchableOpacity style={styles.btnPrimary} onPress={() => Alert.alert('지원', '프로젝트 지원 기능은 실제 서비스에서 제공됩니다.')}><Text style={styles.btnPrimaryText}>지원하기</Text></TouchableOpacity>
                    ) : null}
                    {activeTab === 'expert' ? (
                      <TouchableOpacity style={styles.btnOutline} onPress={() => Alert.alert('프로필', '전문가 프로필은 실제 서비스에서 제공됩니다.')}><Text style={styles.btnOutlineText}>프로필</Text></TouchableOpacity>
                    ) : null}
                    {activeTab === 'expert' ? (
                      <TouchableOpacity style={styles.btnPrimary} onPress={() => Alert.alert('협업요청', '협업 요청은 실제 서비스에서 제공됩니다.')}><Text style={styles.btnPrimaryText}>협업요청</Text></TouchableOpacity>
                    ) : null}
                    {activeTab === 'education' ? (
                      <TouchableOpacity style={styles.btnPrimary} onPress={() => Alert.alert('수강신청', '수강신청은 실제 서비스에서 제공됩니다.')}><Text style={styles.btnPrimaryText}>수강신청</Text></TouchableOpacity>
                    ) : null}
                    {activeTab === 'trainee' ? (
                      <TouchableOpacity style={styles.btnOutline} onPress={() => Alert.alert('프로필', '교육생 프로필은 실제 서비스에서 제공됩니다.')}><Text style={styles.btnOutlineText}>프로필</Text></TouchableOpacity>
                    ) : null}
                    {activeTab === 'trainee' ? (
                      <TouchableOpacity style={styles.btnPrimary} onPress={() => Alert.alert('채용제안', '채용 제안은 실제 서비스에서 제공됩니다.')}><Text style={styles.btnPrimaryText}>채용제안</Text></TouchableOpacity>
                    ) : null}
                    {activeTab === 'job' ? (
                      <TouchableOpacity style={styles.btnPrimary} onPress={() => Alert.alert('지원', '채용 공고 지원은 실제 서비스에서 제공됩니다.')}><Text style={styles.btnPrimaryText}>지원하기</Text></TouchableOpacity>
                    ) : null}
                    {activeTab === 'notice' ? (
                      <TouchableOpacity style={styles.btnOutline} onPress={() => Alert.alert('자세히', '공지 상세는 실제 서비스에서 제공됩니다.')}><Text style={styles.btnOutlineText}>자세히</Text></TouchableOpacity>
                    ) : null}
                    <TouchableOpacity style={styles.btnIcon} onPress={() => removeItem(it.id)}><FontAwesome5 name="trash" size={14} color="#EF4444" /></TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { height: 60, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  section: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginHorizontal: 15, marginTop: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  pageTitle: { marginBottom: 12 },
  pageTitleText: { fontSize: 14, color: '#6B7280' },

  tabNav: { columnGap: 6, paddingVertical: 6 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', columnGap: 6, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, marginRight: 6 },
  tabBtnOn: { backgroundColor: '#5B5FEF', borderColor: '#5B5FEF' },
  tabBtnText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  tabBtnTextOn: { color: '#FFFFFF' },
  tabCount: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: '#F3F4F6' },
  tabCountOn: { backgroundColor: 'rgba(255,255,255,0.25)' },
  tabCountText: { fontSize: 12, color: '#6B7280' },
  tabCountTextOn: { color: '#FFFFFF' },

  filterBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 },
  searchBox: { flex: 1, maxWidth: 320 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#FFFFFF' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', columnGap: 6, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF', marginLeft: 8 },
  filterBtnText: { fontSize: 13, color: '#374151', fontWeight: '600' },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 14, color: '#6B7280', marginTop: 8 },

  listItem: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', columnGap: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  itemThumb: { width: 48, height: 48, borderRadius: 10, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  itemThumbCircle: { borderRadius: 24 },
  thumbImage: { width: 48, height: 48 },

  itemTitleRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  itemTitle: { fontSize: 15, color: '#111827', fontWeight: '700' },
  itemDesc: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  itemMetaRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12, flexWrap: 'wrap', marginTop: 6 },
  price: { fontSize: 15, color: '#5B5FEF', fontWeight: '700' },
  metaTag: { flexDirection: 'row', alignItems: 'center', columnGap: 4 },
  metaTagText: { fontSize: 12, color: '#6B7280' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', columnGap: 4 },
  ratingText: { fontSize: 13, color: '#F59E0B', fontWeight: '700' },
  ratingCountText: { fontSize: 12, color: '#374151' },

  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
  badgeNew: { backgroundColor: '#10B981' },
  badgeHot: { backgroundColor: '#EF4444' },
  badgeUrgent: { backgroundColor: '#F59E0B' },

  itemActions: { flexDirection: 'row', alignItems: 'center', columnGap: 8, flexShrink: 0 },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 13, fontWeight: '600' },
  btnIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
})

