import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Experience = { company: string; duration: string; role: string; description: string }
type PortfolioFile = { name: string; type: 'pdf' | 'zip' | 'pptx' | 'file' }
type TimePackage = { title: string; price: string; description: string }
type Review = { company: string; rating: string; project: string; comment: string }

export default function ExpertsDetail() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [bookmarked, setBookmarked] = useState(false)
  const expertId = (route as any)?.params?.expertId as number | undefined
  const [avatarFailed, setAvatarFailed] = useState(false)

  const expertsData = useMemo(
    () => [
      { id: 1, name: '김민준', title: '10년 경력 마케팅 & 브랜딩 전문가', photo: 'https://picsum.photos/seed/expert1/90/90.jpg' },
      { id: 2, name: '이서연', title: '8년 경력 UI/UX 디자이너', photo: 'https://picsum.photos/seed/expert2/90/90.jpg' },
      { id: 3, name: '박현우', title: '12년 경력 풀스택 개발자', photo: 'https://picsum.photos/seed/expert3/90/90.jpg' },
      { id: 4, name: '최지아', title: '7년 경력 재무 컨설턴트', photo: 'https://picsum.photos/seed/expert4/90/90.jpg' },
      { id: 5, name: '정도현', title: '9년 경력 HR 전문가', photo: 'https://picsum.photos/seed/expert5/90/90.jpg' },
      { id: 6, name: '강민서', title: '6년 경력 데이터 분석가', photo: 'https://picsum.photos/seed/expert6/90/90.jpg' },
    ],
    []
  )

  const selected = useMemo(() => {
    const id = typeof expertId === 'number' && !Number.isNaN(expertId) ? expertId : expertsData[0].id
    return expertsData.find((e) => e.id === id) ?? expertsData[0]
  }, [expertId, expertsData])

  const profile = {
    name: selected.name,
    role: selected.title,
    avatar: selected.photo,
    stats: { rating: '★ 4.9', reviews: 23, response: '평균 2시간 내 응답' },
    expertise: { major: '기술/개발', minor: '보안/인증 (SC02)' },
  }

  const skills = useMemo(() => ['웹 해킹', '보고서 작성', 'ISMS-P', '코드 리뷰', '네트워크 보안', '침투 테스트'], [])

  const experiences = useMemo<Experience[]>(
    () => [
      { company: '㈜사이버보안솔루션', duration: '2018.03 - 현재', role: '수석 컨설턴트', description: '금융 및 공공기관 대상 보안 컨설팅 및 ISMS-P 인증 지원. 주요 고객사의 보안 수준을 30% 이상 향상시킨 성과.' },
      { company: '㈜테크윈', duration: '2015.01 - 2018.02', role: '보안 엔지니어', description: '웹 및 모바일 애플리케이션 취약점 분석 및 보안 패치 개발. 주요 프로젝트 5건 성공적으로 완수.' },
    ],
    []
  )

  const portfolioFiles = useMemo<PortfolioFile[]>(
    () => [
      { name: '김민준_이력서.pdf', type: 'pdf' },
      { name: '보안컨설팅_성과사례.zip', type: 'zip' },
      { name: '웹취약점분석_샘플.pptx', type: 'pptx' },
    ],
    []
  )

  const timePackages = useMemo<TimePackage[]>(
    () => [
      { title: '보안 진단 컨설팅 (주 10시간)', price: '200만원/월', description: '정기적인 시스템 진단 및 보안 가이드라인 수립, 월 1회 보고서 제공' },
      { title: '단기 보안 점검 (총 24시간)', price: '150만원', description: '3일 내 집중적인 보안 점검 및 취약점 분석 보고서 작성' },
    ],
    []
  )

  const reviews = useMemo<Review[]>(
    () => [
      { company: '㈜핀테크코리아', rating: '★★★★★', project: '프로젝트: 보안 진단 보고서 작성 (3일)', comment: '전문성이 매우 뛰어나고, 소통도 원활했습니다. 복잡한 보안 이슈를 쉽게 설명해주어 큰 도움이 되었습니다.' },
      { company: '㈜테크솔루션', rating: '★★★★★', project: '프로젝트: ISMS-P 인증 컨설팅', comment: '경험이 풍부하여 예상치 못한 문제에도 신속하게 대처해주셨습니다. 덕분에 무사히 인증을 받을 수 있었습니다.' },
    ],
    []
  )

  const toggleBookmark = () => {
    setBookmarked((prev) => !prev)
    Alert.alert(bookmarked ? '북마크 해제' : '북마크', bookmarked ? '북마크가 해제되었습니다.' : '북마크되었습니다.')
  }

  const sendMessage = () => Alert.alert('안내', '채팅 화면으로 이동합니다.')
  const selectPackage = (title: string) => Alert.alert('패키지 선택', `'${title}' 패키지를 선택했습니다. 계약 페이지로 이동합니다.`)
  const downloadFile = (name: string) => Alert.alert('다운로드', `${name} 파일을 다운로드합니다.`)

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => {
          const prev = (route as any)?.params?.prev
          if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
            (navigation as any).goBack()
            return
          }
          if (typeof prev === 'string') {
            navigation.navigate(prev)
            return
          }
          navigation.navigate('Home')
        }}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>전문가 프로필</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.profileHeaderSection}>
            {avatarFailed ? (
              <View style={[styles.profileAvatar, { alignItems: 'center', justifyContent: 'center' }]}>
                <FontAwesome5 name="user" size={36} color="#6B7280" />
              </View>
            ) : (
              <Image source={{ uri: profile.avatar }} style={styles.profileAvatar} onError={() => setAvatarFailed(true)} />
            )}
            <View style={styles.profileSummary}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileRole}>{profile.role}</Text>
              <View style={styles.profileStats}>
                <Text style={[styles.profileStatItem, styles.profileRating]}>{profile.stats.rating}</Text>
                <View style={styles.profileStatRow}><FontAwesome5 name="comment-dots" size={12} color="#3B82F6" /><Text style={styles.profileStatText}>{profile.stats.reviews}개 리뷰</Text></View>
                <View style={styles.profileStatRow}><FontAwesome5 name="clock" size={12} color="#3B82F6" /><Text style={styles.profileStatText}>{profile.stats.response}</Text></View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><Text style={styles.sectionTitle}>전문 분야</Text></View>
          <View style={styles.expertiseInfo}><Text style={styles.expertiseText}><Text style={styles.expertiseLabel}>대분류: </Text>{profile.expertise.major}</Text><Text style={styles.expertiseText}><Text style={styles.expertiseLabel}>중분류: </Text>{profile.expertise.minor}</Text></View>
          <View style={styles.skillsList}>
            {skills.map((s) => (
              <View key={s} style={styles.skillTag}><Text style={styles.skillTagText}>{s}</Text></View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><Text style={styles.sectionTitle}>경력</Text></View>
          {experiences.map((e, idx) => (
            <View key={`${e.company}-${idx}`} style={styles.experienceItem}>
              <View style={styles.experienceHeader}><Text style={styles.experienceCompany}>{e.company}</Text><Text style={styles.experienceDuration}>{e.duration}</Text></View>
              <Text style={styles.experienceRole}>{e.role}</Text>
              <Text style={styles.experienceDescription}>{e.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><Text style={styles.sectionTitle}>포트폴리오 (파일 다운로드)</Text></View>
          <View style={styles.portfolioList}>
            {portfolioFiles.map((f) => (
              <TouchableOpacity key={f.name} style={styles.portfolioLink} activeOpacity={0.85} onPress={() => downloadFile(f.name)}>
                <View style={styles.fileInfo}>
                  <FontAwesome5 name={f.type === 'pdf' ? 'file-pdf' : f.type === 'zip' ? 'file-archive' : f.type === 'pptx' ? 'file-powerpoint' : 'file'} size={14} color={f.type === 'pdf' ? '#E74C3C' : f.type === 'zip' ? '#F59E0B' : f.type === 'pptx' ? '#3B82F6' : '#3B82F6'} />
                  <Text style={styles.fileName}>{f.name}</Text>
                </View>
                <FontAwesome5 name="download" size={14} color="#2563EB" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><Text style={styles.sectionTitle}>시간 패키지</Text></View>
          <View style={styles.packageList}>
            {timePackages.map((p) => (
              <View key={p.title} style={styles.packageCard}>
                <View style={styles.packageHeader}><Text style={styles.packageTitle}>{p.title}</Text><Text style={styles.packagePrice}>{p.price}</Text></View>
                <Text style={styles.packageDescription}>{p.description}</Text>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => selectPackage(p.title)}>
                  <FontAwesome5 name="check" size={14} color="#FFFFFF" />
                  <Text style={styles.btnPrimaryText}>선택하기</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><Text style={styles.sectionTitle}>리뷰 (23)</Text></View>
          {reviews.map((r, idx) => (
            <View key={`${r.company}-${idx}`} style={styles.reviewItem}>
              <View style={styles.reviewHeader}><Text style={styles.reviewCompany}>{r.company}</Text><Text style={styles.reviewRating}>{r.rating}</Text></View>
              <Text style={styles.reviewProject}>{r.project}</Text>
              <Text style={styles.reviewComment}>{r.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity style={[styles.bookmarkBtn, bookmarked && styles.bookmarkActive]} onPress={toggleBookmark}>
          <FontAwesome5 name="bookmark" size={14} color={bookmarked ? '#FFFFFF' : '#111827'} />
          <Text style={[styles.bookmarkText, bookmarked && styles.bookmarkTextActive]}>{bookmarked ? '북마크됨' : '북마크'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageBtn} onPress={sendMessage}>
          <FontAwesome5 name="comment-dots" size={14} color="#FFFFFF" />
          <Text style={styles.messageText}>메시지 보내기</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  content: { paddingBottom: 100 },
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#dee2e6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  section: { backgroundColor: '#FFFFFF', marginTop: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },

  profileHeaderSection: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  profileAvatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#e9ecef' },
  profileSummary: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 },
  profileRole: { fontSize: 14, color: '#6c757d', marginBottom: 10 },
  profileStats: { flexDirection: 'row', alignItems: 'center', columnGap: 16 },
  profileStatItem: { fontSize: 12, color: '#6c757d' },
  profileRating: { fontWeight: '700', color: '#F59E0B' },
  profileStatRow: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  profileStatText: { fontSize: 12, color: '#6c757d' },

  expertiseInfo: { marginBottom: 8 },
  expertiseText: { fontSize: 14, marginBottom: 4, color: '#333333' },
  expertiseLabel: { color: '#111827', fontWeight: '700' },
  skillsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  skillTag: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#F3F4F6', borderRadius: 16 },
  skillTagText: { fontSize: 13, color: '#374151' },

  experienceItem: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 12 },
  experienceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  experienceCompany: { fontWeight: '700', color: '#111827' },
  experienceDuration: { fontSize: 12, color: '#6B7280' },
  experienceRole: { marginBottom: 6, color: '#333333' },
  experienceDescription: { fontSize: 13, color: '#333333' },

  portfolioList: { flexDirection: 'column', rowGap: 10 },
  portfolioLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#F3F4F6', borderRadius: 8 },
  fileInfo: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  fileName: { fontSize: 13, color: '#333333' },

  packageList: { flexDirection: 'column', rowGap: 12 },
  packageCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12 },
  packageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  packageTitle: { fontWeight: '700', fontSize: 15, color: '#111827' },
  packagePrice: { fontWeight: '700', fontSize: 15, color: '#2563EB' },
  packageDescription: { fontSize: 13, color: '#6B7280', marginBottom: 10 },

  reviewItem: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingVertical: 12 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewCompany: { fontWeight: '700', color: '#111827' },
  reviewRating: { color: '#F59E0B' },
  reviewProject: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  reviewComment: { fontSize: 13, color: '#333333' },

  actionBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', padding: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', columnGap: 8 },
  bookmarkBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 6, backgroundColor: '#F3F4F6', paddingVertical: 10, borderRadius: 8 },
  bookmarkActive: { backgroundColor: '#2563EB' },
  bookmarkText: { color: '#111827', fontWeight: '700' },
  bookmarkTextActive: { color: '#FFFFFF' },
  messageBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 6, backgroundColor: '#2563EB', paddingVertical: 10, borderRadius: 8 },
  messageText: { color: '#FFFFFF', fontWeight: '700' },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' }
})
