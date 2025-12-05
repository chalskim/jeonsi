import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Experience = { id: number; company: string; role: string; duration: string; description: string }
type PackageItem = { id: number; name: string; type: 'weekly' | 'monthly' | 'session'; price: string; description: string }
type CertificateItem = { id: number; name: string; issuer: string; date: string; expiryDate: string; status: 'valid' | 'expired'; fileName?: string }

export default function ExpertsRegistration() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [workPrefs, setWorkPrefs] = useState<string[]>([])
  const [region, setRegion] = useState('')
  const [intro, setIntro] = useState('')

  const expertiseCategories = useMemo(() => ({
    A: { name: '기술/개발', options: [
      { code: 'IT01', name: '웹 개발' }, { code: 'IT02', name: '앱 개발' }, { code: 'IT03', name: 'AI/머신러닝' },
      { code: 'IT04', name: '데이터 분석' }, { code: 'IT05', name: '보안/인증' }, { code: 'IT06', name: '클라우드/인프라' },
      { code: 'IT07', name: '게임 개발' }, { code: 'IT08', name: '블록체인/Web3' }
    ]},
    B: { name: '디자인/크리에이티브', options: [
      { code: 'DS01', name: '영상 편집' }, { code: 'DS02', name: '모션그래픽/3D' }, { code: 'DS03', name: '그래픽 디자인' },
      { code: 'DS04', name: '일러스트/캐릭터' }, { code: 'DS05', name: 'UI/UX 디자인' }, { code: 'DS06', name: '제품/산업 디자인' },
      { code: 'DS07', name: '사진/촬영' }, { code: 'DS08', name: '음악/사운드' }
    ]},
    C: { name: '마케팅/홍보', options: [
      { code: 'MK01', name: '퍼포먼스 마케팅' }, { code: 'MK02', name: 'SNS 마케팅' }, { code: 'MK03', name: '콘텐츠 마케팅' },
      { code: 'MK04', name: '브랜딩/CI' }, { code: 'MK05', name: 'PR/언론홍보' }, { code: 'MK06', name: '영업/세일즈' }
    ]},
    D: { name: '글쓰기/번역', options: [
      { code: 'WR01', name: '카피라이팅' }, { code: 'WR02', name: '콘텐츠 글쓰기' }, { code: 'WR03', name: '번역/통역' }, { code: 'WR04', name: '출판/교정' }
    ]},
    E: { name: '비즈니스/경영', options: [
      { code: 'BZ01', name: '경영/전략 컨설팅' }, { code: 'BZ02', name: '창업/스타트업' }, { code: 'BZ03', name: '재무/회계' },
      { code: 'BZ04', name: '세무/기장' }, { code: 'BZ05', name: '법률/계약' }, { code: 'BZ06', name: '특허/지식재산' }
    ]},
    F: { name: 'HR/인사', options: [
      { code: 'HR01', name: '채용/헤드헌팅' }, { code: 'HR02', name: '인사제도/조직' }, { code: 'HR03', name: '노무/급여' }, { code: 'HR04', name: '커리어 코칭' }
    ]},
    G: { name: '교육/강의', options: [
      { code: 'ED01', name: '기업교육/강의' }, { code: 'ED02', name: '외국어 교육' }, { code: 'ED03', name: '입시/학원' }, { code: 'ED04', name: '자격증/실무' }
    ]},
    H: { name: '건축/설계', options: [
      { code: 'BD01', name: '건축 설계' }, { code: 'BD02', name: '토목/조경' }, { code: 'BD03', name: '도시/부동산' }
    ]},
    I: { name: '인테리어/시공', options: [
      { code: 'IN01', name: '인테리어 디자인' }, { code: 'IN02', name: '도배/바닥' }, { code: 'IN03', name: '주방/욕실' }, { code: 'IN04', name: '목공/가구' }
    ]},
    J: { name: '설비/수리', options: [
      { code: 'FC01', name: '전기/조명' }, { code: 'FC02', name: '설비/배관' }, { code: 'FC03', name: '방수/단열' }, { code: 'FC04', name: '철거/청소' }
    ]},
    K: { name: '스포츠/피트니스', options: [
      { code: 'SP01', name: '골프/라켓' }, { code: 'SP02', name: '피트니스/PT' }, { code: 'SP03', name: '요가/필라테스' }, { code: 'SP04', name: '수영/아웃도어' }, { code: 'SP05', name: '댄스/무술' }
    ]},
    L: { name: '뷰티/패션', options: [
      { code: 'BT01', name: '메이크업/헤어' }, { code: 'BT02', name: '네일/속눈썹' }, { code: 'BT03', name: '패션/스타일링' }
    ]},
    M: { name: '행사/엔터테인먼트', options: [
      { code: 'EV01', name: '웨딩/돌잔치' }, { code: 'EV02', name: '행사/컨퍼런스' }, { code: 'EV03', name: 'MC/공연' }
    ]},
    N: { name: '생활서비스', options: [
      { code: 'LF01', name: '반려동물' }, { code: 'LF02', name: '청소/정리' }, { code: 'LF03', name: '이사/운송' }, { code: 'LF04', name: '수리/설치' }
    ]},
    O: { name: '전문서비스', options: [
      { code: 'PS01', name: '의료/헬스케어' }, { code: 'PS02', name: '공학/제조' }, { code: 'PS03', name: '물류/무역' }, { code: 'PS04', name: '농업/식품' }
    ]},
  }), [])

  const majorOptions = useMemo(() => [{ code: '', name: '대분류 선택' }, ...Object.keys(expertiseCategories).map((k) => ({ code: k, name: expertiseCategories[k as keyof typeof expertiseCategories].name }))], [expertiseCategories])
  const getMinorOptions = (majorCode: string) => [{ code: '', name: '중분류 선택' }, ...((majorCode && (expertiseCategories as any)[majorCode]?.options) || [])]

  const [majorCode, setMajorCode] = useState('')
  const [minorCode, setMinorCode] = useState('')
  const [majorOpen, setMajorOpen] = useState(false)
  const [minorOpen, setMinorOpen] = useState(false)

  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')

  const [experiences, setExperiences] = useState<Experience[]>([
    { id: 1, company: '', role: '', duration: '', description: '' },
  ])
  const [packages, setPackages] = useState<PackageItem[]>([
    { id: 1, name: '', type: 'weekly', price: '', description: '' },
  ])
  const [certificates, setCertificates] = useState<CertificateItem[]>([
    { id: 1, name: '', issuer: '', date: '', expiryDate: '', status: 'valid', fileName: '' },
  ])
  const [portfolioItems, setPortfolioItems] = useState<string[]>([])

  const togglePref = (val: string) => setWorkPrefs((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]))
  const addSkill = () => {
    setSkills((prev) => (newSkill.trim() ? [...prev, newSkill.trim()] : prev))
    setNewSkill('')
  }
  const removeSkill = (s: string) => setSkills((prev) => prev.filter((v) => v !== s))

  const addExperience = () => setExperiences((prev) => [...prev, { id: prev.length + 1, company: '', role: '', duration: '', description: '' }])
  const updateExperience = <K extends keyof Experience>(id: number, key: K, value: Experience[K]) => setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, [key]: value } : e)))
  const removeExperience = (id: number) => setExperiences((prev) => prev.filter((e) => e.id !== id))

  const addPackageItem = () => setPackages((prev) => [...prev, { id: prev.length + 1, name: '', type: 'weekly', price: '', description: '' }])
  const updatePackageItem = <K extends keyof PackageItem>(id: number, key: K, value: PackageItem[K]) => setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)))
  const removePackageItem = (id: number) => setPackages((prev) => prev.filter((p) => p.id !== id))

  const addCertificateItem = () => setCertificates((prev) => [...prev, { id: prev.length + 1, name: '', issuer: '', date: '', expiryDate: '', status: 'valid', fileName: '' }])
  const updateCertificateItem = <K extends keyof CertificateItem>(id: number, key: K, value: CertificateItem[K]) => setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, [key]: value } : c)))
  const removeCertificateItem = (id: number) => setCertificates((prev) => prev.filter((c) => c.id !== id))

  const addPortfolioItem = (label: string) => setPortfolioItems((prev) => (label.trim() ? [...prev, label.trim()] : prev))
  const removePortfolioItem = (label: string) => setPortfolioItems((prev) => prev.filter((p) => p !== label))

  const validate = () => {
    if (!name || !role) return false
    if (!majorCode || !minorCode) return false
    return true
  }

  const onSubmit = () => {
    if (!validate()) {
      Alert.alert('오류', '필수 항목을 모두 입력해주세요.')
      return
    }
    Alert.alert('성공', '프로필이 성공적으로 저장되었습니다!')
    navigation.navigate('ExpertsList', { prev: 'ExpertsRegistration' } as never)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => {
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
        }}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>전문가 프로필 등록</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="user-circle" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>기본 정보</Text>
          </View>
          <View style={styles.grid}>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>이름 *</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="홍길동" />
            </View>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>역할/직무 *</Text>
              <TextInput style={styles.input} value={role} onChangeText={setRole} placeholder="예: UI/UX 디자이너" />
            </View>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>선호 근무형태</Text>
              <View style={styles.chipRow}>
                {['remote', 'offline', 'hybrid'].map((p) => (
                  <TouchableOpacity key={p} style={[styles.checkboxChip, workPrefs.includes(p) && styles.checkboxChipActive]} onPress={() => togglePref(p)}>
                    <FontAwesome5 name={workPrefs.includes(p) ? 'check-square' : 'square'} size={14} color={workPrefs.includes(p) ? '#2563EB' : '#6B7280'} />
                    <Text style={[styles.checkboxText, workPrefs.includes(p) && styles.checkboxTextActive]}>{p === 'remote' ? '원격' : p === 'offline' ? '오프라인' : '하이브리드'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>선호 지역</Text>
              <TextInput style={styles.input} value={region} onChangeText={setRegion} placeholder="예: 서울, 경기, 판교" />
            </View>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>한 줄 소개</Text>
              <TextInput style={styles.input} value={intro} onChangeText={setIntro} placeholder="전문성을 한 줄로 요약해주세요." />
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="star" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>전문 분야</Text>
          </View>
          <View style={styles.grid}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>대분류 *</Text>
              <TouchableOpacity style={styles.selectBox} onPress={() => setMajorOpen((v) => !v)}>
                <Text style={styles.selectValue}>{(majorOptions.find((o) => o.code === majorCode)?.name) || '대분류 선택'}</Text>
                <FontAwesome5 name={majorOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
              </TouchableOpacity>
              {majorOpen && (
                <View style={styles.dropdown}>
                  <ScrollView style={styles.dropdownScroll}>
                    {majorOptions.map((opt) => (
                      <TouchableOpacity key={opt.code} style={styles.dropdownItem} onPress={() => { setMajorCode(opt.code); setMajorOpen(false); setMinorCode(''); }}>
                        <Text style={styles.dropdownText}>{opt.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>중분류 *</Text>
              <TouchableOpacity style={styles.selectBox} onPress={() => setMinorOpen((v) => !v)}>
                <Text style={styles.selectValue}>{(getMinorOptions(majorCode).find((o) => o.code === minorCode)?.name) || '중분류 선택'}</Text>
                <FontAwesome5 name={minorOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
              </TouchableOpacity>
              {minorOpen && (
                <View style={styles.dropdown}>
                  <ScrollView style={styles.dropdownScroll}>
                    {getMinorOptions(majorCode).map((opt) => (
                      <TouchableOpacity key={opt.code} style={styles.dropdownItem} onPress={() => { setMinorCode(opt.code); setMinorOpen(false) }}>
                        <Text style={styles.dropdownText}>{opt.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <View style={[styles.formGroup, styles.fullWidth]}> 
              <Text style={styles.label}>세부 스킬</Text>
              <View style={styles.chipRow}>
                {skills.map((s) => (
                  <View key={s} style={styles.skillChip}>
                    <Text style={styles.skillChipText}>{s}</Text>
                    <TouchableOpacity onPress={() => removeSkill(s)} style={styles.skillChipRemove}><FontAwesome5 name="times" size={10} color="#6B7280" /></TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={styles.addRow}>
                <TextInput style={[styles.input, { flex: 1 }]} value={newSkill} onChangeText={setNewSkill} placeholder="예: React, Figma" />
                <TouchableOpacity style={styles.btnPrimary} onPress={addSkill}><Text style={styles.btnPrimaryText}>추가</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="briefcase" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>경력</Text>
          </View>
          <View>
            {experiences.map((e) => (
              <View key={e.id} style={styles.dynamicSection}>
                <View style={styles.dynamicHeader}>
                  <Text style={styles.dynamicTitle}>경력 {e.id}</Text>
                  <TouchableOpacity style={styles.btnRemove} onPress={() => removeExperience(e.id)}>
                    <FontAwesome5 name="times" size={12} color="#FFFFFF" />
                    <Text style={styles.btnRemoveText}>삭제</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.grid}>
                  <View style={styles.formGroup}><Text style={styles.label}>회사/조직명</Text><TextInput style={styles.input} value={e.company} onChangeText={(v) => updateExperience(e.id, 'company', v)} placeholder="예: ㈜테크솔루션" /></View>
                  <View style={styles.formGroup}><Text style={styles.label}>직책/역할</Text><TextInput style={styles.input} value={e.role} onChangeText={(v) => updateExperience(e.id, 'role', v)} placeholder="예: 수석 컨설턴트" /></View>
                  <View style={styles.formGroup}><Text style={styles.label}>근무 기간</Text><TextInput style={styles.input} value={e.duration} onChangeText={(v) => updateExperience(e.id, 'duration', v)} placeholder="예: 2018.03 - 현재" /></View>
                  <View style={[styles.formGroup, styles.fullWidth]}><Text style={styles.label}>주요 성과 및 업무</Text><TextInput style={[styles.input, styles.textarea]} value={e.description} onChangeText={(v) => updateExperience(e.id, 'description', v)} multiline placeholder="담당했던 주요 업무와 성과" /></View>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.btnOutline} onPress={addExperience}>
              <FontAwesome5 name="plus" size={12} color="#374151" />
              <Text style={styles.btnOutlineText}>경력 추가</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="certificate" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>자격증</Text>
          </View>
          <View>
            {certificates.map((c) => (
              <View key={c.id} style={styles.dynamicSection}>
                <View style={styles.dynamicHeader}>
                  <Text style={styles.dynamicTitle}>자격증 {c.id}</Text>
                  <TouchableOpacity style={styles.btnRemove} onPress={() => removeCertificateItem(c.id)}>
                    <FontAwesome5 name="times" size={12} color="#FFFFFF" />
                    <Text style={styles.btnRemoveText}>삭제</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.grid}>
                  <View style={styles.formGroup}><Text style={styles.label}>자격증명 *</Text><TextInput style={styles.input} value={c.name} onChangeText={(v) => updateCertificateItem(c.id, 'name', v)} placeholder="예: 정보보안기사" /></View>
                  <View style={styles.formGroup}><Text style={styles.label}>발급 기관</Text><TextInput style={styles.input} value={c.issuer} onChangeText={(v) => updateCertificateItem(c.id, 'issuer', v)} placeholder="예: 한국정보통신진흥원" /></View>
                  <View style={styles.formGroup}><Text style={styles.label}>취득일</Text><TextInput style={styles.input} value={c.date} onChangeText={(v) => updateCertificateItem(c.id, 'date', v)} placeholder="예: 2022-04-01" /></View>
                  <View style={styles.formGroup}><Text style={styles.label}>만료일</Text><TextInput style={styles.input} value={c.expiryDate} onChangeText={(v) => updateCertificateItem(c.id, 'expiryDate', v)} placeholder="예: 2025-04-01" /></View>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>상태</Text>
                    <View style={styles.chipRow}>
                      {(['valid', 'expired'] as const).map((st) => (
                        <TouchableOpacity key={st} style={[styles.checkboxChip, c.status === st && styles.checkboxChipActive]} onPress={() => updateCertificateItem(c.id, 'status', st)}>
                          <FontAwesome5 name={c.status === st ? 'check-square' : 'square'} size={14} color={c.status === st ? '#2563EB' : '#6B7280'} />
                          <Text style={[styles.checkboxText, c.status === st && styles.checkboxTextActive]}>{st === 'valid' ? '유효' : '만료'}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <View style={[styles.formGroup, styles.fullWidth]}><Text style={styles.label}>증빙 파일명</Text><TextInput style={styles.input} value={c.fileName} onChangeText={(v) => updateCertificateItem(c.id, 'fileName', v)} placeholder="예: cert.pdf" /></View>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.btnOutline} onPress={addCertificateItem}>
              <FontAwesome5 name="plus" size={12} color="#374151" />
              <Text style={styles.btnOutlineText}>자격증 추가</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="folder-open" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>포트폴리오</Text>
          </View>
          <View>
            <View style={styles.addRow}>
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="파일 또는 링크 이름" onSubmitEditing={(e: any) => addPortfolioItem(e.nativeEvent.text)} />
              <TouchableOpacity style={styles.btnPrimary} onPress={() => addPortfolioItem('portfolio.pdf')}><Text style={styles.btnPrimaryText}>샘플 추가</Text></TouchableOpacity>
            </View>
            {portfolioItems.map((p) => (
              <View key={p} style={styles.portfolioItem}>
                <Text style={styles.portfolioText}>{p}</Text>
                <TouchableOpacity style={styles.btnRemoveSm} onPress={() => removePortfolioItem(p)}>
                  <FontAwesome5 name="times" size={10} color="#FFFFFF" />
                  <Text style={styles.btnRemoveSmText}>삭제</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="clock" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>시간 패키지</Text>
          </View>
          <View>
            {packages.map((p) => (
              <View key={p.id} style={styles.dynamicSection}>
                <View style={styles.dynamicHeader}>
                  <Text style={styles.dynamicTitle}>패키지 {p.id}</Text>
                  <TouchableOpacity style={styles.btnRemove} onPress={() => removePackageItem(p.id)}>
                    <FontAwesome5 name="times" size={12} color="#FFFFFF" />
                    <Text style={styles.btnRemoveText}>삭제</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.grid}>
                  <View style={styles.formGroup}><Text style={styles.label}>패키지명</Text><TextInput style={styles.input} value={p.name} onChangeText={(v) => updatePackageItem(p.id, 'name', v)} placeholder="예: 주 10시간 CMO 패키지" /></View>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>유형</Text>
                    <View style={styles.chipRow}>
                      {(['weekly', 'monthly', 'session'] as const).map((t) => (
                        <TouchableOpacity key={t} style={[styles.checkboxChip, p.type === t && styles.checkboxChipActive]} onPress={() => updatePackageItem(p.id, 'type', t)}>
                          <FontAwesome5 name={p.type === t ? 'dot-circle' : 'circle'} size={14} color={p.type === t ? '#2563EB' : '#6B7280'} />
                          <Text style={[styles.checkboxText, p.type === t && styles.checkboxTextActive]}>{t === 'weekly' ? '주간' : t === 'monthly' ? '월간' : '회차'}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <View style={styles.formGroup}><Text style={styles.label}>가격</Text><TextInput style={styles.input} value={p.price} onChangeText={(v) => updatePackageItem(p.id, 'price', v)} placeholder="예: 200만원" /></View>
                  <View style={[styles.formGroup, styles.fullWidth]}><Text style={styles.label}>설명</Text><TextInput style={[styles.input, styles.textarea]} value={p.description} onChangeText={(v) => updatePackageItem(p.id, 'description', v)} multiline placeholder="포함 서비스 상세" /></View>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.btnOutline} onPress={addPackageItem}>
              <FontAwesome5 name="plus" size={12} color="#374151" />
              <Text style={styles.btnOutlineText}>패키지 추가</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="comment-dots" size={16} color="#0066CC" />
            <Text style={styles.sectionTitle}>상세 소개</Text>
          </View>
          <View style={styles.grid}>
            <View style={[styles.formGroup, styles.fullWidth]}>
              <Text style={styles.label}>자기소개</Text>
              <TextInput style={[styles.input, styles.textarea]} multiline placeholder="자신에 대해 자유롭게 소개해주세요. (최대 500자)" />
            </View>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.btnPrimary} onPress={onSubmit}>
          <Text style={styles.btnPrimaryText}>프로필 저장하기</Text>
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

  content: { paddingBottom: 100 },
  form: { backgroundColor: '#FFFFFF', borderRadius: 12, marginHorizontal: 16, marginTop: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', columnGap: 8, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#F8FAFC' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  grid: { paddingHorizontal: 16, paddingVertical: 12 },
  formGroup: { marginBottom: 12 },
  fullWidth: { width: '100%' },
  label: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 13, color: '#111827', backgroundColor: '#FFFFFF' },
  textarea: { minHeight: 100, textAlignVertical: 'top' },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  checkboxChip: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#F3F4F6', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  checkboxChipActive: { backgroundColor: '#E0ECFF', borderColor: '#2563EB' },
  checkboxText: { fontSize: 12, color: '#374151' },
  checkboxTextActive: { color: '#2563EB', fontWeight: '700' },

  selectBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  selectValue: { fontSize: 13, color: '#374151' },
  dropdown: { marginTop: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, backgroundColor: '#FFFFFF' },
  dropdownScroll: { maxHeight: 220 },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 10 },
  dropdownText: { fontSize: 13, color: '#374151' },

  skillChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14, backgroundColor: '#E3F2FD', marginRight: 6, marginBottom: 6 },
  skillChipText: { fontSize: 12, color: '#1976d2', fontWeight: '600' },
  skillChipRemove: { marginLeft: 6 },

  addRow: { flexDirection: 'row', columnGap: 8 },

  dynamicSection: { backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', marginHorizontal: 16, marginBottom: 12, overflow: 'hidden' },
  dynamicHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  dynamicTitle: { fontSize: 13, fontWeight: '700', color: '#111827' },
  btnRemove: { flexDirection: 'row', alignItems: 'center', columnGap: 6, backgroundColor: '#DC2626', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  btnRemoveText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  btnRemoveSm: { flexDirection: 'row', alignItems: 'center', columnGap: 6, backgroundColor: '#DC2626', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  btnRemoveSmText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  portfolioItem: { marginHorizontal: 16, marginTop: 8, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  portfolioText: { fontSize: 12, color: '#374151' },

  btnPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#EEEEEE', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start', marginHorizontal: 16 },
  btnOutlineText: { color: '#333333', fontSize: 13, fontWeight: '600' },

  actionBar: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
})
