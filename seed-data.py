from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import random
from faker import Faker

from apps.tasks.models import Task, Category, Comment

fake = Faker()

class Command(BaseCommand):
    help = 'Seed database with sample data for development and testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--mode',
            type=str,
            default='create',
            help='Mode: create, clear, or refresh'
        )
        parser.add_argument(
            '--users',
            type=int,
            default=10,
            help='Number of users to create'
        )
        parser.add_argument(
            '--categories',
            type=int,
            default=5,
            help='Number of categories to create'
        )
        parser.add_argument(
            '--tasks',
            type=int,
            default=50,
            help='Number of tasks to create'
        )

    def handle(self, *args, **options):
        mode = options['mode']
        
        if mode == 'clear':
            self.clear_data()
            self.stdout.write(self.style.SUCCESS('Database cleared successfully'))
            return
        
        if mode == 'refresh':
            self.clear_data()
            self.stdout.write(self.style.SUCCESS('Database cleared'))
        
        self.create_users(options['users'])
        self.create_categories(options['categories'])
        self.create_tasks(options['tasks'])
        
        self.stdout.write(self.style.SUCCESS('Database seeded successfully'))

    def clear_data(self):
        """Clear all sample data"""
        self.stdout.write('Clearing existing data...')
        
        # Clear tasks and related data
        Task.objects.all().delete()
        Category.objects.all().delete()
        Comment.objects.all().delete()
        
        # Clear users except superusers
        User.objects.filter(is_superuser=False).delete()
        
        self.stdout.write('Data cleared')

    def create_users(self, count):
        """Create sample users"""
        self.stdout.write(f'Creating {count} users...')
        
        users = []
        for i in range(count):
            username = fake.user_name()
            # Ensure unique username
            while User.objects.filter(username=username).exists():
                username = fake.user_name()
            
            user = User.objects.create_user(
                username=username,
                email=fake.email(),
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                password='testpass123'
            )
            users.append(user)
        
        self.stdout.write(f'Created {len(users)} users')
        return users

    def create_categories(self, count):
        """Create sample categories"""
        self.stdout.write(f'Creating {count} categories...')
        
        category_names = [
            'Development', 'Design', 'Testing', 'Documentation', 'Marketing',
            'Research', 'Planning', 'Bug Fixes', 'Feature Request', 'Maintenance'
        ]
        
        colors = [
            '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
            '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6c757d'
        ]
        
        categories = []
        for i in range(min(count, len(category_names))):
            category = Category.objects.create(
                name=category_names[i],
                description=fake.text(max_nb_chars=200),
                color=colors[i % len(colors)]
            )
            categories.append(category)
        
        self.stdout.write(f'Created {len(categories)} categories')
        return categories

    def create_tasks(self, count):
        """Create sample tasks"""
        self.stdout.write(f'Creating {count} tasks...')
        
        users = list(User.objects.all())
        categories = list(Category.objects.all())
        
        if not users:
            self.stdout.write(self.style.ERROR('No users found. Create users first.'))
            return
        
        task_titles = [
            'Implement user authentication',
            'Design landing page',
            'Fix login bug',
            'Write API documentation',
            'Optimize database queries',
            'Create unit tests',
            'Update user interface',
            'Add search functionality',
            'Implement email notifications',
            'Create admin dashboard',
            'Fix responsive design issues',
            'Add data validation',
            'Implement file upload',
            'Create backup system',
            'Update security measures',
            'Add analytics tracking',
            'Implement caching',
            'Create mobile app',
            'Update documentation',
            'Fix performance issues'
        ]
        
        priorities = ['low', 'medium', 'high', 'urgent']
        statuses = ['pending', 'in_progress', 'completed', 'cancelled']
        
        tasks = []
        for i in range(count):
            # Random task title with some variety
            title = random.choice(task_titles)
            if i > len(task_titles):
                title = f"{title} #{i}"
            
            # Random due date (some past, some future)
            due_date = fake.date_time_between(
                start_date='-30d',
                end_date='+60d',
                tzinfo=timezone.get_current_timezone()
            )
            
            # Random status with weighted distribution
            status = random.choices(
                statuses,
                weights=[40, 30, 25, 5],  # More pending/in_progress than completed/cancelled
                k=1
            )[0]
            
            task = Task.objects.create(
                title=title,
                description=fake.text(max_nb_chars=500),
                category=random.choice(categories) if categories else None,
                assigned_to=random.choice(users),
                created_by=random.choice(users),
                priority=random.choice(priorities),
                status=status,
                due_date=due_date,
                estimated_hours=random.randint(1, 40),
                actual_hours=random.randint(1, 45) if status == 'completed' else None
            )
            
            # Set completed_at for completed tasks
            if status == 'completed':
                task.completed_at = fake.date_time_between(
                    start_date=task.created_at,
                    end_date='now',
                    tzinfo=timezone.get_current_timezone()
                )
                task.save()
            
            # Add random comments to some tasks
            if random.random() < 0.6:  # 60% chance of having comments
                comment_count = random.randint(1, 5)
                for _ in range(comment_count):
                    Comment.objects.create(
                        task=task,
                        author=random.choice(users),
                        content=fake.text(max_nb_chars=300)
                    )
            
            tasks.append(task)
        
        self.stdout.write(f'Created {len(tasks)} tasks')
        
        # Create some task history entries
        self.stdout.write('Sample data created successfully!')
        self.stdout.write('')
        self.stdout.write('Sample login credentials:')
        self.stdout.write('Username: any of the created users')
        self.stdout.write('Password: testpass123')
        
        return tasks