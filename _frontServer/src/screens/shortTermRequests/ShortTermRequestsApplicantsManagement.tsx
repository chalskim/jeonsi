import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ApplicantStatus = 'reviewing' | 'passed' | 'rejected'

type Applicant = {
  id: string
  name: string
  roleLabel: string
  tags: string[]
  status: ApplicantStatus
  proposal: { priceLabel: string; timeLabel: string }
  strengths: string[]
  approach: string[]
}

export default function ShortTermRequestsApplicantsManagement() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [activeTab, setActiveTab] = useState<'all' | 'reviewing' | 'passed' | 'rejected'>('all')
  const [decisionOpen, setDecisionOpen] = useState(false)
  const [decisionNote, setDecisionNote] = useState('')
  const [decisionTargetId, setDecisionTargetId] = useState<string | null>(null)
  const [decisionType, setDecisionType] = useState<'pass' | 'final' | 'reject'>('pass')

  const targetCount = 2

  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: 'a1',
      name: '김민준',
      roleLabel: 'UI/UX 디자이너 • 5년 경력',
      tags: ['Figma', '프로토타이핑', '핀테크 경험', '시니어'],
      status: 'reviewing',
      proposal: { priceLabel: '월 650만원 제안', timeLabel: '주 40시간 (월 160시간) 가능' },
      strengths: ['5년간 UI/UX 디자인 경력', '핀테크 앱 3종 디자인 경험', 'Figma, Sketch 전문가', '사용자 리서치 및 데이터 분석 능력'],
      approach: ['사용자 중심의 디자인 시스템 구축', '빠른 프로토타이핑으로 검증', '디자인 가이드라인 제작', '개발팀과의 긴밀한 협업'],
    },
    {
      id: 'a2',
      name: '이서연',
      roleLabel: '시니어 UI 디자이너 • 7년 경력',
      tags: ['Figma', '디자인 시스템', '핀테크 경험', '팀 리드'],
      status: 'passed',
      proposal: { priceLabel: '월 700만원 제안', timeLabel: '주 40시간 (월 160시간) 가능' },
      strengths: ['7년간 UI/UX 디자인 경력', '대형 핀테크 앱 디자인 시스템 구축', '팀 리딩 및 멘토링 경험', '디자인 툴 개발 경험'],
      approach: ['확장 가능한 디자인 시스템 설계', '컴포넌트 기반 디자인 접근', 'A/B 테스트 기반 의사결정', '기술 팀과의 원활한 소통'],
    },
    {
      id: 'a3',
      name: '박현우',
      roleLabel: 'UX 리서처 • 3년 경력',
      tags: ['사용자 리서치', '데이터 분석', 'Figma'],
      status: 'rejected',
      proposal: { priceLabel: '월 500만원 제안', timeLabel: '주 30시간 가능' },
      strengths: ['사용자 인터뷰 및 설문 분석', '정량/정성 데이터 처리', '리서치 리포트 작성'],
      approach: ['리서치 기반 UX 인사이트 도출', '페르소나 및 저니맵 작성', '문제정의와 가설 검증 프로세스'],
    },
    {
      id: 'a4',
      name: '최은지',
      roleLabel: '프로덕트 디자이너 • 4년 경력',
      tags: ['Figma', '프로토타입', '시스템 설계'],
      status: 'reviewing',
      proposal: { priceLabel: '월 600만원 제안', timeLabel: '주 35시간 가능' },
      strengths: ['모바일 앱 UX 최적화', '디자인 시스템 운영', '개발 협업 경험'],
      approach: ['컴포넌트 라이브러리 정비', '프로토타입 중심 검증', '데이터 기반 의사결정'],
    },
  ])

  const passedCount = useMemo(() => applicants.filter((a) => a.status === 'passed').length, [applicants])
  const remainingCount = Math.max(targetCount - passedCount, 0)

  const filtered = useMemo(() => {
    if (activeTab === 'all') return applicants
    return applicants.filter((a) => a.status === activeTab)
  }, [activeTab, applicants])

  const statusLabel = (s: ApplicantStatus) => (s === 'reviewing' ? '검토중' : s === 'passed' ? '합격' : '불합격')

  const statusBadgeStyle = (s: ApplicantStatus) =>
    s === 'reviewing' ? styles.badgeReviewing : s === 'passed' ? styles.badgePassed : styles.badgeRejected

  const openDecision = (id: string, type: 'pass' | 'final' | 'reject') => {
    setDecisionTargetId(id)
    setDecisionType(type)
    setDecisionNote('')
    setDecisionOpen(true)
  }

  const applyDecision = () => {
    if (!decisionTargetId) return
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === decisionTargetId
          ? { ...a, status: decisionType === 'reject' ? 'rejected' : 'passed' }
          : a
      )
    )
    setDecisionOpen(false)
    Alert.alert('처리 완료', decisionType === 'reject' ? '불합격 처리했습니다.' : decisionType === 'final' ? '최종 합격 처리했습니다.' : '합격 처리했습니다.')
  }

  const quickStatusChange = (id: string) => {
    Alert.alert('상태 변경', '지원자 상태를 선택하세요.', [
      { text: '검토중', onPress: () => setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'reviewing' } : a))) },
      { text: '합격', onPress: () => setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'passed' } : a))) },
      { text: '불합격', style: 'destructive', onPress: () => setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a))) },
      { text: '취소', style: 'cancel' },
    ])
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
            navigation.navigate('Home')
          }}
        >
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UI/UX 디자이너 지원자 관리</Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => Alert.alert('필터', '고급 필터는 추후 제공됩니다.')}> 
          <FontAwesome5 name="filter" size={14} color="#FFFFFF" />
          <Text style={styles.btnPrimaryText}>필터</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.filterTabs}>
          {[
            { key: 'all', label: `전체 (${applicants.length})` },
            { key: 'reviewing', label: `검토중 (${applicants.filter((a) => a.status === 'reviewing').length})` },
            { key: 'passed', label: `합격 (${applicants.filter((a) => a.status === 'passed').length})` },
            { key: 'rejected', label: `불합격 (${applicants.filter((a) => a.status === 'rejected').length})` },
          ].map((t) => (
            <TouchableOpacity key={t.key} style={[styles.filterTab, activeTab === (t.key as any) && styles.filterTabActive]} onPress={() => setActiveTab(t.key as any)}>
              <Text style={[styles.filterTabText, activeTab === (t.key as any) && styles.filterTabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.filterStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>총 모집 인원:</Text>
            <Text style={styles.statNumber}>{targetCount}명</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>현재 합격자:</Text>
            <Text style={styles.statNumber}>{passedCount}명</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>남은 인원:</Text>
            <Text style={styles.statNumber}>{remainingCount}명</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filtered.map((a) => (
          <View key={a.id} style={styles.card}>
            <View style={styles.applicantHeader}>
              <View style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.applicantName}>{a.name}</Text>
                <Text style={styles.applicantRole}>{a.roleLabel}</Text>
                <View style={styles.tagsRow}>
                  {a.tags.map((tag) => (
                    <View key={`${a.id}-${tag}`} style={styles.tagChip}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.statusColumn}>
                <View style={[styles.statusBadge, statusBadgeStyle(a.status)]}>
                  <Text style={styles.statusBadgeText}>{statusLabel(a.status)}</Text>
                </View>
                <TouchableOpacity style={styles.statusChangeBtn} onPress={() => quickStatusChange(a.id)}>
                  <Text style={styles.statusChangeText}>상태 변경</Text>
                  <FontAwesome5 name="chevron-down" size={12} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.proposalBox}>
              <Text style={styles.proposalTitle}>제안서 요약</Text>
              <Text style={styles.proposalPrice}>{a.proposal.priceLabel}</Text>
              <Text style={styles.proposalTime}>{a.proposal.timeLabel}</Text>
            </View>

            <View style={styles.detailGrid}>
              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>핵심 역량</Text>
                <View>
                  {a.strengths.map((s, i) => (
                    <Text key={`st-${a.id}-${i}`} style={styles.detailText}>• {s}</Text>
                  ))}
                </View>
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>제안 접근 방식</Text>
                <View>
                  {a.approach.map((s, i) => (
                    <Text key={`ap-${a.id}-${i}`} style={styles.detailText}>• {s}</Text>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.btnInfo} onPress={() => Alert.alert('프로필', '지원자 프로필로 이동합니다.')}> 
                <FontAwesome5 name="user" size={14} color="#FFFFFF" />
                <Text style={styles.btnInfoText}>프로필 보기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOutline} onPress={() => Alert.alert('메시지', `${a.name}님과 채팅을 시작합니다.`)}>
                <FontAwesome5 name="comment" size={14} color="#374151" />
                <Text style={styles.btnOutlineText}>메시지</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSuccess} onPress={() => openDecision(a.id, 'pass')}>
                <FontAwesome5 name="check" size={14} color="#FFFFFF" />
                <Text style={styles.btnSuccessText}>합격</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDanger} onPress={() => openDecision(a.id, 'reject')}>
                <FontAwesome5 name="times" size={14} color="#FFFFFF" />
                <Text style={styles.btnDangerText}>불합격</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={decisionOpen} transparent animationType="fade" onRequestClose={() => setDecisionOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{decisionType === 'reject' ? '불합격 처리' : decisionType === 'final' ? '최종 합격 처리' : '합격 처리'}</Text>
              <Text style={styles.modalSubtitle}>결정 사유를 간단히 기록하세요.</Text>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>메모</Text>
                <View style={styles.textarea}>
                  <Text style={styles.textareaPlaceholder}>{decisionNote || '결정 사유를 입력하세요'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setDecisionOpen(false)}>
                <Text style={styles.modalBtnCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtnConfirm, decisionType === 'reject' && styles.modalBtnConfirmDanger]} onPress={applyDecision}>
                <Text style={styles.modalBtnConfirmText}>확인</Text>
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

  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },

  filterSection: { backgroundColor: '#FFFFFF', paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  filterTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  filterTab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#F3F4F6' },
  filterTabActive: { backgroundColor: '#2563EB' },
  filterTabText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  filterTabTextActive: { color: '#FFFFFF' },
  filterStats: { flexDirection: 'row', columnGap: 16 },
  statItem: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  statLabel: { fontSize: 12, color: '#6B7280' },
  statNumber: { fontSize: 12, fontWeight: '700', color: '#2563EB' },

  content: { paddingBottom: 100, paddingHorizontal: 12, paddingTop: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  applicantHeader: { flexDirection: 'row', alignItems: 'flex-start', columnGap: 12, marginBottom: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#e9ecef' },
  applicantName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  applicantRole: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: { backgroundColor: '#F3F4F6', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
  tagText: { fontSize: 12, color: '#374151' },

  statusColumn: { alignItems: 'flex-end', rowGap: 6 },
  statusBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15 },
  badgeReviewing: { backgroundColor: '#F59E0B' },
  badgePassed: { backgroundColor: '#22C55E' },
  badgeRejected: { backgroundColor: '#DC2626' },
  statusBadgeText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  statusChangeBtn: { flexDirection: 'row', alignItems: 'center', columnGap: 6, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  statusChangeText: { fontSize: 12, color: '#374151' },

  proposalBox: { backgroundColor: '#F0F7FF', borderColor: '#B3D9FF', borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12 },
  proposalTitle: { fontSize: 13, fontWeight: '700', color: '#2563EB', marginBottom: 8 },
  proposalPrice: { fontSize: 14, fontWeight: '700', color: '#2563EB', marginBottom: 4 },
  proposalTime: { fontSize: 12, color: '#6B7280' },

  detailGrid: { flexDirection: 'row', columnGap: 12 },
  detailSection: { flex: 1, backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8 },
  detailTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 6 },
  detailText: { fontSize: 12, color: '#374151' },

  actionRow: { flexDirection: 'row', columnGap: 8, justifyContent: 'flex-end', marginTop: 12 },
  btnInfo: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0EA5E9', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnInfoText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#EEEEEE', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 14, fontWeight: '500' },
  btnSuccess: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#22C55E', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnSuccessText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  btnDanger: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#DC2626', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnDangerText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  modalContent: { width: '90%', maxWidth: 500, backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden' },
  modalHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  modalSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  modalBody: { padding: 16 },
  formGroup: { marginBottom: 12 },
  formLabel: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 6 },
  textarea: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, minHeight: 100, justifyContent: 'flex-start' },
  textareaPlaceholder: { fontSize: 13, color: '#6B7280' },
  modalFooter: { flexDirection: 'row', columnGap: 8, padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  modalBtnCancel: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  modalBtnCancelText: { fontSize: 14, color: '#374151', fontWeight: '700' },
  modalBtnConfirm: { flex: 1, backgroundColor: '#0066CC', borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  modalBtnConfirmDanger: { backgroundColor: '#DC2626' },
  modalBtnConfirmText: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },
})

