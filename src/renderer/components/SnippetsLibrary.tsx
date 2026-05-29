import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Edit3, Copy, Check, Code, FileCode, BookOpen, Star, Clock, Tag, Filter, X, ChevronRight, Folder, FileText, Layout, Sparkles, Zap, Terminal, Database, Globe, Smartphone, Server, Cpu, Layers, Box, GitBranch, Shield, Activity, Palette, Monitor, Settings, Wand2, Bot, Brain, Puzzle, Extension, Download, Upload, RefreshCw } from 'lucide-react';

interface Snippet {
id: string;
title: string;
code: string;
language: string;
category: string;
tags: string[];
description: string;
isFavorite: boolean;
lastUsed: Date;
createdAt: Date;
}

interface SnippetsLibraryProps {
isOpen: boolean;
onClose: () => void;
onInsertSnippet: (code: string) => void;
}

const SNIPPETS: Snippet[] = [
// JavaScript/TypeScript
{
id: '1',
title: 'React Functional Component',
code: `import React from 'react';

interface Props {
  // Define your props here
}

export const ComponentName: React.FC<Props> = () => {
  return (
    <div>
      {/* Your component content */}
    </div>
  );
};`,
language: 'typescript',
category: 'React',
tags: ['react', 'component', 'typescript'],
description: 'Basic React functional component with TypeScript',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '2',
title: 'React useState Hook',
code: `const [state, setState] = useState(initialValue);`,
language: 'typescript',
category: 'React',
tags: ['react', 'hooks', 'state'],
description: 'React useState hook template',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '3',
title: 'React useEffect Hook',
code: `useEffect(() => {
  // Your effect logic here
  
  return () => {
    // Cleanup logic here
  };
}, [/* dependencies */]);`,
language: 'typescript',
category: 'React',
tags: ['react', 'hooks', 'effect'],
description: 'React useEffect hook with cleanup',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '4',
title: 'Async/Await Function',
code: `const functionName = async (): Promise<ReturnType> => {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};`,
language: 'typescript',
category: 'JavaScript',
tags: ['async', 'await', 'promise', 'error-handling'],
description: 'Async function with error handling',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '5',
title: 'Fetch API with Error Handling',
code: `const fetchData = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};`,
language: 'typescript',
category: 'JavaScript',
tags: ['fetch', 'api', 'http', 'json'],
description: 'Fetch API wrapper with error handling',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '6',
title: 'Event Handler',
code: `const handleEvent = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  // Your handler logic here
};`,
language: 'typescript',
category: 'React',
tags: ['react', 'event', 'handler'],
description: 'React event handler template',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '7',
title: 'Custom Hook',
code: `const useCustomHook = () => {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Hook logic
  }, []);
  
  const handler = useCallback(() => {
    // Handler logic
  }, []);
  
  return { state, handler };
};`,
language: 'typescript',
category: 'React',
tags: ['react', 'hooks', 'custom'],
description: 'Custom React hook template',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '8',
title: 'Array Methods Chain',
code: `const result = array
  .filter(item => item.condition)
  .map(item => item.transform)
  .reduce((acc, item) => acc + item, 0);`,
language: 'javascript',
category: 'JavaScript',
tags: ['array', 'functional', 'chain'],
description: 'Array methods chaining pattern',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '9',
title: 'Debounce Function',
code: `const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};`,
language: 'typescript',
category: 'JavaScript',
tags: ['debounce', 'performance', 'utilities'],
description: 'TypeScript debounce utility',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '10',
title: 'Throttle Function',
code: `const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};`,
language: 'typescript',
category: 'JavaScript',
tags: ['throttle', 'performance', 'utilities'],
description: 'TypeScript throttle utility',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},

// Python
{
id: '11',
title: 'Python Function with Docstring',
code: `def function_name(param1: str, param2: int) -> bool:
    \"\"\"
    Brief description of the function.
    
    Args:
        param1: Description of param1
        param2: Description of param2
    
    Returns:
        Description of return value
    
    Raises:
        ValueError: When invalid input is provided
    \"\"\"
    try:
        # Function logic here
        return True
    except Exception as e:
        raise ValueError(f"Error: {e}")`,
language: 'python',
category: 'Python',
tags: ['python', 'function', 'docstring'],
description: 'Python function with proper documentation',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '12',
title: 'Python Class',
code: `class ClassName:
    \"\"\"Class description.\"\"\"
    
    def __init__(self, param: str):
        \"\"\"Initialize the class.\"\"\"
        self.param = param
        self._private_var = None
    
    def method(self) -> str:
        \"\"\"Method description.\"\"\"
        return self.param
    
    @property
    def property_name(self) -> str:
        \"\"\"Property description.\"\"\"
        return self._private_var`,
language: 'python',
category: 'Python',
tags: ['python', 'class', 'oop'],
description: 'Python class with properties and methods',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '13',
title: 'Python Context Manager',
code: `from contextlib import contextmanager

@contextmanager
def managed_resource(*args, **kwargs):
    \"\"\"Context manager for resource handling.\"\"\"
    resource = acquire_resource(*args, **kwargs)
    try:
        yield resource
    finally:
        release_resource(resource)`,
language: 'python',
category: 'Python',
tags: ['python', 'context-manager', 'resource'],
description: 'Python context manager pattern',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '14',
title: 'Python List Comprehension',
code: `# Basic list comprehension
squares = [x**2 for x in range(10)]

# With condition
evens = [x for x in range(10) if x % 2 == 0]

# Dictionary comprehension
square_dict = {x: x**2 for x in range(10)}

# Set comprehension
square_set = {x**2 for x in range(10)}`,
language: 'python',
category: 'Python',
tags: ['python', 'comprehension', 'list'],
description: 'Python comprehensions examples',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '15',
title: 'Python Decorator',
code: `from functools import wraps
from typing import Callable, Any

def my_decorator(func: Callable) -> Callable:
    \"\"\"Decorator description.\"\"\"
    @wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        # Before function call
        print(f"Calling {func.__name__}")
        
        result = func(*args, **kwargs)
        
        # After function call
        print(f"{func.__name__} completed")
        
        return result
    
    return wrapper

@my_decorator
def example_function():
    \"\"\"Example function.\"\"\"
    pass`,
language: 'python',
category: 'Python',
tags: ['python', 'decorator', 'function'],
description: 'Python decorator with typing',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},

// CSS/Tailwind
{
id: '16',
title: 'Tailwind Card Component',
code: `<div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800">
  <img className="w-full h-48 object-cover" src="/api/placeholder/400/200" alt="Card image" />
  <div className="px-6 py-4">
    <div className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Card Title</div>
    <p className="text-gray-700 dark:text-gray-300 text-base">
      Card description text goes here.
    </p>
  </div>
  <div className="px-6 pt-4 pb-2">
    <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2">
      #tag
    </span>
  </div>
</div>`,
language: 'html',
category: 'CSS',
tags: ['tailwind', 'css', 'component', 'card'],
description: 'Tailwind CSS card component',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '17',
title: 'Tailwind Button Variants',
code: `// Primary Button
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
  Primary
</button>

// Secondary Button
<button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
  Secondary
</button>

// Danger Button
<button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
  Danger
</button>`,
language: 'html',
category: 'CSS',
tags: ['tailwind', 'css', 'button', 'ui'],
description: 'Tailwind CSS button variants',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '18',
title: 'CSS Grid Layout',
code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.grid-item {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}`,
language: 'css',
category: 'CSS',
tags: ['css', 'grid', 'layout'],
description: 'CSS Grid responsive layout',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '19',
title: 'CSS Flexbox Centering',
code: `/* Horizontal and vertical centering */
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Space between items */
.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Column layout */
.column-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}`,
language: 'css',
category: 'CSS',
tags: ['css', 'flexbox', 'layout'],
description: 'CSS Flexbox common patterns',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '20',
title: 'CSS Animation Keyframes',
code: `@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}`,
language: 'css',
category: 'CSS',
tags: ['css', 'animation', 'keyframes'],
description: 'CSS animation keyframes',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},

// Node.js/Backend
{
id: '21',
title: 'Express.js Route Handler',
code: `const express = require('express');
const router = express.Router();

