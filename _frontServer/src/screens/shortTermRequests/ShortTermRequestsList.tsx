import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type RequestItem = {
  id: string
  title: string
  meta: { icon: string; text: string }[]
  status: 'recruiting' | 'in-progress' | 'completed'
  statusLabel: string
  actions: { label: string; type?: 'primary' | 'danger'; onPress: () => void }[]
}

export default function ShortTermRequestsList() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [activeTab, setActiveTab] = useState<'in-progress' | 'completed'>('in-progress')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTargetTitle, setModalTargetTitle] = useState('')

  const openCloseModal = (title: string) => {
    setModalTargetTitle(title)
    setModalOpen(true)
  }
  const confirmCloseRequest = () => {
    setModalOpen(false)
    Alert.alert('마감', '의뢰가 성공적으로 마감되었습니다.')
  }

  const inProgressList = useMemo<RequestItem[]>(
    () => [
      {
        id: 'r1',
        title: '보안 진단 보고서 작성 (3일)',
        meta: [
          { icon: 'users', text: '3명 지원' },
          { icon: 'calendar-times', text: '3일 남음' },
        ],
        status: 'recruiting',
        statusLabel: '모집중',
        actions: [
          { label: '내용 보기', type: 'primary', onPress: () => navigation.navigate('ShortTermRequestsApplicants', { prev: 'ShortTermRequestsList' } as never) },
          { label: '수정', onPress: () => Alert.alert('안내', '의뢰 수정 페이지로 이동합니다.') },
          { label: '마감', type: 'danger', onPress: () => openCloseModal('보안 진단 보고서 작성 (3일)') },
        ],
      },
      {
        id: 'r2',
        title: '스타트업 IR 자료 작성 지원',
        meta: [
          { icon: 'user-check', text: '1명 선정' },
          { icon: 'calendar-check', text: '계약 진행중' },
        ],
        status: 'in-progress',
        statusLabel: '진행중',
        actions: [
          { label: '계약 보기', type: 'primary', onPress: () => Alert.alert('안내', '계약 상세 페이지로 이동합니다.') },
          { label: '메시지', onPress: () => Alert.alert('안내', '해당 전문가와의 채팅방으로 이동합니다.') },
        ],
      },
    ],
    [navigation]
  )

  const completedList = useMemo<RequestItem[]>(
    () => [
      {
        id: 'r3',
        title: '클라우드 아키텍처 설계 (1주)',
        meta: [
          { icon: 'star', text: '5.0 평점' },
          { icon: 'calendar', text: '2025-02-25 완료' },
        ],
        status: 'completed',
        statusLabel: '완료',
        actions: [
          { label: '상세보기', type: 'primary', onPress: () => navigation.navigate('ShortTermRequestsDetail', { prev: 'ShortTermRequestsList' } as never) },
          { label: '재등록', onPress: () => Alert.alert('안내', '이전 내용을 기반으로 새 의뢰 등록 페이지로 이동합니다.') },
        ],
      },
    ],
    [navigation]
  )

  const currentList = activeTab === 'in-progress' ? inProgressList : completedList

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => {
          const prev = (route as any)?.params?.prev
          if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
            (navigation as any).goBack()
            return
          }
          if (typeof prev === 'string') {
            navigation.navigate(prev)
            return
          }
          navigation.navigate('Home')
        }}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내가 등록한 의뢰</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabNav}>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'in-progress' && styles.tabButtonActive]} onPress={() => setActiveTab('in-progress')}>
          <Text style={[styles.tabButtonText, activeTab === 'in-progress' && styles.tabButtonTextActive]}>진행중</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'completed' && styles.tabButtonActive]} onPress={() => setActiveTab('completed')}>
          <Text style={[styles.tabButtonText, activeTab === 'completed' && styles.tabButtonTextActive]}>마감/취소</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {currentList.length === 0 ? (
          <View style={styles.noDataContainer}>
            <FontAwesome5 name="box-open" size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
            <Text style={styles.noDataTitle}>등록된 의뢰가 없습니다</Text>
            <Text style={styles.noDataDesc}>새로운 의뢰를 등록해 전문가를 찾아보세요</Text>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('ShortTermRequestsInput', { prev: 'ShortTermRequestsList' } as never)}>
              <FontAwesome5 name="plus" size={14} color="#FFFFFF" />
              <Text style={styles.btnPrimaryText}>의뢰 등록</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {currentList.map((item) => (
              <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.85} onPress={() => navigation.navigate('ShortTermRequestsDetail', { prev: 'ShortTermRequestsList' } as never)}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleSection}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={styles.cardMetaRow}>
                      {item.meta.map((m, i) => (
                        <View key={`${m.text}-${i}`} style={styles.cardMetaItem}>
                          <FontAwesome5 name={m.icon as any} size={12} color="#2563EB" />
                          <Text style={styles.cardMetaText}>{m.text}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={[styles.statusBadge, item.status === 'recruiting' ? styles.statusRecruiting : item.status === 'in-progress' ? styles.statusInProgress : styles.statusCompleted]}>
                    <Text style={styles.statusText}>{item.statusLabel}</Text>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  {item.actions.map((a) => (
                    <TouchableOpacity key={a.label} style={[styles.cardActionBtn, a.type === 'primary' && styles.cardActionPrimary, a.type === 'danger' && styles.cardActionDanger]} onPress={a.onPress}>
                      <Text style={[styles.cardActionText, a.type === 'primary' && styles.cardActionTextPrimary, a.type === 'danger' && styles.cardActionTextDanger]}>{a.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => navigation.navigate('ShortTermRequestsInput', { prev: 'ShortTermRequestsList' } as never)}>
        <FontAwesome5 name="plus" size={18} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>정말 마감하시겠습니까?</Text>
            <Text style={styles.modalBody}>의뢰를 마감하면 더 이상 새로운 지원을 받을 수 없습니다. ({modalTargetTitle})</Text>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnOutline} onPress={() => setModalOpen(false)}>
                <FontAwesome5 name="times" size={14} color="#333333" />
                <Text style={styles.btnOutlineText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDanger} onPress={confirmCloseRequest}>
                <FontAwesome5 name="check" size={14} color="#FFFFFF" />
                <Text style={styles.btnDangerText}>마감하기</Text>
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

  tabNav: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabButtonActive: { borderBottomColor: '#2563EB' },
  tabButtonText: { fontSize: 14, color: '#374151' },
  tabButtonTextActive: { color: '#2563EB', fontWeight: '700' },

  content: { paddingBottom: 100, paddingHorizontal: 12, paddingTop: 12 },

  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardTitleSection: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardMetaRow: { flexDirection: 'row', columnGap: 12 },
  cardMetaItem: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  cardMetaText: { fontSize: 12, color: '#6B7280' },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusRecruiting: { backgroundColor: '#3B82F6' },
  statusInProgress: { backgroundColor: '#FBBF24' },
  statusCompleted: { backgroundColor: '#F3F4F6' },
  statusText: { color: '#111827', fontSize: 12, fontWeight: '700' },

  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', columnGap: 8, marginTop: 4 },
  cardActionBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, backgroundColor: '#FFFFFF' },
  cardActionText: { fontSize: 13, color: '#374151' },
  cardActionPrimary: { borderColor: '#2563EB' },
  cardActionTextPrimary: { color: '#2563EB', fontWeight: '700' },
  cardActionDanger: { borderColor: '#DC2626' },
  cardActionTextDanger: { color: '#DC2626', fontWeight: '700' },

  noDataContainer: { alignItems: 'center', paddingVertical: 60 },
  noDataTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  noDataDesc: { fontSize: 13, color: '#6B7280', marginBottom: 12 },

  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  modalContent: { width: '88%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
  modalBody: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  modalFooter: { flexDirection: 'row', columnGap: 8, justifyContent: 'flex-end' },

  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#EEEEEE', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 14, fontWeight: '500' },
  btnDanger: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#DC2626', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnDangerText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
})

