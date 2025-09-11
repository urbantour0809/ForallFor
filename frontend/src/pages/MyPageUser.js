import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaClipboardList, 
  FaCheckCircle, 
  FaFileAlt, 
  FaCreditCard, 
  FaCog,
  FaTrophy,
  FaCoins,
  FaStar
} from 'react-icons/fa';
import '../styles/style.css';
import axios from 'axios';

// 네비게이션 탭 구성
const navItems = [
  { key: 'activity', label: '활동 내역', icon: FaClipboardList },
  { key: 'posts', label: '내 게시글', icon: FaFileAlt },
  { key: 'settings', label: '설정', icon: FaCog },
];

// 더미 사용자 정보
const dummyUserInfo = {
  name: '김개발자',
  rank: { 
    name: '실버', 
    color: '#C0C0C0',
    icon: FaTrophy
  },
  experience: { 
    current: 1750, 
    max: 2500,
    level: 7
  },
  points: 23500
};

// 더미 활동 통계
const dummyActivityStats = {
  totalAttempts: 127,
  solvedProblems: 89,
  accuracy: 70.1,
  studyDays: 45,
  currentStreak: 7
};

// 더미 활동 기록
const dummyActivityRecords = [
  { id: 1, title: '두 수의 합', category: '수학', difficulty: '쉬움', result: '정답', date: '2025-01-20', time: '14:23' },
  { id: 2, title: 'API 설계 문제', category: '웹개발', difficulty: '중간', result: '오답', date: '2025-01-20', time: '13:45' },
  { id: 3, title: '배열 정렬하기', category: '알고리즘', difficulty: '쉬움', result: '정답', date: '2025-01-19', time: '16:12' },
  { id: 4, title: '데이터베이스 쿼리', category: '데이터베이스', difficulty: '어려움', result: '정답', date: '2025-01-19', time: '15:33' },
  { id: 5, title: 'React 컴포넌트', category: '프론트엔드', difficulty: '중간', result: '오답', date: '2025-01-18', time: '11:20' },
];

// 더미 해결한 문제
const dummySolvedProblems = [
  { id: 1, title: '두 수의 합', category: '수학', difficulty: '쉬움', solvedDate: '2025-01-20', rating: 4.5 },
  { id: 3, title: '배열 정렬하기', category: '알고리즘', difficulty: '쉬움', solvedDate: '2025-01-19', rating: 4.8 },
  { id: 4, title: '데이터베이스 쿼리', category: '데이터베이스', difficulty: '어려움', solvedDate: '2025-01-19', rating: 4.2 },
];

// 더미 게시글
const dummyUserPosts = [
  { id: 1, title: 'React Hook 사용법에 대한 질문', category: '질문', views: 127, likes: 15, date: '2025-01-18' },
  { id: 2, title: '알고리즘 문제 풀이 팁 공유', category: '팁', views: 89, likes: 23, date: '2025-01-15' },
  { id: 3, title: '코딩테스트 준비 후기', category: '후기', views: 201, likes: 45, date: '2025-01-10' },
];

// 더미 포인트 내역
const dummyPointHistory = [
  { id: 1, type: '충전', amount: 10000, method: '카드결제', date: '2025-01-20', description: '포인트 충전' },
  { id: 2, type: '사용', amount: -500, method: '문제풀이', date: '2025-01-19', description: '프리미엄 문제 해결' },
  { id: 3, type: '적립', amount: 100, method: '활동보상', date: '2025-01-19', description: '연속 학습 보상' },
];

