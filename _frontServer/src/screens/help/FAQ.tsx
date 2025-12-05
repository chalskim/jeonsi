import React, { useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons'

type FAQItem = {
  id: string
  category: 'getting-started' | 'account' | 'expert' | 'service' | 'payment' | 'safety' | 'technical'
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    id: 'g1',
    category: 'getting-started',
    question: '전시(專時)는 어떤 서비스인가요?',
    answer:
      '전시(專時)는 전문가의 유휴시간을 기업이 필요할 때만 빌려 쓸 수 있는 파트타임/프리랜서 매칭 플랫폼입니다. 개발자, PM, 마케터, 재무 전문가 등 다양한 분야의 전문가들이 자신의 남는 시간을 등록하고, 기업은 필요한 만큼만 전문가를 고용하여 비용을 절감하고 효율적으로 업무를 처리할 수 있습니다.'
  },
  {
    id: 'g2',
    category: 'getting-started',
    question: '회원가입은 어떻게 하나요?',
    answer:
      "1. 홈페이지 상단의 '회원가입' 버튼을 클릭합니다.\n2. 이메일, 비밀번호, 기본 정보를 입력합니다.\n3. 전문가 또는 기업 중 본인의 유형을 선택합니다.\n4. 이용약관과 개인정보처리방침에 동의합니다.\n5. 이메일 인증을 완료하면 회원가입이 완료됩니다.\n전체 과정은 5분 이내에 완료할 수 있습니다."
  },
  {
    id: 'g3',
    category: 'getting-started',
    question: '전문가로 등록하려면 어떤 자격이 필요한가요?',
    answer:
      '전문가로 등록하기 위해서는 다음과 같은 자격이 필요합니다:\n• 해당 분야에서 3년 이상의 실무 경력\n• 포트폴리오 또는 실적 증명 가능\n• 신원 확인 및 자격증 검증\n• 플랫폼의 심사 기준 충족\n특정 자격증이 필수는 아니지만, 관련 자격증이나 인증을 보유하면 심사 시 가산점을 받을 수 있습니다.'
  },
  {
    id: 'a1',
    category: 'account',
    question: '프로필 정보는 어떻게 수정하나요?',
    answer:
      "1. 로그인 후 우측 상단의 프로필 아이콘을 클릭합니다.\n2. '마이페이지' → '프로필 관리'로 이동합니다.\n3. 수정하고 싶은 정보를 변경한 후 '저장하기' 버튼을 클릭합니다.\n4. 변경된 정보는 즉시 반영됩니다.\n기본 정보, 경력, 포트폴리오 등 모든 항목을 수정할 수 있습니다."
  },
  {
    id: 'a2',
    category: 'account',
    question: '비밀번호를 잊어버렸어요. 어떻게 찾나요?',
    answer:
      "로그인 페이지의 '비밀번호 찾기' 링크를 클릭하세요. 가입 시 등록한 이메일 주소를 입력하면 비밀번호 재설정 링크가 발송됩니다. 이메일로 받은 링크를 통해 새로운 비밀번호를 설정할 수 있습니다. 보안을 위해 재설정 링크는 24시간 동안만 유효합니다."
  },
  {
    id: 'a3',
    category: 'account',
    question: '계정을 삭제하고 싶어요.',
    answer:
      '계정 삭제는 마이페이지 → 설정 → 계정 관리에서 진행할 수 있습니다. 계정 삭제 시 모든 개인정보와 이용 기록이 삭제되며, 복구할 수 없으니 신중하게 결정해주세요. 진행 중인 계약이나 정산 예정 금액이 있는 경우, 먼저 해당 업무를 완료한 후 계정 삭제를 진행해야 합니다.'
  },
  {
    id: 'e1',
    category: 'expert',
    question: '전문가 시간 패키지는 어떻게 등록하나요?',
    answer:
      "1. 마이페이지 → '시간 패키지 관리'로 이동합니다.\n2. '새 패키지 추가' 버튼을 클릭합니다.\n3. 패키지명(예: 주 10시간 CMO 패키지), 제공 시간, 가격을 설정합니다.\n4. 포함되는 업무 범위와 커뮤니케이션 방식을 상세히 작성합니다.\n5. 가능한 시간대를 캘린더에서 선택하고 저장합니다.\n여러 개의 패키지를 등록하여 다양한 고객층에게 제공할 수 있습니다."
  },
  {
    id: 'e2',
    category: 'expert',
    question: '수수료는 얼마인가요?',
    answer:
      '전시 플랫폼의 수수료는 거래액의 15%입니다. 예를 들어, 100만원의 계약이 체결될 경우 전문가는 85만원을 수령하게 되며, 15만원은 플랫폼 수수료로 적용됩니다. 수수료에는 부가세가 포함되며, 세금계산서 발행 등 부가 서비스는 별도로 제공됩니다.'
  },
  {
    id: 'e3',
    category: 'expert',
    question: '정산은 언제, 어떻게 이루어지나요?',
    answer:
      '정산은 매월 15일에 전월 발생 수익에 대해 정산됩니다. 예를 들어, 1월 동안 발생한 수익은 2월 15일에 정산되며, 세금계산서 발행 후 익일 출금 처리됩니다. 정산 신청은 마이페이지 → \"정산 관리\"에서 할 수 있으며, 최소 10만원 이상부터 출금이 가능합니다.'
  },
  {
    id: 's1',
    category: 'service',
    question: '기업은 어떻게 전문가를 찾을 수 있나요?',
    answer:
      "1. 로그인 후 '전문가 찾기' 메뉴로 이동합니다.\n2. 필요한 분야, 경력, 예산 등 필터를 설정하여 검색합니다.\n3. 마음에 드는 전문가의 프로필을 상세히 확인합니다.\n4. '요청 보내기' 버튼을 클릭하여 협업을 제안합니다.\n5. 전문가가 수락하면 계약 체결 후 서비스를 시작할 수 있습니다.\nAI 추천 시스템을 통해 적합한 전문가를 자동으로 추천받을 수도 있습니다."
  },
  {
    id: 's2',
    category: 'service',
    question: '계약은 어떻게 체결하나요?',
    answer:
      '계약은 플랫폼 내에서 모두 디지털로 체결됩니다. 전문가와 기업 간 합의가 완료되면, 플랫폼에서 제공하는 표준 계약서를 확인하고 전자 서명으로 계약을 체결합니다. 계약서는 언제든 마이페이지에서 다운로드할 수 있으며, 법적 효력을 갖추고 있습니다.'
  }
]

