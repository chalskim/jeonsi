import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type TeamOrder = { id: number; title: string; membersDesc: string; price: number }
type CorpInfo = { company: string; bizNo: string; manager: string; phone: string; email: string }

export default function PaymentCheckoutCorporate() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const order: TeamOrder = route.params?.order || { id: 1, title: '보안 강화 프로젝트팀', membersDesc: '김보안 전문가, 이클라우드 전문가, 박데이터 전문가 | 주 40시간', price: 15600000 }
  const corp: CorpInfo = route.params?.corp || { company: '㈜테크솔루션', bizNo: '123-45-67890', manager: '홍길동', phone: '010-1234-5678', email: 'hong@techsolution.co.kr' }

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvc, setCvc] = useState('')
  const [cardholder, setCardholder] = useState('')
  const [bankName, setBankName] = useState('국민은행')

  const [termsAll, setTermsAll] = useState(true)
  const [termsService, setTermsService] = useState(true)
  const [termsPrivacy, setTermsPrivacy] = useState(true)
  const [termsRefund, setTermsRefund] = useState(true)

  const baseAmount = order.price
  const couponDiscount = Math.floor(baseAmount * 0.1)
  const pointsDiscount = 25000
  const total = Math.max(0, baseAmount - couponDiscount - pointsDiscount)

  const formatPrice = (price: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(price)

  const goBackSmart = () => {
    if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
      ;(navigation as any).goBack()
      return
    }
    navigation.navigate('Home')
  }

  const setAllTerms = (v: boolean) => {
    setTermsAll(v)
    setTermsService(v)
    setTermsPrivacy(v)
    setTermsRefund(v)
  }

  const onTermChange = (key: 'service' | 'privacy' | 'refund') => {
    if (key === 'service') setTermsService((x) => !x)
    if (key === 'privacy') setTermsPrivacy((x) => !x)
    if (key === 'refund') setTermsRefund((x) => !x)
    const nextAll = [
      key === 'service' ? !termsService : termsService,
      key === 'privacy' ? !termsPrivacy : termsPrivacy,
      key === 'refund' ? !termsRefund : termsRefund,
    ].every((b) => b)
    setTermsAll(nextAll)
  }

  const onChangeCardNumber = (t: string) => {
    const only = t.replace(/[^0-9]/g, '')
    const parts = only.match(/.{1,4}/g) || []
    setCardNumber(parts.join('-'))
  }

  const onChangeExpiry = (t: string) => {
    const only = t.replace(/[^0-9]/g, '')
    const mm = only.slice(0, 2)
    const yy = only.slice(2, 4)
    setExpiryDate(mm + (yy ? '/' + yy : ''))
  }

  const canPay = termsAll

  const processPayment = () => {
    if (!canPay) {
      Alert.alert('안내', '모든 약관에 동의해주세요.')
      return
    }
    if (paymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvc || !cardholder) {
        Alert.alert('안내', '카드 정보를 모두 입력해주세요.')
        return
      }
    }
    Alert.alert('결제', '결제가 완료되었습니다. 감사합니다.')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>결제하기</Text>
        <View style={styles.headerIcon}><FontAwesome5 name="question-circle" size={20} color="#6B7280" /></View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.progressBox}>
          <View style={styles.progressRow}>
            <View style={[styles.stepCircle, styles.stepCompleted]}><Text style={styles.stepText}>1</Text></View>
            <Text style={[styles.stepLabel, styles.stepLabelMuted]}>장바구니</Text>
            <View style={styles.progressLine} />
            <View style={[styles.stepCircle, styles.stepActive]}><Text style={styles.stepTextActive}>2</Text></View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>결제</Text>
            <View style={styles.progressLine} />
            <View style={styles.stepCircle}><Text style={styles.stepText}>3</Text></View>
            <Text style={[styles.stepLabel, styles.stepLabelMuted]}>완료</Text>
          </View>
        </View>

        <View style={styles.containerPad}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="shopping-cart" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>주문 내역</Text></View></View>
            <View style={styles.orderItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderItemTitle}>{order.title}</Text>
                <Text style={styles.orderItemDesc}>{order.membersDesc}</Text>
              </View>
              <Text style={styles.orderItemPrice}>{formatPrice(order.price)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="file-invoice" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>결제 정보</Text></View></View>
            <View style={styles.formRow}><View style={{ flex: 1 }}><Text style={styles.formLabel}>회사명</Text><TextInput style={styles.input} value={corp.company} editable={false} /></View></View>
            <View style={styles.formRow}>
              <View style={{ flex: 1 }}><Text style={styles.formLabel}>사업자등록번호</Text><TextInput style={styles.input} value={corp.bizNo} editable={false} /></View>
              <View style={{ flex: 1 }}><Text style={styles.formLabel}>담당자명</Text><TextInput style={styles.input} value={corp.manager} editable={false} /></View>
            </View>
            <View style={styles.formRow}><View style={{ flex: 1 }}><Text style={styles.formLabel}>연락처</Text><TextInput style={styles.input} value={corp.phone} editable={false} /></View></View>
            <View style={styles.formRow}><View style={{ flex: 1 }}><Text style={styles.formLabel}>이메일</Text><TextInput style={styles.input} value={corp.email} editable={false} /></View></View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="credit-card" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>결제 수단</Text></View></View>
            <View style={{ rowGap: 10 }}>
              <TouchableOpacity style={[styles.paymentMethod, paymentMethod === 'card' && styles.paymentMethodOn]} onPress={() => setPaymentMethod('card')}>
                <FontAwesome5 name="credit-card" size={16} color="#2563EB" />
                <View style={{ flex: 1 }}><Text style={styles.paymentMethodTitle}>신용카드</Text><Text style={styles.paymentMethodDesc}>안전한 카드 결제</Text></View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.paymentMethod, paymentMethod === 'bank' && styles.paymentMethodOn]} onPress={() => setPaymentMethod('bank')}>
                <FontAwesome5 name="university" size={16} color="#2563EB" />
                <View style={{ flex: 1 }}><Text style={styles.paymentMethodTitle}>계좌이체</Text><Text style={styles.paymentMethodDesc}>무통장 입금</Text></View>
              </TouchableOpacity>
            </View>

            {paymentMethod === 'card' ? (
              <View style={styles.cardForm}>
                <View style={{ marginBottom: 10 }}><Text style={styles.formLabel}>카드번호</Text><TextInput style={styles.input} value={cardNumber} onChangeText={onChangeCardNumber} placeholder="1234-5678-9012-3456" maxLength={19} /></View>
                <View style={styles.formRow}>
                  <View style={{ flex: 1 }}><Text style={styles.formLabel}>유효기간</Text><TextInput style={styles.input} value={expiryDate} onChangeText={onChangeExpiry} placeholder="MM/YY" maxLength={5} /></View>
                  <View style={{ flex: 1 }}><Text style={styles.formLabel}>CVC</Text><TextInput style={styles.input} value={cvc} onChangeText={(t) => setCvc(t.replace(/[^0-9]/g, '').slice(0, 3))} placeholder="123" maxLength={3} /></View>
                </View>
                <View style={{ marginTop: 10 }}><Text style={styles.formLabel}>카드 소유자명</Text><TextInput style={styles.input} value={cardholder} onChangeText={setCardholder} placeholder="홍길동" /></View>
              </View>
            ) : (
              <View style={styles.cardForm}>
                <View style={{ marginBottom: 10 }}><Text style={styles.formLabel}>입금 은행</Text><TextInput style={styles.input} value={bankName} onChangeText={setBankName} /></View>
                <View style={{ marginBottom: 10 }}><Text style={styles.formLabel}>계좌번호</Text><Text style={styles.readonlyText}>123-456-789012</Text></View>
                <View><Text style={styles.formLabel}>예금주</Text><Text style={styles.readonlyText}>㈜전시</Text></View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.checkboxRow}>
              <TouchableOpacity style={styles.checkbox} onPress={() => setAllTerms(!termsAll)}>
                <FontAwesome5 name={termsAll ? 'check-square' : 'square'} size={18} color={termsAll ? '#2563EB' : '#9CA3AF'} />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>전체 동의</Text>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity style={styles.checkbox} onPress={() => onTermChange('service')}>
                <FontAwesome5 name={termsService ? 'check-square' : 'square'} size={18} color={termsService ? '#2563EB' : '#9CA3AF'} />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>서비스 이용약관 동의</Text>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity style={styles.checkbox} onPress={() => onTermChange('privacy')}>
                <FontAwesome5 name={termsPrivacy ? 'check-square' : 'square'} size={18} color={termsPrivacy ? '#2563EB' : '#9CA3AF'} />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>개인정보처리방침 동의</Text>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity style={styles.checkbox} onPress={() => onTermChange('refund')}>
                <FontAwesome5 name={termsRefund ? 'check-square' : 'square'} size={18} color={termsRefund ? '#2563EB' : '#9CA3AF'} />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>환불 정책 동의</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="calculator" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>결제 금액</Text></View></View>
            <View style={styles.summaryBox}>
              <View style={styles.priceRow}><Text style={styles.priceLabel}>기본 금액</Text><Text style={styles.priceValue}>{formatPrice(baseAmount)}</Text></View>
              <View style={styles.priceRow}><Text style={styles.priceLabel}>쿠폰 할인</Text><Text style={[styles.priceValue, styles.discountText]}>-{formatPrice(couponDiscount)}</Text></View>
              <View style={styles.priceRow}><Text style={styles.priceLabel}>포인트 사용</Text><Text style={[styles.priceValue, styles.discountText]}>-{formatPrice(pointsDiscount)}</Text></View>
              <View style={[styles.priceRow, styles.totalRow]}><Text style={styles.totalLabel}>총 결제 금액</Text><Text style={styles.totalValue}>{formatPrice(total)}</Text></View>
            </View>
            <TouchableOpacity style={[styles.btnPrimary, { marginTop: 10 }]} onPress={processPayment}><Text style={styles.btnPrimaryText}>{formatPrice(total)} 결제하기</Text></TouchableOpacity>
            <View style={styles.securityRow}><FontAwesome5 name="lock" size={14} color="#10B981" /><Text style={styles.securityText}>SSL 보안 결제 시스템으로 안전하게 보호됩니다.</Text></View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="file-invoice-dollar" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>세금계산서</Text></View></View>
            <View style={{ rowGap: 10 }}>
              <View><Text style={styles.formLabel}>발행 이메일</Text><TextInput style={styles.input} defaultValue={corp.email} keyboardType="email-address" /></View>
              <View><Text style={styles.formLabel}>발행 시점</Text><TextInput style={styles.input} defaultValue="결제 즉시 발행" /></View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { height: 60, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  progressBox: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingVertical: 14 },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 8 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  stepCompleted: { backgroundColor: '#10B981' },
  stepActive: { backgroundColor: '#2563EB' },
  stepText: { color: '#6B7280', fontWeight: '700' },
  stepTextActive: { color: '#FFFFFF', fontWeight: '700' },
  stepLabel: { fontSize: 12 },
  stepLabelMuted: { color: '#6B7280' },
  stepLabelActive: { color: '#2563EB', fontWeight: '700' },
  progressLine: { width: 40, height: 2, backgroundColor: '#F3F4F6' },

  containerPad: { padding: 15 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },

  orderItem: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  orderItemTitle: { fontSize: 15, color: '#111827', fontWeight: '700' },
  orderItemDesc: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  orderItemPrice: { fontSize: 15, color: '#2563EB', fontWeight: '700' },

  formRow: { flexDirection: 'row', columnGap: 12, marginBottom: 10 },
  formLabel: { fontSize: 13, color: '#111827', fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#FFFFFF' },
  readonlyText: { fontSize: 14, color: '#374151' },

  paymentMethod: { flexDirection: 'row', alignItems: 'center', columnGap: 10, paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 },
  paymentMethodOn: { borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.06)' },
  paymentMethodTitle: { fontSize: 14, color: '#111827', fontWeight: '600' },
  paymentMethodDesc: { fontSize: 12, color: '#6B7280' },
  cardForm: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12 },

  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', columnGap: 10, marginBottom: 8 },
  checkbox: { width: 24, alignItems: 'center' },
  checkboxLabel: { fontSize: 13, color: '#374151' },

  summaryBox: { rowGap: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceLabel: { fontSize: 13, color: '#6B7280' },
  priceValue: { fontSize: 14, color: '#111827', fontWeight: '600' },
  discountText: { color: '#10B981' },
  totalRow: { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  totalLabel: { fontSize: 14, color: '#111827', fontWeight: '700' },
  totalValue: { fontSize: 16, color: '#2563EB', fontWeight: '700' },

  btnPrimary: { backgroundColor: '#0066CC', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  securityRow: { flexDirection: 'row', alignItems: 'center', columnGap: 6, marginTop: 10, justifyContent: 'center' },
  securityText: { fontSize: 12, color: '#6B7280' }
})

