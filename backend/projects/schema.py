from django.utils.text import slugify
import graphene
from graphene_django import DjangoObjectType
from .models import Organization, Project, Task, TaskComment

# 1. Define Types (Mapping Models to GraphQL)
class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = "__all__"

class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = "__all__"
    
    # Add extra field for task counts (Basic Statistics requirement)
    task_count = graphene.Int()
    completed_task_count = graphene.Int()

    def resolve_task_count(self, info):
        return self.tasks.count()

    def resolve_completed_task_count(self, info):
        return self.tasks.filter(status='DONE').count()

class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = "__all__"

class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = "__all__"

class CreateOrganization(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        email = graphene.String()

    organization = graphene.Field(OrganizationType)

    def mutate(self, info, name, email=None):
        # Auto-generate slug from name (e.g., "My Startup" -> "my-startup")
        slug = slugify(name)

        # Check if slug exists to prevent crash (simple logic for now)
        if Organization.objects.filter(slug=slug).exists():
            raise Exception("An organization with a similar name already exists.")

        org = Organization.objects.create(
            name=name, 
            slug=slug, 
            contact_email=email
        )
        return CreateOrganization(organization=org)

# 2. Define Mutations (Create/Update Operations)

class CreateProject(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()
        organization_slug = graphene.String(required=True)
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)

    def mutate(self, info, name, organization_slug, description=None, due_date=None):
        try:
            org = Organization.objects.get(slug=organization_slug)
            project = Project.objects.create(
                name=name,
                organization=org,
                description=description,
                due_date=due_date
            )
            return CreateProject(project=project)
        except Organization.DoesNotExist:
            raise Exception("Organization not found")

class CreateTask(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.Date()

    task = graphene.Field(TaskType)

    def mutate(self, info, project_id, title, description="", assignee_email="", due_date=None):
        try:
            project = Project.objects.get(pk=project_id)
            task = Task.objects.create(
                project=project,
                title=title,
                description=description,
                assignee_email=assignee_email,
                due_date=due_date
            )
            return CreateTask(task=task)
        except Project.DoesNotExist:
            raise Exception("Project not found")

class UpdateTaskStatus(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        status = graphene.String(required=True)

    task = graphene.Field(TaskType)

    def mutate(self, info, task_id, status):
        try:
            task = Task.objects.get(pk=task_id)
            task.status = status
            task.save()
            return UpdateTaskStatus(task=task)
        except Task.DoesNotExist:
            raise Exception("Task not found")

class AddComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    comment = graphene.Field(TaskCommentType)

    def mutate(self, info, task_id, content, author_email):
        try:
            task = Task.objects.get(pk=task_id)
            comment = TaskComment.objects.create(
                task=task,
                content=content,
                author_email=author_email
            )
            return AddComment(comment=comment)
        except Task.DoesNotExist:
            raise Exception("Task not found")

# 3. Define Queries (Reading Data)

class Query(graphene.ObjectType):
    # Fetch all projects for a specific organization (Multi-tenancy enforcement)
    organization_projects = graphene.List(ProjectType, org_slug=graphene.String(required=True))
    all_organizations = graphene.List(OrganizationType)
    # Fetch details of a single project
    project = graphene.Field(ProjectType, id=graphene.ID(required=True))

    def resolve_organization_projects(self, info, org_slug):
        # This enforces data isolation. You must provide a valid slug to see projects.
        return Project.objects.filter(organization__slug=org_slug)
    def resolve_all_organizations(self, info):
        return Organization.objects.all()
    

    def resolve_project(self, info, id):
        return Project.objects.get(pk=id)

class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    create_task = CreateTask.Field()
    update_task_status = UpdateTaskStatus.Field()
    add_comment = AddComment.Field()
    create_organization = CreateOrganization.Field()