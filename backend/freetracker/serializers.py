import os
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Client, Project, Transcript

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name']


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class PasswordResetSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name', 'email', 'phone', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        client = Client(**validated_data)
        client.save()
        return client

    def delete(self, instance):
        instance.delete()
        return instance


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'client', 'title', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        project = Project(**validated_data)
        project.save()
        return project

    def delete(self, instance):
        instance.delete()
        return instance


class TranscriptSerializer(serializers.ModelSerializer):
    filename = serializers.SerializerMethodField()

    class Meta:
        model = Transcript
        fields = ['id', 'project', 'file', 'filename', 'text_extract', 'processing_status', 'uploaded_at']
        read_only_fields = ['id', 'processing_status', 'uploaded_at']

    def get_filename(self, obj):
        return os.path.basename(obj.file.name)