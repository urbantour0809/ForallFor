// frontend/public/utils/imageUtils.js

import javaImage from '../assets/images/book_cover/java.png';
import pythonImage from '../assets/images/book_cover/python.png';
import javascriptImage from '../assets/images/book_cover/javascript.png';
import cppImage from '../assets/images/book_cover/c++.png';
import rustImage from '../assets/images/book_cover/rust.png';
import algorithmImage from '../assets/images/book_cover/algorithm.png';

export const getBookCoverImage = (book) => {
  if (!book) return null;

  // ✅ 우선순위 1: DB에서 넘긴 product_image 값 (Static Import 방식)
  const imageMap = {
    'java.png': javaImage,
    'python.png': pythonImage,
    'javascript.png': javascriptImage,
    'c++.png': cppImage,
    'rust.png': rustImage,
    'algorithm.png': algorithmImage
  };

  if (book.product_image && imageMap[book.product_image]) {
    return imageMap[book.product_image];
  }

  // ✅ 우선순위 2: 동적 경로 방식 (새로 추가된 이미지용)
  if (book.product_image) {
    // 파일 확장자가 있는지 확인
    const hasExtension = /\.(png|jpg|jpeg|gif|webp)$/i.test(book.product_image);
    if (hasExtension) {
      return `/images/book_cover/${book.product_image}`;
    }
  }

  // ✅ 우선순위 3: languages 값 기준
  const languageImageMap = {
    'java': javaImage,
    'python': pythonImage,
    'javascript': javascriptImage,
    'c++': cppImage,
    'rust': rustImage,
    'multiple': algorithmImage
  };

  if (book.languages && languageImageMap[book.languages.toLowerCase()]) {
    return languageImageMap[book.languages.toLowerCase()];
  }

  return null;
};

export const hasBookCoverImage = (book) => {
  return getBookCoverImage(book) !== null;
};

export const getBookCoverAltText = (book) => {
  if (!book) return '책 커버 이미지';
  return `${book.product_title || book.title || '책'} 커버`;
};

export const getBookCoverFallbackStyle = (language) => {
  const colorMap = {
    'java': 'from-orange-500/20 to-red-500/20',
    'python': 'from-blue-500/20 to-yellow-500/20',
    'javascript': 'from-yellow-500/20 to-orange-500/20',
    'c++': 'from-blue-500/20 to-purple-500/20',
    'rust': 'from-orange-500/20 to-gray-600/20',
    'multiple': 'from-purple-500/20 to-pink-500/20'
  };

  const gradient = colorMap[language] || colorMap['multiple'];

  return {
    background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
    '--tw-gradient-from': 'rgb(168 85 247 / 0.2)',
    '--tw-gradient-to': 'rgb(236 72 153 / 0.2)',
    '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to)`,
    backgroundImage: `linear-gradient(135deg, ${
        language === 'java' ? 'rgba(249, 115, 22, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%' :
            language === 'python' ? 'rgba(59, 130, 246, 0.2) 0%, rgba(234, 179, 8, 0.2) 100%' :
                language === 'javascript' ? 'rgba(234, 179, 8, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%' :
                    language === 'c++' ? 'rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%' :
                        language === 'rust' ? 'rgba(249, 115, 22, 0.2) 0%, rgba(75, 85, 99, 0.2) 100%' :
                            'rgba(147, 51, 234, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%'
    })`
  };
};
