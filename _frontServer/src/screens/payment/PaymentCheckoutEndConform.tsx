import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ProductItem = { name: string; desc: string }
type PaymentSummary = { method: string; methodDesc?: string; timestamp: string; productAmount: number; platformFee: number; discount: number; total: number }
type SuccessParams = { orderNumber: string; products: ProductItem[]; summary: PaymentSummary; email?: string }

export default function PaymentCheckoutEndConform() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const p: SuccessParams = route.params?.payload || {
    orderNumber: 'ORD-2024120512345',
    products: [{ name: '스타트업 IR 자료 작성 지원', desc: '단기 프로젝트 의뢰 · 인노베이션랩' }],
    summary: { method: '신용카드', methodDesc: '삼성카드 ****1234', timestamp: '2024.12.05 14:32:15', productAmount: 3000000, platformFee: 150000, discount: 50000, total: 3100000 },
    email: 'example@email.com',
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(price)

  const goBackSmart = () => {
    if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
      ;(navigation as any).goBack()
      return
    }
    navigation.navigate('Home')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>결제 완료</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.successHeader}>
            <View style={styles.successIcon}><FontAwesome5 name="check" size={34} color="#FFFFFF" /></View>
            <Text style={styles.successTitle}>결제가 완료되었습니다</Text>
            <Text style={styles.successSub}>이용해 주셔서 감사합니다</Text>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.orderBox}>
              <Text style={styles.orderLabel}>주문번호</Text>
              <Text style={styles.orderNumber}>{p.orderNumber}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>구매 상품</Text>
              {p.products.map((it, i) => (
                <View key={`pd-${i}`} style={styles.productItem}>
                  <View style={styles.productIcon}><FontAwesome5 name="briefcase" size={18} color="#5B5FEF" /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>{it.name}</Text>
                    <Text style={styles.productDesc}>{it.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>결제 상세</Text>
              <View style={styles.infoRow}><Text style={styles.label}>결제 수단</Text><Text style={styles.value}>{p.summary.method}{p.summary.methodDesc ? ` (${p.summary.methodDesc})` : ''}</Text></View>
              <View style={styles.infoRow}><Text style={styles.label}>결제 일시</Text><Text style={styles.value}>{p.summary.timestamp}</Text></View>
              <View style={styles.infoRow}><Text style={styles.label}>상품 금액</Text><Text style={styles.value}>{formatPrice(p.summary.productAmount)}</Text></View>
              <View style={styles.infoRow}><Text style={styles.label}>플랫폼 수수료 (5%)</Text><Text style={styles.value}>{formatPrice(p.summary.platformFee)}</Text></View>
              <View style={styles.infoRow}><Text style={styles.label}>할인</Text><Text style={[styles.value, { color: '#EF4444' }]}>-{formatPrice(p.summary.discount)}</Text></View>
              <View style={[styles.infoRow, styles.totalRow]}><Text style={styles.totalLabel}>총 결제 금액</Text><Text style={styles.totalValue}>{formatPrice(p.summary.total)}</Text></View>
            </View>

            <View style={styles.notice}>
              <FontAwesome5 name="info-circle" size={16} color="#F59E0B" />
              <Text style={styles.noticeText}>결제 확인 이메일이 {p.email || ''} 으로 발송되었습니다. 세금계산서는 영수증 페이지에서 발급받으실 수 있습니다.</Text>
            </View>
          </View>

          <View style={styles.nextSteps}>
            <Text style={styles.nextTitle}>어디로 이동하시겠어요?</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={[styles.actionCard, styles.actionPrimary]} activeOpacity={0.85}>
                <View style={styles.actionIcon}><FontAwesome5 name="rocket" size={18} color="#FFFFFF" /></View>
                <Text style={styles.actionTitle}>프로젝트 대시보드로 이동</Text>
                <Text style={styles.actionDesc}>진행 상황을 확인하고 전문가와 소통하세요</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} activeOpacity={0.85}>
                <View style={[styles.actionIcon, { backgroundColor: '#FFFFFF' }]}><FontAwesome5 name="receipt" size={18} color="#5B5FEF" /></View>
                <Text style={styles.actionTitle}>영수증 보기</Text>
                <Text style={styles.actionDesc}>PDF 다운로드</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} activeOpacity={0.85}>
                <View style={[styles.actionIcon, { backgroundColor: '#FFFFFF' }]}><FontAwesome5 name="file-invoice" size={18} color="#5B5FEF" /></View>
                <Text style={styles.actionTitle}>세금계산서</Text>
                <Text style={styles.actionDesc}>발급 신청하기</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} activeOpacity={0.85}>
                <View style={[styles.actionIcon, { backgroundColor: '#FFFFFF' }]}><FontAwesome5 name="history" size={18} color="#5B5FEF" /></View>
                <Text style={styles.actionTitle}>결제 내역</Text>
                <Text style={styles.actionDesc}>전체 내역 보기</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} activeOpacity={0.85}>
                <View style={[styles.actionIcon, { backgroundColor: '#FFFFFF' }]}><FontAwesome5 name="undo" size={18} color="#5B5FEF" /></View>
                <Text style={styles.actionTitle}>환불/취소</Text>
                <Text style={styles.actionDesc}>정책 안내</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomLinks}>
            <TouchableOpacity activeOpacity={0.85} style={styles.bottomLink}><FontAwesome5 name="home" size={14} color="#6B7280" /><Text style={styles.bottomLinkText}>홈으로</Text></TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} style={styles.bottomLink}><FontAwesome5 name="headset" size={14} color="#6B7280" /><Text style={styles.bottomLinkText}>고객센터</Text></TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} style={styles.bottomLink}><FontAwesome5 name="question-circle" size={14} color="#6B7280" /><Text style={styles.bottomLinkText}>자주 묻는 질문</Text></TouchableOpacity>
          </View>
        </View>

        <Text style={styles.logo}>전시(專時) © 2024</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#667EEA' },
  header: { height: 60, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },

  content: { padding: 20, alignItems: 'center' },
  card: { width: '100%', maxWidth: 520, backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12 },

  successHeader: { backgroundColor: '#10B981', paddingVertical: 28, paddingHorizontal: 24, alignItems: 'center' },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontSize: 22, color: '#FFFFFF', fontWeight: '700' },
  successSub: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 6 },

  infoBox: { padding: 20 },
  orderBox: { alignItems: 'center', padding: 14, backgroundColor: '#F9FAFB', borderRadius: 12, marginBottom: 16 },
  orderLabel: { fontSize: 12, color: '#6B7280' },
  orderNumber: { fontSize: 18, color: '#1F2937', fontWeight: '700', fontFamily: 'Courier' },

  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, color: '#6B7280', fontWeight: '600', marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },

  productItem: { flexDirection: 'row', alignItems: 'center', columnGap: 14, padding: 12, backgroundColor: '#F9FAFB', borderRadius: 12, marginBottom: 10 },
  productIcon: { width: 48, height: 48, borderRadius: 10, backgroundColor: '#E8E9FF', alignItems: 'center', justifyContent: 'center' },
  productName: { fontSize: 15, color: '#1F2937', fontWeight: '600' },
  productDesc: { fontSize: 13, color: '#6B7280' },

  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  label: { fontSize: 14, color: '#6B7280' },
  value: { fontSize: 14, color: '#1F2937', fontWeight: '500' },
  totalRow: { borderTopWidth: 2, borderTopColor: '#E5E7EB', marginTop: 8, paddingTop: 12 },
  totalLabel: { fontSize: 16, color: '#1F2937', fontWeight: '700' },
  totalValue: { fontSize: 20, color: '#5B5FEF', fontWeight: '700' },

  notice: { flexDirection: 'row', alignItems: 'flex-start', columnGap: 10, padding: 12, backgroundColor: '#FEF3C7', borderRadius: 12 },
  noticeText: { flex: 1, fontSize: 13, color: '#92400E' },

  nextSteps: { paddingHorizontal: 20, paddingBottom: 20 },
  nextTitle: { fontSize: 15, color: '#1F2937', fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 12, justifyContent: 'center' },
  actionCard: { width: '48%', paddingVertical: 16, paddingHorizontal: 12, backgroundColor: '#F9FAFB', borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 12, alignItems: 'center' },
  actionPrimary: { width: '100%', backgroundColor: '#5B5FEF', borderColor: '#5B5FEF' },
  actionIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#E8E9FF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionTitle: { fontSize: 14, fontWeight: '600', color: '#111827' },
  actionDesc: { fontSize: 12, color: '#6B7280', marginTop: 4 },

  bottomLinks: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 24, paddingVertical: 16, backgroundColor: '#F9FAFB', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  bottomLink: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  bottomLinkText: { fontSize: 13, color: '#6B7280' },

  logo: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 16 }
})

