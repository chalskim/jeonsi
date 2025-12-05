import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Image, Platform } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import common from '../../data/common.json'

type Category = string
type SubCategory = string

type Instructor = {
  id: number
  name: string
  title: string
  bio: string
  photoUri?: string
}

type TextbookItem = {
  id: number
  name: string
  price: number
  required: boolean
}

type CurriculumItem = {
  id: number
  topic: string
  detail: string
}

export default function EducationRegistration() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('ED')
  const [subCategory, setSubCategory] = useState<SubCategory>('ED04')
  const [openMajor, setOpenMajor] = useState(false)
  const [openSub, setOpenSub] = useState(false)
  const [features, setFeatures] = useState<string[]>(['신규', '온라인'])
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState<string>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [price, setPrice] = useState<string>('')
  const [description, setDescription] = useState('')

  const [instructors, setInstructors] = useState<Instructor[]>([
    {
      id: 1,
      name: '김보안',
      title: '클라우드 보안 컨설턴트 (15년 경력)',
      bio: '현직 클라우드 보안 컨설턴트로 AWS/Azure/GCP 전문 자격증 보유. 다수 금융기관 및 대기업의 클라우드 보안 아키텍처 설계 및 컨설팅 경험 보유.',
      photoUri: Platform.select({ web: 'https://picsum.photos/seed/instructor123/120/120.jpg', default: undefined }),
    },
  ])

  const [textbooks, setTextbooks] = useState<TextbookItem[]>([
    { id: 1, name: '실전 클라우드 보안 (2024 개정판)', price: 35000, required: true },
    { id: 2, name: 'DevSecOps 구축 가이드 (제2판)', price: 28000, required: false },
  ])

  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([
    { id: 1, topic: '클라우드 보안 기초', detail: '클라우드 컴퓨팅의 개념, 클라우드 보안의 특징, 공유 책임 모델' },
  ])

  const [targets, setTargets] = useState<string[]>(['클라우드 보안 전문가로 커리어 전환을 희망하는 분'])
  const [objectives, setObjectives] = useState<string[]>(['클라우드 보안의 기본 개념과 원리 이해'])

  const majorOptions = useMemo(() => (common as any).majorCategories as Array<any>, [])
  const subOptions = useMemo(() => ((common as any).middleCategories as Array<any>).filter((m) => m.majorCode === category), [category])
  const categoryLabel = useMemo(() => {
    const f = majorOptions.find((m) => m.code === category)
    return f ? f.name : '분류 선택'
  }, [category, majorOptions])
  const subCategoryLabel = useMemo(() => {
    const f = subOptions.find((m) => m.code === subCategory)
    return f ? `${f.name} (${f.code})` : '세부 분류 선택'
  }, [subCategory, subOptions])

  const selectMajor = (code: string) => {
    setCategory(code)
    const nextSubs = ((common as any).middleCategories as Array<any>).filter((m) => m.majorCode === code)
    setSubCategory(nextSubs[0]?.code ?? '')
    setOpenMajor(false)
  }
  const selectSub = (code: string) => {
    setSubCategory(code)
    setOpenSub(false)
  }

  const canSave = useMemo(() => {
    const cap = Number(capacity)
    const p = Number(price)
    return title.trim().length > 0 && !!category && !!subCategory && cap > 0 && p >= 0 && startDate.trim() && endDate.trim()
  }, [title, category, subCategory, capacity, price, startDate, endDate])

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
    navigation.navigate('EducationsList')
  }

  const addFeature = () => setFeatures((prev) => [...prev, ''])
  const removeFeature = (idx: number) => setFeatures((prev) => prev.filter((_, i) => i !== idx))
  const updateFeature = (idx: number, v: string) => setFeatures((prev) => prev.map((x, i) => (i === idx ? v : x)))

  const addInstructor = () =>
    setInstructors((prev) => [
      ...prev,
      { id: Date.now(), name: '', title: '', bio: '', photoUri: undefined },
    ])
  const removeInstructor = (id: number) => setInstructors((prev) => prev.filter((i) => i.id !== id))
  const updateInstructor = (id: number, field: keyof Instructor, v: string | undefined) =>
    setInstructors((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: v } : i)))

  const pickInstructorPhoto = async (id: number) => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 })
    if (!res.canceled && res.assets && res.assets[0]?.uri) {
      updateInstructor(id, 'photoUri', res.assets[0].uri)
    }
  }

  const addTextbook = () =>
    setTextbooks((prev) => [
      ...prev,
      { id: Date.now(), name: '', price: 0, required: false },
    ])
  const removeTextbook = (id: number) => setTextbooks((prev) => prev.filter((t) => t.id !== id))
  const updateTextbook = (id: number, patch: Partial<TextbookItem>) =>
    setTextbooks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))

  const addCurriculum = () =>
    setCurriculum((prev) => [
      ...prev,
      { id: Date.now(), topic: '', detail: '' },
    ])
  const removeCurriculum = (id: number) => setCurriculum((prev) => prev.filter((c) => c.id !== id))
  const updateCurriculum = (id: number, patch: Partial<CurriculumItem>) =>
    setCurriculum((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))

  const addTarget = () => setTargets((prev) => [...prev, ''])
  const removeTarget = (idx: number) => setTargets((prev) => prev.filter((_, i) => i !== idx))
  const updateTarget = (idx: number, v: string) => setTargets((prev) => prev.map((x, i) => (i === idx ? v : x)))

  const addObjective = () => setObjectives((prev) => [...prev, ''])
  const removeObjective = (idx: number) => setObjectives((prev) => prev.filter((_, i) => i !== idx))
  const updateObjective = (idx: number, v: string) => setObjectives((prev) => prev.map((x, i) => (i === idx ? v : x)))

  const save = () => {
    if (!canSave) {
      Alert.alert('안내', '필수 항목을 입력해 주세요. (교육명, 분류, 정원, 일정, 교육비)')
      return
    }
    const payload = {
      title,
      category,
      subCategory,
      features: features.filter((x) => x.trim()),
      location,
      capacity: Number(capacity),
      startDate,
      endDate,
      price: Number(price),
      description,
      instructors,
      textbooks,
      curriculum,
      targets: targets.filter((x) => x.trim()),
      objectives: objectives.filter((x) => x.trim()),
    }
    Alert.alert('저장', '교육 등록 정보가 저장되었습니다.')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>교육 등록</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="info-circle" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>기본 정보</Text></View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>교육명</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="교육명을 입력하세요" />
          </View>

          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.label}>분류</Text>
              <View style={styles.selector}>
                <TouchableOpacity style={styles.selectorBox} activeOpacity={0.8} onPress={() => setOpenMajor((v) => !v)}>
                  <Text style={styles.selectorText}>{categoryLabel}</Text>
                  <FontAwesome5 name={openMajor ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
                </TouchableOpacity>
                {openMajor && (
                  <View style={styles.selectorList}>
                    {majorOptions.map((m) => (
                      <TouchableOpacity key={`major-${m.code}`} style={styles.selectorItem} onPress={() => selectMajor(m.code)}>
                        <Text style={styles.selectorItemText}>{m.name}</Text>
                        <Text style={styles.selectorItemCode}>{m.code}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
            <View style={styles.formCol}>
              <Text style={styles.label}>세부 분류</Text>
              <View style={styles.selector}>
                <TouchableOpacity style={styles.selectorBox} activeOpacity={0.8} onPress={() => setOpenSub((v) => !v)}>
                  <Text style={styles.selectorText}>{subCategoryLabel}</Text>
                  <FontAwesome5 name={openSub ? 'chevron-up' : 'chevron-down'} size={14} color="#374151" />
                </TouchableOpacity>
                {openSub && (
                  <View style={styles.selectorList}>
                    {subOptions.map((s) => (
                      <TouchableOpacity key={`sub-${s.code}`} style={styles.selectorItem} onPress={() => selectSub(s.code)}>
                        <Text style={styles.selectorItemText}>{s.name}</Text>
                        <Text style={styles.selectorItemCode}>{s.code}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>교육 특징</Text>
            <View style={{ rowGap: 8 }}>
              {features.map((f, i) => (
                <View key={`feature-${i}`} style={styles.dynamicItem}>
                  <FontAwesome5 name="tag" size={12} color="#2563EB" />
                  <TextInput style={[styles.input, { flex: 1 }]} value={f} onChangeText={(v) => updateFeature(i, v)} placeholder="예: 신규 과정, 실무 중심" />
                  <TouchableOpacity style={styles.btnDanger} onPress={() => removeFeature(i)}>
                    <FontAwesome5 name="trash" size={12} color="#FFFFFF" />
                    <Text style={styles.btnDangerText}>삭제</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.btnSecondary} onPress={addFeature}>
                <FontAwesome5 name="plus" size={12} color="#FFFFFF" />
                <Text style={styles.btnSecondaryText}>특징 추가</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.label}>교육 장소</Text>
              <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="온라인 또는 오프라인 장소" />
            </View>
            <View style={styles.formCol}>
              <Text style={styles.label}>정원</Text>
              <TextInput style={styles.input} value={capacity} onChangeText={setCapacity} placeholder="정원" keyboardType="numeric" />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.label}>시작일</Text>
              <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" />
            </View>
            <View style={styles.formCol}>
              <Text style={styles.label}>종료일</Text>
              <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} placeholder="YYYY-MM-DD" />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>교육비</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="교육비" keyboardType="numeric" />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>교육 소개</Text>
            <TextInput style={[styles.input, { height: 120, textAlignVertical: 'top' }]} value={description} onChangeText={setDescription} placeholder="교육에 대한 소개" multiline />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="user-tie" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>강사 정보</Text></View>
          </View>
          <View style={{ rowGap: 10 }}>
            {instructors.map((ins) => (
              <View key={`ins-${ins.id}`} style={styles.instructorItem}>
                <TouchableOpacity style={styles.photoBox} activeOpacity={0.85} onPress={() => pickInstructorPhoto(ins.id)}>
                  {ins.photoUri ? (
                    <Image source={{ uri: ins.photoUri }} style={{ width: 60, height: 60, borderRadius: 30 }} />
                  ) : (
                    <FontAwesome5 name="camera" size={18} color="#2563EB" />
                  )}
                </TouchableOpacity>
                <View style={{ flex: 1, rowGap: 8 }}>
                  <TextInput style={styles.input} value={ins.name} onChangeText={(v) => updateInstructor(ins.id, 'name', v)} placeholder="강사명" />
                  <TextInput style={styles.input} value={ins.title} onChangeText={(v) => updateInstructor(ins.id, 'title', v)} placeholder="소속/직책" />
                  <TextInput style={[styles.input, { height: 90, textAlignVertical: 'top' }]} value={ins.bio} onChangeText={(v) => updateInstructor(ins.id, 'bio', v)} placeholder="강사 소개" multiline />
                </View>
                <TouchableOpacity style={styles.btnDanger} onPress={() => removeInstructor(ins.id)}>
                  <FontAwesome5 name="trash" size={12} color="#FFFFFF" />
                  <Text style={styles.btnDangerText}>삭제</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.btnSecondary} onPress={addInstructor}>
              <FontAwesome5 name="plus" size={12} color="#FFFFFF" />
              <Text style={styles.btnSecondaryText}>강사 추가</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="book" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>교재 정보</Text></View>
          </View>
          <View style={{ rowGap: 8 }}>
            {textbooks.map((t) => (
              <View key={`tb-${t.id}`} style={styles.dynamicItem}>
                <TouchableOpacity style={[styles.selectBox, t.required && styles.selectBoxOn]} activeOpacity={0.85} onPress={() => updateTextbook(t.id, { required: !t.required })}>
                  {t.required ? <FontAwesome5 name="check" size={12} color="#FFFFFF" /> : null}
                </TouchableOpacity>
                <TextInput style={[styles.input, { flex: 1 }]} value={t.name} onChangeText={(v) => updateTextbook(t.id, { name: v })} placeholder="교재명" />
                <TextInput style={[styles.input, { width: 120 }]} value={String(t.price)} onChangeText={(v) => updateTextbook(t.id, { price: Number(v) || 0 })} placeholder="가격" keyboardType="numeric" />
                <TouchableOpacity style={styles.btnDanger} onPress={() => removeTextbook(t.id)}>
                  <FontAwesome5 name="trash" size={12} color="#FFFFFF" />
                  <Text style={styles.btnDangerText}>삭제</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.btnSecondary} onPress={addTextbook}>
              <FontAwesome5 name="plus" size={12} color="#FFFFFF" />
              <Text style={styles.btnSecondaryText}>교재 추가</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="book" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>커리큘럼</Text></View>
          </View>
          <View style={{ rowGap: 8 }}>
            {curriculum.map((c, idx) => (
              <View key={`cur-${c.id}`} style={styles.dynamicItem}>
                <View style={styles.numberBadge}><Text style={styles.numberBadgeText}>{idx + 1}</Text></View>
                <View style={{ flex: 1, rowGap: 8 }}>
                  <TextInput style={styles.input} value={c.topic} onChangeText={(v) => updateCurriculum(c.id, { topic: v })} placeholder="주제" />
                  <TextInput style={[styles.input, { height: 70, textAlignVertical: 'top' }]} value={c.detail} onChangeText={(v) => updateCurriculum(c.id, { detail: v })} placeholder="상세 내용" multiline />
                </View>
                <TouchableOpacity style={styles.btnDanger} onPress={() => removeCurriculum(c.id)}>
                  <FontAwesome5 name="trash" size={12} color="#FFFFFF" />
                  <Text style={styles.btnDangerText}>삭제</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.btnSecondary} onPress={addCurriculum}>
              <FontAwesome5 name="plus" size={12} color="#FFFFFF" />
              <Text style={styles.btnSecondaryText}>커리큘럼 추가</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="bullseye" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>수강 대상</Text></View>
          </View>
          <View style={{ rowGap: 8 }}>
            {targets.map((t, i) => (
              <View key={`target-${i}`} style={styles.dynamicItem}>
                <FontAwesome5 name="check-circle" size={12} color="#2563EB" />
                <TextInput style={[styles.input, { flex: 1 }]} value={t} onChangeText={(v) => updateTarget(i, v)} placeholder="수강 대상" />
                <TouchableOpacity style={styles.btnDanger} onPress={() => removeTarget(i)}>
                  <FontAwesome5 name="trash" size={12} color="#FFFFFF" />
                  <Text style={styles.btnDangerText}>삭제</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.btnSecondary} onPress={addTarget}>
              <FontAwesome5 name="plus" size={12} color="#FFFFFF" />
              <Text style={styles.btnSecondaryText}>수강 대상 추가</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}><FontAwesome5 name="trophy" size={14} color="#2563EB" /><Text style={styles.sectionTitle}>학습 목표</Text></View>
          </View>
          <View style={{ rowGap: 8 }}>
            {objectives.map((o, i) => (
              <View key={`obj-${i}`} style={styles.dynamicItem}>
                <FontAwesome5 name="check-circle" size={12} color="#2563EB" />
                <TextInput style={[styles.input, { flex: 1 }]} value={o} onChangeText={(v) => updateObjective(i, v)} placeholder="학습 목표" />
                <TouchableOpacity style={styles.btnDanger} onPress={() => removeObjective(i)}>
                  <FontAwesome5 name="trash" size={12} color="#FFFFFF" />
                  <Text style={styles.btnDangerText}>삭제</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.btnSecondary} onPress={addObjective}>
              <FontAwesome5 name="plus" size={12} color="#FFFFFF" />
              <Text style={styles.btnSecondaryText}>학습 목표 추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.fabRow}>
        <TouchableOpacity style={styles.btnOutline} onPress={goBackSmart}>
          <FontAwesome5 name="times" size={14} color="#374151" />
          <Text style={styles.btnOutlineText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnPrimary, !canSave && { opacity: 0.6 }]} disabled={!canSave} onPress={save}>
          <FontAwesome5 name="save" size={14} color="#FFFFFF" />
          <Text style={styles.btnPrimaryText}>저장</Text>
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

  section: { backgroundColor: '#FFFFFF', marginTop: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },

  label: { fontSize: 13, color: '#374151', marginBottom: 6, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, backgroundColor: '#FFFFFF' },
  formGroup: { marginBottom: 12 },
  formRow: { flexDirection: 'row', columnGap: 12 },
  formCol: { flex: 1 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, backgroundColor: '#FFFFFF' },
  chipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  chipText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },

  selector: { rowGap: 8 },
  selectorBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF' },
  selectorText: { fontSize: 14, color: '#111827', fontWeight: '600' },
  selectorList: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  selectorItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  selectorItemText: { fontSize: 14, color: '#111827' },
  selectorItemCode: { fontSize: 12, color: '#6B7280' },

  dynamicItem: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  selectBox: { width: 20, height: 20, borderRadius: 4, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  selectBoxOn: { backgroundColor: '#2563EB', borderColor: '#2563EB' },

  instructorItem: { flexDirection: 'row', alignItems: 'flex-start', columnGap: 12, backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  photoBox: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },

  numberBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  numberBadgeText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnSecondary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnSecondaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#EEEEEE', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 13, fontWeight: '600' },
  btnDanger: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#DC2626', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnDangerText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

  fabRow: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', columnGap: 8, justifyContent: 'flex-end' },
})
