import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function LoginInfoEdit() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()

  const [formData, setFormData] = useState({
    email: 'kimminsu@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const validateForm = () => {
    if (!formData.email.includes('@')) {
      Alert.alert('오류', '올바른 이메일 주소를 입력해주세요.')
      return false
    }

    if (!formData.currentPassword) {
      Alert.alert('오류', '현재 비밀번호를 입력해주세요.')
      return false
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      Alert.alert('오류', '새 비밀번호는 8자 이상이어야 합니다.')
      return false
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      Alert.alert('오류', '새 비밀번호가 일치하지 않습니다.')
      return false
    }

    return true
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    // TODO: API 호출로 정보 업데이트
    Alert.alert(
      '성공',
      '로그인 정보가 성공적으로 수정되었습니다.',
      [
        {
          text: '확인',
          onPress: () => {
            const prev = (route as any)?.params?.prev
            if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
              (navigation as any).goBack()
              return
            }
            if (typeof prev === 'string') {
              navigation.navigate(prev)
              return
            }
            navigation.navigate('Home')
          }
        }
      ]
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          activeOpacity={0.8}
          onPress={() => {
            const prev = (route as any)?.params?.prev
            if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
              (navigation as any).goBack()
              return
            }
            if (typeof prev === 'string') {
              navigation.navigate(prev)
              return
            }
            navigation.navigate('Home')
          }}
        >
          <FontAwesome5 name="chevron-left" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>로그인 정보 수정</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>이메일 주소</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="이메일 주소를 입력하세요"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>현재 비밀번호</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={formData.currentPassword}
                onChangeText={(value) => handleInputChange('currentPassword', value)}
                placeholder="현재 비밀번호를 입력하세요"
                secureTextEntry={!showPasswords.current}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => togglePasswordVisibility('current')}
              >
                <FontAwesome5
                  name={showPasswords.current ? "eye-slash" : "eye"}
                  size={16}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>새 비밀번호</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={formData.newPassword}
                onChangeText={(value) => handleInputChange('newPassword', value)}
                placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                secureTextEntry={!showPasswords.new}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => togglePasswordVisibility('new')}
              >
                <FontAwesome5
                  name={showPasswords.new ? "eye-slash" : "eye"}
                  size={16}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>새 비밀번호 확인</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                placeholder="새 비밀번호를 다시 입력하세요"
                secureTextEntry={!showPasswords.confirm}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => togglePasswordVisibility('confirm')}
              >
                <FontAwesome5
                  name={showPasswords.confirm ? "eye-slash" : "eye"}
                  size={16}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>💡 안내</Text>
          <Text style={styles.infoText}>• 비밀번호는 8자 이상으로 설정해주세요.</Text>
          <Text style={styles.infoText}>• 이메일 변경 시 인증 절차가 필요할 수 있습니다.</Text>
          <Text style={styles.infoText}>• 보안을 위해 정기적으로 비밀번호를 변경해주세요.</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              const prev = (route as any)?.params?.prev
              if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
                (navigation as any).goBack()
                return
              }
              if (typeof prev === 'string') {
                navigation.navigate(prev)
                return
              }
              navigation.navigate('Home')
            }}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>저장</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6'
  },
  content: {
    paddingBottom: 30
  },
  header: {
    height: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827'
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerPlaceholder: {
    width: 40,
    height: 40
  },
  formContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#111827'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    backgroundColor: '#ffffff'
  },
  passwordInput: {
    flex: 1,
    borderWidth: 0,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827'
  },
  eyeIcon: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    justifyContent: 'center'
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 15
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 10
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 5,
    lineHeight: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    margin: 20,
    marginTop: 30
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d'
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff'
  }
})
