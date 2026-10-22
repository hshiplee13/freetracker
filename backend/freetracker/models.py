import uuid
from django.db import models, transaction
from django.contrib.auth.models import User
from django.db.models.signals import post_delete
from django.dispatch import receiver


class Client(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clients')
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        DELAYED = 'delayed', 'Delayed'
        COMPLETED = 'completed', 'Completed'
        ARCHIVED = 'archived', 'Archived'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='project')
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


def transcriptPath(instance, filename):
    return f'transcripts/{instance.project.id}/{filename}'

class Transcript(models.Model):
    class ProcessingStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PROCESSING = 'processing', 'Processing'
        COMPLETE = 'complete', 'Complete'
        FAILED = 'failed', 'Failed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='transcripts')
    file = models.FileField(upload_to=transcriptPath)
    text_extract = models.TextField(blank=True)
    processing_status = models.CharField(max_length=20, choices=ProcessingStatus.choices, default=ProcessingStatus.PENDING)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Transcript for {self.project}'

@receiver(post_delete, sender=Transcript)
def cleanup(sender, instance, **kwargs):
    transaction.on_commit(lambda: instance.file.delete(save=False))