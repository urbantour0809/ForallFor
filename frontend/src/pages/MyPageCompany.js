import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPuzzlePiece, 
  FaComments,
  FaPlus,
  FaEye,
  FaCode,
  FaUser,
  FaClock,
  FaCalendar
} from 'react-icons/fa';
import '../styles/style.css';
import CodeViewModal from '../components/CodeViewModal';
import WriteTest from './WriteTest';
import axios from 'axios';

// 페이징 스타일
const paginationStyles = `
  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 0.5rem;
  }
  
  .page-item {
    margin: 0;
  }
  
  .page-link {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .page-link:hover {
    background: var(--accent-color);
    color: white;
  }
  
  .page-item.active .page-link {
    background: var(--accent-color);
    color: white;
  }
  
  .page-item.disabled .page-link {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 네비게이션 탭 구성
const navItems = [
  { key: 'problems', label: '코딩 테스트 관리', icon: FaPuzzlePiece },
  { key: 'submissions', label: '제출 내역', icon: FaCode },
  { key: 'chat', label: '채팅 관리', icon: FaComments },
];

// 기업 정보
const companyName = '테크이노베이션';

// 하드코딩된 기본 데이터
const defaultCompanyInfo = {
  company_name: '테크이노베이션',
  company_id: 1
};

const defaultCompanyProblems = [
  { 
    problem_id: 1, 
    title: '[테크이노베이션] 알고리즘 기초', 
    category_name: '알고리즘', 
    difficulty: '중급', 
    created_date: '2025-01-15',
    submission_count: 5,
    status: '활성'
  },
  { 
    problem_id: 2, 
    title: '[테크이노베이션] 백엔드 개발', 
    category_name: '백엔드', 
    difficulty: '고급', 
    created_date: '2025-01-10',
    submission_count: 3,
    status: '활성'
  },
  { 
    problem_id: 3, 
    title: '[테크이노베이션] 프론트엔드 개발', 
    category_name: '프론트엔드', 
    difficulty: '중급', 
    created_date: '2025-01-08',
    submission_count: 4,
    status: '활성'
  },
  { 
    problem_id: 4, 
    title: '[테크이노베이션] 데이터베이스', 
    category_name: '데이터베이스', 
    difficulty: '고급', 
    created_date: '2025-01-05',
    submission_count: 2,
    status: '활성'
  },
  { 
    problem_id: 5, 
    title: '[테크이노베이션] 자료구조', 
    category_name: '알고리즘', 
    difficulty: '중급', 
    created_date: '2025-01-03',
    submission_count: 6,
    status: '활성'
  },
];

const defaultCompanySubmissions = [
  {
    submission_id: 1,
    problem_id: 1,
    user_name: '김개발',
    user_email: 'kim.dev@email.com',
    submitted_date: '2025-01-20',
    submitted_time: '14:23',
    result: '합격',
    code: `function rotateArray(arr, k) {
  const n = arr.length;
  k = k % n;
  return arr.slice(-k).concat(arr.slice(0, -k));
}`,
    language: 'JavaScript'
  },
  {
    submission_id: 2,
    problem_id: 1,
    user_name: '이코딩',
    user_email: 'lee.coding@email.com',
    submitted_date: '2025-01-20',
    submitted_time: '16:45',
    result: '합격',
    code: `def rotate_array(arr, k):
    n = len(arr)
    k = k % n
    return arr[-k:] + arr[:-k]`,
    language: 'Python'
  },
  {
    submission_id: 3,
    problem_id: 2,
    user_name: '박풀스택',
    user_email: 'park.fullstack@email.com',
    submitted_date: '2025-01-19',
    submitted_time: '10:30',
    result: '합격',
    code: `@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }
}`,
    language: 'Java'
  },
  {
    submission_id: 4,
    problem_id: 3,
    user_name: '최리액트',
    user_email: 'choi.react@email.com',
    submitted_date: '2025-01-18',
    submitted_time: '15:20',
    result: '불합격',
    code: `// 미완성 코드
