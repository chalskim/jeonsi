import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ApplicantStatus = 'new' | 'screening' | 'passed' | 'failed'

type Applicant = {
  id: string
  name: string
  email: string
  phone: string
  tags: string[]
  status: ApplicantStatus
  details: { education: string; experience: string; appliedAt: string; expectedSalary: string }
  aiScores: number[]
}

export default function RecruitmentApplicantsManagement() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [activeTab, setActiveTab] = useState<'all' | 'screening' | 'passed' | 'failed'>('all')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkOpen, setBulkOpen] = useState(false)
  const [bulkMessage, setBulkMessage] = useState('')

  const applicantsSource = useMemo<Applicant[]>(() => [
    {
      id: 'r1',
      name: '김철수',
      email: 'chulsoo.kim@email.com',
      phone: '010-1234-5678',
      tags: ['5년 경력', 'CISSP', '금융권 경험'],
      status: 'new',
      details: { education: '정보통신학사', experience: '금융 보안 5년', appliedAt: '2024.03.02 16:45', expectedSalary: '6,500만원' },
      aiScores: [78, 82, 71],
    },
    {
      id: 'r2',
      name: '이서연',
      email: 'seoyeon.lee@email.com',
      phone: '010-3333-4444',
      tags: ['7년 경력', '보안정책', '팀 리드'],
      status: 'screening',
      details: { education: '컴퓨터공학 석사', experience: '보안 아키텍트 7년', appliedAt: '2024.03.05 10:20', expectedSalary: '7,800만원' },
      aiScores: [85, 88, 82],
    },
    {
      id: 'r3',
      name: '정다운',
      email: 'daun.jung@email.com',
      phone: '010-7777-8888',
      tags: ['2년 경력', '신입'],
      status: 'failed',
      details: { education: '컴퓨터공학 학사', experience: '스타트업 2년', appliedAt: '2024.03.07 16:45', expectedSalary: '4,500만원' },
      aiScores: [65, 72, 68],
    },
    {
      id: 'r4',
      name: '박현우',
      email: 'hyunwoo.park@email.com',
      phone: '010-2222-3333',
      tags: ['3년 경력', '데이터 분석'],
      status: 'passed',
      details: { education: '정보보호학 학사', experience: '컨설팅 3년', appliedAt: '2024.03.03 09:15', expectedSalary: '5,800만원' },
      aiScores: [88, 90, 84],
    },
  ], [])

  const [applicants, setApplicants] = useState<Applicant[]>(applicantsSource)

  const screeningCount = useMemo(() => applicants.filter((a) => a.status === 'new' || a.status === 'screening').length, [applicants])
  const passedCount = useMemo(() => applicants.filter((a) => a.status === 'passed').length, [applicants])
  const failedCount = useMemo(() => applicants.filter((a) => a.status === 'failed').length, [applicants])

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
    navigation.navigate('RecruitmentList')
  }

  const statusLabel = (s: ApplicantStatus) => (s === 'new' ? '신규' : s === 'screening' ? '선별전' : s === 'passed' ? '서류 통과' : '탈락')

  const statusBadgeStyle = (s: ApplicantStatus) =>
    s === 'new' ? styles.badgeNew : s === 'screening' ? styles.badgeScreening : s === 'passed' ? styles.badgePassed : styles.badgeFailed

  const filteredByTab = useMemo(() => {
    if (activeTab === 'all') return applicants
    if (activeTab === 'screening') return applicants.filter((a) => a.status === 'screening' || a.status === 'new')
    return applicants.filter((a) => a.status === activeTab)
  }, [activeTab, applicants])

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    if (!s) return filteredByTab
    return filteredByTab.filter((a) => {
      const text = [a.name, a.email, a.phone, ...a.tags].join(' ').toLowerCase()
      return text.includes(s)
    })
  }, [filteredByTab, search])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    const ids = filtered.map((a) => a.id)
    const allSelected = ids.every((id) => selectedIds.includes(id))
    setSelectedIds(allSelected ? selectedIds.filter((id) => !ids.includes(id)) : Array.from(new Set([...selectedIds, ...ids])))
  }

  const openBulkMessage = () => {
    if (selectedIds.length === 0) {
      Alert.alert('안내', '메시지를 보낼 지원자를 선택해주세요.')
      return
    }
    setBulkOpen(true)
  }

  const applyBulk = (type: 'passed' | 'failed') => {
    if (selectedIds.length === 0) {
      Alert.alert('안내', type === 'passed' ? '서류 통과시킬 지원자를 선택해주세요.' : '서류 탈락시킬 지원자를 선택해주세요.')
      return
    }
    Alert.alert('확인', `선택된 ${selectedIds.length}명을 ${type === 'passed' ? '서류 통과' : '탈락'} 처리하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: () => {
          setApplicants((prev) => prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: type } : a)))
          setSelectedIds([])
          setActiveTab(type)
          Alert.alert('처리 완료', type === 'passed' ? '서류 통과 처리되었습니다.' : '서류 탈락 처리되었습니다.')
        },
      },
    ])
  }

  const quickStatusChange = (id: string, type: 'passed' | 'failed' | 'screening') => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: type } : a)))
    Alert.alert('처리 완료', type === 'passed' ? '서류 통과 처리했습니다.' : type === 'failed' ? '탈락 처리했습니다.' : '선별전으로 변경했습니다.')
  }

  const openConform = (a: Applicant) => {
    const isNew = a.tags.some((t) => t.includes('신입'))
    const resume: any = {
      careerType: isNew ? 'newcomer' : 'experienced',
      name: a.name,
      birth: '',
      gender: 'male',
      email: a.email,
      phone: a.phone,
      tel: '',
      zipcode: '',
      address: '',
      addressDetail: '',
      photoUri: '',
      majorCode: 'IT',
      middleCode: 'IT05',
      location: 'gyeonggi',
      salaryMin: 0,
      salaryMax: 0,
      workTypes: [],
      educations: [],
      careers: [],
      careerDescription: '',
      skills: [],
      certificates: [],
      languages: [],
      activities: [],
      portfolioUrls: [],
      portfolioFiles: [],
      intro1: '',
      intro2: '',
      intro3: '',
      intro4: '',
      military: '',
      militaryBranch: '',
      militaryStart: '',
      militaryEnd: '',
      militaryRank: '',
      disability: '',
      veteran: '',
    }
    const summary = { jobTitle: '보안 컨설턴트 (정규직)', appliedAt: a.details.appliedAt, status: statusLabel(a.status) }
    ;(navigation as any).navigate('RecruitmentApplicantConform', { applicantId: a.id, resume, summary, prev: 'RecruitmentApplicantsManagement' })
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>채용 지원자 관리</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={() => Alert.alert('다운로드', '지원자 목록을 다운로드합니다.')}>
          <FontAwesome5 name="download" size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.jobInfoSection}>
        <Text style={styles.jobTitle}>보안 컨설턴트 (정규직)</Text>
        <View style={styles.jobMetaRow}>
          <View style={styles.jobMetaItem}><FontAwesome5 name="building" size={12} color="#2563EB" /><Text style={styles.jobMetaText}>정보보안팀</Text></View>
          <View style={styles.jobMetaItem}><FontAwesome5 name="map-marker-alt" size={12} color="#2563EB" /><Text style={styles.jobMetaText}>경기 성남시</Text></View>
          <View style={styles.jobMetaItem}><FontAwesome5 name="calendar" size={12} color="#2563EB" /><Text style={styles.jobMetaText}>2024.03.15 마감</Text></View>
        </View>
      </View>

      <View style={styles.tabNav}>
        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'all' && styles.tabButtonActive]} onPress={() => setActiveTab('all')}>
            <Text style={[styles.tabButtonText, activeTab === 'all' && styles.tabButtonTextActive]}>전체</Text>
            <View style={styles.tabCount}><Text style={styles.tabCountText}>{applicants.length}</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'screening' && styles.tabButtonActive]} onPress={() => setActiveTab('screening')}>
            <Text style={[styles.tabButtonText, activeTab === 'screening' && styles.tabButtonTextActive]}>선별전</Text>
            <View style={styles.tabCount}><Text style={styles.tabCountText}>{screeningCount}</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'passed' && styles.tabButtonActive]} onPress={() => setActiveTab('passed')}>
            <Text style={[styles.tabButtonText, activeTab === 'passed' && styles.tabButtonTextActive]}>서류통과</Text>
            <View style={styles.tabCount}><Text style={styles.tabCountText}>{passedCount}</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'failed' && styles.tabButtonActive]} onPress={() => setActiveTab('failed')}>
            <Text style={[styles.tabButtonText, activeTab === 'failed' && styles.tabButtonTextActive]}>탈락</Text>
            <View style={styles.tabCount}><Text style={styles.tabCountText}>{failedCount}</Text></View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          <View style={{ flex: 1, position: 'relative' }}>
            <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="이름, 이메일, 경력 검색..." />
            <View style={styles.searchIcon}><FontAwesome5 name="search" size={14} color="#6B7280" /></View>
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => Alert.alert('필터', '고급 필터는 추후 제공됩니다.')}>
            <FontAwesome5 name="filter" size={14} color="#374151" />
          </TouchableOpacity>
        </View>
        <View style={styles.bulkRow}>
          <TouchableOpacity style={styles.selectAllRow} onPress={toggleSelectAll}>
            <View style={[styles.checkbox, filtered.length > 0 && filtered.every((a) => selectedIds.includes(a.id)) && styles.checkboxOn]} />
            <Text style={styles.selectAllText}>전체 선택</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bulkBtn} onPress={openBulkMessage}>
            <FontAwesome5 name="envelope" size={12} color="#374151" />
            <Text style={styles.bulkBtnText}>일괄 메시지</Text>
          </TouchableOpacity>
          
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filtered.map((a) => (
          <View key={a.id} style={styles.card}>
            <TouchableOpacity style={styles.cardCheckbox} onPress={() => toggleSelect(a.id)}>
              <View style={[styles.checkbox, selectedIds.includes(a.id) && styles.checkboxOn]} />
            </TouchableOpacity>
            <View style={styles.applicantHeader}>
              <TouchableOpacity style={styles.applicantInfo} activeOpacity={0.8} onPress={() => openConform(a)}>
                <View style={styles.applicantNameRow}>
                  <Text style={styles.applicantName}>{a.name}</Text>
                  <View style={[styles.statusBadge, statusBadgeStyle(a.status)]}><Text style={styles.statusBadgeText}>{statusLabel(a.status)}</Text></View>
                </View>
                <Text style={styles.applicantContact}><FontAwesome5 name="envelope" size={12} color="#6B7280" /> {a.email} • <FontAwesome5 name="phone" size={12} color="#6B7280" /> {a.phone}</Text>
                <View style={styles.tagsRow}>
                  {a.tags.map((t) => (
                    <View key={`${a.id}-${t}`} style={styles.tagChip}><Text style={styles.tagText}>{t}</Text></View>
                  ))}
                </View>
              </TouchableOpacity>
              <View style={styles.applicantActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('면접 예약', `${a.name}님 면접 예약 화면으로 이동합니다.`)}>
                  <FontAwesome5 name="calendar" size={12} color="#374151" />
                  <Text style={styles.actionText}>면접 예약</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('메시지', `${a.name}님에게 메시지를 보냅니다.`)}>
                  <FontAwesome5 name="comment" size={12} color="#374151" />
                  <Text style={styles.actionText}>메시지</Text>
                </TouchableOpacity>
                
              </View>
            </View>

            <View style={styles.detailGrid}>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>학력</Text><Text style={styles.detailValue}>{a.details.education}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>경력</Text><Text style={styles.detailValue}>{a.details.experience}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>지원일</Text><Text style={styles.detailValue}>{a.details.appliedAt}</Text></View>
              <View style={styles.detailItem}><Text style={styles.detailLabel}>희망 연봉</Text><Text style={styles.detailValue}>{a.details.expectedSalary}</Text></View>
            </View>

            <View style={styles.evaluationSection}>
              <View style={styles.evaluationTitle}><FontAwesome5 name="star" size={14} color="#F59E0B" /><Text style={styles.evaluationTitleText}>AI 평가 점수</Text></View>
              <View style={styles.evaluationScores}>
                {a.aiScores.map((s, i) => (
                  <View key={`sc-${a.id}-${i}`} style={styles.scoreItem}>
                    <Text style={styles.scoreStars}>{s >= 85 ? '★★★★★☆☆' : s >= 75 ? '★★★★☆☆☆' : s >= 65 ? '★★★☆☆☆☆' : '★★☆☆☆☆☆'}</Text>
                    <Text style={styles.scoreValue}>{s}점</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={bulkOpen} transparent animationType="fade" onRequestClose={() => setBulkOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>일괄 메시지 보내기</Text>
              <TouchableOpacity onPress={() => setBulkOpen(false)}><FontAwesome5 name="times" size={18} color="#6B7280" /></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <View style={styles.selectedCount}><Text style={styles.selectedCountText}>선택된 지원자: {selectedIds.length}명</Text></View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>메시지 내용</Text>
                <TextInput style={styles.textarea} value={bulkMessage} onChangeText={setBulkMessage} placeholder="선택된 지원자들에게 보낼 메시지를 입력하세요..." multiline />
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setBulkOpen(false)}>
                <Text style={styles.modalBtnCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={() => {
                  if (selectedIds.length === 0) {
                    Alert.alert('안내', '메시지를 보낼 지원자를 선택해주세요.')
                    return
                  }
                  if (!bulkMessage.trim()) {
                    Alert.alert('안내', '메시지를 입력해주세요.')
                    return
                  }
                  Alert.alert('전송 완료', `${selectedIds.length}명에게 메시지가 전송되었습니다.`)
                  setBulkOpen(false)
                  setBulkMessage('')
                  setSelectedIds([])
                }}
              >
                <Text style={styles.modalBtnConfirmText}>보내기</Text>
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

  jobInfoSection: { backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  jobTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  jobMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  jobMetaItem: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  jobMetaText: { fontSize: 12, color: '#6B7280' },

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

  bulkRow: { flexDirection: 'row', alignItems: 'center', columnGap: 10, marginTop: 10 },
  selectAllRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  selectAllText: { fontSize: 12, color: '#374151' },
  bulkBtn: { flexDirection: 'row', alignItems: 'center', columnGap: 6, backgroundColor: '#F3F4F6', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8 },
  bulkBtnText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' },
  checkboxOn: { backgroundColor: '#2563EB', borderColor: '#2563EB' },

  content: { paddingBottom: 100, paddingHorizontal: 12, paddingTop: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', position: 'relative' },
  cardCheckbox: { position: 'absolute', left: 12, top: 12 },
  applicantHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, paddingLeft: 30 },
  applicantInfo: { flex: 1 },
  applicantNameRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, marginBottom: 6 },
  applicantName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  applicantContact: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: { backgroundColor: '#F3F4F6', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
  tagText: { fontSize: 12, color: '#374151' },

  applicantActions: { rowGap: 6, alignItems: 'flex-end' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 6, backgroundColor: '#F3F4F6', borderRadius: 6, width: 140, height: 36 },
  actionBtnSuccess: { backgroundColor: '#22C55E' },
  actionBtnDanger: { backgroundColor: '#DC2626' },
  actionText: { fontSize: 12, color: '#111827' },
  actionTextOn: { color: '#FFFFFF', fontWeight: '600' },

  statusBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 15 },
  badgeNew: { backgroundColor: 'rgba(23,162,184,0.2)' },
  badgeScreening: { backgroundColor: 'rgba(255,193,7,0.2)' },
  badgePassed: { backgroundColor: 'rgba(40,167,69,0.2)' },
  badgeFailed: { backgroundColor: 'rgba(220,53,69,0.2)' },
  statusBadgeText: { fontSize: 12, fontWeight: '700', color: '#111827' },

  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  detailItem: { minWidth: 160, flex: 1, rowGap: 4 },
  detailLabel: { fontSize: 12, color: '#6B7280' },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#111827' },

  evaluationSection: { marginTop: 12, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 8 },
  evaluationTitle: { flexDirection: 'row', alignItems: 'center', columnGap: 8, marginBottom: 8 },
  evaluationTitleText: { fontSize: 13, fontWeight: '700', color: '#111827' },
  evaluationScores: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  scoreItem: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  scoreStars: { fontSize: 12, color: '#F59E0B' },
  scoreValue: { fontSize: 12, fontWeight: '700', color: '#111827' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 500, backgroundColor: '#FFFFFF', borderRadius: 10, overflow: 'hidden' },
  modalHeader: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  selectedCount: { backgroundColor: '#F3F4F6', padding: 10, borderRadius: 8, marginBottom: 12 },
  selectedCountText: { fontSize: 13, fontWeight: '700', color: '#111827', textAlign: 'center' },
  formGroup: { rowGap: 8 },
  formLabel: { fontSize: 13, color: '#374151', fontWeight: '700' },
  textarea: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, minHeight: 120, fontSize: 13, color: '#111827' },
  modalFooter: { paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'flex-end', columnGap: 8 },
  modalBtnCancel: { backgroundColor: '#F3F4F6', borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  modalBtnCancelText: { fontSize: 14, color: '#374151', fontWeight: '700' },
  modalBtnConfirm: { backgroundColor: '#0066CC', borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  modalBtnConfirmText: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },
})