// GET request
router.get('/api/resource', async (req, res) => {
  try {
    const data = await getResource();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST request
router.post('/api/resource', async (req, res) => {
  try {
    const newResource = await createResource(req.body);
    res.status(201).json({ success: true, data: newResource });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;`,
language: 'javascript',
category: 'Node.js',
tags: ['express', 'nodejs', 'api', 'rest'],
description: 'Express.js REST API routes',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '22',
title: 'Express.js Middleware',
code: `const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};`,
language: 'javascript',
category: 'Node.js',
tags: ['express', 'nodejs', 'middleware', 'auth'],
description: 'Express.js middleware examples',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '23',
title: 'MongoDB Schema (Mongoose)',
code: `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);`,
language: 'javascript',
category: 'Node.js',
tags: ['mongodb', 'mongoose', 'schema', 'database'],
description: 'Mongoose schema definition',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '24',
title: 'JWT Authentication',
code: `const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const refreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};`,
language: 'javascript',
category: 'Node.js',
tags: ['jwt', 'auth', 'security', 'token'],
description: 'JWT authentication utilities',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '25',
title: 'WebSocket Connection',
code: `const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'broadcast',
            data: data,
            timestamp: new Date().toISOString()
          }));
        }
      });
    } catch (error) {
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});`,
language: 'javascript',
category: 'Node.js',
tags: ['websocket', 'real-time', 'socket'],
description: 'WebSocket server implementation',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},

// SQL
{
id: '26',
title: 'SQL SELECT with Joins',
code: `SELECT 
    u.id,
    u.username,
    u.email,
    p.full_name,
    p.avatar_url,
    COUNT(DISTINCT o.id) as order_count,
    SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.is_active = true
    AND u.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
