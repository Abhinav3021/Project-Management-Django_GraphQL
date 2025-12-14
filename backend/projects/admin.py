from django.contrib import admin
from .models import Organization, Project, Task, TaskComment

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'contact_email')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'organization', 'status', 'due_date')
    list_filter = ('organization', 'status')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'status', 'assignee_email')
    list_filter = ('project', 'status')

admin.site.register(TaskComment)