import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert, Linking } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import common from '../../data/common.json'

type CareerType = 'newcomer' | 'experienced'
type Gender = 'male' | 'female'

type EducationItem = { eduType: string; schoolName: string; major: string; eduStatus: string; eduStartDate: string; eduEndDate: string; grade: string; gradeMax: string; subMajorType: string; subMajor: string; thesis: string }
type CareerItem = { companyName: string; department: string; careerStartDate: string; careerEndDate: string; isWorking: boolean; rank: string; position: string; jobDuty: string; salary: string; workDescription: string }
type CertificateItem = { certName: string; certIssuer: string; certDate: string }
type LanguageItem = { language: string; langTest: string; langScore: string; langDate: string }
type ActivityItem = { activityType: string; activityName: string; activityOrg: string; activityStart: string; activityEnd: string; activityDesc: string }
type PortfolioURL = { urlType: string; url: string }
type Attachment = { id: number; name: string; uri: string }

type ResumePayload = {
  careerType: CareerType
  name: string
  birth: string
  gender: Gender
  email: string
  phone: string
  tel: string
  zipcode: string
  address: string
  addressDetail: string
  photoUri: string
  majorCode: string
  middleCode: string
  location: string
  salaryMin: number
  salaryMax: number
  workTypes: string[]
  educations: EducationItem[]
  careers: CareerItem[]
  careerDescription: string
  skills: string[]
  certificates: CertificateItem[]
  languages: LanguageItem[]
  activities: ActivityItem[]
  portfolioUrls: PortfolioURL[]
  portfolioFiles: Attachment[]
  intro1: string
  intro2: string
  intro3: string
  intro4: string
  military: string
  militaryBranch: string
  militaryStart: string
  militaryEnd: string
  militaryRank: string
  disability: string
  veteran: string
}

