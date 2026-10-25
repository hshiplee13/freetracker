import os
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from dotenv import load_dotenv
import quopri

load_dotenv()

from .models import Client, Project, Transcript
from .serializers import UserSerializer, SignUpSerializer, PasswordResetSerializer, ClientSerializer, ProjectSerializer, TranscriptSerializer

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
        if User.objects.filter(email__iexact=request.data.get('email')).exists() or User.objects.filter(username__iexact=request.data.get('username')).exists():
            return Response({'error': 'Account already exists'}, status=status.HTTP_400_BAD_REQUEST)
        else:
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


class ResetEmailView(APIView):
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
                f'To reset your password, please visit \n{verification_link}'
            )
            html_message = (
                '<p>To reset your password, please click </p>'
                f'<a href="{verification_link}">here</a>'
            )
            send_mail(subject, message, os.environ['EMAIL_HOST'], [user.email], fail_silently=False, auth_user=None, auth_password=None, connection=None, html_message=html_message)
        return Response("If the email is correct, we've sent a reset link")


class PasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetSerializer

    def post(self, request, *args, **kwargs):
        uid = self.kwargs['uid']
        d_uid = force_str(urlsafe_base64_decode(uid))
        user = User.objects.filter(pk=d_uid).first()

        token = self.kwargs['token']
        if user is not None and default_token_generator.check_token(user, token):
            new_password = request.data.get('password', None)

            if new_password is None:
                return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                user.set_password(new_password)
                user.save()
                return Response("If the email is correct, we've sent a reset link")
        else: 
            return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)



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