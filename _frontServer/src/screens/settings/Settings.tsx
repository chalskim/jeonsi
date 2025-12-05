import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Settings() {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()

  const [pushOn, setPushOn] = useState(true)
  const [emailOn, setEmailOn] = useState(false)
  const [chatOn, setChatOn] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const [profileVisibility, setProfileVisibility] = useState<'전체 공개' | '친구만' | '비공개'>('전체 공개')
  const [language, setLanguage] = useState('한국어')

  const user = useMemo(() => ({ name: '홍길동', email: 'honggd@techsolution.com', projects: 126, rating: 4.9, years: '3년' }), [])

  const goBackSmart = () => {
    if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
      ;(navigation as any).goBack()
      return
    }
    navigation.navigate('Home')
  }

  const onSave = () => {
    Alert.alert('저장', '설정이 저장되었습니다.')
  }

  const cycleVisibility = () => {
    setProfileVisibility((v) => (v === '전체 공개' ? '친구만' : v === '친구만' ? '비공개' : '전체 공개'))
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={onSave}>
          <Text style={styles.headerAction}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}><FontAwesome5 name="user" size={28} color="#FFFFFF" /></View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <View style={styles.profileStats}>
            <View style={styles.statItem}><Text style={styles.statValue}>{String(user.projects)}</Text><Text style={styles.statLabel}>프로젝트</Text></View>
            <View style={styles.statItem}><Text style={styles.statValue}>{String(user.rating)}</Text><Text style={styles.statLabel}>평점</Text></View>
            <View style={styles.statItem}><Text style={styles.statValue}>{user.years}</Text><Text style={styles.statLabel}>활동</Text></View>
          </View>
        </View>

        <View style={styles.containerPad}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}><FontAwesome5 name="bell" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>알림 설정</Text></View>
            <View style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <View style={[styles.itemIcon, styles.iconNotification]}><FontAwesome5 name="mobile-alt" size={16} color="#f57c00" /></View>
                <View style={{ flex: 1 }}><Text style={styles.itemTitle}>푸시 알림</Text><Text style={styles.itemDesc}>새 프로젝트, 메시지 알림</Text></View>
              </View>
              <TouchableOpacity style={[styles.toggle, pushOn && styles.toggleOn]} onPress={() => setPushOn((v) => !v)}>
                <View style={[styles.slider, pushOn && styles.sliderOn]} />
              </TouchableOpacity>
            </View>
            <View style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <View style={[styles.itemIcon, styles.iconNotification]}><FontAwesome5 name="envelope" size={16} color="#f57c00" /></View>
                <View style={{ flex: 1 }}><Text style={styles.itemTitle}>이메일 알림</Text><Text style={styles.itemDesc}>마케팅, 프로모션 정보</Text></View>
              </View>
              <TouchableOpacity style={[styles.toggle, emailOn && styles.toggleOn]} onPress={() => setEmailOn((v) => !v)}>
                <View style={[styles.slider, emailOn && styles.sliderOn]} />
              </TouchableOpacity>
            </View>
            <View style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <View style={[styles.itemIcon, styles.iconNotification]}><FontAwesome5 name="comment" size={16} color="#f57c00" /></View>
                <View style={{ flex: 1 }}><Text style={styles.itemTitle}>메시지 알림</Text><Text style={styles.itemDesc}>채팅 메시지 수신 알림</Text></View>
              </View>
              <TouchableOpacity style={[styles.toggle, chatOn && styles.toggleOn]} onPress={() => setChatOn((v) => !v)}>
                <View style={[styles.slider, chatOn && styles.sliderOn]} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.linkRow} activeOpacity={0.85} onPress={() => Alert.alert('알림 설정', '상세 알림 설정 화면은 준비 중입니다.')}> 
              <View style={styles.itemLeft}>
                <View style={[styles.itemIcon, styles.iconNotification]}><FontAwesome5 name="cog" size={16} color="#2563EB" /></View>
                <View style={{ flex: 1 }}><Text style={styles.itemTitle}>상세 알림 설정</Text><Text style={styles.itemDesc}>항목별 세부 알림 조정</Text></View>
              </View>
              <FontAwesome5 name="chevron-right" size={14} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}><FontAwesome5 name="shield-alt" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>개인정보 및 보안</Text></View>
            <TouchableOpacity style={styles.linkRow} activeOpacity={0.85} onPress={cycleVisibility}>
              <View style={styles.itemLeft}>
                <View style={[styles.itemIcon, styles.iconPrivacy]}><FontAwesome5 name="eye" size={16} color="#7b1fa2" /></View>
                <View style={{ flex: 1 }}><Text style={styles.itemTitle}>프로필 공개 설정</Text><Text style={styles.itemDesc}>전문가 검색 노출 여부</Text></View>
              </View>
              <Text style={styles.itemValue}>{profileVisibility}</Text>
              <FontAwesome5 name="chevron-right" size={14} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkRow} activeOpacity={0.85} onPress={() => Alert.alert('계정 보안', '2단계 인증과 로그인 기록 관리 화면은 준비 중입니다.')}> 
              <View style={styles.itemLeft}>
                <View style={[styles.itemIcon, styles.iconPrivacy]}><FontAwesome5 name="fingerprint" size={16} color="#7b1fa2" /></View>
                <View style={{ flex: 1 }}><Text style={styles.itemTitle}>계정 보안</Text><Text style={styles.itemDesc}>2단계 인증, 로그인 기록</Text></View>
              </View>
              <FontAwesome5 name="chevron-right" size={14} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkRow} activeOpacity={0.85} onPress={() => Alert.alert('데이터 관리', '정보 내보내기 및 삭제 요청 화면은 준비 중입니다.')}> 
              <View style={styles.itemLeft}>
                <View style={[styles.itemIcon, styles.iconPrivacy]}><FontAwesome5 name="database" size={16} color="#7b1fa2" /></View>
                <View style={{ flex: 1 }}><Text style={styles.itemTitle}>데이터 관리</Text><Text style={styles.itemDesc}>정보 내보내기, 삭제 요청</Text></View>
              </View>
              <FontAwesome5 name="chevron-right" size={14} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}><FontAwesome5 name="palette" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>표시 설정</Text></View>
            <View style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <View style={[styles.itemIcon, styles.iconDisplay]}><FontAwesome5 name="moon" size={16} color="#c2185b" /></View>
                <View style={{ flex: 1 }}><Text style={styles.itemTitle}>다크 모드</Text><Text style={styles.itemDesc}>화면 테마 설정</Text></View>
              </View>
              <TouchableOpacity style={[styles.toggle, darkMode && styles.toggleOn]} onPress={() => setDarkMode((v) => !v)}>
                <View style={[styles.slider, darkMode && styles.sliderOn]} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.linkRow} activeOpacity={0.85} onPress={() => Alert.alert('언어 설정', '언어 선택 화면은 준비 중입니다.')}> 
              <View style={styles.itemLeft}>
                <View style={[styles.itemIcon, styles.iconDisplay]}><FontAwesome5 name="language" size={16} color="#c2185b" /></View>
                <View style={{ flex: 1 }}><Text style={styles.itemTitle}>언어 설정</Text><Text style={styles.itemDesc}>표시 언어 변경</Text></View>
              </View>
              <Text style={styles.itemValue}>{language}</Text>
              <FontAwesome5 name="chevron-right" size={14} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.85} onPress={() => Alert.alert('로그아웃', '로그아웃하시겠습니까?')}> 
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>

          <View style={styles.versionBox}>
            <Text style={styles.versionText}>앱 버전 1.0.0</Text>
            <Text style={styles.versionText}>이용약관 · 개인정보처리방침</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  header: { height: 60, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#DEE2E6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerAction: { color: '#2563EB', fontSize: 14, fontWeight: '600' },

  profileSection: { backgroundColor: '#FFFFFF', paddingVertical: 24, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#DEE2E6', alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#667EEA', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  profileEmail: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  profileStats: { flexDirection: 'row', columnGap: 20, marginTop: 12 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '700', color: '#2563EB' },
  statLabel: { fontSize: 11, color: '#6B7280' },

  containerPad: { padding: 15 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  sectionHeader: { paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },

  itemRow: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', columnGap: 12, flex: 1 },
  itemIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iconNotification: { backgroundColor: '#FFF3E0' },
  iconPrivacy: { backgroundColor: '#F3E5F5' },
  iconDisplay: { backgroundColor: '#FCE4EC' },
  itemTitle: { fontSize: 13, fontWeight: '600', color: '#111827' },
  itemDesc: { fontSize: 12, color: '#6B7280' },
  itemValue: { fontSize: 12, color: '#6B7280', maxWidth: 120, textAlign: 'right' },
  linkRow: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  toggle: { width: 50, height: 26, backgroundColor: '#D1D5DB', borderRadius: 14, alignItems: 'center', paddingHorizontal: 3, justifyContent: 'center' },
  toggleOn: { backgroundColor: '#10B981' },
  slider: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF', alignSelf: 'flex-start', transform: [{ translateX: 0 }] },
  sliderOn: { alignSelf: 'flex-end', transform: [{ translateX: 0 }] },

  logoutBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoutText: { fontSize: 15, color: '#DC2626', fontWeight: '700' },
  versionBox: { alignItems: 'center', paddingVertical: 12 },
  versionText: { fontSize: 12, color: '#6B7280' }
})

