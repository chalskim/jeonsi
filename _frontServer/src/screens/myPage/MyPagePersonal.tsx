import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MyPagePersonal() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()
  const [user] = useState({
    name: '김민수',
    role: 'PM / 마케팅 전문가',
    status: '인증 전문가',
    avatar: 'https://picsum.photos/seed/expert/200/200.jpg'
  })
  const [avatarFailed, setAvatarFailed] = useState(false)

  const quickActions = [
    { id: 'LoginInfoEdit', label: '로그인 정보 수정', icon: 'user-cog', status: '활성', active: true },
    { id: 'resume', label: '지원결과 관리', icon: 'file-signature', status: '1개 등록' },
    { id: 'userinfo', label: '전문가 등록 관리', icon: 'user-tie', status: '1개 등록' },
    { id: 'portfolio', label: '포트폴리오', icon: 'images', status: '1개 등록' },
    { id: 'service', label: '서비스 내역', icon: 'tasks', status: '진행중 1건' },
    { id: 'review', label: '리뷰 관리', icon: 'star', status: '4.8점 (23개)' },
    { id: 'schedule', label: '일정 관리', icon: 'calendar-alt', status: '예약 2건, 희망 1건' },
    { id: 'payment-method', label: '결제수단', icon: 'wallet', status: '1개 등록' },
    { id: 'payment-history', label: '결제 내역', icon: 'file-invoice-dollar', status: '전체 내역' },
    { id: 'inquiry', label: '1:1 문의', icon: 'comment-dots', status: '문의하기' }
  ]

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
        <Text style={styles.headerTitle}>마이페이지</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          {avatarFailed ? (
            <View style={[styles.avatar, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }]}>
              <FontAwesome5 name="user" size={28} color="#6B7280" />
            </View>
          ) : (
            <Image source={{ uri: user.avatar }} style={styles.avatar} onError={() => setAvatarFailed(true)} />
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileRole}>{user.role}</Text>
            <View style={styles.profileStatusContainer}>
              <Text style={styles.profileStatus}>{user.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.quickAction, action.active && styles.quickActionActive]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(action.id as never, { prev: 'MyPagePersonal' } as never)}
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
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6'
  },
  content: {
    paddingBottom: 20
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
  headerIcons: {
    flexDirection: 'row',
    gap: 15
  },
  headerIcon: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2
  },
  badgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '700'
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#007bff',
    marginRight: 20
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111827'
  },
  profileRole: {
    color: '#6c757d',
    marginBottom: 10
  },
  profileStatusContainer: {
    backgroundColor: '#28a745',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
    width: 'auto',
    alignSelf: 'flex-start'
  },
  profileStatus: {
    color: 'white',
    fontSize: 12
  },
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
  quickActionActive: {
    backgroundColor: 'rgba(0, 123, 255, 0.05)',
    borderLeftWidth: 3,
    borderLeftColor: '#007bff'
  },
  quickActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1
  },
  quickActionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickActionContent: {
    flex: 1
  },
  quickActionText: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 2,
    color: '#111827'
  },
  quickActionStatus: {
    fontSize: 14,
    color: '#6c757d'
  },
  quickActionStatusActive: {
    color: '#007bff',
    fontWeight: '600'
  }
})
