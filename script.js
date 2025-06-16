// Data storage simulation (dalam aplikasi nyata, ini akan menggunakan database)
let tasks = [];
let taskIdCounter = 1;

// Local Storage Keys
const STORAGE_KEYS = {
    TASKS: 'ajax_todo_tasks',
    COUNTER: 'ajax_todo_counter'
};

// Load data dari localStorage
function loadFromStorage() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
        const savedCounter = localStorage.getItem(STORAGE_KEYS.COUNTER);
        
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
        
        if (savedCounter) {
            taskIdCounter = parseInt(savedCounter);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        showNotification('Gagal memuat data tersimpan', true);
    }
}

// Save data ke localStorage
function saveToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        localStorage.setItem(STORAGE_KEYS.COUNTER, taskIdCounter.toString());
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showNotification('Gagal menyimpan data', true);
    }
}

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksContainer = document.getElementById('tasksContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const emptyState = document.getElementById('emptyState');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notificationMessage');

// Statistics elements
const totalTasksElement = document.getElementById('totalTasks');
const completedTasksElement = document.getElementById('completedTasks');
const pendingTasksElement = document.getElementById('pendingTasks');

// Button elements
const addBtnText = document.getElementById('addBtnText');
const addBtnLoader = document.getElementById('addBtnLoader');

// Initialize aplikasi
document.addEventListener('DOMContentLoaded', function() {
    // Load data dari localStorage terlebih dahulu
    loadFromStorage();
    
    // Kemudian load tasks (yang akan menggunakan data dari localStorage)
    loadTasks();
    
    // Event listener untuk input Enter
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

// Fungsi untuk menampilkan loading
function showLoading() {
    loadingIndicator.classList.remove('hidden');
    tasksContainer.classList.add('hidden');
    emptyState.classList.add('hidden');
}

// Fungsi untuk menyembunyikan loading
function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, isError = false) {
    notificationMessage.textContent = message;
    notification.classList.remove('hidden');
    
    if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    
    // Auto hide setelah 3 detik
    setTimeout(() => {
        hideNotification();
    }, 3000);
}

// Fungsi untuk menyembunyikan notifikasi
function hideNotification() {
    notification.classList.add('hidden');
}

// Simulasi AJAX request untuk memuat tugas
function loadTasks() {
    showLoading();
    
    // Simulasi delay jaringan
    setTimeout(() => {
        try {
            // Simulasi pengambilan data dari server
            // Dalam kasus ini, data sudah dimuat dari localStorage
            const response = simulateServerResponse('GET', '/api/tasks');
            
            if (response.success) {
                // Data sudah ada di variabel tasks dari localStorage
                renderTasks();
                updateStats();
                hideLoading();
                
                if (tasks.length === 0) {
                    emptyState.classList.remove('hidden');
                } else {
                    tasksContainer.classList.remove('hidden');
                }
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            hideLoading();
            showNotification('Gagal memuat tugas: ' + error.message, true);
        }
    }, 800);
}

// Fungsi untuk menambah tugas baru
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        showNotification('Mohon masukkan teks tugas!', true);
        taskInput.focus();
        return;
    }
    
    // Disable button dan show loading
    addTaskBtn.disabled = true;
    addBtnText.classList.add('hidden');
    addBtnLoader.classList.remove('hidden');
    
    // Simulasi AJAX request
    setTimeout(() => {
        try {
            const newTask = {
                id: taskIdCounter++,
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            // Simulasi pengiriman ke server
            const response = simulateServerResponse('POST', '/api/tasks', newTask);
              if (response.success) {
                tasks.push(newTask);
                taskInput.value = '';
                
                // Simpan ke localStorage
                saveToStorage();
                
                renderTasks();
                updateStats();
                
                if (tasks.length === 1) {
                    emptyState.classList.add('hidden');
                    tasksContainer.classList.remove('hidden');
                }
                
                showNotification('Tugas berhasil ditambahkan!');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            showNotification('Gagal menambah tugas: ' + error.message, true);
        } finally {
            // Re-enable button
            addTaskBtn.disabled = false;
            addBtnText.classList.remove('hidden');
            addBtnLoader.classList.add('hidden');
        }
    }, 600);
}

// Fungsi untuk mengubah status tugas
function toggleTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
        showNotification('Tugas tidak ditemukan!', true);
        return;
    }
    
    // Simulasi AJAX request
    setTimeout(() => {
        try {
            const updatedTask = {
                ...tasks[taskIndex],
                completed: !tasks[taskIndex].completed
            };
            
            // Simulasi pengiriman ke server
            const response = simulateServerResponse('PUT', `/api/tasks/${taskId}`, updatedTask);
              if (response.success) {
                tasks[taskIndex] = updatedTask;
                
                // Simpan ke localStorage
                saveToStorage();
                
                renderTasks();
                updateStats();
                
                const status = updatedTask.completed ? 'selesai' : 'pending';
                showNotification(`Tugas berhasil diubah menjadi ${status}!`);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            showNotification('Gagal mengubah status tugas: ' + error.message, true);
            // Revert checkbox state
            const checkbox = document.querySelector(`input[data-task-id="${taskId}"]`);
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
            }
        }
    }, 300);
}

