import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type CourseStatus = 'active' | 'scheduled' | 'ended'
type Course = {
  id: number
  title: string
  instructor: string
  category: 'ED' | 'IT' | 'DS' | 'MK' | 'BZ'
  status: CourseStatus
  format: 'online' | 'offline'
  day: string
  startDate: string
  endDate: string
  enrolled: number
  capacity: number
  rating: number
  price: number
  description: string
  satisfaction?: number
}

const categoryName = (c: Course['category']) =>
  c === 'ED' ? '교육/강의' : c === 'IT' ? '기술/개발' : c === 'DS' ? '디자인/크리에이티브' : c === 'MK' ? '마케팅/홍보' : '비즈니스/경영'

export default function EducationList() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [statusFilter, setStatusFilter] = useState<'all' | CourseStatus>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | Course['category']>('all')
  const [sortFilter, setSortFilter] = useState<'newest' | 'oldest' | 'popular'>('newest')
  const [searchTerm, setSearchTerm] = useState('')

  const [courses] = useState<Course[]>([
    {
      id: 1,
      title: '클라우드 보안 기초',
      instructor: '김민준',
      category: 'IT',
      status: 'active',
      format: 'online',
      day: '목 19:00-22:00',
      startDate: '2025-03-01',
      endDate: '2025-03-28',
      enrolled: 28,
      capacity: 40,
      rating: 4.8,
      price: 1200000,
      description: '클라우드 환경 보안 위협과 대응을 실무 중심으로 학습합니다.'
    },
    {
      id: 2,
      title: 'UI/UX 디자인 실무',
      instructor: '이서연',
      category: 'DS',
      status: 'scheduled',
      format: 'offline',
      day: '토 13:00-17:00',
      startDate: '2025-04-06',
      endDate: '2025-05-04',
      enrolled: 12,
      capacity: 25,
      rating: 4.6,
      price: 980000,
      description: '프로덕트 사례 기반으로 UI/UX 실무 역량을 강화합니다.'
    },
    {
      id: 3,
      title: '풀스택 개발 부트캠프',
      instructor: '박현우',
      category: 'IT',
      status: 'active',
      format: 'offline',
      day: '수 19:30-22:30',
      startDate: '2025-02-12',
      endDate: '2025-05-28',
      enrolled: 36,
      capacity: 40,
      rating: 4.7,
      price: 1490000,
      description: '프런트엔드부터 백엔드까지 프로젝트 중심으로 학습합니다.'
    },
    {
      id: 4,
      title: '재무분석과 IR 전략',
      instructor: '최지아',
      category: 'BZ',
      status: 'scheduled',
      format: 'online',
      day: '화 19:00-21:00',
      startDate: '2025-04-02',
      endDate: '2025-04-30',
      enrolled: 8,
      capacity: 30,
      rating: 4.5,
      price: 880000,
      description: '기업 재무 데이터 분석과 IR 전략 수립을 다룹니다.'
    },
    {
      id: 5,
      title: 'HR 데이터 기반 평가',
      instructor: '정도현',
      category: 'BZ',
      status: 'ended',
      format: 'offline',
      day: '일 10:00-12:00',
      startDate: '2025-01-10',
      endDate: '2025-02-07',
      enrolled: 20,
      capacity: 20,
      rating: 4.2,
      price: 890000,
      description: 'HR 메트릭과 데이터 기반 평가 방법을 실습합니다.',
      satisfaction: 95
    },
    {
      id: 6,
      title: '마케팅 퍼널 설계',
      instructor: '강민서',
      category: 'MK',
      status: 'active',
      format: 'online',
      day: '월 20:00-22:00',
      startDate: '2025-03-10',
      endDate: '2025-04-07',
      enrolled: 15,
      capacity: 25,
      rating: 4.3,
      price: 750000,
      description: '퍼널 분석으로 전환 최적화를 설계합니다.'
    },
  ])

  const formatDateRange = (s: string, e: string) => `${s.replace(/-/g, '.')} ~ ${e.replace(/-/g, '.')}`
  const formatPrice = (n: number) => `₩${n.toLocaleString('ko-KR')}`

  const stats = useMemo(() => ({
    total: courses.length,
    active: courses.filter((c) => c.status === 'active').length,
    scheduled: courses.filter((c) => c.status === 'scheduled').length,
    ended: courses.filter((c) => c.status === 'ended').length,
  }), [courses])

  const filtered = useMemo(() => {
    let list = courses.slice()
    if (statusFilter !== 'all') list = list.filter((c) => c.status === statusFilter)
    if (categoryFilter !== 'all') list = list.filter((c) => c.category === categoryFilter)
    if (searchTerm.trim()) list = list.filter((c) => c.title.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    if (sortFilter === 'newest') list.sort((a, b) => (a.startDate < b.startDate ? 1 : -1))
    else if (sortFilter === 'oldest') list.sort((a, b) => (a.startDate > b.startDate ? 1 : -1))
    else list.sort((a, b) => b.rating - a.rating)
    return list
  }, [courses, statusFilter, categoryFilter, searchTerm, sortFilter])

  const viewCourse = (id: number) => navigation.navigate('EducationDetail', { id , prev: 'EducationList' })
  const editCourse = (id: number) => Alert.alert('안내', `교육 수정 (ID: ${id}) 화면은 준비 중입니다.`)
  const manageStudents = (id: number) => navigation.navigate('EducationStudents', { id, prev: 'EducationList' })
  const addNewCourse = () => navigation.navigate('EducationRegister', { prev: 'EducationList' })

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          activeOpacity={0.8}
          onPress={() => {
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
          }}
        >
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>교육등록 목록</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8}>
          <FontAwesome5 name="filter" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* <View style={styles.section}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}><Text style={styles.statNumber}>{stats.total}</Text><Text style={styles.statLabel}>전체 교육</Text></View>
            <View style={styles.statCard}><Text style={styles.statNumber}>{stats.active}</Text><Text style={styles.statLabel}>진행 중</Text></View>
            <View style={styles.statCard}><Text style={styles.statNumber}>{stats.scheduled}</Text><Text style={styles.statLabel}>예정</Text></View>
            <View style={styles.statCard}><Text style={styles.statNumber}>{stats.ended}</Text><Text style={styles.statLabel}>완료/취소</Text></View>
          </View>
        </View> */}

        {/* <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="filter" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>필터</Text></View>
          </View>
          <View style={styles.filterControls}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>상태</Text>
              <View style={styles.chipRow}>
                {(['all', 'active', 'scheduled', 'ended'] as const).map((v) => (
                  <TouchableOpacity key={`status-${v}`} style={[styles.chip, statusFilter === v && styles.chipActive]} onPress={() => setStatusFilter(v)}>
                    <Text style={[styles.chipText, statusFilter === v && styles.chipTextActive]}>{v === 'all' ? '전체' : v === 'active' ? '진행 중' : v === 'scheduled' ? '예정' : '완료/취소'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>분류</Text>
              <View style={styles.chipRow}>
                {(['all', 'ED', 'IT', 'DS', 'MK', 'BZ'] as const).map((v) => (
                  <TouchableOpacity key={`cat-${v}`} style={[styles.chip, categoryFilter === v && styles.chipActive]} onPress={() => setCategoryFilter(v as any)}>
                    <Text style={[styles.chipText, categoryFilter === v && styles.chipTextActive]}>{v === 'all' ? '전체 분류' : categoryName(v as any)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>정렬</Text>
              <View style={styles.chipRow}>
                {(['newest', 'oldest', 'popular'] as const).map((v) => (
                  <TouchableOpacity key={`sort-${v}`} style={[styles.chip, sortFilter === v && styles.chipActive]} onPress={() => setSortFilter(v)}>
                    <Text style={[styles.chipText, sortFilter === v && styles.chipTextActive]}>{v === 'newest' ? '최신순' : v === 'oldest' ? '오래된순' : '인기순'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.searchRow}>
              <TextInput style={styles.searchInput} value={searchTerm} onChangeText={setSearchTerm} placeholder="교육명으로 검색..." />
              <TouchableOpacity style={styles.searchBtn} onPress={() => {}}>
                <FontAwesome5 name="search" size={14} color="#FFFFFF" />
                <Text style={styles.searchBtnText}>검색</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> */}

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><Text style={styles.sectionTitle}>내가 등록한 교육 ({filtered.length}개)</Text></View>
          <View style={styles.cardList}>
            {filtered.map((c) => (
              <TouchableOpacity key={`course-${c.id}`} style={styles.card} activeOpacity={0.85} onPress={() => viewCourse(c.id)}>
                <View style={styles.cardHeader}>
                  <View style={styles.courseAvatar}><FontAwesome5 name={c.category === 'IT' ? 'laptop-code' : c.category === 'DS' ? 'paint-brush' : c.category === 'MK' ? 'bullhorn' : c.category === 'BZ' ? 'briefcase' : 'chalkboard-teacher'} size={20} color="#2563EB" /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.courseTitle}>{c.title}</Text>
                    <Text style={styles.courseSub}>{c.instructor} · {categoryName(c.category)}</Text>
                  </View>
                  <View style={[styles.statusBadge, c.status === 'active' ? styles.statusActive : c.status === 'scheduled' ? styles.statusScheduled : styles.statusEnded]}>
                    <Text style={styles.statusText}>{c.status === 'active' ? '진행 중' : c.status === 'scheduled' ? '예정' : '완료'}</Text>
                  </View>
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}><FontAwesome5 name="calendar-alt" size={12} color="#2563EB" /><Text style={styles.infoText}>{c.day}</Text></View>
                  </View>
                  <View style={styles.summaryRow}>
                    <FontAwesome5 name="user-friends" size={12} color="#2563EB" />
                    <Text style={styles.summaryText}>
                      신청자 {c.enrolled} / 정원 {c.capacity} · 평점 {c.rating.toFixed(1)}{typeof c.satisfaction === 'number' ? ` · 만족도 ${c.satisfaction}%` : ''}
                    </Text>
                  </View>
                  <Text style={styles.descText}>{c.description}</Text>
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.priceDateRow}>
                    <Text style={styles.priceText}>{formatPrice(c.price)}</Text>
                    <Text style={styles.dateText}>{formatDateRange(c.startDate, c.endDate)}</Text>
                  </View>
                  <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.btnPrimary} onPress={() => viewCourse(c.id)}>
                      <FontAwesome5 name="eye" size={14} color="#FFFFFF" />
                      <Text style={styles.btnPrimaryText}>보기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnOutline} onPress={() => editCourse(c.id)}>
                      <FontAwesome5 name="edit" size={14} color="#374151" />
                      <Text style={styles.btnOutlineText}>수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSecondary} onPress={() => manageStudents(c.id)}>
                      <FontAwesome5 name="users" size={14} color="#FFFFFF" />
                      <Text style={styles.btnSecondaryText}>수강생</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={addNewCourse}>
        <FontAwesome5 name="plus" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#dee2e6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  section: { backgroundColor: '#FFFFFF', marginTop: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },

  statsRow: { flexDirection: 'row', columnGap: 12 },
  statCard: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 8, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },

  filterControls: { rowGap: 12 },
  filterGroup: {},
  filterLabel: { fontSize: 13, color: '#374151', marginBottom: 6, fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, backgroundColor: '#FFFFFF' },
  chipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  chipText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },

  searchRow: { flexDirection: 'row', columnGap: 8 },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, backgroundColor: '#FFFFFF' },
  searchBtn: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingHorizontal: 12, borderRadius: 8 },
  searchBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

  cardList: { flexDirection: 'column', rowGap: 12 },
  card: { width: '100%', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  cardHeader: { padding: 12, flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  courseAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E3F2FD', alignItems: 'center', justifyContent: 'center' },
  courseTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  courseSub: { fontSize: 12, color: '#6B7280' },
  statusBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14 },
  statusActive: { backgroundColor: '#E8F5E9' },
  statusScheduled: { backgroundColor: '#FFF7ED' },
  statusEnded: { backgroundColor: '#F3F4F6' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#111827' },

  cardBody: { paddingHorizontal: 12, paddingBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  infoText: { fontSize: 12, color: '#6B7280' },
  rating: { color: '#F59E0B', fontWeight: '700' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', columnGap: 6, marginTop: 6 },
  summaryText: { fontSize: 12, color: '#6B7280' },
  descText: { fontSize: 12, color: '#6B7280', marginTop: 8 },

  cardFooter: { paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#F8FAFC' },
  priceDateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  priceText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  dateText: { fontSize: 12, color: '#6B7280' },
  actionsRow: { flexDirection: 'row', columnGap: 8 },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#EEEEEE', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 13, fontWeight: '600' },
  btnSecondary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnSecondaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

  fab: { position: 'absolute', right: 20, bottom: 20, width: 50, height: 50, borderRadius: 25, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
})
