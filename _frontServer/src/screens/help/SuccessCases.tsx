import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons'

type CaseStory = {
  id: string
  title: string
  expert: string
  company: string
  certification: string
  metrics: { label: string; value: string }[]
  badge?: string
}

const stories: CaseStory[] = [
  {
    id: 'c1',
    title: '스타트업을 위한 파트타임 CMO',
    expert: '김민수 (중견 IT기업 PM 출신 마케터)',
    company: '시드 단계 스타트업',
    certification: '브랜딩/그로스 마케팅',
    metrics: [
      { label: 'CAC', value: '40% 감소' },
      { label: '전환율', value: '2.1배 향상' }
    ],
    badge: '🚀'
  },
  {
    id: 'c2',
    title: 'ISO 27001 인증 준비 컨설팅',
    expert: '이보안 (정보보호 컨설턴트 10년)',
    company: '중견 SaaS 기업',
    certification: 'ISO 27001',
    metrics: [
      { label: '준비 기간', value: '3개월' },
      { label: '문서 완성도', value: '95%' }
    ],
    badge: '🔒'
  },
  {
    id: 'c3',
    title: 'GS 인증을 위한 품질 개선',
    expert: '박QA (SW 테스트 리드 8년)',
    company: '모바일 앱 서비스',
    certification: 'GS 인증',
    metrics: [
      { label: '버그 감소', value: '68%' },
      { label: '릴리즈 성공률', value: '99%' }
    ],
    badge: '✅'
  },
  {
    id: 'c4',
    title: 'ISMS-P 개인정보 보호 체계 구축',
    expert: '정보호 (개인정보보호 전문가 12년)',
    company: '핀테크 서비스',
    certification: 'ISMS-P',
    metrics: [
      { label: '심사 지적', value: '0건' },
      { label: '내부 교육', value: '전사 완료' }
    ],
    badge: '🏆'
  },
  {
    id: 'c5',
    title: '데이터 대시보드 구축로 의사결정 개선',
    expert: '최데이터 (데이터 사이언스 7년)',
    company: '커머스 플랫폼',
    certification: '데이터 분석',
    metrics: [
      { label: '리드타임', value: '35% 단축' },
      { label: '매출 기여', value: '+12%' }
    ],
    badge: '📊'
  },
  {
    id: 'c6',
    title: '클라우드 아키텍처 최적화',
    expert: '오클라우드 (클라우드 아키텍트 9년)',
    company: '엔터프라이즈 시스템',
    certification: '아키텍처 최적화',
    metrics: [
      { label: '비용', value: '28% 절감' },
      { label: '가용성', value: '99.95%' }
    ],
    badge: '☁️'
  }
]

export default function SuccessCases() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const screenWidth = Dimensions.get('window').width
  const cardWidth = (screenWidth - 20 * 2 - 12) / 2

  return (
    <View style={[styles.container, { paddingTop: insets.top }] }>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          activeOpacity={0.8}
          onPress={() => {
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
          }}
        >
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>성공사례</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {stories.map((s) => (
            <View key={s.id} style={[styles.card, { width: cardWidth }] }>
              <View style={styles.cardHeader}>
                {s.badge ? <Text style={styles.badge}>{s.badge}</Text> : <View />}
                <FontAwesome5 name="trophy" size={16} color="#F59E0B" />
              </View>
              <Text style={styles.cardTitle}>{s.title}</Text>
              <View style={styles.metaRow}><Text style={styles.metaLabel}>전문가</Text><Text style={styles.metaValue}>{s.expert}</Text></View>
              <View style={styles.metaRow}><Text style={styles.metaLabel}>고객사</Text><Text style={styles.metaValue}>{s.company}</Text></View>
              <View style={styles.metaRow}><Text style={styles.metaLabel}>인증/분야</Text><Text style={styles.metaValue}>{s.certification}</Text></View>
              <View style={styles.resultsBox}>
                <Text style={styles.resultsTitle}>성과</Text>
                <View style={styles.metrics}>
                  {s.metrics.map((m, idx) => (
                    <View key={idx} style={styles.metricItem}>
                      <Text style={styles.metricLabel}>{m.label}</Text>
                      <Text style={styles.metricValue}>{m.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6'
  },
  header: {
    height: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827'
  },
  headerIcon: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    paddingBottom: 20
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#ececec'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  badge: {
    fontSize: 16
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 4
  },
  metaLabel: {
    width: 70,
    fontSize: 13,
    color: '#6B7280'
  },
  metaValue: {
    flex: 1,
    fontSize: 13,
    color: '#374151'
  },
  resultsBox: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F9FAFB'
  },
  resultsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  metricItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280'
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F766E'
  }
})
