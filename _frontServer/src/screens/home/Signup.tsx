import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function SignupScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [companyType, setCompanyType] = useState<'personal' | 'business'>('personal')
  const [usagePurpose, setUsagePurpose] = useState<'personal' | 'business' | 'education'>('personal')
  const [phone, setPhone] = useState('')
  const [terms, setTerms] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const navigation = useNavigation<any>()
  const route = useRoute<any>()

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setPasswordConfirm('')
    setPhone('')
    setMarketing(false)
    setTerms(false)
    setCompanyType('personal')
    setUsagePurpose('personal')
    setShowPassword(false)
    setShowPasswordConfirm(false)
  }

  React.useEffect(() => {
    const reset = route?.params?.reset
    if (reset) {
      resetForm()
    }
  }, [route?.params?.reset])

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

  const onSubmit = async () => {
    if (!name || !email || !password || !passwordConfirm) {
      showAlert('error', '필수 정보를 모두 입력해주세요.')
      return
    }
    if (!terms) {
      showAlert('error', '이용약관과 개인정보처리방침에 동의해주세요.')
      return
    }
    if (password.length < 8) {
      showAlert('error', '비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }
    if (password !== passwordConfirm) {
      showAlert('error', '비밀번호가 일치하지 않습니다.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showAlert('error', '유효한 이메일 주소를 입력해주세요.')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone }),
      })
      if (!res.ok) {
        let msg = '회원가입에 실패했습니다.'
        try {
          const err = await res.json()
          if ((res.status === 401 || res.status === 409) && typeof err?.message === 'string' && err.message.includes('User already exists')) {
            msg = '이미 가입된 이메일입니다.'
          } else if (typeof err?.message === 'string') {
            msg = err.message
          } else {
            msg = `서버 오류가 발생했습니다. (코드 ${res.status})`
          }
        } catch {
          msg = `서버 오류가 발생했습니다. (코드 ${res.status})`
        }
        showAlert('error', msg)
        return
      }
      const data: { access_token: string; user: { id: string; email: string; name?: string } } = await res.json()
      await AsyncStorage.setItem('access_token', data.access_token)
      await AsyncStorage.setItem('auth_user', JSON.stringify(data.user))
      showAlert('success', '회원가입이 완료되었습니다!')
      resetForm()
      navigation.navigate('Login', { reset: true })
    } catch (e) {
      showAlert('error', '네트워크 오류가 발생했습니다.')
    }
  }

  const socialSignup = (platform: 'google' | 'naver' | 'kakao') => {
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
          <Text style={styles.logo}>전시(專時)</Text>
          <Text style={styles.subtitle}>필요할 때 딱, 전문가의 시간 한 조각 </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>이름</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="홍길동" />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>이메일</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="example@email.com" />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { paddingRight: 40 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호"
                secureTextEntry={!showPassword}
                autoCorrect={false}
                autoCapitalize="none"
                textContentType="none"
              />
              <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword((v) => !v)}>
                <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { paddingRight: 40 }]}
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                placeholder="비밀번호 확인"
                secureTextEntry={!showPasswordConfirm}
                autoCorrect={false}
                autoCapitalize="none"
                textContentType="none"
              />
              <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPasswordConfirm((v) => !v)}>
                <FontAwesome5 name={showPasswordConfirm ? 'eye-slash' : 'eye'} size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>회원 유형</Text>
            <View style={styles.segmentRow}>
              {[
                { key: 'personal', label: '개인 회원' },
                { key: 'business', label: '기업 회원' }
              ].map((opt) => {
                const active = companyType === (opt.key as any)
                return (
                  <TouchableOpacity key={opt.key} style={[styles.segmentChip, active && styles.segmentChipActive]} onPress={() => setCompanyType(opt.key as any)}>
                    <Text style={[styles.segmentChipText, active && styles.segmentChipTextActive]}>{opt.label}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>용도</Text>
            <View style={styles.segmentRow}>
              {[
                { key: 'personal', label: '개인' },
                { key: 'business', label: '기업' },
                { key: 'education', label: '교육' }
              ].map((opt) => {
                const active = usagePurpose === (opt.key as any)
                return (
                  <TouchableOpacity key={opt.key} style={[styles.segmentChip, active && styles.segmentChipActive]} onPress={() => setUsagePurpose(opt.key as any)}>
                    <Text style={[styles.segmentChipText, active && styles.segmentChipTextActive]}>{opt.label}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>연락처</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="010-1234-5678" />
          </View>

          <View style={styles.checkboxRow}>
            <TouchableOpacity style={styles.checkbox} onPress={() => setTerms((v) => !v)}>
              <View style={[styles.checkboxBox, terms && styles.checkboxBoxActive]}>
                {terms ? <FontAwesome5 name="check" size={12} color="#FFFFFF" /> : null}
              </View>
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}><Text style={styles.link}>이용약관</Text>과 <Text style={styles.link}>개인정보처리방침</Text>에 동의합니다</Text>
          </View>

          <View style={styles.checkboxRow}>
            <TouchableOpacity style={styles.checkbox} onPress={() => setMarketing((v) => !v)}>
              <View style={[styles.checkboxBox, marketing && styles.checkboxBoxActive]}>
                {marketing ? <FontAwesome5 name="check" size={12} color="#FFFFFF" /> : null}
              </View>
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>마케팅 정보 수신에 동의합니다 (선택사항)</Text>
          </View>

          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={onSubmit}>
            <Text style={styles.primaryBtnText}>회원가입하기</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는 소셜 계정으로 가입</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialSignup}>
            <TouchableOpacity style={styles.socialCircle} activeOpacity={0.85} onPress={() => socialSignup('google')}>
              <FontAwesome5 name="google" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialCircle, { backgroundColor: '#00c73c' }]} activeOpacity={0.85} onPress={() => socialSignup('naver')}>
              <FontAwesome5 name="comment-dots" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialCircle, { backgroundColor: '#fee500' }]} activeOpacity={0.85} onPress={() => socialSignup('kakao')}>
              <FontAwesome5 name="comment" size={18} color="#3c1e1e" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomLink}>
          <Text style={styles.bottomText}>이미 계정이 있으신가요? </Text>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.bottomAnchor}>로그인</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { backgroundColor: '#0066CC', paddingVertical: 30, paddingHorizontal: 20, borderRadius: 12 },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#FFFFFF', opacity: 0.9 },
  form: { backgroundColor: '#FFFFFF', marginTop: 16, borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#333333', fontWeight: '500', marginBottom: 8 },
  input: { borderWidth: 2, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14 },
  passwordRow: { position: 'relative' },
  passwordToggle: { position: 'absolute', right: 12, top: 12 },
  segmentRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  segmentChip: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 9999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#FFFFFF' },
  segmentChipActive: { backgroundColor: '#0066CC', borderColor: '#0066CC' },
  segmentChipText: { color: '#111827', fontSize: 14 },
  segmentChipTextActive: { color: '#FFFFFF', fontSize: 14 },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 15 },
  checkbox: { paddingTop: 2 },
  checkboxBox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  checkboxBoxActive: { backgroundColor: '#0066CC', borderColor: '#0066CC' },
  checkboxLabel: { fontSize: 14, color: '#666666', lineHeight: 20, flex: 1 },
  link: { color: '#0066CC' },
  primaryBtn: { backgroundColor: '#0066CC', paddingVertical: 12, borderRadius: 8, marginTop: 10 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  dividerText: { paddingHorizontal: 15, color: '#666666', fontSize: 14 },
  socialSignup: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginBottom: 25 },
  socialCircle: { width: 45, height: 45, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ea4335', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  bottomLink: { paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#EEEEEE', flexDirection: 'row', justifyContent: 'center' },
  bottomText: { color: '#666666', fontSize: 14 },
  bottomAnchor: { color: '#0066CC', fontSize: 14, fontWeight: '500' },
  alert: { position: 'absolute', top: 20, right: 20, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, zIndex: 1000, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  alertSuccess: { backgroundColor: '#2EBD59' },
  alertError: { backgroundColor: '#E74C3C' },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  alertText: { color: '#FFFFFF', fontWeight: '500' }
})
