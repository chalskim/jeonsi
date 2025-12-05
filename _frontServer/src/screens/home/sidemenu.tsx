import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Modal, Animated, ScrollView, Easing, StyleSheet } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

type MenuItem = { label: string; icon: string }
type MenuCategory = { title: string; icon: string; items: MenuItem[] }

type Props = {
  open: boolean
  onClose: () => void
  categories: MenuCategory[]
}

export default function SideMenu({ open, onClose, categories }: Props) {
  const navigation = useNavigation<any>()
  const slideAnim = useRef(new Animated.Value(-280)).current
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (open) {
      slideAnim.setValue(-280)
      Animated.timing(slideAnim, { toValue: 0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start()
    } else {
      Animated.timing(slideAnim, { toValue: -280, duration: 180, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start()
    }
  }, [open])

  useEffect(() => {
    const check = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token')
        setIsLoggedIn(!!token)
      } catch {
        setIsLoggedIn(false)
      }
    }
    if (open) check()
  }, [open])

  return (
    <Modal visible={open} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.header}>
            <Text style={styles.title}>메뉴</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome5 name="times" size={18} color="#374151" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator>
            {categories.map((cat) => (
              <View key={cat.title} style={styles.category}>
                <View style={styles.categoryTitleRow}>
                  <FontAwesome5 name={cat.icon as any} size={16} color="#2563EB" />
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                </View>
                {cat.items.map((item) => {
                  const displayLabel = item.label.includes('로그인') ? (isLoggedIn ? '로그아웃' : '로그인') : item.label
                  const displayIcon = item.label.includes('로그인') ? (isLoggedIn ? 'sign-out-alt' : item.icon) : item.icon
                  return (
                    <TouchableOpacity
                      key={`${cat.title}-${item.label}`}
                      style={styles.menuItem}
                      onPress={async () => {
                        if (item.label.includes('로그인')) {
                          if (isLoggedIn) {
                            await AsyncStorage.removeItem('access_token')
                            await AsyncStorage.removeItem('auth_user')
                            // navigation.navigate('Login')
                            setIsLoggedIn(false)
                            onClose()
                            return
                          } else {
                            navigation.navigate('Login', { prev: 'Home' } as never)
                            onClose()
                            return
                          }
                        }
                        if (item.label.includes('내정보(개인)')) {
                          navigation.navigate('MyPagePersonal', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('내정보(기업)')) {
                          navigation.navigate('MyPageCorporate', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('성공사례')) {
                          navigation.navigate('SuccessCases', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('단기의뢰 목록 및 등록')) {
                          navigation.navigate('ShortTermRequestsList', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('전문가 목록 및 등록')) {
                          navigation.navigate('ExpertsList', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('교육 목록 및 등록')) {
                          navigation.navigate('EducationsList', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('구인 목록 및 등록')) {
                          navigation.navigate('RecruitmentList', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('일정관리(개인)')) {
                          navigation.navigate('ScheduleManagerPersonal', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('일정관리(기업)')) {
                          navigation.navigate('ScheduleManagerCorporate', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('북마크(개인)')) {
                          navigation.navigate('BookmarkList', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('북마크(기업)')) {
                          navigation.navigate('BookmarkList', { prev: 'Home' } as never)
                          onClose()
                          return
                        }

                        if (item.label.includes('개인 장바구니')) {
                          navigation.navigate('ShoppingCartPersonal', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('기업 장바구니')) {
                          navigation.navigate('ShoppingCartCorporate', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('설정')) {
                          navigation.navigate('Settings', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('QA질문')) {
                          navigation.navigate('FAQ', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                        if (item.label.includes('뉴스/공지 사항')) {
                          navigation.navigate('NewsNoticeList', { prev: 'Home' } as never)
                          onClose()
                          return
                        }
                      }}
                    >
                      <FontAwesome5 name={displayIcon as any} size={18} color="#0066CC" style={{ width: 24 }} />
                      <Text style={styles.menuLabel}>{displayLabel}</Text>
                    </TouchableOpacity>
                  )
                })}
                <View style={styles.divider} />
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  menu: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 280, backgroundColor: '#FFFFFF', borderRightWidth: 1, borderRightColor: '#E5E7EB', paddingTop: 60 },
  header: { height: 60, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#FFFFFF' },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  content: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 12 },
  category: { marginBottom: 8 },
  categoryTitleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  categoryTitle: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  menuLabel: { fontSize: 14, color: '#374151', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 }
})