GROUP BY u.id, u.username, u.email, p.full_name, p.avatar_url
HAVING order_count > 0
ORDER BY total_spent DESC
LIMIT 100;`,
language: 'sql',
category: 'SQL',
tags: ['sql', 'select', 'join', 'query'],
description: 'SQL SELECT with multiple joins',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '27',
title: 'SQL INSERT with Returning',
code: `INSERT INTO users (username, email, password_hash, created_at)
VALUES ($1, $2, $3, NOW())
RETURNING id, username, email, created_at;`,
language: 'sql',
category: 'SQL',
tags: ['sql', 'insert', 'postgresql'],
description: 'SQL INSERT with RETURNING clause',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '28',
title: 'SQL UPDATE with Join',
code: `UPDATE users u
SET 
    last_login = NOW(),
    login_count = u.login_count + 1
FROM user_sessions s
WHERE u.id = s.user_id
    AND s.session_token = $1
RETURNING u.id, u.username, u.last_login;`,
language: 'sql',
category: 'SQL',
tags: ['sql', 'update', 'join'],
description: 'SQL UPDATE with JOIN',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '29',
title: 'SQL Transaction',
code: `BEGIN TRANSACTION;

-- Insert order
INSERT INTO orders (user_id, total_amount, status)
VALUES ($1, $2, 'pending')
RETURNING id INTO @order_id;

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT @order_id, product_id, quantity, price
FROM cart_items
WHERE user_id = $1;

-- Clear cart
DELETE FROM cart_items WHERE user_id = $1;

-- Update inventory
UPDATE products p
SET stock_quantity = p.stock_quantity - c.quantity
FROM order_items c
WHERE p.id = c.product_id AND c.order_id = @order_id;

COMMIT;`,
language: 'sql',
category: 'SQL',
tags: ['sql', 'transaction', 'atomic'],
description: 'SQL transaction example',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '30',
title: 'SQL Index Creation',
code: `-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- Partial index
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;

