import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type CorpEventType = 'short-term' | 'recruitment' | 'training-lecture' | 'training-attend'
type CorpEventStatus = 'ongoing' | 'scheduled' | 'completed' | 'canceled'

type CorpScheduleItem = {
  id: string
  title: string
  type: CorpEventType
  status: CorpEventStatus
  manager?: string
  day?: number
  startDate?: string
  endDate?: string
  time?: string
}

export default function ScheduleManagerCorporate() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [displayMode, setDisplayMode] = useState<'calendar' | 'list'>('calendar')
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailType, setDetailType] = useState<CorpEventType | null>(null)
  const [filterTypes, setFilterTypes] = useState<CorpEventType[]>([])
  const [filterStatuses, setFilterStatuses] = useState<CorpEventStatus[]>([])
  const [filterStartDay, setFilterStartDay] = useState('')
  const [filterEndDay, setFilterEndDay] = useState('')

  const monthMeta = useMemo(() => ({ year: 2023, month: 11, title: '2023년 11월' }), [])

  const initialItems = useMemo<CorpScheduleItem[]>(() => [
    { id: 'm-10-r', title: '프론트엔드 개발자 채용 시작 및 서류 접수 안내', type: 'recruitment', status: 'ongoing', day: 10 },
    { id: 'm-15-s', title: '마케팅 컨설팅 (초기 미팅)', type: 'short-term', status: 'scheduled', day: 15 },
    { id: 'm-20-tl', title: '스타트업 재무 교육', type: 'training-lecture', status: 'scheduled', day: 20, time: '14:00' },
    { id: 'm-22-s', title: '마케팅 컨설팅 (중간 보고)', type: 'short-term', status: 'ongoing', day: 22, time: '15:00' },
    { id: 'm-24-r', title: '프론트엔드 채용 서류 접수 마감', type: 'recruitment', status: 'ongoing', day: 24 },
    { id: 'm-25-ta', title: '디지털 마케팅 기초 온라인 수강', type: 'training-attend', status: 'scheduled', day: 25, time: '10:00' },
    { id: 'm-27-r', title: '프론트엔드 채용 서류 합격자 발표', type: 'recruitment', status: 'scheduled', day: 27 },
    { id: 'm-29-r', title: '프론트엔드 채용 1차 면접', type: 'recruitment', status: 'scheduled', day: 29, time: '14:00' },
    { id: 'm-29-s', title: '마케팅 컨설팅 (최종 보고)', type: 'short-term', status: 'scheduled', day: 29 },
  ], [])

  const [items, setItems] = useState<CorpScheduleItem[]>(initialItems)

  const filteredItems = useMemo(() => {
    const s = search.trim().toLowerCase()
    const sd = Number(filterStartDay)
    const ed = Number(filterEndDay)
    return items.filter((it) => {
      const mt = filterTypes.length === 0 || filterTypes.includes(it.type)
      const ms = filterStatuses.length === 0 || filterStatuses.includes(it.status)
      const msr = !s || [it.title, it.manager || ''].join(' ').toLowerCase().includes(s)
      const md = (!filterStartDay && !filterEndDay) || (
        it.day !== undefined && !Number.isNaN(sd) && !Number.isNaN(ed) && sd <= it.day && it.day <= ed
      )
      return mt && ms && msr && md
    })
  }, [items, filterTypes, filterStatuses, filterStartDay, filterEndDay, search])

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
    navigation.navigate('MyPageCorporate')
  }

  const typeTagStyle = (t: CorpEventType) =>
    t === 'short-term' ? styles.tagShortTerm : t === 'recruitment' ? styles.tagRecruitment : t === 'training-lecture' ? styles.tagTrainingLecture : styles.tagTrainingAttend

  const eventChipStyle = (t: CorpEventType) =>
    t === 'short-term' ? styles.eventShortTerm : t === 'recruitment' ? styles.eventRecruitment : t === 'training-lecture' ? styles.eventTrainingLecture : styles.eventTrainingAttend

  const statusBadgeStyle = (s: CorpEventStatus) =>
    s === 'ongoing' ? styles.statusOngoing : s === 'scheduled' ? styles.statusScheduled : s === 'completed' ? styles.statusCompleted : styles.statusCanceled

  const toggleSet = <T,>(arr: T[], value: T, setter: (v: T[]) => void) => {
    setter(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value])
  }

  const monthGrid = useMemo(() => {
    const rows: Array<Array<number | null>> = [
      [null, null, null, 1, 2, 3, 4],
      [5, 6, 7, 8, 9, 10, 11],
      [12, 13, 14, 15, 16, 17, 18],
      [19, 20, 21, 22, 23, 24, 25],
      [26, 27, 28, 29, 30, null, null],
    ]
    return rows
  }, [])

  const [addForm, setAddForm] = useState<{
    title: string
    type: CorpEventType
    status: CorpEventStatus
    manager?: string
    day: string
    startDate?: string
    endDate?: string
    time?: string
  }>({ title: '', type: 'short-term', status: 'scheduled', manager: '', day: '' })

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일정관리 (기업)</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={() => setFilterOpen(true)}>
          <FontAwesome5 name="filter" size={18} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <View style={styles.controlsLeft}>
          <View style={styles.switcherGroup}>
            <TouchableOpacity style={[styles.switchBtn, viewMode === 'month' && styles.switchBtnOn]} onPress={() => setViewMode('month')}><Text style={[styles.switchBtnText, viewMode === 'month' && styles.switchBtnTextOn]}>월간</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.switchBtn, viewMode === 'week' && styles.switchBtnOn]} onPress={() => setViewMode('week')}><Text style={[styles.switchBtnText, viewMode === 'week' && styles.switchBtnTextOn]}>주간</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.switchBtn, viewMode === 'day' && styles.switchBtnOn]} onPress={() => setViewMode('day')}><Text style={[styles.switchBtnText, viewMode === 'day' && styles.switchBtnTextOn]}>일간</Text></TouchableOpacity>
          </View>
          <View style={styles.switcherGroup}>
            <TouchableOpacity style={[styles.switchBtn, displayMode === 'calendar' && styles.switchBtnOn]} onPress={() => setDisplayMode('calendar')}><Text style={[styles.switchBtnText, displayMode === 'calendar' && styles.switchBtnTextOn]}>캘린더</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.switchBtn, displayMode === 'list' && styles.switchBtnOn]} onPress={() => setDisplayMode('list')}><Text style={[styles.switchBtnText, displayMode === 'list' && styles.switchBtnTextOn]}>리스트</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.controlsRight}>
          <TouchableOpacity style={styles.btnOutline} onPress={() => setFilterOpen(true)}>
            <FontAwesome5 name="filter" size={14} color="#374151" />
            <Text style={styles.btnOutlineText}>필터</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, position: 'relative' }}>
            <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="일정 검색..." />
            <View style={styles.searchIcon}><FontAwesome5 name="search" size={14} color="#6B7280" /></View>
          </View>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => setAddOpen(true)}>
            <FontAwesome5 name="plus" size={12} color="#FFFFFF" />
            <Text style={styles.btnPrimaryText}>일정 추가</Text>
          </TouchableOpacity>
        </View>
      </View>

      {displayMode === 'calendar' ? (
        <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 120 }}>
          {viewMode === 'month' ? (
            <View style={styles.section}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>{monthMeta.title}</Text>
                <View style={styles.calendarNavRow}>
                  <TouchableOpacity style={styles.navBtn} onPress={() => Alert.alert('안내', '월 변경은 데모에서 생략했습니다.')}><Text style={styles.navBtnText}>{'<'}</Text></TouchableOpacity>
                </View>
              </View>
              <View style={styles.weekHeaderRow}>
                {['일','월','화','수','목','금','토'].map((d) => (
                  <View key={`wh-${d}`} style={styles.weekHeaderCell}><Text style={styles.weekHeaderText}>{d}</Text></View>
                ))}
              </View>
              <View style={styles.gridWrap}>
                {monthGrid.map((row, ri) => (
                  <View key={`r-${ri}`} style={styles.gridRow}>
                    {row.map((day, di) => (
                      <View key={`c-${ri}-${di}`} style={styles.gridCell}>
                        {day ? (
                          <View style={{ rowGap: 6 }}>
                            <Text style={styles.dayNumber}>{day}</Text>
                            <View style={{ rowGap: 4 }}>
                              {filteredItems.filter((it) => it.day === day).map((it) => (
                                <TouchableOpacity key={it.id} style={[styles.eventChip, eventChipStyle(it.type)]} onPress={() => { setDetailType(it.type); setDetailOpen(true) }}>
                                  <Text style={styles.eventChipText}>{it.title}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        ) : null}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {viewMode === 'week' ? (
            <View style={styles.section}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>2023년 11월 3주차</Text>
                <View style={styles.calendarNavRow}>
                  <TouchableOpacity style={styles.navBtn} onPress={() => Alert.alert('안내', '주 변경은 데모에서 생략했습니다.')}><Text style={styles.navBtnText}>{'<'}</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.navBtn} onPress={() => Alert.alert('안내', '주 변경은 데모에서 생략했습니다.')}><Text style={styles.navBtnText}>{'>'}</Text></TouchableOpacity>
                </View>
              </View>
              <View style={styles.weekGridWrap}>
                <View style={styles.weekGridHeaderRow}>
                  <View style={[styles.weekGridHeaderCell, styles.weekGridTimeCell]}><Text style={styles.weekGridHeaderText}>시간</Text></View>
                  {['월 (20)','화 (21)','수 (22)','목 (23)','금 (24)','토 (25)'].map((d) => (
                    <View key={`wgh-${d}`} style={styles.weekGridHeaderCell}><Text style={styles.weekGridHeaderText}>{d}</Text></View>
                  ))}
                </View>
                {[
                  { t: '09:00', cells: ['', '', '', '', '', ''] },
                  { t: '10:00', cells: ['', '', '', '', '', '디지털 마케팅 기초 온라인 수강'] },
                  { t: '11:00', cells: ['', '', '', '', '', ''] },
                  { t: '14:00', cells: ['스타트업 재무 교육', '', '마케팅 컨설팅 (중간 보고)', '', '', ''] },
                ].map((row, i) => (
                  <View key={`wg-${i}`} style={styles.weekGridRow}>
                    <View style={[styles.weekGridCell, styles.weekGridTimeCell]}><Text style={styles.weekGridTimeText}>{row.t}</Text></View>
                    {row.cells.map((c, ci) => (
                      <View key={`wg-${i}-${ci}`} style={styles.weekGridCell}>
                        {c ? (
                          <TouchableOpacity style={[styles.weekEventChip, styles.eventShortTerm]} onPress={() => { setDetailType(ci === 0 ? 'training-lecture' : ci === 2 ? 'short-term' : 'training-attend'); setDetailOpen(true) }}>
                            <Text style={styles.weekEventChipText}>{c}</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {viewMode === 'day' ? (
            <View style={styles.section}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>2023년 11월 22일</Text>
                <View style={styles.calendarNavRow}>
                  <TouchableOpacity style={styles.navBtn} onPress={() => Alert.alert('안내', '일 변경은 데모에서 생략했습니다.')}><Text style={styles.navBtnText}>{'<'}</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.navBtn} onPress={() => Alert.alert('안내', '일 변경은 데모에서 생략했습니다.')}><Text style={styles.navBtnText}>{'>'}</Text></TouchableOpacity>
                </View>
              </View>
              <View style={styles.dayTimeline}>
                {[
                  { t: '09:00', e: '' },
                  { t: '10:00', e: '' },
                  { t: '15:00', e: '마케팅 컨설팅 (중간 보고)' },
                ].map((row, i) => (
                  <View key={`dt-${i}`} style={styles.dayRow}>
                    <View style={styles.dayTimeCell}><Text style={styles.dayTimeText}>{row.t}</Text></View>
                    <View style={styles.dayContentCell}>
                      {row.e ? (
                        <TouchableOpacity style={[styles.dayEventChip, styles.eventShortTerm]} onPress={() => { setDetailType('short-term'); setDetailOpen(true) }}>
                          <Text style={styles.dayEventChipText}>{row.e}</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 120 }}>
          <View style={styles.section}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>전체 일정</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
                <TouchableOpacity style={styles.btnOutline} onPress={() => Alert.alert('정렬', '정렬 옵션은 데모에서 생략했습니다.')}><Text style={styles.btnOutlineText}>마감일 순</Text></TouchableOpacity>
              </View>
            </View>
            <View style={{ rowGap: 10 }}>
              {filteredItems.map((it) => (
                <TouchableOpacity key={it.id} style={styles.listItem} onPress={() => { setDetailType(it.type); setDetailOpen(true) }}>
                  <View style={styles.listItemLeft}>
                    <View style={[styles.typeTag, typeTagStyle(it.type)]}><Text style={styles.typeTagText}>{it.type === 'short-term' ? '단기 의뢰' : it.type === 'recruitment' ? '채용 계획' : it.type === 'training-lecture' ? '교육 강의' : '교육 수강'}</Text></View>
                    <View style={styles.eventDetails}>
                      <Text style={styles.eventTitle}>{it.title}</Text>
                      <Text style={styles.eventMeta}>{it.day ? `11월 ${it.day}일` : it.startDate ? `${it.startDate}${it.endDate ? ` ~ ${it.endDate}` : ''}` : ''}{it.manager ? ` | 담당자: ${it.manager}` : ''}{it.time ? ` • ${it.time}` : ''}</Text>
                    </View>
                  </View>
                  <View style={[styles.eventStatus, statusBadgeStyle(it.status)]}><Text style={styles.eventStatusText}>{it.status === 'ongoing' ? '진행중' : it.status === 'scheduled' ? '예정' : it.status === 'completed' ? '완료' : '취소'}</Text></View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      <Modal visible={filterOpen} transparent animationType="fade" onRequestClose={() => setFilterOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>일정 필터</Text>
              <TouchableOpacity onPress={() => setFilterOpen(false)}><FontAwesome5 name="times" size={18} color="#6B7280" /></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <View style={{ rowGap: 16 }}>
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>일정 유형</Text>
                  <View style={styles.optionRow}>
                    {([
                      { code: 'short-term', label: '단기 의뢰' },
                      { code: 'recruitment', label: '채용 계획' },
                      { code: 'training-lecture', label: '교육 강의' },
                      { code: 'training-attend', label: '교육 수강' },
                    ] as Array<{ code: CorpEventType; label: string }>).map((opt) => (
                      <TouchableOpacity key={`type-${opt.code}`} style={[styles.optionChip, filterTypes.includes(opt.code) && styles.optionChipOn]} onPress={() => toggleSet(filterTypes, opt.code, setFilterTypes)}>
                        <Text style={[styles.optionChipText, filterTypes.includes(opt.code) && styles.optionChipTextOn]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>기간 (11월)</Text>
                  <View style={{ flexDirection: 'row', columnGap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <TextInput style={styles.input} value={filterStartDay} onChangeText={setFilterStartDay} placeholder="시작 날짜 (숫자)" keyboardType="number-pad" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <TextInput style={styles.input} value={filterEndDay} onChangeText={setFilterEndDay} placeholder="종료 날짜 (숫자)" keyboardType="number-pad" />
                    </View>
                  </View>
                </View>
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>상태</Text>
                  <View style={styles.optionRow}>
                    {([
                      { code: 'ongoing', label: '진행중' },
                      { code: 'scheduled', label: '예정' },
                      { code: 'completed', label: '완료' },
                      { code: 'canceled', label: '취소' },
                    ] as Array<{ code: CorpEventStatus; label: string }>).map((opt) => (
                      <TouchableOpacity key={`st-${opt.code}`} style={[styles.optionChip, filterStatuses.includes(opt.code) && styles.optionChipOn]} onPress={() => toggleSet(filterStatuses, opt.code, setFilterStatuses)}>
                        <Text style={[styles.optionChipText, filterStatuses.includes(opt.code) && styles.optionChipTextOn]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnOutline} onPress={() => { setFilterTypes([]); setFilterStatuses([]); setFilterStartDay(''); setFilterEndDay('') }}>
                <Text style={styles.btnOutlineText}>초기화</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => setFilterOpen(false)}>
                <Text style={styles.btnPrimaryText}>적용</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={addOpen} transparent animationType="fade" onRequestClose={() => setAddOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>새 일정 추가</Text>
              <TouchableOpacity onPress={() => setAddOpen(false)}><FontAwesome5 name="times" size={18} color="#6B7280" /></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <View style={{ rowGap: 16 }}>
                <View style={styles.formGroup}>
                  <Text style={styles.filterLabel}>일정 유형 선택</Text>
                  <View style={styles.optionRow}>
                    {([
                      { code: 'short-term', label: '단기 의뢰' },
                      { code: 'recruitment', label: '채용 계획' },
                      { code: 'training-lecture', label: '교육 강의' },
                      { code: 'training-attend', label: '교육 수강' },
                    ] as Array<{ code: CorpEventType; label: string }>).map((opt) => (
                      <TouchableOpacity key={`type-add-${opt.code}`} style={[styles.optionChip, addForm.type === opt.code && styles.optionChipOn]} onPress={() => setAddForm((p) => ({ ...p, type: opt.code }))}>
                        <Text style={[styles.optionChipText, addForm.type === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.filterLabel}>기본 정보</Text>
                  <View style={{ rowGap: 10 }}>
                    <TextInput style={styles.input} value={addForm.title} onChangeText={(t) => setAddForm((p) => ({ ...p, title: t }))} placeholder="제목" />
                    <TextInput style={styles.input} value={addForm.manager} onChangeText={(t) => setAddForm((p) => ({ ...p, manager: t }))} placeholder="담당자" />
                    <View style={{ flexDirection: 'row', columnGap: 10 }}>
                      <View style={{ flex: 1 }}>
                        <TextInput style={styles.input} value={addForm.day} onChangeText={(t) => setAddForm((p) => ({ ...p, day: t }))} placeholder="11월의 날짜 숫자" keyboardType="number-pad" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <TextInput style={styles.input} value={addForm.time} onChangeText={(t) => setAddForm((p) => ({ ...p, time: t }))} placeholder="예: 14:00" />
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.filterLabel}>상태</Text>
                  <View style={styles.optionRow}>
                    {([
                      { code: 'ongoing', label: '진행중' },
                      { code: 'scheduled', label: '예정' },
                      { code: 'completed', label: '완료' },
                      { code: 'canceled', label: '취소' },
                    ] as Array<{ code: CorpEventStatus; label: string }>).map((opt) => (
                      <TouchableOpacity key={`st-add-${opt.code}`} style={[styles.optionChip, addForm.status === opt.code && styles.optionChipOn]} onPress={() => setAddForm((p) => ({ ...p, status: opt.code }))}>
                        <Text style={[styles.optionChipText, addForm.status === opt.code && styles.optionChipTextOn]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnOutline} onPress={() => setAddOpen(false)}>
                <Text style={styles.btnOutlineText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => {
                  const d = Number(addForm.day)
                  if (!addForm.title.trim() || Number.isNaN(d) || d < 1 || d > 30) {
                    Alert.alert('안내', '제목과 1~30의 날짜를 입력하세요.')
                    return
                  }
                  const id = `m-${d}-${Math.random().toString(36).slice(2, 7)}`
                  setItems((prev) => [{ id, title: addForm.title.trim(), type: addForm.type, status: addForm.status, day: d, time: addForm.time?.trim(), manager: addForm.manager?.trim() }, ...prev])
                  setAddOpen(false)
                  setAddForm({ title: '', type: 'short-term', status: 'scheduled', manager: '', day: '' })
                  setDisplayMode('list')
                  Alert.alert('추가 완료', '일정을 추가했습니다.')
                }}
              >
                <Text style={styles.btnPrimaryText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={detailOpen} transparent animationType="fade" onRequestClose={() => setDetailOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>일정 상세 정보</Text>
              <TouchableOpacity onPress={() => setDetailOpen(false)}><FontAwesome5 name="times" size={18} color="#6B7280" /></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <View style={{ rowGap: 10 }}>
                {detailType === 'short-term' ? (
                  <View style={{ rowGap: 8 }}>
                    <Text style={styles.eventTitle}>마케팅 전략 컨설팅</Text>
                    <Text style={styles.eventMeta}>기간: 2023.11.15 ~ 2023.11.30</Text>
                    <Text style={styles.eventMeta}>담당 전문가: 김마케팅 (CMO, 10년 경력)</Text>
                    <Text style={styles.eventMeta}>상태: 진행중</Text>
                  </View>
                ) : detailType === 'recruitment' ? (
                  <View style={{ rowGap: 8 }}>
                    <Text style={styles.eventTitle}>프론트엔드 개발자 채용</Text>
                    <Text style={styles.eventMeta}>채용 기간: 2023.11.10 ~ 2023.12.05</Text>
                    <Text style={styles.eventMeta}>담당자: 박개발 (CTO)</Text>
                    <Text style={styles.eventMeta}>상태: 서류 접수중</Text>
                  </View>
                ) : detailType === 'training-lecture' ? (
                  <View style={{ rowGap: 8 }}>
                    <Text style={styles.eventTitle}>스타트업 재무 교육</Text>
                    <Text style={styles.eventMeta}>일시: 2023.11.20 (월) 14:00 ~ 16:00</Text>
                    <Text style={styles.eventMeta}>장소: 온라인 (Zoom)</Text>
                    <Text style={styles.eventMeta}>강사: 이재무 (전문가)</Text>
                  </View>
                ) : detailType === 'training-attend' ? (
                  <View style={{ rowGap: 8 }}>
                    <Text style={styles.eventTitle}>디지털 마케팅 기초</Text>
                    <Text style={styles.eventMeta}>일시: 2023.11.25 (토) 10:00 ~ 12:00</Text>
                    <Text style={styles.eventMeta}>장소: 온라인 (Google Meet)</Text>
                    <Text style={styles.eventMeta}>강사: 최마케팅 (전문가)</Text>
                  </View>
                ) : null}
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => Alert.alert('수정', '수정 화면은 데모에서 생략했습니다.')}> 
                <Text style={styles.btnPrimaryText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOutline} onPress={() => setDetailOpen(false)}>
                <Text style={styles.btnOutlineText}>닫기</Text>
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
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#dee2e6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  controls: { paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  controlsLeft: { flexDirection: 'row', columnGap: 10, alignItems: 'center' },
  controlsRight: { flexDirection: 'row', alignItems: 'center', columnGap: 10, marginTop: 10 },
  switcherGroup: { flexDirection: 'row', columnGap: 6 },
  switchBtn: { borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  switchBtnOn: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  switchBtnText: { fontSize: 12, color: '#111827', fontWeight: '600' },
  switchBtnTextOn: { color: '#FFFFFF' },

  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#0066CC', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#EEEEEE', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 13, fontWeight: '600' },

  searchInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8, fontSize: 14, backgroundColor: '#FFFFFF' },
  searchIcon: { position: 'absolute', right: 12, top: 8, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },

  section: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  calendarTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  calendarNavRow: { flexDirection: 'row', columnGap: 8 },
  navBtn: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 12 },
  navBtnText: { fontSize: 12, color: '#111827' },

  weekHeaderRow: { flexDirection: 'row', marginBottom: 8 },
  weekHeaderCell: { flex: 1, backgroundColor: '#F8FAFC', paddingVertical: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  weekHeaderText: { fontSize: 12, fontWeight: '700', color: '#374151' },

  gridWrap: { rowGap: 10 },
  gridRow: { flexDirection: 'row', columnGap: 10 },
  gridCell: { flex: 1, minHeight: 110, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 10 },
  dayNumber: { fontSize: 12, fontWeight: '700', color: '#111827' },
  eventChip: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4 },
  eventChipText: { fontSize: 11, color: '#111827' },

  eventShortTerm: { backgroundColor: '#e3f2fd' },
  eventRecruitment: { backgroundColor: '#e8f5e9' },
  eventTrainingLecture: { backgroundColor: '#f3e5f5' },
  eventTrainingAttend: { backgroundColor: '#fff3e0' },

  weekGridWrap: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden' },
  weekGridHeaderRow: { flexDirection: 'row' },
  weekGridHeaderCell: { flex: 1, backgroundColor: '#F8FAFC', paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#E5E7EB' },
  weekGridHeaderText: { fontSize: 12, fontWeight: '700', color: '#374151' },
  weekGridTimeCell: { width: 80 },
  weekGridRow: { flexDirection: 'row' },
  weekGridCell: { flex: 1, minHeight: 60, borderTopWidth: 1, borderTopColor: '#E5E7EB', borderRightWidth: 1, borderRightColor: '#E5E7EB', padding: 6 },
  weekGridTimeText: { fontSize: 12, color: '#374151' },
  weekEventChip: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4 },
  weekEventChipText: { fontSize: 11, color: '#111827' },

  dayTimeline: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden' },
  dayRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  dayTimeCell: { width: 80, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#E5E7EB', paddingVertical: 14 },
  dayTimeText: { fontSize: 14, fontWeight: '700', color: '#111827' },
  dayContentCell: { flex: 1, padding: 12 },
  dayEventChip: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6 },
  dayEventChipText: { fontSize: 12, color: '#111827' },

  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  listTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  listItem: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingVertical: 15, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  listItemLeft: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  typeTag: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 15 },
  typeTagText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  tagShortTerm: { backgroundColor: '#1565c0' },
  tagRecruitment: { backgroundColor: '#2e7d32' },
  tagTrainingLecture: { backgroundColor: '#7b1fa2' },
  tagTrainingAttend: { backgroundColor: '#ef6c00' },
  eventDetails: { rowGap: 4 },
  eventTitle: { fontSize: 16, color: '#111827', fontWeight: '700' },
  eventMeta: { fontSize: 12, color: '#666666' },
  eventStatus: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 4 },
  eventStatusText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  statusOngoing: { backgroundColor: '#e3f2fd' },
  statusScheduled: { backgroundColor: '#fff3e0' },
  statusCompleted: { backgroundColor: '#e8f5e9' },
  statusCanceled: { backgroundColor: '#fdecea' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 600, backgroundColor: '#FFFFFF', borderRadius: 10, overflow: 'hidden' },
  modalHeader: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  modalFooter: { paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'flex-end', columnGap: 8 },
  filterGroup: { rowGap: 8 },
  filterLabel: { fontSize: 13, color: '#374151', fontWeight: '700' },
  formGroup: { rowGap: 8 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, backgroundColor: '#FFFFFF' },
  optionChipOn: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  optionChipText: { fontSize: 12, color: '#111827', fontWeight: '600' },
  optionChipTextOn: { color: '#FFFFFF' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#FFFFFF' },
})
