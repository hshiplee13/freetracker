from django.contrib import admin

from .models import Client, Project, Transcript

admin.site.register(Client)
admin.site.register(Project)
admin.site.register(Transcript)