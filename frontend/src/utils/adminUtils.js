// 관리자 권한 관련 유틸리티 함수들

/**
 * 관리자 권한을 설정합니다
 * @param {boolean} isAdmin - 관리자 여부
 */
export const setAdminRole = (isAdmin) => {
  localStorage.setItem('userRole', isAdmin ? 'admin' : 'user');
};

/**
 * 현재 사용자의 관리자 권한을 확인합니다
 * @returns {boolean} 관리자 여부
 */
export const isAdmin = () => {
  return localStorage.getItem('userRole') === 'admin';
};

/**
 * 관리자 권한을 제거합니다
 */
export const removeAdminRole = () => {
  localStorage.removeItem('userRole');
};

/**
 * 현재 사용자 역할을 가져옵니다
 * @returns {string} 사용자 역할 ('admin' | 'user' | null)
 */
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

/**
 * 관리자 권한을 토글합니다
 * @returns {boolean} 토글 후 관리자 여부
 */
export const toggleAdminRole = () => {
  const currentRole = getUserRole();
  const newRole = currentRole === 'admin' ? 'user' : 'admin';
  setAdminRole(newRole === 'admin');
  return newRole === 'admin';
}; 