-- Unique index
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- GIN index for JSON/Array (PostgreSQL)
CREATE INDEX idx_products_tags ON products USING GIN(tags);`,
language: 'sql',
category: 'SQL',
tags: ['sql', 'index', 'performance'],
description: 'SQL index creation examples',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},

// Rust
{
id: '31',
title: 'Rust Struct with Methods',
code: `pub struct User {
    id: u64,
    username: String,
    email: String,
    active: bool,
}

impl User {
    // Constructor
    pub fn new(id: u64, username: &str, email: &str) -> Self {
        Self {
            id,
            username: username.to_string(),
            email: email.to_string(),
            active: true,
        }
    }
    
    // Method
    pub fn deactivate(&mut self) {
        self.active = false;
    }
    
    // Getter
    pub fn is_active(&self) -> bool {
        self.active
    }
    
    // Associated function
    pub fn validate_email(email: &str) -> bool {
        email.contains('@') && email.contains('.')
    }
}`,
language: 'rust',
category: 'Rust',
tags: ['rust', 'struct', 'impl'],
description: 'Rust struct with implementation',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '32',
title: 'Rust Error Handling',
code: `use std::fs::File;
use std::io::{self, Read};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("IO error: {0}")]
    Io(#[from] io::Error),
    #[error("Parse error: {0}")]
    Parse(String),
    #[error("Not found")]
    NotFound,
}

pub type Result<T> = std::result::Result<T, AppError>;

pub fn read_config(path: &str) -> Result<String> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    
    if contents.is_empty() {
        return Err(AppError::Parse("Empty config file".to_string()));
    }
    
    Ok(contents)
}

// Usage with match
match read_config("config.toml") {
    Ok(config) => println!("Config loaded: {}", config),
    Err(e) => eprintln!("Error: {}", e),
}`,
language: 'rust',
category: 'Rust',
tags: ['rust', 'error-handling', 'result'],
description: 'Rust error handling patterns',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '33',
title: 'Rust Async Function',
code: `use tokio::time::{sleep, Duration};
use reqwest;

#[derive(Debug)]
struct ApiResponse {
    status: u16,
    body: String,
}

async fn fetch_data(url: &str) -> Result<ApiResponse, reqwest::Error> {
    // Add delay for rate limiting
    sleep(Duration::from_millis(100)).await;
    
    let response = reqwest::get(url).await?;
    let status = response.status().as_u16();
    let body = response.text().await?;
    
    Ok(ApiResponse { status, body })
}

// Concurrent execution
async fn fetch_multiple(urls: Vec<&str>) -> Vec<Result<ApiResponse, reqwest::Error>> {
    let futures: Vec<_> = urls.into_iter()
        .map(|url| fetch_data(url))
        .collect();
    
    futures::future::join_all(futures).await
}`,
language: 'rust',
category: 'Rust',
tags: ['rust', 'async', 'tokio'],
description: 'Rust async/await pattern',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '34',
title: 'Rust Iterator Chain',
code: `let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filter, map, and collect
let even_squares: Vec<i32> = numbers
    .iter()
    .filter(|&&n| n % 2 == 0)
    .map(|&n| n * n)
    .collect();

// Find and process
let first_even = numbers
    .iter()
    .find(|&&n| n % 2 == 0);

// Fold (reduce)
let sum = numbers
    .iter()
    .fold(0, |acc, &n| acc + n);

// Any/All
let has_even = numbers.iter().any(|&n| n % 2 == 0);
let all_positive = numbers.iter().all(|&n| n > 0);`,
language: 'rust',
category: 'Rust',
tags: ['rust', 'iterator', 'functional'],
description: 'Rust iterator methods',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '35',
title: 'Rust Trait Definition',
code: `pub trait Drawable {
    fn draw(&self);
    fn area(&self) -> f64;
    
    // Default implementation
    fn describe(&self) {
        println!("This is a drawable shape with area {}", self.area());
    }
}

pub struct Circle {
    radius: f64,
}

