from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task, Category, Comment, Attachment, TaskHistory


class UserSerializer(serializers.ModelSerializer):
    """User serializer for task assignments"""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name']
        read_only_fields = ['id']
    
    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class CategorySerializer(serializers.ModelSerializer):
    """Category serializer"""
    task_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'color', 'task_count', 'created_at']
        read_only_fields = ['id', 'created_at', 'task_count']
    
    def get_task_count(self, obj):
        return obj.task_set.count()


class CommentSerializer(serializers.ModelSerializer):
    """Comment serializer"""
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class AttachmentSerializer(serializers.ModelSerializer):
    """Attachment serializer"""
    uploaded_by = UserSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Attachment
        fields = ['id', 'filename', 'file_size', 'file_url', 'uploaded_by', 'uploaded_at']
        read_only_fields = ['id', 'filename', 'file_size', 'uploaded_by', 'uploaded_at']
    
    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None


class TaskHistorySerializer(serializers.ModelSerializer):
    """Task history serializer"""
    changed_by = UserSerializer(read_only=True)
    
    class Meta:
        model = TaskHistory
        fields = ['id', 'field_name', 'old_value', 'new_value', 'changed_by', 'changed_at']
        read_only_fields = ['id', 'changed_by', 'changed_at']


class TaskListSerializer(serializers.ModelSerializer):
    """Task list serializer (minimal fields)"""
    category = CategorySerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'status', 'priority', 'due_date', 'category',
            'assigned_to', 'created_by', 'created_at', 'updated_at', 'is_overdue'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']


class TaskDetailSerializer(serializers.ModelSerializer):
    """Task detail serializer (all fields)"""
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.IntegerField(write_only=True)
    created_by = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)
    history = TaskHistorySerializer(many=True, read_only=True)
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'due_date',
            'estimated_hours', 'actual_hours', 'category', 'category_id',
            'assigned_to', 'assigned_to_id', 'created_by', 'comments',
            'attachments', 'history', 'created_at', 'updated_at',
            'completed_at', 'is_overdue'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'completed_at']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TaskCreateUpdateSerializer(serializers.ModelSerializer):
    """Task serializer for create/update operations"""
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'due_date',
            'estimated_hours', 'actual_hours', 'category', 'assigned_to'
        ]
        read_only_fields = ['id']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TaskStatsSerializer(serializers.Serializer):
    """Serializer for task statistics"""
    total_tasks = serializers.IntegerField()
    pending_tasks = serializers.IntegerField()
    in_progress_tasks = serializers.IntegerField()
    completed_tasks = serializers.IntegerField()
    overdue_tasks = serializers.IntegerField()
    tasks_by_priority = serializers.DictField()
    tasks_by_category = serializers.DictField()
    completion_rate = serializers.FloatField()
    average_completion_time = serializers.FloatField()