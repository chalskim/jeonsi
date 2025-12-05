import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, Dimensions, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const screenWidth = Dimensions.get('window').width
  const navigation = useNavigation<any>()
  const route = useRoute<any>()

  const RESOLVE_API_BASE = () => {
    const env = (process.env.EXPO_PUBLIC_API_BASE as string) || ''
    let base = env.trim()
    if (!base) {
      base = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001'
    }
    base = base.replace(/\/+$/, '')
    if (!/\/api\/v\d+$/i.test(base)) base = `${base}/api/v1`
    return base
  }
  const API_BASE = RESOLVE_API_BASE()

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  useEffect(() => {
    const reset = route?.params?.reset
    if (reset) {
      setEmail('')
      setPassword('')
      setShowPassword(false)
    }
  }, [route?.params?.reset])

  const onSubmit = async () => {
    if (!email || !password) {
      showAlert('error', '이메일과 비밀번호를 입력해주세요.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showAlert('error', '유효한 이메일 주소를 입력해주세요.')
      return
    }
    if (password.length < 8) {
      showAlert('error', '비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        let msg = '로그인에 실패했습니다.'
        try {
          const err = await res.json()
          if (typeof err?.message === 'string') msg = err.message
        } catch {}
        showAlert('error', msg)
        return
      }
      const data: { access_token: string; user: { id: string; email: string; name?: string } } = await res.json()
      await AsyncStorage.setItem('access_token', data.access_token)
      await AsyncStorage.setItem('auth_user', JSON.stringify(data.user))
      showAlert('success', '로그인 성공!')
      navigation.navigate('Home')
      if (!rememberMe) {
        setEmail('')
        setPassword('')
        setShowPassword(false)
      }
    } catch (e: any) {
      showAlert('error', '네트워크 오류가 발생했습니다.')
    }
  }

  const socialLogin = (platform: 'google' | 'naver' | 'kakao') => {
    if (platform === 'google') showAlert('success', 'Google 로그인 페이지로 이동합니다.')
    else if (platform === 'naver') showAlert('success', 'Naver 로그인 페이지로 이동합니다.')
    else showAlert('success', 'Kakao 로그인 페이지로 이동합니다.')
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F7F6' }}>
      {alert && (
        <View style={[styles.alert, alert.type === 'success' ? styles.alertSuccess : styles.alertError]}>
          <View style={styles.alertRow}>
            <FontAwesome5 name={alert.type === 'success' ? 'check-circle' : 'exclamation-circle'} size={16} color="#FFFFFF" />
            <Text style={styles.alertText}>{alert.message}</Text>
          </View>
        </View>
      )}
      
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.headerIcon} activeOpacity={0.7} onPress={() => { if (navigation.canGoBack()) navigation.goBack(); else navigation.navigate('Home') }}>
                <FontAwesome5 name="chevron-left" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.logo}>전시(專時)</Text>
              <Text style={styles.subtitle}>필요할 때 딱, 전문가의 시간 한 조각 </Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
        </View>


        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>이메일 주소</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="example@email.com" />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.passwordRow}>
              <TextInput style={[styles.input, { paddingRight: 40 }]} value={password} onChangeText={setPassword} placeholder="비밀번호" secureTextEntry={!showPassword} />
              <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword((v) => !v)}>
                <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rememberRow}>
            <View style={styles.rememberLeft}>
              <Switch value={rememberMe} onValueChange={setRememberMe} trackColor={{ false: '#d1d5db', true: '#93c5fd' }} thumbColor={rememberMe ? '#0066CC' : '#f4f3f4'} />
              <Text style={styles.rememberLabel}>자동 로그인</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.link}>비밀번호를 잊어버렸나요?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={onSubmit}>
            <Text style={styles.primaryBtnText}>로그인</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialLogin}>
            <TouchableOpacity style={[styles.socialBtn, styles.googleBtn]} activeOpacity={0.85} onPress={() => socialLogin('google')}>
              <FontAwesome5 name="google" size={18} color="#ea4335" style={{ marginRight: 10 }} />
              <Text style={[styles.socialText, { color: '#ea4335' }]}>Google로 로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, styles.naverBtn]} activeOpacity={0.85} onPress={() => socialLogin('naver')}>
              <FontAwesome5 name="comment-dots" size={18} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.socialTextLight}>Naver로 로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, styles.kakaoBtn]} activeOpacity={0.85} onPress={() => socialLogin('kakao')}>
              <FontAwesome5 name="comment" size={18} color="#3c1e1e" style={{ marginRight: 10 }} />
              <Text style={[styles.socialText, { color: '#3c1e1e' }]}>Kakao로 로그인</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomLink}>
          <Text style={styles.bottomText}>아직 계정이 없으신가요? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup', { reset: true })}>
            <Text style={styles.bottomAnchor}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { backgroundColor: '#0066CC', paddingVertical: 30, paddingHorizontal: 20, borderRadius: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#FFFFFF', opacity: 0.9 },
  form: { backgroundColor: '#FFFFFF', marginTop: 16, borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#333333', fontWeight: '500', marginBottom: 8 },
  input: { borderWidth: 2, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14 },
  passwordRow: { position: 'relative' },
  passwordToggle: { position: 'absolute', right: 12, top: 12 },
  rememberRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  rememberLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rememberLabel: { fontSize: 14, color: '#333333', marginLeft: 8 },
  link: { color: '#0066CC', fontSize: 14 },
  primaryBtn: { backgroundColor: '#0066CC', paddingVertical: 12, borderRadius: 8 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  dividerText: { paddingHorizontal: 15, color: '#666666', fontSize: 14 },
  socialLogin: { gap: 12, marginBottom: 25 },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8 },
  socialText: { fontWeight: '500' },
  socialTextLight: { fontWeight: '500', color: '#FFFFFF' },
  googleBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDDDDD' },
  naverBtn: { backgroundColor: '#00c73c' },
  kakaoBtn: { backgroundColor: '#fee500' },
  bottomLink: { paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#EEEEEE', flexDirection: 'row', justifyContent: 'center' },
  bottomText: { color: '#666666', fontSize: 14 },
  bottomAnchor: { color: '#0066CC', fontSize: 14, fontWeight: '500' },
  alert: { position: 'absolute', top: 20, right: 20, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, zIndex: 1000, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  alertSuccess: { backgroundColor: '#2EBD59' },
  alertError: { backgroundColor: '#E74C3C' },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  alertText: { color: '#FFFFFF', fontWeight: '500' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' },
  sideMenu: { position: 'absolute', top: 0, bottom: 0, left: -280, width: 280, backgroundColor: '#FFFFFF', borderRightWidth: 1, borderRightColor: '#E5E7EB', zIndex: 1000, paddingTop: 60 },
  sideMenuActive: { left: 0 },
  sideHeader: { height: 60, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#FFFFFF' },
  sideTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  sideItemsScroll: { flex: 1 },
  sideItems: { paddingHorizontal: 16, paddingTop: 12 },
  sideCategory: { marginBottom: 8 },
  sideCategoryTitle: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  sideCategoryTitleText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  sideItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  sideItemText: { fontSize: 14, color: '#374151', fontWeight: '600' }
})
