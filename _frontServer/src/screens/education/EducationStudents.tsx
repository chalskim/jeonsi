import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type StudentStatus = 'registered' | 'paid' | 'attending' | 'completed' | 'canceled'

type Student = {
  id: number
  name: string
  email: string
  phone: string
  joinedDate: string
  status: StudentStatus
  note?: string
}

const statusLabel = (s: StudentStatus) =>
  s === 'registered' ? '등록' : s === 'paid' ? '결제 완료' : s === 'attending' ? '수강 중' : s === 'completed' ? '수료' : '취소'

export default function EducationStudents() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const courseId = Number((route as any)?.params?.id) || 0

  const [statusFilter, setStatusFilter] = useState<'all' | StudentStatus>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const [students] = useState<Student[]>([
    { id: 1, name: '김민지', email: 'minji@example.com', phone: '010-1234-5678', joinedDate: '2025-03-02', status: 'registered' },
    { id: 2, name: '박현수', email: 'hyunsoo@example.com', phone: '010-2222-3333', joinedDate: '2025-03-02', status: 'paid' },
    { id: 3, name: '이서준', email: 'seojun@example.com', phone: '010-4444-5555', joinedDate: '2025-03-03', status: 'attending' },
    { id: 4, name: '최지아', email: 'jia@example.com', phone: '010-7777-8888', joinedDate: '2025-02-15', status: 'completed' },
    { id: 5, name: '정해인', email: 'haein@example.com', phone: '010-9999-0000', joinedDate: '2025-03-01', status: 'canceled' },
  ])

  const stats = useMemo(() => ({
    total: students.length,
    registered: students.filter((s) => s.status === 'registered').length,
    paid: students.filter((s) => s.status === 'paid').length,
    attending: students.filter((s) => s.status === 'attending').length,
    completed: students.filter((s) => s.status === 'completed').length,
    canceled: students.filter((s) => s.status === 'canceled').length,
  }), [students])

  const filtered = useMemo<Student[]>(() => {
    let list: Student[] = Array.isArray(students) ? students.slice() : []
    if (statusFilter !== 'all') list = list.filter((s) => s.status === statusFilter)
    if (searchTerm.trim()) list = list.filter((s) => s.name.includes(searchTerm.trim()) || s.email.includes(searchTerm.trim()) || s.phone.includes(searchTerm.trim()))
    return list
  }, [students, statusFilter, searchTerm])

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
  }
  const selectAll = () => setSelectedIds(filtered.map((s) => s.id))
  const clearSelection = () => setSelectedIds([])
  const sendMessageSelected = () => {
    if (!selectedIds.length) {
      Alert.alert('안내', '선택된 수강생이 없습니다.')
      return
    }
    Alert.alert('메시지', `${selectedIds.length}명에게 메시지를 보냅니다.`)
  }
  const sendCouponSelected = () => {
    if (!selectedIds.length) {
      Alert.alert('안내', '선택된 수강생이 없습니다.')
      return
    }
    Alert.alert('쿠폰', `${selectedIds.length}명에게 쿠폰을 보냅니다.`)
  }

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
            navigation.navigate('EducationDetail', { id: courseId })
          }}
        >
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>수강생 목록</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8}>
          <FontAwesome5 name="filter" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="filter" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>필터</Text></View>
          </View>
          <View style={styles.filterControls}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>상태</Text>
              <View style={styles.chipRow}>
                {(['all', 'registered', 'paid', 'attending', 'completed', 'canceled'] as const).map((v) => (
                  <TouchableOpacity key={`status-${v}`} style={[styles.chip, statusFilter === v && styles.chipActive]} onPress={() => setStatusFilter(v as any)}>
                    <Text style={[styles.chipText, statusFilter === v && styles.chipTextActive]}>{v === 'all' ? '전체' : statusLabel(v as any)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.searchRow}>
              <TextInput style={styles.searchInput} value={searchTerm} onChangeText={setSearchTerm} placeholder="이름/이메일/전화로 검색..." />
              <TouchableOpacity style={styles.searchBtn} onPress={() => {}}>
                <FontAwesome5 name="search" size={14} color="#FFFFFF" />
                <Text style={styles.searchBtnText}>검색</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><Text style={styles.sectionTitle}>액션</Text></View>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.btnOutline} onPress={selectAll}>
              <FontAwesome5 name="check-square" size={14} color="#374151" />
              <Text style={styles.btnOutlineText}>전체 선택</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={clearSelection}>
              <FontAwesome5 name="square" size={14} color="#374151" />
              <Text style={styles.btnOutlineText}>전체 해제</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={sendMessageSelected}>
              <FontAwesome5 name="envelope" size={14} color="#FFFFFF" />
              <Text style={styles.btnPrimaryText}>메시지</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary} onPress={sendCouponSelected}>
              <FontAwesome5 name="ticket-alt" size={14} color="#FFFFFF" />
              <Text style={styles.btnSecondaryText}>쿠폰</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><Text style={styles.sectionTitle}>수강생 ({filtered.length}명)</Text></View>
          <View style={styles.cardList}>
            {filtered.map((s) => (
              <TouchableOpacity key={`student-${s.id}`} style={styles.card} activeOpacity={0.85} onPress={() => toggleSelect(s.id)}>
                <View style={styles.cardHeader}>
                  <TouchableOpacity style={[styles.selectBox, selectedIds.includes(s.id) && styles.selectBoxOn]} activeOpacity={0.85} onPress={() => toggleSelect(s.id)}>
                    {selectedIds.includes(s.id) ? <FontAwesome5 name="check" size={12} color="#FFFFFF" /> : null}
                  </TouchableOpacity>
                  <View style={styles.studentAvatar}><Text style={styles.studentAvatarText}>{s.name.slice(0,1)}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.studentName}>{s.name}</Text>
                    <Text style={styles.studentSub}>{s.email} · {s.phone}</Text>
                  </View>
                  <View style={[styles.statusBadge, s.status === 'registered' ? styles.statusRegistered : s.status === 'paid' ? styles.statusPaid : s.status === 'attending' ? styles.statusAttending : s.status === 'completed' ? styles.statusCompleted : styles.statusCanceled]}>
                    <Text style={styles.statusText}>{statusLabel(s.status)}</Text>
                  </View>
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}><FontAwesome5 name="calendar-alt" size={12} color="#2563EB" /><Text style={styles.infoText}>{s.joinedDate}</Text></View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => Alert.alert('안내', '수강생 추가는 추후 제공됩니다.')}> 
        <FontAwesome5 name="user-plus" size={18} color="#FFFFFF" />
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

  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { flexGrow: 1, minWidth: 90, backgroundColor: '#F3F4F6', borderRadius: 8, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
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
  studentAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E3F2FD', alignItems: 'center', justifyContent: 'center' },
  studentAvatarText: { fontSize: 16, fontWeight: '700', color: '#2563EB' },
  studentName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  studentSub: { fontSize: 12, color: '#6B7280' },
  statusBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14 },
  statusRegistered: { backgroundColor: '#F8FAFC' },
  statusPaid: { backgroundColor: '#DBEAFE' },
  statusAttending: { backgroundColor: '#E8F5E9' },
  statusCompleted: { backgroundColor: '#F3F4F6' },
  statusCanceled: { backgroundColor: '#FFF7ED' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#111827' },

  cardBody: { paddingHorizontal: 12, paddingBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  infoText: { fontSize: 12, color: '#6B7280' },

  cardFooter: { paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#F8FAFC' },
  actionsRow: { flexDirection: 'row', columnGap: 8, flexWrap: 'wrap' },
  selectBox: { width: 20, height: 20, borderRadius: 4, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  selectBoxOn: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#EEEEEE', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 13, fontWeight: '600' },
  btnSecondary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnSecondaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnDanger: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#DC2626', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnDangerText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

  fab: { position: 'absolute', right: 20, bottom: 20, width: 50, height: 50, borderRadius: 25, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
})
