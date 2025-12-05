# Mockup → React Native TypeScript 변환 계획

## 분석 결과

### Mockup 파일 현황
- **총 파일 수**: 88개
  - HTML: 76개
  - CSS: 8개
  - JavaScript: 4개

### 주요 기능 분류
1. **관리자 기능**: 대시보드, 사용자 관리, 시스템 관리 등
2. **기업 기능**: 채용 공고, 전문가 매칭, 결제 등
3. **개인 전문가 기능**: 프로필, 포트폴리오, 일정 관리 등
4. **공통 기능**: 로그인, 1:1 문의, 알림 등

## 변환 우선순위 및 범위

### 1단계: 모바일 MVP 개발 (메뉴 리스트 기반)

#### 메인 탭 기능
```
┌─────────────────┬──────────────────┬─────────────────┐
   메뉴 기능                →   React Native        →   우선순위   │
├─────────────────┼──────────────────┼─────────────────┤
│ 홈                      →   HomeScreen.tsx     │    최고    │
│ 단기 의뢰              →   ShortTermRequestsScreen.tsx │    높음    │
│ 전문가                  →   ExpertsScreen.tsx   │    높음    │
│ 교육                    →   EducationScreen.tsx  │    중간    │
│ 채용                    →   RecruitmentScreen.tsx │    중간    │
│ 프로필                  →   ProfileScreen.tsx    │    높음    │
└─────────────────┴──────────────────┴─────────────────┘
```

#### 우선순위별 기능 매핑
```
┌──────────────────────┬──────────────────────┬─────────────────────────┐
   MVP →       │ 실제 Mockup 기반      →                  │ 예상 일정     │
├──────────────────────┼──────────────────────┼─────────────────────────┤
│ 1. 기본 구조 설정      │    1-2일              │   폴더 구조, 타입   │
│ 2. 로그인/인증          │  │   ┌  LoginScreen, RegisterScreen             │   3일           │
│ 3. 홈 화면             │  │    홈.html 기반 대시보드 구현    │   2일           │
│ 4. 단기 의뢰 목록      │  │    단기 의뢰 목록.html 기반           │   2일           │
│ 5. 전문가 목록         │  │    전문가 프로필 목록.html 기반      │   2일           │
│ 6. 프로필 기본           │  │    마이페이지_개인.html 기반           │   2일           │
│ 7. 지원자 목록 보기     │  │    단기_의뢰_상세_지원자보기.html 기반 │   3일           │
│ 8. 지원자 심사/판단    │  │    단기의뢰상세_지원자판단.html 기반   │   3일           │
│ 9. 전문가 프로필 등록      │  │    전문가 프로필 등록.html 기반        │   2일           │
│10. 기본 검색 기능        │  │    서치 기능 구현               │   2일           │
└──────────────────────┴──────────────────────┴─────────────────────────┘
```

#### 2단계: 기능 확장 (2-3주)

#### 전문가 심층 기능
```
┌──────────────────────┬──────────────────────┬─────────────────────────┐
│ 포트폴리오 관리        │ PortfolioScreen.tsx           │   중간    │
│  - 포트폴리오 상세          │ PortfolioDetailScreen.tsx      │   중간    │
│  - 포트폴리오 작성          │ PortfolioEditScreen.tsx        │   낮음     │
│  - 이미지 업로드          │                           │   중간    │
```

#### 채용/지원 기능
```
┌──────────────────────┬──────────────────────┬─────────────────────────┐
│ 채용 지원 관리            │ RecruitmentApplicantsScreen.tsx  │   중간    │
│ - 지원자 목록              │                           │   중간    │
│ - 지원자 프로필 보기        │                           │   중간    │
│ - 지원자 심사/판단        │                           │   중간    │
│  - 제안서 관리              │                           │   중간    │
```

#### 3단계: 고급 기능 (2-3주)

#### 교육 및 기능 확장
```
┌──────────────────────┬──────────────────────┬─────────────────────────┐
│ 교육 과정 관리             │ EducationScreen.tsx           │   중간    │
│ - 교육 상세                │ EducationDetailScreen.tsx      │   중간    │
│ - 교육 과정 등록            │ EducationEditScreen.tsx        │   낮음     │
│ - 수강생 관리               │                           │   낮음     │
```

