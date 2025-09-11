import React, { useEffect, useMemo, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

function WriteTest({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [levelId, setLevelId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [problems, setProblems] = useState([
    { title: '', content: '', hint: '', correct: '' },
    { title: '', content: '', hint: '', correct: '' },
    { title: '', content: '', hint: '', correct: '' },
    { title: '', content: '', hint: '', correct: '' },
    { title: '', content: '', hint: '', correct: '' },
  ]);

  const LEVEL_CHOICES = useMemo(() => ([
    { level_id: 1, name: '초급' },
    { level_id: 2, name: '중급' },
    { level_id: 3, name: '고급' },
  ]), []);
  const CATEGORY_CHOICES = useMemo(() => ([
    { category_id: 1, name: '실무 능력' },
    { category_id: 2, name: '알고리즘 구조' },
    { category_id: 3, name: '자료구조 활용' },
    { category_id: 4, name: '언어 활용 능력' },
    { category_id: 5, name: '디버깅 및 테스트' },
  ]), []);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setContent('');
      setLevelId('');
      setCategoryId('');
      setProblems([
        { title: '', content: '', hint: '', correct: '' },
        { title: '', content: '', hint: '', correct: '' },
        { title: '', content: '', hint: '', correct: '' },
        { title: '', content: '', hint: '', correct: '' },
        { title: '', content: '', hint: '', correct: '' },
      ]);
    }
  }, [isOpen]);

  const canSubmit = useMemo(() => {
    const baseOk = title.trim() && content.trim() && String(levelId) && String(categoryId);
    const problemsOk = problems.length === 5 && problems.every(p => (
      p.title.trim() && p.content.trim() && p.hint.trim() && p.correct.trim()
    ));
    return baseOk && problemsOk;
  }, [title, content, levelId, categoryId, problems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    try {
      setSubmitting(true);
      const testPart = {
        title: title.trim(),
        content: content.trim(),
        level_id: Number(levelId),
        category_id: Number(categoryId)
      };
      const problemsPart = problems.map(p => ({
        title: p.title.trim(),
        content: p.content.trim(),
        hint: p.hint.trim(),
        correct: p.correct.trim()
      }));

      const res = await axios.post('http://localhost:8080/FAF/api/test/insert', testPart, { withCredentials: true });
      const isSuccess = res?.data?.success === true || res?.data?.success === 'true';
      const testId = res?.data?.testId ?? res?.data?.test_id ?? null;
      if (!isSuccess || !testId) {
        alert('테스트 등록에 실패했습니다.');
        return;
      }
      const payloadProblems = problemsPart.map(p => ({ ...p, test_id: Number(testId) }));
      const res2 = await axios.post('http://localhost:8080/FAF/api/test/problem/insert', payloadProblems, { withCredentials: true });
      const isSuccess2 = res2?.data?.success === true || res2?.data?.success === 'true';
      if (!isSuccess2) {
        alert('문제 등록에 실패했습니다.');
        return;
      }
      onSuccess?.();
    } catch (err) {
      console.error('테스트 등록 오류:', err);
      alert('테스트 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700" style={{ flex: '0 0 auto' }}>
          <h3 className="text-xl font-bold text-white">테스트 등록</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" style={{ overflowY: 'auto', flex: '1 1 auto' }}>
          <div>
            <label className="block text-sm text-gray-300 mb-1">제목</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white" placeholder="테스트 제목" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">내용</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full h-40 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white" placeholder="테스트 설명" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">난이도</label>
              <select value={levelId} onChange={(e) => setLevelId(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white">
                <option value="">선택하세요</option>
                {LEVEL_CHOICES.map((l) => (
                  <option key={l.level_id} value={l.level_id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">카테고리</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white">
                <option value="">선택하세요</option>
                {CATEGORY_CHOICES.map((c) => (
                  <option key={c.category_id} value={c.category_id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-4 mt-4">
            {problems.map((p, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-gray-700/40 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-semibold">문제 {idx + 1}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">문제 제목</label>
                    <input value={p.title} onChange={(e) => {
                      const v = e.target.value; setProblems(prev => prev.map((it,i)=> i===idx?{...it, title:v}:it));
                    }} className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white" placeholder={`문제 ${idx+1} 제목`} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">힌트</label>
                    <input value={p.hint} onChange={(e) => {
                      const v = e.target.value; setProblems(prev => prev.map((it,i)=> i===idx?{...it, hint:v}:it));
                    }} className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white" placeholder="힌트" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm text-gray-300 mb-1">문제 설명</label>
                  <textarea value={p.content} onChange={(e) => {
                    const v = e.target.value; setProblems(prev => prev.map((it,i)=> i===idx?{...it, content:v}:it));
                  }} className="w-full h-24 px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white" placeholder="문제 내용을 입력하세요" />
                </div>
                <div className="mt-3">
                  <label className="block text-sm text-gray-300 mb-1">예상 실행 결과</label>
                  <textarea value={p.correct} onChange={(e) => {
                    const v = e.target.value; setProblems(prev => prev.map((it,i)=> i===idx?{...it, correct:v}:it));
                  }} className="w-full h-20 px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white" placeholder="예상 실행 결과를 입력하세요" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2" style={{ flex: '0 0 auto' }}>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-700 text-white">취소</button>
            <button type="submit" disabled={!canSubmit || submitting} className="px-4 py-2 rounded-lg btn-primary disabled:opacity-50">등록</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WriteTest;