export default function FAQ() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const scrollRef = useRef<ScrollView>(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | FAQItem['category']>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [faqY, setFaqY] = useState(0)

  const categories = useMemo(
    () => [
      { key: 'all', label: '전체' },
      { key: 'getting-started', label: '시작하기' },
      { key: 'account', label: '계정 관리' },
      { key: 'expert', label: '전문가' },
      { key: 'service', label: '서비스 이용' },
      { key: 'payment', label: '결제 및 정산' },
      { key: 'safety', label: '안전 및 보안' },
      { key: 'technical', label: '기술 문제' }
    ],
    []
  )

  const filtered = useMemo(() => {
    const items = faqData.filter((it) => (activeCategory === 'all' ? true : it.category === activeCategory))
    if (!search) return items
    const q = search.toLowerCase()
    return items.filter((it) => it.question.toLowerCase().includes(q) || it.answer.toLowerCase().includes(q))
  }, [activeCategory, search])

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

  const onQuickLink = (key: FAQItem['category']) => {
    setActiveCategory(key)
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: faqY - 12, animated: true })
    }, 50)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }] }>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>자주 묻는 질문</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>자주 묻는 질문</Text>
          <Text style={styles.heroSubtitle}>궁금한 점이 있으신가요? 빠르고 정확한 답변을 찾아보세요</Text>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="질문을 검색해보세요..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={(t) => {
                setSearch(t)
                if (t) setActiveCategory('all')
              }}
            />
            <View style={styles.searchButton}>
              <FontAwesome5 name="search" size={16} color="#6B7280" />
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onQuickLink('getting-started')}>
            <FontAwesome5 name="rocket" size={28} color="#10B981" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>시작하기</Text>
            <Text style={styles.cardDesc}>회원가입, 기본 사용법 등</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onQuickLink('account')}>
            <FontAwesome5 name="user-cog" size={28} color="#0EA5E9" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>계정 관리</Text>
            <Text style={styles.cardDesc}>프로필, 설정, 보안 등</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onQuickLink('payment')}>
            <FontAwesome5 name="credit-card" size={28} color="#F59E0B" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>결제 및 정산</Text>
            <Text style={styles.cardDesc}>결제수단, 수수료, 정산 등</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onQuickLink('safety')}>
            <FontAwesome5 name="shield-alt" size={28} color="#EF4444" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>안전 및 보안</Text>
            <Text style={styles.cardDesc}>개인정보, 보안 정책 등</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categories}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.key}
              style={[styles.catBtn, activeCategory === (c.key as any) && styles.catBtnActive]}
              activeOpacity={0.8}
              onPress={() => setActiveCategory(c.key as any)}
            >
              <Text style={[styles.catText, activeCategory === (c.key as any) && styles.catTextActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.faqSection} onLayout={(e) => setFaqY(e.nativeEvent.layout.y)}>
          {filtered.map((it) => {
            const isOpen = openId === it.id
            return (
              <View key={it.id} style={styles.faqItem}>
                <TouchableOpacity style={styles.faqQuestion} activeOpacity={0.85} onPress={() => setOpenId(isOpen ? null : it.id)}>
                  <Text style={styles.faqQuestionText}>{it.question}</Text>
                  <FontAwesome5 name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color={isOpen ? '#2563EB' : '#6B7280'} />
                </TouchableOpacity>
                {isOpen && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerContent}>{it.answer}</Text>
                  </View>
                )}
              </View>
            )
          })}
        </View>

        <View style={styles.contact}>
          <Text style={styles.contactTitle}>찾으시는 답변이 없으신가요?</Text>
          <Text style={styles.contactDesc}>전문 상담팀이 도와드리겠습니다</Text>
          <View style={styles.methods}>
            <View style={styles.method}>
              <FontAwesome5 name="comments" size={22} color="#2563EB" />
              <Text style={styles.methodTitle}>실시간 채팅</Text>
              <Text style={styles.methodInfo}>평일 9:00 - 18:00</Text>
            </View>
            <View style={styles.method}>
              <FontAwesome5 name="envelope" size={22} color="#2563EB" />
              <Text style={styles.methodTitle}>이메일 문의</Text>
              <Text style={styles.methodInfo}>support@jeonsi.com</Text>
            </View>
            <View style={styles.method}>
              <FontAwesome5 name="phone" size={22} color="#2563EB" />
              <Text style={styles.methodTitle}>전화 문의</Text>
              <Text style={styles.methodInfo}>1644-1234</Text>
            </View>
            <View style={styles.method}>
              <FontAwesome5 name="headset" size={22} color="#2563EB" />
              <Text style={styles.methodTitle}>1:1 문의</Text>
              <Text style={styles.methodInfo}>24시간 내 답변</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.contactBtn} activeOpacity={0.85} onPress={() => (navigation as any).navigate('InquiryRegistration', { prev: 'FAQ' }) }>
            <FontAwesome5 name="plus-circle" size={18} color="#FFFFFF" />
            <Text style={styles.contactBtnText}>1:1 문의하기</Text>
          </TouchableOpacity>
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
  content: { paddingBottom: 20 },
  hero: { paddingHorizontal: 20, paddingTop: 20 },
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 8 },
  heroSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 28, paddingHorizontal: 14, height: 44 },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },
  searchButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16 },
  card: { width: '48%', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#ececec', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 },
  cardIcon: { marginBottom: 10 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#6B7280' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, paddingTop: 16 },
  catBtn: { paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, backgroundColor: '#ffffff' },
  catBtnActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  catText: { fontSize: 12, color: '#374151' },
  catTextActive: { color: '#ffffff' },
  faqSection: { backgroundColor: '#ffffff', borderRadius: 12, marginHorizontal: 20, marginTop: 16, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  faqQuestion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  faqQuestionText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111827', paddingRight: 12 },
  faqAnswer: { paddingBottom: 12 },
  faqAnswerContent: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  contact: { backgroundColor: '#F9FAFB', borderRadius: 12, marginHorizontal: 20, marginTop: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  contactTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  contactDesc: { fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 12 },
  methods: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  method: { width: '48%', backgroundColor: '#ffffff', borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10 },
  methodTitle: { fontSize: 13, fontWeight: '600', color: '#111827', marginTop: 6 },
  methodInfo: { fontSize: 12, color: '#6B7280' },
  contactBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 8, backgroundColor: '#2563EB', borderRadius: 10, paddingVertical: 12, marginTop: 10 },
  contactBtnText: { fontSize: 14, fontWeight: '600', color: '#ffffff' }
})
