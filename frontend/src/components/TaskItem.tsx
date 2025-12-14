import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { UPDATE_TASK_STATUS, ADD_COMMENT } from '../graphql/queries';
import type { Task } from '../types';

interface Props {
  task: Task;
}

const TaskItem: React.FC<Props> = ({ task }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [updateStatus] = useMutation(UPDATE_TASK_STATUS);
  const [addComment] = useMutation(ADD_COMMENT);

  // Generate initials for avatar
  const getInitials = (email: string) => email ? email.substring(0, 2).toUpperCase() : 'UN';

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateStatus({ variables: { taskId: task.id, status: e.target.value } });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment({
      variables: { taskId: task.id, content: newComment, authorEmail: 'user@techcorp.com' },
      update: (cache, { data: { addComment } }) => {
        cache.modify({
          id: cache.identify(task),
          fields: {
            comments(existing = []) {
              const newRef = cache.writeFragment({
                data: addComment.comment,
                fragment: gql`fragment NewComment on TaskCommentType { id content authorEmail createdAt }`
              });
              return [...existing, newRef];
            }
          }
        });
      }
    });
    setNewComment('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow mb-3 group">
      
      {/* Header with Title and Status */}
      <div className="flex justify-between items-start gap-2 mb-3">
        <h4 className="font-semibold text-slate-800 text-sm leading-tight">{task.title}</h4>
      </div>

      {/* Footer with Avatar and Controls */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
        <div className="flex items-center gap-2">
          {task.assigneeEmail && (
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center border border-blue-200" title={task.assigneeEmail}>
              {getInitials(task.assigneeEmail)}
            </div>
          )}
          {!task.assigneeEmail && (
            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <select 
            value={task.status} 
            onChange={handleStatusChange}
            className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 hover:bg-white cursor-pointer"
          >
             <option value="TODO">To Do</option>
             <option value="IN_PROGRESS">In Prog</option>
             <option value="DONE">Done</option>
          </select>
          
          <button 
             onClick={() => setShowComments(!showComments)}
             className="text-slate-400 hover:text-blue-600 transition-colors"
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 animate-fadeIn">
          <div className="space-y-3 mb-3 max-h-40 overflow-y-auto custom-scrollbar">
            {task.comments?.length === 0 && <p className="text-xs text-slate-400 italic">No comments yet.</p>}
            {task.comments?.map((comment: any) => (
              <div key={comment.id} className="text-xs">
                <span className="font-bold text-slate-700 block mb-0.5">{comment.authorEmail.split('@')[0]}</span> 
                <span className="text-slate-600">{comment.content}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Reply..." 
              className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 outline-none"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <button type="submit" className="text-xs bg-blue-600 text-white px-2.5 rounded hover:bg-blue-700 font-medium">Post</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskItem;