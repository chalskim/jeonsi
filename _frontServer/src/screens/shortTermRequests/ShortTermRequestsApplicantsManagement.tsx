import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

type Status = 'reviewing' | 'passed' | 'rejected'

type Applicant = {
  id: number
  name: string
  role: string
  tags: string[]
  status: Status
  proposalPrice: string
  proposalTime: string
  skills: string[]
  approach: string[]
  initial: string
}

export default function ShortTermRequestsApplicantsManagement() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()

  const [tab, setTab] = useState<'all' | Status>('all')
  const [statusOptionsFor, setStatusOptionsFor] = useState<number | null>(null)
  const [decisionOpen, setDecisionOpen] = useState(false)
  const [decisionId, setDecisionId] = useState<number | null>(null)
  const [decisionType, setDecisionType] = useState<'pass' | 'final' | 'reject' | null>(null)
  const [decisionNote, setDecisionNote] = useState('')

  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: 1,
      name: '김민준',
      role: 'UI/UX 디자이너 • 5년 경력',
      tags: ['Figma', '프로토타이핑', '핀테크 경험', '시니어'],
      status: 'reviewing',
      proposalPrice: '월 650만원 제안',
      proposalTime: '주 40시간 (월 160시간) 가능',
      skills: ['5년간 UI/UX 디자인 경력', '핀테크 앱 3종 디자인 경험', 'Figma, Sketch 전문가', '사용자 리서치 및 데이터 분석 능력'],
      approach: ['사용자 중심의 디자인 시스템 구축', '빠른 프로토타이핑으로 검증', '디자인 가이드라인 제작', '개발팀과의 긴밀한 협업'],
      initial: '김'
    },
    {
      id: 2,
      name: '이서연',
      role: '시니어 UI 디자이너 • 7년 경력',
      tags: ['Figma', '디자인 시스템', '핀테크 경험', '팀 리드'],
      status: 'passed',
      proposalPrice: '월 700만원 제안',
      proposalTime: '주 40시간 (월 160시간) 가능',
      skills: ['7년간 UI/UX 디자인 경력', '대형 핀테크 앱 디자인 시스템 구축', '팀 리딩 및 멘토링 경험', '디자인 툴 개발 경험'],
      approach: ['확장 가능한 디자인 시스템 설계', '컴포넌트 기반 디자인 접근', 'A/B 테스트 기반 의사결정', '기술 팀과의 원활한 소통'],
      initial: '이'
    },
    {
      id: 3,
      name: '박현우',
      role: 'UX 리서처 • 3년 경력',
      tags: ['사용자 리서치', '데이터 분석', 'Figma'],
      status: 'rejected',
      proposalPrice: '월 500만원 제안',
      proposalTime: '주 30시간 가능',
      skills: ['3년간 사용자 리서치 경험', '정량/정성 데이터 분석', '인터뷰 가이드 제작'],
      approach: ['문제 정의를 위한 리서치 설계', '인사이트 도출 워크숍 진행', '리포트 표준화'],
      initial: '박'
    },
    {
      id: 4,
      name: '최가온',
      role: '제품 디자이너 • 4년 경력',
      tags: ['프로토타이핑', '디자인 시스템', '협업'],
      status: 'reviewing',
      proposalPrice: '월 600만원 제안',
      proposalTime: '주 35시간 가능',
      skills: ['모바일 제품 UX·UI 설계', '디자인 QA 프로세스 설계', '디자인 시스템 운영 경험'],
      approach: ['핵심 플로우 우선 개편', '핵심 KPI 기반 실험 설계', '개발팀과 문서 기반 협업'],
      initial: '최'
    }
  ])

  const stats = useMemo(() => {
    const total = applicants.length
    const reviewing = applicants.filter(a => a.status === 'reviewing').length
    const passed = applicants.filter(a => a.status === 'passed').length
    const rejected = applicants.filter(a => a.status === 'rejected').length
    return { total, reviewing, passed, rejected, quota: 2, remain: Math.max(2 - passed, 0) }
  }, [applicants])

  const filtered = useMemo(() => {
    if (tab === 'all') return applicants
    return applicants.filter(a => a.status === tab)
  }, [tab, applicants])

  const openDecision = (id: number, type: 'pass' | 'final' | 'reject') => {
    setDecisionId(id)
    setDecisionType(type)
    setDecisionNote('')
    setDecisionOpen(true)
  }

  const confirmDecision = () => {
    if (!decisionId || !decisionType) return
    setApplicants(prev => prev.map(a => {
      if (a.id !== decisionId) return a
      if (decisionType === 'reject') return { ...a, status: 'rejected' }
      return { ...a, status: 'passed' }
    }))
    setDecisionOpen(false)
    setDecisionId(null)
    setDecisionType(null)
    setDecisionNote('')
  }

  const changeStatus = (id: number, s: Status) => {
    setApplicants(prev => prev.map(a => (a.id === id ? { ...a, status: s } : a)))
    setStatusOptionsFor(null)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }] }>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="chevron-left" size={18} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UI/UX 디자이너 지원자 관리</Text>
        <TouchableOpacity style={styles.filterButton}>
          <FontAwesome5 name="filter" size={12} color="#FFFFFF" />
          <Text style={styles.filterButtonText}>필터</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        <View style={styles.filterSection}>
          <View style={styles.filterTabs}>
            {[
              { code: 'all', label: `전체 (${stats.total})` },
              { code: 'reviewing', label: `검토중 (${stats.reviewing})` },
              { code: 'passed', label: `합격 (${stats.passed})` },
              { code: 'rejected', label: `불합격 (${stats.rejected})` }
            ].map(t => (
              <TouchableOpacity key={t.code} style={[styles.filterTab, tab === t.code && styles.filterTabOn]} onPress={() => setTab(t.code as any)}>
                <Text style={[styles.filterTabText, tab === t.code && styles.filterTabTextOn]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>총 모집 인원:</Text>
              <Text style={styles.statNumber}>{stats.quota}명</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>현재 합격자:</Text>
              <Text style={styles.statNumber}>{stats.passed}명</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>남은 인원:</Text>
              <Text style={styles.statNumber}>{stats.remain}명</Text>
            </View>
          </View>
        </View>

        <View style={styles.listWrap}>
          {filtered.map(a => (
            <View key={a.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{a.initial}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{a.name}</Text>
                  <Text style={styles.role}>{a.role}</Text>
                  <View style={styles.tagRow}>
                    {a.tags.map((t, i) => (
                      <View key={i} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
                    ))}
                  </View>
                </View>
                <View style={styles.statusCol}>
                  <View style={[styles.statusBadge, a.status === 'reviewing' ? styles.statusWarn : a.status === 'passed' ? styles.statusOk : styles.statusNg]}>
                    <Text style={styles.statusBadgeText}>{a.status === 'reviewing' ? '검토중' : a.status === 'passed' ? '합격' : '불합격'}</Text>
                  </View>
                  <TouchableOpacity style={styles.statusChange} onPress={() => setStatusOptionsFor(statusOptionsFor === a.id ? null : a.id)}>
                    <Text style={styles.statusChangeText}>상태 변경</Text>
                    <FontAwesome5 name="chevron-down" size={12} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {statusOptionsFor === a.id && (
                <View style={styles.statusOptions}>
                  {(['reviewing','passed','rejected'] as Status[]).map(s => (
                    <TouchableOpacity key={s} style={[styles.optionChip, a.status === s && styles.optionChipOn]} onPress={() => changeStatus(a.id, s)}>
                      <Text style={[styles.optionChipText, a.status === s && styles.optionChipTextOn]}>{s === 'reviewing' ? '검토중' : s === 'passed' ? '합격' : '불합격'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.proposalBox}>
                <Text style={styles.proposalTitle}>제안서 요약</Text>
                <Text style={styles.proposalPrice}>{a.proposalPrice}</Text>
                <Text style={styles.proposalTime}>{a.proposalTime}</Text>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailTitle}>핵심 역량</Text>
                  <View>
                    {a.skills.map((s, i) => (
                      <Text key={i} style={styles.detailText}>• {s}</Text>
                    ))}
                  </View>
                </View>
                <View style={styles.detailSection}>
                  <Text style={styles.detailTitle}>제안 접근 방식</Text>
                  <View>
                    {a.approach.map((s, i) => (
                      <Text key={i} style={styles.detailText}>• {s}</Text>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.actionBtn, styles.infoBtn]}>
                  <FontAwesome5 name="user" size={12} color="#FFFFFF" />
                  <Text style={styles.actionText}>프로필 보기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
                  <FontAwesome5 name="comment" size={12} color="#FFFFFF" />
                  <Text style={styles.actionText}>메시지</Text>
                </TouchableOpacity>
                {a.status !== 'rejected' && (
                  <TouchableOpacity style={[styles.actionBtn, styles.successBtn]} onPress={() => openDecision(a.id, a.status === 'passed' ? 'final' : 'pass')}>
                    <FontAwesome5 name={a.status === 'passed' ? 'crown' : 'check'} size={12} color="#FFFFFF" />
                    <Text style={styles.actionText}>{a.status === 'passed' ? '최종 합격' : '합격'}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.actionBtn, styles.dangerBtn]} onPress={() => openDecision(a.id, 'reject')}>
                  <FontAwesome5 name="times" size={12} color="#FFFFFF" />
                  <Text style={styles.actionText}>불합격</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={decisionOpen} transparent animationType="fade" onRequestClose={() => setDecisionOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{decisionType === 'reject' ? '불합격 처리' : decisionType === 'final' ? '최종 합격 처리' : '합격 처리'}</Text>
              <Text style={styles.modalSubtitle}>결정 사유를 간단히 적어 주세요</Text>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>메모</Text>
                <TextInput style={styles.textarea} multiline value={decisionNote} onChangeText={setDecisionNote} placeholder="결정 사유를 입력하세요" />
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setDecisionOpen(false)}>
                <Text style={styles.modalBtnText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, decisionType === 'reject' ? styles.confirmBtnDanger : styles.confirmBtn]} onPress={confirmDecision}>
                <Text style={styles.modalBtnText}>확인</Text>
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
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  filterButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1f5cff', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 },
  filterButtonText: { color: '#ffffff', fontSize: 12, marginLeft: 6, fontWeight: '600' },

  filterSection: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', padding: 15 },
  filterTabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterTab: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#F3F4F6' },
  filterTabOn: { backgroundColor: '#1f5cff' },
  filterTabText: { fontSize: 12, color: '#111827', fontWeight: '600' },
  filterTabTextOn: { color: '#ffffff' },
  filterStats: { flexDirection: 'row', gap: 16 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statLabel: { fontSize: 12, color: '#374151' },
  statNumber: { fontSize: 12, fontWeight: '700', color: '#1f5cff' },

  listWrap: { paddingHorizontal: 15, paddingBottom: 20 },
  card: { backgroundColor: '#ffffff', borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E9ECEF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#1f5cff' },
  name: { fontSize: 15, fontWeight: '700', color: '#111827' },
  role: { fontSize: 12, color: '#6b7280', marginBottom: 6 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  tagText: { fontSize: 11, color: '#111827' },
  statusCol: { alignItems: 'flex-end', gap: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  statusBadgeText: { fontSize: 12, fontWeight: '700' },
  statusWarn: { backgroundColor: '#FCD34D' },
  statusOk: { backgroundColor: '#34D399' },
  statusNg: { backgroundColor: '#F87171' },
  statusChange: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 },
  statusChangeText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  statusOptions: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  optionChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#F3F4F6' },
  optionChipOn: { backgroundColor: '#1f5cff' },
  optionChipText: { fontSize: 12, color: '#111827', fontWeight: '600' },
  optionChipTextOn: { color: '#ffffff' },

  proposalBox: { backgroundColor: '#f0f7ff', borderWidth: 1, borderColor: '#b3d9ff', borderRadius: 8, padding: 12, marginBottom: 12 },
  proposalTitle: { fontSize: 12, fontWeight: '700', color: '#1f5cff', marginBottom: 6 },
  proposalPrice: { fontSize: 14, fontWeight: '700', color: '#1f5cff', marginBottom: 2 },
  proposalTime: { fontSize: 12, color: '#6b7280' },

  detailsGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  detailSection: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12 },
  detailTitle: { fontSize: 12, fontWeight: '700', color: '#111827', marginBottom: 6 },
  detailText: { fontSize: 12, color: '#374151' },

  actionsRow: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8 },
  actionText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  infoBtn: { backgroundColor: '#17a2b8' },
  secondaryBtn: { backgroundColor: '#6c757d' },
  successBtn: { backgroundColor: '#28a745' },
  dangerBtn: { backgroundColor: '#dc3545' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  modalContent: { width: '90%', maxWidth: 500, backgroundColor: '#ffffff', borderRadius: 8, overflow: 'hidden' },
  modalHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  modalSubtitle: { fontSize: 12, color: '#6b7280' },
  modalBody: { padding: 16 },
  formGroup: { marginBottom: 12 },
  formLabel: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6 },
  textarea: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, minHeight: 80, fontSize: 13, color: '#111827' },
  modalFooter: { flexDirection: 'row', gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  modalBtn: { flex: 1, borderRadius: 6, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { backgroundColor: '#F3F4F6' },
  confirmBtn: { backgroundColor: '#1f5cff' },
  confirmBtnDanger: { backgroundColor: '#dc3545' },
  modalBtnText: { fontSize: 13, fontWeight: '700', color: '#111827' },
})