#### 기업용 기능
```
┌──────────────────────┬──────────────────────┬─────────────────────────┐
│ 기업 정보 관리             │ CompanyProfileScreen.tsx         │   낮음     │
│  - 기업 연혁 관리           │ CompanyHistoryScreen.tsx        │   낮음     │
│  - 기업 프로필 보기           │                           │   낮음     │
└──────────────────────┴──────────────────────┴─────────────────────────┘
```

#### 관리자 기능 (필요시)
```
┌──────────────────────┬──────────────────────┬─────────────────────────┐
│ 관리자 대시보드           │ AdminDashboard.tsx          │   낮음     │
│ 사용자 관리                 │ UserManagementScreen.tsx        │   낮음     │
│ 매칭 관리                   │ MatchingDashboard.tsx          │   낮음     │
│ 전문가 인증                   │ VerificationScreen.tsx        │   낮음     │
│ 전문가 매칭                 │ ExpertMatchingScreen.tsx        │   낮음     │
└──────────────────────┴──────────────────────┴─────────────────────────┘
```

## TypeScript 변환 전략

### 1. 타입 정의 (types/)

#### 사용자 타입
```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  type: 'individual' | 'expert' | 'company';
  profile?: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  skills?: Skill[];
  experiences?: Experience[];
  education?: Education[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: Date;
  endDate?: Date;
}
```

#### 채용/매칭 타입
```typescript
// types/job.ts
export interface Job {
  id: string;
  title: string;
  company: Company;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  salary: SalaryRange;
  type: 'fulltime' | 'parttime' | 'contract' | 'freelance';
  status: 'active' | 'closed' | 'draft';
  createdAt: Date;
  deadline?: Date;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  industry: string;
  size: string;
  location: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  appliedAt: Date;
  message?: string;
}
```

#### 포트폴리오 타입
```typescript
// types/portfolio.ts
export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  description: string;
  images: PortfolioImage[];
  categories: string[];
  tags: string[];
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}
```

### 2. React Native 컴포넌트 구조

#### 화면(Screen) 컴포넌트 템플릿
```typescript
// screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useApp } from '../store/AppContext';
import { Job } from '../types/job';
import { colors, spacing } from '../styles/theme';

const HomeScreen: React.FC = ({ navigation }) => {
  const { state } = useApp();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      // API 호출 로직
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
    >
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.companyName}>{item.company.name}</Text>
      <Text style={styles.location}>{item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>전문가를 찾아보세요</Text>
      </View>
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadJobs}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  jobCard: {
    backgroundColor: colors.white,
    margin: spacing.sm,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  companyName: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  location: {
    fontSize: 12,
    color: colors.gray,
  },
});

export default HomeScreen;
```

#### 공통(Common) 컴포넌트
```typescript
// components/common/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing } from '../../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md };
      case 'medium':
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
      case 'large':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default:
        return {};
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: 'bold',
    };

    switch (variant) {
      case 'outline':
        return {
          ...baseStyle,
          color: colors.primary,
        };
      default:
        return {
          ...baseStyle,
          color: colors.white,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
```

### 3. 네비게이션 설정

