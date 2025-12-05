import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MyPageCorporate() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()
  const [company] = useState({
    name: '전시테크 주식회사',
    type: '법인 기업',
    status: '인증 기업',
    logo: 'https://picsum.photos/seed/company/240/240.jpg',
    info: [
      { icon: 'building', label: 'IT/개발' },
      { icon: 'map-marker-alt', label: '서울시 강남구' },
      { icon: 'users', label: '직원 58명' }
    ]
  })
  const [logoFailed, setLogoFailed] = useState(false)

  const quickActions = [
    { id: 'LoginInfoEdit', label: '로그인 정보 수정', icon: 'key', status: '활성', active: true },
    { id: 'RegistrationCompany', label: '기업 정보 관리', icon: 'id-badge', status: '프로필 등록 완료' },
    { id: 'company-history', label: '회사 연혁 관리', icon: 'history', status: '2개 등록' },
    { id: 'service', label: '서비스 이용 내역', icon: 'clipboard-list', status: '진행중 2건' },
    { id: 'review', label: '리뷰 관리', icon: 'star', status: '4.6점 (18개)' },
    { id: 'schedule', label: '일정 관리', icon: 'calendar-check', status: '예약 1건' },
    { id: 'payment-method', label: '결제수단', icon: 'credit-card', status: '2개 등록' },
    { id: 'payment-history', label: '결제 내역', icon: 'won-sign', status: '최근 10건' },
    { id: 'bookmark', label: '북마크', icon: 'bookmark', status: '5개' },
    { id: 'inquiry', label: '1:1 문의', icon: 'comment-dots', status: '문의하기' }
  ]

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
        <Text style={styles.headerTitle}>마이페이지(기업)</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          {logoFailed ? (
            <View style={[styles.companyLogo, { alignItems: 'center', justifyContent: 'center' }]}>
              <FontAwesome5 name="building" size={28} color="#6B7280" />
            </View>
          ) : (
            <Image source={{ uri: company.logo }} style={styles.companyLogo} onError={() => setLogoFailed(true)} />
          )}
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{company.name}</Text>
            <View style={styles.companyTypeBadge}><Text style={styles.companyTypeText}>{company.type}</Text></View>
            <View style={styles.companyStatusBadge}><Text style={styles.companyStatusText}>{company.status}</Text></View>
            <View style={styles.companyDetailsRow}>
              {company.info.map((d) => (
                <View key={d.label} style={styles.companyDetailItem}>
                  <FontAwesome5 name={d.icon as any} size={12} color="#2563EB" />
                  <Text style={styles.companyDetailText}>{d.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.quickAction, action.active && styles.quickActionActive]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(action.id as never, { prev: 'MyPageCorporate' } as never)}
            >
              <View style={styles.quickActionLeft}>
                <View style={styles.quickActionIconContainer}>
                  <FontAwesome5 name={action.icon as any} size={16} color="#007bff" />
                </View>
                <View style={styles.quickActionContent}>
                  <Text style={styles.quickActionText}>{action.label}</Text>
                  <Text style={[styles.quickActionStatus, action.active && styles.quickActionStatusActive]}>{action.status}</Text>
                </View>
              </View>
              <FontAwesome5 name="chevron-right" size={16} color="#6c757d" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  content: { paddingBottom: 20 },

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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6'
  },
  companyLogo: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dee2e6',
    marginRight: 20,
    backgroundColor: '#F3F4F6'
  },
  companyInfo: { flex: 1 },
  companyName: { fontSize: 22, fontWeight: 'bold', marginBottom: 6, color: '#111827' },
  companyTypeBadge: { alignSelf: 'flex-start', backgroundColor: '#2563EB', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8 },
  companyTypeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  companyStatusBadge: { alignSelf: 'flex-start', backgroundColor: '#28a745', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12 },
  companyStatusText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  companyDetailsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  companyDetailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  companyDetailText: { color: '#6c757d', fontSize: 13 },

  quickActionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  quickAction: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  quickActionActive: { backgroundColor: 'rgba(0, 123, 255, 0.05)', borderLeftWidth: 3, borderLeftColor: '#007bff' },
  quickActionLeft: { flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1 },
  quickActionIconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#e3f2fd', alignItems: 'center', justifyContent: 'center' },
  quickActionContent: { flex: 1 },
  quickActionText: { fontWeight: '500', fontSize: 16, marginBottom: 2, color: '#111827' },
  quickActionStatus: { fontSize: 14, color: '#6c757d' },
  quickActionStatusActive: { color: '#007bff', fontWeight: '600' }
})
