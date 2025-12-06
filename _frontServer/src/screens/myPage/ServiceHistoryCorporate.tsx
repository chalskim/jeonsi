import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Status = 'ongoing' | 'completed' | 'cancelled'

type ServiceType = '긴급 채용 등록' | '추천 교육 등록' | '베너 광고 등록' | '구인 공고 등록'

type ServiceItem = {
  id: number
  serviceType: ServiceType
  serviceName: string
  serviceProvider: string
  period: string
  price: string
  status: Status
  rating: number | null
}

const getServiceIcon = (serviceType: ServiceType) => {
  switch (serviceType) {
    case '긴급 채용 등록':
      return 'user-clock'
    case '추천 교육 등록':
      return 'graduation-cap'
    case '베너 광고 등록':
      return 'ad'
    case '구인 공고 등록':
      return 'briefcase'
    default:
      return 'cog'
  }
}

export default function ServiceHistoryCorporate() {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()

  const [tab, setTab] = useState<'all' | Status>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const data = useMemo<{ all: ServiceItem[]; ongoing: ServiceItem[]; completed: ServiceItem[]; cancelled: ServiceItem[] }>(() => ({
    all: [
      {
        id: 1,
        serviceType: '긴급 채용 등록',
        serviceName: '시니어 프론트엔드 개발자 긴급 채용',
        serviceProvider: '채용 플랫폼',
        period: '2023-02-20 등록',
        price: '300,000원',
        status: 'completed',
        rating: 5
      },
      {
        id: 2,
        serviceType: '추천 교육 등록',
        serviceName: '직원 대상 디지털 마케팅 교육',
        serviceProvider: '교육 파트너',
        period: '2023-02-24 등록',
        price: '500,000원',
        status: 'ongoing',
        rating: null
      },
      {
        id: 3,
        serviceType: '베너 광고 등록',
        serviceName: '채용 공고 프로모션 배너',
        serviceProvider: '광고팀',
        period: '2023-01-15 등록',
        price: '150,000원',
        status: 'completed',
        rating: 4
      },
      {
        id: 4,
        serviceType: '구인 공고 등록',
        serviceName: '백엔드 개발자 채용 공고',
        serviceProvider: '인재팀',
        period: '2023-01-10 등록',
        price: '200,000원',
        status: 'cancelled',
        rating: null
      }
    ],
    ongoing: [
      {
        id: 2,
        serviceType: '추천 교육 등록',
        serviceName: '직원 대상 디지털 마케팅 교육',
        serviceProvider: '교육 파트너',
        period: '2023-02-24 등록',
        price: '500,000원',
        status: 'ongoing',
        rating: null
      }
    ],
    completed: [
      {
        id: 1,
        serviceType: '긴급 채용 등록',
        serviceName: '시니어 프론트엔드 개발자 긴급 채용',
        serviceProvider: '채용 플랫폼',
        period: '2023-02-20 등록',
        price: '300,000원',
        status: 'completed',
        rating: 5
      },
      {
        id: 3,
        serviceType: '베너 광고 등록',
        serviceName: '채용 공고 프로모션 배너',
        serviceProvider: '광고팀',
        period: '2023-01-15 등록',
        price: '150,000원',
        status: 'completed',
        rating: 4
      }
    ],
    cancelled: [
      {
        id: 4,
        serviceType: '구인 공고 등록',
        serviceName: '백엔드 개발자 채용 공고',
        serviceProvider: '인재팀',
        period: '2023-01-10 등록',
        price: '200,000원',
        status: 'cancelled',
        rating: null
      }
    ]
  }), [])

  const items = tab === 'all' ? data.all : data[tab]

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>서비스 이용 내역</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>서비스 이용 내역</Text>
          <Text style={styles.pageSubtitle}>채용 등록, 교육 추천, 베너 광고 등 이용 내역을 확인하세요</Text>
        </View>

        <View style={styles.tabs}>
          {[
            { code: 'all', label: '전체' },
            { code: 'ongoing', label: '진행중' },
            { code: 'completed', label: '완료' },
            { code: 'cancelled', label: '취소' }
          ].map((t) => (
            <TouchableOpacity key={t.code} style={[styles.tab, tab === t.code && styles.tabOn]} onPress={() => setTab(t.code as any)}>
              <Text style={[styles.tabText, tab === t.code && styles.tabTextOn]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: 15 }}>
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color="#1f5cff" />
              <Text style={styles.loadingText}>서비스 이용 내역을 불러오는 중...</Text>
            </View>
          ) : items.length === 0 ? (
            <View style={styles.empty}>
              <FontAwesome5 name="clipboard-list" size={40} color="#9CA3AF" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>서비스 이용 내역이 없습니다</Text>
              <Text style={styles.emptyDesc}>아직 이용한 서비스가 없습니다. 첫 번째 서비스를 이용해보세요!</Text>
              <TouchableOpacity style={styles.btnPrimary}><Text style={styles.btnPrimaryText}>서비스 둘러보기</Text></TouchableOpacity>
            </View>
          ) : (
            <View style={{ rowGap: 12 }}>
              {items.map((it) => (
                <TouchableOpacity key={it.id} style={styles.card} activeOpacity={0.8}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.serviceProvider}>{it.serviceProvider}</Text>
                    <View style={[styles.statusBadge, it.status === 'ongoing' ? styles.statusInfo : it.status === 'completed' ? styles.statusSuccess : styles.statusDanger]}>
                      <Text style={styles.statusText}>{it.status === 'ongoing' ? '진행중' : it.status === 'completed' ? '완료' : '취소'}</Text>
                    </View>
                  </View>
                  <View style={styles.serviceType}>
                    <FontAwesome5 name={getServiceIcon(it.serviceType)} size={14} color="#1f5cff" style={{ marginRight: 6 }} />
                    <Text style={styles.serviceTypeText}>{it.serviceType}</Text>
                  </View>
                  <Text style={styles.serviceName}>{it.serviceName}</Text>
                  <View style={styles.cardDetails}>
                    <Text style={styles.period}>{it.period}</Text>
                    <Text style={styles.price}>{it.price}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <View style={styles.ratingRow}>
                      {it.rating ? Array.from({ length: it.rating }).map((_, i) => (
                        <FontAwesome5 key={i} name="star" size={14} color="#F59E0B" style={{ marginRight: 4 }} />
                      )) : <Text style={styles.ratePrompt}>리뷰 남기기</Text>}
                    </View>
                    <Text style={styles.action}>상세 보기</Text>
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
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  pageHeader: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0', padding: 16 },
  pageTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  pageSubtitle: { fontSize: 13, color: '#6b7280' },

  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: '#ffffff' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  tabOn: { borderBottomWidth: 3, borderBottomColor: '#1f5cff' },
  tabText: { fontSize: 13, color: '#111827', fontWeight: '600' },
  tabTextOn: { color: '#1f5cff' },

  loading: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  loadingText: { marginTop: 8, fontSize: 13, color: '#6b7280' },

  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  emptyDesc: { fontSize: 13, color: '#6b7280', marginBottom: 12 },

  btnPrimary: { backgroundColor: '#1f5cff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24 },
  btnPrimaryText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },

  card: { backgroundColor: '#ffffff', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 },
  serviceProvider: { fontSize: 15, fontWeight: '700', color: '#111827' },

  serviceType: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  serviceTypeText: { fontSize: 12, color: '#1f5cff', fontWeight: '600' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusText: { fontSize: 11, fontWeight: '600' },
  statusInfo: { backgroundColor: 'rgba(23,162,184,0.2)' },
  statusSuccess: { backgroundColor: 'rgba(40,167,69,0.2)' },
  statusDanger: { backgroundColor: 'rgba(220,53,69,0.2)' },

  serviceName: { fontSize: 14, color: '#111827', marginBottom: 8 },
  cardDetails: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  period: { fontSize: 12, color: '#6b7280' },
  price: { fontSize: 13, fontWeight: '700', color: '#1f5cff' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratePrompt: { fontSize: 12, color: '#1f5cff', fontWeight: '600' },
  action: { fontSize: 12, color: '#1f5cff', fontWeight: '600' }
})

