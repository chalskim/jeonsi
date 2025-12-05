import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/home'
import LoginScreen from '../screens/home/Login'
import SignupScreen from '../screens/home/Signup'
import SuccessCases from '../screens/help/SuccessCases'
import MyPagePersonal from '../screens/myPage/MyPagePersonal'
import LoginInfoEdit from '../screens/myPage/LoginInfoEdit'
import MyPageCorporate from '../screens/myPage/MyPageCorporate'
import RegistrationCompany from '../screens/auth/RegistrationCompany'
import ShortTermRequestsList from '../screens/shortTermRequests/ShortTermRequestsList'  
import ShortTermRequestsInput from '../screens/shortTermRequests/ShortTermRequestsInput'
import ShortTermRequestsApplicants from '../screens/shortTermRequests/ShortTermRequestsApplicants'
import ShortTermRequestsApplicantsManagement from '../screens/shortTermRequests/ShortTermRequestsApplicantsManagement'
import ShortTermRequestsDetail from '../screens/shortTermRequests/ShortTermRequestsDetail'

import ExpertsList from '../screens/experts/ExpertsList'
import ExpertsDetail from '../screens/experts/ExpertsDetail'
import ExpertsRegistration from '../screens/experts/ExpertsRegistration'

import EducationsList from '../screens/education/EducationList'
import EducationDetail from '../screens/education/EducationDetail'
import EducationStudents from '../screens/education/EducationStudents'
const Tab = createBottomTabNavigator()

export default function TabNavigator() {
  return (
    <Tab.Navigator tabBar={() => null} screenOptions={{ headerShown: false }}>
      {/* 홈 */}
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* 로그인/로그아웃 */}
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Signup" component={SignupScreen} />
      <Tab.Screen name="SuccessCases" component={SuccessCases} />

      <Tab.Screen name="MyPagePersonal" component={MyPagePersonal} />
      <Tab.Screen name="LoginInfoEdit" component={LoginInfoEdit} />
      
      <Tab.Screen name="MyPageCorporate" component={MyPageCorporate} />
      <Tab.Screen name="RegistrationCompany" component={RegistrationCompany} />
      <Tab.Screen name="ShortTermRequestsList" component={ShortTermRequestsList} />
      <Tab.Screen name="ShortTermRequestsInput" component={ShortTermRequestsInput} />
      <Tab.Screen name="ShortTermRequestsApplicants" component={ShortTermRequestsApplicants} />
      <Tab.Screen name="ShortTermRequestsApplicantsManagement" component={ShortTermRequestsApplicantsManagement} />
      <Tab.Screen name="ShortTermRequestsDetail" component={ShortTermRequestsDetail} />
      <Tab.Screen name="ExpertsList" component={ExpertsList} />
      <Tab.Screen name="ExpertsDetail" component={ExpertsDetail} />
      <Tab.Screen name="ExpertsRegistration" component={ExpertsRegistration} />
      
      <Tab.Screen name="EducationsList" component={EducationsList} />
      <Tab.Screen name="EducationDetail" component={EducationDetail} />
      <Tab.Screen name="EducationStudents" component={EducationStudents} />
    </Tab.Navigator>
  )
}
