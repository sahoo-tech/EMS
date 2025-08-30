// Application Data and State Management
class TaskManager {
    constructor() {
        this.currentUser = null;
        this.token = localStorage.getItem('token');
        this.tasks = [];
        this.users = [];
        this.categories = [];
        this.stats = {};
        this.currentTaskId = null;
    }

    // Initialize the application
    init() {
        console.log('TaskManager initializing...');
        this.loadSampleData();
        this.setupEventListeners();
        
        if (this.token && this.validateToken()) {
            this.showMainApp();
            this.loadDashboard();
        } else {
            this.showLoginPage();
        }
    }

    // Load sample data
    loadSampleData() {
        this.stats = {
            "total_tasks": 47,
            "pending_tasks": 15,
            "in_progress_tasks": 18,
            "completed_tasks": 12,
            "overdue_tasks": 8,
            "tasks_by_priority": {
                "low": 8,
                "medium": 22,
                "high": 13,
                "urgent": 4
            },
            "tasks_by_category": {
                "Development": 18,
                "Design": 12,
                "Testing": 9,
                "Documentation": 5,
                "Bug Fixes": 3
            }
        };

        this.currentUser = {
            "id": 1,
            "username": "john_doe",
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "full_name": "John Doe"
        };

        this.tasks = [
            {
                "id": 1,
                "title": "Implement user authentication",
                "status": "in_progress",
                "priority": "high",
                "due_date": "2025-09-15T14:00:00Z",
                "category": {"id": 1, "name": "Development", "color": "#007bff"},
                "assigned_to": {"id": 2, "username": "jane_smith", "full_name": "Jane Smith"},
                "created_by": {"id": 1, "username": "john_doe", "full_name": "John Doe"},
                "created_at": "2025-08-25T09:00:00Z",
                "is_overdue": false
            },
            {
                "id": 2,
                "title": "Design landing page mockups",
                "status": "pending",
                "priority": "medium",
                "due_date": "2025-09-10T17:00:00Z",
                "category": {"id": 2, "name": "Design", "color": "#28a745"},
                "assigned_to": {"id": 3, "username": "mike_wilson", "full_name": "Mike Wilson"},
                "created_by": {"id": 1, "username": "john_doe", "full_name": "John Doe"},
                "created_at": "2025-08-28T11:15:00Z",
                "is_overdue": true
            },
            {
                "id": 3,
                "title": "Fix login bug on mobile",
                "status": "completed",
                "priority": "urgent",
                "due_date": "2025-08-30T12:00:00Z",
                "category": {"id": 5, "name": "Bug Fixes", "color": "#dc3545"},
                "assigned_to": {"id": 4, "username": "sarah_chen", "full_name": "Sarah Chen"},
                "created_by": {"id": 6, "username": "alice_brown", "full_name": "Alice Brown"},
                "created_at": "2025-08-26T14:30:00Z",
                "is_overdue": false
            },
            {
                "id": 4,
                "title": "Write API documentation",
                "status": "pending",
                "priority": "low",
                "due_date": "2025-09-20T16:00:00Z",
                "category": {"id": 4, "name": "Documentation", "color": "#6c757d"},
                "assigned_to": {"id": 5, "username": "alex_garcia", "full_name": "Alex Garcia"},
                "created_by": {"id": 2, "username": "jane_smith", "full_name": "Jane Smith"},
                "created_at": "2025-08-27T13:45:00Z",
                "is_overdue": false
            },
            {
                "id": 5,
                "title": "Optimize database queries",
                "status": "in_progress",
                "priority": "medium",
                "due_date": "2025-09-12T10:00:00Z",
                "category": {"id": 1, "name": "Development", "color": "#007bff"},
                "assigned_to": {"id": 1, "username": "john_doe", "full_name": "John Doe"},
                "created_by": {"id": 4, "username": "sarah_chen", "full_name": "Sarah Chen"},
                "created_at": "2025-08-29T08:20:00Z",
                "is_overdue": false
            }
        ];

        this.users = [
            {"id": 1, "username": "john_doe", "full_name": "John Doe"},
            {"id": 2, "username": "jane_smith", "full_name": "Jane Smith"},
            {"id": 3, "username": "mike_wilson", "full_name": "Mike Wilson"},
            {"id": 4, "username": "sarah_chen", "full_name": "Sarah Chen"},
            {"id": 5, "username": "alex_garcia", "full_name": "Alex Garcia"},
            {"id": 6, "username": "alice_brown", "full_name": "Alice Brown"}
        ];

        this.categories = [
            {"id": 1, "name": "Development", "color": "#007bff"},
            {"id": 2, "name": "Design", "color": "#28a745"},
            {"id": 3, "name": "Testing", "color": "#ffc107"},
            {"id": 4, "name": "Documentation", "color": "#6c757d"},
            {"id": 5, "name": "Bug Fixes", "color": "#dc3545"}
        ];
    }

