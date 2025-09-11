
-- 사용자 테이블
CREATE TABLE USERS (
    user_id int PRIMARY KEY AUTO_INCREMENT, -- 사용자 PK
    id VARCHAR(50) UNIQUE NOT NULL, -- 아이디
    password VARCHAR(255) NOT NULL, -- 비밀번호
    nickname VARCHAR(30) NOT NULL, -- 닉네임
    user_type ENUM('ADMIN', 'USER', 'COMPANY') DEFAULT 'USER', -- 사용자 타입
    email varchar(50) not null, -- 이메일
    experience_points INT DEFAULT 0, -- 경험치
    grade_id int default 1,  -- 유저등급
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 생성일
    point int default 1, -- 보유 포인트
    
    FOREIGN KEY (grade_id) REFERENCES USER_GRADES(grade_id) -- 등급 FK
);
select * from users;
-- USER 타입 사용자 더미 데이터 3개
INSERT INTO USERS (id, password, nickname, user_type, email, experience_points, grade_id, point)
VALUES 
('user01', 'pass1234', '초보유저', 'USER', 'user01@example.com', 100, 1, 500),
('user02', 'pass5678', '중급유저', 'USER', 'user02@example.com', 350, 2, 1500),
('user03', 'pass91011', '고급유저', 'USER', 'user03@example.com', 800, 3, 3000);

-- COMPANY 타입 사용자 더미 데이터 5개
INSERT INTO USERS (id, password, nickname, user_type, email, experience_points, grade_id, point)
VALUES 
('comp01', 'comppass1', '회사A', 'COMPANY', 'comp01@company.com', 0, 1, 10000),
('comp02', 'comppass2', '회사B', 'COMPANY', 'comp02@company.com', 0, 1, 8000),
('comp03', 'comppass3', '회사C', 'COMPANY', 'comp03@company.com', 0, 1, 6000),
('comp04', 'comppass4', '회사D', 'COMPANY', 'comp04@company.com', 0, 1, 4000),
('comp05', 'comppass5', '회사E', 'COMPANY', 'comp05@company.com', 0, 1, 2000);


select * from users;

-- 등급 테이블
CREATE TABLE USER_GRADES (
    grade_id INT PRIMARY KEY AUTO_INCREMENT, -- 등급 PK
    grade_name VARCHAR(20) NOT NULL, -- 등급 이름
    min_experience INT NOT NULL, -- 최소 경험치
    max_experience INT, -- 최대 경험치
    grade_color VARCHAR(7), -- 등급 색상
    grade_icon VARCHAR(100) -- 등급 이미지
);

-- 등급 데이터
INSERT INTO USER_GRADES (grade_name, min_experience, max_experience, grade_color, grade_icon) VALUES
('Bronze', 0, 499, '#CD7F32', '/images/grades/bronze.png'),
('Silver', 500, 999, '#C0C0C0', '/images/grades/silver.png'),
('Gold', 1000, 1999, '#FFD700', '/images/grades/gold.png'),
('Diamond', 2000, 3999, '#E5E4E2', '/images/grades/platinum.png'),
('Master', 4000, NULL, '#B9F2FF', '/images/grades/diamond.png');

use FAFdb;

-- 상품 데이터
CREATE TABLE PRODUCTS (
    product_id int PRIMARY KEY AUTO_INCREMENT, -- 상품 PK
	product_title VARCHAR(50) UNIQUE NOT NULL, -- 제목
    stitle varchar(50) not null, -- 부제목
    writer varchar(50) not null, -- 작가
    publisher varchar(50) not null, -- 출판사
    content TEXT not null, -- 내용
    page int not null, -- 페이지 수
    price int not null, -- 가격
    languages varchar(50) not null, -- 언어
    stock int, -- 재고
    product_image varchar(50)

);

-- 장바구니 테이블
CREATE TABLE CARTS (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,      -- 장바구니 PK
    user_id INT NOT NULL,                        -- 사용자 ID (FK)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 생성일

    FOREIGN KEY (user_id) REFERENCES USERS(user_id) -- 사용자 FK 설정
);
use fafdb;
-- 장바구니 품목 테이블
CREATE TABLE CART_ITEMS (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cart_id) REFERENCES CARTS(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id) ON DELETE CASCADE
);


-- 테스트 카테고리
CREATE TABLE TEST_CATEGORY (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);