impl Drawable for Circle {
    fn draw(&self) {
        println!("Drawing circle with radius {}", self.radius);
    }
    
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
}

// Trait bounds
pub fn draw_all<T: Drawable>(shapes: &[T]) {
    for shape in shapes {
        shape.draw();
    }
}`,
language: 'rust',
category: 'Rust',
tags: ['rust', 'trait', 'interface'],
description: 'Rust trait definition and implementation',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},

// Go
{
id: '36',
title: 'Go HTTP Handler',
code: `package main

import (
    "encoding/json"
    "net/http"
    "log"
)

type Response struct {
    Message string \`json:"message"\`
    Status  int    \`json:"status"\`
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
    // Set content type
    w.Header().Set("Content-Type", "application/json")
    
    // Create response
    resp := Response{
        Message: "Hello, World!",
        Status:  http.StatusOK,
    }
    
    // Encode and send
    if err := json.NewEncoder(w).Encode(resp); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
}

func main() {
    http.HandleFunc("/api/hello", helloHandler)
    
    log.Println("Server starting on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatal(err)
    }
}`,
language: 'go',
category: 'Go',
tags: ['go', 'http', 'handler', 'api'],
description: 'Go HTTP handler example',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '37',
title: 'Go Goroutines and Channels',
code: `package main

import (
    "fmt"
    "time"
)

// Worker function
func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("Worker %d processing job %d\\n", id, j)
        time.Sleep(time.Second)
        results <- j * 2
    }
}

func main() {
    const numJobs = 5
    const numWorkers = 3
    
    jobs := make(chan int, numJobs)
    results := make(chan int, numJobs)
    
    // Start workers
    for w := 1; w <= numWorkers; w++ {
        go worker(w, jobs, results)
    }
    
    // Send jobs
    for j := 1; j <= numJobs; j++ {
        jobs <- j
    }
    close(jobs)
    
    // Collect results
    for a := 1; a <= numJobs; a++ {
        result := <-results
        fmt.Printf("Result: %d\\n", result)
    }
}`,
language: 'go',
category: 'Go',
tags: ['go', 'goroutine', 'channel', 'concurrency'],
description: 'Go concurrency with goroutines',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '38',
title: 'Go Struct and Methods',
code: `package main

type User struct {
    ID        int
    Username  string
    Email     string
    IsActive  bool
}

// Constructor function
func NewUser(id int, username, email string) *User {
    return &User{
        ID:       id,
        Username: username,
        Email:    email,
        IsActive: true,
    }
}

// Method with value receiver
func (u User) GetDisplayName() string {
    return u.Username
}

// Method with pointer receiver
func (u *User) Deactivate() {
    u.IsActive = false
}

// Stringer interface implementation
func (u User) String() string {
    return fmt.Sprintf("User{ID: %d, Username: %s}", u.ID, u.Username)
}

// Usage
func main() {
    user := NewUser(1, "johndoe", "john@example.com")
    fmt.Println(user.GetDisplayName())
    user.Deactivate()
}`,
language: 'go',
category: 'Go',
tags: ['go', 'struct', 'method', 'oop'],
description: 'Go struct with methods',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '39',
title: 'Go Error Handling',
code: `package main

import (
    "errors"
    "fmt"
)

// Custom error type
type ValidationError struct {
    Field   string
    Message string
}

func (e ValidationError) Error() string {
    return fmt.Sprintf("validation error for %s: %s", e.Field, e.Message)
}

// Function returning error
func validateEmail(email string) error {
    if email == "" {
        return ValidationError{Field: "email", Message: "cannot be empty"}
    }
    if !strings.Contains(email, "@") {
        return errors.New("invalid email format")
    }
    return nil
}

// Error handling
func main() {
    if err := validateEmail("invalid"); err != nil {
        var valErr ValidationError
        if errors.As(err, &valErr) {
            fmt.Printf("Validation failed: %s\\n", valErr.Field)
        } else {
            fmt.Printf("Error: %v\\n", err)
        }
    }
}`,
language: 'go',
category: 'Go',
tags: ['go', 'error', 'handling'],
description: 'Go error handling patterns',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '40',
title: 'Go Database Query',
code: `package main

import (
    "database/sql"
    _ "github.com/lib/pq"
)

type User struct {
    ID       int
    Username string
    Email    string
}

func GetUserByID(db *sql.DB, id int) (*User, error) {
    user := &User{}
    
    query := \`SELECT id, username, email FROM users WHERE id = $1\`
    
    err := db.QueryRow(query, id).Scan(&user.ID, &user.Username, &user.Email)
    if err == sql.ErrNoRows {
        return nil, fmt.Errorf("user not found")
    }
    if err != nil {
        return nil, err
    }
    
    return user, nil
}

func GetAllUsers(db *sql.DB) ([]User, error) {
    rows, err := db.Query("SELECT id, username, email FROM users")
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    
    var users []User
    for rows.Next() {
        var u User
        if err := rows.Scan(&u.ID, &u.Username, &u.Email); err != nil {
            return nil, err
        }
        users = append(users, u)
    }
    
    return users, rows.Err()
}`,
language: 'go',
category: 'Go',
tags: ['go', 'database', 'sql', 'postgres'],
description: 'Go database operations',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},

