import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type OrderItem = { id: number; title: string; price: number }
type OrderData = { items: OrderItem[]; subtotal: number; promoDiscount: number; pointsDiscount: number; totalAmount: number; appliedPromoName?: string; pointsUsed?: number }
type UserData = { name: string; email: string; phone: string }

export default function PaymentCheckoutPersonal() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const fallbackOrder: OrderData = useMemo(() => ({
    items: [
      { id: 1, title: '마케팅 전략 기획 워크숍', price: 150000 },
      { id: 3, title: '스타트업 재무 관리 실무', price: 180000 }
    ],
    subtotal: 330000,
    promoDiscount: 33000,
    pointsDiscount: 5000,
    totalAmount: 292000,
    appliedPromoName: '신규가입 감사 쿠폰',
    pointsUsed: 5000
  }), [])

  const fallbackUser: UserData = { name: '홍길동', email: 'gildong@example.com', phone: '010-1234-5678' }

  const incomingOrder: OrderData | undefined = route.params?.order
  const incomingUser: UserData | undefined = route.params?.user

  const order = incomingOrder || fallbackOrder
  const user = incomingUser || fallbackUser

  const [method, setMethod] = useState<'card' | 'transfer'>('card')
  const [termsAgree, setTermsAgree] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvc, setCvc] = useState('')

  const formatPrice = (price: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(price)

  const goBackSmart = () => {
    if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
      ;(navigation as any).goBack()
      return
    }
    navigation.navigate('Home')
  }

  const onChangeCardNumber = (t: string) => {
    const only = t.replace(/[^0-9]/g, '')
    const parts = only.match(/.{1,4}/g) || []
    setCardNumber(parts.join(' '))
  }

  const onChangeExpiry = (t: string) => {
    const only = t.replace(/[^0-9]/g, '')
    const mm = only.slice(0, 2)
    const yy = only.slice(2, 4)
    setExpiryDate(mm + (yy ? '/' + yy : ''))
  }

  const onChangeCvc = (t: string) => {
    setCvc(t.replace(/[^0-9]/g, '').slice(0, 4))
  }

  const canPay = termsAgree

  const subtotal = order.subtotal
  const promoDiscount = order.promoDiscount
  const pointsDiscount = order.pointsDiscount
  const total = order.totalAmount

  const processPayment = () => {
    if (!canPay) {
      Alert.alert('안내', '약관에 동의해주세요.')
      return
    }
    if (method === 'card') {
      if (!cardNumber || !expiryDate || !cvc) {
        Alert.alert('안내', '카드 정보를 모두 입력해주세요.')
        return
      }
    }
    Alert.alert('결제', '결제가 성공적으로 완료되었습니다. 마이페이지에서 결제 내역을 확인할 수 있습니다.')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>결제하기</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주문 정보</Text>
          <View>
            {order.items.map((it) => (
              <View key={`ord-${it.id}`} style={styles.orderItem}>
                <Text style={styles.orderItemName}>{it.title}</Text>
                <Text style={styles.orderItemPrice}>{formatPrice(it.price)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.priceBox}>
            <View style={styles.priceRow}><Text style={styles.priceLabel}>총 상품 금액</Text><Text style={styles.priceValue}>{formatPrice(subtotal)}</Text></View>
            {promoDiscount > 0 ? (<View style={styles.priceRow}><Text style={styles.priceLabel}>프로모션 할인</Text><Text style={[styles.priceValue, styles.discountText]}>-{formatPrice(promoDiscount)}</Text></View>) : null}
            {pointsDiscount > 0 ? (<View style={styles.priceRow}><Text style={styles.priceLabel}>포인트 사용</Text><Text style={[styles.priceValue, styles.discountText]}>-{formatPrice(pointsDiscount)}</Text></View>) : null}
            <View style={[styles.priceRow, styles.priceTotal]}><Text style={styles.priceTotalLabel}>최종 결제 금액</Text><Text style={styles.priceTotalValue}>{formatPrice(total)}</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>결제 수단</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity style={[styles.paymentOption, method === 'card' && styles.paymentOptionOn]} onPress={() => setMethod('card')}>
              <FontAwesome5 name="credit-card" size={18} color="#2563EB" />
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentOptionTitle}>신용카드</Text>
                <Text style={styles.paymentOptionDesc}>VISA, Mastercard, AMEX 등</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.paymentOption, method === 'transfer' && styles.paymentOptionOn]} onPress={() => setMethod('transfer')}>
              <FontAwesome5 name="university" size={18} color="#2563EB" />
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentOptionTitle}>계좌이체</Text>
                <Text style={styles.paymentOptionDesc}>결제 확인 후 자동 이체</Text>
              </View>
            </TouchableOpacity>
          </View>

          {method === 'card' ? (
            <View style={styles.paymentForm}>
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.formLabel}>카드 번호</Text>
                <TextInput style={styles.input} value={cardNumber} onChangeText={onChangeCardNumber} placeholder="1234 5678 9012 3456" maxLength={19} />
              </View>
              <View style={styles.formRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>유효기간 (MM/YY)</Text>
                  <TextInput style={styles.input} value={expiryDate} onChangeText={onChangeExpiry} placeholder="MM/YY" maxLength={5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>CVC</Text>
                  <TextInput style={styles.input} value={cvc} onChangeText={onChangeCvc} placeholder="123" maxLength={4} />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.paymentForm}>
              <Text style={styles.transferText}>계좌이체를 선택했습니다. 인증 결제 페이지로 이동 후 아래 정보로 입금해주세요.</Text>
              <Text style={styles.transferText}>입금은행: 국민은행</Text>
              <Text style={styles.transferText}>계좌번호: 123-456-7890</Text>
              <Text style={styles.transferText}>예금주: (주)전시</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>결제자 정보</Text>
          <View style={{ rowGap: 8 }}>
            <Text style={styles.billingRow}><Text style={styles.billingLabel}>이름: </Text>{user.name}</Text>
            <Text style={styles.billingRow}><Text style={styles.billingLabel}>이메일: </Text>{user.email}</Text>
            <Text style={styles.billingRow}><Text style={styles.billingLabel}>연락처: </Text>{user.phone}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.termsRow}>
            <TouchableOpacity style={styles.checkbox} onPress={() => setTermsAgree((v) => !v)}>
              <FontAwesome5 name={termsAgree ? 'check-square' : 'square'} size={18} color={termsAgree ? '#2563EB' : '#9CA3AF'} />
            </TouchableOpacity>
            <Text style={styles.termsText}>이용약관 및 개인정보처리방침에 동의합니다. (필수)</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionsBar}>
        <TouchableOpacity style={[styles.payBtn, !canPay && styles.payBtnDisabled]} disabled={!canPay} onPress={processPayment}>
          <Text style={styles.payBtnText}>{canPay ? `${formatPrice(total)} 결제하기` : '약관에 동의해주세요'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { height: 60, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  section: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginHorizontal: 15, marginTop: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionTitle: { fontSize: 16, color: '#111827', fontWeight: '700', marginBottom: 10 },

  orderItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  orderItemName: { fontSize: 14, color: '#111827', fontWeight: '600' },
  orderItemPrice: { fontSize: 13, color: '#6B7280' },

  priceBox: { borderTopWidth: 1, borderTopColor: '#E5E7EB', marginTop: 10, paddingTop: 10, rowGap: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceLabel: { fontSize: 13, color: '#6B7280' },
  priceValue: { fontSize: 14, color: '#111827', fontWeight: '600' },
  discountText: { color: '#10B981' },
  priceTotal: { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  priceTotalLabel: { fontSize: 14, color: '#111827', fontWeight: '700' },
  priceTotalValue: { fontSize: 16, color: '#2563EB', fontWeight: '700' },

  paymentOptions: { rowGap: 10 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', columnGap: 12, paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 },
  paymentOptionOn: { borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.06)' },
  paymentOptionTitle: { fontSize: 14, color: '#111827', fontWeight: '600' },
  paymentOptionDesc: { fontSize: 12, color: '#6B7280' },

  paymentForm: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12, rowGap: 10 },
  formRow: { flexDirection: 'row', columnGap: 12 },
  formLabel: { fontSize: 13, color: '#111827', fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#FFFFFF' },
  transferText: { fontSize: 13, color: '#374151' },

  billingRow: { fontSize: 13, color: '#111827' },
  billingLabel: { fontWeight: '700' },

  termsRow: { flexDirection: 'row', alignItems: 'flex-start', columnGap: 10 },
  checkbox: { width: 24, alignItems: 'center' },
  termsText: { flex: 1, fontSize: 12, color: '#374151' },

  actionsBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 12, paddingHorizontal: 15 },
  payBtn: { backgroundColor: '#0066CC', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  payBtnDisabled: { backgroundColor: '#9CA3AF' },
  payBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', textAlign: 'center' }
})

