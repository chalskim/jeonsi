import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Image } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import common from '../../data/common.json'

type Role = {
  id: string
  title: string
  count: number
  majorCode: string
  minorCode: string
  skills: string[]
  desc: string
  priceLabel: string
  applicantCounts: { total: number; reviewing: number; passed: number; rejected: number }
}

export default function ShortTermRequestsApplicants() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [bookmarked, setBookmarked] = useState(false)
  const [roleDetailOpen, setRoleDetailOpen] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)

  const company = useMemo(() => ({
    name: '㈜테크솔루션',
    industry: 'IT/소프트웨어',
    size: '50~100명 규모',
    location: '서울 강남구',
    description: '클라우드 및 보안 컨설팅을 전문으로 하는 IT 기업입니다.',
    logoUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" rx="8" fill="%234a6fdc"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="24" fill="white">TS</text></svg>',
    links: [
      { label: '홈페이지', icon: 'globe', url: 'https://example.com' },
      { label: '채용정보', icon: 'briefcase', url: 'https://example.com/jobs' },
    ],
  }), [])

  const request = useMemo(() => ({
    badges: [
      { label: '긴급', style: 'urgent' },
      { label: '원격', style: 'remote' },
    ],
    title: '보안 진단 보고서 작성 (3일)',
    meta: [
      { icon: 'calendar', text: '기간: 3일' },
      { icon: 'won-sign', text: '예산: 30~50만원' },
      { icon: 'clock', text: '접수 D-3' },
    ],
    repetitionInfo: '주 3회 회의, 산출물 제출',
    classification: { majorCode: 'IT', minorCode: 'IT05' },
    requiredSkills: ['ISMS', '취약점 진단', '보안 컨설팅', '보고서 작성'],
    conditions: [
      { icon: 'house', text: '원격 협업' },
      { icon: 'users', text: '팀 단위 협업' },
      { icon: 'comments', text: 'Slack 커뮤니케이션' },
    ],
  }), [])

  const roles = useMemo<Role[]>(
    () => [
      {
        id: 'role1',
        title: '보안 진단 전문가',
        count: 1,
        majorCode: 'IT',
        minorCode: 'IT05',
        skills: ['ISMS', '취약점 진단', '보안 감사'],
        desc: '대상 시스템 취약점 점검 및 개선안 도출',
        priceLabel: '40만원/건',
        applicantCounts: { total: 3, reviewing: 2, passed: 1, rejected: 0 },
      },
      {
        id: 'role2',
        title: '보고서 작성 전문가',
        count: 1,
        majorCode: 'WR',
        minorCode: 'WR01',
        skills: ['보고서', '카피라이팅', '기술 문서'],
        desc: '점검 결과를 기반으로 보고서 작성 및 보완',
        priceLabel: '30만원/건',
        applicantCounts: { total: 2, reviewing: 1, passed: 1, rejected: 0 },
      },
    ],
    []
  )


  const getMajorName = (code: string) => common.majorCategories.find((m: any) => m.code === code)?.name || ''
  const getMinorName = (majorCode: string, code: string) => common.middleCategories.find((m: any) => m.majorCode === majorCode && m.code === code)?.name || ''

  const openRoleDetail = (roleId: string) => {
    setSelectedRoleId(roleId)
    setRoleDetailOpen(true)
  }

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || null

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          activeOpacity={0.8}
          onPress={() => {
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
          }}
        >
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>의뢰 상세</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <View style={styles.companyHeader}>
            <Image source={{ uri: company.logoUri }} style={styles.companyLogo} />
            <View style={{ flex: 1 }}>
              <Text style={styles.companyName}>{company.name}</Text>
              <View style={styles.companyMetaRow}>
                <View style={styles.metaItem}>
                  <FontAwesome5 name="industry" size={12} color="#2563EB" />
                  <Text style={styles.metaText}>{company.industry}</Text>
                </View>
                <View style={styles.metaItem}>
                  <FontAwesome5 name="users" size={12} color="#2563EB" />
                  <Text style={styles.metaText}>{company.size}</Text>
                </View>
                <View style={styles.metaItem}>
                  <FontAwesome5 name="map-marker-alt" size={12} color="#2563EB" />
                  <Text style={styles.metaText}>{company.location}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => Alert.alert('안내', '기업 프로필 페이지로 이동합니다.')}> 
              <FontAwesome5 name="building" size={14} color="#FFFFFF" />
              <Text style={styles.btnPrimaryText}>프로필 보기</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.companyDesc}>{company.description}</Text>
          <View style={styles.linksRow}>
            {company.links.map((l) => (
              <TouchableOpacity key={l.label} activeOpacity={0.85} style={styles.linkItem} onPress={() => Alert.alert('링크', `${l.label}로 이동합니다.`)}>
                <FontAwesome5 name={l.icon as any} size={12} color="#2563EB" />
                <Text style={styles.linkText}>{l.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="file-alt" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>의뢰 정보</Text>
          </View>
          <View style={styles.badgeRow}>
            {request.badges.map((b) => (
              <View key={b.label} style={[styles.badge, b.style === 'urgent' ? styles.badgeUrgent : styles.badgeRemote]}>
                <Text style={styles.badgeText}>{b.label}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.requestTitle}>{request.title}</Text>
          <View style={styles.companyMetaRow}>
            {request.meta.map((m, i) => (
              <View key={`${m.text}-${i}`} style={styles.metaItem}>
                <FontAwesome5 name={m.icon as any} size={12} color="#2563EB" />
                <Text style={styles.metaText}>{m.text}</Text>
              </View>
            ))}
          </View>
          <View style={styles.inlineInfoRow}>
            <FontAwesome5 name="redo" size={12} color="#2563EB" />
            <Text style={styles.inlineInfoText}>{request.repetitionInfo}</Text>
          </View>
          <View style={styles.inlineInfoRow}>
            <FontAwesome5 name="tags" size={12} color="#2563EB" />
            <Text style={styles.inlineInfoText}>
              {getMajorName(request.classification.majorCode)} / {getMinorName(request.classification.majorCode, request.classification.minorCode)}
            </Text>
          </View>
          <Text style={styles.subTitle}>필요 역량</Text>
          <View style={styles.chipsRow}>
            {request.requiredSkills.map((s) => (
              <View key={s} style={styles.chip}>
                <Text style={styles.chipText}>{s}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.subTitle}>협업 조건</Text>
          <View>
            {request.conditions.map((c) => (
              <View key={c.text} style={styles.inlineInfoRow}>
                <FontAwesome5 name={c.icon as any} size={12} color="#2563EB" />
                <Text style={styles.inlineInfoText}>{c.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="users" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>팀 구성</Text>
          </View>
          <View>
            {roles.map((r) => (
              <View key={r.id} style={styles.roleCard}>
                <View style={styles.roleHeader}>
                  <Text style={styles.roleTitle}>{r.title}</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{r.count}명</Text>
                  </View>
                </View>
                <View style={styles.roleCategoryRow}>
                  <Text style={styles.metaText}>{getMajorName(r.majorCode)}</Text>
                  <Text style={styles.metaText}>{getMinorName(r.majorCode, r.minorCode)}</Text>
                </View>
                <View style={styles.chipsRow}>
                  {r.skills.map((s) => (
                    <View key={`${r.id}-${s}`} style={styles.chip}>
                      <Text style={styles.chipText}>{s}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.roleDesc}>{r.desc}</Text>
                <Text style={styles.rolePrice}>{r.priceLabel}</Text>
                <View style={styles.roleApplicantStatus}>
                  <View style={styles.applicantCountRow}>
                    <FontAwesome5 name="user" size={12} color="#2563EB" />
                    <Text style={styles.applicantCountNumber}>{r.applicantCounts.total}명 지원</Text>
                  </View>
                  <View style={styles.statusDotRow}>
                    <View style={[styles.statusDot, styles.statusDotReviewing]} />
                    <View style={[styles.statusDot, styles.statusDotPassed]} />
                    <View style={[styles.statusDot, styles.statusDotRejected]} />
                  </View>
                </View>
                <View style={styles.roleActions}>
                  <TouchableOpacity style={styles.btnOutline} onPress={() => openRoleDetail(r.id)}>
                    <FontAwesome5 name="info-circle" size={14} color="#374151" />
                    <Text style={styles.btnOutlineText}>상세</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity style={styles.btnPrimary} onPress={() => Alert.alert('지원', '해당 역할에 지원합니다.')}> 
                    <FontAwesome5 name="paper-plane" size={14} color="#FFFFFF" />
                    <Text style={styles.btnPrimaryText}>지원</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={styles.btnInfo}
                    onPress={() => navigation.navigate('ShortTermRequestsApplicantsManagement', { prev: 'ShortTermRequestsApplicants', roleId: r.id })}
                  >
                    <FontAwesome5 name="users" size={14} color="#FFFFFF" />
                    <Text style={styles.btnInfoText}>지원자 보기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="paperclip" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>첨부 파일</Text>
          </View>
          <View>
            {[{ name: '요구사항.pdf' }, { name: '회사소개.pptx' }].map((f) => (
              <View key={f.name} style={styles.attachmentItem}>
                <FontAwesome5 name="file" size={14} color="#2563EB" />
                <Text style={styles.attachmentName}>{f.name}</Text>
                <TouchableOpacity style={styles.btnOutline} onPress={() => Alert.alert('다운로드', `${f.name}을(를) 다운로드합니다.`)}>
                  <FontAwesome5 name="download" size={14} color="#374151" />
                  <Text style={styles.btnOutlineText}>다운로드</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity style={[styles.actionBtn, bookmarked && styles.actionBtnActive]} onPress={() => setBookmarked((v) => !v)}>
          <FontAwesome5 name="bookmark" size={16} color={bookmarked ? '#FFFFFF' : '#374151'} />
          <Text style={[styles.actionBtnText, bookmarked && styles.actionBtnTextActive]}>{bookmarked ? '북마크됨' : '북마크'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('채팅', '채팅을 시작합니다.')}> 
          <FontAwesome5 name="comments" size={16} color="#374151" />
          <Text style={styles.actionBtnText}>채팅</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={roleDetailOpen} transparent animationType="fade" onRequestClose={() => setRoleDetailOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>역할 상세</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setRoleDetailOpen(false)}>
                <FontAwesome5 name="times" size={16} color="#374151" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedRole && (
                <View>
                  <View style={styles.roleDetailHeader}>
                    <Text style={styles.roleDetailTitle}>{selectedRole.title}</Text>
                    <Text style={styles.roleDetailCount}>{selectedRole.count}명</Text>
                  </View>
                  <View style={styles.roleDetailSection}>
                    <Text style={styles.subTitle}>분류</Text>
                    <View style={styles.roleCategoryRow}>
                      <Text style={styles.metaText}>{getMajorName(selectedRole.majorCode)}</Text>
                      <Text style={styles.metaText}>{getMinorName(selectedRole.majorCode, selectedRole.minorCode)}</Text>
                    </View>
                  </View>
                  <View style={styles.roleDetailSection}>
                    <Text style={styles.subTitle}>필요 역량</Text>
                    <View style={styles.chipsRow}>
                      {selectedRole.skills.map((s) => (
                        <View key={`detail-${selectedRole.id}-${s}`} style={styles.chip}>
                          <Text style={styles.chipText}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.roleDetailSection}>
                    <Text style={styles.subTitle}>주요 작업</Text>
                    <View style={styles.taskBox}>
                      <Text style={styles.inlineInfoText}>{selectedRole.desc}</Text>
                    </View>
                  </View>
                  <View style={styles.roleDetailFooter}>
                    <Text style={styles.roleDetailPrice}>{selectedRole.priceLabel}</Text>
                  </View>
                </View>
              )}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnOutline} onPress={() => setRoleDetailOpen(false)}>
                <Text style={styles.btnOutlineText}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => Alert.alert('지원', '해당 역할에 지원합니다.')}> 
                <Text style={styles.btnPrimaryText}>지원</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  content: { paddingBottom: 100, paddingHorizontal: 12, paddingTop: 12 },
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#dee2e6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  form: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },

  companyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  companyLogo: { width: 60, height: 60, borderRadius: 8, marginRight: 15, backgroundColor: '#e9ecef' },
  companyName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  companyDesc: { fontSize: 13, color: '#374151', marginBottom: 10 },
  companyMetaRow: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  metaText: { fontSize: 12, color: '#6B7280' },
  linksRow: { flexDirection: 'row', columnGap: 14 },
  linkItem: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  linkText: { fontSize: 13, color: '#2563EB' },

  badgeRow: { flexDirection: 'row', columnGap: 8, marginBottom: 8 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  badgeUrgent: { backgroundColor: '#F59E0B' },
  badgeRemote: { backgroundColor: '#0EA5E9' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  requestTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  inlineInfoRow: { flexDirection: 'row', alignItems: 'center', columnGap: 6, marginVertical: 6 },
  inlineInfoText: { fontSize: 13, color: '#6B7280' },
  subTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginTop: 10, marginBottom: 8 },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3F4F6', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16 },
  chipText: { fontSize: 12, color: '#374151' },

  roleCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, backgroundColor: '#FAFAFA', marginBottom: 12 },
  roleHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: '#E5E7EB' },
  roleTitle: { fontWeight: '700', color: '#0066CC', fontSize: 14 },
  countBadge: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  countBadgeText: { fontSize: 12, color: '#374151' },
  roleCategoryRow: { flexDirection: 'row', columnGap: 10, marginBottom: 8 },
  roleDesc: { fontSize: 13, color: '#374151', marginTop: 6, marginBottom: 8 },
  rolePrice: { fontSize: 13, fontWeight: '700', color: '#0066CC', marginBottom: 10 },
  roleApplicantStatus: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, backgroundColor: '#F3F4F6', borderRadius: 8, marginBottom: 10 },
  applicantCountRow: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  applicantCountNumber: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  statusDotRow: { flexDirection: 'row', columnGap: 5 },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#6B7280' },
  statusDotReviewing: { backgroundColor: '#F59E0B' },
  statusDotPassed: { backgroundColor: '#22C55E' },
  statusDotRejected: { backgroundColor: '#DC2626' },
  roleActions: { flexDirection: 'row', columnGap: 8 },

  attachmentItem: { flexDirection: 'row', alignItems: 'center', columnGap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  attachmentName: { flex: 1, fontSize: 13, color: '#374151' },

  actionBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', padding: 15, flexDirection: 'row', columnGap: 8, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 8, backgroundColor: '#F3F4F6', paddingVertical: 12, borderRadius: 8 },
  actionBtnActive: { backgroundColor: '#2563EB' },
  actionBtnText: { fontSize: 14, color: '#374151', fontWeight: '600' },
  actionBtnTextActive: { color: '#FFFFFF' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  modalContent: { width: '90%', maxHeight: '90%', backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  modalCloseBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  modalBody: { paddingHorizontal: 16 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', columnGap: 8, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },

  roleDetailHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  roleDetailTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  roleDetailCount: { fontSize: 12, color: '#6B7280' },
  roleDetailSection: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  roleDetailFooter: { padding: 16, backgroundColor: '#F9FAFB' },
  roleDetailPrice: { fontSize: 16, fontWeight: '700', color: '#0066CC' },
  taskBox: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8 },

  applicantItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  applicantAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15, backgroundColor: '#e9ecef' },
  applicantName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  applicantRole: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  applicantStatusBadge: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  applicantStatusText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  badgeReviewing: { backgroundColor: '#F59E0B' },
  badgePassed: { backgroundColor: '#22C55E' },
  badgeRejected: { backgroundColor: '#DC2626' },
  applicantActions: { flexDirection: 'row', columnGap: 8 },

  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#EEEEEE', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 14, fontWeight: '500' },
  btnInfo: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0EA5E9', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnInfoText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  noDataContainer: { alignItems: 'center', paddingVertical: 40 },
  noDataTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
})