#### AppNavigator.tsx
```typescript
// navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useApp } from '../store/AppContext';
import { colors } from '../styles/theme';

// Tab Screens
import HomeScreen from '../screens/HomeScreen';
import JobListScreen from '../screens/JobListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Stack Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          // tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={JobListScreen}
        options={{
          tabBarLabel: '일거리',
          // tabBarIcon: ({ color, size }) => <JobIcon color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '프로필',
          // tabBarIcon: ({ color, size }) => <ProfileIcon color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: '설정',
          // tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { state } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
              name="JobDetail"
              component={JobDetailScreen}
              options={{ headerShown: true, title: '상세 정보' }}
            />
            <Stack.Screen
              name="ProfileDetail"
              component={ProfileDetailScreen}
              options={{ headerShown: true, title: '프로필' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

### 4. API 통신 레이어

```typescript
// services/api.ts
import { Job, User, Portfolio } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.jeonsi.com';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Jobs API
  async getJobs(): Promise<Job[]> {
    return this.request<Job[]>('/jobs');
  }

  async getJob(id: string): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`);
  }

  async applyToJob(jobId: string, message?: string): Promise<void> {
    return this.request<void>(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // User API
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setToken(response.token);
    return response;
  }

  async register(userData: any): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    this.setToken(response.token);
    return response;
  }

  async getUserProfile(): Promise<User> {
    return this.request<User>('/user/profile');
  }

  async updateUserProfile(profileData: Partial<User>): Promise<User> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Portfolio API
  async getPortfolios(userId?: string): Promise<Portfolio[]> {
    const endpoint = userId ? `/users/${userId}/portfolios` : '/portfolios';
    return this.request<Portfolio[]>(endpoint);
  }

  async createPortfolio(portfolioData: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>): Promise<Portfolio> {
    return this.request<Portfolio>('/portfolios', {
      method: 'POST',
      body: JSON.stringify(portfolioData),
    });
  }
}

export const apiService = new ApiService();
```

## 변환 작업 순서

### 1단계: 기본 구조 설정 (1-2일)
1. `_frontServer/src/` 폴더 구조 생성
2. 기본 타입 정의 파일 작성
3. 스타일 테마 설정
4. 기본 컴포넌트 작성 (Button, Input, Card 등)

### 2단계: 핵심 화면 개발 (3-5일)
1. LoginScreen, RegisterScreen 구현
2. HomeScreen 구현 (일거리 목록)
3. ProfileScreen 구현
4. 기본 네비게이션 설정

### 3단계: 상세 기능 개발 (2-3일)
1. JobDetailScreen 구현
2. ProfileDetailScreen 구현
3. 지원 기능 구현
4. 검색 필터 기능

### 4단계: API 연동 (2-3일)
1. API 서비스 레이어 구현
2. 인증 로직 연동
3. 데이터 fetching 및 상태 관리
4. 에러 처리 구현

### 5단계: 최적화 및 테스트 (1-2일)
1. 성능 최적화
2. 기본 테스트
3. 디바이스 테스트
4. 버그 수정

## 제외 대상 (Web/Admin 기능)

### 모바일 앱에서 제외할 기능들
- 관리자 대시보드 관련 HTML (admin-*.html)
- 기업 전용 복잡한 기능 (장바구니_기업.html, 일정관리_기업.html 등)
- 베너관리, 뉴스관리 등 CMS 기능
- 복잡한 리포트 및 통계 기능

### 나중에 고려할 기능들
- 알림 푸시 기능
- 채팅/메시징 기능
- 결제 연동
- 파일 업로드 (이미지, 문서)

## 기술적 고려사항

### 1. 스타일링 전략
- StyleSheet API 사용 (Native 성능 최적화)
- 공통 테마 색상 및 spacing 시스템
- 반응형 디자인 (다양한 화면 크기 대응)

### 2. 상태 관리
- React Context + useReducer (단순한 앱 상태)
- 복잡한 데이터는 서버에서 직접 관리
- AsyncStorage를 통한 기본 데이터 캐싱

### 3. 이미지 처리
- expo-image-picker 사용
- expo-image-cache로 이미지 캐싱
- Image 컴포넌트 최적화 (resizeMode, placeholder)

### 4. 네트워크 처리
- Fetch API 기반 간단한 구현
- 기본 에러 handling 및 loading state
- 필요시 axios 도입 고려

### 5. 보안
- HTTPS 통신 필수
- 토큰 기반 인증
- 민감 정보는 SecureStorage 사용

## 예상 개발 기간

- **MVP 버전**: 8-15일
- **전체 기능**: 20-30일
- **테스트 및 최적화**: 5-10일

## 결론

이 계획을 통해 mockup의 핵심 기능들을 React Native + TypeScript로 효과적으로 변환할 수 있습니다. 모든 기능을 한 번에 변환하기보다 MVP(최소 기능 제품)에 집중하여 빠르게 프로토타입을 만들고, 점진적으로 기능을 확장하는 방식을 추천합니다.