// Docker
{
id: '41',
title: 'Dockerfile Multi-stage',
code: `# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]`,
language: 'dockerfile',
category: 'Docker',
tags: ['docker', 'dockerfile', 'multi-stage', 'node'],
description: 'Multi-stage Dockerfile for Node.js',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '42',
title: 'Docker Compose',
code: `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    networks:
      - app-network
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge`,
language: 'yaml',
category: 'Docker',
tags: ['docker', 'compose', 'yaml'],
description: 'Docker Compose configuration',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '43',
title: 'Kubernetes Deployment',
code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5`,
language: 'yaml',
category: 'Kubernetes',
tags: ['kubernetes', 'k8s', 'deployment', 'yaml'],
description: 'Kubernetes deployment manifest',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '44',
title: 'Kubernetes Service & Ingress',
code: `---
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: myapp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - api.example.com
    secretName: api-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app-service
            port:
              number: 80`,
language: 'yaml',
category: 'Kubernetes',
tags: ['kubernetes', 'k8s', 'service', 'ingress'],
description: 'Kubernetes service and ingress',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '45',
title: 'GitHub Actions Workflow',
code: `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test -- --coverage
    
    - name: Build
      run: npm run build
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # Add deployment steps here`,
language: 'yaml',
category: 'DevOps',
tags: ['github-actions', 'ci/cd', 'yaml', 'automation'],
description: 'GitHub Actions CI/CD workflow',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},

