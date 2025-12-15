import { gql } from '@apollo/client';

export const GET_ORG_PROJECTS = gql`
  query GetOrgProjects($orgSlug: String!) {
    organizationProjects(orgSlug: $orgSlug) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTaskCount
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!, $description: String, $organizationSlug: String!, $dueDate: Date) {
    createProject(name: $name, description: $description, organizationSlug: $organizationSlug, dueDate: $dueDate) {
      project {
        id
        name
        status
        dueDate
      }
    }
  }
`;

export const GET_PROJECT_DETAILS = gql`
  query GetProjectDetails($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      tasks {
        id
        title
        description
        status
        assigneeEmail
        dueDate
        comments {
          id
          content
          authorEmail
          createdAt
        }
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($projectId: ID!, $title: String!, $description: String, $assigneeEmail: String, $dueDate: Date) {
    createTask(projectId: $projectId, title: $title, description: $description, assigneeEmail: $assigneeEmail, dueDate: $dueDate) {
      task {
        id
        title
        status
      }
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      task {
        id
        status
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($taskId: ID!, $content: String!, $authorEmail: String!) {
    addComment(taskId: $taskId, content: $content, authorEmail: $authorEmail) {
      comment {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
`;

export const GET_ALL_ORGS = gql`
  query GetAllOrgs {
    allOrganizations {
      id
      name
      slug
    }
  }
`;

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($name: String!, $email: String) {
    createOrganization(name: $name, email: $email) {
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $name: String, $description: String, $status: String, $dueDate: Date) {
    updateProject(id: $id, name: $name, description: $description, status: $status, dueDate: $dueDate) {
      project {
        id
        name
        description
        status
        dueDate
      }
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      success
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String, $description: String, $assigneeEmail: String, $dueDate: Date) {
    updateTask(id: $id, title: $title, description: $description, assigneeEmail: $assigneeEmail, dueDate: $dueDate) {
      task {
        id
        title
        description
        assigneeEmail
        dueDate
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      success
      id
    }
  }
`;