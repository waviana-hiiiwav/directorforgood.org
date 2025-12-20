'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Save, RotateCcw, Eye, Loader2, Plus, Trash2, 
  ChevronDown, ChevronRight, ChevronUp, ImageIcon, Upload, Undo2, Redo2,
  Sparkles, X, Send, History, Clock, RotateCw, Command
} from 'lucide-react';
import { DeckContent, SlideContent, SlideImage, defaultSlideOrder } from '@/lib/deck-content';

const MAX_HISTORY = 50;

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  proposedContent?: DeckContent;
  changes?: string[];
  applied?: boolean;
}

interface DeckVersionSummary {
  id: number;
  description: string | null;
  createdBy: number | null;
  createdAt: string;
}

function DeckEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('slug') || 'director';

  const [content, setContent] = useState<DeckContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSlides, setExpandedSlides] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  
  // Undo/Redo state
  const [history, setHistory] = useState<DeckContent[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedo = useRef(false);

  // Chat panel state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Command bar state
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Version history state
  const [showHistory, setShowHistory] = useState(false);
  const [versions, setVersions] = useState<DeckVersionSummary[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [previewVersion, setPreviewVersion] = useState<DeckContent | null>(null);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/deck-content?slug=${slug}`);
      const data = await response.json();
      setContent(data);
      setHistory([data]);
      setHistoryIndex(0);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedo.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
      setHasChanges(true);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedo.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
      setHasChanges(true);
    }
  }, [historyIndex, history]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandBar(true);
        setTimeout(() => commandInputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setShowCommandBar(false);
        setShowChat(false);
        setShowHistory(false);
        setPreviewVersion(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, undo, redo]);

  const pushToHistory = useCallback((newContent: DeckContent) => {
    if (isUndoRedo.current) {
      isUndoRedo.current = false;
      return;
    }
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newContent);
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [historyIndex]);

  const saveContent = async (description?: string) => {
    if (!content) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/deck-content?slug=${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, description }),
      });
      if (response.ok) {
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const resetContent = async () => {
    if (!confirm('Reset all content to defaults? This cannot be undone.')) return;
    try {
      const response = await fetch(`/api/deck-content?slug=${slug}`, { method: 'DELETE' });
      const data = await response.json();
      setContent(data);
      setHistory([data]);
      setHistoryIndex(0);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to reset content:', error);
    }
  };

  // UI state helpers
  const toggleSlide = (slideId: string) => {
    const newExpanded = new Set(expandedSlides);
    if (newExpanded.has(slideId)) {
      newExpanded.delete(slideId);
    } else {
      newExpanded.add(slideId);
    }
    setExpandedSlides(newExpanded);
  };

  const updateCover = (field: keyof DeckContent['cover'], value: string) => {
    if (!content) return;
    const newContent = { ...content, cover: { ...content.cover, [field]: value } };
    setContent(newContent);
    pushToHistory(newContent);
    setHasChanges(true);
  };

  const updateSlide = (index: number, updates: Partial<SlideContent>) => {
    if (!content) return;
    const newSlides = [...content.slides];
    newSlides[index] = { ...newSlides[index], ...updates };
    const newContent = { ...content, slides: newSlides };
    setContent(newContent);
    pushToHistory(newContent);
    setHasChanges(true);
  };

  const updateSlideSection = (slideIndex: number, sectionIndex: number, updates: Partial<NonNullable<SlideContent['sections']>[0]>) => {
    if (!content) return;
    const newSlides = [...content.slides];
    const newSections = [...(newSlides[slideIndex].sections || [])];
    newSections[sectionIndex] = { ...newSections[sectionIndex], ...updates };
    newSlides[slideIndex] = { ...newSlides[slideIndex], sections: newSections };
    const newContent = { ...content, slides: newSlides };
    setContent(newContent);
    pushToHistory(newContent);
    setHasChanges(true);
  };

  const updateSectionItems = (slideIndex: number, sectionIndex: number, items: string[]) => {
    updateSlideSection(slideIndex, sectionIndex, { items });
  };

  const addSectionItem = (slideIndex: number, sectionIndex: number) => {
    if (!content) return;
    const currentItems = content.slides[slideIndex].sections?.[sectionIndex]?.items || [];
    updateSectionItems(slideIndex, sectionIndex, [...currentItems, '']);
  };

  const removeSectionItem = (slideIndex: number, sectionIndex: number, itemIndex: number) => {
    if (!content) return;
    const currentItems = content.slides[slideIndex].sections?.[sectionIndex]?.items || [];
    updateSectionItems(slideIndex, sectionIndex, currentItems.filter((_, i) => i !== itemIndex));
  };

  const updateAsk = (field: 'amount' | 'items', value: string | string[]) => {
    if (!content) return;
    const newContent = { ...content, ask: { ...content.ask, [field]: value } };
    setContent(newContent);
    pushToHistory(newContent);
    setHasChanges(true);
  };

  const moveSlide = (slideId: string, direction: 'up' | 'down') => {
    if (!content) return;
    const currentOrder = content.slideOrder || defaultSlideOrder;
    const index = currentOrder.indexOf(slideId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentOrder.length - 1) return;
    const newOrder = [...currentOrder];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
    const newContent = { ...content, slideOrder: newOrder };
    setContent(newContent);
    pushToHistory(newContent);
    setHasChanges(true);
  };

  const updateSlideImage = (slideIndex: number, image: SlideImage | undefined) => {
    if (!content) return;
    const newSlides = [...content.slides];
    newSlides[slideIndex] = { ...newSlides[slideIndex], image };
    const newContent = { ...content, slides: newSlides };
    setContent(newContent);
    pushToHistory(newContent);
    setHasChanges(true);
  };

  const removeSlideImage = (slideIndex: number) => {
    if (!content) return;
    const currentImage = content.slides[slideIndex]?.image;
    if (currentImage) {
      updateSlideImage(slideIndex, { ...currentImage, url: undefined });
    }
  };

  const handleImageUpload = async (slideIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const currentImage = content?.slides[slideIndex]?.image;
      updateSlideImage(slideIndex, {
        ...currentImage,
        type: currentImage?.type || 'infographic',
        url: reader.result as string,
        placeholder: currentImage?.placeholder,
      });
    };
    reader.readAsDataURL(file);
  };

  // AI Chat functions
  const sendChatMessage = async (message: string) => {
    if (!message.trim() || !content) return;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/deck/ai-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruction: message, currentContent: content }),
      });
      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.success ? `${data.description}\n\nChanges:\n${data.changes?.map((c: string) => `• ${c}`).join('\n') || 'Content updated'}` : `Sorry: ${data.error}`,
        timestamp: new Date(),
        proposedContent: data.success ? data.content : undefined,
        changes: data.changes,
        applied: false,
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setChatMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Error processing request.', timestamp: new Date() }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyProposedChanges = (messageId: string) => {
    const message = chatMessages.find(m => m.id === messageId);
    if (!message?.proposedContent) return;
    setContent(message.proposedContent);
    pushToHistory(message.proposedContent);
    setHasChanges(true);
    setChatMessages(prev => prev.map(m => m.id === messageId ? { ...m, applied: true } : m));
  };

  const fetchVersions = async () => {
    setIsLoadingVersions(true);
    try {
      const response = await fetch('/api/deck-content/versions');
      const data = await response.json();
      setVersions(data);
    } catch (error) {
      console.error('Failed to fetch versions:', error);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const previewVersionContent = async (versionId: number) => {
    try {
      const response = await fetch(`/api/deck-content/versions/${versionId}`);
      const data = await response.json();
      setPreviewVersion(data.content);
    } catch (error) {
      console.error('Failed to fetch version:', error);
    }
  };

  const restoreVersion = async (versionId: number) => {
    if (!confirm('Restore this version?')) return;
    try {
      const response = await fetch(`/api/deck-content/versions/${versionId}/restore`, { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setContent(data.content);
        setHistory([data.content]);
        setHistoryIndex(0);
        setHasChanges(false);
        setPreviewVersion(null);
        setShowHistory(false);
      }
    } catch (error) {
      console.error('Failed to restore version:', error);
    }
  };

  const getOrderedSlides = () => {
    if (!content) return [];
    const order = content.slideOrder || defaultSlideOrder;
    const slideMap = new Map(content.slides.map(s => [s.id, s]));
    const ordered = order.map(id => slideMap.get(id)).filter((s): s is SlideContent => s !== undefined);
    const orderedIds = new Set(order);
    const remaining = content.slides.filter(s => !orderedIds.has(s.id));
    return [...ordered, ...remaining];
  };

  if (isLoading) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!content) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center"><p>Failed to load content</p></div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">Edit Deck: {slug.toUpperCase()}</h1>
              <div className="flex gap-2 mt-1">
                <button 
                  onClick={() => router.push('/admin/deck?slug=director')}
                  className={`text-xs px-2 py-0.5 rounded ${slug === 'director' ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                  Director
                </button>
                <button 
                  onClick={() => router.push('/admin/deck?slug=otw')}
                  className={`text-xs px-2 py-0.5 rounded ${slug === 'otw' ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                  OTW
                </button>
              </div>
            </div>
            {hasChanges && <span className="text-xs bg-yellow-600 px-2 py-1 rounded">Unsaved changes</span>}
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={undo} disabled={historyIndex <= 0} variant="outline" size="sm" className="border-gray-700 text-gray-300"><Undo2 className="w-4 h-4" /></Button>
            <Button onClick={redo} disabled={historyIndex >= history.length - 1} variant="outline" size="sm" className="border-gray-700 text-gray-300"><Redo2 className="w-4 h-4" /></Button>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            <Button onClick={() => setShowChat(true)} variant="outline" size="sm" className="border-gray-700 text-gray-300"><Sparkles className="w-4 h-4" /></Button>
            <Button onClick={resetContent} variant="outline" size="sm" className="border-gray-700 text-gray-300"><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
            <Link href={`/decks/${slug}`} target="_blank"><Button variant="outline" size="sm" className="border-gray-700 text-gray-300"><Eye className="w-4 h-4 mr-2" />Preview</Button></Link>
            <Button onClick={() => saveContent()} disabled={isSaving || !hasChanges} size="sm" className="bg-white text-black hover:bg-gray-200">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save
            </Button>
          </div>
        </div>
      </div>

      <div className={`container px-4 py-8 max-w-4xl transition-all ${showChat ? 'mr-96' : ''}`}>
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Slides</h2>
          <div className="bg-gray-900 rounded-lg overflow-hidden mb-2">
            <button onClick={() => toggleSlide('cover')} className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800 transition-colors">
              <span className="font-medium">1. Cover Slide</span>
              {expandedSlides.has('cover') ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSlides.has('cover') && (
              <div className="px-4 pb-4 space-y-4 border-t border-gray-800 pt-4">
                <div><label className="block text-sm text-gray-400 mb-1">Title</label><input type="text" value={content.cover.title} onChange={(e) => updateCover('title', e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Tagline</label><textarea value={content.cover.tagline} onChange={(e) => updateCover('tagline', e.target.value)} rows={2} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Subtagline</label><input type="text" value={content.cover.subtagline} onChange={(e) => updateCover('subtagline', e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" /></div>
              </div>
            )}
          </div>

          {getOrderedSlides().map((slide, orderIndex) => {
            const originalIndex = content.slides.findIndex(s => s.id === slide.id);
            const currentOrder = content.slideOrder || defaultSlideOrder;
            return (
              <div key={slide.id} className="bg-gray-900 rounded-lg overflow-hidden mb-2">
                <div className="flex items-center">
                  <div className="flex flex-col border-r border-gray-800">
                    <button onClick={() => moveSlide(slide.id, 'up')} disabled={currentOrder.indexOf(slide.id) === 0} className="px-2 py-1 text-gray-400 hover:text-white disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => moveSlide(slide.id, 'down')} disabled={currentOrder.indexOf(slide.id) === currentOrder.length - 1} className="px-2 py-1 text-gray-400 hover:text-white disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                  </div>
                  <button onClick={() => toggleSlide(slide.id)} className="flex-1 px-4 py-3 flex items-center justify-between hover:bg-gray-800 transition-colors">
                    <span className="font-medium">{orderIndex + 2}. {slide.title}</span>
                    {expandedSlides.has(slide.id) ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
                {expandedSlides.has(slide.id) && (
                  <div className="px-4 pb-4 space-y-4 border-t border-gray-800 pt-4">
                    <div><label className="block text-sm text-gray-400 mb-1">Title</label><input type="text" value={slide.title} onChange={(e) => updateSlide(originalIndex, { title: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" /></div>
                    {slide.sections?.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="bg-gray-800 rounded p-3 space-y-3">
                        <input type="text" value={section.heading || ''} onChange={(e) => updateSlideSection(originalIndex, sectionIndex, { heading: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white" placeholder="Heading" />
                        {section.items && (
                          <div className="space-y-1">
                            {section.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex gap-2">
                                <input type="text" value={item} onChange={(e) => {
                                  const newItems = [...section.items!];
                                  newItems[itemIndex] = e.target.value;
                                  updateSectionItems(originalIndex, sectionIndex, newItems);
                                }} className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white" />
                                <button onClick={() => removeSectionItem(originalIndex, sectionIndex, itemIndex)} className="text-red-400"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            ))}
                            <button onClick={() => addSectionItem(originalIndex, sectionIndex)} className="text-xs text-gray-400 flex items-center gap-1"><Plus className="w-3 h-3" /> Add item</button>
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Image */}
                    <div className="border-t border-gray-700 pt-4">
                      {slide.image?.url ? (
                        <div className="relative w-full h-32 bg-gray-800 rounded overflow-hidden">
                          <img src={slide.image.url} className="w-full h-full object-contain" alt="" />
                          <button onClick={() => removeSlideImage(originalIndex)} className="absolute top-1 right-1 bg-red-600 p-1 rounded"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <div className="border border-dashed border-gray-700 rounded p-4 text-center">
                          <p className="text-xs text-gray-500 mb-2">{slide.image?.placeholder || 'No image'}</p>
                          <label className="cursor-pointer bg-gray-800 px-2 py-1 rounded text-xs"><Upload className="w-3 h-3 inline mr-1" />Upload<input type="file" onChange={(e) => handleImageUpload(originalIndex, e)} className="hidden" /></label>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>

      {/* AI Chat Panel */}
      {showChat && (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-gray-900 border-l border-gray-700 z-40 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h3 className="font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" />AI Assistant</h3>
            <button onClick={() => setShowChat(false)} className="text-gray-400"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {chatMessages.map(message => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded px-3 py-2 text-sm ${message.role === 'user' ? 'bg-purple-600' : 'bg-gray-800'}`}>
                  {message.content}
                  {message.proposedContent && !message.applied && <Button size="sm" onClick={() => applyProposedChanges(message.id)} className="mt-2 block bg-green-600">Apply</Button>}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-700 flex gap-2">
            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChatMessage(chatInput)} placeholder="Describe changes..." className="flex-1 bg-gray-800 rounded px-3 py-2 text-sm" />
            <Button size="sm" onClick={() => sendChatMessage(chatInput)} disabled={isAiLoading}><Send className="w-4 h-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeckEditorPage() {
  return <Suspense fallback={<div>Loading...</div>}><DeckEditorContent /></Suspense>;
}