function App() {
  return (
    <div>
      // TODO: 완성하기
    </div>
  );
}`,
    language: 'JavaScript'
  },
  {
    submission_id: 5,
    problem_id: 4,
    user_name: '정데이터',
    user_email: 'jung.data@email.com',
    submitted_date: '2025-01-17',
    submitted_time: '11:15',
    result: '합격',
    code: `SELECT * FROM users WHERE age > 25;`,
    language: 'SQL'
  }
];

const defaultCompanyChats = [
  {
    chat_id: 1,
    user_name: '김개발',
    user_email: 'kim.dev@email.com',
    last_message: '안녕하세요! 배열 회전 문제에 대해 질문이 있습니다.',
    unread_count: 2
  },
  {
    chat_id: 2,
    user_name: '이코딩',
    user_email: 'lee.coding@email.com',
    last_message: '문제 설명이 좀 더 자세했으면 좋겠어요.',
    unread_count: 0
  },
  {
    chat_id: 3,
    user_name: '박풀스택',
    user_email: 'park.fullstack@email.com',
    last_message: 'API 설계 문제 풀이 완료했습니다!',
    unread_count: 1
  },
  {
    chat_id: 4,
    user_name: '최리액트',
    user_email: 'choi.react@email.com',
    last_message: 'React 최적화 관련해서 추가 자료 있나요?',
    unread_count: 0
  }
];

function MyPageCompany() {
  const [selectedNav, setSelectedNav] = useState('problems');
  const [expandedProblems, setExpandedProblems] = useState({});
  const [codeModalData, setCodeModalData] = useState(null);
  const [isWriteTestOpen, setIsWriteTestOpen] = useState(false);
  
  // 페이징 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 실제 데이터 상태
  const [companyInfo, setCompanyInfo] = useState(null);
  const [companyProblems, setCompanyProblems] = useState([]);
  const [companySubmissions, setCompanySubmissions] = useState([]);
  const [companyChats, setCompanyChats] = useState([]);
  const [companyStats, setCompanyStats] = useState({
    totalProblems: 0,
    totalSubmissions: 0,
  });
  // 테스트 등록 모달 옵션용
  const [testCategoryListState, setTestCategoryListState] = useState([]);
  const [testLevelListState, setTestLevelListState] = useState([]);

  // 백엔드 데이터 상태 추가
  const [testList, setTestList] = useState([]);
  const [testIdTitleList, setTestIdTitleList] = useState([]);
  const [testSubUserList, setTestSubUserList] = useState([]);
  const [testSubList, setTestSubList] = useState([]);

  // 페이징 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProblems = companyProblems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(companyProblems.length / itemsPerPage);

  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 탭 변경 시 페이지 리셋
  const handleNavChange = (navKey) => {
    setSelectedNav(navKey);
    setCurrentPage(1);
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 기업 마이페이지 데이터 가져오기
        const response = await axios.get('http://localhost:8080/FAF/api/company/mypage', {
          withCredentials: true
        });

        const data = response.data;
        console.log('서버에서 받은 기업 데이터:', data);
        
        // 백엔드 응답 구조에 맞게 데이터 처리
        const testListData = data.testList || [];
        const testCategoryList = data.testCategoryList || [];
        const testLevelList = data.testLevelList || [];
        const testIdTitleListData = data.testIdTitleList || [];
        const testSubUserListData = data.testSubUserList || [];
        const testSubListData = data.testSubList || [];
        
        console.log('testList:', testListData);
        console.log('testCategoryList:', testCategoryList);
        console.log('testLevelList:', testLevelList);
        console.log('testIdTitleList:', testIdTitleListData);
        console.log('testSubUserList:', testSubUserListData);
        console.log('testSubList:', testSubListData);
        
        // 테스트 데이터를 프론트엔드 형식으로 변환
        const processedProblems = testListData.map(test => {
          console.log('Processing test:', test);
          
          const category = testCategoryList.find(cat => cat.category_id === test.category_id);
          const level = testLevelList.find(lvl => lvl.level_id === test.level_id);
          
          console.log('Found category:', category);
          console.log('Found level:', level);
          
          return {
            problem_id: test.test_id,
            title: test.title,
            category_name: category?.name || '카테고리 없음',
            difficulty: level?.name || '난이도 없음',
            created_date: test.created_at ? new Date(test.created_at).toLocaleDateString() : '날짜 없음',
            status: '활성'
          };
        });
        
        // 서버에서 데이터가 있으면 사용, 없으면 기본 데이터 사용
        setCompanyInfo({ company_name: data.companyName || '테크이노베이션' });
        setCompanyProblems(processedProblems.length > 0 ? processedProblems : defaultCompanyProblems);
        setCompanySubmissions(defaultCompanySubmissions); // 제출 내역은 아직 백엔드에서 제공하지 않음
        setCompanyChats(defaultCompanyChats); // 채팅 내역은 아직 백엔드에서 제공하지 않음
        
        // 백엔드 데이터 저장
        setTestList(testListData);
        setTestIdTitleList(testIdTitleListData);
        setTestSubUserList(testSubUserListData);
        setTestSubList(testSubListData);
        
        setCompanyStats({
          totalProblems: processedProblems.length || defaultCompanyProblems.length,
          totalSubmissions: defaultCompanySubmissions.length,
        });

        // 테스트 등록 모달 옵션 저장
        setTestCategoryListState(testCategoryList);
        setTestLevelListState(testLevelList);

      } catch (error) {
        console.error('기업 마이페이지 데이터 가져오기 오류:', error);
        // 에러 발생 시 기본 데이터 사용
        setCompanyInfo(defaultCompanyInfo);
        setCompanyProblems(defaultCompanyProblems);
        setCompanySubmissions(defaultCompanySubmissions);
        setCompanyChats(defaultCompanyChats);
        setCompanyStats({
          totalProblems: defaultCompanyProblems.length,
          totalSubmissions: defaultCompanySubmissions.length,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // 드롭다운 토글 함수
  const toggleProblemExpansion = (problemId) => {
    setExpandedProblems(prev => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };

  // 코드 보기 모달 열기 - 특정 제출자의 해당 테스트 5문제 답안을 보여줌
  const handleViewCode = (submission) => {
    setCodeModalData(submission);
  };

  // 코드 모달 닫기
  const handleCloseCodeModal = () => {
    setCodeModalData(null);
  };

  // 채팅 시작 (코드 모달에서 채팅하기 버튼 클릭 시)
  const handleStartChat = (submission) => {
    // 먼저 코드 모달 닫기
    setCodeModalData(null);
    // 채팅 탭으로 이동
    setSelectedNav('chat');
    // 추후 특정 사용자와의 채팅을 바로 열도록 확장 가능
    console.log('채팅 시작:', submission.userName, submission.userEmail);
  };

  // 통계 카드 데이터
  const statList = [
    { label: '등록된 테스트', value: companyStats.totalProblems, icon: <FaPuzzlePiece className="stat-icon" /> },
    { label: '총 제출', value: companyStats.totalSubmissions, icon: <FaCode className="stat-icon" /> },
  ];

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="mypage-container">
        <div className="mypage-main-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
                기업 페이지 정보를 불러오는 중...
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
      <style>{paginationStyles}</style>
      {/* Sidebar Navigation */}
      <nav className="sidebar-nav">
        <h2 className="sidebar-title">
          기업 페이지
        </h2>
        
        <ul className="sidebar-menu">
          {navItems.map(item => (
            <li
              key={item.key}
              className={`company-nav-link px-4 py-3 text-sm font-medium rounded-lg${selectedNav === item.key ? ' active' : ''}`}
              onClick={() => handleNavChange(item.key)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleNavChange(item.key); }}
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
          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mypage-header text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-text" style={{ lineHeight: '1.2' }}>
              {companyInfo?.company_name || companyName} 관리 페이지
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mt-2" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              코딩 테스트를 등록하고 사용자 제출 내역을 확인하며 1대1 채팅으로 소통하세요.
            </p>
          </motion.div>

          {/* 통계 카드 */}
          <section className="company-stats-bar" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {statList.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="stat-card glass-effect rounded-2xl"
                  tabIndex={0}
                  style={{ minWidth: 140, flex: '1 1 180px', maxWidth: 220, padding: '2rem 1rem', textAlign: 'center', marginBottom: '1rem' }}
                >
                  <div className="stat-icon-bg">{stat.icon}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value">{stat.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 메인 콘텐츠 영역 - 탭별 내용 */}
          <section className="company-section" style={{ maxWidth: 1100, margin: '0 auto' }}>
            
            {/* 코딩 테스트 관리 탭 */}
            {selectedNav === 'problems' && (
              <div className="glass-effect rounded-2xl p-8 mb-10 admin-card">
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 className="gradient-text text-2xl md:text-3xl font-bold text-center" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', marginBottom: 0, width: 'max-content' }}>코딩 테스트 관리</h3>
                  <button className="px-5 py-2 text-sm font-medium rounded-lg btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setIsWriteTestOpen(true)}>
                    <FaPlus className="inline mr-2" />
                    테스트 등록
                  </button>
                </div>
                
                <div style={{ overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                  <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent', textAlign: 'center' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        <th style={{textAlign: 'center'}}>테스트명</th>
                        <th style={{textAlign: 'center'}}>카테고리</th>
                        <th style={{textAlign: 'center'}}>난이도</th>
                        <th style={{textAlign: 'center'}}>생성일</th>
                        <th style={{textAlign: 'center'}}>작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProblems.length > 0 ? (
                        currentProblems.map(problem => (
                          <tr key={problem.problem_id}>
                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{problem.title || '제목 없음'}</td>
                            <td>{problem.category_name || '카테고리 없음'}</td>
                            <td>
                              <span className={`px-2 py-1 rounded text-xs ${
                                problem.difficulty === '초급' ? 'bg-green-500/20 text-green-400' :
                                problem.difficulty === '중급' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {problem.difficulty || '난이도 없음'}
                              </span>
                            </td>
                            <td>{problem.created_date || '날짜 없음'}</td>
                            <td>
                              <button
                                className="px-3 py-1 rounded text-xs btn-primary"
                                onClick={async () => {
                                  if (!window.confirm('이 테스트를 삭제하시겠습니까?')) return;
                                  try {
                                    await axios.post('http://localhost:8080/FAF/api/test/delete', { test_id: problem.problem_id }, { withCredentials: true });
                                    // UI 갱신
                                    setCompanyProblems(prev => prev.filter(p => p.problem_id !== problem.problem_id));
                                    setTestList(prev => Array.isArray(prev) ? prev.filter(t => t.test_id !== problem.problem_id) : prev);
                                  } catch (e) {
                                    console.error('테스트 삭제 오류:', e);
                                    alert('삭제 중 오류가 발생했습니다.');
                                  }
                                }}
                              >
                                삭제
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                            등록된 테스트가 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <nav>
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            )}

            {/* 제출 내역 탭 */}
            {selectedNav === 'submissions' && (
              <div className="glass-effect rounded-2xl p-8 mb-10 admin-card">
                <h3 className="gradient-text text-2xl md:text-3xl font-bold mb-6 text-center">제출 내역</h3>
                
                <div className="space-y-4">
                  {currentProblems.length > 0 ? (
                    currentProblems.map(problem => (
                      <div key={problem.problem_id} className="border border-gray-600 rounded-lg">
                        {/* 테스트 헤더 (클릭 가능) */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-white/5 transition-colors flex justify-between items-center"
                          onClick={() => toggleProblemExpansion(problem.problem_id)}
                        >
                          <div className="flex items-center w-full">
                            <div className="flex-1 min-w-0 pr-4">
                              <span className="text-lg font-bold block truncate" style={{ color: 'var(--text-primary)' }}>
                                {problem.title || '제목 없음'}
                              </span>
                            </div>
                            <div className="w-32 text-center">
                              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {problem.category_name || '카테고리 없음'}
                              </span>
                            </div>
                            <div className="w-20 text-center">
                              <span className={`px-2 py-1 rounded text-xs ${
                                problem.difficulty === '초급' ? 'bg-green-500/20 text-green-400' :
                                problem.difficulty === '중급' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {problem.difficulty || '난이도 없음'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <span className="text-sm w-20 text-right" style={{ color: 'var(--text-secondary)' }}>
                              {problem.created_date || '날짜 없음'}
                            </span>
                            <span className={`transform transition-transform ${expandedProblems[problem.problem_id] ? 'rotate-180' : ''}`}>
                              ▼
                            </span>
                          </div>
                        </div>

                        {/* 제출 내역 (드롭다운) */}
                        {expandedProblems[problem.problem_id] && (
                          <div className="border-t border-gray-600 bg-gray-700/30">
                            <div style={{ overflowX: 'auto', padding: '1rem' }}>
                              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent', textAlign: 'center' }}>
                                <thead>
                                  <tr style={{ background: 'var(--bg-secondary)' }}>
                                    <th style={{textAlign: 'center'}}>제출자</th>
                                    <th style={{textAlign: 'center'}}>제출일시</th>
                                    <th style={{textAlign: 'center'}}>결과</th>
                                    <th style={{textAlign: 'center'}}>코드 보기</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(() => {
                                    console.log('Debug - problem.problem_id:', problem.problem_id);
                                    console.log('Debug - testList:', testList);
                                    console.log('Debug - testSubList:', testSubList);
                                    
                                    // 해당 problem_id에 맞는 test_id 찾기
                                    const matchingTest = testList.find(test => test.test_id === problem.problem_id);
                                    console.log('Debug - matchingTest:', matchingTest);
                                    
                                    if (!matchingTest) {
                                      console.log('Debug - No matching test found');
                                      return null;
                                    }
                                    
                                    // 해당 test_id의 제출내역 필터링
                                    const testSubmissions = testSubList.filter(sub => sub.test_id === matchingTest.test_id);
                                    console.log('Debug - testSubmissions:', testSubmissions);
                                    
                                    return testSubmissions.map(submission => {
                                      const userInfo = testSubUserList.find(user => user.user_id === submission.user_id);
                                      
                                      console.log('Debug - submission.created_at:', submission.created_at);
                                      console.log('Debug - submission:', submission);
                                      
                                      return (
                                        <tr key={submission.test_sub_id}>
                                          <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                            {userInfo?.nickname || '사용자'}
                                            {userInfo?.email ? (
                                              <div style={{ fontWeight: 'normal', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                {userInfo.email}
                                              </div>
                                            ) : null}
                                          </td>
                                          <td>
                                            {submission.created_at ? new Date(submission.created_at).toLocaleDateString() : '날짜 없음'} {' '}
                                            {submission.created_at ? new Date(submission.created_at).toLocaleTimeString() : '시간 없음'}
                                          </td>
                                          <td>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                              submission.pass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                            }`}>
                                              {submission.pass ? '합격' : '불합격'}
                                            </span>
                                          </td>
                                          <td>
                                            <button 
                                              className="btn-primary" 
                                              style={{ padding: '0.3rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}
                                              onClick={() => handleViewCode({
                                                user_id: submission.user_id,
                                                test_id: submission.test_id,
                                                test_sub_id: submission.test_sub_id,
                                                user_name: userInfo?.nickname || '사용자',
                                                user_email: userInfo?.email || '이메일 없음',
                                                submitted_date: submission.created_at ? new Date(submission.created_at).toLocaleDateString() : '날짜 없음',
                                                submitted_time: submission.created_at ? new Date(submission.created_at).toLocaleTimeString() : '시간 없음',
                                                result: submission.pass ? '합격' : '불합격',
                                                correct_count: submission.correct_count,
                                                wrong_count: submission.wrong_count,
                                                test_title: matchingTest.title,
                                                code: `// ${matchingTest.title} 답안\n// 정답: ${submission.correct_count}개, 오답: ${submission.wrong_count}개\n// 합격 여부: ${submission.pass ? '합격' : '불합격'}\n\n// 실제 코드는 백엔드에서 제공해야 합니다.`,
                                                language: 'Java'
                                              })}
                                            >
                                              <FaCode className="inline mr-1" />
                                              코드 보기
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    });
                                  })()}
                                </tbody>
                              </table>
                            </div>
                            {(() => {
                              console.log('Debug - Empty message check - problem.problem_id:', problem.problem_id);
                              const matchingTest = testList.find(test => test.test_id === problem.problem_id);
                              console.log('Debug - Empty message check - matchingTest:', matchingTest);
                              if (!matchingTest) return null;
                              const testSubmissions = testSubList.filter(sub => sub.test_id === matchingTest.test_id);
                              console.log('Debug - Empty message check - testSubmissions:', testSubmissions);
                              return testSubmissions.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                  아직 제출된 답안이 없습니다.
                                </div>
                              ) : null;
                            })()}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                      <p>등록된 테스트가 없습니다.</p>
                    </div>
                  )}
                </div>
                
                {/* 제출 내역 페이징 */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <nav>
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            )}

            {/* 채팅 관리 탭 */}
            {selectedNav === 'chat' && (
              <div className="glass-effect rounded-2xl p-8 mb-10 admin-card">
                <h3 className="gradient-text text-2xl md:text-3xl font-bold mb-6 text-center">1대1 채팅 관리</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                  {/* 채팅 목록 */}
                  <div className="lg:col-span-1">
                    <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>채팅 목록</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {companyChats.length > 0 ? (
                        companyChats.map(chat => (
                          <div key={chat.chat_id} className="p-4 border border-gray-600 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                  {(chat.user_name || 'U').charAt(0)}
                                </div>
                                <div>
                                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                    {chat.user_name || '사용자'}
                                  </div>
                                </div>
                              </div>
                              {chat.unread_count > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                                  {chat.unread_count}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 mb-1">{chat.user_email || '이메일 없음'}</div>
                            <div className="text-sm text-gray-300 truncate">{chat.last_message || '메시지 없음'}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                          <p>채팅 내역이 없습니다.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 채팅 창 */}
                  <div className="lg:col-span-2">
                    <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>채팅</h4>
                    <div className="border border-gray-600 rounded-lg h-96 flex flex-col">
                      {/* 채팅 헤더 */}
                      <div className="p-4 border-b border-gray-600 bg-gray-700/30">
                        <div className="text-center text-gray-400">
                          채팅할 사용자를 선택하세요
                        </div>
                      </div>
                      
                      {/* 채팅 메시지 영역 */}
                      <div className="flex-1 p-4 overflow-y-auto">
                        <div className="text-center text-gray-500 mt-16">
                          메시지가 여기에 표시됩니다
                        </div>
                      </div>
                      
                      {/* 메시지 입력 */}
                      <div className="p-4 border-t border-gray-600">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="메시지를 입력하세요..."
                            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:outline-none"
                            disabled
                          />
                          <button className="btn-primary px-6 py-2 rounded-lg" disabled>
                            전송
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 코드 보기 모달 - 제출자별 해당 테스트의 5문제 답안 표시 */}
      <CodeViewModal
        isOpen={!!codeModalData}
        onClose={handleCloseCodeModal}
        submission={codeModalData}
        onStartChat={handleStartChat}
      />

      {/* 테스트 등록 모달 */}
      <WriteTest
        isOpen={isWriteTestOpen}
        onClose={() => setIsWriteTestOpen(false)}
        categoryOptions={testCategoryListState}
        levelOptions={testLevelListState}
        onSuccess={() => setIsWriteTestOpen(false)}
      />
    </div>
  );
}

export default MyPageCompany;