-- 테스트 난이도
CREATE TABLE TEST_LEVELS (
    level_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20)
);



-- 테스트
CREATE TABLE TESTS (
    test_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    level_id INT,
    category_id INT,
    user_id INT,
    FOREIGN KEY (level_id) REFERENCES TEST_LEVELS(level_id),
    FOREIGN KEY (category_id) REFERENCES TEST_CATEGORY(category_id),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

-- 테스트 문항
CREATE TABLE TEST_PROBLEMS (
    test_problem_id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    hint TEXT,
    correct TEXT, 
    FOREIGN KEY (test_id) REFERENCES TESTS(test_id)
);

-- 응시 기록
CREATE TABLE TEST_SUB (
    test_sub_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, 
    test_id INT,
    correct_count INT DEFAULT 0,
    wrong_count INT DEFAULT 0,
    pass BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (test_id) REFERENCES TESTS(test_id)
);

-- 응시 상세 기록
CREATE TABLE TEST_ANSWER_DETAIL (
    answer_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    test_problem_id INT,
    test_sub_id INT,
    sub_code TEXT, 
    pass BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (test_problem_id) REFERENCES TEST_PROBLEMS(test_problem_id),
    FOREIGN KEY (test_sub_id) REFERENCES TEST_SUB(test_sub_id)
);

INSERT INTO TEST_LEVELS (name, color)
VALUES 
  ('초급', 'text-green-400'),
  ('중급', 'text-yellow-400'),
  ('고급', 'text-red-400');
  
INSERT INTO TEST_CATEGORY (name)
VALUES 
  ('실무 능력'),
  ('알고리즘 구조'),
  ('자료구조 활용'),
  ('언어 활용 능력'),
  ('디버깅 및 테스트');



<<<<<<< Updated upstream
CREATE TABLE Challenge_Levels (
                                  level_id INT AUTO_INCREMENT PRIMARY KEY,   -- 난이도 ID (PK)
                                  level_name VARCHAR(50) NOT NULL,           -- 난이도 이름 (예: 하, 중, 상)
                                  color VARCHAR(20),                         -- 난이도 색상 (예: red, green, blue)
                                  exp INT DEFAULT 0                          -- 해당 난이도에 따른 보상 경험치
);

CREATE TABLE Challenges (
                            challenge_id 		INT AUTO_INCREMENT PRIMARY KEY,  	-- PK, 자동 증가
                            challenge_title 	VARCHAR(100) NOT NULL,        		-- 문제 제목
                            level_id 			INT NOT NULL,                       -- 난이도 (외래키)
                            category_id 		INT NOT NULL,                     	-- 카테고리 (외래키)
                            language 			VARCHAR(50) NOT NULL,               -- 사용 언어
                            content 			TEXT NOT NULL,                      -- 문제 내용
                            hint 				TEXT,                               -- 힌트 (옵션)
                            correct 			TEXT NOT NULL,                       -- 정답

                            FOREIGN KEY (level_id) REFERENCES Challenge_Levels(level_id),
                            FOREIGN KEY (category_id) REFERENCES Challenge_Categorys(category_id)
);

CREATE TABLE Challenge_sub (
                               challenge_sub_id INT AUTO_INCREMENT PRIMARY KEY,         -- PK, 자동 증가
                               challenge_id INT NOT NULL,                               -- 문제 ID (FK)
                               user_id INT NOT NULL,                                    -- 사용자 ID (FK)
                               correct_answer TEXT NOT NULL,                            -- 제출한 정답
                               correct_code TEXT,                                       -- 제출한 코드 (선택)
                               exp_count INT DEFAULT 0,                                 -- 지급한 보상 (기본 0)
                               pass boolean not null,

                               FOREIGN KEY (challenge_id) REFERENCES Challenges(challenge_id),
                               FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

CREATE TABLE Challenge_Categorys (
                                     category_id INT AUTO_INCREMENT PRIMARY KEY,  -- 카테고리 ID (PK)
                                     category_name VARCHAR(50) NOT NULL            -- 카테고리 이름
);

-- 샘플 데이터 삽입
INSERT INTO Challenge_Levels (level_name, color, exp) VALUES
                                                          ('초급', 'green', 100),
                                                          ('중급', 'yellow', 300),
                                                          ('고급', 'red', 500);

INSERT INTO Challenge_Categorys (category_name) VALUES
                                                    ('알고리즘'),
                                                    ('자료구조'),
                                                    ('웹개발'),
                                                    ('프론트엔드'),
                                                    ('백엔드'),
                                                    ('시스템');
=======
-- 게시글 테이블: 커뮤니티 게시글의 기본 정보를 저장
CREATE TABLE posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,         -- 게시글 고유 ID
  title VARCHAR(255) NOT NULL,                    -- 게시글 제목
  content TEXT NOT NULL,                          -- 게시글 본문
  user_id INT NOT NULL,                         -- 작성자 ID
  category_id INT,                           -- 게시글 카테고리
  views INT DEFAULT 0,                            -- 조회수
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 작성 시간

  FOREIGN KEY (category_id) REFERENCES post_category(category_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE TABLE post_category (
 category_id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(50) NOT NULL,
 color VARCHAR(50) NOT NULL
);
>>>>>>> Stashed changes

INSERT INTO Challenges (challenge_title, level_id, category_id, language, content, hint, correct) VALUES
                                                                                                      ('배열 최댓값 찾기', 1, 1, 'Java', '주어진 배열에서 최댓값을 찾는 알고리즘을 구현하세요.', '반복문을 사용해보세요', 'Arrays.stream(arr).max().orElse(0)'),
                                                                                                      ('이진 탐색 트리 구현', 3, 2, 'C++', '이진 탐색 트리의 삽입, 삭제, 검색 기능을 구현하세요.', '재귀를 활용하세요', 'class BST { ... }'),
                                                                                                      ('웹 스크래핑 봇', 2, 3, 'Python', 'Beautiful Soup을 사용하여 웹 데이터를 수집하는 봇을 만드세요.', 'requests와 bs4 라이브러리를 사용하세요', 'soup = BeautifulSoup(...)'),
                                                                                                      ('React 할일 앱', 2, 4, 'JavaScript', 'React를 사용하여 CRUD 기능이 있는 할일 관리 앱을 만드세요.', 'useState Hook을 활용하세요', 'const [todos, setTodos] = useState([])'),
                                                                                                      ('메모리 할당자 구현', 3, 6, 'C', 'C언어로 사용자 정의 메모리 할당자를 구현하세요.', 'malloc, free 함수를 직접 구현해보세요', 'void* my_malloc(size_t size) { ... }'),
                                                                                                      ('동시성 웹 서버', 3, 5, 'Go', 'Go의 고루틴을 사용하여 동시성 웹 서버를 구현하세요.', 'goroutine과 channel을 활용하세요', 'go func() { ... }()');


-- 게시글 테이블: 커뮤니티 게시글의 기본 정보를 저장
CREATE TABLE posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,         -- 게시글 고유 ID
  title VARCHAR(255) NOT NULL,                    -- 게시글 제목
  content TEXT NOT NULL,                          -- 게시글 본문
  user_id INT NOT NULL,                         -- 작성자 ID
  category_id INT,                           -- 게시글 카테고리
  views INT DEFAULT 0,                            -- 조회수
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 작성 시간

  FOREIGN KEY (category_id) REFERENCES post_category(category_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE TABLE post_category (
 category_id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(50) NOT NULL,
 color VARCHAR(50) NOT NULL
);

INSERT INTO posts (title, content, user_id, category_id, views) VALUES
('React로 게시판 만들기', 'React와 Node.js를 이용한 게시판 만들기 프로젝트입니다.', 1, 1, 23),
('Spring Boot 입문', 'Spring Boot를 처음 시작하는 분들을 위한 가이드입니다.', 1, 2, 45),
('파이썬 데이터 분석', 'Pandas와 Matplotlib을 활용한 기초 데이터 분석 예제.', 1, 3, 37),
('스터디 모집합니다', '매주 토요일에 백엔드 스터디 하실 분 계신가요?', 1, 4, 12),
('면접 후기 공유', '최근 IT 기업 면접 본 후기 공유합니다.', 1, 5, 67);

INSERT INTO post_category (category_id, name, color) VALUES
(1, 'Frontend', 'bg-blue-500'),
(2, 'Backend', 'bg-green-500'),
(3, 'Data Science', 'bg-purple-500'),
(4, 'Study', 'bg-yellow-500'),
(5, 'Interview', 'bg-red-500');

select * from post_category;
