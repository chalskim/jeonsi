# 전시(JeonSi) 모바일 앱 설계 문서

## 프로젝트 개요

**프로젝트명**: jeonsi-mobile
**기술스택**: React Native + Expo SDK 54
**타겟플랫폼**: iOS, Android, Web
**버전**: 1.0.0

## 상태 분석

현재 `_frontServer` 폴더에는 Expo 프로젝트 기본 구조만 있으며, 실제 앱 코드가 구현되어 있지 않습니다.

## 권장 단순화 구조

```
_frontServer/
├── src/
│   ├── components/           # 재사용 컴포넌트
│   │   ├── common/          # 기본 UI (Button, Input 등)
│   │   └── screens/         # 화면 관련 컴포넌트
│   ├── screens/             # 메인 화면
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ExhibitionScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/          # 네비게이션
│   │   └── AppNavigator.tsx
│   ├── services/            # API 연동
│   │   └── api.ts
│   ├── store/               # 간단한 상태 관리
│   │   └── AppContext.tsx
│   ├── utils/               # 유틸리티
│   │   └── constants.ts
│   └── styles/              # 스타일
│       └── theme.ts
├── App.tsx                  # 앱 진입점
├── app.json                 # Expo 설정
└── package.json            # 의존성
```


## 단순화된 네비게이션 구조

```
TabNavigator (Bottom Tabs)
├── HomeScreen        # 홈 화면
├── ExhibitionScreen  # 전시 목록
├── SearchScreen      # 검색
└── ProfileScreen     # 프로필

Stack Navigator (화면 이동)
├── LoginScreen       # 로그인
└── ExhibitionDetailScreen # 전시 상세
```

## 간단한 컴포넌트 구조

### 1. 기본 컴포넌트
- **Button**: 기본 버튼
- **Input**: 텍스트 입력
- **Card**: 전시 카드
- **Header**: 화면 헤더

### 2. 컴포넌트 설계 원칙
- 필요한 것만 만들기
- 재사용성 고려
- 간결하게 구현

## 간단한 상태 관리

### 1. React Context + useReducer 사용
```typescript
// store/AppContext.tsx
import React, { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  exhibitions: [],
  loading: false
}

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false }
    case 'SET_EXHIBITIONS':
      return { ...state, exhibitions: action.payload }
    default:
      return state
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
```

## 간단한 API 통신

### 1. 기본 API 함수
```typescript
// services/api.ts
const API_URL = 'https://api.jeonsi.com'

export const api = {
  // 기본 GET 요청
  get: async (url: string) => {
    try {
      const response = await fetch(`${API_URL}${url}`)
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // 기본 POST 요청
  post: async (url: string, data: any) => {
    try {
      const response = await fetch(`${API_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}

// API 함수들
export const exhibitionsApi = {
  getExhibitions: () => api.get('/exhibitions'),
  getExhibitionDetail: (id: string) => api.get(`/exhibitions/${id}`),
  searchExhibitions: (query: string) => api.get(`/exhibitions/search?q=${query}`)
}

export const authApi = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData)
}
```

## 간단한 스타일링

### 1. StyleSheet 사용
```typescript
// styles/theme.ts
import { StyleSheet } from 'react-native'

export const colors = {
  primary: '#2C3E50',
  secondary: '#3498DB',
  background: '#FFFFFF',
  text: '#2C3E50',
  gray: '#7F8C8D',
  border: '#E1E4E8'
}

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
}

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: colors.background,
    padding: spacing.md,
    margin: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border
  }
})
```

### 2. 스타일 적용 예시
```typescript
// components/Button.tsx
import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { colors, spacing } from '../styles/theme'

const Button = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center'
  },
  text: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold'
  }
})
```

## 기본 최적화

### 1. 간단한 최적화
- React.memo 사용 (필요할 때만)
- FlatList 사용 (리스트)
- 이미지 크기 최적화

### 2. 기본 보안
- HTTPS 사용
- 기본 입력값 검증

## 권장 최소 라이브러리

```json
{
  "@react-navigation/native": "^7.1.19",
  "@react-navigation/native-stack": "^7.6.1",
  "@react-navigation/bottom-tabs": "^7.4.9",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0"
}
```

## 다음 단계

1. **기본 구조 생성**: 폴더 및 파일 구조
2. **핵심 화면**: 로그인, 홈, 전시, 프로필
3. **네비게이션**: 기본 탭 네비게이션
4. **API 연동**: 전시 데이터 연동
5. **스타일링**: 기본 테마 적용
6. **테스트**: 기본 기능 확인

이 단순화된 구조로 빠르게 프로토타입을 만들 수 있습니다.