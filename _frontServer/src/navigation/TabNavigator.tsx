import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/home'
import LoginScreen from '../screens/home/Login'
import SignupScreen from '../screens/home/Signup'
import SuccessCases from '../screens/help/SuccessCases'
import NewsNoticeList from '../screens/help/NewsNoticeList'
import FAQ from '../screens/help/FAQ'
import InquiryRegistration from '../screens/inquiry/InquiryRegistration'

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
import EducationRegister from '../screens/education/EducationRegister'
import EducationApply from '../screens/education/EducationApply'

import RecruitmentList from '../screens/recruitment/RecruitmentList'
import RecruitmentInput from '../screens/recruitment/RecruitmentInput'
import RecruitmentDetail from '../screens/recruitment/RecruitmentDetail'
import RecruitmentApplicantsManagement from '../screens/recruitment/RecruitmentApplicantsManagement'
import RecruitmentApplicantConform from '../screens/recruitment/RecruitmentApplicantConform'
import RecruitmentApplicantForms from '../screens/recruitment/RecruitmentApplicantForms'

import ScheduleManagerPersonal from '../screens/myPage/ScheduleManagerPersonal'
import ScheduleManagerCorporate from '../screens/myPage/ScheduleManagerCorporate'
import BookmarkList from '../screens/myPage/BookmarkList'


import ShoppingCartCorporate from '../screens/payment/ShoppingCartCorporate'
import ShoppingCartPersonal from '../screens/payment/ShoppingCartPersonal'

import PaymentCheckoutPersonalScreen from '../screens/payment/PaymentCheckoutPersonal'
import PaymentCheckoutCorporateScreen from '../screens/payment/PaymentCheckoutCorporate'

import Settings from '../screens/settings/Settings'

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
      <Tab.Screen name="NewsNoticeList" component={NewsNoticeList} />
      <Tab.Screen name="FAQ" component={FAQ} />
      <Tab.Screen name="InquiryRegistration" component={InquiryRegistration} />

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
      <Tab.Screen name="EducationRegister" component={EducationRegister} />
      <Tab.Screen name="EducationApply" component={EducationApply} />

      <Tab.Screen name="RecruitmentList" component={RecruitmentList} />
      <Tab.Screen name="RecruitmentInput" component={RecruitmentInput} />
      <Tab.Screen name="RecruitmentDetail" component={RecruitmentDetail} />
      <Tab.Screen name="RecruitmentApplicantsManagement" component={RecruitmentApplicantsManagement} />
      <Tab.Screen name="RecruitmentApplicantConform" component={RecruitmentApplicantConform} />
      <Tab.Screen name="RecruitmentApplicantForms" component={RecruitmentApplicantForms} />
      
      <Tab.Screen name="ScheduleManagerPersonal" component={ScheduleManagerPersonal} />
      <Tab.Screen name="ScheduleManagerCorporate" component={ScheduleManagerCorporate} />
      <Tab.Screen name="BookmarkList" component={BookmarkList} />

      <Tab.Screen name="ShoppingCartCorporate" component={ShoppingCartCorporate} />
      <Tab.Screen name="ShoppingCartPersonal" component={ShoppingCartPersonal} />

      <Tab.Screen name="PaymentCheckoutPersonal" component={PaymentCheckoutPersonalScreen} />
      <Tab.Screen name="PaymentCheckoutCorporate" component={PaymentCheckoutCorporateScreen} />

      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  )
}