function MyPageUser() {
  const [selectedNav, setSelectedNav] = useState('activity');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 실제 데이터 상태
  const [userInfo, setUserInfo] = useState(null);
  const [userGradeInfo, setUserGradeInfo] = useState(null);
  const [userChallengeSubTitleList, setUserChallengeSubTitleList] = useState([]);
  const [userChallengeSubPassList, setUserChallengeSubPassList] = useState([]);
  const [userChallengeSubLevelList, setUserChallengeSubLevelList] = useState([]);
  const [userChallengeSubCategoryList, setUserChallengeSubCategoryList] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [pointHistory, setPointHistory] = useState([]);
  
  // 설정 탭 상태 관리
  const [newNickname, setNewNickname] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  
  // 활동 내역 페이징 및 필터링 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [activityFilter, setActivityFilter] = useState('all'); // 'all', 'solved', 'failed'
  const itemsPerPage = 10;

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 마이페이지 모든 데이터 한 번에 가져오기
        const response = await axios.get('http://localhost:8080/FAF/api/user/mypage', {
          withCredentials: true
        });

        const data = response.data;
        console.log('서버에서 받은 전체 데이터:', data);
        console.log('userInfo:', data.userInfo);
        console.log('userGradeInfo:', data.userGradeInfo);
        
        setUserInfo(data.userInfo);
        setUserGradeInfo(data.userGradeInfo);
        setUserChallengeSubTitleList(data.userChallengeSubTitleList || []);
        setUserChallengeSubPassList(data.userChallengeSubPassList || []);
        setUserChallengeSubLevelList(data.userChallengeSubLevelList || []);
        setUserChallengeSubCategoryList(data.userChallengeSubCategoryList || []);
        setUserPosts(data.userPostList || []);
        setPointHistory(data.pointHistory || []);
        
        // 닉네임 초기값 설정
        setNewNickname(data.userInfo?.nickname || '');

      } catch (error) {
        console.error('마이페이지 데이터 가져오기 오류:', error);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 닉네임 변경 함수
  const handleNicknameUpdate = async () => {
    if (!newNickname.trim()) {
      setNicknameMessage('닉네임을 입력해주세요.');
      return;
    }

    try {
      setNicknameLoading(true);
      setNicknameMessage('');

      const response = await axios.post('http://localhost:8080/FAF/api/user/nickname/update', {
        nickname: newNickname.trim()
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setNicknameMessage('닉네임이 성공적으로 변경되었습니다.');
        // 사용자 정보 업데이트
        setUserInfo(prev => ({ ...prev, nickname: newNickname.trim() }));
        setNewNickname(newNickname.trim());
      } else {
        setNicknameMessage(response.data.message || '닉네임 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('닉네임 변경 오류:', error);
      setNicknameMessage(error.response?.data?.message || '닉네임 변경 중 오류가 발생했습니다.');
    } finally {
      setNicknameLoading(false);
    }
  };

  // 비밀번호 변경 함수
  const handlePasswordUpdate = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setPasswordMessage('모든 필드를 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 2) {
      setPasswordMessage('비밀번호는 최소 2자 이상이어야 합니다.');
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordMessage('');

      const response = await axios.post('http://localhost:8080/FAF/api/user/password/update', {
        currentPassword: currentPassword,
        password: newPassword
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setPasswordMessage('비밀번호가 성공적으로 변경되었습니다.');
        // 입력 필드 초기화
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      setPasswordMessage('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // 경험치 퍼센티지 계산 - userGradeInfo 사용
  const experiencePercentage = (() => {
    if (!userInfo?.experience_points) {
      return 0;
    }
    
    const currentExp = userInfo.experience_points;
    const maxExp = userGradeInfo?.max_experience || 2500;
    
    if (currentExp >= maxExp) return 100;
    
    const percentage = (currentExp / maxExp) * 100;
    return percentage;
  })();
  
  // 활동 내역 필터링 및 페이징 처리
  const filteredRecords = userChallengeSubTitleList?.map((title, index) => {
    const passInfo = userChallengeSubPassList?.[index];
    const levelInfo = userChallengeSubLevelList?.[index];
    const categoryInfo = userChallengeSubCategoryList?.[index];
    
    // 디버깅용 로그
    console.log(`Index ${index}: passInfo=`, passInfo);
    console.log(`Index ${index}: pass value=`, passInfo?.pass, 'type=', typeof passInfo?.pass);
    
    return {
      id: index + 1,
      title: title?.challenge_title || '제목 없음',
      category: categoryInfo?.category_name || '카테고리 없음',
      difficulty: levelInfo?.level_name || '난이도 없음',
             result: passInfo?.pass == 1 ? '정답' : '오답'
    };
  }).filter(record => {
    if (activityFilter === 'all') return true;
    if (activityFilter === 'solved') return record.result === '정답';
    if (activityFilter === 'failed') return record.result === '오답';
    return true;
  }) || [];
  
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="mypage-container">
        <div className="mypage-main-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
                마이페이지 정보를 불러오는 중...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 오류 발생 시 표시
  if (error) {
    return (
      <div className="mypage-container">
        <div className="mypage-main-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <p className="text-lg text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary px-6 py-2 rounded-lg"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      {/* Sidebar Navigation */}
      <nav className="sidebar-nav">
        <h2 className="sidebar-title">
          마이페이지
        </h2>
        
        <ul className="sidebar-menu">
          {navItems.map(item => (
            <li
              key={item.key}
              className={`user-nav-link px-4 py-3 text-sm font-medium rounded-lg${selectedNav === item.key ? ' active' : ''}`}
              onClick={() => setSelectedNav(item.key)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedNav(item.key); }}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <item.icon size={16} />
                <span>{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="mypage-main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 사용자 프로필 카드 */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mypage-header"
          >
            <div className="glass-effect rounded-2xl p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                
                {/* 프로필 정보 */}
                <div className="flex-1 text-center lg:text-left">
                                       <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                       <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                         {userInfo?.nickname?.charAt(0) || 'U'}
                       </div>
                       <div>
                         <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                           {userInfo?.nickname || '사용자'}
                         </h1>
                         <div className="flex items-center gap-2" style={{ color: userGradeInfo?.grade_color || '#C0C0C0' }}>
                           <FaTrophy size={16} />
                           <span className="font-semibold">{userGradeInfo?.grade_name || '실버'}</span>
                         </div>
                       </div>
                     </div>
                  
                                     {/* 경험치 바 */}
                   <div className="mb-4">
                     <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                       <span>경험치</span>
                       <span>{userInfo?.experience_points || 0}/{userGradeInfo?.max_experience || 2500}</span>
                     </div>
                     <div className="w-full bg-gray-700 rounded-full h-3">
                       <div 
                         className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                         style={{ width: `${experiencePercentage}%` }}
                       />
                     </div>
                   </div>
                </div>

                                 {/* 포인트 정보 */}
                 <div className="text-center">
                   <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
                     <FaCoins className="text-3xl mb-2 mx-auto" />
                     <div className="text-sm opacity-90">보유 포인트</div>
                     <div className="text-2xl font-bold">{(userInfo?.point || 0).toLocaleString()}P</div>
                   </div>
                 </div>


              </div>
            </div>
          </motion.section>

          {/* 메인 콘텐츠 영역 - 탭별 내용 */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-effect rounded-2xl p-8"
          >
            {/* 활동 내역 탭 */}
            {selectedNav === 'activity' && (
              <div>
                <h3 className="gradient-text text-2xl md:text-3xl font-bold mb-6">활동 내역</h3>
                
                                                   {/* 상세 통계 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-500 mb-2">{userChallengeSubPassList?.length || 0}</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>총 시도</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500 mb-2">
                        {userChallengeSubPassList?.filter(pass => pass?.pass == 1).length || 0}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>해결 완료</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-500 mb-2">
                        {userChallengeSubPassList?.length > 0 
                          ? Math.round((userChallengeSubPassList.filter(pass => pass?.pass == 1).length / userChallengeSubPassList.length) * 100)
                          : 0}%
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>정답률</div>
                    </div>
                  </div>

                {/* 페이지 정보 */}
                <div className="flex justify-end mb-6">
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    총 {filteredRecords.length}개 중 {(startIndex + 1)}-{Math.min(endIndex, filteredRecords.length)}개
                  </div>
                </div>

                                                                   {/* 활동 기록 */}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>활동 기록</h4>
                    <select 
                      value={activityFilter}
                      onChange={(e) => {
                        setActivityFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-3 py-1 text-sm rounded bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="all">전체</option>
                      <option value="solved">해결한 문제</option>
                      <option value="failed">틀린 문제</option>
                    </select>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr style={{ background: 'var(--bg-secondary)' }}>
                          <th className="text-left p-3 border-b" style={{ color: 'var(--text-primary)' }}>문제명</th>
                          <th className="text-center p-3 border-b" style={{ color: 'var(--text-primary)' }}>카테고리</th>
                          <th className="text-center p-3 border-b" style={{ color: 'var(--text-primary)' }}>난이도</th>
                          <th className="text-center p-3 border-b" style={{ color: 'var(--text-primary)' }}>결과</th>
                        </tr>
                      </thead>
                    <tbody>
                      {currentRecords.map(record => (
                        <tr key={record.id} className="hover:bg-white/5">
                          <td className="p-3 border-b" style={{ color: 'var(--text-primary)' }}>{record.title}</td>
                          <td className="text-center p-3 border-b" style={{ color: 'var(--text-secondary)' }}>{record.category}</td>
                          <td className="text-center p-3 border-b">
                            <span className={`px-2 py-1 rounded text-xs ${
                              record.difficulty === '쉬움' ? 'bg-green-500/20 text-green-400' :
                              record.difficulty === '중간' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {record.difficulty}
                            </span>
                          </td>
                                                     <td className="text-center p-3 border-b">
                             <span className={`px-2 py-1 rounded text-xs ${
                               record.result === '정답' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                             }`}>
                               {record.result}
                             </span>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* 페이징 컨트롤 */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      이전
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg border ${
                          currentPage === page 
                            ? 'bg-purple-500 border-purple-500 text-white' 
                            : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      다음
                    </button>
                  </div>
                )}
              </div>
            )}

                         

            {/* 내 게시글 탭 */}
            {selectedNav === 'posts' && (
              <div>
                <h3 className="gradient-text text-2xl md:text-3xl font-bold mb-6">내 게시글</h3>
                <div className="space-y-4">
                  {userPosts && userPosts.length > 0 ? (
                    userPosts.map(post => {
                      // post가 null이거나 유효하지 않은 경우 건너뛰기
                      if (!post || !post.post_id) {
                        return null;
                      }

                                             // 카테고리 정보 매핑 (프론트엔드에서 처리)
                       const categoryMap = {
                         1: 'Frontend',
                         2: 'Backend',
                         3: 'Data Science',
                         4: 'Study',
                         5: 'Interview'
                       };
                       
                       const category = categoryMap[post.category_id] || '카테고리 없음';
                      
                      

                      return (
                        <div key={post.post_id} className="border border-gray-600 rounded-lg p-4 hover:bg-white/5 transition-colors">
                                                     <div className="flex justify-between items-start mb-2">
                             <h4 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                               {post.title || '제목 없음'}
                             </h4>
                             <span className="text-sm px-2 py-1 rounded bg-gray-600 text-white">
                               {category}
                             </span>
                           </div>
                                                     <div className="flex justify-between items-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                             <div className="flex gap-4">
                               <span>조회수: {post.views || 0}</span>
                             </div>
                           </div>
                        </div>
                      );
                    }).filter(Boolean) // null 값 제거
                  ) : (
                    <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                      <p>작성한 게시글이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 설정 탭 */}
            {selectedNav === 'settings' && (
              <div>
                <h3 className="gradient-text text-2xl md:text-3xl font-bold mb-6">설정</h3>
                
                <div className="space-y-8">
                  {/* 닉네임 변경 */}
                  <div className="border border-gray-600 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>닉네임 변경</h4>
                    <div className="flex gap-4">
                                             <input 
                         type="text" 
                         placeholder="새 닉네임 입력" 
                         className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:outline-none"
                         value={newNickname}
                         onChange={(e) => setNewNickname(e.target.value)}
                         disabled={nicknameLoading}
                       />
                      <button 
                        onClick={handleNicknameUpdate}
                        className="btn-primary px-6 py-2 rounded-lg"
                        disabled={nicknameLoading}
                      >
                        {nicknameLoading ? '변경 중...' : '변경'}
                      </button>
                    </div>
                    {nicknameMessage && (
                      <p className={`mt-2 text-sm ${nicknameMessage.includes('성공') ? 'text-green-400' : 'text-red-400'}`}>
                        {nicknameMessage}
                      </p>
                    )}
                  </div>

                  {/* 비밀번호 변경 */}
                  <div className="border border-gray-600 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>비밀번호 변경</h4>
                    <div className="space-y-4">
                      <input 
                        type="password" 
                        placeholder="현재 비밀번호" 
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:outline-none"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={passwordLoading}
                      />
                      <input 
                        type="password" 
                        placeholder="새 비밀번호" 
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:outline-none"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={passwordLoading}
                      />
                      <input 
                        type="password" 
                        placeholder="새 비밀번호 확인" 
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:outline-none"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={passwordLoading}
                      />
                      <button 
                        onClick={handlePasswordUpdate}
                        className="btn-primary px-6 py-2 rounded-lg"
                        disabled={passwordLoading}
                      >
                        {passwordLoading ? '변경 중...' : '비밀번호 변경'}
                      </button>
                    </div>
                    {passwordMessage && (
                      <p className={`mt-2 text-sm ${passwordMessage.includes('성공') ? 'text-green-400' : 'text-red-400'}`}>
                        {passwordMessage}
                      </p>
                    )}
                  </div>


                </div>
              </div>
            )}
          </motion.section>
        </div>
      </main>
    </div>
  );
}

export default MyPageUser;
