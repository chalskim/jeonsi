import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FontAwesome5 } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'

type InquiryType = 'service' | 'payment' | 'account' | 'technical' | 'partnership' | 'other'
type Attachment = { id: number; name: string; uri: string; size?: number; mimeType?: string }

export default function InquiryRegistration() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [inquiryType, setInquiryType] = useState<InquiryType | ''>('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])

  const typeOptions = useMemo(() => [
    { code: 'service', label: '서비스 관련' },
    { code: 'payment', label: '결제 관련' },
    { code: 'account', label: '계정 관련' },
    { code: 'technical', label: '기술 지원' },
    { code: 'partnership', label: '제휴 문의' },
    { code: 'other', label: '기타' }
  ] as Array<{ code: InquiryType; label: string }>, [])

  const goBackSmart = () => {
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
  }

  const formatPhone = (raw: string) => {
    let v = raw.replace(/[^0-9]/g, '')
    if (v.length <= 3) return v
    if (v.length <= 7) return `${v.slice(0, 3)}-${v.slice(3)}`
    return `${v.slice(0, 3)}-${v.slice(3, 7)}-${v.slice(7, 11)}`
  }

  const validateEmail = (v: string) => /^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(v.trim())

  const canSubmit = useMemo(() => {
    return !!inquiryType && !!title.trim() && !!content.trim() && !!email.trim() && agreeTerms && validateEmail(email)
  }, [inquiryType, title, content, email, agreeTerms])

  const addAttachment = async () => {
    if (attachments.length >= 5) {
      Alert.alert('안내', '최대 5개 파일까지 업로드 가능합니다.')
      return
    }
    const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
    const asset = (res as any)?.assets?.[0]
    if (!(res as any)?.canceled && asset?.name && asset?.uri) {
      const size = asset?.size ?? undefined
      const mimeType = asset?.mimeType ?? undefined
      if (typeof size === 'number' && size > 10 * 1024 * 1024) {
        Alert.alert('파일 용량 초과', `${asset.name} 파일 크기가 10MB를 초과했습니다.`)
        return
      }
      const allowed = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (mimeType && !allowed.includes(mimeType)) {
        Alert.alert('형식 오류', `${asset.name} 파일 형식을 지원하지 않습니다.\n지원 형식: JPG, PNG, PDF, DOC, DOCX`)
        return
      }
      setAttachments((prev) => [...prev, { id: Date.now(), name: asset.name, uri: asset.uri, size, mimeType }])
    }
  }

  const removeAttachment = (id: number) => setAttachments((prev) => prev.filter((a) => a.id !== id))

  const resetForm = () => {
    setInquiryType('')
    setTitle('')
    setContent('')
    setEmail('')
    setPhone('')
    setAgreeTerms(false)
    setAttachments([])
  }

  const submit = () => {
    if (!canSubmit) {
      Alert.alert('안내', '필수 항목을 모두 입력해 주세요.')
      return
    }
    Alert.alert('문의 접수', '문의가 성공적으로 접수되었습니다. 24시간 내에 답변드리겠습니다.', [
      { text: '확인', onPress: () => { resetForm(); navigation.navigate('Home') } }
    ])
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }] }>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>1:1 문의</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="edit" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>문의 작성</Text></View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>문의 유형 *</Text>
            <View style={styles.optionRow}>
              {typeOptions.map((opt) => {
                const on = inquiryType === opt.code
                return (
                  <TouchableOpacity key={`type-${opt.code}`} style={[styles.optionChip, on && styles.optionChipOn]} onPress={() => setInquiryType(opt.code)}>
                    <Text style={[styles.optionChipText, on && styles.optionChipTextOn]}>{opt.label}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>제목 *</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="문의 제목을 입력하세요" />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>문의 내용 *</Text>
            <TextInput style={[styles.input, { height: 140, textAlignVertical: 'top' }]} value={content} onChangeText={setContent} placeholder={'궁금한 점을 자세히 설명해주세요\n문의하신 내용은 24시간 내에 답변드립니다.'} multiline />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>첨부 파일 (선택)</Text>
            <View style={{ flexDirection: 'row', columnGap: 12 }}>
              <TouchableOpacity style={[styles.btn, styles.btnSecondary]} activeOpacity={0.85} onPress={addAttachment}>
                <FontAwesome5 name="cloud-upload-alt" size={16} color="#111827" />
                <Text style={styles.btnSecondaryText}>파일 선택</Text>
              </TouchableOpacity>
              {!!attachments.length && (
                <View style={{ justifyContent: 'center' }}><Text style={styles.hintSuccess}><FontAwesome5 name="check-circle" size={14} color="#10B981" /> {attachments.length}개 파일 선택됨</Text></View>
              )}
            </View>
            {attachments.map((a) => (
              <View key={a.id} style={styles.fileRow}>
                <FontAwesome5 name="paperclip" size={14} color="#6B7280" />
                <Text style={styles.fileName} numberOfLines={1}>{a.name}</Text>
                <TouchableOpacity style={styles.fileRemove} onPress={() => removeAttachment(a.id)}>
                  <FontAwesome5 name="times" size={14} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
            <Text style={styles.hint}>최대 5개 파일, 각 파일 10MB까지 업로드 가능합니다 (JPG, PNG, PDF, DOC, DOCX)</Text>
          </View>

          <View style={styles.inlineRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>이메일 주소 *</Text>
              <TextInput style={styles.input} value={email} onChangeText={(t) => setEmail(t)} placeholder="답변 받을 이메일 주소" keyboardType="email-address" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>연락처</Text>
              <TextInput style={styles.input} value={phone} onChangeText={(t) => setPhone(formatPhone(t))} placeholder="답변 받을 연락처 (선택)" keyboardType="phone-pad" />
            </View>
          </View>

          <TouchableOpacity style={styles.checkbox} activeOpacity={0.85} onPress={() => setAgreeTerms((v) => !v)}>
            <FontAwesome5 name={agreeTerms ? 'check-square' : 'square'} size={18} color={agreeTerms ? '#2563EB' : '#6B7280'} />
            <View style={{ flex: 1 }}>
              <Text style={styles.checkboxTitle}>개인정보 수집 및 이용에 동의합니다</Text>
              <Text style={styles.checkboxDesc}>전시는 문의 답변을 위해 최소한의 개인정보를 수집하며, 동의하지 않을 경우 문의 서비스 이용이 제한될 수 있습니다. 수집된 정보는 문의 처리 외의 목적으로 사용되지 않습니다.</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.btnGroup}>
            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} activeOpacity={0.85} onPress={resetForm}>
              <FontAwesome5 name="undo" size={16} color="#111827" />
              <Text style={styles.btnSecondaryText}>초기화</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary, !canSubmit && { opacity: 0.6 }]} activeOpacity={0.85} onPress={submit}>
              <FontAwesome5 name="paper-plane" size={16} color="#FFFFFF" />
              <Text style={styles.btnPrimaryText}>문의하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contact}>
          <Text style={styles.contactTitle}>다른 방법으로 문의하기</Text>
          <Text style={styles.contactDesc}>더 편리한 방법을 선택해주세요</Text>
          <View style={styles.methods}>
            <View style={styles.method}><FontAwesome5 name="comments" size={22} color="#2563EB" /><Text style={styles.methodTitle}>실시간 채팅</Text><Text style={styles.methodInfo}>평일 9:00 - 18:00</Text></View>
            <View style={styles.method}><FontAwesome5 name="envelope" size={22} color="#2563EB" /><Text style={styles.methodTitle}>이메일 문의</Text><Text style={styles.methodInfo}>support@jeonsi.com</Text></View>
            <View style={styles.method}><FontAwesome5 name="phone" size={22} color="#2563EB" /><Text style={styles.methodTitle}>전화 문의</Text><Text style={styles.methodInfo}>1644-1234</Text></View>
          </View>
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
  content: { paddingBottom: 40 },
  section: { backgroundColor: '#ffffff', borderRadius: 12, marginHorizontal: 20, marginTop: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  formGroup: { marginTop: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#111827', marginBottom: 8 },
  input: { width: '100%', paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1.8, borderColor: '#E5E7EB', borderRadius: 8, fontSize: 14, backgroundColor: '#ffffff' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 18, backgroundColor: '#ffffff' },
  optionChipOn: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  optionChipText: { fontSize: 12, color: '#374151' },
  optionChipTextOn: { color: '#ffffff' },
  inlineRow: { flexDirection: 'row', columnGap: 12 },
  btnGroup: { flexDirection: 'row', justifyContent: 'flex-end', columnGap: 12, marginTop: 8 },
  btn: { flexDirection: 'row', alignItems: 'center', columnGap: 8, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16 },
  btnPrimary: { backgroundColor: '#2563EB' },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  btnSecondary: { backgroundColor: '#E9ECEF' },
  btnSecondaryText: { color: '#111827', fontSize: 14, fontWeight: '600' },
  hint: { fontSize: 11, color: '#6B7280', marginTop: 8 },
  hintSuccess: { fontSize: 12, color: '#10B981' },
  fileRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, paddingVertical: 6 },
  fileName: { flex: 1, color: '#374151', fontSize: 12 },
  fileRemove: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  checkbox: { flexDirection: 'row', alignItems: 'flex-start', columnGap: 10, paddingVertical: 12 },
  checkboxTitle: { fontSize: 13, fontWeight: '700', color: '#111827' },
  checkboxDesc: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  contact: { backgroundColor: '#F9FAFB', borderRadius: 12, marginHorizontal: 20, marginTop: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  contactTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  contactDesc: { fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 12 },
  methods: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  method: { width: '48%', backgroundColor: '#ffffff', borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10 },
  methodTitle: { fontSize: 13, fontWeight: '600', color: '#111827', marginTop: 6 },
  methodInfo: { fontSize: 12, color: '#6B7280' }
})
