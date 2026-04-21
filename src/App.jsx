import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import './index.css';

const DAYS = [
  { id: 'mon', name: 'Thứ 2' },
  { id: 'tue', name: 'Thứ 3' },
  { id: 'wed', name: 'Thứ 4' },
  { id: 'thu', name: 'Thứ 5' },
  { id: 'fri', name: 'Thứ 6' },
  { id: 'sat', name: 'Thứ 7' },
  { id: 'sun', name: 'Chủ nhật' }
];

const COLORS = [
  { id: 'default', value: '#e2e8f0', label: 'Bình thường' },
  { id: 'red', value: '#ef4444', label: 'Gấp' },
  { id: 'yellow', value: '#eab308', label: 'Đang làm' },
  { id: 'green', value: '#22c55e', label: 'Hoàn thành' },
  { id: 'blue', value: '#3b82f6', label: 'Ý tưởng' }
];

const INITIAL_TASKS = [
  { id: '1', dayId: 'mon', content: 'Họp team đầu tuần', completed: true, color: 'green' },
  { id: '2', dayId: 'mon', content: 'Lên plan content tuần', completed: false, color: 'yellow' },
  { id: '3', dayId: 'tue', content: 'Thiết kế UI/UX', completed: false, color: 'red' },
  { id: '4', dayId: 'wed', content: 'Review code', completed: false, color: 'default' },
  { id: '5', dayId: 'thu', content: 'Fix bugs UI', completed: false, color: 'red' },
  { id: '6', dayId: 'fri', content: 'Deploy lên staging', completed: false, color: 'yellow' },
  { id: '7', dayId: 'sat', content: 'Nghĩ tính năng mới (AI)', completed: false, color: 'blue' }
];

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('weekly_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_TASKS;
      }
    }
    return INITIAL_TASKS;
  });

  useEffect(() => {
    localStorage.setItem('weekly_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (dayId) => {
    const newTask = {
      id: Date.now().toString(),
      dayId,
      content: '',
      completed: false,
      color: 'default'
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId, field, value) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const uncompletedTasks = totalTasks - completedTasks;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="app-container">
      <div className="header-card">
        <div className="header-top">
          <div className="app-title">
            <CheckCircle className="text-primary" size={28} color="#4f46e5" />
            Weekly Task Planner
          </div>
          
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-label">Tổng</span>
              <span className="stat-value">{totalTasks}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đã xong</span>
              <span className="stat-value completed">{completedTasks}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Chưa xong</span>
              <span className="stat-value uncompleted">{uncompletedTasks}</span>
            </div>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="progress-text">{progressPercent}%</span>
        </div>
      </div>

      <div className="board">
        {DAYS.map(day => {
          const dayTasks = tasks.filter(t => t.dayId === day.id);
          
          return (
            <div key={day.id} className="day-column">
              <div className="day-header">
                {day.name}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {dayTasks.length}
                </span>
              </div>
              
              <div className="task-list">
                {dayTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`task-card ${task.completed ? 'completed' : ''}`}
                    style={{ borderLeftColor: COLORS.find(c => c.id === task.color)?.value || 'var(--color-default)' }}
                  >
                    <div className="task-header">
                      <input 
                        type="checkbox" 
                        className="task-checkbox"
                        checked={task.completed}
                        onChange={(e) => updateTask(task.id, 'completed', e.target.checked)}
                      />
                      <textarea
                        className="task-input"
                        value={task.content}
                        onChange={(e) => updateTask(task.id, 'content', e.target.value)}
                        placeholder="Nhập công việc..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="task-footer">
                      <div className="color-picker">
                        {COLORS.map(color => (
                          <button
                            key={color.id}
                            className={`color-btn ${task.color === color.id ? 'active' : ''}`}
                            style={{ backgroundColor: color.value }}
                            title={color.label}
                            onClick={() => updateTask(task.id, 'color', color.id)}
                          />
                        ))}
                      </div>
                      
                      <button 
                        className="delete-btn"
                        onClick={() => deleteTask(task.id)}
                        title="Xóa công việc"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="add-task-btn"
                onClick={() => addTask(day.id)}
              >
                <Plus size={18} /> Thêm task
              </button>
              <div style={{ height: '1rem' }}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
