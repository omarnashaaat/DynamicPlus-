import React, { useState, useRef } from 'react';
import { Icon } from './Icon';
import { GoogleGenAI } from "@google/genai";

declare const pdfjsLib: any;
declare const mammoth: any;

interface ATSProps {
    onSaveCandidate: (candidate: any) => void;
}

export const ATS = React.memo(({ onSaveCandidate }: ATSProps) => {
    const [jobDescription, setJobDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prev => [...prev, ...droppedFiles]);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const extractText = async (file: File): Promise<string> => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = async (e: any) => {
                const content = e.target.result;
                if (file.type === 'application/pdf') {
                    try {
                        const pdf = await pdfjsLib.getDocument({ data: content }).promise;
                        let text = '';
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            let lastY: number | undefined, textItems: string[] = [];
                            for (let item of textContent.items) {
                                if (lastY !== undefined && lastY !== item.transform[5]) {
                                    textItems.push('\n');
                                }
                                textItems.push(item.str);
                                lastY = item.transform[5];
                            }
                            text += textItems.join(' ') + ' ';
                        }
                        resolve(text);
                    } catch (err) {
                        reject('خطأ في قراءة ملف PDF');
                    }
                } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    try {
                        const result = await mammoth.extractRawText({ arrayBuffer: content });
                        resolve(result.value);
                    } catch (err) {
                        reject('خطأ في قراءة ملف Word');
                    }
                } else {
                    resolve(new TextDecoder().decode(content));
                }
            };
            if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsText(file);
            }
        });
    };

    const analyzeWithGemini = async (cvText: string, jd: string) => {
        const ai = new GoogleGenAI({ apiKey: (process.env as any).GEMINI_API_KEY });
        
        const prompt = `
            أنت محرك ATS متطور وخبير موارد بشرية. مهمتك هي إجراء مقارنة دقيقة جداً بين الوصف الوظيفي والسيرة الذاتية.
            
            الوصف الوظيفي (المرجع):
            ${jd}
            
            السيرة الذاتية (المصدر):
            ${cvText}
            
            المطلوب هو إرجاع النتيجة بتنسيق JSON فقط كالتالي:
            {
                "score": (رقم من 0 إلى 100 يمثل نسبة التوافق الكلية),
                "skillsScore": (رقم من 0 إلى 100 لتطابق المهارات),
                "contextScore": (رقم من 0 إلى 100 للخبرة والكلمات المفتاحية),
                "formattingScore": (رقم من 0 إلى 100 لجودة التنسيق),
                "summary": (ملخص قصير جداً للمرشح),
                "classification": ("قوي" أو "متوسط" أو "ضعيف"),
                "name": (اسم المرشح من السيرة الذاتية),
                "experience": (سنوات الخبرة المستخلصة، مثال: "5 سنوات"),
                "email": (البريد الإلكتروني إن وجد),
                "phone": (رقم الهاتف إن وجد),
                "foundKeywords": [قائمة بالكلمات المفتاحية التي تم العثور عليها فعلياً في السيرة الذاتية بناءً على الوصف الوظيفي],
                "missingKeywords": [قائمة بالكلمات المفتاحية الجوهرية المطلوبة في الوصف الوظيفي وغير موجودة تماماً في السيرة الذاتية],
                "recommendations": [قائمة بنصائح محددة للمرشح لتحسين سيرته الذاتية لهذا المنصب]
            }
        `;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [{ parts: [{ text: prompt }] }],
                config: { responseMimeType: "application/json" }
            });
            
            const textResponse = response.text;
            if (textResponse) {
                return JSON.parse(textResponse);
            }
            throw new Error('فشل في تحليل الرد');
        } catch (err) {
            console.error(err);
            return { 
                score: 0, 
                skillsScore: 0, 
                contextScore: 0, 
                formattingScore: 0, 
                summary: 'خطأ في التحليل', 
                classification: 'غير معروف', 
                name: 'غير معروف',
                experience: 'غير متوفر',
                email: 'غير متوفر',
                phone: 'غير متوفر',
                foundKeywords: [],
                missingKeywords: [],
                recommendations: []
            };
        }
    };

    const [selectedResult, setSelectedResult] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const saveCandidate = async (res: any) => {
        setIsSaving(true);
        try {
            const newCandidate = {
                id: res.id.toString(),
                name: res.name,
                role: jobDescription.substring(0, 50),
                experience: res.experience || 'غير محدد',
                email: res.email,
                phone: res.phone,
                status: 'applied',
                priority: res.score > 70 ? 'عالية' : 'متوسطة',
                score: res.score,
                createdAt: Date.now(),
                notes: res.summary
            };
            
            onSaveCandidate(newCandidate);
            alert('تم حفظ المرشح بنجاح');
        } catch (err) {
            console.error(err);
            alert('فشل في حفظ المرشح');
        } finally {
            setIsSaving(false);
        }
    };

    const startAnalysis = async () => {
        if (!jobDescription || files.length === 0) {
            alert('يرجى إدخال الوصف الوظيفي ورفع الملفات أولاً');
            return;
        }

        setIsAnalyzing(true);
        setResults([]);
        setAnalysisProgress(0);

        const newResults: any[] = [];
        for (let i = 0; i < files.length; i++) {
            try {
                const text = await extractText(files[i]);
                const analysis = await analyzeWithGemini(text, jobDescription);
                newResults.push({
                    ...analysis,
                    fileName: files[i].name,
                    id: Date.now() + i
                });
                setAnalysisProgress(((i + 1) / files.length) * 100);
            } catch (err) {
                console.error(err);
            }
        }
        setResults(newResults);
        setIsAnalyzing(false);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-4">
                        <Icon name="file-text" size={18} className="text-indigo-600" />
                        <h3 className="font-black text-slate-800">الوصف الوظيفي</h3>
                    </div>
                    <textarea 
                        className="w-full h-64 p-6 rounded-[40px] border border-slate-200 outline-none font-bold text-slate-700 bg-white shadow-sm focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none"
                        placeholder="الصق متطلبات الوظيفة هنا..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-4">
                        <Icon name="upload-cloud" size={18} className="text-indigo-600" />
                        <h3 className="font-black text-slate-800">رفع السير الذاتية</h3>
                    </div>
                    <div 
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-64 border-4 border-dashed border-slate-100 rounded-[40px] bg-white flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                    >
                        <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx,.txt" />
                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-indigo-400 transition-all">
                            <Icon name="upload" size={32} />
                        </div>
                        <div className="text-center">
                            <p className="font-black text-slate-600">اسحب الملفات هنا أو اضغط للاختيار</p>
                            <p className="text-xs font-bold text-slate-400">يدعم PDF, DOCX, TXT</p>
                        </div>
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-black text-slate-800 flex items-center gap-2">
                            <Icon name="files" size={18} />
                            الملفات المختارة ({files.length})
                        </h4>
                        <button onClick={() => setFiles([])} className="text-rose-500 font-black text-xs hover:underline">مسح الكل</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {files.map((file, i) => (
                            <div key={i} className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-3">
                                <Icon name="file" size={14} className="text-indigo-500" />
                                <span className="text-xs font-bold text-slate-600">{file.name}</span>
                                <button onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, idx) => idx !== i)); }} className="text-slate-300 hover:text-rose-500 transition-colors">
                                    <Icon name="x" size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8">
                        <button 
                            onClick={startAnalysis}
                            disabled={isAnalyzing}
                            className={`w-full py-4 rounded-full font-black text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${isAnalyzing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
                                    جاري التحليل... {Math.round(analysisProgress)}%
                                </>
                            ) : (
                                <>
                                    <Icon name="zap" size={20} />
                                    بدء الفحص الذكي
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {results.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-800">نتائج التحليل</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">ترتيب حسب:</span>
                            <select className="bg-white border border-slate-100 rounded-xl px-3 py-1.5 text-xs font-bold outline-none">
                                <option>الأعلى تقييماً</option>
                                <option>الأحدث</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((res) => (
                            <div key={res.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                                <div className="p-6 border-b border-slate-50 flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${
                                            res.score >= 80 ? 'bg-emerald-50 text-emerald-600' :
                                            res.score >= 60 ? 'bg-amber-50 text-amber-600' :
                                            'bg-rose-50 text-rose-600'
                                        }`}>
                                            {res.score}%
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800">{res.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{res.classification}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedResult(res)} className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                        <Icon name="maximize-2" size={18} />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <p className="text-xs font-bold text-slate-500 line-clamp-2 leading-relaxed">{res.summary}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {res.foundKeywords.slice(0, 3).map((kw: string, i: number) => (
                                            <span key={i} className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-1 rounded-lg">#{kw}</span>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => saveCandidate(res)}
                                        className="w-full bg-slate-50 text-slate-600 font-black py-3 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-sm flex items-center justify-center gap-2"
                                    >
                                        <Icon name="user-plus" size={16} />
                                        حفظ في قاعدة البيانات
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedResult && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[50px] shadow-2xl overflow-hidden flex flex-col animate-scale-in">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                    <Icon name="user" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800">{selectedResult.name}</h3>
                                    <p className="text-sm font-bold text-slate-400">{selectedResult.fileName}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedResult(null)} className="p-3 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all">
                                <Icon name="x" size={24} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'التقييم العام', value: selectedResult.score, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                    { label: 'تطابق المهارات', value: selectedResult.skillsScore, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { label: 'الكلمات المفتاحية', value: selectedResult.contextScore, color: 'text-amber-600', bg: 'bg-amber-50' },
                                    { label: 'جودة التنسيق', value: selectedResult.formattingScore, color: 'text-purple-600', bg: 'bg-purple-50' }
                                ].map((stat, i) => (
                                    <div key={i} className={`${stat.bg} p-4 rounded-3xl border border-white shadow-sm`}>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{stat.label}</p>
                                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}%</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <section>
                                        <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2">
                                            <Icon name="check-circle" size={18} className="text-emerald-500" />
                                            المهارات الموجودة
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedResult.foundKeywords.map((kw: string, i: number) => (
                                                <span key={i} className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-100">{kw}</span>
                                            ))}
                                        </div>
                                    </section>
                                    <section>
                                        <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2">
                                            <Icon name="alert-circle" size={18} className="text-rose-500" />
                                            المهارات المفقودة
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedResult.missingKeywords.map((kw: string, i: number) => (
                                                <span key={i} className="bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-100">{kw}</span>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                                <div className="space-y-6">
                                    <section>
                                        <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2">
                                            <Icon name="lightbulb" size={18} className="text-amber-500" />
                                            توصيات التحسين
                                        </h4>
                                        <ul className="space-y-3">
                                            {selectedResult.recommendations.map((rec: string, i: number) => (
                                                <li key={i} className="bg-slate-50 p-4 rounded-2xl text-xs font-bold text-slate-600 leading-relaxed border border-slate-100">
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
                            <button onClick={() => setSelectedResult(null)} className="px-8 py-3 rounded-full font-black text-slate-500 hover:bg-slate-100 transition-all">إغلاق</button>
                            <button 
                                onClick={() => saveCandidate(selectedResult)}
                                disabled={isSaving}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-full font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                            >
                                {isSaving ? 'جاري الحفظ...' : 'حفظ المرشح'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});