// Shell/Bash
{
id: '46',
title: 'Bash Script Template',
code: `#!/bin/bash

set -euo pipefail

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main function
main() {
    log_info "Starting script..."
    
    # Your script logic here
    
    log_info "Script completed successfully!"
}

# Run main function
main "$@"`,
language: 'bash',
category: 'Shell',
tags: ['bash', 'shell', 'script', 'template'],
description: 'Bash script template with error handling',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '47',
title: 'Docker Helper Script',
code: `#!/bin/bash

# Docker helper functions

build_image() {
    local tag=$1
    docker build -t "$tag" .
}

run_container() {
    local name=$1
    local port=$2
    docker run -d \
        --name "$name" \
        -p "$port:$port" \
        --restart unless-stopped \
        "$name"
}

cleanup() {
    # Remove stopped containers
    docker container prune -f
    
    # Remove unused images
    docker image prune -af
    
    # Remove unused volumes
    docker volume prune -f
}

# Parse command
case "${1:-}" in
    build)
        build_image "${2:-latest}"
        ;;
    run)
        run_container "${2:-app}" "${3:-3000}"
        ;;
    cleanup)
        cleanup
        ;;
    *)
        echo "Usage: $0 {build|run|cleanup}"
        exit 1
        ;;
esac`,
language: 'bash',
category: 'Shell',
tags: ['bash', 'docker', 'helper', 'script'],
description: 'Docker helper bash script',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '48',
title: 'Git Helper Aliases',
code: `# Git aliases for .bashrc or .zshrc

# Basic aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'
alias gd='git diff'
alias gco='git checkout'
alias gb='git branch'
alias glg='git log --oneline --graph --decorate'

# Advanced aliases
alias gaa='git add --all'
alias gcm='git commit -m'
alias gcam='git commit -am'
alias gpo='git push origin'
alias gpom='git push origin main'
alias gpl='git pull --rebase'
alias gst='git stash'
alias gsp='git stash pop'
alias gclean='git clean -fd'
alias greset='git reset --hard HEAD'

# Feature branch workflow
alias gfb='git checkout -b feature/'
alias gbb='git checkout -b bugfix/'
alias gpb='git push -u origin'

# Delete merged branches
alias gbdm="git branch --merged | grep -v 'main|master' | xargs git branch -d"`,
language: 'bash',
category: 'Shell',
tags: ['git', 'bash', 'alias', 'productivity'],
description: 'Git helper aliases',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '49',
title: 'NPM Package.json Template',
code: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "Project description",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json}\"",
    "typecheck": "tsc --noEmit"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0",
    "vitest": "^1.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`,
language: 'json',
category: 'Config',
tags: ['npm', 'package.json', 'template', 'config'],
description: 'NPM package.json template',
isFavorite: false,
lastUsed: new Date(),
createdAt: new Date(),
},
{
id: '50',
title: 'TypeScript Config Template',
code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}`,
language: 'json',
category: 'Config',
tags: ['typescript', 'tsconfig', 'config', 'template'],
description: 'TypeScript configuration template',
isFavorite: true,
lastUsed: new Date(),
createdAt: new Date(),
},
];

export const SnippetsLibrary: React.FC<SnippetsLibraryProps> = ({ isOpen, onClose, onInsertSnippet }) => {
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState<string>('All');
const [favoritesOnly, setFavoritesOnly] = useState(false);
const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
const [copiedId, setCopiedId] = useState<string | null>(null);

const categories = useMemo(() => {
const cats = new Set(SNIPPETS.map(s => s.category));
return ['All', ...Array.from(cats)];
}, []);

const filteredSnippets = useMemo(() => {
return SNIPPETS.filter(snippet => {
const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
const matchesCategory = selectedCategory === 'All' || snippet.category === selectedCategory;
const matchesFavorite = !favoritesOnly || snippet.isFavorite;
return matchesSearch && matchesCategory && matchesFavorite;
});
}, [searchQuery, selectedCategory, favoritesOnly]);

const handleCopyCode = async (snippet: Snippet) => {
try {
await navigator.clipboard.writeText(snippet.code);
setCopiedId(snippet.id);
setTimeout(() => setCopiedId(null), 2000);
} catch (err) {
console.error('Failed to copy:', err);
}
};

const handleInsert = (snippet: Snippet) => {
onInsertSnippet(snippet.code);
};

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
<div className="w-full max-w-6xl h-[85vh] glass-panel rounded-xl overflow-hidden flex flex-col">
{/* Header */}
<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
<div className="flex items-center space-x-3">
<BookOpen className="w-6 h-6 text-blue-400" />
<div>
<h2 className="text-xl font-bold text-white">Code Snippets Library</h2>
<p className="text-sm text-gray-400">{SNIPPETS.length}+ ready-to-use code templates</p>
</div>
</div>
<button
onClick={onClose}
className="p-2 hover:bg-white/10 rounded-lg transition-colors"
>
<X className="w-5 h-5 text-gray-400" />
</button>
</div>

{/* Search and Filters */}
<div className="px-6 py-4 border-b border-white/10 space-y-4">
<div className="flex space-x-4">
<div className="flex-1 relative">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
<input
type="text"
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
placeholder="Search snippets by name, description, or tags..."
className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
/>
</div>
<select
value={selectedCategory}
onChange={(e) => setSelectedCategory(e.target.value)}
className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
>
{categories.map(cat => (
<option key={cat} value={cat} className="bg-gray-900">{cat}</option>
))}
</select>
</div>

<div className="flex items-center space-x-4">
<button
onClick={() => setFavoritesOnly(!favoritesOnly)}
className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
favoritesOnly ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-400 hover:text-white'
}`}
>
<Star className={`w-4 h-4 ${favoritesOnly ? 'fill-current' : ''}`} />
<span className="text-sm">Favorites</span>
</button>
<span className="text-sm text-gray-500">
{filteredSnippets.length} snippets found
</span>
</div>
</div>