// Fungsi untuk menghapus tugas
function deleteTask(taskId) {
    if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
        return;
    }
    
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
        showNotification('Tugas tidak ditemukan!', true);
        return;
    }
    
    // Simulasi AJAX request
    setTimeout(() => {
        try {
            // Simulasi pengiriman ke server
            const response = simulateServerResponse('DELETE', `/api/tasks/${taskId}`);
              if (response.success) {
                tasks.splice(taskIndex, 1);
                
                // Simpan ke localStorage
                saveToStorage();
                
                renderTasks();
                updateStats();
                
                if (tasks.length === 0) {
                    tasksContainer.classList.add('hidden');
                    emptyState.classList.remove('hidden');
                }
                
                showNotification('Tugas berhasil dihapus!');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            showNotification('Gagal menghapus tugas: ' + error.message, true);
        }
    }, 400);
}

// Fungsi untuk menghapus semua data
function clearAllTasks() {
    if (!confirm('Apakah Anda yakin ingin menghapus SEMUA tugas? Tindakan ini tidak dapat dibatalkan!')) {
        return;
    }
    
    // Simulasi AJAX request
    setTimeout(() => {
        try {
            // Clear data dari memori
            tasks = [];
            taskIdCounter = 1;
            
            // Clear data dari localStorage
            localStorage.removeItem(STORAGE_KEYS.TASKS);
            localStorage.removeItem(STORAGE_KEYS.COUNTER);
            
            // Update UI
            renderTasks();
            updateStats();
            
            tasksContainer.classList.add('hidden');
            emptyState.classList.remove('hidden');
            
            showNotification('Semua tugas berhasil dihapus!');
        } catch (error) {
            showNotification('Gagal menghapus semua tugas: ' + error.message, true);
        }
    }, 300);
}

// Fungsi untuk render tugas ke DOM
function renderTasks() {
    tasksContainer.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskElement.innerHTML = `
            <div class="task-content">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    data-task-id="${task.id}"
                    onchange="toggleTask(${task.id})"
                >
                <span class="task-text">${escapeHtml(task.text)}</span>
            </div>
            <div class="task-actions">
                <button class="btn-delete" onclick="deleteTask(${task.id})">
                    🗑️ Hapus
                </button>
            </div>
        `;
        
        tasksContainer.appendChild(taskElement);
    });
}

// Fungsi untuk update statistik
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    // Animate number changes
    animateNumber(totalTasksElement, parseInt(totalTasksElement.textContent), totalTasks);
    animateNumber(completedTasksElement, parseInt(completedTasksElement.textContent), completedTasks);
    animateNumber(pendingTasksElement, parseInt(pendingTasksElement.textContent), pendingTasks);
}

// Fungsi untuk animasi angka
function animateNumber(element, start, end) {
    const duration = 500;
    const range = end - start;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (range * easeOut));
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Simulasi server response
function simulateServerResponse(method, url, data = null) {
    // Simulasi kemungkinan error (5% chance)
    if (Math.random() < 0.05) {
        return {
            success: false,
            message: 'Server tidak dapat diakses. Silakan coba lagi.'
        };
    }
    
    // Simulasi respons sukses berdasarkan method
    switch (method) {
        case 'GET':
            return {
                success: true,
                data: [...tasks] // Clone array
            };
        
        case 'POST':
            return {
                success: true,
                data: data,
                message: 'Tugas berhasil ditambahkan'
            };
        
        case 'PUT':
            return {
                success: true,
                data: data,
                message: 'Tugas berhasil diperbarui'
            };
        
        case 'DELETE':
            return {
                success: true,
                message: 'Tugas berhasil dihapus'
            };
        
        default:
            return {
                success: false,
                message: 'Method tidak didukung'
            };
    }
}

// Fungsi utility untuk escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Fungsi untuk menangani error global
window.addEventListener('error', function(e) {
    console.error('Error:', e.error);
    showNotification('Terjadi kesalahan pada aplikasi', true);
});

// Fungsi untuk menangani unhandled promise rejection
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('Terjadi kesalahan pada aplikasi', true);
    e.preventDefault();
});
