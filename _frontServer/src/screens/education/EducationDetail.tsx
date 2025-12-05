import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type TabKey = 'overview' | 'curriculum' | 'schedule' | 'reviews' | 'related'

type TextbookItem = { id: number; name: string; price: number; selected: boolean; qty: number }

export default function EducationDetail() {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()

  const title = '실무 중심의 클라우드 보안 전문가 과정'
  const major = { code: 'ED', name: '교육/강의' }
  const minor = { code: 'ED04', name: '자격증/실무' }
  const badges = ['신규', '온라인', '8주 과정']
  const instructor = '김보안 강사'
  const instructorTitle = '클라우드 보안 전문가'
  const instructorBio = '클라우드 보안 체계 구축과 감사 프로젝트를 다수 수행했습니다. 위협 모델링과 접근 제어, DevSecOps 기반 보안 자동화를 실무 사례로 안내합니다.'
  const dateRange = '2024.03.01 ~ 2024.04.26'
  const capacity = 20
  const enrolled = 12
  const price = 1200000

  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [textbooks, setTextbooks] = useState<TextbookItem[]>([
    { id: 1, name: '실전 클라우드 보안 (2024 개정판)', price: 35000, selected: true, qty: 1 },
    { id: 2, name: '클라우드 보안 사례집', price: 28000, selected: false, qty: 1 },
  ])

  const textbookTotal = useMemo(() => {
    return textbooks.reduce((sum, t) => sum + (t.selected ? t.price * t.qty : 0), 0)
  }, [textbooks])

  const toggleTextbook = (id: number) => {
    setTextbooks((prev) => prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t)))
  }

  const changeQty = (id: number, diff: number) => {
    setTextbooks((prev) => prev.map((t) => (t.id === id ? { ...t, qty: Math.max(1, t.qty + diff) } : t)))
  }

  const formatPrice = (n: number) => `₩${n.toLocaleString('ko-KR')}`

  const curriculum = [
    { title: '오리엔테이션 및 과정 소개', desc: '과정 운영 방식과 목표를 안내합니다.' },
    { title: '핵심 개념 및 실습', desc: '클라우드 보안 핵심 개념과 실습을 진행합니다.' },
    { title: '프로젝트', desc: '팀 프로젝트로 실무 문제를 해결합니다.' },
  ]

  const schedule = [
    { month: '03', day: '01', title: '오리엔테이션', time: '19:00 - 20:00' },
    { month: '03', day: '08', title: '클라우드 위협 모델링', time: '19:00 - 22:00' },
    { month: '03', day: '15', title: 'IAM 및 접근 제어', time: '19:00 - 22:00' },
  ]

  const targets = [
    '클라우드 보안 직무로 전환을 희망하는 주니어 개발자',
    '클라우드 인프라 운영 중 보안 체계를 강화하려는 엔지니어',
    '기업 내 보안 체계를 수립해야 하는 실무 담당자',
  ]

  const objectives = [
    '클라우드 보안 핵심 개념과 위협 모델 이해',
    'IAM/네트워크/데이터 보호 정책 설계 능력 강화',
    '프로젝트 기반 보안 대응 프로세스 구축',
  ]

  const reviews = [
    { name: '홍길동', date: '2024-04-28', rating: 5, comment: '실무 사례가 많아 큰 도움이 되었습니다.' },
    { name: '김영희', date: '2024-04-25', rating: 4, comment: '기초부터 정리가 잘 되어 있습니다.' },
  ]

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          activeOpacity={0.8}
          onPress={() => {
            if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
              ;(navigation as any).goBack()
              return
            }
            navigation.navigate('EducationsList')
          }}
        >
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>교육 상세</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8}>
          <FontAwesome5 name="share-alt" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.heroActions}>
              <TouchableOpacity style={styles.circleBtn} activeOpacity={0.85}><FontAwesome5 name="bookmark" size={16} color="#374151" /></TouchableOpacity>
              <TouchableOpacity style={styles.circleBtn} activeOpacity={0.85}><FontAwesome5 name="share-alt" size={16} color="#374151" /></TouchableOpacity>
            </View>
          </View>

          <View style={styles.classificationRow}>
            <View style={[styles.classBadge, styles.classMajor]}>
              <Text style={styles.classCode}>{major.code}</Text>
              <Text style={styles.classText}>{major.name}</Text>
            </View>
            <View style={[styles.classBadge, styles.classMinor]}>
              <Text style={styles.classCode}>{minor.code}</Text>
              <Text style={styles.classText}>{minor.name}</Text>
            </View>
          </View>

          <View style={styles.badgeRow}>
            {badges.map((b) => (
              <View key={`badge-${b}`} style={[styles.badge, b === '신규' ? styles.badgeNew : b === '온라인' ? styles.badgeOnline : styles.badgeDefault]}>
                <Text style={styles.badgeText}>{b}</Text>
              </View>
            ))}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}><FontAwesome5 name="user-tie" size={12} color="#2563EB" /><Text style={styles.metaText}>{instructor}</Text></View>
            <View style={styles.metaItem}><FontAwesome5 name="calendar-alt" size={12} color="#2563EB" /><Text style={styles.metaText}>{dateRange}</Text></View>
            <View style={styles.metaItem}><FontAwesome5 name="users" size={12} color="#2563EB" /><Text style={styles.metaText}>정원 {capacity}명 (신청 {enrolled}명)</Text></View>
          </View>

          <Text style={styles.price}>{formatPrice(price)}</Text>

          <View style={styles.textbookList}>
            {textbooks.map((t) => (
              <View key={`tb-${t.id}`} style={styles.textbookItem}>
                <TouchableOpacity style={[styles.checkbox, t.selected && styles.checkboxOn]} activeOpacity={0.85} onPress={() => toggleTextbook(t.id)}>
                  {t.selected ? <FontAwesome5 name="check" size={12} color="#FFFFFF" /> : null}
                </TouchableOpacity>
                <Text style={styles.textbookName}>{t.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(t.id, -1)}><FontAwesome5 name="minus" size={10} color="#374151" /></TouchableOpacity>
                  <Text style={styles.qtyText}>{t.qty}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(t.id, 1)}><FontAwesome5 name="plus" size={10} color="#374151" /></TouchableOpacity>
                </View>
                <Text style={styles.textbookPrice}>{formatPrice(t.price)}</Text>
              </View>
            ))}
            <Text style={styles.textbookTotal}>교재 총액: {formatPrice(textbookTotal)}</Text>
          </View>

          <TouchableOpacity style={styles.applyBtn} activeOpacity={0.85} onPress={() => navigation.navigate('ShortTermRequestsInput')}> 
            <Text style={styles.applyBtnText}>신청하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><FontAwesome5 name="user-circle" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>강사 소개</Text></View>
          <View style={styles.instructorRow}>
            <View style={styles.instructorAvatar}><Text style={styles.instructorAvatarText}>{instructor.slice(0, 1)}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.instructorName}>{instructor}</Text>
              <Text style={styles.instructorTitle}>{instructorTitle}</Text>
              <Text style={styles.instructorBio}>{instructorBio}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.tabNav}>
            {[
              { key: 'overview', label: '개요' },
              { key: 'curriculum', label: '커리큘럼' },
              { key: 'schedule', label: '일정' },
              { key: 'reviews', label: '리뷰' },
              { key: 'related', label: '관련 교육' },
            ].map((t) => (
              <TouchableOpacity key={`tab-${t.key}`} style={[styles.tabBtn, activeTab === (t.key as TabKey) && styles.tabBtnActive]} onPress={() => setActiveTab(t.key as TabKey)}>
                <Text style={[styles.tabBtnText, activeTab === (t.key as TabKey) && styles.tabBtnTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'overview' ? (
            <View>
              <View style={styles.sectionHeaderRow}><FontAwesome5 name="info-circle" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>과정 소개</Text></View>
              <Text style={styles.bodyText}>클라우드 환경 보안 위협과 대응을 실무 중심으로 학습하는 전문가 과정입니다. 사례 기반으로 운영되며 프로젝트를 통해 실무 역량을 강화합니다.</Text>
              <View style={styles.sectionHeaderRow}><FontAwesome5 name="bullseye" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>대상</Text></View>
              {targets.map((v, i) => (
                <View key={`target-${i}`} style={{ flexDirection: 'row', alignItems: 'flex-start', columnGap: 8, marginBottom: 8 }}>
                  <FontAwesome5 name="check-circle" size={14} color="#2563EB" />
                  <Text style={styles.bodyText}>{v}</Text>
                </View>
              ))}
              <View style={styles.sectionHeaderRow}><FontAwesome5 name="flag-checkered" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>학습 목표</Text></View>
              {objectives.map((v, i) => (
                <View key={`obj-${i}`} style={{ flexDirection: 'row', alignItems: 'flex-start', columnGap: 8, marginBottom: 8 }}>
                  <FontAwesome5 name="check" size={14} color="#2563EB" />
                  <Text style={styles.bodyText}>{v}</Text>
                </View>
              ))}
              <View style={styles.sectionHeaderRow}><FontAwesome5 name="book" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>교재 안내</Text></View>
              <View style={{ rowGap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', columnGap: 8 }}>
                  <FontAwesome5 name="dot-circle" size={12} color="#2563EB" />
                  <Text style={styles.bodyText}>교재는 선택 사항이며, 상단에서 선택/수량 변경 후 총액을 확인할 수 있습니다.</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', columnGap: 8 }}>
                  <FontAwesome5 name="dot-circle" size={12} color="#2563EB" />
                  <Text style={styles.bodyText}>결제 시 교재 총액이 과정 수강료와 함께 합산됩니다.</Text>
                </View>
              </View>
            </View>
          ) : null}

          {activeTab === 'curriculum' ? (
            <View>
              <View style={styles.sectionHeaderRow}><FontAwesome5 name="list-ol" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>커리큘럼 미리보기</Text></View>
              {curriculum.map((c, idx) => (
                <View key={`cur-${idx}`} style={styles.curItem}>
                  <View style={styles.curNumber}><Text style={styles.curNumberText}>{idx + 1}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.curTitle}>{c.title}</Text>
                    <Text style={styles.curDesc}>{c.desc}</Text>
                  </View>
                </View>
              ))}
              <View style={{ alignItems: 'center', marginTop: 8 }}>
                <TouchableOpacity activeOpacity={0.85}><Text style={styles.linkText}>더 보기</Text></TouchableOpacity>
              </View>
            </View>
          ) : null}

          {activeTab === 'schedule' ? (
            <View>
              <View style={styles.sectionHeaderRow}><FontAwesome5 name="calendar-alt" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>일정 미리보기</Text></View>
              {schedule.map((s, idx) => (
                <View key={`sch-${idx}`} style={styles.schItem}>
                  <View style={styles.schDate}><Text style={styles.schMonth}>{s.month}</Text><Text style={styles.schDay}>{s.day}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.schTitle}>{s.title}</Text>
                    <Text style={styles.schTime}>{s.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {activeTab === 'reviews' ? (
            <View>
              <View style={styles.reviewSummary}>
                <Text style={styles.reviewRating}>4.8</Text>
                <View style={styles.reviewStars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FontAwesome5 key={`star-${i}`} name="star" size={14} color={i < 5 ? '#F59E0B' : '#D1D5DB'} />
                  ))}
                </View>
                <Text style={styles.reviewCount}>36개 리뷰</Text>
              </View>
              {reviews.map((r, idx) => (
                <View key={`rev-${idx}`} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <View style={styles.reviewerAvatar}><Text style={styles.reviewerAvatarText}>{r.name.slice(0, 1)}</Text></View>
                      <Text style={styles.reviewerName}>{r.name}</Text>
                    </View>
                    <Text style={styles.reviewDate}>{r.date}</Text>
                  </View>
                  <Text style={styles.reviewContent}>{r.comment}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {activeTab === 'related' ? (
            <View>
              <View style={styles.sectionHeaderRow}><FontAwesome5 name="link" size={16} color="#2563EB" /><Text style={styles.sectionTitle}>관련 교육</Text></View>
              <View style={styles.relatedGrid}>
                {[
                  { title: '클라우드 보안 심화', instructor: '김보안', price: 980000 },
                  { title: '보안 감사 실무', instructor: '이감사', price: 880000 },
                  { title: '네트워크 보안', instructor: '박네트', price: 790000 },
                  { title: 'DevSecOps 입문', instructor: '최데브', price: 920000 },
                ].map((c, idx) => (
                  <TouchableOpacity key={`rel-${idx}`} style={styles.relCard} activeOpacity={0.9}>
                    <View style={styles.relImage}><FontAwesome5 name="shield-alt" size={20} color="#FFFFFF" /></View>
                    <View style={styles.relContent}>
                      <Text style={styles.relTitle}>{c.title}</Text>
                      <Text style={styles.relInstructor}>{c.instructor}</Text>
                      <Text style={styles.relPrice}>{formatPrice(c.price)}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => navigation.navigate('ShortTermRequestsInput')}>
        <FontAwesome5 name="paper-plane" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#dee2e6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  hero: { backgroundColor: '#FFFFFF', padding: 16, marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  heroHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 },
  heroActions: { flexDirection: 'row', columnGap: 8 },
  circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },

  title: { fontSize: 18, fontWeight: '700', color: '#111827' },

  classificationRow: { flexDirection: 'row', columnGap: 8, flexWrap: 'wrap', marginTop: 8 },
  classBadge: { flexDirection: 'row', alignItems: 'center', columnGap: 6, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1 },
  classMajor: { backgroundColor: 'rgba(37,99,235,0.08)', borderColor: '#2563EB' },
  classMinor: { backgroundColor: 'rgba(23,162,184,0.1)', borderColor: '#17a2b8' },
  classCode: { fontSize: 12, fontWeight: '700', color: '#111827' },
  classText: { fontSize: 12, color: '#374151', fontWeight: '700' },

  badgeRow: { flexDirection: 'row', columnGap: 8, flexWrap: 'wrap', marginTop: 10 },
  badge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14 },
  badgeNew: { backgroundColor: '#28a745' },
  badgeOnline: { backgroundColor: '#17a2b8' },
  badgeDefault: { backgroundColor: '#F3F4F6' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  metaRow: { flexDirection: 'row', columnGap: 16, flexWrap: 'wrap', marginTop: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  metaText: { fontSize: 12, color: '#6B7280' },

  price: { fontSize: 16, fontWeight: '700', color: '#2563EB', marginTop: 12 },

  textbookList: { marginTop: 8 },
  textbookItem: { flexDirection: 'row', alignItems: 'center', columnGap: 10, padding: 10, backgroundColor: '#F8FAFC', borderRadius: 8, marginBottom: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  textbookName: { flexShrink: 1, fontSize: 13, color: '#374151', fontWeight: '600' },
  qtyBtn: { width: 22, height: 22, borderRadius: 6, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  qtyText: { width: 26, textAlign: 'center', fontSize: 12, color: '#374151' },
  textbookPrice: { marginLeft: 8, fontSize: 13, color: '#2563EB', fontWeight: '700' },
  textbookTotal: { marginTop: 6, fontSize: 13, fontWeight: '700', textAlign: 'right', color: '#374151' },

  applyBtn: { marginTop: 12, backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  applyBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  section: { backgroundColor: '#FFFFFF', marginTop: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },

  tabNav: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 12 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 12, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: '#2563EB' },
  tabBtnText: { fontSize: 13, fontWeight: '700', color: '#374151' },
  tabBtnTextActive: { color: '#2563EB' },

  bodyText: { fontSize: 13, color: '#374151' },

  curItem: { flexDirection: 'row', alignItems: 'flex-start', columnGap: 8, padding: 10, backgroundColor: '#F8FAFC', borderRadius: 8, marginBottom: 8 },
  curNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  curNumberText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  curTitle: { fontSize: 13, fontWeight: '700', color: '#111827' },
  curDesc: { fontSize: 12, color: '#6B7280' },
  linkText: { color: '#2563EB', fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },

  schItem: { flexDirection: 'row', alignItems: 'center', columnGap: 10, padding: 10, backgroundColor: '#F8FAFC', borderRadius: 8, marginBottom: 8 },
  schDate: { alignItems: 'center', borderRadius: 8, backgroundColor: '#2563EB', paddingVertical: 6, paddingHorizontal: 10, minWidth: 60 },
  schMonth: { fontSize: 10, color: '#FFFFFF' },
  schDay: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  schTitle: { fontSize: 13, fontWeight: '700', color: '#111827' },
  schTime: { fontSize: 12, color: '#6B7280' },

  reviewSummary: { flexDirection: 'row', alignItems: 'center', columnGap: 12, marginBottom: 12 },
  reviewRating: { fontSize: 24, fontWeight: '700', color: '#111827' },
  reviewStars: { flexDirection: 'row', columnGap: 4 },
  reviewCount: { fontSize: 12, color: '#6B7280' },
  reviewItem: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  reviewerInfo: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  reviewerAvatarText: { fontSize: 14, fontWeight: '700', color: '#374151' },
  reviewerName: { fontSize: 13, fontWeight: '700', color: '#111827' },
  reviewDate: { fontSize: 12, color: '#6B7280' },
  reviewContent: { fontSize: 13, color: '#374151' },

  relatedGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  relCard: { width: '48%', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  relImage: { height: 80, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  relContent: { padding: 10 },
  relTitle: { fontSize: 13, fontWeight: '700', color: '#111827' },
  relInstructor: { fontSize: 12, color: '#6B7280' },
  relPrice: { fontSize: 13, fontWeight: '700', color: '#2563EB' },

  fab: { position: 'absolute', right: 20, bottom: 20, width: 50, height: 50, borderRadius: 25, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },

  instructorRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  instructorAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  instructorAvatarText: { fontSize: 18, fontWeight: '700', color: '#374151' },
  instructorName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  instructorTitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  instructorBio: { fontSize: 13, color: '#374151', marginTop: 6 },
})
