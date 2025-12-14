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

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateStatus({
      variables: { taskId: task.id, status: e.target.value }
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    addComment({
      variables: { 
        taskId: task.id, 
        content: newComment, 
        authorEmail: 'user@techcorp.com' // Hardcoded user for demo
      },
      // Optimistic update to show comment instantly
      update: (cache, { data: { addComment } }) => {
        cache.modify({
          id: cache.identify(task),
          fields: {
            comments(existingComments = []) {
              const newCommentRef = cache.writeFragment({
                data: addComment.comment,
                fragment: gql`
                  fragment NewComment on TaskCommentType {
                    id
                    content
                    authorEmail
                    createdAt
                  }
                `
              });
              return [...existingComments, newCommentRef];
            }
          }
        });
      }
    });
    setNewComment('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-800">{task.title}</h4>
        <select 
          value={task.status} 
          onChange={handleStatusChange}
          className="text-xs border rounded p-1 bg-gray-50 cursor-pointer"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
      
      {task.assigneeEmail && (
        <div className="text-xs text-gray-500 mb-2">Assigned to: {task.assigneeEmail}</div>
      )}

      <div className="border-t pt-2 mt-2">
        <button 
          onClick={() => setShowComments(!showComments)}
          className="text-xs text-blue-600 hover:underline"
        >
          {showComments ? 'Hide Comments' : `Show Comments (${task.comments?.length || 0})`}
        </button>

        {showComments && (
          <div className="mt-3 space-y-2">
            {task.comments?.map((comment: any) => (
              <div key={comment.id} className="bg-gray-50 p-2 rounded text-xs border border-gray-100">
                <span className="font-bold text-gray-700 block">{comment.authorEmail}</span> 
                {comment.content}
              </div>
            ))}
            <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
              <input 
                type="text" 
                placeholder="Write a comment..." 
                className="flex-1 text-xs border rounded p-1"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <button type="submit" className="text-xs bg-blue-600 text-white px-2 rounded hover:bg-blue-700">Post</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;