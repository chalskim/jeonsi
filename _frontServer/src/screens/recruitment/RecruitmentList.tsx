import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type TabKey = 'active' | 'scheduled' | 'closed'
type SortKey = 'recent' | 'deadline' | 'applicants' | 'title'

type RecruitmentItem = {
  id: number
  title: string
  company: string
  location: string
  type: string
  experience: string
  dday?: string
  applicants: number
  views: number
  bookmarks: number
  deadline?: string
  startDate?: string
  endDate?: string
  scheduled?: boolean
}

export default function RecruitmentList() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [activeTab, setActiveTab] = useState<TabKey>('active')
  const [search, setSearch] = useState('')
  const [sortOpen, setSortOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortKey>('recent')
  const [filterOpen, setFilterOpen] = useState(false)
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([])
  const [experienceLevels, setExperienceLevels] = useState<string[]>([])

  const activeItems = useMemo<RecruitmentItem[]>(() => [
    { id: 1, title: '보안 컨설턴트 (정규직)', company: '정보보안팀', location: '경기 성남시', type: '정규직', experience: '5년 이상', dday: 'D-7', applicants: 45, views: 1234, bookmarks: 23, deadline: '2024.03.15' },
    { id: 2, title: '클라우드 엔지니어 (계약직)', company: '인프라팀', location: '서울 강남구', type: '계약직', experience: '3년 이상', dday: 'D-15', applicants: 32, views: 892, bookmarks: 15, deadline: '2024.03.23' },
  ], [])

  const scheduledItems = useMemo<RecruitmentItem[]>(() => [
    { id: 3, title: '프론트엔드 개발자 (정규직)', company: '개발팀', location: '서울', type: '정규직', experience: '3년 이상', applicants: 0, views: 0, bookmarks: 0, startDate: '2024.03.20', endDate: '2024.04.20', scheduled: true },
    { id: 4, title: '데이터 분석가 (정규직)', company: '데이터팀', location: '판교', type: '정규직', experience: '신입/경력무관', applicants: 0, views: 0, bookmarks: 0, startDate: '2024.04.01', endDate: '2024.04.30', scheduled: true },
  ], [])

  const closedItems = useMemo<RecruitmentItem[]>(() => [
    { id: 5, title: '백엔드 개발자 (정규직)', company: '개발팀', location: '서울', type: '정규직', experience: '5년 이상', applicants: 78, views: 2156, bookmarks: 41, deadline: '2024.02.28' },
    { id: 6, title: 'UI/UX 디자이너 (계약직)', company: '디자인팀', location: '판교', type: '계약직', experience: '3년 이상', applicants: 56, views: 1432, bookmarks: 28, deadline: '2024.02.15' },
  ], [])

  const allByTab = useMemo(() => ({ active: activeItems, scheduled: scheduledItems, closed: closedItems }), [activeItems, scheduledItems, closedItems])

  const toggleSet = (arr: string[], value: string, setter: (v: string[]) => void) => {
    setter(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value])
  }

  const filteredSortedItems = useMemo(() => {
    const source = allByTab[activeTab]
    const filtered = source.filter((item) => {
      const s = search.trim().toLowerCase()
      const matchText = !s || [item.title, item.company, item.location].some((t) => t.toLowerCase().includes(s))
      const matchType = employmentTypes.length === 0 || employmentTypes.includes(item.type)
      const matchExp = experienceLevels.length === 0 || experienceLevels.includes(item.experience)
      return matchText && matchType && matchExp
    })
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return (b.id || 0) - (a.id || 0)
        case 'deadline':
          return (a.deadline?.localeCompare(b.deadline || '') || 0)
        case 'applicants':
          return b.applicants - a.applicants
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })
    return sorted
  }, [activeTab, allByTab, search, employmentTypes, experienceLevels, sortBy])

  const onAction = (action: string, item: RecruitmentItem) => {
    switch (action) {
      case '수정':
        Alert.alert('안내', '수정 화면으로 이동합니다.')
        break
      case '지원자 보기':
        Alert.alert('안내', '지원자 보기로 이동합니다.')
        break
      case '일시중지':
        Alert.alert('안내', '공고가 일시중지되었습니다.')
        break
      case '삭제':
        Alert.alert('안내', '공고가 삭제되었습니다.')
        break
      case '지금 시작':
        Alert.alert('안내', '예정 공고를 시작합니다.')
        break
      case '통계':
        Alert.alert('안내', '통계 화면으로 이동합니다.')
        break
      case '다운로드':
        Alert.alert('안내', '지원자 목록을 다운로드합니다.')
        break
      case '재게시':
        Alert.alert('안내', '공고가 재게시되었습니다.')
        break
      default:
        break
    }
  }

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

  const TabButton = ({ label, tab, count }: { label: string; tab: TabKey; count: number }) => (
    <TouchableOpacity style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]} onPress={() => setActiveTab(tab)}>
      <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>{label}</Text>
      <View style={styles.tabCount}><Text style={styles.tabCountText}>{count}</Text></View>
    </TouchableOpacity>
  )

  const SortSelector = () => (
    <View style={{ width: 160 }}>
      <View style={styles.selector}>
        <TouchableOpacity style={styles.selectorBox} activeOpacity={0.8} onPress={() => setSortOpen((v) => !v)}>
          <Text style={styles.selectorText}>{sortBy === 'recent' ? '최신순' : sortBy === 'deadline' ? '마감임박순' : sortBy === 'applicants' ? '지원자 많은순' : '제목순'}</Text>
          <FontAwesome5 name={sortOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
        </TouchableOpacity>
        {sortOpen && (
          <View style={styles.selectorList}>
            {([
              { code: 'recent', name: '최신순' },
              { code: 'deadline', name: '마감임박순' },
              { code: 'applicants', name: '지원자 많은순' },
              { code: 'title', name: '제목순' },
            ] as Array<{ code: SortKey; name: string }>).map((opt) => (
              <TouchableOpacity key={`sort-${opt.code}`} style={styles.selectorItem} onPress={() => { setSortBy(opt.code); setSortOpen(false) }}>
                <Text style={styles.selectorItemText}>{opt.name}</Text>
                <Text style={styles.selectorItemCode}>{opt.code}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  )

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 name="briefcase" size={48} color="#6B7280" />
      <Text style={styles.emptyTitle}>등록된 채용 공고가 없습니다</Text>
      <Text style={styles.emptyDesc}>첫 채용 공고를 등록해보세요</Text>
      <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('RecruitmentInput', { prev: 'RecruitmentList' })}> 
        <FontAwesome5 name="plus" size={12} color="#FFFFFF" />
        <Text style={styles.btnPrimaryText}>채용 공고 등록</Text>
      </TouchableOpacity>
    </View>
  )

  const Card = ({ item }: { item: RecruitmentItem }) => (
    <TouchableOpacity style={[styles.card, item.scheduled && styles.cardScheduled]} activeOpacity={0.85} onPress={() => navigation.navigate('RecruitmentDetail', { item, prev: 'RecruitmentList' })}> 
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleSection}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardCompany}>{item.company} • {item.location}</Text>
          <View style={styles.cardTagsRow}>
            {item.scheduled ? (
              <View style={[styles.tag, styles.tagScheduled]}><Text style={styles.tagTextScheduled}>예정</Text></View>
            ) : null}
            <View style={[styles.tag, styles.tagStatus]}><Text style={styles.tagText}>{item.type}</Text></View>
            <View style={[styles.tag, styles.tagStatus]}><Text style={styles.tagText}>{item.experience}</Text></View>
            {item.dday ? (
              <View style={[styles.tag, styles.tagUrgent]}><Text style={styles.tagTextUrgent}>{item.dday}</Text></View>
            ) : null}
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={() => onAction('수정', item)}>
            <FontAwesome5 name="edit" size={12} color="#FFFFFF" />
            <Text style={[styles.actionText, styles.actionTextPrimary]}>수정</Text>
          </TouchableOpacity>
          {activeTab !== 'closed' ? (
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('RecruitmentApplicantForms', { item, prev: 'RecruitmentList' })}>
              <FontAwesome5 name="users" size={12} color="#2563EB" />
              <Text style={styles.actionText}>지원자 보기</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.actionBtn} onPress={() => onAction('통계', item)}>
              <FontAwesome5 name="chart-bar" size={12} color="#2563EB" />
              <Text style={styles.actionText}>통계</Text>
            </TouchableOpacity>
          )}
          {activeTab === 'active' ? (
            <TouchableOpacity style={styles.actionBtn} onPress={() => onAction('일시중지', item)}>
              <FontAwesome5 name="pause" size={12} color="#2563EB" />
              <Text style={styles.actionText}>일시중지</Text>
            </TouchableOpacity>
          ) : null}
          {activeTab === 'scheduled' ? (
            <TouchableOpacity style={styles.actionBtn} onPress={() => onAction('지금 시작', item)}>
              <FontAwesome5 name="play" size={12} color="#2563EB" />
              <Text style={styles.actionText}>지금 시작</Text>
            </TouchableOpacity>
          ) : null}
          {activeTab === 'closed' ? (
            <TouchableOpacity style={styles.actionBtn} onPress={() => onAction('다운로드', item)}>
              <FontAwesome5 name="download" size={12} color="#2563EB" />
              <Text style={styles.actionText}>다운로드</Text>
            </TouchableOpacity>
          ) : null}
          {activeTab === 'closed' ? (
            <TouchableOpacity style={styles.actionBtn} onPress={() => onAction('재게시', item)}>
              <FontAwesome5 name="redo" size={12} color="#2563EB" />
              <Text style={styles.actionText}>재게시</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={() => onAction('삭제', item)}>
            <FontAwesome5 name="trash" size={12} color="#FFFFFF" />
            <Text style={[styles.actionText, styles.actionTextDanger]}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cardContent}>
        {activeTab === 'scheduled' ? (
          <View style={styles.cardStatsRow}>
            <View style={styles.cardStat}><FontAwesome5 name="clock" size={12} color="#2563EB" /><Text style={styles.cardStatText}>{item.startDate} 시작 예정</Text></View>
          </View>
        ) : (
          <View style={styles.cardStatsRow}>
            <View style={styles.cardStat}><FontAwesome5 name="users" size={12} color="#2563EB" /><Text style={styles.cardStatText}>{item.applicants}명 지원</Text></View>
            <View style={styles.cardStat}><FontAwesome5 name="eye" size={12} color="#2563EB" /><Text style={styles.cardStatText}>{item.views} 조회</Text></View>
            <View style={styles.cardStat}><FontAwesome5 name="bookmark" size={12} color="#2563EB" /><Text style={styles.cardStatText}>{item.bookmarks} 저장</Text></View>
          </View>
        )}
        <View style={styles.cardDateRow}>
          {activeTab === 'scheduled' ? (
            <View style={styles.cardDate}><FontAwesome5 name="calendar-plus" size={12} color="#6B7280" /><Text style={styles.cardDateText}>{item.startDate} ~ {item.endDate}</Text></View>
          ) : (
            <View style={styles.cardDate}><FontAwesome5 name="calendar" size={12} color="#6B7280" /><Text style={styles.cardDateText}>{item.deadline} 마감</Text></View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>채용등록 목록</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        <View style={styles.tabNav}>
          <View style={styles.tabRow}>
            <TabButton label="진행 중" tab="active" count={activeItems.length} />
            <TabButton label="예정" tab="scheduled" count={scheduledItems.length} />
            <TabButton label="마감" tab="closed" count={closedItems.length} />
          </View>
        </View>

        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            <View style={{ flex: 1, position: 'relative' }}>
              <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="공고 제목, 부서 검색..." />
              <View style={styles.searchIcon}><FontAwesome5 name="search" size={14} color="#6B7280" /></View>
            </View>
            <TouchableOpacity style={styles.filterButton} onPress={() => setFilterOpen(true)}>
              <FontAwesome5 name="filter" size={14} color="#374151" />
            </TouchableOpacity>
            <SortSelector />
          </View>
        </View>

        {filteredSortedItems.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.listWrap}>
            {filteredSortedItems.map((it) => (
              <Card key={`rec-${it.id}`} item={it} />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.fabWrap}>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('RecruitmentInput', { prev: 'RecruitmentList' })}> 
          <FontAwesome5 name="plus" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Modal visible={filterOpen} transparent animationType="fade" onRequestClose={() => setFilterOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>상세 필터</Text>
              <TouchableOpacity onPress={() => setFilterOpen(false)}><FontAwesome5 name="times" size={18} color="#6B7280" /></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <View style={{ rowGap: 16 }}>
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>고용 형태</Text>
                  <View style={styles.optionRow}>
                    {[
                      { code: '정규직', label: '정규직' },
                      { code: '계약직', label: '계약직' },
                      { code: '인턴', label: '인턴' },
                      { code: '파트타임', label: '파트타임' },
                    ].map((opt) => (
                      <TouchableOpacity key={`emp-${opt.code}`} style={[styles.optionChip, employmentTypes.includes(opt.code) && styles.optionChipOn]} onPress={() => toggleSet(employmentTypes, opt.code, setEmploymentTypes)}>
                        <Text style={[styles.optionChipText, employmentTypes.includes(opt.code) && styles.optionChipTextOn]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>경력</Text>
                  <View style={styles.optionRow}>
                    {[
                      { code: '신입/경력무관', label: '신입/경력무관' },
                      { code: '1년 이상', label: '1년 이상' },
                      { code: '3년 이상', label: '3년 이상' },
                      { code: '5년 이상', label: '5년 이상' },
                    ].map((opt) => (
                      <TouchableOpacity key={`exp-${opt.code}`} style={[styles.optionChip, experienceLevels.includes(opt.code) && styles.optionChipOn]} onPress={() => toggleSet(experienceLevels, opt.code, setExperienceLevels)}>
                        <Text style={[styles.optionChipText, experienceLevels.includes(opt.code) && styles.optionChipTextOn]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnOutline} onPress={() => { setEmploymentTypes([]); setExperienceLevels([]) }}>
                <Text style={styles.btnOutlineText}>초기화</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => setFilterOpen(false)}>
                <Text style={styles.btnPrimaryText}>적용</Text>
              </TouchableOpacity>
            </View>
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

  statsBar: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700', color: '#2563EB' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },

  tabNav: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tabRow: { flexDirection: 'row' },
  tabButton: { flex: 1, minWidth: 100, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent', position: 'relative' },
  tabButtonActive: { borderBottomColor: '#2563EB' },
  tabButtonText: { fontSize: 14, color: '#111827' },
  tabButtonTextActive: { fontWeight: '700', color: '#2563EB' },
  tabCount: { position: 'absolute', top: 6, right: 12, backgroundColor: '#DC2626', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  tabCountText: { fontSize: 10, color: '#FFFFFF', fontWeight: '700' },

  filterSection: { backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  filterRow: { flexDirection: 'row', alignItems: 'center', columnGap: 10 },
  searchInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8, fontSize: 14, backgroundColor: '#FFFFFF' },
  searchIcon: { position: 'absolute', right: 12, top: 8, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  filterButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },

  selector: { rowGap: 8 },
  selectorBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF' },
  selectorText: { fontSize: 14, color: '#111827', fontWeight: '600' },
  selectorList: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  selectorItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  selectorItemText: { fontSize: 14, color: '#111827' },
  selectorItemCode: { fontSize: 12, color: '#6B7280' },

  listWrap: { paddingHorizontal: 15, paddingVertical: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  cardScheduled: { borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitleSection: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  cardCompany: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  cardTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagStatus: { backgroundColor: '#F8FAFC' },
  tagScheduled: { backgroundColor: 'rgba(255,193,7,0.1)' },
  tagUrgent: { backgroundColor: 'rgba(255,193,7,0.1)' },
  tagText: { fontSize: 12, color: '#111827', fontWeight: '600' },
  tagTextScheduled: { fontSize: 12, color: '#F59E0B', fontWeight: '700' },
  tagTextUrgent: { fontSize: 12, color: '#F59E0B', fontWeight: '700' },

  cardActions: { rowGap: 6, alignItems: 'flex-end' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 6, backgroundColor: '#F3F4F6', borderRadius: 6, width: 140, height: 36 },
  actionBtnPrimary: { backgroundColor: '#2563EB' },
  actionBtnDanger: { backgroundColor: '#DC2626' },
  actionText: { fontSize: 12, color: '#111827' },
  actionTextPrimary: { color: '#FFFFFF', fontWeight: '600' },
  actionTextDanger: { color: '#FFFFFF', fontWeight: '600' },

  cardContent: { marginTop: 10 },
  cardStatsRow: { flexDirection: 'row', columnGap: 14 },
  cardStat: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  cardStatText: { fontSize: 12, color: '#6B7280' },
  cardDateRow: { marginTop: 10 },
  cardDate: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  cardDateText: { fontSize: 12, color: '#6B7280' },

  fabWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  fab: { position: 'absolute', right: 20, bottom: 90, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0066CC', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginTop: 12 },
  emptyDesc: { fontSize: 12, color: '#6B7280', marginTop: 6, marginBottom: 16 },

  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#EEEEEE', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 13, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 500, backgroundColor: '#FFFFFF', borderRadius: 10, overflow: 'hidden' },
  modalHeader: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  filterGroup: { rowGap: 8 },
  filterLabel: { fontSize: 13, color: '#374151', fontWeight: '700' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, backgroundColor: '#FFFFFF' },
  optionChipOn: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  optionChipText: { fontSize: 12, color: '#111827', fontWeight: '600' },
  optionChipTextOn: { color: '#FFFFFF' },
  modalFooter: { paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'flex-end', columnGap: 8 },
})
