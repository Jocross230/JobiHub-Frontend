import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import {
  ProtectedRoute,
  AdminRoute,
  BusinessRoute,
} from './components/layout/ProtectedRoute';

import BusinessProfile from './pages/business/BusinessProfile';
import PaymentVerification from './pages/PaymentVerification';
import JobSeekerSupport from './pages/Support';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import BusinessSupport from './pages/business/Support';
import AdminLogin from './pages/admin/AdminLogin';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSettings from './pages/admin/AdminSettings';
import { CoverLetterProvider } from './context/CoverLetterContext';
import JobListings from './pages/business/JobListings';
import MyApplications from './pages/jobs/MyApplications';
import Applicants from './pages/business/Applicants';
import ApplicantCv from './pages/business/ApplicantCv';
import SearchCandidates from './pages/business/SearchCandidates';
import CandidateCv from './pages/business/CandidateCv';
import SavedCandidates from './pages/business/SavedCandidates';
// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForBusiness from './pages/business/ForBusiness';

// App pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CoverLetter from './pages/CoverLetter';

// CV pages
import MyCVs from './pages/cv/MyCVs';
import CVBuilder from './pages/cv/CVBuilder';

// Job pages
import FindJobs from './pages/jobs/FindJobs';
import SavedJobs from './pages/jobs/SavedJobs';
import JobDetails from './pages/jobs/JobDetails';

// Business pages
import BusinessDashboard from './pages/business/BusinessDashboard';
import PostJob from './pages/business/PostJob';
import RecruitmentSupport from './pages/business/RecruitmentSupport';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCVs from './pages/admin/AdminCVs';
import AdminBusinesses from './pages/admin/AdminBusinesses';
import AdminJobs from './pages/admin/AdminJobs';
import AdminRecruitment from './pages/admin/AdminRecruitment';
import AdminSupport from './pages/admin/AdminSupport';
import AdminActivity from './pages/admin/AdminActivity';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CoverLetterProvider>
          <Routes>

            {/* Public */}
            <Route
              path="/"
              element={<Landing />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route
              path="/for-business"
              element={<ForBusiness />}
            />

            <Route
              path="/business/recruitment"
              element={<RecruitmentSupport />}
            />

            {/* Protected user routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

              <Route
                  path="/business/candidates/:cvId"
                  element={
                      <BusinessRoute>
                          <CandidateCv />
                      </BusinessRoute>
                  }
              />

              <Route
                  path="/business/saved-candidates"
                  element={
                      <BusinessRoute>
                          <SavedCandidates />
                      </BusinessRoute>
                  }
              />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cover-letter"
              element={
                <ProtectedRoute>
                  <CoverLetter />
                </ProtectedRoute>
              }
            />

            {/* CV routes */}
            <Route
              path="/my-cvs"
              element={
                <ProtectedRoute>
                  <MyCVs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cv-builder"
              element={
                <ProtectedRoute>
                  <CVBuilder />
                </ProtectedRoute>
              }
            />
              <Route
                  path="/business/candidates"
                  element={
                      <BusinessRoute>
                          <SearchCandidates />
                      </BusinessRoute>
                  }
              />


            <Route
              path="/cv-builder/:id"
              element={
                <ProtectedRoute>
                  <CVBuilder />
                </ProtectedRoute>
              }
            />
              <Route
                  path="/admin/payments"
                  element={
                      <ProtectedRoute>
                          <AdminPayments />
                      </ProtectedRoute>
                  }
              />

            {/* Job routes */}
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <FindJobs />
                </ProtectedRoute>
              }
            />
              <Route
                  path="/reset-password"
                  element={<ResetPassword />}
              />

            <Route
              path="/jobs/:id"
              element={
                <ProtectedRoute>
                  <JobDetails />
                </ProtectedRoute>
              }
            />
              <Route
                  path="/forgot-password"
                  element={<ForgotPassword />}
              />

            <Route
              path="/saved-jobs"
              element={
                <ProtectedRoute>
                  <SavedJobs />
                </ProtectedRoute>
              }
            />

              <Route
                  path="/support"
                  element={
                      <ProtectedRoute>
                          <JobSeekerSupport />
                      </ProtectedRoute>
                  }
              />

            {/* Business routes */}
            <Route
              path="/business"
              element={
                <BusinessRoute>
                  <BusinessDashboard />
                </BusinessRoute>
              }
            />
              <Route
                  path="/business/support"
                  element={
                      <BusinessRoute>
                          <BusinessSupport />
                      </BusinessRoute>
                  }
              />

              <Route
                  path="/business/applicants"
                  element={
                      <BusinessRoute>
                          <Applicants />
                      </BusinessRoute>
                  }
              />

              <Route
                  path="/business/applicants/:applicationId"
                  element={
                      <BusinessRoute>
                          <ApplicantCv />
                      </BusinessRoute>
                  }
              />

            <Route
              path="/business/post-job"
              element={
                <BusinessRoute>
                  <PostJob />
                </BusinessRoute>
              }
            />

            <Route
              path="/business/profile"
              element={
                <BusinessRoute>
                  <BusinessProfile />
                </BusinessRoute>
              }
            />

            <Route
              path="/business/jobs"
              element={
                <BusinessRoute>
                  <JobListings />
                </BusinessRoute>
              }
            />

            {/* Admin routes */}
              <Route
                  path="/admin/login"
                  element={<AdminLogin />}
              />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/cvs"
              element={
                <AdminRoute>
                  <AdminCVs />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/businesses"
              element={
                <AdminRoute>
                  <AdminBusinesses />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/jobs"
              element={
                <AdminRoute>
                  <AdminJobs />
                </AdminRoute>
              }
            />
              <Route
                  path="/admin/settings"
                  element={
                      <AdminRoute>
                          <AdminSettings />
                      </AdminRoute>
                  }
              />

            <Route
              path="/admin/recruitment"
              element={
                <AdminRoute>
                  <AdminRecruitment />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/support"
              element={
                <AdminRoute>
                  <AdminSupport />
                </AdminRoute>
              }
            />
              <Route
                  path="/payment-verification"
                  element={
                      <ProtectedRoute>
                          <PaymentVerification />
                      </ProtectedRoute>
                  }
              />

            <Route
              path="/admin/activity"
              element={
                <AdminRoute>
                  <AdminActivity />
                </AdminRoute>
              }
            />

            {/* Fallbacks */}
            <Route
              path="/recruitment"
              element={
                <ProtectedRoute>
                  <RecruitmentSupport />
                </ProtectedRoute>
              }
            />
              <Route
                  path="/my-applications"
                  element={
                      <ProtectedRoute>
                          <MyApplications />
                      </ProtectedRoute>
                  }
              />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>
        </CoverLetterProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

