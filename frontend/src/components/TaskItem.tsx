import React, { useState } from 'react';
import { useMutation} from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  UPDATE_TASK_STATUS,
  ADD_COMMENT,
  DELETE_TASK,
} from '../graphql/queries';
import type { Task } from '../types';
import EditTaskModal from './EditTaskModal';
import { MdDeleteForever } from "react-icons/md";
import { FaRegComments } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";

interface Props {
  task: Task;
}

const TaskItem: React.FC<Props> = ({ task }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [updateStatus] = useMutation(UPDATE_TASK_STATUS);
  const [addComment] = useMutation(ADD_COMMENT);

  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache, { data }) {
      if (data?.deleteTask?.success) {
        const normalizedId = cache.identify({
          id: task.id,
          __typename: 'TaskType',
        });
        cache.evict({ id: normalizedId });
        cache.gc();
      }
    },
  });

  // Generate initials for avatar
  const getInitials = (email: string) =>
    email ? email.substring(0, 2).toUpperCase() : 'UN';

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateStatus({
      variables: { taskId: task.id, status: e.target.value },
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addComment({
      variables: {
        taskId: task.id,
        content: newComment,
        authorEmail: 'user@techcorp.com',
      },
      update: (cache, { data }) => {
        cache.modify({
          id: cache.identify(task),
          fields: {
            comments(existing = []) {
              const newRef = cache.writeFragment({
                data: data.addComment.comment,
                fragment: gql`
                  fragment NewComment on TaskCommentType {
                    id
                    content
                    authorEmail
                    createdAt
                  }
                `,
              });
              return [...existing, newRef];
            },
          },
        });
      },
    });

    setNewComment('');
  };

  const handleDelete = () => {
    if (window.confirm('Delete this task?')) {
      deleteTask({ variables: { id: task.id } });
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow mb-3 group relative">
        
        {/* Edit / Delete (hover only) */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
          <button
            onClick={() => setIsEditOpen(true)}
            className="text-slate-700 hover:text-blue-600 p-1 text-xl"
            title="Edit Task"
          >
            <FaRegEdit />
          </button>
          <button
            onClick={handleDelete}
            className=" text-slate-700 hover:text-red-600 p-1 text-xl"
            title="Delete Task"
          >
            <MdDeleteForever />
          </button>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start gap-2 mb-3 pr-10">
          <h4 className="font-semibold text-slate-800 text-sm leading-tight">
            {task.title}
          </h4>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
          <div className="flex items-center gap-2">
            {task.assigneeEmail ? (
              <div
                className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center border border-blue-200"
                title={task.assigneeEmail}
              >
                {getInitials(task.assigneeEmail)}
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={task.status}
              onChange={handleStatusChange}
              className="
    text-xs font-semibold uppercase tracking-wide
    text-slate-600 bg-white
    border border-slate-300
    rounded-md px-2.5 py-1
    shadow-sm
    hover:border-slate-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    cursor-pointer
  "
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Prog</option>
              <option value="DONE">Done</option>
            </select>

            <button
              onClick={() => setShowComments(!showComments)}
              className="text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <FaRegComments />
            </button>
          </div>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 animate-fadeIn">
            <div className="space-y-3 mb-3 max-h-40 overflow-y-auto custom-scrollbar">
              {task.comments?.length === 0 && (
                <p className="text-xs text-slate-400 italic">
                  No comments yet.
                </p>
              )}
              {task.comments?.map((comment: any) => (
                <div key={comment.id} className="text-xs">
                  <span className="font-bold text-slate-700 block mb-0.5">
                    {comment.authorEmail.split('@')[0]}
                  </span>
                  <span className="text-slate-600">
                    {comment.content}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Reply..."
                className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 outline-none"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className="text-xs bg-blue-600 text-white px-2.5 rounded hover:bg-blue-700 font-medium"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>

      <EditTaskModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        task={task}
      />
    </>
  );
};

export default TaskItem;