{/* Content */}
<div className="flex-1 flex overflow-hidden">
{/* Snippets List */}
<div className="w-1/3 border-r border-white/10 overflow-y-auto">
{filteredSnippets.map(snippet => (
<button
key={snippet.id}
onClick={() => setSelectedSnippet(snippet)}
className={`w-full text-left p-4 border-b border-white/5 transition-colors ${
selectedSnippet?.id === snippet.id
? 'bg-blue-500/20 border-l-2 border-l-blue-500'
: 'hover:bg-white/5'
}`}
>
<div className="flex items-start justify-between">
<div className="flex-1 min-w-0">
<div className="flex items-center space-x-2">
<span className="text-sm font-medium text-white truncate">{snippet.title}</span>
{snippet.isFavorite && <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />}
</div>
<p className="text-xs text-gray-400 mt-1 truncate">{snippet.description}</p>
<div className="flex items-center space-x-2 mt-2">
<span className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-300">{snippet.language}</span>
<span className="text-xs text-gray-500">{snippet.category}</span>
</div>
</div>
<ChevronRight className={`w-4 h-4 text-gray-500 flex-shrink-0 ${
selectedSnippet?.id === snippet.id ? 'text-blue-400' : ''
}`} />
</div>
</button>
))}
</div>

{/* Preview Panel */}
<div className="flex-1 flex flex-col bg-black/20">
{selectedSnippet ? (
<>
{/* Preview Header */}
<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
<div>
<h3 className="text-lg font-semibold text-white">{selectedSnippet.title}</h3>
<div className="flex items-center space-x-3 mt-1">
<span className="text-sm text-gray-400">{selectedSnippet.language}</span>
<span className="text-sm text-gray-500">•</span>
<span className="text-sm text-gray-400">{selectedSnippet.category}</span>
</div>
</div>
<div className="flex items-center space-x-2">
<button
onClick={() => handleCopyCode(selectedSnippet)}
className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors"
>
{copiedId === selectedSnippet.id ? (
<>
<Check className="w-4 h-4 text-green-400" />
<span className="text-sm">Copied!</span>
</>
) : (
<>
<Copy className="w-4 h-4" />
<span className="text-sm">Copy</span>
</>
)}
</button>
<button
onClick={() => handleInsert(selectedSnippet)}
className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
>
<Code className="w-4 h-4" />
<span className="text-sm">Insert</span>
</button>
</div>
</div>

{/* Description */}
<div className="px-6 py-3 border-b border-white/10">
<p className="text-sm text-gray-300">{selectedSnippet.description}</p>
<div className="flex flex-wrap gap-2 mt-2">
{selectedSnippet.tags.map(tag => (
<span key={tag} className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400">
#{tag}
</span>
))}
</div>
</div>

{/* Code Preview */}
<div className="flex-1 overflow-auto p-6">
<pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
{selectedSnippet.code}
</pre>
</div>
</>
) : (
<div className="flex-1 flex flex-col items-center justify-center text-gray-500">
<Code className="w-16 h-16 mb-4 opacity-30" />
<p className="text-lg">Select a snippet to preview</p>
<p className="text-sm mt-2">Browse {filteredSnippets.length} code templates</p>
</div>
)}
</div>
</div>
</div>
</div>
);
};