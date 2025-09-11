import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaFileAlt, 
  FaClipboardCheck, 
  FaPuzzlePiece, 
  FaShoppingCart, 
  FaCog,
  FaTrash,
  FaSpinner
} from 'react-icons/fa';
import '../styles/style.css';
import axios from 'axios';

const navItems = [
  { key: 'users', label: '회원 관리', icon: FaUsers },
  { key: 'posts', label: '게시글 관리', icon: FaFileAlt },
  { key: 'tests', label: '시험 관리', icon: FaClipboardCheck },
  { key: 'problems', label: '문제 관리', icon: FaPuzzlePiece },
  { key: 'products', label: '상품 관리', icon: FaShoppingCart },
  { key: 'settings', label: '설정', icon: FaCog },
];



// 회원 데이터는 이제 API로 조회됩니다
const dummyTests = [
  { id: 1, title: '프론트엔드 중간고사', level: '중급' },
 
];
const dummyProblems = [
  { id: 1, title: '2의 배수 찾기', category: '수학', level: '초급' },

];
const dummyProducts = [
  { id: 1, name: '프리미엄 이용권', price: 9900, stock: 100 },
 
];

// 더미 통계 데이터 (추후 DB 연동 시 실제 데이터로 교체)
const dummyStats = {
  totalTests: 0,
  totalProducts: 0
};

// 관리자 설정 더미 데이터
const dummyAdminSettings = {
  boardSettings: {
    postPermission: "회원",
    commentEnabled: true
  },
  notices: {
    testSchedule: { 
      content: "2025년 1월 정기 코딩테스트가 진행됩니다.", 
      date: "2025-01-25" 
    },
    maintenanceSchedule: { 
      content: "시스템 점검으로 인한 일시 서비스 중단 안내", 
      date: "2025-01-30" 
    }
  }
};

