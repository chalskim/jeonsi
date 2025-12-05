import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as DocumentPicker from 'expo-document-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import common from '../../data/common.json'

type EmploymentType = '정규직' | '계약직' | '인턴' | '파트타임'

type ProcessStep = { id: number; title: string; description: string }

type Attachment = { id: number; name: string; uri: string }

export default function RecruitmentInput() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [employmentType, setEmploymentType] = useState<EmploymentType>('정규직')

  const [majorCode, setMajorCode] = useState<string>('IT')
  const [middleCode, setMiddleCode] = useState<string>('IT05')
  const [openMajor, setOpenMajor] = useState(false)
  const [openMiddle, setOpenMiddle] = useState(false)

  const [jobDescription, setJobDescription] = useState('')

  const [experience, setExperience] = useState<string>('5')
  const [education, setEducation] = useState<string>('')
  const [requirements, setRequirements] = useState('')
  const [preferences, setPreferences] = useState('')

  const [salaryMin, setSalaryMin] = useState<string>('')
  const [salaryMax, setSalaryMax] = useState<string>('')
  const [location, setLocation] = useState('')
  const [workHours, setWorkHours] = useState('')
  const [benefits, setBenefits] = useState('')

  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    { id: 1, title: '서류 전형', description: '제출 서류 검토' },
    { id: 2, title: '1차 면접', description: '실무진 면접' },
    { id: 3, title: '2차 면접', description: '임원진 면접' },
    { id: 4, title: '최종 합격', description: '입사 통보 및 계약' },
  ])

  const [reqResume, setReqResume] = useState(true)
  const [reqCareer, setReqCareer] = useState(true)
  const [reqPortfolio, setReqPortfolio] = useState(false)
  const [reqCertificate, setReqCertificate] = useState(false)
  const [otherDocuments, setOtherDocuments] = useState('')

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')

  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [website, setWebsite] = useState('')

  const [attachments, setAttachments] = useState<Attachment[]>([])

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
    AsyncStorage.getItem('recruitmentDraft').then((saved) => {
      if (saved) {
        const data = JSON.parse(saved)
        setTitle(data.title ?? '')
        setDepartment(data.department ?? '')
        setEmploymentType((data.employmentType as EmploymentType) ?? '정규직')
        setMajorCode(data.majorCode ?? 'IT')
        setMiddleCode(data.middleCode ?? 'IT05')
        setJobDescription(data.jobDescription ?? '')
        setExperience(data.experience ?? '')
        setEducation(data.education ?? '')
        setRequirements(data.requirements ?? '')
        setPreferences(data.preferences ?? '')
        setSalaryMin(String(data.salaryMin ?? ''))
        setSalaryMax(String(data.salaryMax ?? ''))
        setLocation(data.location ?? '')
        setWorkHours(data.workHours ?? '')
        setBenefits(data.benefits ?? '')
        setProcessSteps(Array.isArray(data.processSteps) ? data.processSteps.map((ps: any, i: number) => ({ id: i + 1, title: ps.title ?? '', description: ps.description ?? '' })) : [])
        setReqResume(!!data.reqResume)
        setReqCareer(!!data.reqCareer)
        setReqPortfolio(!!data.reqPortfolio)
        setReqCertificate(!!data.reqCertificate)
        setOtherDocuments(data.otherDocuments ?? '')
        setStartDate(data.startDate ?? '')
        setEndDate(data.endDate ?? '')
        setAdditionalInfo(data.additionalInfo ?? '')
        setContactName(data.contactName ?? '')
        setContactPhone(data.contactPhone ?? '')
        setContactEmail(data.contactEmail ?? '')
        setWebsite(data.website ?? '')
        setAttachments(Array.isArray(data.attachments) ? data.attachments : [])
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

  const addStep = () => {
    setProcessSteps((prev) => [...prev, { id: Date.now(), title: '', description: '' }].map((s, idx) => ({ ...s, id: idx + 1 })))
  }
  const removeStep = (id: number) => {
    setProcessSteps((prev) => prev.filter((s) => s.id !== id).map((s, idx) => ({ ...s, id: idx + 1 })))
  }
  const moveUp = (id: number) => {
    setProcessSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === id)
      if (idx <= 0) return prev
      const next = [...prev]
      const t = next[idx - 1]
      next[idx - 1] = next[idx]
      next[idx] = t
      return next.map((s, i) => ({ ...s, id: i + 1 }))
    })
  }
  const moveDown = (id: number) => {
    setProcessSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === id)
      if (idx < 0 || idx >= prev.length - 1) return prev
      const next = [...prev]
      const t = next[idx + 1]
      next[idx + 1] = next[idx]
      next[idx] = t
      return next.map((s, i) => ({ ...s, id: i + 1 }))
    })
  }
  const updateStep = (id: number, patch: Partial<ProcessStep>) => {
    setProcessSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const addAttachment = async () => {
    const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
    const asset = (res as any)?.assets?.[0]
    if (!(res as any)?.canceled && asset?.name && asset?.uri) {
      setAttachments((prev) => [...prev, { id: Date.now(), name: asset.name, uri: asset.uri }])
    }
  }
  const removeAttachment = (id: number) => setAttachments((prev) => prev.filter((a) => a.id !== id))

  const requiredDocuments = useMemo(() => {
    const list: string[] = []
    if (reqResume) list.push('이력서')
    if (reqCareer) list.push('경력기술서')
    if (reqPortfolio) list.push('포트폴리오')
    if (reqCertificate) list.push('자격증 사본')
    return list
  }, [reqResume, reqCareer, reqPortfolio, reqCertificate])

  const canSubmit = useMemo(() => {
    const t = title.trim()
    const d = department.trim()
    const jd = jobDescription.trim()
    const sd = startDate.trim()
    const ed = endDate.trim()
    const loc = location.trim()
    const smin = Number(salaryMin)
    const smax = Number(salaryMax)
    return t && d && employmentType && majorCode && middleCode && jd && sd && ed && loc && !Number.isNaN(smin) && !Number.isNaN(smax)
  }, [title, department, employmentType, majorCode, middleCode, jobDescription, startDate, endDate, location, salaryMin, salaryMax])

  const collectPayload = () => {
    return {
      title,
      department,
      employmentType,
      majorCode,
      middleCode,
      jobDescription,
      experience,
      education,
      requirements,
      preferences,
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      location,
      workHours,
      benefits,
      processSteps: processSteps.map((s) => ({ title: s.title, description: s.description })),
      requiredDocuments,
      otherDocuments,
      startDate,
      endDate,
      additionalInfo,
      contactName,
      contactPhone,
      contactEmail,
      website,
      attachments,
    }
  }

  const saveDraft = async () => {
    const payload = collectPayload()
    await AsyncStorage.setItem('recruitmentDraft', JSON.stringify(payload))
    Alert.alert('임시저장', '임시저장되었습니다.')
  }

  const submit = () => {
    if (!canSubmit) {
      Alert.alert('안내', '필수 항목을 모두 입력해 주세요.')
      return
    }
    const payload = collectPayload()
    Alert.alert('등록', '채용 공고가 등록되었습니다.')
    navigation.navigate('RecruitmentList')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>채용 등록</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="info-circle" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>기본 정보</Text></View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>공고 제목</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="예: 보안 컨설턴트 (정규직)" />
            <Text style={styles.hint}>채용 포지션과 고용 형태를 명확히 기재해주세요.</Text>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>모집 부서</Text>
            <TextInput style={styles.input} value={department} onChangeText={setDepartment} placeholder="예: 정보보안팀" />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>고용 형태</Text>
            <View style={styles.optionRow}>
              {(['정규직','계약직','인턴','파트타임'] as EmploymentType[]).map((opt) => (
                <TouchableOpacity key={`emp-${opt}`} style={[styles.optionChip, employmentType === opt && styles.optionChipOn]} onPress={() => setEmploymentType(opt)}>
                  <Text style={[styles.optionChipText, employmentType === opt && styles.optionChipTextOn]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="tags" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>업무 분류</Text></View>
          </View>
          <View style={{ rowGap: 16 }}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>대분류</Text>
              <View style={styles.selector}>
                <TouchableOpacity style={styles.selectorBox} activeOpacity={0.8} onPress={() => setOpenMajor((v) => !v)}>
                  <Text style={styles.selectorText}>{majorLabel}</Text>
                  <FontAwesome5 name={openMajor ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
                </TouchableOpacity>
                {openMajor && (
                  <View style={styles.selectorList}>
                    {majorOptions.map((m) => (
                      <TouchableOpacity key={`major-${m.code}`} style={styles.selectorItem} onPress={() => { selectMajor(m.code); setOpenMajor(false) }}>
                        <Text style={styles.selectorItemText}>{m.name}</Text>
                        <Text style={styles.selectorItemCode}>{m.code}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>중분류</Text>
              <View style={styles.selector}>
                <TouchableOpacity style={styles.selectorBox} activeOpacity={0.8} onPress={() => setOpenMiddle((v) => !v)}>
                  <Text style={styles.selectorText}>{middleLabel}</Text>
                  <FontAwesome5 name={openMiddle ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
                </TouchableOpacity>
                {openMiddle && (
                  <View style={styles.selectorList}>
                    {middleOptions.map((s: any) => (
                      <TouchableOpacity key={`mid-${s.code}`} style={styles.selectorItem} onPress={() => { selectMiddle(s.code); setOpenMiddle(false) }}>
                        <Text style={styles.selectorItemText}>{s.name}</Text>
                        <Text style={styles.selectorItemCode}>{s.code}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="briefcase" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>담당 업무</Text></View>
          </View>
          <View style={styles.formGroup}>
            <TextInput style={[styles.input, { height: 140, textAlignVertical: 'top' }]} value={jobDescription} onChangeText={setJobDescription} placeholder={'담당할 업무 내용을 상세히 기재해주세요.\n\n예시:\n- 정보보호 컨설팅 서비스 기획 및 제공\n- ISMS-P 인증 컨설팅 및 지원\n- 개인정보보호 컨설팅 및 정책 수립 지원'} multiline />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="user-check" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>자격 요건</Text></View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>경력</Text>
            <View style={styles.optionRow}>
              {[
                { code: '', label: '선택해주세요' },
                { code: '0', label: '신입/경력무관' },
                { code: '1', label: '1년 이상' },
                { code: '3', label: '3년 이상' },
                { code: '5', label: '5년 이상' },
                { code: '7', label: '7년 이상' },
                { code: '10', label: '10년 이상' },
              ].map((opt) => (
                <TouchableOpacity key={`exp-${opt.code}`} style={[styles.optionChip, experience === opt.code && styles.optionChipOn]} onPress={() => setExperience(opt.code)}>
                  <Text style={[styles.optionChipText, experience === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>학력</Text>
            <View style={styles.optionRow}>
              {[
                { code: '', label: '학력 무관' },
                { code: 'high', label: '고졸 이상' },
                { code: 'college', label: '대졸 이상' },
                { code: 'bachelor', label: '학사 이상' },
                { code: 'master', label: '석사 이상' },
                { code: 'doctor', label: '박사 이상' },
              ].map((opt) => (
                <TouchableOpacity key={`edu-${opt.code}`} style={[styles.optionChip, education === opt.code && styles.optionChipOn]} onPress={() => setEducation(opt.code)}>
                  <Text style={[styles.optionChipText, education === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>필수 자격 요건</Text>
            <TextInput style={[styles.input, { height: 120, textAlignVertical: 'top' }]} value={requirements} onChangeText={setRequirements} placeholder={'필수적인 자격 요건을 기재해주세요.\n\n예시:\n- 정보보호 관련 경력 5년 이상\n- ISMS-P, 개인정보보호 컨설팅 경험\n- 정보보호 자격증 보유자 우대 (CISSP, CISA, CISM 등)'} multiline />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>우대 사항</Text>
            <TextInput style={[styles.input, { height: 120, textAlignVertical: 'top' }]} value={preferences} onChangeText={setPreferences} placeholder={'우대 사항을 기재해주세요.\n\n예시:\n- 금융권, 공공기관 컨설팅 경험\n- 해외 보안 자격증 보유자\n- 보안 관련 강의 및 발표 경험'} multiline />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="cog" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>근무 조건</Text></View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>급여</Text>
            <View style={styles.inlineRow}>
              <TextInput style={[styles.input, styles.inputNumber]} value={salaryMin} onChangeText={setSalaryMin} placeholder="최소" keyboardType="numeric" />
              <Text style={styles.inlineLabel}>만원</Text>
              <Text style={styles.inlineLabel}>~</Text>
              <TextInput style={[styles.input, styles.inputNumber]} value={salaryMax} onChangeText={setSalaryMax} placeholder="최대" keyboardType="numeric" />
              <Text style={styles.inlineLabel}>만원</Text>
            </View>
            <Text style={styles.hint}>연봉 또는 월급을 기재해주세요.</Text>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>근무지</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="예: 경기도 성남시 분당구 대왕판교로 645" />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>근무 시간</Text>
            <TextInput style={styles.input} value={workHours} onChangeText={setWorkHours} placeholder="예: 월~금 09:00~18:00 (주 40시간)" />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>복리후생</Text>
            <TextInput style={[styles.input, { height: 120, textAlignVertical: 'top' }]} value={benefits} onChangeText={setBenefits} placeholder={'제공하는 복리후생을 기재해주세요.\n\n예시:\n- 4대 보험, 퇴직금, 연차\n- 야근수당, 장기근속상여\n- 도서구매비, 식대, 자기계발비\n- 경조사비, 단체상해보험, 건강검진'} multiline />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="tasks" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>전형 절차</Text></View>
          </View>
          <View style={{ rowGap: 12 }}>
            {processSteps.map((s) => (
              <View key={`step-${s.id}`} style={styles.processItem}>
                <View style={styles.numberBadge}><Text style={styles.numberBadgeText}>{s.id}</Text></View>
                <View style={{ flex: 1, rowGap: 8 }}>
                  <TextInput style={styles.input} value={s.title} onChangeText={(v) => updateStep(s.id, { title: v })} placeholder="단계명" />
                  <TextInput style={styles.input} value={s.description} onChangeText={(v) => updateStep(s.id, { description: v })} placeholder="설명" />
                </View>
                <View style={styles.stepActions}>
                  <TouchableOpacity style={styles.moveBtn} onPress={() => moveUp(s.id)}>
                    <FontAwesome5 name="chevron-up" size={12} color="#374151" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.moveBtn} onPress={() => moveDown(s.id)}>
                    <FontAwesome5 name="chevron-down" size={12} color="#374151" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeBtn} onPress={() => removeStep(s.id)}>
                    <FontAwesome5 name="times" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.btnSecondary} onPress={addStep}>
              <FontAwesome5 name="plus" size={12} color="#FFFFFF" />
              <Text style={styles.btnSecondaryText}>전형 절차 추가</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="file-alt" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>제출 서류</Text></View>
          </View>
          <View style={{ rowGap: 16 }}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>필수 서류</Text>
              <View style={styles.optionRow}>
                <TouchableOpacity style={[styles.optionChip, reqResume && styles.optionChipOn]} onPress={() => setReqResume((v) => !v)}>
                  <Text style={[styles.optionChipText, reqResume && styles.optionChipTextOn]}>이력서</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.optionChip, reqCareer && styles.optionChipOn]} onPress={() => setReqCareer((v) => !v)}>
                  <Text style={[styles.optionChipText, reqCareer && styles.optionChipTextOn]}>경력기술서</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.optionChip, reqPortfolio && styles.optionChipOn]} onPress={() => setReqPortfolio((v) => !v)}>
                  <Text style={[styles.optionChipText, reqPortfolio && styles.optionChipTextOn]}>포트폴리오</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.optionChip, reqCertificate && styles.optionChipOn]} onPress={() => setReqCertificate((v) => !v)}>
                  <Text style={[styles.optionChipText, reqCertificate && styles.optionChipTextOn]}>자격증 사본</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>기타 서류 안내</Text>
              <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} value={otherDocuments} onChangeText={setOtherDocuments} placeholder="추가로 필요한 서류가 있다면 기재해주세요." multiline />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>관련 서류 첨부</Text>
              <View style={{ rowGap: 8 }}>
                {attachments.map((a) => (
                  <View key={`att-${a.id}`} style={styles.dynamicItem}>
                    <FontAwesome5 name="paperclip" size={12} color="#2563EB" />
                    <View style={{ flex: 1 }}><Text style={styles.inputText}>{a.name}</Text></View>
                    <TouchableOpacity style={styles.btnDanger} onPress={() => removeAttachment(a.id)}>
                      <FontAwesome5 name="trash" size={12} color="#FFFFFF" />
                      <Text style={styles.btnDangerText}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.btnSecondary} onPress={addAttachment}>
                  <FontAwesome5 name="plus" size={12} color="#FFFFFF" />
                  <Text style={styles.btnSecondaryText}>첨부 추가</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="calendar-alt" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>접수 기간</Text></View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>접수 기간</Text>
            <View style={styles.inlineRow}>
              <TextInput style={[styles.input, styles.inputDate]} value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" />
              <Text style={styles.inlineLabel}>~</Text>
              <TextInput style={[styles.input, styles.inputDate]} value={endDate} onChangeText={setEndDate} placeholder="YYYY-MM-DD" />
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>추가 안내</Text>
            <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} value={additionalInfo} onChangeText={setAdditionalInfo} placeholder="※ 조기 마감될 수 있습니다." multiline />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="info" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>추가 정보</Text></View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>담당자 정보</Text>
            <TextInput style={styles.input} value={contactName} onChangeText={setContactName} placeholder="담당자명" />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>연락처</Text>
            <TextInput style={styles.input} value={contactPhone} onChangeText={setContactPhone} placeholder="담당자 연락처" keyboardType="phone-pad" />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>이메일</Text>
            <TextInput style={styles.input} value={contactEmail} onChangeText={setContactEmail} placeholder="담당자 이메일" keyboardType="email-address" />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>홈페이지</Text>
            <TextInput style={styles.input} value={website} onChangeText={setWebsite} placeholder="회사 홈페이지 URL" />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.btnOutline} onPress={saveDraft}>
          <Text style={styles.btnOutlineText}>임시저장</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPrimary} onPress={submit}>
          <Text style={styles.btnPrimaryText}>등록하기</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },

  formGroup: { rowGap: 8 },
  label: { fontSize: 13, color: '#374151', fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#FFFFFF' },
  inputText: { fontSize: 13, color: '#111827' },
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
  gridItem: { width: '48%', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, rowGap: 6 },
  gridItemOn: { borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.08)' },
  gridIcon: { fontSize: 18 },
  gridName: { fontSize: 13, color: '#111827', fontWeight: '700', textAlign: 'center' },
  gridCode: { fontSize: 11, color: '#6B7280' },

  inlineRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  inlineLabel: { fontSize: 12, color: '#6B7280' },
  inputNumber: { width: 90 },
  inputDate: { width: 140 },

  dynamicItem: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  numberBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  numberBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  processItem: { flexDirection: 'row', alignItems: 'flex-start', columnGap: 8 },
  stepActions: { rowGap: 6, alignItems: 'flex-end' },
  moveBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  removeBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DC2626' },

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
