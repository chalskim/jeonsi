import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import common from '../../data/common.json'

type RoleBlock = {
  id: number
  title: string
  count: string
  majorCode: string
  minorCode: string
  majorOpen: boolean
  minorOpen: boolean
  skills: string[]
  newSkill: string
  desc: string
  workData: string
}

export default function ShortTermRequestsInput() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [title, setTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [urgent, setUrgent] = useState(false)

  const [format, setFormat] = useState<'weekly' | 'monthly' | 'session' | ''>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')

  const [applicationStartDate, setApplicationStartDate] = useState('')
  const [applicationEndDate, setApplicationEndDate] = useState('')

  const [workTypes, setWorkTypes] = useState<string[]>([])
  const [preferredDays, setPreferredDays] = useState<string[]>([])
  const [communication, setCommunication] = useState<string[]>([])

  const majorOptions = useMemo(() => [{ code: '', name: '대분류 선택' }, ...common.majorCategories.map((c: any) => ({ code: c.code, name: c.name }))], [])
  const getMinorOptions = (majorCode: string) => [{ code: '', name: '중분류 선택' }, ...common.middleCategories.filter((m: any) => m.majorCode === majorCode).map((m: any) => ({ code: m.code, name: m.name }))]

  const [roles, setRoles] = useState<RoleBlock[]>([
    { id: 1, title: '', count: '1', majorCode: '', minorCode: '', majorOpen: false, minorOpen: false, skills: [], newSkill: '', desc: '', workData: '' },
  ])

  const addRole = () => setRoles((prev) => [...prev, { id: prev.length + 1, title: '', count: '1', majorCode: '', minorCode: '', majorOpen: false, minorOpen: false, skills: [], newSkill: '', desc: '', workData: '' }])
  const removeRole = (id: number) => setRoles((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev))
  const updateRole = <K extends keyof RoleBlock>(id: number, key: K, value: RoleBlock[K]) => setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)))
  const addSkillToRole = (id: number, skill: string) => setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, skills: r.skills.includes(skill) ? r.skills : [...r.skills, skill], newSkill: '' } : r)))
  const removeSkillFromRole = (id: number, skill: string) => setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, skills: r.skills.filter((s) => s !== skill) } : r)))

  const toggleMulti = (list: string[], value: string) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const validate = () => {
    if (!title || !projectDescription) return false
    if (!format || !startDate || !endDate) return false
    if (!budgetMin || !budgetMax) return false
    if (!applicationStartDate || !applicationEndDate) return false
    for (const r of roles) {
      if (!r.title || !(Number(r.count) > 0) || !r.majorCode || !r.minorCode || !r.workData) return false
    }
    return true
  }

  const submitUrgentFlow = async (amount: number) => {
    Alert.alert(
      '긴급 의뢰',
      '지금 결제하시겠습니까?',
      [
        {
          text: '장바구니',
          style: 'default',
          onPress: async () => {
            try {
              const existing = JSON.parse((await AsyncStorage.getItem('cartItems')) || '[]')
              existing.push({ type: 'team-project', urgent: true, name: title, price: amount, qty: 1 })
              await AsyncStorage.setItem('cartItems', JSON.stringify(existing))
              Alert.alert('장바구니', '장바구니에 추가했습니다.')
            } catch {
              Alert.alert('오류', '장바구니 저장 중 오류가 발생했습니다.')
            }
          },
        },
        {
          text: '결제',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('pendingPaymentItem', JSON.stringify({ type: 'team-project', urgent: true, title, amount }))
            } catch {}
            Alert.alert('결제', '결제 페이지로 이동합니다.')
            navigation.navigate('Home')
          },
        },
      ]
    )
  }

  const onSubmit = async () => {
    if (!validate()) {
      Alert.alert('오류', '필수 항목을 모두 입력해주세요.')
      return
    }
    const amount = Number(budgetMax) || Number(budgetMin) || 0
    if (urgent) {
      await submitUrgentFlow(amount)
      return
    }
    Alert.alert('성공', '팀 프로젝트 의뢰가 성공적으로 등록되었습니다!')
    navigation.navigate('ShortTermRequestsList', { prev: 'ShortTermRequestsInput' } as never)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => {
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
        }}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>팀 프로젝트 의뢰 등록</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="info-circle" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>프로젝트 기본 정보</Text>
          </View>
          <View style={styles.grid}>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>프로젝트 제목 *</Text>
              <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="예: 신규 앱 런칭 프로젝트" />
            </View>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>프로젝트 소개 *</Text>
              <TextInput style={[styles.input, styles.textarea]} value={projectDescription} onChangeText={setProjectDescription} placeholder="프로젝트의 목표, 배경, 기대효과 등을 설명해주세요." multiline />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>긴급 의뢰</Text>
              <TouchableOpacity style={[styles.checkboxChip, urgent && styles.checkboxChipActive]} onPress={() => setUrgent((v) => !v)}>
                <FontAwesome5 name={urgent ? 'check-square' : 'square'} size={14} color={urgent ? '#2563EB' : '#6B7280'} />
                <Text style={[styles.checkboxText, urgent && styles.checkboxTextActive]}>긴급으로 등록</Text>
              </TouchableOpacity>
              <Text style={styles.helpText}>긴급 선택 시 결제 또는 장바구니 분기</Text>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="users" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>모집 역할 (Team Composition)</Text>
          </View>
          {roles.map((r) => (
            <View key={r.id} style={styles.dynamicSection}>
              <View style={styles.dynamicHeader}>
                <Text style={styles.dynamicTitle}>역할 {r.id}</Text>
                <TouchableOpacity style={styles.btnRemove} onPress={() => removeRole(r.id)}>
                  <FontAwesome5 name="times" size={12} color="#FFFFFF" />
                  <Text style={styles.btnRemoveText}>삭제</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.grid}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>역할명 *</Text>
                  <TextInput style={styles.input} value={r.title} onChangeText={(v) => updateRole(r.id, 'title', v)} placeholder="예: UI/UX 디자이너" />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>모집 인원 *</Text>
                  <TextInput style={styles.input} value={r.count} onChangeText={(v) => updateRole(r.id, 'count', v)} keyboardType="number-pad" placeholder="1" />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>대분류 *</Text>
                  <TouchableOpacity style={styles.selectBox} onPress={() => updateRole(r.id, 'majorOpen', !r.majorOpen)}>
                    <Text style={styles.selectValue}>{(majorOptions.find((o) => o.code === r.majorCode)?.name) || '대분류 선택'}</Text>
                    <FontAwesome5 name={r.majorOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
                  </TouchableOpacity>
                  {r.majorOpen && (
                    <View style={styles.dropdown}>
                      <ScrollView style={styles.dropdownScroll}>
                        {majorOptions.map((opt) => (
                          <TouchableOpacity key={opt.code || 'none'} style={[styles.dropdownItem, r.majorCode === opt.code && styles.dropdownItemActive]} activeOpacity={0.8} onPress={() => { updateRole(r.id, 'majorCode', opt.code); updateRole(r.id, 'minorCode', ''); updateRole(r.id, 'majorOpen', false) }}>
                            <Text style={[styles.dropdownItemText, r.majorCode === opt.code && styles.dropdownItemTextActive]}>{opt.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>중분류 *</Text>
                  <TouchableOpacity style={styles.selectBox} disabled={!r.majorCode} onPress={() => updateRole(r.id, 'minorOpen', !r.minorOpen)}>
                    <Text style={styles.selectValue}>{(getMinorOptions(r.majorCode).find((o) => o.code === r.minorCode)?.name) || '중분류 선택'}</Text>
                    <FontAwesome5 name={r.minorOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
                  </TouchableOpacity>
                  {r.minorOpen && (
                    <View style={styles.dropdown}>
                      <ScrollView style={styles.dropdownScroll}>
                        {getMinorOptions(r.majorCode).map((opt) => (
                          <TouchableOpacity key={opt.code || 'none'} style={[styles.dropdownItem, r.minorCode === opt.code && styles.dropdownItemActive]} activeOpacity={0.8} onPress={() => { updateRole(r.id, 'minorCode', opt.code); updateRole(r.id, 'minorOpen', false) }}>
                            <Text style={[styles.dropdownItemText, r.minorCode === opt.code && styles.dropdownItemTextActive]}>{opt.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
                <View style={[styles.formGroup, styles.fullWidth]}>
                  <Text style={styles.label}>필요 역량/경험</Text>
                  <View style={styles.inlineRow}>
                    <TextInput style={[styles.input, { flex: 1 }]} value={r.newSkill} onChangeText={(v) => updateRole(r.id, 'newSkill', v)} placeholder="역량을 검색하여 선택해주세요" />
                    <TouchableOpacity style={styles.btnSecondary} onPress={() => r.newSkill.trim() && addSkillToRole(r.id, r.newSkill.trim())}>
                      <FontAwesome5 name="plus" size={14} color="#333" />
                      <Text style={styles.btnSecondaryText}>추가</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.chipsRow}>
                    {r.skills.map((s) => (
                      <View key={s} style={styles.chip}>
                        <Text style={styles.chipText}>{s}</Text>
                        <TouchableOpacity onPress={() => removeSkillFromRole(r.id, s)}>
                          <FontAwesome5 name="times-circle" size={14} color="#E74C3C" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={[styles.formGroup, styles.fullWidth]}>
                  <Text style={styles.label}>상세 업무 내용</Text>
                  <TextInput style={[styles.input, styles.textarea]} value={r.desc} onChangeText={(v) => updateRole(r.id, 'desc', v)} placeholder="이 역할이 담당할 구체적인 업무를 설명해주세요." multiline />
                </View>
                <View style={[styles.formGroup, styles.fullWidth]}>
                  <Text style={styles.label}>담당 업무 데이터 *</Text>
                  <TextInput style={[styles.input, styles.textarea]} value={r.workData} onChangeText={(v) => updateRole(r.id, 'workData', v)} placeholder="구체적인 태스크, 기능, 산출물을 상세히 기입해주세요." multiline />
                  <Text style={styles.helpText}>해당 역할이 수행해야 할 태스크, 기능, 산출물을 상세히 기입해주세요.</Text>
                </View>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.btnAdd} onPress={addRole}>
            <FontAwesome5 name="plus-circle" size={14} color="#FFFFFF" />
            <Text style={styles.btnAddText}>모집 역할 추가하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="handshake" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>프로젝트 협업 조건</Text>
          </View>
          <View style={styles.grid}>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>희망 형태 *</Text>
              <View style={styles.segmentRow}>
                {[
                  { key: 'weekly', label: '주 단위' },
                  { key: 'monthly', label: '월 단위' },
                  { key: 'session', label: '회차 단위' },
                ].map((opt) => {
                  const active = format === (opt.key as any)
                  return (
                    <TouchableOpacity key={opt.key} style={[styles.segmentChip, active && styles.segmentChipActive]} onPress={() => setFormat(opt.key as any)}>
                      <Text style={[styles.segmentChipText, active && styles.segmentChipTextActive]}>{opt.label}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>희망 기간 *</Text>
              <View style={styles.inlineRow}>
                <TextInput style={[styles.input, { flex: 1 }]} value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" />
                <Text style={styles.separator}>~</Text>
                <TextInput style={[styles.input, { flex: 1 }]} value={endDate} onChangeText={setEndDate} placeholder="YYYY-MM-DD" />
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>총 예산 범위 *</Text>
              <View style={styles.inlineRow}>
                <TextInput style={[styles.input, { flex: 1 }]} value={budgetMin} onChangeText={setBudgetMin} placeholder="최소 금액" keyboardType="number-pad" />
                <Text style={styles.separator}>~</Text>
                <TextInput style={[styles.input, { flex: 1 }]} value={budgetMax} onChangeText={setBudgetMax} placeholder="최대 금액" keyboardType="number-pad" />
                <Text style={styles.suffix}>원</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="calendar-check" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>모집 기간</Text>
          </View>
          <View style={styles.grid}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>접수 시작일 *</Text>
              <TextInput style={styles.input} value={applicationStartDate} onChangeText={setApplicationStartDate} placeholder="YYYY-MM-DD" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>접수 종료일 *</Text>
              <TextInput style={styles.input} value={applicationEndDate} onChangeText={setApplicationEndDate} placeholder="YYYY-MM-DD" />
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="sliders-h" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>선호 조건 (선택)</Text>
          </View>
          <View style={styles.grid}>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>근무 형태</Text>
              <View style={styles.checkboxRow}>
                {[
                  { key: 'remote', label: '원격' },
                  { key: 'offline', label: '오프라인' },
                  { key: 'hybrid', label: '혼합' },
                ].map((opt) => {
                  const active = workTypes.includes(opt.key)
                  return (
                    <TouchableOpacity key={opt.key} style={[styles.checkboxChip, active && styles.checkboxChipActive]} onPress={() => setWorkTypes((prev) => toggleMulti(prev, opt.key))}>
                      <FontAwesome5 name={active ? 'check-square' : 'square'} size={14} color={active ? '#2563EB' : '#6B7280'} />
                      <Text style={[styles.checkboxText, active && styles.checkboxTextActive]}>{opt.label}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>선호 요일</Text>
              <View style={styles.checkboxRow}>
                {['월','화','수','목','금','토','일'].map((d) => {
                  const active = preferredDays.includes(d)
                  return (
                    <TouchableOpacity key={d} style={[styles.checkboxChip, active && styles.checkboxChipActive]} onPress={() => setPreferredDays((prev) => toggleMulti(prev, d))}>
                      <FontAwesome5 name={active ? 'check-square' : 'square'} size={14} color={active ? '#2563EB' : '#6B7280'} />
                      <Text style={[styles.checkboxText, active && styles.checkboxTextActive]}>{d}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>커뮤니케이션 방식</Text>
              <View style={styles.checkboxRow}>
                {[
                  { key: 'slack', label: 'Slack' },
                  { key: 'zoom', label: 'Zoom/화상회의' },
                  { key: 'email', label: '이메일' },
                  { key: 'phone', label: '전화' },
                ].map((opt) => {
                  const active = communication.includes(opt.key)
                  return (
                    <TouchableOpacity key={opt.key} style={[styles.checkboxChip, active && styles.checkboxChipActive]} onPress={() => setCommunication((prev) => toggleMulti(prev, opt.key))}>
                      <FontAwesome5 name={active ? 'check-square' : 'square'} size={14} color={active ? '#2563EB' : '#6B7280'} />
                      <Text style={[styles.checkboxText, active && styles.checkboxTextActive]}>{opt.label}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.submitBar}>
        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Text style={styles.submitText}>팀 프로젝트 의뢰 등록하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  content: { paddingBottom: 120 },
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#dee2e6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  form: { backgroundColor: '#ffffff', marginTop: 16, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 12 },
  formGroup: { width: '48%' },
  fullWidth: { width: '100%' },
  label: { fontSize: 13, color: '#333333', fontWeight: '500', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, backgroundColor: '#FFFFFF' },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  separator: { color: '#6B7280', fontSize: 14 },
  suffix: { color: '#374151', fontSize: 13 },
  helpText: { fontSize: 12, color: '#6B7280', marginTop: 6 },

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

  segmentRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  segmentChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  segmentChipActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  segmentChipText: { fontSize: 13, color: '#374151' },
  segmentChipTextActive: { color: '#2563EB', fontWeight: '700' },

  checkboxRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  checkboxChip: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  checkboxChipActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  checkboxText: { fontSize: 13, color: '#374151' },
  checkboxTextActive: { color: '#2563EB', fontWeight: '700' },
  btnSecondary: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F3F4F6', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  btnSecondaryText: { color: '#333333', fontSize: 13, fontWeight: '500' },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3F4F6', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16 },
  chipText: { fontSize: 12, color: '#374151' },
  suggestionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  suggestionChip: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', borderWidth: 1, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16 },
  suggestionText: { fontSize: 12, color: '#2563EB' },

  submitBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  submitButton: { backgroundColor: '#0066CC', paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
})
