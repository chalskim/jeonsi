import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import common from '../../data/common.json'

export default function RecruitmentDetail() {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const [bookmarked, setBookmarked] = useState(false)

  const company = useMemo(() => ({ name: '㈜테크솔루션', industry: 'IT 서비스', size: '50~100명', location: '경기 성남시' }), [])
  const title = '보안 컨설턴트 (정규직)'
  const tags = useMemo(() => ({ employment: '정규직', location: '경기 성남시', career: '5년 이상', deadline: 'D-7' }), [])
  const highlights = useMemo(() => ({ salary: '연봉 4,000~6,000만원', education: '학력 무관' }), [])
  const majorCode = 'IT'
  const middleCode = 'IT05'
  const major = useMemo(() => ((common as any).majorCategories as Array<any>).find((m) => m.code === majorCode), [majorCode])
  const middle = useMemo(() => ((common as any).middleCategories as Array<any>).find((s) => s.code === middleCode), [middleCode])
  const majorEmoji = useMemo(() => ((common as any).middleCategories as Array<any>).find((s) => s.majorCode === majorCode)?.emoji ?? '🏷️', [majorCode])

  const apply = () => {
    Alert.alert('지원하기', '지원서 작성 페이지로 이동합니다.')
  }

  const goBack = () => {
    if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
      ;(navigation as any).goBack()
      return
    }
    navigation.navigate('RecruitmentList')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBack}>
          <FontAwesome5 name="arrow-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>채용 상세</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => Alert.alert('공유', '공고 링크를 공유합니다.')}>
            <FontAwesome5 name="share-alt" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={styles.companyInfo}>
          <View style={styles.companyLogo}><FontAwesome5 name="building" size={24} color="#9CA3AF" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.companyName}>{company.name}</Text>
            <View style={styles.companyMetaRow}>
              <View style={styles.companyMetaItem}><FontAwesome5 name="industry" size={12} color="#6B7280" /><Text style={styles.companyMetaText}>{company.industry}</Text></View>
              <View style={styles.companyMetaItem}><FontAwesome5 name="users" size={12} color="#6B7280" /><Text style={styles.companyMetaText}>{company.size}</Text></View>
              <View style={styles.companyMetaItem}><FontAwesome5 name="map-marker-alt" size={12} color="#6B7280" /><Text style={styles.companyMetaText}>{company.location}</Text></View>
            </View>
          </View>
          <TouchableOpacity style={[styles.bookmarkBtn, bookmarked && styles.bookmarkBtnOn]} onPress={() => setBookmarked((v) => !v)}>
            <FontAwesome5 name="bookmark" size={18} color={bookmarked ? '#F59E0B' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.jobTitle}>{title}</Text>
          <View style={styles.tagRow}>
            <View style={[styles.tag, styles.tagEmployment]}><Text style={styles.tagTextPrimary}>{tags.employment}</Text></View>
            <View style={[styles.tag, styles.tagLocation]}><Text style={styles.tagTextSuccess}>{tags.location}</Text></View>
            <View style={[styles.tag, styles.tagCareer]}><Text style={styles.tagTextWarning}>{tags.career}</Text></View>
            <View style={[styles.tag, styles.tagDeadline]}><Text style={styles.tagTextDanger}>{tags.deadline}</Text></View>
          </View>
          <View style={styles.highlightRow}>
            <View style={styles.highlightItem}><FontAwesome5 name="money-bill-wave" size={16} color="#2563EB" /><Text style={styles.highlightText}>{highlights.salary}</Text></View>
            <View style={styles.highlightItem}><FontAwesome5 name="graduation-cap" size={16} color="#2563EB" /><Text style={styles.highlightText}>{highlights.education}</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><FontAwesome5 name="tags" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>업무 분류</Text></View>
          <View style={{ rowGap: 10 }}>
            <View style={styles.classItem}>
              <Text style={styles.classIcon}>{majorEmoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.classCode}>{major?.code ?? ''}</Text>
                <Text style={styles.className}>{major?.name ?? ''}</Text>
              </View>
              <View style={styles.classBadge}><Text style={styles.classBadgeText}>대분류</Text></View>
            </View>
            <View style={styles.classItem}>
              <Text style={styles.classIcon}>{(middle as any)?.emoji ?? '🏷️'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.classCode}>{middle?.code ?? ''}</Text>
                <Text style={styles.className}>{middle?.name ?? ''}</Text>
              </View>
              <View style={styles.classBadge}><Text style={styles.classBadgeText}>중분류</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><FontAwesome5 name="briefcase" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>담당 업무</Text></View>
          <View style={styles.bulletList}>
            {[
              '정보보호 컨설팅 서비스 기획 및 제공',
              'ISMS-P 인증 컨설팅 및 지원',
              '개인정보보호 컨설팅 및 정책 수립 지원',
              '보안 솔루션 도입 및 운영 컨설팅',
              '고객사 보안 수준 진단 및 개선 방안 제시',
              '보안 교육 프로그램 개발 및 운영',
            ].map((t, i) => (
              <View key={`jd-${i}`} style={styles.bulletItem}><View style={styles.bulletDot} /><Text style={styles.bulletText}>{t}</Text></View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><FontAwesome5 name="user-check" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>자격 요건</Text></View>
          <View style={styles.bulletList}>
            {[
              '정보보호 관련 경력 5년 이상',
              'ISMS-P, 개인정보보호 컨설팅 경험',
              '정보보호 자격증 보유자 우대 (CISSP, CISA, CISM 등)',
              '보안 솔루션 기술 이해도',
              '프로젝트 관리 능력',
              '문서 작성 및 발표 능력',
            ].map((t, i) => (
              <View key={`rq-${i}`} style={styles.bulletItem}><View style={styles.bulletDot} /><Text style={styles.bulletText}>{t}</Text></View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><FontAwesome5 name="star" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>우대 사항</Text></View>
          <View style={styles.bulletList}>
            {[
              '금융권, 공공기관 컨설팅 경험',
              '해외 보안 자격증 보유자',
              '보안 관련 강의 및 발표 경험',
              '영어 업무 가능자',
              '보안 관련 논문 발표 및 저서 출판 경험',
            ].map((t, i) => (
              <View key={`pf-${i}`} style={styles.bulletItem}><View style={styles.bulletDot} /><Text style={styles.bulletText}>{t}</Text></View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><FontAwesome5 name="briefcase" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>근무 조건</Text></View>
          <View style={styles.kvList}>
            <View style={styles.kvItem}><Text style={styles.kvKey}>고용 형태</Text><Text style={styles.kvValue}>정규직 (수습 3개월)</Text></View>
            <View style={styles.kvItem}><Text style={styles.kvKey}>급여</Text><Text style={styles.kvValue}>연봉 4,000~6,000만원 (경력 및 능력에 따라 협의)</Text></View>
            <View style={styles.kvItem}><Text style={styles.kvKey}>근무 시간</Text><Text style={styles.kvValue}>월~금 09:00~18:00 (주 40시간)</Text></View>
            <View style={styles.kvItem}><Text style={styles.kvKey}>근무지</Text><Text style={styles.kvValue}>경기도 성남시 분당구 대왕판교로 645</Text></View>
            <View style={styles.kvItem}><Text style={styles.kvKey}>복리후생</Text><Text style={styles.kvValue}>4대 보험, 퇴직금, 연차, 야근수당, 장기근속상여, 도서구매비, 식대, 자기계발비, 경조사비, 단체상해보험, 건강검진, 체육비 지원, 하계/동계 휴가비</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><FontAwesome5 name="tasks" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>전형 절차</Text></View>
          <View style={{ rowGap: 12 }}>
            {[
              { n: 1, t: '서류 전형', d: '제출 서류 검토' },
              { n: 2, t: '1차 면접', d: '실무진 면접' },
              { n: 3, t: '2차 면접', d: '임원진 면접' },
              { n: 4, t: '최종 합격', d: '입사 통보 및 계약' },
            ].map((s) => (
              <View key={`ps-${s.n}`} style={styles.processItem}>
                <View style={styles.numberBadge}><Text style={styles.numberBadgeText}>{s.n}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.processTitle}>{s.t}</Text>
                  <Text style={styles.processDesc}>{s.d}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><FontAwesome5 name="file-alt" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>제출 서류</Text></View>
          <View style={styles.bulletList}>
            {[
              '이력서 (양식 자유)',
              '경력기술서 (양식 자유)',
              '포트폴리오 (보안 컨설팅 관련 프로젝트 경험)',
              '자격증 사본 (보유한 경우)',
            ].map((t, i) => (
              <View key={`doc-${i}`} style={styles.bulletItem}><View style={styles.bulletDot} /><Text style={styles.bulletText}>{t}</Text></View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><FontAwesome5 name="calendar-alt" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>접수 기간</Text></View>
          <View style={{ rowGap: 6 }}>
            <Text style={styles.defaultText}>2024년 3월 1일 (금) ~ 2024년 3월 15일 (금)</Text>
            <Text style={styles.mutedText}>※ 조기 마감될 수 있습니다.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><FontAwesome5 name="th-list" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>유사 채용 공고</Text></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ columnGap: 12 }}>
            {[
              { t: '정보보안 매니저', c: '㈜클라우드테크', tags: ['정규직', '3년 이상', '서울'] },
              { t: '보안 솔루션 컨설턴트', c: '㈜디지털이노베이션', tags: ['계약직', '5년 이상', '판교'] },
              { t: 'CSO (최고보안책임자)', c: '㈜핀테크코리아', tags: ['정규직', '10년 이상', '여의도'] },
            ].map((item, i) => (
              <TouchableOpacity key={`sj-${i}`} style={styles.similarCard} onPress={() => Alert.alert('이동', '해당 채용 공고 상세 페이지로 이동합니다.')}> 
                <Text style={styles.similarTitle}>{item.t}</Text>
                <Text style={styles.similarCompany}>{item.c}</Text>
                <View style={styles.similarTagsRow}>
                  {item.tags.map((tg, ix) => (
                    <View key={`tag-${i}-${ix}`} style={styles.similarTag}><Text style={styles.similarTagText}>{tg}</Text></View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.btnOutline} onPress={() => setBookmarked((v) => !v)}>
          <FontAwesome5 name="bookmark" size={14} color={bookmarked ? '#2563EB' : '#374151'} />
          <Text style={[styles.btnOutlineText, bookmarked && styles.btnOutlineTextOn]}>{bookmarked ? '북마크됨' : '북마크'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline} onPress={() => Alert.alert('기업 정보', '기업 정보 페이지로 이동합니다.')}> 
          <FontAwesome5 name="building" size={14} color="#374151" />
          <Text style={styles.btnOutlineText}>기업 정보</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('RecruitmentApplicantForms')}>
          <FontAwesome5 name="paper-plane" size={14} color="#FFFFFF" />
          <Text style={styles.btnPrimaryText}>지원하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#dee2e6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerIcons: { flexDirection: 'row', columnGap: 12, alignItems: 'center' },

  companyInfo: { backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  companyLogo: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  companyName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  companyMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  companyMetaItem: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  companyMetaText: { fontSize: 12, color: '#6B7280' },
  bookmarkBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  bookmarkBtnOn: { backgroundColor: 'rgba(245,158,11,0.1)' },

  section: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginHorizontal: 15, marginTop: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },

  jobTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 10 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  tagEmployment: { backgroundColor: 'rgba(0, 123, 255, 0.1)' },
  tagLocation: { backgroundColor: 'rgba(40, 167, 69, 0.1)' },
  tagCareer: { backgroundColor: 'rgba(255, 193, 7, 0.1)' },
  tagDeadline: { backgroundColor: 'rgba(220, 53, 69, 0.1)' },
  tagTextPrimary: { fontSize: 12, fontWeight: '700', color: '#007bff' },
  tagTextSuccess: { fontSize: 12, fontWeight: '700', color: '#28a745' },
  tagTextWarning: { fontSize: 12, fontWeight: '700', color: '#ffc107' },
  tagTextDanger: { fontSize: 12, fontWeight: '700', color: '#dc3545' },

  highlightRow: { flexDirection: 'row', columnGap: 20 },
  highlightItem: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  highlightText: { fontWeight: '700', color: '#111827' },

  classItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, backgroundColor: '#F8FAFC', borderRadius: 8 },
  classIcon: { fontSize: 20, width: 30, textAlign: 'center', marginRight: 8 },
  classCode: { fontSize: 12, fontWeight: '700', color: '#2563EB', marginBottom: 3 },
  className: { fontSize: 14, fontWeight: '700', color: '#111827' },
  classBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: '#2563EB' },
  classBadgeText: { fontSize: 12, color: '#FFFFFF', fontWeight: '700' },

  bulletList: { rowGap: 10 },
  bulletItem: { flexDirection: 'row', alignItems: 'flex-start', columnGap: 10 },
  bulletDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563EB', marginTop: 7 },
  bulletText: { flex: 1, fontSize: 14, color: '#111827' },

  kvList: { rowGap: 8 },
  kvItem: { flexDirection: 'row', columnGap: 8 },
  kvKey: { fontSize: 14, fontWeight: '700', color: '#111827' },
  kvValue: { flex: 1, fontSize: 14, color: '#111827' },

  processItem: { flexDirection: 'row', alignItems: 'center', columnGap: 10 },
  numberBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  numberBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  processTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  processDesc: { fontSize: 12, color: '#6B7280' },

  defaultText: { fontSize: 14, color: '#111827' },
  mutedText: { fontSize: 12, color: '#6B7280' },

  similarCard: { minWidth: 250, backgroundColor: '#F8FAFC', borderRadius: 8, padding: 15 },
  similarTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  similarCompany: { fontSize: 12, color: '#6B7280', marginBottom: 10 },
  similarTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  similarTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: '#FFFFFF' },
  similarTagText: { fontSize: 12, color: '#6B7280' },

  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', columnGap: 8 },
  btnPrimary: { flex: 2, flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnOutline: { flex: 1, flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  btnOutlineText: { color: '#374151', fontSize: 13, fontWeight: '600' },
  btnOutlineTextOn: { color: '#2563EB', fontWeight: '700' },
})
