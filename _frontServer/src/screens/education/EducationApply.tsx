import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type SelectedTextbook = { name: string; price: number; qty: number }
type ApplyPayload = { courseFee: number; textbooks: SelectedTextbook[] }
type OrderParam = { items: Array<{ id?: number; title?: string; name?: string; price: number; qty?: number }>; subtotal: number; totalAmount?: number }

export default function EducationApply() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [name, setName] = useState('')
  const [phone1, setPhone1] = useState('010')
  const [phone2, setPhone2] = useState('')
  const [phone3, setPhone3] = useState('')
  const [email, setEmail] = useState('')
  const [birthday, setBirthday] = useState('')

  const incoming: ApplyPayload | undefined = route?.params?.payload || route?.params?.selection
  const incomingOrder: OrderParam | undefined = route?.params?.order

  const courseFee = (incomingOrder?.subtotal ?? incoming?.courseFee) ?? 1200000
  const textbooksData: SelectedTextbook[] = (incomingOrder?.items?.map(it => ({
    name: it.name || it.title || '교재',
    price: it.price,
    qty: it.qty ?? 1,
  })) ?? incoming?.textbooks) ?? [
    { name: '실전 클라우드 보안 (2024 개정판)', price: 35000, qty: 1 },
  ]

  const [recvName, setRecvName] = useState('')
  const [recvPhone, setRecvPhone] = useState('')
  const [zip, setZip] = useState('')
  const [addr1, setAddr1] = useState('')
  const [addr2, setAddr2] = useState('')
  const [memo, setMemo] = useState('')

  const [agreeAll, setAgreeAll] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)

  const textbookTotal = useMemo(() => {
    return textbooksData.reduce((sum, t) => sum + (t.price * t.qty), 0)
  }, [textbooksData])

  const totalAmount = courseFee + textbookTotal
  const anyTextbookSelected = textbookTotal > 0

  const formatPrice = (price: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(price)

  const toggleAllAgree = () => {
    const next = !agreeAll
    setAgreeAll(next)
    setAgreeTerms(next)
    setAgreePrivacy(next)
    setAgreeMarketing(next)
  }

  

  const goBackSmart = () => {
    if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
      ;(navigation as any).goBack()
      return
    }
    navigation.navigate('Home')
  }

  const submitApply = () => {
    if (!name || !phone1 || !phone2 || !phone3 || !email) {
      Alert.alert('안내', '필수 정보를 입력해주세요.')
      return
    }
    if (!agreeTerms || !agreePrivacy) {
      Alert.alert('안내', '필수 약관에 동의해주세요.')
      return
    }
    if (anyTextbookSelected && (!recvName || !recvPhone || !zip || !addr1)) {
      Alert.alert('안내', '교재 배송지를 입력해주세요.')
      return
    }
    navigation.navigate('PaymentCheckoutPersonal', { order: { items: textbooksData, subtotal: textbookTotal, totalAmount } })
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>교육 신청</Text>
        <View style={styles.headerIcon}><FontAwesome5 name="question-circle" size={18} color="#6B7280" /></View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.section}>
          <View style={styles.progressRow}>
            <View style={[styles.stepCircle, styles.stepActive]}><Text style={styles.stepTextActive}>1</Text></View>
            <Text style={styles.stepLabelActive}>신청 정보</Text>
            <View style={styles.progressLine} />
            <View style={styles.stepCircle}><Text style={styles.stepText}>2</Text></View>
            <Text style={styles.stepLabel}>교재 선택</Text>
            <View style={styles.progressLine} />
            <View style={styles.stepCircle}><Text style={styles.stepText}>3</Text></View>
            <Text style={styles.stepLabel}>결제</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}><FontAwesome5 name="graduation-cap" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>신청 과정 정보</Text></View>
          <View style={styles.courseHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.educationTitle}>실무 중심의 클라우드 보안 전문가 과정</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}><FontAwesome5 name="user-tie" size={12} color="#6B7280" /><Text style={styles.metaText}>김보안 강사</Text></View>
                <View style={styles.metaItem}><FontAwesome5 name="calendar-alt" size={12} color="#6B7280" /><Text style={styles.metaText}>2024.03.01 ~ 2024.04.26</Text></View>
                <View style={styles.metaItem}><FontAwesome5 name="users" size={12} color="#6B7280" /><Text style={styles.metaText}>정원 20명 (신청 12명)</Text></View>
              </View>
            </View>
            <Text style={styles.educationPrice}>{formatPrice(courseFee)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}><FontAwesome5 name="book" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>교재 확인</Text></View>
          <View style={{ rowGap: 10 }}>
            {textbooksData.map((t, idx) => (
              <View style={styles.textbookItem} key={`tb-${idx}`}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.textbookName}>{t.name}</Text>
                  <Text style={styles.textbookDesc}>수량 {t.qty}</Text>
                </View>
                <Text style={styles.textbookPrice}>{formatPrice(t.price * t.qty)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.paymentSummary}>
            <View style={styles.summaryRow}><Text>교육비</Text><Text>{formatPrice(courseFee)}</Text></View>
            <View style={styles.summaryRow}><Text>교재비</Text><Text>{formatPrice(textbookTotal)}</Text></View>
            <View style={[styles.summaryRow, styles.summaryTotal]}><Text>총 결제 금액</Text><Text>{formatPrice(totalAmount)}</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}><FontAwesome5 name="user" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>개인 정보</Text></View>
          <View style={{ rowGap: 10 }}>
            <View>
              <Text style={styles.formLabel}>이름</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="이름을 입력하세요" />
            </View>
            <View>
              <Text style={styles.formLabel}>연락처</Text>
              <View style={styles.formRow}>
                <TextInput style={[styles.input, { flex: 1 }]} value={phone1} onChangeText={setPhone1} placeholder="010" keyboardType="number-pad" />
                <TextInput style={[styles.input, { flex: 1 }]} value={phone2} onChangeText={setPhone2} placeholder="1234" keyboardType="number-pad" />
                <TextInput style={[styles.input, { flex: 1 }]} value={phone3} onChangeText={setPhone3} placeholder="5678" keyboardType="number-pad" />
              </View>
            </View>
            <View>
              <Text style={styles.formLabel}>이메일</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="example@email.com" keyboardType="email-address" />
              <Text style={styles.formText}>수강 확인 및 교육 자료 발송에 사용됩니다.</Text>
            </View>
            <View>
              <Text style={styles.formLabel}>생년월일</Text>
              <TextInput style={styles.input} value={birthday} onChangeText={setBirthday} placeholder="YYYY-MM-DD" />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          {/* <View style={styles.sectionTitleRow}><FontAwesome5 name="book" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>교재 확인</Text></View>
          <View style={{ rowGap: 10 }}>
            {textbooksData.map((t, idx) => (
              <View style={styles.textbookItem} key={`tb-${idx}`}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.textbookName}>{t.name}</Text>
                  <Text style={styles.textbookDesc}>수량 {t.qty}</Text>
                </View>
                <Text style={styles.textbookPrice}>{formatPrice(t.price * t.qty)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.paymentSummary}>
            <View style={styles.summaryRow}><Text>교육비</Text><Text>{formatPrice(courseFee)}</Text></View>
            <View style={styles.summaryRow}><Text>교재비</Text><Text>{formatPrice(textbookTotal)}</Text></View>
            <View style={[styles.summaryRow, styles.summaryTotal]}><Text>총 결제 금액</Text><Text>{formatPrice(totalAmount)}</Text></View>
          </View> */}

          {anyTextbookSelected ? (
            <View style={styles.addressSection}>
              <View style={styles.addressTitleRow}><FontAwesome5 name="location-dot" size={16} color="#374151" /><Text style={styles.addressTitle}>배송지 정보</Text></View>
              <View style={styles.formRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>받는 분</Text>
                  <TextInput style={styles.input} value={recvName} onChangeText={setRecvName} placeholder="이름" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>연락처</Text>
                  <TextInput style={styles.input} value={recvPhone} onChangeText={setRecvPhone} placeholder="010-1234-5678" />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>우편번호</Text>
                  <TextInput style={styles.input} value={zip} onChangeText={setZip} placeholder="우편번호" />
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={styles.formLabel}>기본주소</Text>
                  <TextInput style={styles.input} value={addr1} onChangeText={setAddr1} placeholder="도로명 주소" />
                </View>
              </View>
              <View>
                <Text style={styles.formLabel}>상세주소</Text>
                <TextInput style={styles.input} value={addr2} onChangeText={setAddr2} placeholder="건물명, 동/호수 등" />
              </View>
              <View>
                <Text style={styles.formLabel}>요청사항</Text>
                <TextInput style={styles.input} value={memo} onChangeText={setMemo} placeholder="부재 시 경비실에 맡겨주세요 등" />
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}><FontAwesome5 name="file-contract" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>약관 동의</Text></View>
          <View style={styles.agreeItem}>
            <TouchableOpacity style={styles.itemCheckbox} onPress={toggleAllAgree}>
              <FontAwesome5 name={agreeAll ? 'check-square' : 'square'} size={20} color={agreeAll ? '#2563EB' : '#9CA3AF'} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.agreeTitle}>전체 동의</Text>
              <Text style={styles.agreeDesc}>아래 모든 약관에 동의합니다.</Text>
            </View>
          </View>
          <View style={styles.agreeItem}>
            <TouchableOpacity style={styles.itemCheckbox} onPress={() => setAgreeTerms((v) => !v)}>
              <FontAwesome5 name={agreeTerms ? 'check-square' : 'square'} size={20} color={agreeTerms ? '#2563EB' : '#9CA3AF'} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.agreeTitle}>이용약관 동의</Text>
              <Text style={styles.agreeDesc}>교육 이용약관에 동의합니다.</Text>
              <Text style={styles.viewTerms}>약관 보기</Text>
            </View>
          </View>
          <View style={styles.agreeItem}>
            <TouchableOpacity style={styles.itemCheckbox} onPress={() => setAgreePrivacy((v) => !v)}>
              <FontAwesome5 name={agreePrivacy ? 'check-square' : 'square'} size={20} color={agreePrivacy ? '#2563EB' : '#9CA3AF'} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.agreeTitle}>개인정보 수집 및 이용 동의</Text>
              <Text style={styles.agreeDesc}>개인정보 수집 및 이용에 동의합니다.</Text>
              <Text style={styles.viewTerms}>내용 보기</Text>
            </View>
          </View>
          <View style={styles.agreeItem}>
            <TouchableOpacity style={styles.itemCheckbox} onPress={() => setAgreeMarketing((v) => !v)}>
              <FontAwesome5 name={agreeMarketing ? 'check-square' : 'square'} size={20} color={agreeMarketing ? '#2563EB' : '#9CA3AF'} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.agreeTitle}>마케팅 정보 수신 동의 (선택)</Text>
              <Text style={styles.agreeDesc}>할인, 이벤트 등 교육 관련 정보를 수신하는 것에 동의합니다.</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.alertInfo}><FontAwesome5 name="info-circle" size={14} color="#17a2b8" /><Text style={styles.alertText}>신청 완료 후 3일 이내에 결제해야 예약이 확정됩니다.</Text></View>
          <View style={styles.alertWarn}><FontAwesome5 name="exclamation-triangle" size={14} color="#F59E0B" /><Text style={styles.alertText}>정원이 마감될 경우 조기 마감될 수 있으니 빠른 신청을 권장합니다.</Text></View>
          <View style={styles.btnGroup}>
            <TouchableOpacity style={styles.btnSecondary} onPress={goBackSmart}><Text style={styles.btnSecondaryText}>취소</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={submitApply}><Text style={styles.btnPrimaryText}>신청하기</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  header: { height: 60, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#DEE2E6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333333' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  section: { backgroundColor: '#FFFFFF', padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333333' },
  courseHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 8 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#DEE2E6', alignItems: 'center', justifyContent: 'center' },
  stepActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  stepText: { color: '#6C757D', fontWeight: '700' },
  stepTextActive: { color: '#FFFFFF', fontWeight: '700' },
  stepLabel: { fontSize: 12, color: '#6C757D' },
  stepLabelActive: { fontSize: 12, color: '#2563EB', fontWeight: '700' },
  progressLine: { width: 40, height: 2, backgroundColor: '#DEE2E6' },

  educationTitle: { fontSize: 16, fontWeight: '700', color: '#333333' },
  metaRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  metaText: { fontSize: 12, color: '#6C757D' },
  educationPrice: { fontSize: 16, color: '#2563EB', fontWeight: '700' },

  formLabel: { fontSize: 13, fontWeight: '500', color: '#333333', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF', fontSize: 14 },
  formRow: { flexDirection: 'row', columnGap: 10 },
  formText: { fontSize: 12, color: '#6C757D', marginTop: 6 },

  textbookItem: { flexDirection: 'row', alignItems: 'center', columnGap: 10, padding: 12, backgroundColor: '#F8F9FA', borderRadius: 8 },
  itemCheckbox: { width: 28, alignItems: 'center' },
  textbookName: { fontSize: 13, fontWeight: '700', color: '#333333' },
  textbookDesc: { fontSize: 12, color: '#6C757D' },
  textbookPrice: { fontSize: 13, color: '#2563EB', fontWeight: '700' },
  qtyInput: { width: 60, borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 6, textAlign: 'center', paddingVertical: 6, paddingHorizontal: 8 },
  qtyDisabled: { opacity: 0.6 },

  paymentSummary: { backgroundColor: '#F8F9FA', borderRadius: 8, padding: 12, marginTop: 10 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  summaryTotal: { borderTopWidth: 1, borderTopColor: '#DEE2E6', paddingTop: 8 },

  addressSection: { backgroundColor: '#F8F9FA', borderRadius: 8, padding: 12, marginTop: 12 },
  addressTitleRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, marginBottom: 8 },
  addressTitle: { fontSize: 14, fontWeight: '700', color: '#333333' },

  agreeItem: { flexDirection: 'row', alignItems: 'flex-start', columnGap: 10, padding: 12, backgroundColor: '#F8F9FA', borderRadius: 8, marginBottom: 8 },
  agreeTitle: { fontSize: 13, fontWeight: '600', color: '#333333' },
  agreeDesc: { fontSize: 12, color: '#6C757D' },
  viewTerms: { fontSize: 12, textDecorationLine: 'underline', color: '#2563EB', marginTop: 6 },

  alertInfo: { flexDirection: 'row', alignItems: 'center', columnGap: 8, padding: 12, backgroundColor: 'rgba(23,162,184,0.1)', borderLeftWidth: 4, borderLeftColor: '#17a2b8', borderRadius: 6, marginBottom: 10 },
  alertWarn: { flexDirection: 'row', alignItems: 'center', columnGap: 8, padding: 12, backgroundColor: 'rgba(255,193,7,0.1)', borderLeftWidth: 4, borderLeftColor: '#F59E0B', borderRadius: 6 },
  alertText: { fontSize: 12, color: '#333333' },

  btnGroup: { flexDirection: 'row', columnGap: 10, marginTop: 12 },
  btnPrimary: { flex: 1, backgroundColor: '#007bff', paddingVertical: 12, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  btnSecondary: { flex: 1, backgroundColor: '#6c757d', paddingVertical: 12, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  btnSecondaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' }
})
