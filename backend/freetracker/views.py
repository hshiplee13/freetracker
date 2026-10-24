import os
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from dotenv import load_dotenv

load_dotenv()

from .models import Client, Project, Transcript
from .serializers import UserSerializer, SignUpSerializer, ClientSerializer, ProjectSerializer, TranscriptSerializer

User = get_user_model()


class MewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class SignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignUpSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        )


class PasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', None)

        if email is None:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if user is not None:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            verification_link = f"{os.environ['EMAIL_VERIFICATION_URL']}/{uid}/{token}/"

            subject = 'Password Reset Link'
            message =(
                'To reset your password, please '
                f'<a href="{verification_link}">here</a>'
            )
            send_mail(subject, message, os.environ['EMAIL_HOST'], [user.email])
        return Response("If the email is correct, we've sent a reset link")


class ClientView(viewsets.ModelViewSet):
    serializer_class = ClientSerializer

    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)


class CreateClient(generics.CreateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        client = serializer.save(user=request.user)
        return Response(ClientSerializer(client).data)


class DeleteClient(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'client_id'

    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)


class ProjectView(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)


class CreateProject(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project = serializer.save(user=request.user)
        return Response(ProjectSerializer(project).data)


class DeleteProject(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'project_id'

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)


class TranscriptView(viewsets.ModelViewSet):
    serializer_class = TranscriptSerializer

    def get_queryset(self):
        project = self.request.query_params.get('project', 'default')

        return Transcript.objects.filter(project=project).filter(project__user=self.request.user)


class CreateTranscript(generics.CreateAPIView):
    queryset = Transcript.objects.all()
    serializer_class = TranscriptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project = serializer.validated_data['project']
        if project.user != request.user:
            raise PermissionDenied("You don't own this project.")

        transcript = serializer.save()
        return Response(self.get_serializer(transcript).data)


class DeleteTranscript(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'transcript_id'

    def get_queryset(self):
        return Transcript.objects.filter(project__user=self.request.user)

    def perform_destroy(self, instance):
        instance.file.delete(save=False)
        instance.delete()