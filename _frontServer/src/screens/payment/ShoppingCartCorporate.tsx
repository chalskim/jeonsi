import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ExpertItem = {
  id: number
  name: string
  role: string
  skills: string[]
  rating: number
  reviewCount: number
  hourlyRate: number
  avatarUri: string
}

type CouponOption = { id: string; name: string; type: 'percentage' | 'fixed'; value: number }

export default function ShoppingCartCorporate() {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()

  const initialExperts = useMemo<ExpertItem[]>(() => ([
    { id: 1, name: '김보안 전문가', role: '보안 컨설턴트 | 10년 경력', skills: ['ISMS-P', '침해대응', '보안 아키텍처'], rating: 4.8, reviewCount: 23, hourlyRate: 150000, avatarUri: 'https://picsum.photos/seed/expert1/120/120.jpg' },
    { id: 2, name: '이클라우드 전문가', role: '클라우드 아키텍트 | 8년 경력', skills: ['AWS', 'Azure', 'DevOps'], rating: 4.9, reviewCount: 31, hourlyRate: 180000, avatarUri: 'https://picsum.photos/seed/expert2/120/120.jpg' },
    { id: 3, name: '박데이터 전문가', role: '데이터 분석가 | 7년 경력', skills: ['데이터 분석', 'Python', '머신러닝'], rating: 4.7, reviewCount: 18, hourlyRate: 140000, avatarUri: 'https://picsum.photos/seed/expert3/120/120.jpg' }
  ]), [])

  const couponOptions = useMemo<CouponOption[]>(() => ([
    { id: 'corp-1', name: '신규 기업 할인 쿠폰', type: 'percentage', value: 10 },
    { id: 'corp-2', name: '대량 할인 쿠폰', type: 'fixed', value: 50000 }
  ]), [])

  const [experts, setExperts] = useState<ExpertItem[]>(initialExperts)
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 3])
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [teamName, setTeamName] = useState('보안 강화 프로젝트팀')
  const [teamMembers, setTeamMembers] = useState<ExpertItem[]>(initialExperts)
  const [couponCode, setCouponCode] = useState('')
  const [selectedCoupon, setSelectedCoupon] = useState<CouponOption | null>(couponOptions[0])
  const [pointsUsed, setPointsUsed] = useState(0)
  const pointsAvailable = 25000
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'cash'>('card')

  const monthlyHours = 160

  const formatPrice = (price: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(price)
  const formatNumber = (n: number) => new Intl.NumberFormat('ko-KR').format(n)

  const selectedExperts = useMemo(() => experts.filter((e) => selectedIds.includes(e.id)), [experts, selectedIds])
  const baseAmount = useMemo(() => selectedExperts.reduce((sum, e) => sum + e.hourlyRate * monthlyHours, 0), [selectedExperts])
  const couponDiscount = useMemo(() => {
    if (!selectedCoupon) return 0
    if (selectedCoupon.type === 'percentage') return Math.floor(baseAmount * (selectedCoupon.value / 100))
    return Math.min(selectedCoupon.value, baseAmount)
  }, [selectedCoupon, baseAmount])
  const remainingAfterCoupon = Math.max(0, baseAmount - couponDiscount)
  const pointsDiscount = Math.min(pointsUsed, remainingAfterCoupon)
  const total = Math.max(0, baseAmount - couponDiscount - pointsDiscount)

  const goBackSmart = () => {
    if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
      ;(navigation as any).goBack()
      return
    }
    navigation.navigate('Home')
  }

  const toggleAllSelected = () => {
    if (selectedIds.length === experts.length) setSelectedIds([])
    else setSelectedIds(experts.map((e) => e.id))
  }

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleFavorite = (id: number) => {
    setFavoriteIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const addToTeamAlert = (name: string) => {
    Alert.alert('팀', `${name}을(를) 팀에 추가했습니다.`)
  }

  const clearCart = () => {
    setSelectedIds([])
  }

  const removeTeamMember = (id: number) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const applyCouponCode = () => {
    const code = couponCode.trim()
    if (!code) {
      Alert.alert('안내', '쿠폰 코드를 입력해주세요.')
      return
    }
    setSelectedCoupon({ id: 'manual-' + Date.now(), name: code, type: 'percentage', value: 10 })
    setCouponCode('')
  }

  const setPointsToMax = () => {
    setPointsUsed(pointsAvailable)
  }

  const onChangePoints = (txt: string) => {
    const v = Math.max(0, Math.min(Number(txt.replace(/[^0-9]/g, '')) || 0, pointsAvailable))
    setPointsUsed(v)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="bars" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>기업 장바구니</Text>
        <View style={styles.headerIcons}>
          <View style={styles.headerBadgeIcon}><FontAwesome5 name="bell" size={18} color="#6B7280" /><View style={styles.badgeBubble}><Text style={styles.badgeText}>3</Text></View></View>
          <View style={styles.headerIcon}><FontAwesome5 name="user-circle" size={20} color="#6B7280" /></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>기업 장바구니</Text>
          <View style={{ flexDirection: 'row', columnGap: 10 }}>
            <TouchableOpacity style={styles.btnOutline} onPress={clearCart}><Text style={styles.btnOutlineText}>비우기</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('ExpertsList')}><Text style={styles.btnPrimaryText}>전문가 찾기</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.containerPad}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}><FontAwesome5 name="bookmark" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>관심 전문가</Text><View style={styles.countBadge}><Text style={styles.countBadgeText}>{experts.length}</Text></View></View>
              <TouchableOpacity style={styles.btnOutlineSm} onPress={toggleAllSelected}><Text style={styles.btnOutlineText}>전체 선택</Text></TouchableOpacity>
            </View>

            {experts.map((ex) => (
              <View key={`ex-${ex.id}`} style={styles.card}>
                <TouchableOpacity style={styles.cardCheckbox} onPress={() => toggleSelected(ex.id)}>
                  <FontAwesome5 name={selectedIds.includes(ex.id) ? 'check-square' : 'square'} size={18} color={selectedIds.includes(ex.id) ? '#2563EB' : '#9CA3AF'} />
                </TouchableOpacity>
                <Image source={{ uri: ex.avatarUri }} style={styles.avatar} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text numberOfLines={1} style={styles.expertName}>{ex.name}</Text>
                  <Text numberOfLines={1} style={styles.expertRole}>{ex.role}</Text>
                  <View style={styles.skillRow}>{ex.skills.map((s, i) => (<View key={`sk-${ex.id}-${i}`} style={styles.skillTag}><Text style={styles.skillTagText}>{s}</Text></View>))}</View>
                  <View style={styles.ratingRow}><FontAwesome5 name="star" size={12} color="#F59E0B" /><Text style={styles.ratingText}>{ex.rating.toFixed(1)}</Text><Text style={styles.ratingCountText}>({formatNumber(ex.reviewCount)}개 리뷰)</Text></View>
                  <Text style={styles.expertPrice}>시간당 {formatPrice(ex.hourlyRate)}</Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.btnIcon} onPress={() => toggleFavorite(ex.id)}>
                    <FontAwesome5 name={favoriteIds.includes(ex.id) ? 'heart' : 'heart'} size={18} color={favoriteIds.includes(ex.id) ? '#EF4444' : '#6B7280'} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnIcon} onPress={() => addToTeamAlert(ex.name)}>
                    <FontAwesome5 name="plus" size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="users" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>팀 빌딩</Text></View><TouchableOpacity style={styles.btnOutlineSm}><Text style={styles.btnOutlineText}>팀 저장</Text></TouchableOpacity></View>
            <View style={styles.teamBox}>
              <View style={styles.teamHeader}><Text style={styles.teamTitle}>{teamName}</Text><View style={{ flexDirection: 'row', columnGap: 8 }}><TouchableOpacity style={styles.btnOutlineSm}><Text style={styles.btnOutlineText}>수정</Text></TouchableOpacity><TouchableOpacity style={styles.btnOutlineSm}><Text style={styles.btnOutlineText}>삭제</Text></TouchableOpacity></View></View>
              <Text style={styles.teamDesc}>클라우드 환경의 보안 강화를 위한 전문가 팀 구성</Text>
              <View style={styles.membersRow}>
                {teamMembers.map((m) => (
                  <View key={`tm-${m.id}`} style={styles.member}>
                    <Image source={{ uri: m.avatarUri }} style={styles.memberAvatar} />
                    <Text numberOfLines={1} style={styles.memberName}>{m.name}</Text>
                    <Text numberOfLines={1} style={styles.memberRole}>{m.role.split('|')[0].trim()}</Text>
                    <TouchableOpacity style={styles.memberRemove} onPress={() => removeTeamMember(m.id)}><FontAwesome5 name="times" size={12} color="#FFFFFF" /></TouchableOpacity>
                  </View>
                ))}
                <View style={styles.member}>
                  <View style={[styles.memberAvatar, { backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }]}>
                    <FontAwesome5 name="plus" size={16} color="#9CA3AF" />
                  </View>
                  <Text style={styles.memberName}>전문가 추가</Text>
                </View>
              </View>
              <Text style={styles.teamPrice}>총 예상 비용: {formatPrice(selectedExperts.reduce((sum, e) => sum + e.hourlyRate * monthlyHours, 0))} (주 40시간)</Text>
            </View>
            <TouchableOpacity style={[styles.btnOutline, { width: '100%', marginTop: 8 }]}><Text style={styles.btnOutlineText}><FontAwesome5 name="plus" size={12} color="#374151" /> 새 팀 만들기</Text></TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="ticket-alt" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>쿠폰 및 포인트</Text></View></View>
            <View style={styles.couponBox}>
              <View style={styles.couponInputRow}><TextInput style={[styles.input, { flex: 1 }]} value={couponCode} onChangeText={setCouponCode} placeholder="쿠폰 코드를 입력하세요" /><TouchableOpacity style={styles.btnPrimary} onPress={applyCouponCode}><Text style={styles.btnPrimaryText}>적용</Text></TouchableOpacity></View>
              <View style={{ marginTop: 12 }}>
                <Text style={styles.subTitle}>사용 가능한 쿠폰</Text>
                {couponOptions.map((c) => (
                  <TouchableOpacity key={`co-${c.id}`} style={styles.couponItem} activeOpacity={0.8} onPress={() => setSelectedCoupon(c)}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.couponName}>{c.name}</Text>
                      <Text style={styles.couponDesc}>{c.type === 'percentage' ? `첫 결제 시 ${c.value}% 할인` : `월 100만원 이상 결제 시 ${formatPrice(c.value)} 할인`}</Text>
                    </View>
                    <Text style={styles.couponValue}>{c.type === 'percentage' ? `${c.value}% 할인` : `${formatPrice(c.value)} 할인`}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ marginTop: 12 }}>
                <Text style={styles.subTitle}>포인트</Text>
                <View style={styles.priceRow}><Text style={styles.priceLabel}>보유 포인트</Text><Text style={styles.priceValue}>{formatNumber(pointsAvailable)}P</Text></View>
                <View style={styles.priceRow}><Text style={styles.priceLabel}>사용 포인트</Text><View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}><TextInput style={[styles.input, { width: 100, textAlign: 'right' }]} keyboardType="numeric" value={String(pointsUsed)} onChangeText={onChangePoints} /><TouchableOpacity style={styles.btnLight} onPress={setPointsToMax}><Text style={styles.btnLightText}>전액</Text></TouchableOpacity></View></View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="calculator" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>예상 금액</Text></View></View>
            <View style={styles.summaryBox}>
              <View style={styles.priceRow}><Text style={styles.priceLabel}>선택된 전문가</Text><Text style={styles.priceValue}>{selectedExperts.length}명</Text></View>
              <View style={styles.priceRow}><Text style={styles.priceLabel}>기본 금액</Text><Text style={styles.priceValue}>{formatPrice(baseAmount)}</Text></View>
              {couponDiscount > 0 ? (<View style={styles.priceRow}><Text style={styles.priceLabel}>쿠폰 할인</Text><Text style={[styles.priceValue, styles.discountText]}>-{formatPrice(couponDiscount)}</Text></View>) : null}
              {pointsDiscount > 0 ? (<View style={styles.priceRow}><Text style={styles.priceLabel}>포인트 사용</Text><Text style={[styles.priceValue, styles.discountText]}>-{formatPrice(pointsDiscount)}</Text></View>) : null}
              <View style={[styles.priceRow, styles.totalRow]}><Text style={styles.totalLabel}>총 결제 금액</Text><Text style={styles.totalValue}>{formatPrice(total)}</Text></View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}><View style={styles.sectionTitleRow}><FontAwesome5 name="credit-card" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>결제 정보</Text></View></View>
            <View style={styles.paymentBox}>
              <View style={styles.paymentMethods}>
                <TouchableOpacity style={[styles.paymentMethod, paymentMethod === 'card' && styles.paymentMethodOn]} onPress={() => setPaymentMethod('card')}><FontAwesome5 name="credit-card" size={16} color="#2563EB" /><Text style={styles.paymentMethodText}>카드 결제</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.paymentMethod, paymentMethod === 'bank' && styles.paymentMethodOn]} onPress={() => setPaymentMethod('bank')}><FontAwesome5 name="university" size={16} color="#2563EB" /><Text style={styles.paymentMethodText}>계좌 이체</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.paymentMethod, paymentMethod === 'cash' && styles.paymentMethodOn]} onPress={() => setPaymentMethod('cash')}><FontAwesome5 name="file-invoice" size={16} color="#2563EB" /><Text style={styles.paymentMethodText}>현금 영수증</Text></TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.payBtn} onPress={() => navigation.navigate('PaymentCheckoutCorporate', { total, pointsDiscount, couponDiscount, pointsUsed, couponCode } as never)}><Text style={styles.payBtnText}>{formatPrice(total)} 결제하기</Text></TouchableOpacity>
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
  headerIcons: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  headerBadgeIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badgeBubble: { position: 'absolute', top: 6, right: 6, backgroundColor: '#EF4444', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },

  pageHeader: { paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },

  containerPad: { padding: 15 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  countBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: '#F3F4F6', marginLeft: 8 },
  countBadgeText: { fontSize: 12, color: '#6B7280' },

  card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'center', columnGap: 12, marginBottom: 10 },
  cardCheckbox: { width: 28, alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  expertName: { fontSize: 15, color: '#111827', fontWeight: '700' },
  expertRole: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  skillRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 6, rowGap: 6, marginTop: 6 },
  skillTag: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  skillTagText: { fontSize: 12, color: '#6B7280' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  ratingText: { fontSize: 13, color: '#F59E0B', fontWeight: '700' },
  ratingCountText: { fontSize: 12, color: '#374151' },
  expertPrice: { fontSize: 14, color: '#2563EB', fontWeight: '700', marginTop: 6 },
  cardActions: { flexDirection: 'column', alignItems: 'center', rowGap: 6 },
  btnIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },

  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnOutlineSm: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 13, fontWeight: '600' },
  btnLight: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  btnLightText: { fontSize: 13, color: '#374151', fontWeight: '600' },

  teamBox: { backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', padding: 14 },
  teamHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teamTitle: { fontSize: 15, color: '#111827', fontWeight: '700' },
  teamDesc: { fontSize: 13, color: '#6B7280', marginTop: 8 },
  membersRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 12, rowGap: 12, marginTop: 12 },
  member: { width: 90, alignItems: 'center' },
  memberAvatar: { width: 60, height: 60, borderRadius: 30 },
  memberName: { fontSize: 12, color: '#111827', marginTop: 6 },
  memberRole: { fontSize: 11, color: '#6B7280' },
  memberRemove: { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  teamPrice: { fontSize: 13, color: '#2563EB', fontWeight: '700', marginTop: 12 },

  couponBox: { backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', padding: 14 },
  couponInputRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  subTitle: { fontSize: 14, color: '#111827', fontWeight: '700' },
  couponItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 8 },
  couponName: { fontSize: 13, color: '#111827', fontWeight: '600' },
  couponDesc: { fontSize: 12, color: '#6B7280' },
  couponValue: { fontSize: 13, color: '#2563EB', fontWeight: '700' },

  summaryBox: { backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', padding: 14 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  priceLabel: { fontSize: 13, color: '#6B7280' },
  priceValue: { fontSize: 14, color: '#111827', fontWeight: '600' },
  discountText: { color: '#10B981' },
  totalRow: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  totalLabel: { fontSize: 14, color: '#111827', fontWeight: '700' },
  totalValue: { fontSize: 16, color: '#2563EB', fontWeight: '700' },

  paymentBox: { backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', padding: 14 },
  paymentMethods: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 8, rowGap: 8 },
  paymentMethod: { flexDirection: 'row', alignItems: 'center', columnGap: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  paymentMethodOn: { borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.1)' },
  paymentMethodText: { fontSize: 13, color: '#111827' },
  payBtn: { width: '100%', backgroundColor: '#0066CC', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  payBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#FFFFFF' },

  fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#0066CC', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }
})

