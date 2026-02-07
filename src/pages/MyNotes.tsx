import { FileText, Plus, Search, Calendar, Tag, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { useAppContext, Note } from '../contexts/AppContext';
import { useLayout } from '../contexts/LayoutContext';
import NoteDetailModal from '../components/NoteDetailModal';

export default function MyNotes() {
  const { notes, removeNote } = useAppContext();
  const { setDraggedItem, isChatOpen } = useLayout();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-display text-5xl text-orange-600 mb-2">MY NOTES</h1>
        <p className="text-neutral-400 text-sm">
          我的投研笔记 · {notes.length} 篇笔记
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索笔记标题、内容或标签..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-orange-600 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap">
          <Plus className="w-4 h-4" />
          新建笔记
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note, index) => {
          const handleDragStart = (e: React.DragEvent) => {
            setDraggedItem({
              type: 'note',
              id: note.id,
              title: note.title,
              summary: note.content.substring(0, 100),
            });
            e.dataTransfer.effectAllowed = 'copy';
          };

          const handleDragEnd = () => {
            setDraggedItem(null);
          };

          return (
            <div
              key={note.id}
              draggable={isChatOpen}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onClick={() => setSelectedNote(note)}
              className={`bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-orange-600 transition-all duration-200 cursor-pointer group animate-in fade-in slide-in-from-bottom-4 relative ${
                isChatOpen ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {isChatOpen && (
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-neutral-500" />
                </div>
              )}
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded flex items-center justify-center flex-shrink-0 text-white">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {note.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Calendar className="w-3 h-3" />
                  {note.updatedAt}
                </div>
              </div>
            </div>

            {/* Content Preview */}
            <p className="text-sm text-neutral-400 mb-4 line-clamp-3">
              {note.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {note.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <span>{note.relatedSignals} 条关联信号</span>
              <span className="text-orange-600 group-hover:text-orange-500 font-semibold transition-colors">
                查看详情 →
              </span>
            </div>
          </div>
          );
        })}
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <NoteDetailModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onEdit={() => {
            setSelectedNote(null);
            alert('编辑功能开发中，敬请期待');
          }}
          onDelete={(noteId) => {
            removeNote(noteId);
          }}
        />
      )}

      {filteredNotes.length === 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-neutral-400 text-lg mb-2">
            {searchQuery ? '没有找到匹配的笔记' : '还没有创建任何笔记'}
          </p>
          <p className="text-neutral-500 text-sm mb-6">
            {searchQuery ? '尝试使用其他关键词搜索' : '开始记录你的投研思考和分析'}
          </p>
          {!searchQuery && (
            <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded font-semibold transition-colors">
              创建第一篇笔记
            </button>
          )}
        </div>
      )}
    </div>
  );
}
