import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type EventType = 'short-term' | 'training-lecture' | 'training-attend' | 'personal' | 'deadline'
type EventStatus = 'ongoing' | 'scheduled' | 'completed'

type ScheduleItem = {
  id: string
  title: string
  type: EventType
  status: EventStatus
  day?: number
  date?: string
  time?: string
}

export default function ScheduleManagerPersonal() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [displayMode, setDisplayMode] = useState<'calendar' | 'list'>('calendar')
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailType, setDetailType] = useState<EventType | null>(null)
  const [filterTypes, setFilterTypes] = useState<EventType[]>([])
  const [filterStatuses, setFilterStatuses] = useState<EventStatus[]>([])
  const [filterStartDay, setFilterStartDay] = useState('')
  const [filterEndDay, setFilterEndDay] = useState('')

  const monthMeta = useMemo(() => ({ year: 2023, month: 11, title: '2023년 11월' }), [])

  const initialItems = useMemo<ScheduleItem[]>(() => [
    { id: 'm-10-a', title: 'A사 마케팅 컨설팅 (초기 미팅)', type: 'short-term', status: 'ongoing', day: 10, time: '14:00' },
    { id: 'm-15-a', title: 'A사 제안서 마감', type: 'deadline', status: 'scheduled', day: 15, time: '18:00' },
    { id: 'm-20-a', title: '스타트업 마케팅 강의', type: 'training-lecture', status: 'completed', day: 20, time: '14:00' },
    { id: 'm-22-a', title: 'A사 마케팅 컨설팅 (중간 보고)', type: 'short-term', status: 'ongoing', day: 22, time: '15:00' },
    { id: 'm-25-a', title: '병원 예약', type: 'personal', status: 'scheduled', day: 25, time: '10:00' },
    { id: 'm-29-a', title: 'A사 마케팅 컨설팅 (최종 보고)', type: 'short-term', status: 'scheduled', day: 29, time: '14:00' },
  ], [])

  const [items, setItems] = useState<ScheduleItem[]>(initialItems)

  const filteredItems = useMemo(() => {
    const s = search.trim().toLowerCase()
    const sd = Number(filterStartDay)
    const ed = Number(filterEndDay)
    return items.filter((it) => {
      const mt = filterTypes.length === 0 || filterTypes.includes(it.type)
      const ms = filterStatuses.length === 0 || filterStatuses.includes(it.status)
      const msr = !s || it.title.toLowerCase().includes(s)
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
    navigation.navigate('MyPagePersonal')
  }

  const typeTagStyle = (t: EventType) =>
    t === 'short-term' ? styles.tagShortTerm : t === 'training-lecture' ? styles.tagTrainingLecture : t === 'training-attend' ? styles.tagTrainingAttend : t === 'personal' ? styles.tagPersonal : styles.tagDeadline

  const eventChipStyle = (t: EventType) =>
    t === 'short-term' ? styles.eventShortTerm : t === 'training-lecture' ? styles.eventTrainingLecture : t === 'training-attend' ? styles.eventTrainingAttend : t === 'personal' ? styles.eventPersonal : styles.eventDeadline

  const eventTextStyle = (t: EventType) =>
    t === 'short-term' ? styles.eventTextShortTerm : t === 'training-lecture' ? styles.eventTextTrainingLecture : t === 'training-attend' ? styles.eventTextTrainingAttend : t === 'personal' ? styles.eventTextPersonal : styles.eventTextDeadline

  const statusBadgeStyle = (s: EventStatus) =>
    s === 'ongoing' ? styles.statusOngoing : s === 'scheduled' ? styles.statusScheduled : styles.statusCompleted

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

  const [addForm, setAddForm] = useState<{ title: string; type: EventType; status: EventStatus; day: string; time?: string; location?: string }>({ title: '', type: 'personal', status: 'scheduled', day: '' })

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={goBackSmart}>
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일정관리 (개인)</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={() => setFilterOpen(true)}>
          <FontAwesome5 name="filter" size={18} color="#F5A623" />
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
                  <TouchableOpacity style={styles.navBtn} onPress={() => Alert.alert('안내', '월 변경은 데모에서 생략했습니다.')}><Text style={styles.navBtnText}>{'>'}</Text></TouchableOpacity>
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
                      <View key={`c-${ri}-${di}`} style={[styles.gridCell, di === 6 && styles.gridCellLastCol, ri === monthGrid.length - 1 && styles.gridCellLastRow]}>
                        {day ? (
                          <View style={{ rowGap: 6 }}>
                            <Text style={styles.dayNumber}>{day}</Text>
                            <View style={{ rowGap: 4 }}>
                              {filteredItems.filter((it) => it.day === day).map((it) => (
                                <TouchableOpacity key={it.id} style={[styles.eventChip, eventChipStyle(it.type)]} onPress={() => { setDetailType(it.type); setDetailOpen(true) }}>
                                  <Text style={[styles.eventChipText, eventTextStyle(it.type)]} numberOfLines={1}>{it.title}</Text>
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
                  { t: '10:00', cells: ['', '', '', '', '', '병원 예약'] },
                  { t: '11:00', cells: ['', '', '', '', '', ''] },
                  { t: '14:00', cells: ['스타트업 마케팅 강의', '', 'A사 마케팅 컨설팅 (중간 보고)', '', '', ''] },
                ].map((row, i) => (
                  <View key={`wg-${i}`} style={styles.weekGridRow}>
                    <View style={[styles.weekGridCell, styles.weekGridTimeCell]}><Text style={styles.weekGridTimeText}>{row.t}</Text></View>
                    {row.cells.map((c, ci) => (
                      <View key={`wg-${i}-${ci}`} style={styles.weekGridCell}>
                        {c ? (
                          <TouchableOpacity style={[styles.weekEventChip, ci === 0 ? styles.eventTrainingLecture : ci === 2 ? styles.eventShortTerm : styles.eventPersonal]} onPress={() => setDetailOpen(true)}>
                            <Text style={styles.weekEventChipText} numberOfLines={1}>{c}</Text>
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
                  { t: '15:00', e: 'A사 마케팅 컨설팅 (중간 보고)' },
                ].map((row, i) => (
                  <View key={`dt-${i}`} style={styles.dayRow}>
                    <View style={styles.dayTimeCell}><Text style={styles.dayTimeText}>{row.t}</Text></View>
                    <View style={styles.dayContentCell}>
                      {row.e ? (
                        <TouchableOpacity style={[styles.dayEventChip, styles.eventShortTerm]} onPress={() => setDetailOpen(true)}>
                          <Text style={styles.dayEventChipText} numberOfLines={1}>{row.e}</Text>
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
                    <View style={[styles.typeTag, typeTagStyle(it.type)]}><Text style={styles.typeTagText}>{it.type === 'short-term' ? '단기 의뢰' : it.type === 'training-lecture' ? '교육 강의' : it.type === 'training-attend' ? '교육 수강' : it.type === 'personal' ? '개인 일정' : '마감 일정'}</Text></View>
                    <View style={styles.eventDetails}>
                      <Text style={styles.eventTitle}>{it.title}</Text>
                      <Text style={styles.eventMeta}>{it.day ? `2023.11.${it.day}${it.time ? ` ${it.time}` : ''}` : it.date || ''}</Text>
                    </View>
                  </View>
                  <View style={[styles.eventStatus, statusBadgeStyle(it.status)]}><Text style={styles.eventStatusText}>{it.status === 'ongoing' ? '진행중' : it.status === 'scheduled' ? '예정' : '완료'}</Text></View>
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
                      { code: 'training-lecture', label: '교육 강의' },
                      { code: 'training-attend', label: '교육 수강' },
                      { code: 'personal', label: '개인 일정' },
                      { code: 'deadline', label: '마감 일정' },
                    ] as Array<{ code: EventType; label: string }>).map((opt) => (
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
                    ] as Array<{ code: EventStatus; label: string }>).map((opt) => (
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
                      { code: 'training-lecture', label: '교육 강의' },
                      { code: 'training-attend', label: '교육 수강' },
                      { code: 'personal', label: '개인 일정' },
                      { code: 'deadline', label: '마감 일정' },
                    ] as Array<{ code: EventType; label: string }>).map((opt) => (
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
                    <TextInput style={styles.input} value={addForm.location} onChangeText={(t) => setAddForm((p) => ({ ...p, location: t }))} placeholder="장소" />
                    <View style={{ flexDirection: 'row', columnGap: 10 }}>
                      <View style={{ flex: 1 }}>
                        <TextInput style={styles.input} value={addForm.day} onChangeText={(t) => setAddForm((p) => ({ ...p, day: t }))} placeholder="11월의 날짜 숫자" keyboardType="number-pad" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <TextInput style={styles.input} value={addForm.time} onChangeText={(t) => setAddForm((p) => ({ ...p, time: t }))} placeholder="예: 10:00" />
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
                    ] as Array<{ code: EventStatus; label: string }>).map((opt) => (
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
                  setItems((prev) => [{ id, title: addForm.title.trim(), type: addForm.type, status: addForm.status, day: d, time: addForm.time?.trim() }, ...prev])
                  setAddOpen(false)
                  setAddForm({ title: '', type: 'personal', status: 'scheduled', day: '' })
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
                    <Text style={styles.eventTitle}>A사 마케팅 컨설팅</Text>
                    <Text style={styles.eventMeta}>기간: 2023.11.10 ~ 2023.11.30</Text>
                    <Text style={styles.eventMeta}>의뢰 기업: A사</Text>
                    <Text style={styles.eventMeta}>담당자: 이대표</Text>
                    <Text style={styles.eventMeta}>상태: 진행중</Text>
                  </View>
                ) : detailType === 'deadline' ? (
                  <View style={{ rowGap: 8 }}>
                    <Text style={styles.eventTitle}>A사 제안서 마감</Text>
                    <Text style={styles.eventMeta}>마감 일시: 2023.11.15 18:00</Text>
                    <Text style={styles.eventMeta}>제출 대상: A사 이대표</Text>
                    <Text style={styles.eventMeta}>상태: 예정</Text>
                  </View>
                ) : detailType === 'training-lecture' ? (
                  <View style={{ rowGap: 8 }}>
                    <Text style={styles.eventTitle}>스타트업 마케팅 강의</Text>
                    <Text style={styles.eventMeta}>일시: 2023.11.20 (월) 14:00 ~ 16:00</Text>
                    <Text style={styles.eventMeta}>장소: 온라인 (Zoom)</Text>
                    <Text style={styles.eventMeta}>상태: 완료</Text>
                  </View>
                ) : detailType === 'personal' ? (
                  <View style={{ rowGap: 8 }}>
                    <Text style={styles.eventTitle}>병원 예약</Text>
                    <Text style={styles.eventMeta}>일시: 2023.11.25 (토) 10:00 ~ 11:00</Text>
                    <Text style={styles.eventMeta}>장소: 서울병원 내과</Text>
                    <Text style={styles.eventMeta}>상태: 예정</Text>
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
  header: { height: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  controls: { paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', backgroundColor: '#FFFFFF' },
  controlsLeft: { flexDirection: 'row', columnGap: 10, alignItems: 'center' },
  controlsRight: { flexDirection: 'row', alignItems: 'center', columnGap: 10, marginTop: 10 },
  switcherGroup: { flexDirection: 'row', columnGap: 6 },
  switchBtn: { borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  switchBtnOn: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  switchBtnText: { fontSize: 12, color: '#111827', fontWeight: '600' },
  switchBtnTextOn: { color: '#FFFFFF' },

  btnPrimary: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#4A90E2', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', columnGap: 8, backgroundColor: '#EEEEEE', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnOutlineText: { color: '#333333', fontSize: 13, fontWeight: '600' },

  searchInput: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8, fontSize: 14, backgroundColor: '#FFFFFF' },
  searchIcon: { position: 'absolute', right: 12, top: 8, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },

  section: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  calendarTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  calendarNavRow: { flexDirection: 'row', columnGap: 8 },
  navBtn: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 12 },
  navBtnText: { fontSize: 12, color: '#111827' },

  weekHeaderRow: { flexDirection: 'row', marginBottom: 8 },
  weekHeaderCell: { flex: 1, backgroundColor: '#f4f7f6', paddingVertical: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  weekHeaderText: { fontSize: 12, fontWeight: '700', color: '#374151' },

  gridWrap: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, overflow: 'hidden' },
  gridRow: { flexDirection: 'row' },
  gridCell: { flex: 1, minHeight: 100, padding: 10, borderRightWidth: 1, borderRightColor: '#e0e0e0', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  gridCellLastCol: { borderRightWidth: 0 },
  gridCellLastRow: { borderBottomWidth: 0 },
  dayNumber: { fontSize: 12, fontWeight: '700', color: '#111827' },
  eventChip: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 3, alignSelf: 'stretch' },
  eventChipText: { fontSize: 11 },

  eventShortTerm: { backgroundColor: '#e3f2fd' },
  eventTrainingLecture: { backgroundColor: '#f3e5f5' },
  eventTrainingAttend: { backgroundColor: '#fff3e0' },
  eventPersonal: { backgroundColor: '#e0e0e0' },
  eventDeadline: { backgroundColor: '#ffebee' },

  eventTextShortTerm: { color: '#1565c0' },
  eventTextTrainingLecture: { color: '#7b1fa2' },
  eventTextTrainingAttend: { color: '#ef6c00' },
  eventTextPersonal: { color: '#616161' },
  eventTextDeadline: { color: '#c62828' },

  weekGridWrap: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, overflow: 'hidden' },
  weekGridHeaderRow: { flexDirection: 'row' },
  weekGridHeaderCell: { flex: 1, backgroundColor: '#f4f7f6', paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#e0e0e0' },
  weekGridHeaderText: { fontSize: 12, fontWeight: '700', color: '#374151' },
  weekGridTimeCell: { width: 80 },
  weekGridRow: { flexDirection: 'row' },
  weekGridCell: { flex: 1, minHeight: 60, borderTopWidth: 1, borderTopColor: '#e0e0e0', borderRightWidth: 1, borderRightColor: '#e0e0e0', padding: 6 },
  weekGridTimeText: { fontSize: 12, color: '#374151' },
  weekEventChip: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 3, alignSelf: 'stretch' },
  weekEventChipText: { fontSize: 11, color: '#111827' },

  dayTimeline: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, overflow: 'hidden' },
  dayRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  dayTimeCell: { width: 80, backgroundColor: '#f4f7f6', alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#e0e0e0', paddingVertical: 14 },
  dayTimeText: { fontSize: 14, fontWeight: '700', color: '#111827' },
  dayContentCell: { flex: 1, padding: 12 },
  dayEventChip: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 },
  dayEventChipText: { fontSize: 12, color: '#111827' },

  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  listTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  listItem: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingVertical: 15, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  listItemLeft: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  typeTag: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 15 },
  typeTagText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  tagShortTerm: { backgroundColor: '#1565c0' },
  tagTrainingLecture: { backgroundColor: '#7b1fa2' },
  tagTrainingAttend: { backgroundColor: '#ef6c00' },
  tagPersonal: { backgroundColor: '#757575' },
  tagDeadline: { backgroundColor: '#d32f2f' },
  eventDetails: { rowGap: 4 },
  eventTitle: { fontSize: 16, color: '#111827', fontWeight: '700' },
  eventMeta: { fontSize: 12, color: '#666666' },
  eventStatus: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 4 },
  eventStatusText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  statusOngoing: { backgroundColor: '#e3f2fd' },
  statusScheduled: { backgroundColor: '#fff3e0' },
  statusCompleted: { backgroundColor: '#e8f5e9' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 600, backgroundColor: '#FFFFFF', borderRadius: 10, overflow: 'hidden' },
  modalHeader: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  modalFooter: { paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e0e0e0', flexDirection: 'row', justifyContent: 'flex-end', columnGap: 8 },
  filterGroup: { rowGap: 8 },
  filterLabel: { fontSize: 13, color: '#374151', fontWeight: '700' },
  formGroup: { rowGap: 8 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 20, backgroundColor: '#FFFFFF' },
  optionChipOn: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  optionChipText: { fontSize: 12, color: '#111827', fontWeight: '600' },
  optionChipTextOn: { color: '#FFFFFF' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#FFFFFF' },
})