function MyPageAdmin() {
  const navigate = useNavigate();
  
  // 네비게이션 상태
  const [selectedNav, setSelectedNav] = useState('users');
  
  // 회원 관리 상태
  const [users, setUsers] = useState([]);
  const [userGrades, setUserGrades] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  
  // 🎯 통계 데이터 상태
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    tests: 0,
    problems: 0,
    products: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  
  // 🎯 회원 정렬 상태 추가
  const [userSortField, setUserSortField] = useState('user_id'); // 회원 정렬 필드
  const [userSortDirection, setUserSortDirection] = useState('desc'); // 회원 정렬 방향
  
  // 🎯 문제 관리 상태 추가
  const [problems, setProblems] = useState([]);
  const [problemLevels, setProblemLevels] = useState([]);
  
  // 🎯 시험 삭제 상태 추가
  const [deletingTest, setDeletingTest] = useState(false);
  
  // 🎯 상품 삭제 상태 추가
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [problemCategories, setProblemCategories] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(false);
  const [deletingProblem, setDeletingProblem] = useState(false);
  const [problemsError, setProblemsError] = useState(null);
  
  // 🎯 상품 관리 상태 추가
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  
  // 🎯 시험 관리 상태 추가
  const [tests, setTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const [testsError, setTestsError] = useState(null);
  const [testsUsers, setTestsUsers] = useState([]); // 시험용 사용자 목록 별도 관리
  
  // 🎯 게시글 관리 상태 추가
  const [posts, setPosts] = useState([]);
  const [postCategories, setPostCategories] = useState([]);
  const [postsUsers, setPostsUsers] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);
  const [deletingPost, setDeletingPost] = useState(false);
  
  // 🎯 정렬 상태 추가
  const [sortField, setSortField] = useState('challenge_id'); // 정렬 필드
  const [sortDirection, setSortDirection] = useState('desc'); // 정렬 방향 (asc/desc)
  
  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [currentProblemsPage, setCurrentProblemsPage] = useState(1);
  const [currentProductsPage, setCurrentProductsPage] = useState(1);
  const [currentTestsPage, setCurrentTestsPage] = useState(1);
  const [currentPostsPage, setCurrentPostsPage] = useState(1);
  const itemsPerPage = 10;

  // 회원 목록 조회 함수
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      
      const response = await axios.get('http://localhost:8080/FAF/api/admin/users', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;

      if (data.success) {
        setUsers(data.data);
        setUserGrades(data.userGrades);
      } else {
        throw new Error('회원 목록 조회 실패');
      }
    } catch (error) {
      console.error('회원 목록 조회 오류:', error);
      setUsersError(error.message);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // 🎯 문제 목록 조회 함수 추가
  const fetchProblems = async () => {
    try {
      setProblemsLoading(true);
      setProblemsError(null);
      
      const response = await axios.get('http://localhost:8080/FAF/api/admin/problems', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;
      console.log('🔍 API 응답 데이터:', data);

      if (data.success) {
        setProblems(data.problems);
        setProblemLevels(data.levels);
        setProblemCategories(data.categories);
        console.log('✅ 문제 목록 조회 성공:', data.problems.length + '개');
        console.log('🔍 난이도 데이터:', data.levels);
        console.log('🔍 카테고리 데이터:', data.categories);
      } else {
        console.error('❌ API 응답 실패:', data.message);
        throw new Error(data.message || '문제 목록 조회 실패');
      }
    } catch (error) {
      console.error('❌ 문제 목록 조회 오류:', error);
      setProblemsError(error.message);
      setProblems([]);
    } finally {
      setProblemsLoading(false);
    }
  };

  // 🎯 상품 목록 조회 함수 추가
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      
      const response = await axios.get('http://localhost:8080/FAF/api/admin/products', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;
      console.log('🔍 API 응답 데이터:', data);

      if (data.success) {
        setProducts(data.products);
        console.log('✅ 상품 목록 조회 성공:', data.products.length + '개');
      } else {
        console.error('❌ API 응답 실패:', data.message);
        throw new Error(data.message || '상품 목록 조회 실패');
      }
    } catch (error) {
      console.error('❌ 상품 목록 조회 오류:', error);
      setProductsError(error.message);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // 🎯 시험 목록 조회 함수 추가
  const fetchTests = async () => {
    try {
      setTestsLoading(true);
      setTestsError(null);
      
      const response = await axios.get('http://localhost:8080/FAF/api/admin/tests', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;
      console.log('🔍 시험 API 응답 데이터:', data);

      if (data.success) {
        setTests(data.tests);
        setTestsUsers(data.users || []); // 시험용 사용자 목록 저장
        console.log('✅ 시험 목록 조회 성공:', data.tests.length + '개');
        console.log('✅ 사용자 목록 조회 성공:', data.users ? data.users.length + '명' : '0명');
        console.log('🔍 받아온 사용자 데이터:', data.users);
      } else {
        console.error('❌ 시험 API 응답 실패:', data.message);
        throw new Error(data.message || '시험 목록 조회 실패');
      }
    } catch (error) {
      console.error('❌ 시험 목록 조회 오류:', error);
      setTestsError(error.message);
      setTests([]);
    } finally {
      setTestsLoading(false);
    }
  };

  // 🎯 게시글 목록 조회 함수 추가
  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      setPostsError(null);
      
      const response = await axios.get('http://localhost:8080/FAF/api/admin/posts', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;
      console.log('🔍 게시글 API 응답 데이터:', data);

      if (data.success) {
        setPosts(data.posts);
        setPostCategories(data.categories);
        setPostsUsers(data.users || []); // 게시글용 사용자 목록 저장
        console.log('✅ 게시글 목록 조회 성공:', data.posts.length + '개');
        console.log('🔍 카테고리 데이터:', data.categories);
        console.log('🔍 게시글 작성자 데이터:', data.users);
      } else {
        console.error('❌ 게시글 API 응답 실패:', data.message);
        throw new Error(data.message || '게시글 목록 조회 실패');
      }
    } catch (error) {
      console.error('❌ 게시글 목록 조회 오류:', error);
      setPostsError(error.message);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };


  // 🎯 문제 삭제 함수 추가
  const deleteProblem = async (problemId, problemTitle) => {
    try {
      // 삭제 확인
      const confirmed = window.confirm(`"${problemTitle}" 문제를 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`);
      
      if (!confirmed) {
        return;
      }
      
      setDeletingProblem(true);
      console.log('🗑️ 문제 삭제 시작:', problemId);
      
      const response = await axios.delete(`http://localhost:8080/FAF/api/challenge/${problemId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;
      console.log('🔍 삭제 API 응답:', data);
      
      if (data.success) {
        alert(data.message || '문제가 성공적으로 삭제되었습니다.');
        
        // 문제 목록 새로고침
        await fetchProblems();
        // 통계 데이터 새로고침
        await fetchStats();
        
        console.log('✅ 문제 삭제 성공:', problemTitle);
      } else {
        alert(data.message || '문제 삭제에 실패했습니다.');
        console.error('❌ 문제 삭제 실패:', data.message);
      }
    } catch (error) {
      console.error('❌ 문제 삭제 오류:', error);
      alert('문제 삭제 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setDeletingProblem(false);
    }
  };

  // 🎯 상품 삭제 함수 추가
  const deleteProduct = async (productId, productTitle) => {
    try {
      // 삭제 확인
      const confirmed = window.confirm(`"${productTitle}" 상품을 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`);
      
      if (!confirmed) {
        return;
      }
      
      setDeletingProduct(true);
      console.log('🗑️ 상품 삭제 시작:', productId);
      
      const response = await axios.post('http://localhost:8080/FAF/api/product/delete', 
        { product_id: productId },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = response.data;
      console.log('🔍 삭제 API 응답:', data);
      
      if (data.success) {
        alert(data.message || '상품이 성공적으로 삭제되었습니다.');
        
        // 상품 목록 새로고침
        await fetchProducts();
        // 통계 데이터 새로고침
        await fetchStats();
        
        console.log('✅ 상품 삭제 성공:', productTitle);
      } else {
        alert(data.message || '상품 삭제에 실패했습니다.');
        console.error('❌ 상품 삭제 실패:', data.message);
      }
    } catch (error) {
      console.error('❌ 상품 삭제 오류:', error);
      alert('상품 삭제 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setDeletingProduct(false);
    }
  };

  // 🎯 게시글 삭제 함수 추가
  const deletePost = async (postId, postTitle) => {
    try {
      // 삭제 확인
      const confirmed = window.confirm(`"${postTitle}" 게시글을 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`);
      
      if (!confirmed) {
        return;
      }
      
      setDeletingPost(true);
      console.log('🗑️ 게시글 삭제 시작:', postId);
      
      // 실제 API 호출
      const response = await axios.delete(`http://localhost:8080/FAF/api/admin/posts/${postId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;
      console.log('🔍 게시글 삭제 API 응답:', data);

      if (data.success) {
        alert('게시글이 성공적으로 삭제되었습니다.');
        // 게시글 목록 새로고침
        await fetchPosts();
        // 통계 데이터 새로고침
        await fetchStats();
      } else {
        alert('게시글 삭제 실패: ' + data.message);
      }
      
    } catch (error) {
      console.error('❌ 게시글 삭제 오류:', error);
      alert('게시글 삭제 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setDeletingPost(false);
    }
  };

  // 🎯 시험 삭제 함수 추가
  const deleteTest = async (testId, testTitle) => {
    try {
      // 삭제 확인
      const confirmed = window.confirm(`"${testTitle}" 시험을 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`);
      
      if (!confirmed) {
        return;
      }
      
      setDeletingTest(true);
      console.log('🗑️ 시험 삭제 시작:', testId);
      
      // 실제 API 호출
      const response = await axios.delete(`http://localhost:8080/FAF/api/admin/tests/${testId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;
      console.log('🔍 시험 삭제 API 응답:', data);

      if (data.success) {
        alert('시험이 성공적으로 삭제되었습니다.');
        // 시험 목록 새로고침
        await fetchTests();
        // 통계 데이터 새로고침
        await fetchStats();
      } else {
        alert('시험 삭제 실패: ' + data.message);
      }
      
    } catch (error) {
      console.error('❌ 시험 삭제 오류:', error);
      alert('시험 삭제 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setDeletingTest(false);
    }
  };

  // 🎯 정렬된 회원 데이터 계산
  const sortedUsers = [...users].sort((a, b) => {
    let aValue, bValue;
    
    switch (userSortField) {
      case 'grade':
        aValue = userGrades.find(grade => grade.grade_id === a.grade_id)?.grade_name || '';
        bValue = userGrades.find(grade => grade.grade_id === b.grade_id)?.grade_name || '';
        break;
      default:
        aValue = a.user_id;
        bValue = b.user_id;
    }
    
    if (userSortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // 페이징 계산
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = sortedUsers.slice(startIndex, endIndex);

  // 🎯 정렬된 문제 데이터 계산
  const sortedProblems = [...problems].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'challenge_title':
        aValue = a.challenge_title;
        bValue = b.challenge_title;
        break;
      case 'category':
        aValue = problemCategories.find(cat => cat.category_id === a.category_id)?.category_name || '';
        bValue = problemCategories.find(cat => cat.category_id === b.category_id)?.category_name || '';
        break;
      case 'language':
        aValue = a.language || '';
        bValue = b.language || '';
        break;
      case 'level':
        aValue = problemLevels.find(level => level.level_id === a.level_id)?.level_name || '';
        bValue = problemLevels.find(level => level.level_id === b.level_id)?.level_name || '';
        break;
      default:
        aValue = a.challenge_id;
        bValue = b.challenge_id;
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // 🎯 문제 페이징 계산
  const totalProblemsPages = Math.ceil(sortedProblems.length / itemsPerPage);
  const problemsStartIndex = (currentProblemsPage - 1) * itemsPerPage;
  const problemsEndIndex = problemsStartIndex + itemsPerPage;
  const currentProblems = sortedProblems.slice(problemsStartIndex, problemsEndIndex);

  // 🎯 상품 페이징 계산
  const totalProductsPages = Math.ceil(products.length / itemsPerPage);
  const productsStartIndex = (currentProductsPage - 1) * itemsPerPage;
  const productsEndIndex = productsStartIndex + itemsPerPage;
  const currentProductsList = products.slice(productsStartIndex, productsEndIndex);

  // 🎯 시험 페이징 계산
  const totalTestsPages = Math.ceil(tests.length / itemsPerPage);
  const testsStartIndex = (currentTestsPage - 1) * itemsPerPage;
  const testsEndIndex = testsStartIndex + itemsPerPage;
  const currentTestsList = tests.slice(testsStartIndex, testsEndIndex);

  // 🎯 게시글 페이징 계산
  const totalPostsPages = Math.ceil(posts.length / itemsPerPage);
  const postsStartIndex = (currentPostsPage - 1) * itemsPerPage;
  const postsEndIndex = postsStartIndex + itemsPerPage;
  const currentPosts = posts.slice(postsStartIndex, postsEndIndex);

  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 이전 페이지
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 🎯 문제 페이징 핸들러 함수들
  const handleProblemsPageChange = (pageNumber) => {
    setCurrentProblemsPage(pageNumber);
  };

  const handleProblemsPreviousPage = () => {
    if (currentProblemsPage > 1) {
      setCurrentProblemsPage(currentProblemsPage - 1);
    }
  };

  const handleProblemsNextPage = () => {
    if (currentProblemsPage < totalProblemsPages) {
      setCurrentProblemsPage(currentProblemsPage + 1);
    }
  };

  // 🎯 상품 페이징 핸들러 함수들
  const handleProductsPageChange = (pageNumber) => {
    setCurrentProductsPage(pageNumber);
  };

  const handleProductsPreviousPage = () => {
    if (currentProductsPage > 1) {
      setCurrentProductsPage(currentProductsPage - 1);
    }
  };

  const handleProductsNextPage = () => {
    if (currentProductsPage < totalProductsPages) {
      setCurrentProductsPage(currentProductsPage + 1);
    }
  };

  // 🎯 시험 페이징 핸들러 함수들
  const handleTestsPageChange = (pageNumber) => {
    setCurrentTestsPage(pageNumber);
  };

  const handleTestsPreviousPage = () => {
    if (currentTestsPage > 1) {
      setCurrentTestsPage(currentTestsPage - 1);
    }
  };

  const handleTestsNextPage = () => {
    if (currentTestsPage < totalTestsPages) {
      setCurrentTestsPage(currentTestsPage + 1);
    }
  };

  // 🎯 게시글 페이징 핸들러 함수들
  const handlePostsPageChange = (pageNumber) => {
    setCurrentPostsPage(pageNumber);
  };

  const handlePostsPreviousPage = () => {
    if (currentPostsPage > 1) {
      setCurrentPostsPage(currentPostsPage - 1);
    }
  };

  const handlePostsNextPage = () => {
    if (currentPostsPage < totalPostsPages) {
      setCurrentPostsPage(currentPostsPage + 1);
    }
  };

  // 🎯 정렬 핸들러 함수
  const handleSort = (field) => {
    if (sortField === field) {
      // 같은 필드를 클릭하면 정렬 방향 변경
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 다른 필드를 클릭하면 해당 필드로 정렬하고 오름차순으로 시작
      setSortField(field);
      setSortDirection('asc');
    }
    // 정렬 변경 시 첫 페이지로 이동
    setCurrentProblemsPage(1);
  };

  // 🎯 회원 정렬 핸들러 함수
  const handleUserSort = (field) => {
    if (userSortField === field) {
      // 같은 필드를 클릭하면 정렬 방향 변경
      setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 다른 필드를 클릭하면 해당 필드로 정렬하고 오름차순으로 시작
      setUserSortField(field);
      setUserSortDirection('asc');
    }
    // 정렬 변경 시 첫 페이지로 이동
    setCurrentPage(1);
  };

  // 🎯 통계 데이터 조회 함수
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      
      console.log('🔄 통계 데이터 요청 시작...');
      
      const response = await axios.get('http://localhost:8080/FAF/api/admin/stats', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;
      console.log('📊 백엔드 응답:', data);

      if (data.success) {
        const statsData = data.stats || {};
        setStats({
          users: statsData.totalUsers || 0,
          posts: statsData.totalPosts || 0,
          tests: statsData.totalTests || dummyStats.totalTests,
          problems: statsData.totalProblems || 0,
          products: statsData.totalProducts || dummyStats.totalProducts,
        });
        console.log('✅ 통계 데이터 로딩 성공:', statsData);
      } else {
        console.error('❌ API 응답 실패:', data.message);
        throw new Error(data.message || '통계 데이터 로딩 실패');
      }
    } catch (error) {
      console.error('❌ 통계 데이터 로딩 오류:', error);
      console.error('❌ 에러 상세:', error.response?.data || error.message);
      
      // 임시로 더미 데이터 사용 (백엔드 문제 시)
      setStats({
        users: 1234,
        posts: 0, // 더미 데이터 사용
        tests: dummyStats.totalTests,
        problems: 321,
        products: dummyStats.totalProducts,
      });
      setStatsError('백엔드 연결 실패 - 임시 데이터 표시');
    } finally {
      setStatsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 회원 목록 및 통계 데이터 조회
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // 🎯 네비게이션 변경 시 문제 목록 조회
  useEffect(() => {
    if (selectedNav === 'problems') {
      fetchProblems();
    }
  }, [selectedNav]);

  // 🎯 네비게이션 변경 시 상품 목록 조회
  useEffect(() => {
    if (selectedNav === 'products') {
      fetchProducts();
    }
  }, [selectedNav]);

  // 🎯 네비게이션 변경 시 시험 목록 조회
  useEffect(() => {
    if (selectedNav === 'tests') {
      fetchTests();
    }
  }, [selectedNav]);

  // 🎯 네비게이션 변경 시 게시글 목록 조회
  useEffect(() => {
    if (selectedNav === 'posts') {
      fetchPosts();
    }
  }, [selectedNav]);


  // 통계 카드 데이터 + 아이콘 (실제 데이터 사용)
  const statList = [
    { label: '전체 회원수', value: stats.users, icon: <FaUsers className="stat-icon" /> },
    { label: '전체 게시글수', value: stats.posts, icon: <FaFileAlt className="stat-icon" /> },
    { label: '전체 시험수', value: stats.tests, icon: <FaClipboardCheck className="stat-icon" /> },
    { label: '전체 문제수', value: stats.problems, icon: <FaPuzzlePiece className="stat-icon" /> },
    { label: '전체 상품수', value: stats.products, icon: <FaShoppingCart className="stat-icon" /> },
  ];

  return (
    <div className="mypage-container">
      {/* Sidebar Navigation */}
      <nav className="sidebar-nav">
        <h2 className="sidebar-title">
          관리자 페이지
        </h2>
        
        <ul className="sidebar-menu">
          {navItems.map(item => (
            <li
              key={item.key}
              className={`admin-nav-link px-4 py-3 text-sm font-medium rounded-lg${selectedNav === item.key ? ' active' : ''}`}
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
          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mypage-header text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-text" style={{ lineHeight: '1.2' }}>
              관리자 페이지
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mt-2" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              전체 통계와 회원, 게시글, 시험, 문제를 한눈에 관리하세요.
            </p>
          </motion.div>

          {/* 통계 카드 */}
          <section className="admin-stats-bar" style={{ marginBottom: '2.5rem' }}>
            {statsLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>통계 데이터를 불러오는 중...</p>
              </div>
            ) : statsError ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: '#ff6b6b' }}>통계 데이터 로드 실패: {statsError}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'nowrap' }}>
                {statList.map((stat, idx) => (
                  <div
                    key={stat.label}
                    className="stat-card glass-effect rounded-2xl"
                    tabIndex={0}
                    style={{ flex: '1', padding: '1.5rem 0.75rem', textAlign: 'center', minWidth: 'auto' }}
                  >
                    <div className="stat-icon-bg">{stat.icon}</div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value">{stat.value}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 관리 섹션 */}
          <section className="admin-section" style={{ maxWidth: 1100, margin: '0 auto' }}>
            {selectedNav === 'users' && (
              <div className="glass-effect rounded-2xl p-8 mb-10 admin-card" style={{ textAlign: 'center' }}>
                <h3 className="gradient-text text-2xl md:text-3xl font-bold mb-6 text-center">회원 관리</h3>
                
                {/* 페이지 정보 */}
                {!usersLoading && !usersError && users.length > 0 && (
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    전체 {users.length}명 | {currentPage}/{totalPages} 페이지 | 현재 페이지: {Math.min(startIndex + 1, users.length)}~{Math.min(endIndex, users.length)}번째
                  </p>
                )}
                
                {usersLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>회원 목록을 불러오는 중...</p>
                  </div>
                ) : usersError ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: '#ff6b6b' }}>회원 목록 로드 실패: {usersError}</p>
                  </div>
                ) : users.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>등록된 회원이 없습니다.</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent', textAlign: 'center' }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-secondary)', paddingLeft: '30px' }}>
                            <th style={{textAlign: 'center'}}>이름/닉네임</th>
                            <th 
                              style={{
                                textAlign: 'center', 
                                cursor: 'pointer',
                                userSelect: 'none'
                              }}
                              onClick={() => handleUserSort('grade')}
                              title="클릭하여 정렬"
                            >
                              등급 {userSortField === 'grade' && (userSortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th style={{textAlign: 'center'}}>시도</th>
                            <th style={{textAlign: 'center'}}>해결</th>
                            <th style={{textAlign: 'center'}}>정답률(%)</th>
                            <th style={{textAlign: 'center'}}>가입일</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers.map((user, index) => (
                            <tr key={`user-${user.user_id}-${index}`}>
                              <td>{user.nickname}</td>
                              <td>{userGrades.find(grade => grade.grade_id === user.grade_id)?.grade_name}</td>
                              <td>{user.attempts}</td>
                              <td>{user.solved}</td>
                              <td>{user.accuracy}%</td>
                              <td>{user.created_at}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* 페이징 UI */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      marginTop: '2rem',
                      gap: '0.5rem'
                    }}>
                      {/* 이전 페이지 버튼 */}
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="btn-primary"
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          opacity: currentPage === 1 ? 0.5 : 1,
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        이전
                      </button>

                      {/* 페이지 번호들 */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={currentPage === pageNumber ? 'btn-primary' : 'btn-secondary'}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            minWidth: '2.5rem',
                            backgroundColor: currentPage === pageNumber 
                              ? 'var(--accent-primary)' 
                              : 'var(--glass-bg)',
                            color: currentPage === pageNumber 
                              ? 'white' 
                              : 'var(--text-primary)',
                            border: '1px solid var(--glass-border)'
                          }}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      {/* 다음 페이지 버튼 */}
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="btn-primary"
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          opacity: currentPage === totalPages ? 0.5 : 1,
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                        }}
                      >
                        다음
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedNav === 'posts' && (
              <div className="glass-effect rounded-2xl p-8 mb-10 admin-card" style={{ textAlign: 'center' }}>
                <h3 className="gradient-text text-2xl md:text-3xl font-bold mb-6 text-center">게시글 관리</h3>
                
                {postsLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>게시글 목록을 불러오는 중...</p>
                  </div>
                ) : postsError ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: '#ff6b6b' }}>게시글 목록 로드 실패: {postsError}</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>등록된 게시글이 없습니다.</p>
                  </div>
                ) : (
                  <div>
                    {/* 페이지 정보 */}
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center' }}>
                      전체 {posts.length}개 | {currentPostsPage}/{totalPostsPages} 페이지 | 현재 페이지: {Math.min(postsStartIndex + 1, posts.length)}~{Math.min(postsEndIndex, posts.length)}번째
                    </p>
                    
                    <div style={{ overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent', textAlign: 'center' }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-secondary)', paddingLeft: '30px' }}>
                            <th style={{textAlign: 'center'}}>제목</th>
                            <th style={{textAlign: 'center'}}>카테고리</th>
                            <th style={{textAlign: 'center'}}>작성자</th>
                            <th style={{textAlign: 'center'}}>작업</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentPosts.map(post => (
                            <tr key={post.post_id}>
                              <td>{post.title}</td>
                              <td>{postCategories.find(cat => cat.category_id === post.category_id)?.name || '미분류'}</td>
                              <td>{postsUsers.find(user => user.user_id === post.user_id)?.nickname || `사용자 ${post.user_id}`}</td>
                              <td>
                                <button 
                                  onClick={() => deletePost(post.post_id, post.title)}
                                  disabled={deletingPost}
                                  className="btn-primary" 
                                  style={{ 
                                    padding: '0.3rem 1rem', 
                                    borderRadius: '0.5rem',
                                    opacity: deletingPost ? 0.5 : 1,
                                    cursor: deletingPost ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  {deletingPost ? (
                                    <>
                                      <FaSpinner className="animate-spin inline mr-1" />
                                      삭제 중...
                                    </>
                                  ) : (
                                    <>
                                      <FaTrash className="inline mr-1" />
                                      삭제
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* 🎯 게시글 페이징 UI */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      marginTop: '2rem',
                      gap: '0.5rem'
                    }}>
                      {/* 이전 페이지 버튼 */}
                      <button
                        onClick={handlePostsPreviousPage}
                        disabled={currentPostsPage === 1}
                        className="btn-primary"
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          opacity: currentPostsPage === 1 ? 0.5 : 1,
                          cursor: currentPostsPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        이전
                      </button>

                      {/* 페이지 번호들 */}
                      {Array.from({ length: totalPostsPages }, (_, i) => i + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => handlePostsPageChange(pageNumber)}
                          className={currentPostsPage === pageNumber ? 'btn-primary' : 'btn-secondary'}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            minWidth: '2.5rem',
                            backgroundColor: currentPostsPage === pageNumber 
                              ? 'var(--accent-primary)' 
                              : 'var(--glass-bg)',
                            color: currentPostsPage === pageNumber 
                              ? 'white' 
                              : 'var(--text-primary)',
                            border: '1px solid var(--glass-border)'
                          }}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      {/* 다음 페이지 버튼 */}
                      <button
                        onClick={handlePostsNextPage}
                        disabled={currentPostsPage === totalPostsPages}
                        className="btn-primary"
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          opacity: currentPostsPage === totalPostsPages ? 0.5 : 1,
                          cursor: currentPostsPage === totalPostsPages ? 'not-allowed' : 'pointer'
                        }}
                      >
                        다음
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedNav === 'tests' && (
              <div className="glass-effect rounded-2xl p-8 mb-10 admin-card" style={{ textAlign: 'center' }}>
                <h3 className="gradient-text text-2xl md:text-3xl font-bold mb-6 text-center">시험 관리</h3>
                
                {testsLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>시험 목록을 불러오는 중...</p>
                  </div>
                ) : testsError ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: '#ff6b6b' }}>시험 목록 로드 실패: {testsError}</p>
                  </div>
                ) : tests.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>등록된 시험이 없습니다.</p>
                  </div>
                ) : (
                  <div>
                    {/* 페이지 정보 */}
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center' }}>
                      전체 {tests.length}개 | {currentTestsPage}/{totalTestsPages} 페이지 | 현재 페이지: {Math.min(testsStartIndex + 1, tests.length)}~{Math.min(testsEndIndex, tests.length)}번째
                    </p>
                    
                    <div style={{ overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent', textAlign: 'center' }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-secondary)', paddingLeft: '30px' }}>
                            <th style={{textAlign: 'center'}}>시험명</th>
                            <th style={{textAlign: 'center'}}>회사명</th>
                            <th style={{textAlign: 'center'}}>난이도</th>
                            <th style={{textAlign: 'center'}}>작업</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTestsList.map(test => {
                            // user_id에 해당하는 사용자 찾기
                            const user = testsUsers.find(u => u.user_id === test.user_id);
                            const companyName = user ? user.nickname : `회사 ${test.user_id}`;
                            
                            return (
                              <tr key={test.test_id}>
                                <td>{test.title}</td>
                                <td>{companyName}</td>
                                <td>{test.level_id === 1 ? '초급' : test.level_id === 2 ? '중급' : test.level_id === 3 ? '고급' : `난이도 ${test.level_id}`}</td>
                                <td>
                                  <button 
                                    onClick={() => deleteTest(test.test_id, test.title)}
                                    disabled={deletingTest}
                                    className="btn-primary" 
                                    style={{ 
                                      padding: '0.3rem 1rem', 
                                      borderRadius: '0.5rem',
                                      opacity: deletingTest ? 0.5 : 1,
                                      cursor: deletingTest ? 'not-allowed' : 'pointer'
                                    }}
                                  >
                                    {deletingTest ? (
                                      <>
                                        <FaSpinner className="animate-spin inline mr-1" />
                                        삭제 중...
                                      </>
                                    ) : (
                                      <>
                                        <FaTrash className="inline mr-1" />
                                        삭제
                                      </>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* 🎯 시험 페이징 UI */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      marginTop: '2rem',
                      gap: '0.5rem'
                    }}>
                      {/* 이전 페이지 버튼 */}
                      <button
                        onClick={handleTestsPreviousPage}
                        disabled={currentTestsPage === 1}
                        className="btn-primary"
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          opacity: currentTestsPage === 1 ? 0.5 : 1,
                          cursor: currentTestsPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        이전
                      </button>

                      {/* 페이지 번호들 */}
                      {Array.from({ length: totalTestsPages }, (_, i) => i + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => handleTestsPageChange(pageNumber)}
                          className={currentTestsPage === pageNumber ? 'btn-primary' : 'btn-secondary'}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            minWidth: '2.5rem',
                            backgroundColor: currentTestsPage === pageNumber 
                              ? 'var(--accent-primary)' 
                              : 'var(--glass-bg)',
                            color: currentTestsPage === pageNumber 
                              ? 'white' 
                              : 'var(--text-primary)',
                            border: '1px solid var(--glass-border)'
                          }}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      {/* 다음 페이지 버튼 */}
                      <button
                        onClick={handleTestsNextPage}
                        disabled={currentTestsPage === totalTestsPages}
                        className="btn-primary"
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          opacity: currentTestsPage === totalTestsPages ? 0.5 : 1,
                          cursor: currentTestsPage === totalTestsPages ? 'not-allowed' : 'pointer'
                        }}
                      >
                        다음
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedNav === 'problems' && (
              <div className="glass-effect rounded-2xl p-8 mb-10 admin-card" style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 className="gradient-text text-2xl md:text-3xl font-bold text-center" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', marginBottom: 0, width: 'max-content' }}>문제 관리</h3>
                  <button 
                    onClick={() => navigate('/challenge-register')}
                    className="px-5 py-2 text-sm font-medium rounded-lg btn-primary" 
                    style={{ marginLeft: 'auto' }}
                  >
                    문제 등록
                  </button>
                </div>
                
                {problemsLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>문제 목록을 불러오는 중...</p>
                  </div>
                ) : problemsError ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: '#ff6b6b' }}>문제 목록 로드 실패: {problemsError}</p>
                  </div>
                ) : problems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>등록된 문제가 없습니다.</p>
                  </div>
                ) : (
                  <div>
                    {/* 페이지 정보 */}
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center' }}>
                      전체 {problems.length}개 | {currentProblemsPage}/{totalProblemsPages} 페이지 | 현재 페이지: {Math.min(problemsStartIndex + 1, problems.length)}~{Math.min(problemsEndIndex, problems.length)}번째
                    </p>
                    
                    <div style={{ overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent', textAlign: 'center' }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-secondary)', paddingLeft: '30px' }}>
                            <th style={{textAlign: 'center'}}>제목</th>
                            <th 
                              style={{
                                textAlign: 'center', 
                                cursor: 'pointer',
                                userSelect: 'none'
                              }}
                              onClick={() => handleSort('category')}
                              title="클릭하여 정렬"
                            >
                              카테고리 {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                              style={{
                                textAlign: 'center', 
                                cursor: 'pointer',
                                userSelect: 'none'
                              }}
                              onClick={() => handleSort('language')}
                              title="클릭하여 정렬"
                            >
                              언어 {sortField === 'language' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                              style={{
                                textAlign: 'center', 
                                cursor: 'pointer',
                                userSelect: 'none'
                              }}
                              onClick={() => handleSort('level')}
                              title="클릭하여 정렬"
                            >
                              난이도 {sortField === 'level' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th style={{textAlign: 'center'}}>작업</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentProblems.map(problem => (
                            <tr key={problem.challenge_id}>
                              <td>{problem.challenge_title}</td>
                              <td>{problemCategories.find(cat => cat.category_id === problem.category_id)?.category_name || '미분류'}</td>
                              <td>{problem.language || 'Python'}</td>
                              <td>{problemLevels.find(level => level.level_id === problem.level_id)?.level_name || '미분류'}</td>
                              <td>
                                <button 
                                  onClick={() => deleteProblem(problem.challenge_id, problem.challenge_title)}
                                  disabled={deletingProblem}
                                  className="btn-primary" 
                                  style={{ 
                                    padding: '0.3rem 1rem', 
                                    borderRadius: '0.5rem',
                                    opacity: deletingProblem ? 0.5 : 1,
                                    cursor: deletingProblem ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  {deletingProblem ? (
                                    <>
                                      <FaSpinner className="animate-spin inline mr-1" />
                                      삭제 중...
                                    </>
                                  ) : (
                                    <>
                                      <FaTrash className="inline mr-1" />
                                      삭제
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* 🎯 문제 페이징 UI */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      marginTop: '2rem',
                      gap: '0.5rem'
                    }}>
                      {/* 이전 페이지 버튼 */}
                      <button
                        onClick={handleProblemsPreviousPage}
                        disabled={currentProblemsPage === 1}
                        className="btn-primary"
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          opacity: currentProblemsPage === 1 ? 0.5 : 1,
                          cursor: currentProblemsPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        이전
                      </button>

                      {/* 페이지 번호들 */}
                      {Array.from({ length: totalProblemsPages }, (_, i) => i + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => handleProblemsPageChange(pageNumber)}
                          className={currentProblemsPage === pageNumber ? 'btn-primary' : 'btn-secondary'}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            minWidth: '2.5rem',
                            backgroundColor: currentProblemsPage === pageNumber 
                              ? 'var(--accent-primary)' 
                              : 'var(--glass-bg)',
                            color: currentProblemsPage === pageNumber 
                              ? 'white' 
                              : 'var(--text-primary)',
                            border: '1px solid var(--glass-border)'
                          }}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      {/* 다음 페이지 버튼 */}
                      <button
                        onClick={handleProblemsNextPage}
                        disabled={currentProblemsPage === totalProblemsPages}
                        className="btn-primary"
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          opacity: currentProblemsPage === totalProblemsPages ? 0.5 : 1,
                          cursor: currentProblemsPage === totalProblemsPages ? 'not-allowed' : 'pointer'
                        }}
                      >
                        다음
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedNav === 'products' && (
              <div className="glass-effect rounded-2xl p-8 mb-10 admin-card" style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 className="gradient-text text-2xl md:text-3xl font-bold text-center" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', marginBottom: 0, width: 'max-content' }}>상품 관리</h3>
                  <button 
                    onClick={() => window.location.href = '/product-register'}
                    className="px-5 py-2 text-sm font-medium rounded-lg btn-primary" 
                    style={{ marginLeft: 'auto' }}
                  >
                    상품 등록
                  </button>
                </div>
                
                {productsLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>상품 목록을 불러오는 중...</p>
                  </div>
                ) : productsError ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: '#ff6b6b' }}>상품 목록 로드 실패: {productsError}</p>
                  </div>
                ) : products.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>등록된 상품이 없습니다.</p>
                  </div>
                ) : (
                  <div>
                    {/* 페이지 정보 */}
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center' }}>
                      전체 {products.length}개 | {currentProductsPage}/{totalProductsPages} 페이지 | 현재 페이지: {Math.min(productsStartIndex + 1, products.length)}~{Math.min(productsEndIndex, products.length)}번째
                    </p>
                    
                    <div style={{ overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent', textAlign: 'center' }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-secondary)', paddingLeft: '30px' }}>
                            <th style={{textAlign: 'center'}}>상품명</th>
                            <th style={{textAlign: 'center'}}>저자</th>
                            <th style={{textAlign: 'center'}}>가격</th>
                            <th style={{textAlign: 'center'}}>작업</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentProductsList.map(product => (
                            <tr key={product.product_id}>
                              <td>{product.product_title}</td>
                              <td>{product.writer}</td>
                              <td>{product.price.toLocaleString()}원</td>
                              <td>
                                <button 
                                  onClick={() => deleteProduct(product.product_id, product.product_title)}
                                  disabled={deletingProduct}
                                  className="btn-primary" 
                                  style={{ 
                                    padding: '0.3rem 1rem', 
                                    borderRadius: '0.5rem',
                                    opacity: deletingProduct ? 0.5 : 1,
                                    cursor: deletingProduct ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  {deletingProduct ? (
                                    <>
                                      <FaSpinner className="animate-spin inline mr-1" />
                                      삭제 중...
                                    </>
                                  ) : (
                                    <>
                                      <FaTrash className="inline mr-1" />
                                      삭제
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* 🎯 상품 페이징 UI */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      marginTop: '2rem',
                      gap: '0.5rem'
                    }}>
                      {/* 이전 페이지 버튼 */}
                      <button
                        onClick={handleProductsPreviousPage}
                        disabled={currentProductsPage === 1}
                        className="btn-primary"
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          opacity: currentProductsPage === 1 ? 0.5 : 1,
                          cursor: currentProductsPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        이전
                      </button>

                      {/* 페이지 번호들 */}
                      {Array.from({ length: totalProductsPages }, (_, i) => i + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => handleProductsPageChange(pageNumber)}
                          className={currentProductsPage === pageNumber ? 'btn-primary' : 'btn-secondary'}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            minWidth: '2.5rem',
                            backgroundColor: currentProductsPage === pageNumber 
                              ? 'var(--accent-primary)' 
                              : 'var(--glass-bg)',
                            color: currentProductsPage === pageNumber 
                              ? 'white' 
                              : 'var(--text-primary)',
                            border: '1px solid var(--glass-border)'
                          }}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      {/* 다음 페이지 버튼 */}
                      <button
                        onClick={handleProductsNextPage}
                        disabled={currentProductsPage === totalProductsPages}
                        className="btn-primary"
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          opacity: currentProductsPage === totalProductsPages ? 0.5 : 1,
                          cursor: currentProductsPage === totalProductsPages ? 'not-allowed' : 'pointer'
                        }}
                      >
                        다음
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedNav === 'settings' && (
              <div className="glass-effect rounded-2xl p-8 mb-10 admin-card">
                <h3 className="gradient-text text-2xl md:text-3xl font-bold mb-6 text-left">관리자 설정</h3>
                
                <div className="space-y-8">

                  {/* 게시판 설정 */}
                  <div className="border border-gray-600 rounded-lg p-6">
                    <h4 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
                      💬 게시판 설정
                    </h4>
                    
                    <div className="space-y-6">
                      {/* 게시글 작성 권한 */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                          게시글 작성 권한
                        </label>
                        <select 
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:outline-none"
                          defaultValue={dummyAdminSettings.boardSettings.postPermission}
                        >
                          <option value="전체">전체 사용자</option>
                          <option value="회원">회원만</option>
                          <option value="관리자">관리자만</option>
                        </select>
                      </div>
                      
                      {/* 댓글 기능 */}
                      <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="form-checkbox w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                            defaultChecked={dummyAdminSettings.boardSettings.commentEnabled}
                          />
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            댓글 기능 활성화
                          </span>
                        </label>
                      </div>
                      

                      
                      <button className="btn-primary px-6 py-2 rounded-lg">게시판 설정 저장</button>
                    </div>
                  </div>

                  {/* 공지사항 관리 */}
                  <div className="border border-gray-600 rounded-lg p-6">
                    <h4 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
                      📢 공지사항 관리
                    </h4>
                    
                    <div className="space-y-8">
                      {/* 시험 일정 공지 */}
                      <div>
                        <h5 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
                          시험 일정 공지
                        </h5>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                              공지 내용
                            </label>
                            <textarea 
                              rows={3}
                              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:outline-none resize-none"
                              placeholder="시험 일정 공지사항을 입력하세요..."
                              defaultValue={dummyAdminSettings.notices.testSchedule.content}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                시험 날짜
                              </label>
                              <input 
                                type="date"
                                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:outline-none"
                                defaultValue={dummyAdminSettings.notices.testSchedule.date}
                              />
                            </div>
                            <div className="flex items-end">
                              <button className="btn-primary px-6 py-3 rounded-lg">시험 공지 발행</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 서비스 점검 일정 */}
                      <div>
                        <h5 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
                          서비스 점검 일정
                        </h5>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                              점검 안내 내용
                            </label>
                            <textarea 
                              rows={3}
                              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:outline-none resize-none"
                              placeholder="서비스 점검 안내사항을 입력하세요..."
                              defaultValue={dummyAdminSettings.notices.maintenanceSchedule.content}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                점검 날짜
                              </label>
                              <input 
                                type="date"
                                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:outline-none"
                                defaultValue={dummyAdminSettings.notices.maintenanceSchedule.date}
                              />
                            </div>
                            <div className="flex items-end">
                              <button className="btn-primary px-6 py-3 rounded-lg">점검 공지 발행</button>
                            </div>
                          </div>
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
    </div>
  );
}

export default MyPageAdmin;