const mockResume: ResumePayload = {
  careerType: 'experienced',
  name: '김지원',
  birth: '1995-03-15',
  gender: 'male',
  email: 'jiwon.kim@email.com',
  phone: '010-1234-5678',
  tel: '',
  zipcode: '',
  address: '서울특별시 강남구',
  addressDetail: '',
  photoUri: '',
  majorCode: 'IT',
  middleCode: 'IT01',
  location: 'seoul',
  salaryMin: 5000,
  salaryMax: 6000,
  workTypes: ['fulltime'],
  educations: [
    { eduType: 'college4', schoolName: '서울대학교', major: '컴퓨터공학부', eduStatus: 'graduated', eduStartDate: '2014-03', eduEndDate: '2018-02', grade: '3.8', gradeMax: '4.5', subMajorType: '', subMajor: '', thesis: '' },
    { eduType: 'high', schoolName: '서울고등학교', major: '인문계', eduStatus: 'graduated', eduStartDate: '2011-03', eduEndDate: '2014-02', grade: '', gradeMax: '4.5', subMajorType: '', subMajor: '', thesis: '' },
  ],
  careers: [
    {
      companyName: '(주)테크스타트',
      department: '개발팀',
      careerStartDate: '2022-06',
      careerEndDate: '',
      isWorking: true,
      rank: '대리',
      position: '프론트엔드 개발자',
      jobDuty: '프론트엔드 개발',
      salary: '4500',
      workDescription:
        'React, TypeScript 기반 웹 서비스 프론트엔드 개발\n디자인 시스템 구축 및 컴포넌트 라이브러리 개발\n성능 최적화를 통한 초기 로딩 시간 40% 개선\n신규 서비스 MVP 개발 참여 (MAU 10만 달성)',
    },
    {
      companyName: '(주)이커머스코리아',
      department: '기술팀',
      careerStartDate: '2020-03',
      careerEndDate: '2022-05',
      isWorking: false,
      rank: '사원',
      position: '웹 개발자',
      jobDuty: '프론트엔드 유지보수 및 기능 개발',
      salary: '3600',
      workDescription:
        '이커머스 플랫폼 프론트엔드 유지보수 및 기능 개발\nVue.js에서 React로 기술 스택 마이그레이션 참여\nA/B 테스트 도입을 통한 전환율 15% 향상',
    },
  ],
  careerDescription:
    '[프로젝트명] 디자인 시스템 구축 프로젝트\n- 기간: 2023.01 ~ 2023.06\n- 역할: 프론트엔드 리드\n- 상황: 다양한 서비스에서 일관되지 않은 UI/UX로 인한 개발 효율성 저하 및 사용자 경험 문제 발생\n- 행동: Storybook 기반 컴포넌트 문서화, Figma와 연동된 디자인 토큰 시스템 도입, 재사용 가능한 React 컴포넌트 라이브러리 개발\n- 결과: 신규 기능 개발 시간 30% 단축, 디자인-개발 간 커뮤니케이션 비용 50% 감소\n\n[프로젝트명] 성능 최적화 프로젝트\n- 기간: 2023.07 ~ 2023.09\n- 역할: 프론트엔드 개발자\n- 상황: 서비스 성장에 따른 초기 로딩 속도 저하 (LCP 4.5초)\n- 행동: 코드 스플리팅, 이미지 최적화, 번들 사이즈 분석 및 의존성 정리, SSR 도입 검토 및 적용\n- 결과: LCP 2.1초로 개선 (53% 향상), Core Web Vitals 전 항목 Good 달성',
  skills: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Redux', 'React Query', 'Storybook', 'Jest', 'Git', 'Figma'],
  certificates: [
    { certName: '정보처리기사', certIssuer: '한국산업인력공단', certDate: '2018-05' },
    { certName: 'SQLD (SQL 개발자)', certIssuer: '한국데이터산업진흥원', certDate: '2019-09' },
  ],
  languages: [
    { language: 'TOEIC', langTest: 'TOEIC', langScore: '920점', langDate: '2023-06' },
    { language: 'OPIC', langTest: 'OPIC', langScore: 'IH', langDate: '2023-08' },
  ],
  activities: [
    { activityType: 'external', activityName: '프론트엔드 개발 컨퍼런스 발표', activityOrg: 'FEConf Korea', activityStart: '2023-11', activityEnd: '2023-11', activityDesc: '"디자인 시스템 구축기: 0에서 1까지" 주제로 발표. 약 500명의 청중 대상 기술 발표 진행.' },
    { activityType: 'project', activityName: '오픈소스 컨트리뷰션', activityOrg: 'GitHub', activityStart: '2022-01', activityEnd: '현재', activityDesc: 'React 관련 오픈소스 프로젝트 기여. 버그 수정 및 문서화 작업 참여. 총 15개 PR 병합.' },
  ],
  portfolioUrls: [
    { urlType: 'github', url: 'https://github.com/jiwon-kim' },
    { urlType: 'blog', url: 'https://jiwon-dev.tistory.com' },
    { urlType: 'portfolio', url: 'https://portfolio.jiwon-kim.com' },
  ],
  portfolioFiles: [
    { id: 1, name: '포트폴리오_김지원.pdf (2.3MB)', uri: '#' },
  ],
  intro1:
    '프론트엔드 개발 분야에서 3년간 쌓아온 경험과 역량은 다음과 같습니다.\n\n[기술 전문성]\n- React, TypeScript를 활용한 대규모 웹 애플리케이션 개발 경험\n- 성능 최적화: LCP 4.5초 → 2.1초 개선 (53% 향상)\n- 디자인 시스템 구축으로 개발 생산성 30% 향상\n\n[협업 능력]\n- 디자이너, 백엔드 개발자와의 원활한 커뮤니케이션\n- 코드 리뷰 문화 정착에 기여\n- 기술 블로그 운영 및 사내 기술 세미나 진행\n\n[문제 해결 능력]\n- 레거시 코드 리팩토링 및 기술 부채 해소 경험\n- A/B 테스트를 통한 데이터 기반 의사결정',
  intro2:
    '저의 가장 큰 장점은 끈기입니다. 어려운 기술적 문제에 직면했을 때 쉽게 포기하지 않고, 문제의 근본 원인을 파악할 때까지 파고드는 성격입니다.\n단점으로는 때로 완벽을 추구하다 보니 일정 관리에 어려움을 겪을 때가 있어, 최근에는 MVP 정의와 우선순위 설정으로 개선하고 있습니다.',
  intro3:
    '귀사가 추구하는 "기술을 통한 일상의 혁신"이라는 비전에 깊이 공감하여 지원했습니다.\n입사 후 React/TypeScript 전문성과 성능 최적화 경험을 바탕으로 핵심 서비스의 사용자 경험을 개선하고, 팀 내 기술 공유 문화를 활성화하겠습니다.',
  intro4: '',
  military: '군필',
  militaryBranch: 'army',
  militaryStart: '2018-09',
  militaryEnd: '2020-06',
  militaryRank: '병장',
  disability: 'none',
  veteran: 'none',
}

