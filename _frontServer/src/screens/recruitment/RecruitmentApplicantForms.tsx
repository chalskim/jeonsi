import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert, useWindowDimensions } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as DocumentPicker from 'expo-document-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import common from '../../data/common.json'

type CareerType = 'newcomer' | 'experienced'
type Gender = 'male' | 'female'

type Attachment = { id: number; name: string; uri: string }

type EducationItem = {
  eduType: string
  schoolName: string
  major: string
  eduStatus: string
  eduStartDate: string
  eduEndDate: string
  grade: string
  gradeMax: string
  subMajorType: string
  subMajor: string
  thesis: string
}

type CareerItem = {
  companyName: string
  department: string
  careerStartDate: string
  careerEndDate: string
  isWorking: boolean
  rank: string
  position: string
  jobDuty: string
  salary: string
  workDescription: string
}

type CertificateItem = { certName: string; certIssuer: string; certDate: string }
type LanguageItem = { language: string; langTest: string; langScore: string; langDate: string }
type ActivityItem = { activityType: string; activityName: string; activityOrg: string; activityStart: string; activityEnd: string; activityDesc: string }
type PortfolioURL = { urlType: string; url: string }

export default function RecruitmentApplicantForms() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const contentWidth = Math.max(0, width - 62)
  const col2 = useMemo(() => ({ flexBasis: width >= 400 ? (contentWidth - 12) / 2 : contentWidth, flexGrow: 1 }), [width])
  const col3 = useMemo(() => ({ flexBasis: width >= 768 ? (contentWidth - 24) / 3 : width >= 400 ? (contentWidth - 12) / 2 : contentWidth, flexGrow: 1 }), [width])

  const [careerType, setCareerType] = useState<CareerType>('newcomer')

  const [name, setName] = useState('')
  const [birth, setBirth] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [tel, setTel] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [address, setAddress] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [photoUri, setPhotoUri] = useState('')

  const [majorCode, setMajorCode] = useState<string>('IT')
  const [middleCode, setMiddleCode] = useState<string>('IT05')
  const [openMajor, setOpenMajor] = useState(false)
  const [openMiddle, setOpenMiddle] = useState(false)

  const [location, setLocation] = useState<string>('')
  const [salaryMin, setSalaryMin] = useState<string>('')
  const [salaryMax, setSalaryMax] = useState<string>('')
  const [workTypes, setWorkTypes] = useState<string[]>([])

  const [educations, setEducations] = useState<EducationItem[]>([{
    eduType: '', schoolName: '', major: '', eduStatus: '', eduStartDate: '', eduEndDate: '', grade: '', gradeMax: '4.5', subMajorType: '', subMajor: '', thesis: ''
  }])

  const [careers, setCareers] = useState<CareerItem[]>([{
    companyName: '', department: '', careerStartDate: '', careerEndDate: '', isWorking: false, rank: '', position: '', jobDuty: '', salary: '', workDescription: ''
  }])

  const [careerDescription, setCareerDescription] = useState('')

  const [skills, setSkills] = useState<string[]>(['JavaScript', 'React'])
  const [skillInput, setSkillInput] = useState('')

  const [certificates, setCertificates] = useState<CertificateItem[]>([{
    certName: '', certIssuer: '', certDate: ''
  }])

  const [languages, setLanguages] = useState<LanguageItem[]>([{
    language: '', langTest: '', langScore: '', langDate: ''
  }])

  const [activities, setActivities] = useState<ActivityItem[]>([{
    activityType: '', activityName: '', activityOrg: '', activityStart: '', activityEnd: '', activityDesc: ''
  }])

  const [portfolioUrls, setPortfolioUrls] = useState<PortfolioURL[]>([{ urlType: 'portfolio', url: '' }])
  const [portfolioFiles, setPortfolioFiles] = useState<Attachment[]>([])

  const [intro1, setIntro1] = useState('')
  const [intro2, setIntro2] = useState('')
  const [intro3, setIntro3] = useState('')
  const [intro4, setIntro4] = useState('')

  const [military, setMilitary] = useState('')
  const [militaryBranch, setMilitaryBranch] = useState('')
  const [militaryStart, setMilitaryStart] = useState('')
  const [militaryEnd, setMilitaryEnd] = useState('')
  const [militaryRank, setMilitaryRank] = useState('')
  const [disability, setDisability] = useState('')
  const [veteran, setVeteran] = useState('')

  const majorOptions = useMemo(() => (common as any).majorCategories as Array<any>, [])
  const middleOptions = useMemo(() => ((common as any).middleCategories as Array<any>).filter((m) => m.majorCode === majorCode), [majorCode])
  const majorLabel = useMemo(() => {
    const f = (majorOptions as any).find((m: any) => m.code === majorCode)
    return f ? f.name : '분류 선택'
  }, [majorCode, majorOptions])
  const middleLabel = useMemo(() => {
    const f = (middleOptions as any).find((m: any) => m.code === middleCode)
    return f ? `${f.name} (${f.code})` : '세부 분류 선택'
  }, [middleCode, middleOptions])

  useEffect(() => {
    AsyncStorage.getItem('applicantResumeDraft').then((saved) => {
      if (saved) {
        const d = JSON.parse(saved)
        setCareerType((d.careerType as CareerType) ?? 'newcomer')
        setName(d.name ?? '')
        setBirth(d.birth ?? '')
        setGender((d.gender as Gender) ?? 'male')
        setEmail(d.email ?? '')
        setPhone(d.phone ?? '')
        setTel(d.tel ?? '')
        setZipcode(d.zipcode ?? '')
        setAddress(d.address ?? '')
        setAddressDetail(d.addressDetail ?? '')
        setPhotoUri(d.photoUri ?? '')
        setMajorCode(d.majorCode ?? 'IT')
        setMiddleCode(d.middleCode ?? 'IT05')
        setLocation(d.location ?? '')
        setSalaryMin(String(d.salaryMin ?? ''))
        setSalaryMax(String(d.salaryMax ?? ''))
        setWorkTypes(Array.isArray(d.workTypes) ? d.workTypes : [])
        setEducations(Array.isArray(d.educations) && d.educations.length > 0 ? d.educations : [{ eduType: '', schoolName: '', major: '', eduStatus: '', eduStartDate: '', eduEndDate: '', grade: '', gradeMax: '4.5', subMajorType: '', subMajor: '', thesis: '' }])
        setCareers(Array.isArray(d.careers) && d.careers.length > 0 ? d.careers : [{ companyName: '', department: '', careerStartDate: '', careerEndDate: '', isWorking: false, rank: '', position: '', jobDuty: '', salary: '', workDescription: '' }])
        setCareerDescription(d.careerDescription ?? '')
        setSkills(Array.isArray(d.skills) ? d.skills : ['JavaScript', 'React'])
        setCertificates(Array.isArray(d.certificates) && d.certificates.length > 0 ? d.certificates : [{ certName: '', certIssuer: '', certDate: '' }])
        setLanguages(Array.isArray(d.languages) && d.languages.length > 0 ? d.languages : [{ language: '', langTest: '', langScore: '', langDate: '' }])
        setActivities(Array.isArray(d.activities) && d.activities.length > 0 ? d.activities : [{ activityType: '', activityName: '', activityOrg: '', activityStart: '', activityEnd: '', activityDesc: '' }])
        setPortfolioUrls(Array.isArray(d.portfolioUrls) && d.portfolioUrls.length > 0 ? d.portfolioUrls : [{ urlType: 'portfolio', url: '' }])
        setPortfolioFiles(Array.isArray(d.portfolioFiles) ? d.portfolioFiles : [])
        setIntro1(d.intro1 ?? '')
        setIntro2(d.intro2 ?? '')
        setIntro3(d.intro3 ?? '')
        setIntro4(d.intro4 ?? '')
        setMilitary(d.military ?? '')
        setMilitaryBranch(d.militaryBranch ?? '')
        setMilitaryStart(d.militaryStart ?? '')
        setMilitaryEnd(d.militaryEnd ?? '')
        setMilitaryRank(d.militaryRank ?? '')
        setDisability(d.disability ?? '')
        setVeteran(d.veteran ?? '')
      }
    })
  }, [])

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
    navigation.navigate('RecruitmentList')
  }

  const selectMajor = (code: string) => {
    setMajorCode(code)
    const nextMiddles = ((common as any).middleCategories as Array<any>).filter((m) => m.majorCode === code)
    setMiddleCode(nextMiddles[0]?.code ?? '')
  }
  const selectMiddle = (code: string) => setMiddleCode(code)

  const toggleWorkType = (code: string) => {
    setWorkTypes((prev) => (prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code]))
  }

  const addEducation = () => {
    setEducations((prev) => [...prev, { eduType: '', schoolName: '', major: '', eduStatus: '', eduStartDate: '', eduEndDate: '', grade: '', gradeMax: '4.5', subMajorType: '', subMajor: '', thesis: '' }])
  }
  const removeEducation = (idx: number) => {
    setEducations((prev) => {
      if (prev.length <= 1) {
        Alert.alert('안내', '최소 1개 항목이 필요합니다.')
        return prev
      }
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
  }
  const updateEducation = (idx: number, patch: Partial<EducationItem>) => {
    setEducations((prev) => prev.map((e, i) => (i === idx ? { ...e, ...patch } : e)))
  }

  const addCareer = () => {
    setCareers((prev) => [...prev, { companyName: '', department: '', careerStartDate: '', careerEndDate: '', isWorking: false, rank: '', position: '', jobDuty: '', salary: '', workDescription: '' }])
  }
  const removeCareer = (idx: number) => {
    setCareers((prev) => {
      if (prev.length <= 1) {
        Alert.alert('안내', '최소 1개 항목이 필요합니다.')
        return prev
      }
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
  }
  const updateCareer = (idx: number, patch: Partial<CareerItem>) => {
    setCareers((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)))
  }

  const addCertificate = () => setCertificates((prev) => [...prev, { certName: '', certIssuer: '', certDate: '' }])
  const removeCertificate = (idx: number) => {
    setCertificates((prev) => {
      if (prev.length <= 1) {
        Alert.alert('안내', '최소 1개 항목이 필요합니다.')
        return prev
      }
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
  }
  const updateCertificate = (idx: number, patch: Partial<CertificateItem>) => {
    setCertificates((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)))
  }

  const addLanguage = () => setLanguages((prev) => [...prev, { language: '', langTest: '', langScore: '', langDate: '' }])
  const removeLanguage = (idx: number) => {
    setLanguages((prev) => {
      if (prev.length <= 1) {
        Alert.alert('안내', '최소 1개 항목이 필요합니다.')
        return prev
      }
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
  }
  const updateLanguage = (idx: number, patch: Partial<LanguageItem>) => {
    setLanguages((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)))
  }

  const addActivity = () => setActivities((prev) => [...prev, { activityType: '', activityName: '', activityOrg: '', activityStart: '', activityEnd: '', activityDesc: '' }])
  const removeActivity = (idx: number) => {
    setActivities((prev) => {
      if (prev.length <= 1) {
        Alert.alert('안내', '최소 1개 항목이 필요합니다.')
        return prev
      }
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
  }
  const updateActivity = (idx: number, patch: Partial<ActivityItem>) => {
    setActivities((prev) => prev.map((a, i) => (i === idx ? { ...a, ...patch } : a)))
  }

  const addPortfolioUrl = () => setPortfolioUrls((prev) => [...prev, { urlType: 'portfolio', url: '' }])
  const removePortfolioUrl = (idx: number) => {
    setPortfolioUrls((prev) => {
      if (prev.length <= 1) {
        Alert.alert('안내', '최소 1개 항목이 필요합니다.')
        return prev
      }
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
  }
  const updatePortfolioUrl = (idx: number, patch: Partial<PortfolioURL>) => {
    setPortfolioUrls((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)))
  }

  const addSkill = () => {
    const s = skillInput.trim()
    if (!s) return
    const count = skills.length
    if (count >= 20) {
      Alert.alert('안내', '스킬은 최대 20개까지 추가할 수 있습니다.')
      return
    }
    setSkills((prev) => [...prev, s])
    setSkillInput('')
  }
  const removeSkill = (idx: number) => setSkills((prev) => prev.filter((_, i) => i !== idx))

  const pickPhoto = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: 'image/*', copyToCacheDirectory: true })
    const asset = (res as any)?.assets?.[0]
    if (!(res as any)?.canceled && asset?.uri) {
      setPhotoUri(asset.uri)
    }
  }

  const addPortfolioFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
    const asset = (res as any)?.assets?.[0]
    if (!(res as any)?.canceled && asset?.name && asset?.uri) {
      setPortfolioFiles((prev) => [...prev, { id: Date.now(), name: asset.name, uri: asset.uri }])
    }
  }
  const removePortfolioFile = (id: number) => setPortfolioFiles((prev) => prev.filter((f) => f.id !== id))

  const searchAddress = () => {
    Alert.alert('안내', '주소 검색 기능은 실제 서비스에서 우편번호 API와 연동됩니다.')
  }

  const requiredOk = useMemo(() => {
    const n = name.trim()
    const b = birth.trim()
    const e = email.trim()
    const p = phone.trim()
    const mc = majorCode.trim()
    const md = middleCode.trim()
    const eduOk = educations.every((it) => it.eduType && it.schoolName && it.major && it.eduStatus && it.eduStartDate && it.eduEndDate)
    const intro3Ok = intro3.trim().length > 0
    if (!(n && b && gender && e && p && mc && md && eduOk && intro3Ok)) return false
    if (careerType === 'experienced') {
      const locOk = !!location
      const smin = Number(salaryMin)
      const smax = Number(salaryMax)
      const wtOk = workTypes.length > 0
      if (!(locOk && !Number.isNaN(smin) && !Number.isNaN(smax) && wtOk)) return false
    }
    return true
  }, [name, birth, gender, email, phone, majorCode, middleCode, educations, intro3, careerType, location, salaryMin, salaryMax, workTypes])

  const collectPayload = () => {
    return {
      careerType,
      name,
      birth,
      gender,
      email,
      phone,
      tel,
      zipcode,
      address,
      addressDetail,
      photoUri,
      majorCode,
      middleCode,
      location,
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      workTypes,
      educations,
      careers,
      careerDescription,
      skills,
      certificates,
      languages,
      activities,
      portfolioUrls,
      portfolioFiles,
      intro1,
      intro2,
      intro3,
      intro4,
      military,
      militaryBranch,
      militaryStart,
      militaryEnd,
      militaryRank,
      disability,
      veteran,
    }
  }

  const saveDraft = async () => {
    const payload = collectPayload()
    await AsyncStorage.setItem('applicantResumeDraft', JSON.stringify(payload))
    Alert.alert('임시저장', '임시저장되었습니다.')
  }

  const submit = () => {
    if (!requiredOk) {
      Alert.alert('안내', '필수 항목을 모두 입력해 주세요.')
      return
    }
    const payload = collectPayload()
    Alert.alert('제출', '이력서가 제출되었습니다.')
    navigation.navigate('RecruitmentList')
  }

  const provinceOptions = [
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
  ]

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>이력서 작성</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>0</Text></View><Text style={styles.sectionTitle}>경력 구분 선택</Text></View>
          </View>
          <View style={styles.grid}>
            <TouchableOpacity style={[styles.gridItem, careerType === 'newcomer' && styles.gridItemOn]} onPress={() => setCareerType('newcomer')}>
              <Text style={styles.gridName}>신입</Text>
              <Text style={styles.gridCode}>경력 없음 / 1년 미만</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.gridItem, careerType === 'experienced' && styles.gridItemOn]} onPress={() => setCareerType('experienced')}>
              <Text style={styles.gridName}>경력</Text>
              <Text style={styles.gridCode}>1년 이상 경력자</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>1</Text></View><Text style={styles.sectionTitle}>인적사항</Text></View>
          </View>
          <View style={{ rowGap: 16 }}>
            <View style={styles.formGrid2}>
              <View style={[styles.formGroup, col3]}><Text style={styles.label}>이름 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={styles.input} value={name} onChangeText={setName} placeholder="홍길동" /></View>
              <View style={[styles.formGroup, col3]}><Text style={styles.label}>생년월일 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={styles.input} value={birth} onChangeText={setBirth} placeholder="YYYY-MM-DD" /></View>
              <View style={[styles.formGroup, col3]}><Text style={styles.label}>성별 <Text style={styles.requiredMark}>*</Text></Text><View style={styles.optionRow}>{['male','female'].map((g) => (
                <TouchableOpacity key={`g-${g}`} style={[styles.optionChip, gender === g && styles.optionChipOn]} onPress={() => setGender(g as Gender)}>
                  <Text style={[styles.optionChipText, gender === g && styles.optionChipTextOn]}>{g === 'male' ? '남성' : '여성'}</Text>
                </TouchableOpacity>
              ))}</View></View>
              <View style={[styles.formGroup, col3]}><Text style={styles.label}>이메일 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="example@email.com" keyboardType="email-address" /></View>
              <View style={[styles.formGroup, col3]}><Text style={styles.label}>휴대폰번호 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="010-1234-5678" keyboardType="phone-pad" /></View>
              <View style={[styles.formGroup, col3]}><Text style={styles.label}>전화번호</Text><TextInput style={styles.input} value={tel} onChangeText={setTel} placeholder="02-1234-5678" keyboardType="phone-pad" /></View>
            </View>
            <View style={styles.formGroup}><Text style={styles.label}>주소</Text><View style={styles.inlineRow}><TextInput style={[styles.input, styles.inputZip]} value={zipcode} onChangeText={setZipcode} placeholder="우편번호" /><TouchableOpacity style={styles.btnSecondary} onPress={searchAddress}><Text style={styles.btnSecondaryText}>주소 검색</Text></TouchableOpacity></View><TextInput style={[styles.input, { marginTop: 8 }]} value={address} onChangeText={setAddress} placeholder="기본 주소" /><TextInput style={[styles.input, { marginTop: 8 }]} value={addressDetail} onChangeText={setAddressDetail} placeholder="상세 주소" /></View>
            <View style={styles.formGroup}><Text style={styles.label}>프로필 사진</Text><View style={styles.photoRow}><TouchableOpacity style={styles.photoPreview} onPress={pickPhoto}>{photoUri ? (<Image source={{ uri: photoUri }} style={styles.photoImage} />) : (<Text style={styles.photoPlaceholder}>사진 등록{"\n"}(3x4 비율)</Text>)}</TouchableOpacity><View style={{ rowGap: 6 }}><Text style={styles.hint}>JPG, PNG 파일만 가능</Text><Text style={styles.hint}>최대 5MB</Text></View></View></View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>2</Text></View><Text style={styles.sectionTitle}>희망근무조건</Text></View>
          </View>
          <View style={{ rowGap: 16 }}>
            <View style={styles.formGroup}><Text style={styles.label}>희망직무 (대분류) <Text style={styles.requiredMark}>*</Text></Text><View style={styles.selector}><TouchableOpacity style={styles.selectorBox} activeOpacity={0.8} onPress={() => setOpenMajor((v) => !v)}><Text style={styles.selectorText}>{majorLabel}</Text><FontAwesome5 name={openMajor ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" /></TouchableOpacity>{openMajor && (<View style={styles.selectorList}>{majorOptions.map((m) => (<TouchableOpacity key={`major-${m.code}`} style={styles.selectorItem} onPress={() => { selectMajor(m.code); setOpenMajor(false) }}><Text style={styles.selectorItemText}>{m.name}</Text><Text style={styles.selectorItemCode}>{m.code}</Text></TouchableOpacity>))}</View>)}</View></View>
            <View style={styles.formGroup}><Text style={styles.label}>희망직무 (중분류) <Text style={styles.requiredMark}>*</Text></Text><View style={styles.selector}><TouchableOpacity style={styles.selectorBox} activeOpacity={0.8} onPress={() => setOpenMiddle((v) => !v)}><Text style={styles.selectorText}>{middleLabel}</Text><FontAwesome5 name={openMiddle ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" /></TouchableOpacity>{openMiddle && (<View style={styles.selectorList}>{middleOptions.map((s: any) => (<TouchableOpacity key={`mid-${s.code}`} style={styles.selectorItem} onPress={() => { selectMiddle(s.code); setOpenMiddle(false) }}><Text style={styles.selectorItemText}>{s.name}</Text><Text style={styles.selectorItemCode}>{s.code}</Text></TouchableOpacity>))}</View>)}</View></View>
            <View style={styles.formGroup}><Text style={styles.label}>희망근무지 {careerType === 'experienced' ? <Text style={styles.requiredMark}>*</Text> : null}</Text><View style={styles.optionRow}>{provinceOptions.map((opt) => (
              <TouchableOpacity key={`loc-${opt.code}`} style={[styles.optionChip, location === opt.code && styles.optionChipOn]} onPress={() => setLocation(opt.code)}>
                <Text style={[styles.optionChipText, location === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}</View></View>
            <View style={styles.formGroup}><Text style={styles.label}>희망연봉 {careerType === 'experienced' ? <Text style={styles.requiredMark}>*</Text> : null}</Text><View style={styles.inlineRow}><TextInput style={[styles.input, styles.inputNumber]} value={salaryMin} onChangeText={setSalaryMin} placeholder="최소" keyboardType="numeric" /><Text style={styles.inlineLabel}>~</Text><TextInput style={[styles.input, styles.inputNumber]} value={salaryMax} onChangeText={setSalaryMax} placeholder="최대" keyboardType="numeric" /><Text style={styles.inlineLabel}>만원</Text></View></View>
            <View style={styles.formGroup}><Text style={styles.label}>근무형태 {careerType === 'experienced' ? <Text style={styles.requiredMark}>*</Text> : null}</Text><View style={styles.optionRow}>{[
              { code: 'fulltime', label: '정규직' },
              { code: 'contract', label: '계약직' },
              { code: 'intern', label: '인턴' },
              { code: 'parttime', label: '아르바이트' },
              { code: 'freelance', label: '프리랜서' },
            ].map((opt) => (
              <TouchableOpacity key={`wt-${opt.code}`} style={[styles.optionChip, workTypes.includes(opt.code) && styles.optionChipOn]} onPress={() => toggleWorkType(opt.code)}>
                <Text style={[styles.optionChipText, workTypes.includes(opt.code) && styles.optionChipTextOn]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}</View></View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>3</Text></View><Text style={styles.sectionTitle}>학력</Text></View>
            <TouchableOpacity style={styles.btnSecondary} onPress={addEducation}><FontAwesome5 name="plus" size={12} color="#FFFFFF" /><Text style={styles.btnSecondaryText}>학력 추가</Text></TouchableOpacity>
          </View>
          <View style={{ rowGap: 12 }}>
            {educations.map((ed, idx) => (
              <View key={`edu-${idx}`} style={styles.dynamicCard}>
                <TouchableOpacity style={styles.removeBadge} onPress={() => removeEducation(idx)}><Text style={styles.removeBadgeText}>×</Text></TouchableOpacity>
                <View style={styles.formGrid2}>
                  <View style={[styles.formGroup, col3]}><Text style={styles.label}>학교구분 <Text style={styles.requiredMark}>*</Text></Text><View style={styles.optionRow}>{[
                    { code: 'high', label: '고등학교' },
                    { code: 'college2', label: '대학(2,3년제)' },
                    { code: 'college4', label: '대학교(4년제)' },
                    { code: 'graduate', label: '대학원' },
                  ].map((opt) => (
                    <TouchableOpacity key={`etype-${opt.code}`} style={[styles.optionChip, ed.eduType === opt.code && styles.optionChipOn]} onPress={() => updateEducation(idx, { eduType: opt.code })}>
                      <Text style={[styles.optionChipText, ed.eduType === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}</View></View>
                  <View style={[styles.formGroup, col3]}><Text style={styles.label}>학교명 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={styles.input} value={ed.schoolName} onChangeText={(v) => updateEducation(idx, { schoolName: v })} placeholder="학교명 입력" /></View>
                  <View style={[styles.formGroup, col3]}><Text style={styles.label}>전공 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={styles.input} value={ed.major} onChangeText={(v) => updateEducation(idx, { major: v })} placeholder="전공명 입력" /></View>
                  <View style={[styles.formGroup, col3]}><Text style={styles.label}>졸업상태 <Text style={styles.requiredMark}>*</Text></Text><View style={styles.optionRow}>{[
                    { code: 'graduated', label: '졸업' },
                    { code: 'expected', label: '졸업예정' },
                    { code: 'enrolled', label: '재학중' },
                    { code: 'leave', label: '휴학' },
                    { code: 'dropout', label: '중퇴' },
                    { code: 'completed', label: '수료' },
                  ].map((opt) => (
                    <TouchableOpacity key={`estatus-${opt.code}`} style={[styles.optionChip, ed.eduStatus === opt.code && styles.optionChipOn]} onPress={() => updateEducation(idx, { eduStatus: opt.code })}>
                      <Text style={[styles.optionChipText, ed.eduStatus === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}</View></View>
                  <View style={[styles.formGroup, col3]}><Text style={styles.label}>입학년월 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={styles.input} value={ed.eduStartDate} onChangeText={(v) => updateEducation(idx, { eduStartDate: v })} placeholder="YYYY-MM" /></View>
                  <View style={[styles.formGroup, col3]}><Text style={styles.label}>졸업년월 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={styles.input} value={ed.eduEndDate} onChangeText={(v) => updateEducation(idx, { eduEndDate: v })} placeholder="YYYY-MM" /></View>
                  <View style={[styles.formGroup, col3]}><Text style={styles.label}>학점</Text><View style={styles.inlineRow}><TextInput style={[styles.input, { flex: 1 }]} value={ed.grade} onChangeText={(v) => updateEducation(idx, { grade: v })} placeholder="3.5" /><Text style={styles.inlineLabel}>/</Text><View style={styles.optionRow}>{['4.5','4.3','4.0','100'].map((gm) => (
                    <TouchableOpacity key={`gmax-${gm}`} style={[styles.optionChip, ed.gradeMax === gm && styles.optionChipOn]} onPress={() => updateEducation(idx, { gradeMax: gm })}>
                      <Text style={[styles.optionChipText, ed.gradeMax === gm && styles.optionChipTextOn]}>{gm}</Text>
                    </TouchableOpacity>
                  ))}</View></View></View>
                  <View style={[styles.formGroup, col3]}><Text style={styles.label}>복수/부전공</Text><View style={styles.inlineRow}><View style={styles.optionRow}>{[
                    { code: '', label: '선택' },
                    { code: 'double', label: '복수전공' },
                    { code: 'minor', label: '부전공' },
                    { code: 'dual', label: '이중전공' },
                  ].map((opt) => (
                    <TouchableOpacity key={`smt-${opt.code}`} style={[styles.optionChip, ed.subMajorType === opt.code && styles.optionChipOn]} onPress={() => updateEducation(idx, { subMajorType: opt.code })}>
                      <Text style={[styles.optionChipText, ed.subMajorType === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}</View><TextInput style={[styles.input, { flex: 1 }]} value={ed.subMajor} onChangeText={(v) => updateEducation(idx, { subMajor: v })} placeholder="전공명" /></View></View>
                  <View style={styles.formGroupFull}><Text style={styles.label}>졸업논문/작품</Text><TextInput style={styles.input} value={ed.thesis} onChangeText={(v) => updateEducation(idx, { thesis: v })} placeholder="졸업논문 또는 졸업작품명" /></View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {careerType === 'experienced' ? (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>4</Text></View><Text style={styles.sectionTitle}>경력</Text></View>
              <TouchableOpacity style={styles.btnSecondary} onPress={addCareer}><FontAwesome5 name="plus" size={12} color="#FFFFFF" /><Text style={styles.btnSecondaryText}>경력 추가</Text></TouchableOpacity>
            </View>
            <View style={styles.sectionDesc}><Text style={styles.sectionDescText}>경력사항을 최신순으로 입력해주세요. 상세할수록 합격률이 높아집니다.</Text></View>
            <View style={{ rowGap: 12 }}>
              {careers.map((cr, idx) => (
                <View key={`cr-${idx}`} style={styles.dynamicCard}>
                  <TouchableOpacity style={styles.removeBadge} onPress={() => removeCareer(idx)}><Text style={styles.removeBadgeText}>×</Text></TouchableOpacity>
                  <View style={styles.formGrid2}>
                  <View style={[styles.formGroup, col2]}><Text style={styles.label}>회사명 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={styles.input} value={cr.companyName} onChangeText={(v) => updateCareer(idx, { companyName: v })} placeholder="회사명 입력" /></View>
                  <View style={[styles.formGroup, col2]}><Text style={styles.label}>부서명 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={styles.input} value={cr.department} onChangeText={(v) => updateCareer(idx, { department: v })} placeholder="부서명 입력" /></View>
                  <View style={[styles.formGroup, col2]}><Text style={styles.label}>입사년월 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={styles.input} value={cr.careerStartDate} onChangeText={(v) => updateCareer(idx, { careerStartDate: v })} placeholder="YYYY-MM" /></View>
                  <View style={[styles.formGroup, col2]}><Text style={styles.label}>퇴사년월 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={[styles.input, cr.isWorking && styles.inputDisabled]} value={cr.careerEndDate} onChangeText={(v) => updateCareer(idx, { careerEndDate: v })} placeholder={cr.isWorking ? '재직중' : 'YYYY-MM'} editable={!cr.isWorking} /><View style={styles.workingRow}><TouchableOpacity style={[styles.checkbox, cr.isWorking && styles.checkboxOn]} onPress={() => updateCareer(idx, { isWorking: !cr.isWorking })} /><Text style={styles.inlineLabel}>재직중</Text></View></View>
                    <View style={[styles.formGroup, col2]}><Text style={styles.label}>직급 <Text style={styles.requiredMark}>*</Text></Text><View style={styles.optionRow}>{[
                      { code: 'staff', label: '사원' },
                      { code: 'senior', label: '주임/계장' },
                      { code: 'assistant', label: '대리' },
                      { code: 'manager', label: '과장' },
                      { code: 'deputy', label: '차장' },
                      { code: 'general', label: '부장' },
                      { code: 'executive', label: '임원' },
                      { code: 'researcher', label: '연구원' },
                      { code: 'seniorResearcher', label: '선임연구원' },
                      { code: 'principalResearcher', label: '책임연구원' },
                    ].map((opt) => (
                      <TouchableOpacity key={`rk-${opt.code}`} style={[styles.optionChip, cr.rank === opt.code && styles.optionChipOn]} onPress={() => updateCareer(idx, { rank: opt.code })}>
                        <Text style={[styles.optionChipText, cr.rank === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}</View></View>
                    <View style={[styles.formGroup, col2]}><Text style={styles.label}>직책 <Text style={styles.requiredMark}>*</Text></Text><View style={styles.optionRow}>{[
                      { code: 'member', label: '팀원' },
                      { code: 'teamLead', label: '팀장' },
                      { code: 'partLead', label: '파트장' },
                      { code: 'groupLead', label: '그룹장' },
                      { code: 'deptHead', label: '실장' },
                      { code: 'divHead', label: '본부장' },
                      { code: 'branchMgr', label: '지점장' },
                      { code: 'centerHead', label: '센터장' },
                    ].map((opt) => (
                      <TouchableOpacity key={`pos-${opt.code}`} style={[styles.optionChip, cr.position === opt.code && styles.optionChipOn]} onPress={() => updateCareer(idx, { position: opt.code })}>
                        <Text style={[styles.optionChipText, cr.position === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}</View></View>
                    <View style={[styles.formGroup, col2]}><Text style={styles.label}>담당직무 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={styles.input} value={cr.jobDuty} onChangeText={(v) => updateCareer(idx, { jobDuty: v })} placeholder="담당 직무 입력" /></View>
                    <View style={[styles.formGroup, col2]}><Text style={styles.label}>연봉</Text><View style={styles.inlineRow}><TextInput style={[styles.input, { flex: 1 }]} value={cr.salary} onChangeText={(v) => updateCareer(idx, { salary: v })} placeholder="연봉" keyboardType="numeric" /><Text style={styles.inlineLabel}>만원</Text></View></View>
                    <View style={styles.formGroupFull}><Text style={styles.label}>담당업무 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={[styles.input, { height: 120, textAlignVertical: 'top' }]} value={cr.workDescription} onChangeText={(v) => updateCareer(idx, { workDescription: v })} placeholder={'담당하신 업무와 성과에 대해 구체적으로 작성해주세요.\n- 주요 업무 내용\n- 달성한 성과 (수치로 표현하면 좋습니다)\n- 사용한 기술/도구'} multiline /></View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {careerType === 'experienced' ? (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>5</Text></View><Text style={styles.sectionTitle}>경력기술서</Text></View>
            </View>
            <View style={styles.sectionDesc}><Text style={styles.sectionDescText}>경력 전반에 대한 상세한 설명을 작성해주세요. 상황-행동-결과 형식을 추천합니다.</Text></View>
            <View style={styles.formGroup}><TextInput style={[styles.input, { height: 160, textAlignVertical: 'top' }]} value={careerDescription} onChangeText={setCareerDescription} placeholder={'예시)\n\n[프로젝트명] 신규 서비스 런칭 프로젝트\n- 기간: 2023.01 ~ 2023.06\n- 역할: 프로젝트 리더\n- 상황: 기존 서비스의 사용자 이탈률 증가로 신규 서비스 개발 필요\n- 행동: 사용자 리서치, 애자일 도입, 주간 스프린트 운영\n- 결과: 출시 3개월 만에 MAU 50만 달성, 이탈률 30% 감소'} multiline /></View>
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>6</Text></View><Text style={styles.sectionTitle}>보유 스킬</Text></View>
          </View>
          <View style={styles.sectionDesc}><Text style={styles.sectionDescText}>보유한 스킬을 추가해주세요. 최대 20개.</Text></View>
          <View style={styles.skillContainer}>
            {skills.map((s, i) => (
              <View key={`sk-${i}`} style={styles.skillTag}><Text style={styles.skillTagText}>{s}</Text><TouchableOpacity onPress={() => removeSkill(i)}><Text style={styles.skillRemove}>×</Text></TouchableOpacity></View>
            ))}
          </View>
          <View style={styles.skillInputRow}>
            <TextInput style={[styles.input, { flex: 1 }]} value={skillInput} onChangeText={setSkillInput} placeholder="스킬 입력" onSubmitEditing={addSkill} />
            <TouchableOpacity style={styles.btnSecondary} onPress={addSkill}><Text style={styles.btnSecondaryText}>추가</Text></TouchableOpacity>
          </View>
          <Text style={styles.hint}>Enter 키로도 추가할 수 있습니다.</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>7</Text></View><Text style={styles.sectionTitle}>자격증</Text></View>
            <TouchableOpacity style={styles.btnSecondary} onPress={addCertificate}><FontAwesome5 name="plus" size={12} color="#FFFFFF" /><Text style={styles.btnSecondaryText}>자격증 추가</Text></TouchableOpacity>
          </View>
          <View style={{ rowGap: 12 }}>
            {certificates.map((ci, idx) => (
              <View key={`cert-${idx}`} style={styles.dynamicCard}>
                <TouchableOpacity style={styles.removeBadge} onPress={() => removeCertificate(idx)}><Text style={styles.removeBadgeText}>×</Text></TouchableOpacity>
                <View style={styles.formGrid3}>
                  <View style={[styles.formGroup, col3]}><Text style={styles.label}>자격증명</Text><TextInput style={styles.input} value={ci.certName} onChangeText={(v) => updateCertificate(idx, { certName: v })} placeholder="자격증명" /></View>
                  <View style={[styles.formGroup, col3]}><Text style={styles.label}>발행처/기관</Text><TextInput style={styles.input} value={ci.certIssuer} onChangeText={(v) => updateCertificate(idx, { certIssuer: v })} placeholder="발행처" /></View>
                  <View style={[styles.formGroup, col3]}><Text style={styles.label}>취득일</Text><TextInput style={styles.input} value={ci.certDate} onChangeText={(v) => updateCertificate(idx, { certDate: v })} placeholder="YYYY-MM" /></View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>8</Text></View><Text style={styles.sectionTitle}>어학</Text></View>
            <TouchableOpacity style={styles.btnSecondary} onPress={addLanguage}><FontAwesome5 name="plus" size={12} color="#FFFFFF" /><Text style={styles.btnSecondaryText}>어학 추가</Text></TouchableOpacity>
          </View>
          <View style={{ rowGap: 12 }}>
            {languages.map((li, idx) => (
              <View key={`lang-${idx}`} style={styles.dynamicCard}>
                <TouchableOpacity style={styles.removeBadge} onPress={() => removeLanguage(idx)}><Text style={styles.removeBadgeText}>×</Text></TouchableOpacity>
                <View style={styles.formGrid2}>
                  <View style={[styles.formGroup, col2]}><Text style={styles.label}>언어</Text><View style={styles.optionRow}>{[
                    { code: '', label: '선택하세요' },
                    { code: 'english', label: '영어' },
                    { code: 'japanese', label: '일본어' },
                    { code: 'chinese', label: '중국어' },
                    { code: 'german', label: '독일어' },
                    { code: 'french', label: '프랑스어' },
                    { code: 'spanish', label: '스페인어' },
                    { code: 'other', label: '기타' },
                  ].map((opt) => (
                    <TouchableOpacity key={`lan-${opt.code}`} style={[styles.optionChip, li.language === opt.code && styles.optionChipOn]} onPress={() => updateLanguage(idx, { language: opt.code })}>
                      <Text style={[styles.optionChipText, li.language === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}</View></View>
                  <View style={[styles.formGroup, col2]}><Text style={styles.label}>시험명</Text><View style={styles.optionRow}>{[
                    { code: '', label: '선택하세요' },
                    { code: 'toeic', label: 'TOEIC' },
                    { code: 'toefl', label: 'TOEFL' },
                    { code: 'teps', label: 'TEPS' },
                    { code: 'opic', label: 'OPIc' },
                    { code: 'toeicSpeaking', label: 'TOEIC Speaking' },
                    { code: 'jlpt', label: 'JLPT' },
                    { code: 'jpt', label: 'JPT' },
                    { code: 'hsk', label: 'HSK' },
                    { code: 'other', label: '기타' },
                  ].map((opt) => (
                    <TouchableOpacity key={`lt-${opt.code}`} style={[styles.optionChip, li.langTest === opt.code && styles.optionChipOn]} onPress={() => updateLanguage(idx, { langTest: opt.code })}>
                      <Text style={[styles.optionChipText, li.langTest === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}</View></View>
                  <View style={[styles.formGroup, col2]}><Text style={styles.label}>점수/등급</Text><TextInput style={styles.input} value={li.langScore} onChangeText={(v) => updateLanguage(idx, { langScore: v })} placeholder="점수 또는 등급" /></View>
                  <View style={[styles.formGroup, col2]}><Text style={styles.label}>취득일</Text><TextInput style={styles.input} value={li.langDate} onChangeText={(v) => updateLanguage(idx, { langDate: v })} placeholder="YYYY-MM" /></View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>9</Text></View><Text style={styles.sectionTitle}>대외활동</Text></View>
            <TouchableOpacity style={styles.btnSecondary} onPress={addActivity}><FontAwesome5 name="plus" size={12} color="#FFFFFF" /><Text style={styles.btnSecondaryText}>활동 추가</Text></TouchableOpacity>
          </View>
          <View style={{ rowGap: 12 }}>
            {activities.map((ai, idx) => (
              <View key={`act-${idx}`} style={styles.dynamicCard}>
                <TouchableOpacity style={styles.removeBadge} onPress={() => removeActivity(idx)}><Text style={styles.removeBadgeText}>×</Text></TouchableOpacity>
                <View style={styles.formGrid2}>
                  <View style={[styles.formGroup, col2]}><Text style={styles.label}>활동구분</Text><View style={styles.optionRow}>{[
                    { code: '', label: '선택하세요' },
                    { code: 'award', label: '수상내역' },
                    { code: 'intern', label: '인턴' },
                    { code: 'volunteer', label: '봉사활동' },
                    { code: 'club', label: '동아리' },
                    { code: 'external', label: '대외활동' },
                    { code: 'education', label: '교육이수' },
                    { code: 'project', label: '프로젝트' },
                  ].map((opt) => (
                    <TouchableOpacity key={`at-${opt.code}`} style={[styles.optionChip, ai.activityType === opt.code && styles.optionChipOn]} onPress={() => updateActivity(idx, { activityType: opt.code })}>
                      <Text style={[styles.optionChipText, ai.activityType === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}</View></View>
                  <View style={[styles.formGroup, col2]}><Text style={styles.label}>활동명</Text><TextInput style={styles.input} value={ai.activityName} onChangeText={(v) => updateActivity(idx, { activityName: v })} placeholder="활동명" /></View>
                  <View style={[styles.formGroup, col2]}><Text style={styles.label}>기관/단체명</Text><TextInput style={styles.input} value={ai.activityOrg} onChangeText={(v) => updateActivity(idx, { activityOrg: v })} placeholder="기관 또는 단체명" /></View>
                  <View style={[styles.formGroup, col2]}><Text style={styles.label}>활동기간</Text><View style={styles.inlineRow}><TextInput style={[styles.input, styles.inputDate]} value={ai.activityStart} onChangeText={(v) => updateActivity(idx, { activityStart: v })} placeholder="YYYY-MM" /><Text style={styles.inlineLabel}>~</Text><TextInput style={[styles.input, styles.inputDate]} value={ai.activityEnd} onChangeText={(v) => updateActivity(idx, { activityEnd: v })} placeholder="YYYY-MM" /></View></View>
                  <View style={styles.formGroupFull}><Text style={styles.label}>활동내용</Text><TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} value={ai.activityDesc} onChangeText={(v) => updateActivity(idx, { activityDesc: v })} placeholder="활동 내용을 간략히 작성해주세요." multiline /></View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>10</Text></View><Text style={styles.sectionTitle}>포트폴리오</Text></View>
          </View>
          <View style={styles.formGroup}><Text style={styles.label}>URL 링크</Text><View style={{ rowGap: 8 }}>{portfolioUrls.map((pu, idx) => (
            <View key={`pu-${idx}`} style={styles.inlineRow}>
              <View style={{ width: 160 }}>
                <View style={styles.selector}><TouchableOpacity style={styles.selectorBox} activeOpacity={0.8}>
                  <Text style={styles.selectorText}>{pu.urlType === 'portfolio' ? '포트폴리오' : pu.urlType === 'github' ? 'GitHub' : pu.urlType === 'blog' ? '블로그' : pu.urlType === 'linkedin' ? 'LinkedIn' : '기타'}</Text>
                </TouchableOpacity>
                <View style={styles.selectorList}>
                  {[
                    { code: 'portfolio', label: '포트폴리오' },
                    { code: 'github', label: 'GitHub' },
                    { code: 'blog', label: '블로그' },
                    { code: 'linkedin', label: 'LinkedIn' },
                    { code: 'other', label: '기타' },
                  ].map((opt) => (
                    <TouchableOpacity key={`urlt-${opt.code}`} style={styles.selectorItem} onPress={() => updatePortfolioUrl(idx, { urlType: opt.code })}>
                      <Text style={styles.selectorItemText}>{opt.label}</Text>
                      <Text style={styles.selectorItemCode}>{opt.code}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              </View>
              <TextInput style={[styles.input, { flex: 1 }]} value={pu.url} onChangeText={(v) => updatePortfolioUrl(idx, { url: v })} placeholder="https://" />
              <TouchableOpacity style={styles.btnSecondary} onPress={addPortfolioUrl}><Text style={styles.btnSecondaryText}>+</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnDanger} onPress={() => removePortfolioUrl(idx)}><FontAwesome5 name="trash" size={12} color="#FFFFFF" /><Text style={styles.btnDangerText}>삭제</Text></TouchableOpacity>
            </View>
          ))}</View></View>
          <View style={[styles.formGroup, { marginTop: 12 }]}><Text style={styles.label}>파일 첨부</Text><View style={styles.uploadBox}><FontAwesome5 name="folder" size={24} color="#2563EB" /><Text style={styles.uploadText}>클릭하여 파일을 업로드하세요</Text><Text style={styles.hint}>PDF, PPT, ZIP (최대 10MB)</Text><TouchableOpacity style={[styles.btnSecondary, { marginTop: 10 }]} onPress={addPortfolioFile}><Text style={styles.btnSecondaryText}>파일 선택</Text></TouchableOpacity></View><View style={{ rowGap: 8, marginTop: 8 }}>{portfolioFiles.map((f) => (
            <View key={`pf-${f.id}`} style={styles.dynamicItem}><FontAwesome5 name="paperclip" size={12} color="#2563EB" /><View style={{ flex: 1 }}><Text style={styles.inputText}>{f.name}</Text></View><TouchableOpacity style={styles.btnDanger} onPress={() => removePortfolioFile(f.id)}><FontAwesome5 name="trash" size={12} color="#FFFFFF" /><Text style={styles.btnDangerText}>삭제</Text></TouchableOpacity></View>
          ))}</View></View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>11</Text></View><Text style={styles.sectionTitle}>자기소개서 <Text style={styles.requiredMark}>*</Text></Text></View>
          </View>
          <View style={styles.sectionDesc}><Text style={styles.sectionDescText}>자신의 강점, 지원동기, 입사 후 포부 등을 작성해주세요.</Text></View>
          <View style={styles.formGroup}><Text style={styles.label}>성장과정 및 학창시절</Text><TextInput style={[styles.input, { height: 120, textAlignVertical: 'top' }]} value={intro1} onChangeText={setIntro1} placeholder="성장과정과 학창시절에 대해 작성해주세요." multiline /><Text style={styles.hint}>{intro1.length} / 1000자</Text></View>
          <View style={[styles.formGroup, { marginTop: 12 }]}><Text style={styles.label}>성격의 장단점</Text><TextInput style={[styles.input, { height: 120, textAlignVertical: 'top' }]} value={intro2} onChangeText={setIntro2} placeholder="본인의 성격에 대해 장점과 단점을 작성해주세요." multiline /><Text style={styles.hint}>{intro2.length} / 1000자</Text></View>
          <View style={[styles.formGroup, { marginTop: 12 }]}><Text style={styles.label}>지원동기 및 입사 후 포부 <Text style={styles.requiredMark}>*</Text></Text><TextInput style={[styles.input, { height: 120, textAlignVertical: 'top' }]} value={intro3} onChangeText={setIntro3} placeholder="지원하게 된 동기와 입사 후 이루고 싶은 목표를 작성해주세요." multiline /><Text style={styles.hint}>{intro3.length} / 1000자</Text></View>
          <View style={[styles.formGroup, { marginTop: 12 }]}><Text style={styles.label}>기타 자유기술</Text><TextInput style={[styles.input, { height: 120, textAlignVertical: 'top' }]} value={intro4} onChangeText={setIntro4} placeholder="추가로 어필하고 싶은 내용을 작성해주세요." multiline /><Text style={styles.hint}>{intro4.length} / 1000자</Text></View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><View style={styles.numberIcon}><Text style={styles.numberIconText}>12</Text></View><Text style={styles.sectionTitle}>병역 및 기타사항</Text></View>
          </View>
          <View style={styles.formGrid2}>
            <View style={[styles.formGroup, col2]}><Text style={styles.label}>병역구분</Text><View style={styles.optionRow}>{[
              { code: '', label: '선택하세요' },
              { code: 'completed', label: '군필' },
              { code: 'serving', label: '복무중' },
              { code: 'exempt', label: '면제' },
              { code: 'notYet', label: '미필' },
              { code: 'na', label: '해당없음' },
            ].map((opt) => (
              <TouchableOpacity key={`mil-${opt.code}`} style={[styles.optionChip, military === opt.code && styles.optionChipOn]} onPress={() => setMilitary(opt.code)}>
                <Text style={[styles.optionChipText, military === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}</View></View>
            <View style={[styles.formGroup, col2]}><Text style={styles.label}>군별</Text><View style={styles.optionRow}>{[
              { code: '', label: '선택하세요' },
              { code: 'army', label: '육군' },
              { code: 'navy', label: '해군' },
              { code: 'airforce', label: '공군' },
              { code: 'marine', label: '해병대' },
              { code: 'police', label: '의무경찰' },
              { code: 'fire', label: '의무소방' },
              { code: 'social', label: '사회복무요원' },
              { code: 'other', label: '기타' },
            ].map((opt) => (
              <TouchableOpacity key={`mb-${opt.code}`} style={[styles.optionChip, militaryBranch === opt.code && styles.optionChipOn]} onPress={() => setMilitaryBranch(opt.code)}>
                <Text style={[styles.optionChipText, militaryBranch === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}</View></View>
            <View style={[styles.formGroup, col2]}><Text style={styles.label}>복무기간</Text><View style={styles.inlineRow}><TextInput style={[styles.input, styles.inputDate]} value={militaryStart} onChangeText={setMilitaryStart} placeholder="YYYY-MM" /><Text style={styles.inlineLabel}>~</Text><TextInput style={[styles.input, styles.inputDate]} value={militaryEnd} onChangeText={setMilitaryEnd} placeholder="YYYY-MM" /></View></View>
            <View style={[styles.formGroup, col2]}><Text style={styles.label}>계급</Text><TextInput style={styles.input} value={militaryRank} onChangeText={setMilitaryRank} placeholder="예: 병장" /></View>
            <View style={[styles.formGroup, col2]}><Text style={styles.label}>장애여부</Text><View style={styles.optionRow}>{[
              { code: 'none', label: '비해당' },
              { code: 'yes', label: '해당' },
            ].map((opt) => (
              <TouchableOpacity key={`dis-${opt.code}`} style={[styles.optionChip, disability === opt.code && styles.optionChipOn]} onPress={() => setDisability(opt.code)}>
                <Text style={[styles.optionChipText, disability === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}</View></View>
            <View style={[styles.formGroup, col2]}><Text style={styles.label}>보훈대상</Text><View style={styles.optionRow}>{[
              { code: 'none', label: '비해당' },
              { code: 'yes', label: '해당' },
            ].map((opt) => (
              <TouchableOpacity key={`vet-${opt.code}`} style={[styles.optionChip, veteran === opt.code && styles.optionChipOn]} onPress={() => setVeteran(opt.code)}>
                <Text style={[styles.optionChipText, veteran === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}</View></View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.btnOutline} onPress={saveDraft}>
          <Text style={styles.btnOutlineText}>임시저장</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPrimary} onPress={submit}>
          <Text style={styles.btnPrimaryText}>이력서 제출</Text>
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

  section: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginHorizontal: 15, marginTop: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  numberIcon: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#667eea', alignItems: 'center', justifyContent: 'center' },
  numberIconText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },

  formGroup: { rowGap: 8 },
  formGroupFull: { rowGap: 8, flex: 1 },
  label: { fontSize: 13, color: '#374151', fontWeight: '700' },
  requiredMark: { color: '#DC2626' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#FFFFFF' },
  inputText: { fontSize: 13, color: '#111827' },
  inputDisabled: { backgroundColor: '#F3F4F6' },
  hint: { fontSize: 12, color: '#6B7280' },

  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, backgroundColor: '#FFFFFF' },
  optionChipOn: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  optionChipText: { fontSize: 12, color: '#111827', fontWeight: '600' },
  optionChipTextOn: { color: '#FFFFFF' },

  selector: { rowGap: 8 },
  selectorBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF' },
  selectorText: { fontSize: 14, color: '#111827', fontWeight: '600' },
  selectorList: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  selectorItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  selectorItemText: { fontSize: 14, color: '#111827' },
  selectorItemCode: { fontSize: 12, color: '#6B7280' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: { flex: 1, minWidth: 100, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, rowGap: 6 },
  gridItemOn: { borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.08)' },
  gridName: { fontSize: 13, color: '#111827', fontWeight: '700', textAlign: 'center' },
  gridCode: { fontSize: 11, color: '#6B7280' },

  inlineRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  inlineLabel: { fontSize: 12, color: '#6B7280' },
  inputNumber: { width: 90 },
  inputDate: { width: 140 },
  inputZip: { width: 140 },

  photoRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  photoPreview: { width: 120, height: 150, borderWidth: 2, borderStyle: 'dashed', borderColor: '#ddd', borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' },
  photoImage: { width: 116, height: 146, borderRadius: 8 },
  photoPlaceholder: { fontSize: 13, color: '#6B7280', textAlign: 'center' },

  dynamicCard: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', position: 'relative' },
  removeBadge: { position: 'absolute', right: 10, top: 10, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DC2626' },
  removeBadgeText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  formGrid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  formGrid3: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  skillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, minHeight: 60 },
  skillTag: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#667eea', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  skillTagText: { fontSize: 13, color: '#FFFFFF' },
  skillRemove: { fontSize: 14, color: '#FFFFFF' },
  skillInputRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, marginTop: 10 },

  uploadBox: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#ddd', borderRadius: 10, padding: 20, alignItems: 'center' },
  uploadText: { fontSize: 13, color: '#374151', marginTop: 8 },

  workingRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, marginTop: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' },
  checkboxOn: { backgroundColor: '#2563EB', borderColor: '#2563EB' },

  sectionDesc: { backgroundColor: '#F0F3FF', padding: 10, borderRadius: 8, marginBottom: 12 },
  sectionDescText: { fontSize: 13, color: '#2563EB' },

  dynamicItem: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },

  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#EEEEEE', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 13, fontWeight: '600' },
  btnSecondary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#2563EB', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnSecondaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnDanger: { flexDirection: 'row', alignItems: 'center', columnGap: 6, backgroundColor: '#DC2626', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnDangerText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', columnGap: 8 }
})
