import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type CartItem = {
  id: number
  title: string
  instructor: string
  category: string
  duration: string
  format: string
  price: number
  imageUri: string
}

type Coupon = {
  id: string
  name: string
  discount: number
  discountType: 'percentage' | 'fixed'
}

export default function ShoppingCartPersonal() {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()

  const initialItems = useMemo<CartItem[]>(() => ([
    { id: 1, title: '마케팅 전략 기획 워크숍', instructor: '김마케팅 전문가', category: '마케팅', duration: '4주', format: '온라인', price: 150000, imageUri: 'https://picsum.photos/seed/marketing/160/160.jpg' },
    { id: 2, title: '데이터 분석을 위한 Python 기초', instructor: '이데이터 전문가', category: '데이터/AI', duration: '6주', format: '온라인', price: 200000, imageUri: 'https://picsum.photos/seed/python/160/160.jpg' },
    { id: 3, title: '스타트업 재무 관리 실무', instructor: '박재무 전문가', category: '재무/회계', duration: '3주', format: '온라인', price: 180000, imageUri: 'https://picsum.photos/seed/finance/160/160.jpg' }
  ]), [])

  const availableCoupons = useMemo<Coupon[]>(() => ([
    { id: 'c1', name: '신규가입 감사 쿠폰', discount: 10, discountType: 'percentage' },
    { id: 'c2', name: '주말 특별 5,000원 할인', discount: 5000, discountType: 'fixed' }
  ]), [])

  const [items, setItems] = useState<CartItem[]>(initialItems)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [appliedPromo, setAppliedPromo] = useState<Coupon | null>(null)
  const [promoInput, setPromoInput] = useState('')
  const [pointsUsed, setPointsUsed] = useState(0)
  const availablePoints = 5000

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => (selectedIds.includes(it.id) ? sum + it.price : sum), 0)
  }, [items, selectedIds])

  const promoDiscount = useMemo(() => {
    if (!appliedPromo || selectedIds.length === 0) return 0
    if (appliedPromo.discountType === 'percentage') return Math.floor(subtotal * (appliedPromo.discount / 100))
    return Math.min(appliedPromo.discount, subtotal)
  }, [appliedPromo, selectedIds.length, subtotal])

  const remainingAfterPromo = Math.max(0, subtotal - promoDiscount)
  const pointsDiscount = Math.min(pointsUsed, remainingAfterPromo)
  const total = Math.max(0, subtotal - promoDiscount - pointsDiscount)

  const formatPrice = (price: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(price)
  const formatNumber = (n: number) => new Intl.NumberFormat('ko-KR').format(n)

  const goBackSmart = () => {
    if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
      ;(navigation as any).goBack()
      return
    }
    navigation.navigate('Home')
  }

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id))
    setSelectedIds((prev) => prev.filter((x) => x !== id))
  }

  const applyCoupon = (couponId: string) => {
    const f = availableCoupons.find((c) => c.id === couponId)
    if (f) setAppliedPromo(f)
  }

  const applyPromoCode = () => {
    const code = promoInput.trim()
    if (!code) {
      Alert.alert('안내', '프로모션 코드를 입력해주세요.')
      return
    }
    const isFriend = code.toUpperCase() === 'FRIEND10'
    setAppliedPromo({ id: 'manual-' + Date.now(), name: isFriend ? '친구 추천 쿠폰' : code, discount: isFriend ? 10 : 10, discountType: 'percentage' })
  }

  const removePromo = () => {
    setAppliedPromo(null)
    setPromoInput('')
  }

  const setPointsToMax = () => {
    setPointsUsed(availablePoints)
  }

  const onChangePoints = (txt: string) => {
    const v = Math.max(0, Math.min(Number(txt.replace(/[^0-9]/g, '')) || 0, availablePoints))
    setPointsUsed(v)
  }

  const browseCourses = () => {
    navigation.navigate('EducationsList')
  }

  const canCheckout = selectedIds.length > 0

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>개인 장바구니</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.section}>
          <View style={styles.pageTitle}><Text style={styles.pageTitleText}>장바구니</Text><Text style={styles.pageSubtitle}>관심 있는 교육 과정을 담아두고 결제할 수 있습니다</Text></View>

          {items.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="shopping-cart" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>장바구니가 비어있습니다</Text>
              <Text style={styles.emptyDesc}>관심 있는 교육 과정을 찾아보세요</Text>
              <TouchableOpacity style={styles.btnPrimary} onPress={browseCourses}><Text style={styles.btnPrimaryText}>교육 과정 둘러보기</Text></TouchableOpacity>
            </View>
          ) : (
            <View style={{ rowGap: 12 }}>
              {items.map((it) => (
                <View key={`ci-${it.id}`} style={styles.cartItem}>
                  <TouchableOpacity style={styles.itemCheckbox} onPress={() => toggleSelect(it.id)}>
                    <FontAwesome5 name={selectedIds.includes(it.id) ? 'check-square' : 'square'} size={20} color={selectedIds.includes(it.id) ? '#2563EB' : '#9CA3AF'} />
                  </TouchableOpacity>
                  <View style={styles.itemImageBox}>
                    <Image source={{ uri: it.imageUri }} style={styles.itemImage} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text numberOfLines={1} style={styles.itemTitle}>{it.title}</Text>
                    <Text numberOfLines={1} style={styles.itemInstructor}>{it.instructor}</Text>
                    <View style={styles.itemMetaRow}>
                      <View style={styles.metaTag}><FontAwesome5 name="tag" size={12} color="#6B7280" /><Text style={styles.metaTagText}>{it.category}</Text></View>
                      <View style={styles.metaTag}><FontAwesome5 name="clock" size={12} color="#6B7280" /><Text style={styles.metaTagText}>{it.duration}</Text></View>
                      <View style={styles.metaTag}><FontAwesome5 name="laptop" size={12} color="#6B7280" /><Text style={styles.metaTagText}>{it.format}</Text></View>
                    </View>
                    <Text style={styles.itemPrice}>{formatPrice(it.price)}</Text>
                  </View>
                  <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(it.id)}>
                    <FontAwesome5 name="times" size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>프로모션 코드 / 쿠폰</Text>
                {appliedPromo ? (
                  <View style={styles.promoApplied}>
                    <Text style={styles.promoAppliedName}>{appliedPromo.name}</Text>
                    <TouchableOpacity onPress={removePromo}><Text style={styles.promoAppliedRemove}>삭제</Text></TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ rowGap: 10 }}>
                    <View style={{ rowGap: 10 }}>
                      {availableCoupons.map((c) => (
                        <TouchableOpacity key={`cp-${c.id}`} style={styles.couponItem} activeOpacity={0.8} onPress={() => applyCoupon(c.id)}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.couponName}>{c.name}</Text>
                            <Text style={styles.couponDiscount}>{c.discountType === 'percentage' ? `${c.discount}% 할인` : `${formatPrice(c.discount)} 할인`}</Text>
                          </View>
                          <FontAwesome5 name="chevron-right" size={14} color="#9CA3AF" />
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.separatorRow}><View style={styles.separatorLine} /><Text style={styles.separatorText}>또는 코드 직접 입력</Text><View style={styles.separatorLine} /></View>
                    <View style={styles.promoInputRow}>
                      <TextInput style={styles.input} value={promoInput} onChangeText={setPromoInput} placeholder="프로모션 코드를 입력하세요" />
                      <TouchableOpacity style={[styles.btnPrimary, { paddingHorizontal: 16 }]} onPress={applyPromoCode}><Text style={styles.btnPrimaryText}>적용</Text></TouchableOpacity>
                    </View>
                  </View>
                )}

                <View style={{ marginTop: 14 }}>
                  <Text style={styles.summaryTitle}>포인트 사용</Text>
                  <View style={styles.pointsRow}>
                    <Text style={styles.pointsAvailable}>사용 가능 포인트: {formatNumber(availablePoints)}P</Text>
                    <View style={styles.pointsInputRow}>
                      <TextInput style={[styles.input, { width: 120, textAlign: 'right' }]} keyboardType="numeric" value={String(pointsUsed)} onChangeText={onChangePoints} />
                      <TouchableOpacity style={styles.btnLight} onPress={setPointsToMax}><Text style={styles.btnLightText}>전액 사용</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.priceBox}>
                  <View style={styles.priceRow}><Text style={styles.priceLabel}>총 상품 금액</Text><Text style={styles.priceValue}>{formatPrice(subtotal)}</Text></View>
                  {promoDiscount > 0 ? (<View style={styles.priceRow}><Text style={styles.priceLabel}>프로모션 할인</Text><Text style={[styles.priceValue, styles.discountText]}>-{formatPrice(promoDiscount)}</Text></View>) : null}
                  {pointsDiscount > 0 ? (<View style={styles.priceRow}><Text style={styles.priceLabel}>포인트 사용</Text><Text style={[styles.priceValue, styles.discountText]}>-{formatPrice(pointsDiscount)}</Text></View>) : null}
                  <View style={[styles.priceRow, styles.priceTotal]}><Text style={styles.priceTotalLabel}>최종 결제 금액</Text><Text style={styles.priceTotalValue}>{formatPrice(total)}</Text></View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {items.length > 0 ? (
        <View style={styles.actionsBar}>
          <View style={styles.actionsTotal}><Text style={styles.actionsTotalLabel}>총 결제 금액</Text><Text style={styles.actionsTotalValue}>{formatPrice(total)}</Text></View>
          <TouchableOpacity style={[styles.checkoutBtn, !canCheckout && styles.checkoutBtnDisabled]} disabled={!canCheckout} onPress={() => {
            if (!canCheckout) return
            const selectedItems = items.filter((it) => selectedIds.includes(it.id)).map((it) => ({ id: it.id, title: it.title, price: it.price }))
            const order = { items: selectedItems, subtotal, promoDiscount, pointsDiscount, totalAmount: total, appliedPromoName: appliedPromo?.name, pointsUsed }
            ;(navigation as any).navigate('PaymentCheckoutPersonal', { order })
          }}><Text style={styles.checkoutBtnText}>결제하기</Text></TouchableOpacity>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { height: 60, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  section: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginHorizontal: 15, marginTop: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  pageTitle: { marginBottom: 8 },
  pageTitleText: { fontSize: 18, color: '#111827', fontWeight: '700' },
  pageSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 4 },

  emptyState: { alignItems: 'center', paddingVertical: 40, rowGap: 10 },
  emptyTitle: { fontSize: 16, color: '#111827', fontWeight: '700' },
  emptyDesc: { fontSize: 13, color: '#6B7280' },

  cartItem: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  itemCheckbox: { width: 28, alignItems: 'center' },
  itemImageBox: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  itemImage: { width: 80, height: 80 },
  itemTitle: { fontSize: 15, color: '#111827', fontWeight: '700' },
  itemInstructor: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  itemMetaRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12, flexWrap: 'wrap', marginTop: 6 },
  metaTag: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  metaTagText: { fontSize: 12, color: '#6B7280' },
  itemPrice: { fontSize: 15, color: '#2563EB', fontWeight: '700', marginTop: 8 },
  removeBtn: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },

  summary: { backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', padding: 14, marginTop: 12 },
  summaryTitle: { fontSize: 14, color: '#111827', fontWeight: '700', marginBottom: 10 },
  couponItem: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  couponName: { fontSize: 13, color: '#111827', fontWeight: '600' },
  couponDiscount: { fontSize: 12, color: '#EF4444', marginTop: 4 },
  separatorRow: { flexDirection: 'row', alignItems: 'center', columnGap: 10, marginTop: 10 },
  separatorLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  separatorText: { fontSize: 12, color: '#6B7280' },
  promoInputRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#FFFFFF' },
  promoApplied: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: 8 },
  promoAppliedName: { fontSize: 13, color: '#111827', fontWeight: '600' },
  promoAppliedRemove: { fontSize: 13, color: '#EF4444', fontWeight: '700' },
  pointsRow: { rowGap: 8 },
  pointsAvailable: { fontSize: 13, color: '#6B7280' },
  pointsInputRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnLight: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  btnLightText: { fontSize: 13, color: '#374151', fontWeight: '600' },

  priceBox: { borderTopWidth: 1, borderTopColor: '#E5E7EB', marginTop: 12, paddingTop: 10, rowGap: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceLabel: { fontSize: 13, color: '#6B7280' },
  priceValue: { fontSize: 14, color: '#111827', fontWeight: '600' },
  discountText: { color: '#10B981' },
  priceTotal: { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  priceTotalLabel: { fontSize: 14, color: '#111827', fontWeight: '700' },
  priceTotalValue: { fontSize: 16, color: '#2563EB', fontWeight: '700' },

  actionsBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 12, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionsTotal: { },
  actionsTotalLabel: { fontSize: 12, color: '#6B7280' },
  actionsTotalValue: { fontSize: 16, color: '#2563EB', fontWeight: '700' },
  checkoutBtn: { backgroundColor: '#0066CC', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 24 },
  checkoutBtnDisabled: { backgroundColor: '#9CA3AF' },
  checkoutBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }
})
