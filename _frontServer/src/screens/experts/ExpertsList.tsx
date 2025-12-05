import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ExpertStatus = 'active' | 'inactive'
type Expert = {
  id: number
  name: string
  title: string
  photo: string
  expertise: string[]
  availability: string
  packages: string
  status: ExpertStatus
}

export default function ExpertsList() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [viewType, setViewType] = useState<'table' | 'card'>('card')
  

  const [experts, setExperts] = useState<Expert[]>([
    { id: 1, name: '김민준', title: '10년 경력 마케팅 & 브랜딩 전문가', photo: 'https://picsum.photos/seed/expert1/50/50.jpg', expertise: ['마케팅', '브랜딩', '전략 기획'], availability: '월, 화, 수, 목, 금 / 오전, 오후', packages: '월 80-150만원', status: 'active' },
    { id: 2, name: '이서연', title: '8년 경력 UI/UX 디자이너', photo: 'https://picsum.photos/seed/expert2/50/50.jpg', expertise: ['UI/UX', '프로토타이핑', '사용자 리서치'], availability: '화, 수, 목, 금 / 오후, 저녁', packages: '월 120만원', status: 'active' },
    { id: 3, name: '박현우', title: '12년 경력 풀스택 개발자', photo: 'https://picsum.photos/seed/expert3/50/50.jpg', expertise: ['웹 개발', '앱 개발', '클라우드'], availability: '월, 화, 수, 목, 금, 토 / 저녁', packages: '월 100-200만원', status: 'active' },
    { id: 4, name: '최지아', title: '7년 경력 재무 컨설턴트', photo: 'https://picsum.photos/seed/expert4/50/50.jpg', expertise: ['재무 분석', 'IR', '투자 유치'], availability: '월, 수, 금 / 오전', packages: '월 60-150만원', status: 'active' },
    { id: 5, name: '정도현', title: '9년 경력 HR 전문가', photo: 'https://picsum.photos/seed/expert5/50/50.jpg', expertise: ['채용', '조직 문화', '성과 관리'], availability: '화, 목, 금 / 오후', packages: '월 70-120만원', status: 'active' },
    { id: 6, name: '강민서', title: '6년 경력 데이터 분석가', photo: 'https://picsum.photos/seed/expert6/50/50.jpg', expertise: ['데이터 분석', '머신러닝', '비즈니스 인텔리전스'], availability: '월, 화, 수, 목, 금 / 저녁', packages: '월 100만원', status: 'inactive' },
  ])

  const ExpertPhoto = ({ uri }: { uri: string }) => {
    const [error, setError] = useState(false)
    return error ? (
      <View style={[styles.expertPhoto, { alignItems: 'center', justifyContent: 'center' }]}>
        <FontAwesome5 name="user" size={20} color="#6B7280" />
      </View>
    ) : (
      <Image source={{ uri }} style={styles.expertPhoto} onError={() => setError(true)} />
    )
  }

  const dashboardStats = useMemo(() => ({ registered: experts.length, ongoing: 3, completed: 12 }), [experts.length])

  const addExpert = () => navigation.navigate('ExpertsRegistration', { prev: 'ExpertsList' })

  

  const deleteExpert = (id: number) => {
    Alert.alert('삭제 확인', '정말로 이 전문가를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => setExperts((prev) => prev.filter((e) => e.id !== id)) },
    ])
  }

  const editExpert = (id: number) => Alert.alert('안내', '전문가 수정 기능은 준비 중입니다.')
  const viewExpert = (_id: number) => navigation.navigate('ExpertsDetail', { prev: 'ExpertsList' })
  

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
        <Text style={styles.headerTitle}>내가 등록한 전문가 목록</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* <View style={styles.dashboardHeader}>
          <View style={styles.dashboardRow}>
            <View style={styles.statCard}><Text style={styles.statNumber}>{dashboardStats.registered}</Text><Text style={styles.statLabel}>등록 전문가</Text></View>
            <View style={styles.statCard}><Text style={styles.statNumber}>{dashboardStats.ongoing}</Text><Text style={styles.statLabel}>진행 중 프로젝트</Text></View>
            <View style={styles.statCard}><Text style={styles.statNumber}>{dashboardStats.completed}</Text><Text style={styles.statLabel}>완료된 프로젝트</Text></View>
          </View>
        </View> */}

        <View style={styles.actionBar}>
          <Text style={styles.actionTitle}>내가 등록한 전문가 ({experts.length}개)</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.btnPrimary} onPress={addExpert}>
              <FontAwesome5 name="plus" size={14} color="#FFFFFF" />
              <Text style={styles.btnPrimaryText}>전문가 추가</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listContainer}>
          {viewType === 'table' ? (
            <View>
              {experts.map((e) => (
                <View key={e.id} style={styles.tableRow}>
                  <View style={[styles.tableCell, { flex: 2 }]}> 
                    <View style={styles.expertInfoRow}>
                      <ExpertPhoto uri={e.photo} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.expertName}>{e.name}</Text>
                        <Text style={styles.expertTitle}>{e.title}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }]}> 
                    <View style={styles.tagRow}>
                      {e.expertise.map((t) => (
                        <View key={`${e.id}-${t}`} style={styles.tagChip}><Text style={styles.tagText}>{t}</Text></View>
                      ))}
                    </View>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }]}> 
                    <Text style={styles.availabilityText}>{e.availability}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }]}> 
                    <Text style={styles.packagesText}>{e.packages}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }]}> 
                    <View style={styles.actionsRow}>
                      <TouchableOpacity style={styles.btnPrimary} onPress={() => viewExpert(e.id)}>
                        <FontAwesome5 name="eye" size={14} color="#FFFFFF" />
                        <Text style={styles.btnPrimaryText}>보기</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnOutline} onPress={() => editExpert(e.id)}>
                        <FontAwesome5 name="edit" size={14} color="#374151" />
                        <Text style={styles.btnOutlineText}>수정</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnDanger} onPress={() => deleteExpert(e.id)}>
                        <FontAwesome5 name="trash" size={14} color="#FFFFFF" />
                        <Text style={styles.btnDangerText}>삭제</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.cardGrid}>
              {experts.map((e) => (
                <TouchableOpacity key={`card-${e.id}`} style={styles.card} activeOpacity={0.85} onPress={() => viewExpert(e.id)}>
                  <View style={styles.cardHeader}>
                    <ExpertPhoto uri={e.photo} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.expertName}>{e.name}</Text>
                      <Text style={styles.expertTitle}>{e.title}</Text>
                    </View>
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.tagRow}>
                      {e.expertise.map((t) => (
                        <View key={`chip-${e.id}-${t}`} style={styles.tagChip}><Text style={styles.tagText}>{t}</Text></View>
                      ))}
                    </View>
                    <Text style={[styles.availabilityText, { marginTop: 8 }]}><Text style={styles.label}>가능 시간: </Text>{e.availability}</Text>
                    <Text style={[styles.packagesText, { marginTop: 8 }]}><Text style={styles.label}>패키지: </Text>{e.packages}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <View style={[styles.statusBadge, e.status === 'active' ? styles.statusActive : styles.statusInactive]}>
                      <Text style={styles.statusText}>{e.status === 'active' ? '활성' : '비활성'}</Text>
                    </View>
                    <View style={styles.actionsRow}>
                      <TouchableOpacity style={styles.btnPrimary} onPress={() => viewExpert(e.id)}>
                        <FontAwesome5 name="eye" size={14} color="#FFFFFF" />
                        <Text style={styles.btnPrimaryText}>보기</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnOutline} onPress={() => editExpert(e.id)}>
                        <FontAwesome5 name="edit" size={14} color="#374151" />
                        <Text style={styles.btnOutlineText}>수정</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#dee2e6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  dashboardHeader: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12 },
  dashboardRow: { flexDirection: 'row', columnGap: 12 },
  statCard: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 8, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },

  actionBar: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginHorizontal: 16, marginVertical: 12, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  actionButtons: { flexDirection: 'row', columnGap: 8 },

  listContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, marginHorizontal: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#F8FAFC' },
  listTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  viewOptions: { flexDirection: 'row', columnGap: 8 },
  viewBtn: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, backgroundColor: '#FFFFFF' },
  viewBtnActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  viewBtnText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  viewBtnTextActive: { color: '#FFFFFF' },

  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingHorizontal: 16, paddingVertical: 12 },
  tableCell: { justifyContent: 'center', paddingRight: 8 },
  expertInfoRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  expertPhoto: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#e9ecef' },
  expertName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  expertTitle: { fontSize: 12, color: '#6B7280' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 12, color: '#1976d2', fontWeight: '600' },
  availabilityText: { fontSize: 12, color: '#6B7280' },
  packagesText: { fontSize: 12, color: '#22C55E', fontWeight: '700' },
  actionsRow: { flexDirection: 'row', columnGap: 8 },

  cardGrid: { padding: 16, flexDirection: 'column', gap: 12 },
  card: { width: '100%', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, overflow: 'hidden', backgroundColor: '#FFFFFF', marginBottom: 12 },
  cardHeader: { padding: 12, flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  cardBody: { paddingHorizontal: 12, paddingBottom: 12 },
  cardFooter: { paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#F8FAFC', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14 },
  statusActive: { backgroundColor: '#E8F5E9' },
  statusInactive: { backgroundColor: '#FFEBEE' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  label: { fontWeight: '700', color: '#111827' },

  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#EEEEEE', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 13, fontWeight: '600' },
  btnDanger: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#DC2626', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnDangerText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

  
})
