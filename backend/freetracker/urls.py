from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

router = DefaultRouter()
router.register(r'clients', views.ClientView, basename='client')
router.register(r'projects', views.ProjectView, basename='project')
router.register(r'transcripts', views.TranscriptView, basename='transcript')

urlpatterns = [
    path('auth/signup/', views.SignUpView.as_view(), name='signup'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('reset/', views.PasswordResetView.as_view(), name='reset'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.MewView.as_view(), name='me'),
    path('clients/onboard/', views.CreateClient.as_view(), name='create-client'),
    path('clients/<uuid:client_id>/delete/', views.DeleteClient.as_view(), name='delet-client'),
    path('projects/create/', views.CreateProject.as_view(), name='create-project'),
    path('projects/<uuid:project_id>/delete/', views.DeleteProject.as_view(), name='delete-project'),
    path('transcripts/upload/', views.CreateTranscript.as_view(), name='upload-transcript'),
    path('transcripts/<uuid:transcript_id>/delete/', views.DeleteTranscript.as_view(), name='delete-transcript'),
    path('', include(router.urls)),
]