import React, { useState, useRef, useMemo } from 'react';
import { Icon } from './ui/Icon';
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';
import { GoogleGenAI, Type } from "@google/genai";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ATSProps {
  onSaveCandidate?: (candidate: any) => void;
  showToast: (msg: string, type?: any) => void;
}

export default function ATS({ onSaveCandidate, showToast }: ATSProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractText = async (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        const content = e.target?.result;
        if (!content) return reject('Empty file');

        if (file.type === 'application/pdf') {
          try {
            const pdf = await pdfjsLib.getDocument({ data: content as ArrayBuffer }).promise;
            let text = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              text += textContent.items.map((item: any) => item.str).join(' ') + ' ';
            }
            resolve(text);
          } catch (err) { 
            console.error('PDF extraction error:', err);
            reject('Error reading PDF'); 
          }
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          try {
            const result = await mammoth.extractRawText({ arrayBuffer: content as ArrayBuffer });
            resolve(result.value);
          } catch (err) { 
            console.error('Word extraction error:', err);
            reject('Error reading Word'); 
          }
        } else {
          resolve(new TextDecoder().decode(content as ArrayBuffer));
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const analyzeWithGemini = async (cvText: string, jd: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    
    const prompt = `
      Analyze this CV against the Job Description.
      JD: ${jd}
      CV: ${cvText}
      Return JSON only.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              name: { type: Type.STRING },
              summary: { type: Type.STRING },
              classification: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["score", "name", "summary", "classification"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (err) {
      console.error(err);
      return { score: 0, name: 'Error', summary: 'Failed to analyze', classification: 'N/A' };
    }
  };

  const startAnalysis = async () => {
    if (!jobDescription || files.length === 0) return showToast('يرجى إدخال الوصف الوظيفي ورفع الملفات', 'warning');
    setIsAnalyzing(true);
    setResults([]);
    
    const newResults = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const text = await extractText(files[i]);
        const analysis = await analyzeWithGemini(text, jobDescription);
        newResults.push({ ...analysis, fileName: files[i].name, id: Date.now() + i });
      } catch (err) {
        newResults.push({ name: files[i].name, score: 0, summary: 'Error', classification: 'Error' });
      }
      setAnalysisProgress(Math.round(((i + 1) / files.length) * 100));
    }
    setResults(newResults.sort((a, b) => b.score - a.score));
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[50px] p-10 shadow-xl border border-slate-50 space-y-6">
          <h3 className="text-2xl font-black text-slate-800">1. الوصف الوظيفي</h3>
          <textarea 
            className="w-full h-64 p-6 rounded-[30px] bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-500 font-bold text-slate-700 resize-none"
            placeholder="أدخل الوصف الوظيفي هنا..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-[50px] p-10 shadow-xl border border-slate-50 space-y-6">
          <h3 className="text-2xl font-black text-slate-800">2. ملفات المرشحين</h3>
          <div 
            className="border-4 border-dashed rounded-[40px] p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-50 transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} className="hidden" multiple accept=".pdf,.docx" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
            <Icon name="upload-cloud" size={48} className="text-slate-300" />
            <p className="font-black text-slate-700">اضغط لرفع السير الذاتية</p>
            <p className="text-xs text-slate-400">{files.length} ملفات مختارة</p>
          </div>
          <button 
            onClick={startAnalysis}
            disabled={isAnalyzing || files.length === 0}
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl text-xl shadow-xl hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
          >
            {isAnalyzing ? `جاري التحليل ${analysisProgress}%...` : 'بدء التحليل'}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-[50px] shadow-2xl overflow-hidden border border-slate-50">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase border-b">
              <tr>
                <th className="px-10 py-6">المرشح</th>
                <th className="px-10 py-6 text-center">نسبة التوافق</th>
                <th className="px-10 py-6 text-center">التصنيف</th>
                <th className="px-10 py-6">ملخص</th>
                <th className="px-10 py-6">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {results.map((res) => (
                <tr key={res.id} className="hover:bg-indigo-50/30 transition-all">
                  <td className="px-10 py-6 font-black text-slate-800">{res.name}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4 justify-center">
                      <span className="text-sm font-black">{res.score}%</span>
                      <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${res.score}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className="px-4 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black">{res.classification}</span>
                  </td>
                  <td className="px-10 py-6 text-xs text-slate-500 font-bold">{res.summary}</td>
                  <td className="px-10 py-6">
                    <button 
                      onClick={() => onSaveCandidate?.({ name: res.name, position: jobDescription.substring(0, 30), score: res.score })}
                      className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg"
                      title="حفظ في لوحة التوظيف"
                    >
                      <Icon name="user-plus" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