    // Setup event listeners
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            console.log('Login form found, adding event listener');
            loginForm.addEventListener('submit', (e) => {
                console.log('Login form submitted');
                this.handleLogin(e);
            });
        } else {
            console.log('Login form not found');
        }
        
        // Navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // Task management
        const addTaskBtn = document.getElementById('add-task-btn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => this.openTaskModal());
        }
        
        const taskForm = document.getElementById('task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        }
        
        const modalCloseBtn = document.getElementById('modal-close-btn');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => this.closeTaskModal());
        }
        
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeTaskModal());
        }
        
        // Delete confirmation
        const deleteCancelBtn = document.getElementById('delete-cancel-btn');
        if (deleteCancelBtn) {
            deleteCancelBtn.addEventListener('click', () => this.closeDeleteModal());
        }
        
        const deleteConfirmBtn = document.getElementById('delete-confirm-btn');
        if (deleteConfirmBtn) {
            deleteConfirmBtn.addEventListener('click', () => this.confirmDelete());
        }
        
        // Filters
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterTasks());
        }
        
        const priorityFilter = document.getElementById('priority-filter');
        if (priorityFilter) {
            priorityFilter.addEventListener('change', () => this.filterTasks());
        }
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterTasks());
        }
        
        // Modal overlay clicks
        const taskModal = document.getElementById('task-modal');
        if (taskModal) {
            taskModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) this.closeTaskModal();
            });
        }
        
        const deleteModal = document.getElementById('delete-modal');
        if (deleteModal) {
            deleteModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) this.closeDeleteModal();
            });
        }
    }

    // Authentication methods
    handleLogin(e) {
        console.log('handleLogin called');
        e.preventDefault();
        
        const usernameEl = document.getElementById('username');
        const passwordEl = document.getElementById('password');
        const errorEl = document.getElementById('login-error');
        
        if (!usernameEl || !passwordEl) {
            console.log('Username or password fields not found');
            return;
        }
        
        const username = usernameEl.value;
        const password = passwordEl.value;
        
        console.log('Login attempt:', username);

        // Mock authentication
        if (username === 'john_doe' && password === 'password123') {
            console.log('Login successful');
            this.token = 'mock-jwt-token-' + Date.now();
            localStorage.setItem('token', this.token);
            
            if (errorEl) {
                errorEl.classList.add('hidden');
            }
            this.showMainApp();
            this.loadDashboard();
        } else {
            console.log('Login failed');
            if (errorEl) {
                errorEl.textContent = 'Invalid credentials. Use john_doe / password123';
                errorEl.classList.remove('hidden');
            }
        }
    }

    validateToken() {
        return this.token && this.token.startsWith('mock-jwt-token-');
    }

    handleLogout() {
        this.token = null;
        localStorage.removeItem('token');
        this.showLoginPage();
    }

    showLoginPage() {
        const loginPage = document.getElementById('login-page');
        const mainApp = document.getElementById('main-app');
        if (loginPage) loginPage.classList.remove('hidden');
        if (mainApp) mainApp.classList.add('hidden');
    }

    showMainApp() {
        const loginPage = document.getElementById('login-page');
        const mainApp = document.getElementById('main-app');
        if (loginPage) loginPage.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        this.updateUserInfo();
    }

    updateUserInfo() {
        if (this.currentUser) {
            const userNameEl = document.getElementById('user-name');
            const userEmailEl = document.getElementById('user-email');
            const headerUserNameEl = document.getElementById('header-user-name');
            
            if (userNameEl) userNameEl.textContent = this.currentUser.full_name;
            if (userEmailEl) userEmailEl.textContent = this.currentUser.email;
            if (headerUserNameEl) headerUserNameEl.textContent = this.currentUser.first_name;
        }
    }

    // Navigation
    handleNavigation(e) {
        e.preventDefault();
        const page = e.target.dataset.page;
        
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show page
        if (page === 'dashboard') {
            this.showDashboard();
        } else if (page === 'tasks') {
            this.showTasksPage();
        }
    }

    showDashboard() {
        const pageTitle = document.getElementById('page-title');
        const dashboardPage = document.getElementById('dashboard-page');
        const tasksPage = document.getElementById('tasks-page');
        
        if (pageTitle) pageTitle.textContent = 'Dashboard';
        if (dashboardPage) dashboardPage.classList.remove('hidden');
        if (tasksPage) tasksPage.classList.add('hidden');
        this.loadDashboard();
    }

    showTasksPage() {
        const pageTitle = document.getElementById('page-title');
        const dashboardPage = document.getElementById('dashboard-page');
        const tasksPage = document.getElementById('tasks-page');
        
        if (pageTitle) pageTitle.textContent = 'Tasks';
        if (dashboardPage) dashboardPage.classList.add('hidden');
        if (tasksPage) tasksPage.classList.remove('hidden');
        this.loadTasks();
    }

    // Dashboard methods
    loadDashboard() {
        this.updateStatistics();
        this.loadRecentTasks();
        // Delay chart initialization to ensure DOM is ready
        setTimeout(() => this.initializeCharts(), 200);
    }

    updateStatistics() {
        const elements = {
            'total-tasks': this.stats.total_tasks,
            'pending-tasks': this.stats.pending_tasks,
            'in-progress-tasks': this.stats.in_progress_tasks,
            'completed-tasks': this.stats.completed_tasks,
            'overdue-tasks': this.stats.overdue_tasks
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
    }

    loadRecentTasks() {
        const tbody = document.getElementById('recent-tasks-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.tasks.slice(0, 5).forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.title}</td>
                <td><span class="status-badge status-badge--${task.status}">${this.formatStatus(task.status)}</span></td>
                <td><span class="priority-badge priority-badge--${task.priority}">${this.formatPriority(task.priority)}</span></td>
                <td class="${task.is_overdue ? 'due-date overdue' : 'due-date'}">${this.formatDate(task.due_date)}</td>
                <td>${task.assigned_to.full_name}</td>
            `;
            tbody.appendChild(row);
        });
    }

    initializeCharts() {
        console.log('Initializing charts...');
        this.initStatusChart();
        this.initPriorityChart();
        this.initCategoryChart();
    }

    initStatusChart() {
        const canvas = document.getElementById('status-chart');
        if (!canvas) {
            console.log('Status chart canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'In Progress', 'Completed'],
                datasets: [{
                    data: [this.stats.pending_tasks, this.stats.in_progress_tasks, this.stats.completed_tasks],
                    backgroundColor: ['#FFC185', '#1FB8CD', '#B4413C']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    initPriorityChart() {
        const canvas = document.getElementById('priority-chart');
        if (!canvas) {
            console.log('Priority chart canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Low', 'Medium', 'High', 'Urgent'],
                datasets: [{
                    label: 'Tasks',
                    data: [
                        this.stats.tasks_by_priority.low,
                        this.stats.tasks_by_priority.medium,
                        this.stats.tasks_by_priority.high,
                        this.stats.tasks_by_priority.urgent
                    ],
                    backgroundColor: ['#ECEBD5', '#FFC185', '#5D878F', '#DB4545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    initCategoryChart() {
        const canvas = document.getElementById('category-chart');
        if (!canvas) {
            console.log('Category chart canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(this.stats.tasks_by_category),
                datasets: [{
                    label: 'Tasks',
                    data: Object.values(this.stats.tasks_by_category),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Tasks page methods
    loadTasks() {
        this.renderTasks(this.tasks);
    }

    renderTasks(tasks) {
        const container = document.getElementById('tasks-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (tasks.length === 0) {
            container.innerHTML = '<div class="card"><div class="card__body">No tasks found.</div></div>';
            return;
        }
        
        tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = `card task-card category-${task.category.name.toLowerCase().replace(' ', '-')}`;
            
            taskCard.innerHTML = `
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <div class="task-actions">
                        <button class="btn btn--icon btn--edit" onclick="taskManager.editTask(${task.id})" title="Edit Task">✏️</button>
                        <button class="btn btn--icon btn--delete" onclick="taskManager.deleteTask(${task.id})" title="Delete Task">🗑️</button>
                    </div>
                </div>
                <div class="task-meta">
                    <div class="task-meta-item">
                        <span class="task-meta-label">Status</span>
                        <span class="task-meta-value">
                            <span class="status-badge status-badge--${task.status}">${this.formatStatus(task.status)}</span>
                        </span>
                    </div>
                    <div class="task-meta-item">
                        <span class="task-meta-label">Priority</span>
                        <span class="task-meta-value">
                            <span class="priority-badge priority-badge--${task.priority}">${this.formatPriority(task.priority)}</span>
                        </span>
                    </div>
                    <div class="task-meta-item">
                        <span class="task-meta-label">Due Date</span>
                        <span class="task-meta-value ${task.is_overdue ? 'due-date overdue' : 'due-date'}">${this.formatDate(task.due_date)}</span>
                    </div>
                    <div class="task-meta-item">
                        <span class="task-meta-label">Category</span>
                        <span class="task-meta-value">${task.category.name}</span>
                    </div>
                    <div class="task-meta-item">
                        <span class="task-meta-label">Assigned To</span>
                        <span class="task-meta-value">${task.assigned_to.full_name}</span>
                    </div>
                    <div class="task-meta-item">
                        <span class="task-meta-label">Created By</span>
                        <span class="task-meta-value">${task.created_by.full_name}</span>
                    </div>
                </div>
            `;
            
            container.appendChild(taskCard);
        });
    }

    filterTasks() {
        const statusFilter = document.getElementById('status-filter');
        const priorityFilter = document.getElementById('priority-filter');
        const searchInput = document.getElementById('search-input');
        
        const statusValue = statusFilter ? statusFilter.value : '';
        const priorityValue = priorityFilter ? priorityFilter.value : '';
        const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
        
        let filteredTasks = this.tasks;
        
        if (statusValue) {
            filteredTasks = filteredTasks.filter(task => task.status === statusValue);
        }
        
        if (priorityValue) {
            filteredTasks = filteredTasks.filter(task => task.priority === priorityValue);
        }
        
        if (searchValue) {
            filteredTasks = filteredTasks.filter(task => 
                task.title.toLowerCase().includes(searchValue) ||
                task.category.name.toLowerCase().includes(searchValue) ||
                task.assigned_to.full_name.toLowerCase().includes(searchValue)
            );
        }
        
        this.renderTasks(filteredTasks);
    }

    // Task modal methods
    openTaskModal(taskId = null) {
        this.currentTaskId = taskId;
        const modal = document.getElementById('task-modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('task-form');
        
        if (!modal || !modalTitle || !form) return;
        
        if (taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            modalTitle.textContent = 'Edit Task';
            this.populateTaskForm(task);
        } else {
            modalTitle.textContent = 'Add Task';
            form.reset();
        }
        
        modal.classList.remove('hidden');
    }

    populateTaskForm(task) {
        const elements = {
            'task-title': task.title,
            'task-status': task.status,
            'task-priority': task.priority,
            'task-due-date': this.formatDateForInput(task.due_date),
            'task-category': task.category.id,
            'task-assigned-to': task.assigned_to.id
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.value = value;
        });
    }

    closeTaskModal() {
        const modal = document.getElementById('task-modal');
        if (modal) modal.classList.add('hidden');
        this.currentTaskId = null;
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        
        const taskData = {
            title: document.getElementById('task-title')?.value || '',
            status: document.getElementById('task-status')?.value || 'pending',
            priority: document.getElementById('task-priority')?.value || 'medium',
            due_date: document.getElementById('task-due-date')?.value || new Date().toISOString(),
            category_id: parseInt(document.getElementById('task-category')?.value || 1),
            assigned_to_id: parseInt(document.getElementById('task-assigned-to')?.value || 1)
        };
        
        if (this.currentTaskId) {
            this.updateTask(this.currentTaskId, taskData);
        } else {
            this.createTask(taskData);
        }
        
        this.closeTaskModal();
        this.loadTasks();
        this.updateStatistics();
    }

    createTask(taskData) {
        const newTask = {
            id: Math.max(...this.tasks.map(t => t.id)) + 1,
            title: taskData.title,
            status: taskData.status,
            priority: taskData.priority,
            due_date: taskData.due_date,
            category: this.categories.find(c => c.id === taskData.category_id),
            assigned_to: this.users.find(u => u.id === taskData.assigned_to_id),
            created_by: this.currentUser,
            created_at: new Date().toISOString(),
            is_overdue: new Date(taskData.due_date) < new Date()
        };
        
        this.tasks.push(newTask);
        this.recalculateStats();
    }

    updateTask(taskId, taskData) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = {
                ...this.tasks[taskIndex],
                title: taskData.title,
                status: taskData.status,
                priority: taskData.priority,
                due_date: taskData.due_date,
                category: this.categories.find(c => c.id === taskData.category_id),
                assigned_to: this.users.find(u => u.id === taskData.assigned_to_id),
                is_overdue: new Date(taskData.due_date) < new Date()
            };
            this.recalculateStats();
        }
    }

    editTask(taskId) {
        this.openTaskModal(taskId);
    }

    deleteTask(taskId) {
        this.currentTaskId = taskId;
        const modal = document.getElementById('delete-modal');
        if (modal) modal.classList.remove('hidden');
    }

    closeDeleteModal() {
        const modal = document.getElementById('delete-modal');
        if (modal) modal.classList.add('hidden');
        this.currentTaskId = null;
    }

    confirmDelete() {
        if (this.currentTaskId) {
            this.tasks = this.tasks.filter(t => t.id !== this.currentTaskId);
            this.recalculateStats();
            this.loadTasks();
            this.closeDeleteModal();
        }
    }

    recalculateStats() {
        this.stats.total_tasks = this.tasks.length;
        this.stats.pending_tasks = this.tasks.filter(t => t.status === 'pending').length;
        this.stats.in_progress_tasks = this.tasks.filter(t => t.status === 'in_progress').length;
        this.stats.completed_tasks = this.tasks.filter(t => t.status === 'completed').length;
        this.stats.overdue_tasks = this.tasks.filter(t => t.is_overdue).length;
        
        // Recalculate priority stats
        this.stats.tasks_by_priority = {
            low: this.tasks.filter(t => t.priority === 'low').length,
            medium: this.tasks.filter(t => t.priority === 'medium').length,
            high: this.tasks.filter(t => t.priority === 'high').length,
            urgent: this.tasks.filter(t => t.priority === 'urgent').length
        };
        
        // Recalculate category stats
        this.stats.tasks_by_category = {};
        this.categories.forEach(cat => {
            this.stats.tasks_by_category[cat.name] = this.tasks.filter(t => t.category.id === cat.id).length;
        });
    }

    // Utility methods
    formatStatus(status) {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    formatPriority(priority) {
        return priority.charAt(0).toUpperCase() + priority.slice(1);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDateForInput(dateString) {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    }
}

// Global variable to make taskManager accessible
let taskManager;

// Initialize the application
function initApp() {
    console.log('DOM ready, initializing application');
    taskManager = new TaskManager();
    taskManager.init();
    // Make taskManager globally accessible for onclick handlers
    window.taskManager = taskManager;
}

// Check if DOM is already loaded, or wait for it to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}