from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Q, Count, Avg
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Task, Category, Comment, Attachment
from .serializers import (
    TaskListSerializer, TaskDetailSerializer, TaskCreateUpdateSerializer,
    CategorySerializer, CommentSerializer, AttachmentSerializer,
    TaskStatsSerializer, UserSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    """Category CRUD operations"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class TaskViewSet(viewsets.ModelViewSet):
    """Task CRUD operations with advanced filtering and statistics"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Task.objects.all().select_related(
            'category', 'assigned_to', 'created_by'
        ).prefetch_related('comments', 'attachments')
        
        # Apply filters
        status_filter = self.request.query_params.get('status')
        priority_filter = self.request.query_params.get('priority')
        category_filter = self.request.query_params.get('category')
        assigned_to_filter = self.request.query_params.get('assigned_to')
        search = self.request.query_params.get('search')
        overdue = self.request.query_params.get('overdue')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        if category_filter:
            queryset = queryset.filter(category_id=category_filter)
        if assigned_to_filter:
            queryset = queryset.filter(assigned_to_id=assigned_to_filter)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
        if overdue and overdue.lower() == 'true':
            queryset = queryset.filter(
                due_date__lt=timezone.now(),
                status__in=['pending', 'in_progress']
            )
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TaskListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return TaskCreateUpdateSerializer
        return TaskDetailSerializer
    
    @swagger_auto_schema(
        method='get',
        responses={200: TaskStatsSerializer}
    )
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get task statistics"""
        queryset = self.get_queryset()
        
        stats = {
            'total_tasks': queryset.count(),
            'pending_tasks': queryset.filter(status='pending').count(),
            'in_progress_tasks': queryset.filter(status='in_progress').count(),
            'completed_tasks': queryset.filter(status='completed').count(),
            'overdue_tasks': queryset.filter(
                due_date__lt=timezone.now(),
                status__in=['pending', 'in_progress']
            ).count(),
        }
        
        # Tasks by priority
        priority_stats = queryset.values('priority').annotate(
            count=Count('id')
        ).order_by('priority')
        stats['tasks_by_priority'] = {
            item['priority']: item['count'] for item in priority_stats
        }
        
        # Tasks by category
        category_stats = queryset.values('category__name').annotate(
            count=Count('id')
        ).order_by('category__name')
        stats['tasks_by_category'] = {
            item['category__name'] or 'Uncategorized': item['count'] 
            for item in category_stats
        }
        
        # Completion rate
        completed = stats['completed_tasks']
        total = stats['total_tasks']
        stats['completion_rate'] = (completed / total * 100) if total > 0 else 0
        
        # Average completion time (in days)
        completed_tasks = queryset.filter(
            status='completed',
            completed_at__isnull=False
        ).exclude(created_at__isnull=True)
        
        if completed_tasks.exists():
            avg_completion = completed_tasks.aggregate(
                avg_time=Avg('completed_at') - Avg('created_at')
            )
            # Convert to days
            stats['average_completion_time'] = avg_completion['avg_time'].days if avg_completion['avg_time'] else 0
        else:
            stats['average_completion_time'] = 0
        
        serializer = TaskStatsSerializer(stats)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        method='post',
        request_body=CommentSerializer,
        responses={201: CommentSerializer}
    )
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """Add a comment to a task"""
        task = self.get_object()
        serializer = CommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(task=task)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        method='post',
        request_body=AttachmentSerializer,
        responses={201: AttachmentSerializer}
    )
    @action(detail=True, methods=['post'])
    def add_attachment(self, request, pk=None):
        """Add an attachment to a task"""
        task = self.get_object()
        file = request.FILES.get('file')
        
        if not file:
            return Response(
                {'error': 'No file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        attachment = Attachment.objects.create(
            task=task,
            uploaded_by=request.user,
            file=file,
            filename=file.name,
            file_size=file.size
        )
        
        serializer = AttachmentSerializer(attachment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        """Get tasks assigned to current user"""
        queryset = self.get_queryset().filter(assigned_to=request.user)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """User list for task assignments"""
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]