export default function RecruitmentApplicantConform() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [resume, setResume] = useState<ResumePayload | null>(null)
  const [summary, setSummary] = useState<{ jobTitle?: string; appliedAt?: string; availableDate?: string; status?: string } | null>(null)
  const [memo, setMemo] = useState('')

  const applicantId = useMemo(() => (route as any)?.params?.applicantId ?? 'draft', [route])

  useEffect(() => {
    const p = (route as any)?.params?.resume as ResumePayload | undefined
    const s = (route as any)?.params?.summary as any
    if (p) setResume(p)
    if (s) setSummary(s)
    if (!p) {
      AsyncStorage.getItem('applicantResumeDraft').then((saved) => {
        if (saved) {
          setResume(JSON.parse(saved))
        } else {
          setResume(mockResume)
          setSummary({ jobTitle: '프론트엔드 개발자 (정규직)', appliedAt: '2024.12.03', availableDate: '2024.12.20', status: '서류 검토중' })
        }
      })
    }
    AsyncStorage.getItem(`recruiterMemo-${applicantId}`).then((m) => setMemo(m ?? '프론트엔드 경력 3년, React/TypeScript 전문성 우수\n성능 최적화 경험 인상적\n면접 시 디자인 시스템 구축 경험에 대해 상세히 질문 필요'))
  }, [route, applicantId])

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
    navigation.navigate('RecruitmentApplicantsManagement')
  }

  const majorOptions = useMemo(() => (common as any).majorCategories as Array<any>, [])
  const middleOptions = useMemo(() => ((common as any).middleCategories as Array<any>), [])
  const provinces = useMemo(() => [
    { code: 'seoul', label: '서울' },
    { code: 'gyeonggi', label: '경기' },
    { code: 'incheon', label: '인천' },
    { code: 'busan', label: '부산' },
    { code: 'daegu', label: '대구' },
    { code: 'daejeon', label: '대전' },
    { code: 'gwangju', label: '광주' },
    { code: 'ulsan', label: '울산' },
    { code: 'sejong', label: '세종' },
    { code: 'gangwon', label: '강원' },
    { code: 'chungbuk', label: '충북' },
    { code: 'chungnam', label: '충남' },
    { code: 'jeonbuk', label: '전북' },
    { code: 'jeonnam', label: '전남' },
    { code: 'gyeongbuk', label: '경북' },
    { code: 'gyeongnam', label: '경남' },
    { code: 'jeju', label: '제주' },
    { code: 'overseas', label: '해외' },
  ], [])

  const majorLabel = useMemo(() => {
    if (!resume) return ''
    const f = majorOptions.find((m) => m.code === resume.majorCode)
    return f ? f.name : ''
  }, [resume, majorOptions])
  const middleLabel = useMemo(() => {
    if (!resume) return ''
    const f = middleOptions.find((m) => m.code === resume.middleCode)
    return f ? f.name : ''
  }, [resume, middleOptions])
  const locationLabel = useMemo(() => {
    if (!resume) return ''
    const f = provinces.find((p) => p.code === resume.location)
    return f ? f.label : ''
  }, [resume, provinces])

  const totalMonths = useMemo(() => {
    if (!resume || !Array.isArray(resume.careers)) return 0
    const toMonth = (s: string) => {
      const a = s.split('-')
      if (a.length < 2) return null
      const y = Number(a[0])
      const m = Number(a[1])
      if (Number.isNaN(y) || Number.isNaN(m)) return null
      return y * 12 + m
    }
    let sum = 0
    resume.careers.forEach((c) => {
      const st = toMonth(c.careerStartDate)
      const en = c.isWorking ? toMonth(new Date().toISOString().slice(0, 7)) : toMonth(c.careerEndDate)
      if (st && en && en >= st) sum += en - st + 1
    })
    return sum
  }, [resume])
  const careerBadge = useMemo(() => {
    if (!resume) return ''
    if (resume.careerType === 'newcomer') return '신입'
    const y = Math.floor(totalMonths / 12)
    const m = totalMonths % 12
    return y > 0 ? `${y}년 ${m}개월 경력` : `${m}개월 경력`
  }, [resume, totalMonths])

  const saveMemo = async () => {
    await AsyncStorage.setItem(`recruiterMemo-${applicantId}`, memo)
    Alert.alert('저장', '메모가 저장되었습니다.')
  }

  const changeStatus = (type: 'passed' | 'failed' | 'screening') => {
    Alert.alert('처리', type === 'passed' ? '서류 통과 처리했습니다.' : type === 'failed' ? '탈락 처리했습니다.' : '선별전으로 변경했습니다.')
  }

  const openUrl = (url: string) => {
    if (!url) return
    Linking.openURL(url).catch(() => Alert.alert('오류', 'URL을 열 수 없습니다.'))
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>지원자 이력서</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <View style={styles.photoBox}>
              {resume?.photoUri ? (
                <Image source={{ uri: resume.photoUri }} style={styles.photoImage} />
              ) : (
                <View style={styles.photoPlaceholder}><FontAwesome5 name="user" size={28} color="#9CA3AF" /><Text style={styles.photoPlaceholderText}>사진 없음</Text></View>
              )}
            </View>
          </View>
          <View style={styles.profileRight}>
            <View style={styles.nameRow}>
              <Text style={styles.nameText}>{resume?.name ?? ''}</Text>
              <View style={styles.careerBadge}><Text style={styles.careerBadgeText}>{careerBadge}</Text></View>
            </View>
            <View style={styles.contactRow}><FontAwesome5 name="envelope" size={12} color="#6B7280" /><Text style={styles.contactText}>{resume?.email ?? ''}</Text></View>
            <View style={styles.contactRow}><FontAwesome5 name="phone" size={12} color="#6B7280" /><Text style={styles.contactText}>{resume?.phone ?? ''}</Text></View>
            <View style={styles.contactRow}><FontAwesome5 name="map-marker-alt" size={12} color="#6B7280" /><Text style={styles.contactText}>{resume ? `${resume.address} ${resume.addressDetail}` : ''}</Text></View>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>생년월일</Text><Text style={styles.metaValue}>{resume?.birth ?? ''}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>성별</Text><Text style={styles.metaValue}>{resume?.gender === 'male' ? '남성' : '여성'}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>병역</Text><Text style={styles.metaValue}>{resume?.military ?? ''}</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>A</Text></View><Text style={styles.sectionTitle}>지원 요약</Text></View></View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}><Text style={styles.summaryLabel}>지원 직무</Text><Text style={styles.summaryValue}>{summary?.jobTitle ?? `${majorLabel} / ${middleLabel}`}</Text></View>
            <View style={styles.summaryItem}><Text style={styles.summaryLabel}>지원일</Text><Text style={styles.summaryValue}>{summary?.appliedAt ?? ''}</Text></View>
            <View style={styles.summaryItem}><Text style={styles.summaryLabel}>희망 연봉</Text><Text style={styles.summaryValue}>{resume ? `${resume.salaryMin}~${resume.salaryMax}만원` : ''}</Text></View>
            <View style={styles.summaryItem}><Text style={styles.summaryLabel}>근무 가능일</Text><Text style={styles.summaryValue}>{summary?.availableDate ?? ''}</Text></View>
            <View style={styles.summaryItem}><Text style={styles.summaryLabel}>상태</Text><View style={[styles.statusBadge, styles.badgeScreening]}><Text style={styles.statusBadgeText}>{summary?.status ?? '선별전'}</Text></View></View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>1</Text></View><Text style={styles.sectionTitle}>희망 근무조건</Text></View></View>
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}><Text style={styles.detailLabel}>직무</Text><Text style={styles.detailValue}>{majorLabel} / {middleLabel}</Text></View>
            <View style={styles.detailItem}><Text style={styles.detailLabel}>근무지</Text><Text style={styles.detailValue}>{locationLabel}</Text></View>
            <View style={styles.detailItem}><Text style={styles.detailLabel}>근무형태</Text><Text style={styles.detailValue}>{resume?.workTypes?.map((w) => (w === 'fulltime' ? '정규직' : w === 'contract' ? '계약직' : w === 'intern' ? '인턴' : w === 'parttime' ? '아르바이트' : '프리랜서')).join(', ')}</Text></View>
            <View style={styles.detailItem}><Text style={styles.detailLabel}>연봉</Text><Text style={styles.detailValue}>{resume ? `${resume.salaryMin}~${resume.salaryMax}만원` : ''}</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>2</Text></View><Text style={styles.sectionTitle}>학력</Text></View></View>
          <View style={{ rowGap: 12 }}>
            {resume?.educations?.map((ed, i) => (
              <View key={`ed-${i}`} style={styles.cardItem}>
                <View style={styles.cardRow}><FontAwesome5 name="graduation-cap" size={12} color="#2563EB" /><Text style={styles.cardTitle}>{ed.schoolName} • {ed.major}</Text></View>
                <View style={styles.metaRow}><View style={styles.metaItem}><Text style={styles.metaLabel}>기간</Text><Text style={styles.metaValue}>{ed.eduStartDate} ~ {ed.eduEndDate}</Text></View><View style={styles.metaItem}><Text style={styles.metaLabel}>상태</Text><Text style={styles.metaValue}>{ed.eduStatus}</Text></View><View style={styles.metaItem}><Text style={styles.metaLabel}>학점</Text><Text style={styles.metaValue}>{ed.grade ? `${ed.grade}/${ed.gradeMax}` : '-'}</Text></View></View>
                {ed.thesis ? <Text style={styles.cardDesc}>{ed.thesis}</Text> : null}
              </View>
            ))}
          </View>
        </View>

        {resume?.careerType === 'experienced' ? (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}><View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>3</Text></View><Text style={styles.sectionTitle}>경력</Text></View></View>
            <View style={{ rowGap: 12 }}>
              {resume?.careers?.map((cr, i) => (
                <View key={`cr-${i}`} style={styles.cardItem}>
                  <View style={styles.cardRow}><FontAwesome5 name="building" size={12} color="#2563EB" /><Text style={styles.cardTitle}>{cr.companyName} • {cr.department}</Text></View>
                  <View style={styles.metaRow}><View style={styles.metaItem}><Text style={styles.metaLabel}>기간</Text><Text style={styles.metaValue}>{cr.careerStartDate} ~ {cr.isWorking ? '재직중' : cr.careerEndDate}</Text></View><View style={styles.metaItem}><Text style={styles.metaLabel}>직급/직책</Text><Text style={styles.metaValue}>{cr.rank} / {cr.position}</Text></View><View style={styles.metaItem}><Text style={styles.metaLabel}>담당직무</Text><Text style={styles.metaValue}>{cr.jobDuty}</Text></View><View style={styles.metaItem}><Text style={styles.metaLabel}>연봉</Text><Text style={styles.metaValue}>{cr.salary ? `${cr.salary}만원` : '-'}</Text></View></View>
                  {cr.workDescription ? <Text style={styles.cardDesc}>{cr.workDescription}</Text> : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {resume?.careerType === 'experienced' ? (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}><View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>4</Text></View><Text style={styles.sectionTitle}>경력기술서</Text></View></View>
            <Text style={styles.longText}>{resume?.careerDescription ?? ''}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>5</Text></View><Text style={styles.sectionTitle}>보유 스킬</Text></View></View>
          <View style={styles.skillRow}>
            {resume?.skills?.map((s, i) => (
              <View key={`sk-${i}`} style={styles.skillChip}><Text style={styles.skillText}>{s}</Text></View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>6</Text></View><Text style={styles.sectionTitle}>자격증</Text></View></View>
          <View style={{ rowGap: 12 }}>
            {resume?.certificates?.map((ci, i) => (
              <View key={`cert-${i}`} style={styles.cardItem}>
                <View style={styles.cardRow}><FontAwesome5 name="id-card" size={12} color="#2563EB" /><Text style={styles.cardTitle}>{ci.certName}</Text></View>
                <View style={styles.metaRow}><View style={styles.metaItem}><Text style={styles.metaLabel}>발행처</Text><Text style={styles.metaValue}>{ci.certIssuer}</Text></View><View style={styles.metaItem}><Text style={styles.metaLabel}>취득일</Text><Text style={styles.metaValue}>{ci.certDate}</Text></View></View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>7</Text></View><Text style={styles.sectionTitle}>어학</Text></View></View>
          <View style={{ rowGap: 12 }}>
            {resume?.languages?.map((li, i) => (
              <View key={`lang-${i}`} style={styles.cardItem}>
                <View style={styles.cardRow}><FontAwesome5 name="language" size={12} color="#2563EB" /><Text style={styles.cardTitle}>{li.language}</Text></View>
                <View style={styles.metaRow}><View style={styles.metaItem}><Text style={styles.metaLabel}>시험</Text><Text style={styles.metaValue}>{li.langTest}</Text></View><View style={styles.metaItem}><Text style={styles.metaLabel}>점수/등급</Text><Text style={styles.metaValue}>{li.langScore}</Text></View><View style={styles.metaItem}><Text style={styles.metaLabel}>취득일</Text><Text style={styles.metaValue}>{li.langDate}</Text></View></View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>8</Text></View><Text style={styles.sectionTitle}>대외활동</Text></View></View>
          <View style={{ rowGap: 12 }}>
            {resume?.activities?.map((ai, i) => (
              <View key={`act-${i}`} style={styles.cardItem}>
                <View style={styles.cardRow}><FontAwesome5 name="hands-helping" size={12} color="#2563EB" /><Text style={styles.cardTitle}>{ai.activityName} • {ai.activityOrg}</Text></View>
                <View style={styles.metaRow}><View style={styles.metaItem}><Text style={styles.metaLabel}>구분</Text><Text style={styles.metaValue}>{ai.activityType}</Text></View><View style={styles.metaItem}><Text style={styles.metaLabel}>기간</Text><Text style={styles.metaValue}>{ai.activityStart} ~ {ai.activityEnd}</Text></View></View>
                {ai.activityDesc ? <Text style={styles.cardDesc}>{ai.activityDesc}</Text> : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>9</Text></View><Text style={styles.sectionTitle}>포트폴리오</Text></View></View>
          <View style={{ rowGap: 10 }}>
            {resume?.portfolioUrls?.map((pu, i) => (
              <TouchableOpacity key={`pu-${i}`} style={styles.linkRow} onPress={() => openUrl(pu.url)}>
                <FontAwesome5 name="external-link-alt" size={12} color="#2563EB" />
                <Text style={styles.linkText}>{pu.urlType === 'portfolio' ? '포트폴리오' : pu.urlType === 'github' ? 'GitHub' : pu.urlType === 'blog' ? '블로그' : pu.urlType === 'linkedin' ? 'LinkedIn' : '기타'}: {pu.url}</Text>
              </TouchableOpacity>
            ))}
            {resume?.portfolioFiles?.map((f, i) => (
              <View key={`pf-${i}`} style={styles.linkRow}>
                <FontAwesome5 name="paperclip" size={12} color="#2563EB" />
                <Text style={styles.linkText}>{f.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>10</Text></View><Text style={styles.sectionTitle}>자기소개서</Text></View></View>
          <View style={{ rowGap: 12 }}>
            {resume?.intro1 ? (<View style={styles.qaBox}><Text style={styles.qaQ}>성장과정 및 학창시절</Text><Text style={styles.qaA}>{resume.intro1}</Text></View>) : null}
            {resume?.intro2 ? (<View style={styles.qaBox}><Text style={styles.qaQ}>성격의 장단점</Text><Text style={styles.qaA}>{resume.intro2}</Text></View>) : null}
            {resume?.intro3 ? (<View style={styles.qaBox}><Text style={styles.qaQ}>지원동기 및 입사 후 포부</Text><Text style={styles.qaA}>{resume.intro3}</Text></View>) : null}
            {resume?.intro4 ? (<View style={styles.qaBox}><Text style={styles.qaQ}>기타 자유기술</Text><Text style={styles.qaA}>{resume.intro4}</Text></View>) : null}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>11</Text></View><Text style={styles.sectionTitle}>병역 및 기타</Text></View></View>
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}><Text style={styles.detailLabel}>병역</Text><Text style={styles.detailValue}>{resume?.military ?? ''}</Text></View>
            <View style={styles.detailItem}><Text style={styles.detailLabel}>군별</Text><Text style={styles.detailValue}>{resume?.militaryBranch ?? ''}</Text></View>
            <View style={styles.detailItem}><Text style={styles.detailLabel}>복무기간</Text><Text style={styles.detailValue}>{resume?.militaryStart ?? ''} ~ {resume?.militaryEnd ?? ''}</Text></View>
            <View style={styles.detailItem}><Text style={styles.detailLabel}>계급</Text><Text style={styles.detailValue}>{resume?.militaryRank ?? ''}</Text></View>
            <View style={styles.detailItem}><Text style={styles.detailLabel}>장애여부</Text><Text style={styles.detailValue}>{resume?.disability ?? ''}</Text></View>
            <View style={styles.detailItem}><Text style={styles.detailLabel}>보훈대상</Text><Text style={styles.detailValue}>{resume?.veteran ?? ''}</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}><View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>M</Text></View><Text style={styles.sectionTitle}>채용자 메모</Text></View><TouchableOpacity style={styles.btnSecondary} onPress={saveMemo}><Text style={styles.btnSecondaryText}>메모 저장</Text></TouchableOpacity></View>
          <TextInput style={styles.memoInput} value={memo} onChangeText={setMemo} placeholder="메모를 입력하세요..." multiline />
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSuccess]} onPress={() => changeStatus('passed')}>
              <FontAwesome5 name="check" size={12} color="#FFFFFF" />
              <Text style={[styles.actionText, styles.actionTextOn]}>서류 통과</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={() => changeStatus('failed')}>
              <FontAwesome5 name="times" size={12} color="#FFFFFF" />
              <Text style={[styles.actionText, styles.actionTextOn]}>탈락</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => changeStatus('screening')}>
              <FontAwesome5 name="hourglass-half" size={12} color="#374151" />
              <Text style={styles.actionText}>선별전</Text>
            </TouchableOpacity>
          </View>
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

  profileSection: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingHorizontal: 15, paddingVertical: 16, columnGap: 16 },
  profileLeft: { width: 120 },
  photoBox: { width: 120, height: 150, borderWidth: 2, borderStyle: 'dashed', borderColor: '#ddd', borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' },
  photoImage: { width: 116, height: 146, borderRadius: 8 },
  photoPlaceholder: { alignItems: 'center', rowGap: 6 },
  photoPlaceholderText: { fontSize: 12, color: '#9CA3AF' },
  profileRight: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, marginBottom: 8 },
  nameText: { fontSize: 18, fontWeight: '700', color: '#111827' },
  careerBadge: { backgroundColor: '#E0F2FE', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  careerBadgeText: { fontSize: 12, color: '#0369A1', fontWeight: '700' },
  contactRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, marginTop: 4 },
  contactText: { fontSize: 12, color: '#374151' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10 },
  metaItem: { },
  metaLabel: { fontSize: 12, color: '#6B7280' },
  metaValue: { fontSize: 13, color: '#111827', fontWeight: '700' },

  section: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginHorizontal: 15, marginTop: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  numberIcon: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#667eea', alignItems: 'center', justifyContent: 'center' },
  numberIconText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  summaryItem: { minWidth: 140 },
  summaryLabel: { fontSize: 12, color: '#6B7280' },
  summaryValue: { fontSize: 13, color: '#111827', fontWeight: '700' },

  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  detailItem: { minWidth: 140 },
  detailLabel: { fontSize: 12, color: '#6B7280' },
  detailValue: { fontSize: 13, color: '#111827', fontWeight: '700' },

  cardItem: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  cardRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, marginBottom: 6 },
  cardTitle: { fontSize: 14, color: '#111827', fontWeight: '700' },
  cardDesc: { fontSize: 13, color: '#374151', marginTop: 6 },

  longText: { fontSize: 13, color: '#374151', lineHeight: 20 },

  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: { backgroundColor: '#667eea', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  skillText: { color: '#FFFFFF', fontSize: 12 },

  linkRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  linkText: { fontSize: 13, color: '#2563EB' },

  qaBox: { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 12 },
  qaQ: { fontSize: 13, color: '#111827', fontWeight: '700', marginBottom: 6 },
  qaA: { fontSize: 13, color: '#374151' },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeScreening: { backgroundColor: '#FFF7ED' },
  statusBadgeText: { fontSize: 12, color: '#F59E0B', fontWeight: '700' },

  memoInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, minHeight: 120, fontSize: 13, color: '#111827' },
  actionRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, marginTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#F3F4F6', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  actionBtnSuccess: { backgroundColor: '#10B981' },
  actionBtnDanger: { backgroundColor: '#DC2626' },
  actionText: { fontSize: 12, color: '#374151', fontWeight: '700' },
  actionTextOn: { color: '#FFFFFF' },

  btnSecondary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#2563EB', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnSecondaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
})
