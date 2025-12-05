import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import common from '../../data/common.json'

type ContactPerson = { id: number; title: string; name: string; email: string; phone: string }

export default function RegistrationCompany() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [companyName, setCompanyName] = useState('')
  const [bizRegNo, setBizRegNo] = useState('')
  const [ceoName, setCeoName] = useState('')
  const [establishDate, setEstablishDate] = useState('')
  const [employees, setEmployees] = useState('')
  const [employeesOpen, setEmployeesOpen] = useState(false)
  const employeesOptions = useMemo(() => ['1-10', '11-30', '31-50', '51-100', '101-300', '301+'], [])

  const [postcode, setPostcode] = useState('')
  const [address, setAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')

  const [companyIntro, setCompanyIntro] = useState('')
  const [serviceInfo, setServiceInfo] = useState('')
  const [website, setWebsite] = useState('')
  const [linkedin, setLinkedin] = useState('')

  const [majorCode, setMajorCode] = useState('')
  const [minorCode, setMinorCode] = useState('')
  const [majorOpen, setMajorOpen] = useState(false)
  const [minorOpen, setMinorOpen] = useState(false)
  const majorOptions = useMemo(() => [{ code: '', name: '대분류를 선택하세요' }, ...common.majorCategories.map((c: any) => ({ code: c.code, name: c.name }))], [])
  const minorOptions = useMemo(() => {
    const list = !majorCode ? [] : common.middleCategories.filter((m: any) => m.majorCode === majorCode)
    return [{ code: '', name: !majorCode ? '먼저 대분류를 선택하세요' : '중분류를 선택하세요' }, ...list.map((m: any) => ({ code: m.code, name: m.name }))]
  }, [majorCode])

  const [contacts, setContacts] = useState<ContactPerson[]>([{ id: 1, title: '', name: '', email: '', phone: '' }])
  const addContact = () => setContacts((prev) => [...prev, { id: prev.length + 1, title: '', name: '', email: '', phone: '' }])
  const removeContact = (id: number) => setContacts((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev))
  const updateContact = (id: number, field: keyof ContactPerson, value: string) => setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))

  const [logoFiles, setLogoFiles] = useState<string[]>([])
  const [promoFiles, setPromoFiles] = useState<string[]>([])
  const addLogoFile = () => setLogoFiles(['회사로고.png'])
  const removeLogoFile = () => setLogoFiles([])
  const addPromoFile = () => setPromoFiles((prev) => [...prev, `홍보자료-${prev.length + 1}.pdf`])
  const removePromoFile = (idx: number) => setPromoFiles((prev) => prev.filter((_, i) => i !== idx))

  const [alertMsg, setAlertMsg] = useState<string | null>(null)
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertMsg(message)
    setTimeout(() => setAlertMsg(null), 3000)
    if (type === 'success') Alert.alert('성공', message)
    else Alert.alert('오류', message)
  }

  const searchPostcode = () => {
    Alert.alert('안내', '우편번호 검색 기능은 실제 서비스에서 Daum API 연동이 필요합니다.')
    setPostcode('06000')
    setAddress('서울특별시 강남구 테헤란로 123')
  }

  const validateRequired = () => {
    if (!companyName || !bizRegNo || !ceoName || !establishDate || !employees || !address) return false
    if (!majorCode || !minorCode) return false
    const hasContact = contacts.some((c) => c.name && c.email && c.phone)
    return hasContact
  }

  const onSubmit = () => {
    if (!validateRequired()) {
      showAlert('error', '필수 항목을 모두 입력해주세요.')
      return
    }
    showAlert('success', '기업 정보가 성공적으로 등록되었습니다!')
    navigation.navigate('MyPageCorporate')
  }

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
        <Text style={styles.headerTitle}>기업 정보 등록</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {alertMsg ? (
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>{alertMsg}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="building" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>기본 정보</Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>회사명 *</Text>
              <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} placeholder="사업자등록증 상의 정확한 상호" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>사업자등록번호 *</Text>
              <TextInput style={styles.input} value={bizRegNo} onChangeText={setBizRegNo} placeholder="000-00-00000" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>대표자명 *</Text>
              <TextInput style={styles.input} value={ceoName} onChangeText={setCeoName} placeholder="대표자명" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>설립일 *</Text>
              <TextInput style={styles.input} value={establishDate} onChangeText={setEstablishDate} placeholder="YYYY-MM-DD" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>직원 수 *</Text>
              <TouchableOpacity style={styles.selectBox} onPress={() => setEmployeesOpen((v) => !v)}>
                <Text style={styles.selectValue}>{employees || '선택해주세요'}</Text>
                <FontAwesome5 name={employeesOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
              </TouchableOpacity>
              {employeesOpen && (
                <View style={styles.dropdown}>
                  <ScrollView style={styles.dropdownScroll}>
                    {employeesOptions.map((opt) => (
                      <TouchableOpacity key={opt} style={[styles.dropdownItem, employees === opt && styles.dropdownItemActive]} activeOpacity={0.8} onPress={() => { setEmployees(opt); setEmployeesOpen(false) }}>
                        <Text style={[styles.dropdownItemText, employees === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>주소 *</Text>
              <View style={styles.inlineRow}>
                <TextInput style={[styles.input, { flex: 1 }]} value={postcode} onChangeText={setPostcode} placeholder="우편번호" />
                <TouchableOpacity style={styles.btnSecondary} onPress={searchPostcode}>
                  <FontAwesome5 name="search" size={14} color="#333" />
                  <Text style={styles.btnSecondaryText}>주소 찾기</Text>
                </TouchableOpacity>
              </View>
              <TextInput style={[styles.input, styles.mt8]} value={address} onChangeText={setAddress} placeholder="기본 주소" />
              <TextInput style={[styles.input, styles.mt8]} value={detailAddress} onChangeText={setDetailAddress} placeholder="상세 주소" />
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="bullhorn" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>회사 소개</Text>
          </View>
          <View style={styles.grid}>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>회사 소개</Text>
              <TextInput style={[styles.input, styles.textarea]} value={companyIntro} onChangeText={setCompanyIntro} placeholder="회사의 비전, 사업 모델, 주요 서비스 등" multiline />
            </View>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>서비스/제품 소개</Text>
              <TextInput style={[styles.input, styles.textarea]} value={serviceInfo} onChangeText={setServiceInfo} placeholder="제공하는 주요 서비스나 제품" multiline />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>홈페이지</Text>
              <TextInput style={styles.input} value={website} onChangeText={setWebsite} placeholder="https://example.com" autoCapitalize="none" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>링크드인</Text>
              <TextInput style={styles.input} value={linkedin} onChangeText={setLinkedin} placeholder="https://linkedin.com/company/example" autoCapitalize="none" />
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="users" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>담당자 정보</Text>
          </View>
          {contacts.map((c) => (
            <View key={c.id} style={styles.dynamicSection}>
              <View style={styles.dynamicHeader}>
                <Text style={styles.dynamicTitle}>담당자 {c.id}</Text>
                <TouchableOpacity style={styles.btnRemove} onPress={() => removeContact(c.id)}>
                  <FontAwesome5 name="times" size={12} color="#FFFFFF" />
                  <Text style={styles.btnRemoveText}>삭제</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.grid}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>직책</Text>
                  <TextInput style={styles.input} value={c.title} onChangeText={(v) => updateContact(c.id, 'title', v)} placeholder="예: 마케팅팀장" />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>이름 *</Text>
                  <TextInput style={styles.input} value={c.name} onChangeText={(v) => updateContact(c.id, 'name', v)} placeholder="담당자 성함" />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>이메일 *</Text>
                  <TextInput style={styles.input} value={c.email} onChangeText={(v) => updateContact(c.id, 'email', v)} placeholder="담당자 이메일" autoCapitalize="none" />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>연락처 *</Text>
                  <TextInput style={styles.input} value={c.phone} onChangeText={(v) => updateContact(c.id, 'phone', v)} placeholder="담당자 연락처" />
                </View>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.btnAdd} onPress={addContact}>
            <FontAwesome5 name="plus-circle" size={14} color="#FFFFFF" />
            <Text style={styles.btnAddText}>담당자 추가</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="list-ul" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>산업분야</Text>
          </View>
          <View style={styles.grid}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>대분류 *</Text>
              <TouchableOpacity style={styles.selectBox} onPress={() => setMajorOpen((v) => !v)}>
                <Text style={styles.selectValue}>{(majorOptions.find((o) => o.code === majorCode)?.name) || '대분류를 선택하세요'}</Text>
                <FontAwesome5 name={majorOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
              </TouchableOpacity>
              {majorOpen && (
                <View style={styles.dropdown}>
                  <ScrollView style={styles.dropdownScroll}>
                    {majorOptions.map((opt) => (
                      <TouchableOpacity key={opt.code || 'none'} style={[styles.dropdownItem, majorCode === opt.code && styles.dropdownItemActive]} activeOpacity={0.8} onPress={() => { setMajorCode(opt.code); setMinorCode(''); setMajorOpen(false) }}>
                        <Text style={[styles.dropdownItemText, majorCode === opt.code && styles.dropdownItemTextActive]}>{opt.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>중분류 *</Text>
              <TouchableOpacity style={styles.selectBox} disabled={!majorCode} onPress={() => setMinorOpen((v) => !v)}>
                <Text style={styles.selectValue}>{(minorOptions.find((o) => o.code === minorCode)?.name) || (!majorCode ? '먼저 대분류를 선택하세요' : '중분류를 선택하세요')}</Text>
                <FontAwesome5 name={minorOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
              </TouchableOpacity>
              {minorOpen && (
                <View style={styles.dropdown}>
                  <ScrollView style={styles.dropdownScroll}>
                    {minorOptions.map((opt) => (
                      <TouchableOpacity key={opt.code || 'none'} style={[styles.dropdownItem, minorCode === opt.code && styles.dropdownItemActive]} activeOpacity={0.8} onPress={() => { setMinorCode(opt.code); setMinorOpen(false) }}>
                        <Text style={[styles.dropdownItemText, minorCode === opt.code && styles.dropdownItemTextActive]}>{opt.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.helpText}>귀사의 주요 사업 분야를 정확하게 선택해주세요.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="images" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>대표 이미지/홍보 자료</Text>
          </View>
          <View style={styles.grid}>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>회사 로고 *</Text>
              <View style={styles.uploadRow}>
                <TouchableOpacity style={styles.btnPrimary} onPress={addLogoFile}>
                  <FontAwesome5 name="file-upload" size={14} color="#FFFFFF" />
                  <Text style={styles.btnPrimaryText}>파일 선택</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.fileHelp}>권장 사이즈: 200x200px, jpg, png 파일</Text>
              <View style={styles.fileList}>
                {logoFiles.map((f, idx) => (
                  <View key={`${f}-${idx}`} style={styles.fileItem}>
                    <View style={styles.fileInfo}>
                      <FontAwesome5 name="file-image" size={14} color="#0066CC" />
                      <Text style={styles.fileName}>{f}</Text>
                    </View>
                    <TouchableOpacity onPress={removeLogoFile}>
                      <FontAwesome5 name="times" size={14} color="#E74C3C" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>회사 홍보 자료</Text>
              <View style={styles.uploadRow}>
                <TouchableOpacity style={styles.btnPrimary} onPress={addPromoFile}>
                  <FontAwesome5 name="file-upload" size={14} color="#FFFFFF" />
                  <Text style={styles.btnPrimaryText}>파일 선택</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.fileHelp}>회사 소개서, 브로슈어 등을 등록해주세요. (여러 파일 선택 가능)</Text>
              <View style={styles.fileList}>
                {promoFiles.map((f, idx) => (
                  <View key={`${f}-${idx}`} style={styles.fileItem}>
                    <View style={styles.fileInfo}>
                      <FontAwesome5 name={f.endsWith('.pdf') ? 'file-pdf' : f.endsWith('.pptx') ? 'file-powerpoint' : 'file'} size={14} color={f.endsWith('.pdf') ? '#E74C3C' : '#0066CC'} />
                      <Text style={styles.fileName}>{f}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removePromoFile(idx)}>
                      <FontAwesome5 name="times" size={14} color="#E74C3C" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnOutline} onPress={() => {
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
            <FontAwesome5 name="arrow-left" size={14} color="#333333" />
            <Text style={styles.btnOutlineText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimary} onPress={onSubmit}>
            <FontAwesome5 name="save" size={14} color="#FFFFFF" />
            <Text style={styles.btnPrimaryText}>저장하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { paddingBottom: 24 },
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  alertBox: { margin: 16, padding: 12, backgroundColor: '#EEF2FF', borderRadius: 8 },
  alertText: { color: '#1E3A8A', fontSize: 14 },

  form: { backgroundColor: '#FFFFFF', marginTop: 16, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 12 },
  formGroup: { width: '48%' },
  fullWidth: { width: '100%' },
  label: { fontSize: 13, color: '#333333', fontWeight: '500', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, backgroundColor: '#FFFFFF' },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  mt8: { marginTop: 8 },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  selectBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  selectValue: { fontSize: 13, color: '#374151' },
  dropdown: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, marginTop: 8, maxHeight: 200, backgroundColor: '#FFFFFF' },
  dropdownScroll: { maxHeight: 200 },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12 },
  dropdownItemActive: { backgroundColor: '#F3F4F6' },
  dropdownItemText: { fontSize: 13, color: '#374151' },
  dropdownItemTextActive: { fontWeight: '700', color: '#111827' },

  dynamicSection: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, backgroundColor: '#FAFAFA', marginBottom: 12 },
  dynamicHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  dynamicTitle: { fontWeight: '600', color: '#0066CC', fontSize: 14 },
  btnRemove: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E74C3C', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  btnRemoveText: { color: '#FFFFFF', fontSize: 12 },
  btnAdd: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#0066CC', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  btnAddText: { color: '#FFFFFF', fontSize: 13, fontWeight: '500' },

  helpText: { fontSize: 12, color: '#6B7280', marginTop: 8 },

  uploadRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fileHelp: { fontSize: 12, color: '#6B7280', marginTop: 6 },
  fileList: { marginTop: 8 },
  fileItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, paddingHorizontal: 8, backgroundColor: '#F5F5F5', borderRadius: 6, marginBottom: 6 },
  fileInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fileName: { fontSize: 12, color: '#333333' },

  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginVertical: 20 },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#0066CC', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#EEEEEE', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 14, fontWeight: '500' },
  btnSecondary: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F3F4F6', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  btnSecondaryText: { color: '#333333', fontSize: 13, fontWeight: '500' }
})
