// Question bank organized by role and difficulty
const questionBank = {
  // Frontend roles
  'React Developer': {
    beginner: [
      'What is JSX and how does it work?',
      'Explain the difference between state and props in React.',
      'How do React hooks improve component logic?',
      'What is the virtual DOM and why is it important?',
      'How do you handle forms in React?',
      'Explain the lifecycle of a React component.',
      'What is the difference between functional and class components?',
      'How do you pass data between components in React?'
    ],
    intermediate: [
      'Explain React Context API and when to use it.',
      'How would you optimize a slow React application?',
      'What are controlled vs uncontrolled components?',
      'Explain the difference between useEffect and useLayoutEffect.',
      'How do you implement error boundaries in React?',
      'What is React.memo and when should you use it?',
      'How do you handle side effects in functional components?',
      'Explain the concept of custom hooks and provide an example.'
    ],
    advanced: [
      'Design a scalable state management solution for a large React application.',
      'Explain the reconciliation algorithm (diffing) in React.',
      'How would you implement server-side rendering with React?',
      'Discuss performance optimization strategies for React applications.',
      'How do you handle concurrent rendering and Suspense in React 18?',
      'Explain the principles behind React Fiber architecture.',
      'How would you implement a custom hook for data fetching with caching?',
      'Discuss testing strategies for complex React components.'
    ]
  },

  'Angular Developer': {
    beginner: [
      'What is Angular and how does it differ from React?',
      'Explain the concept of dependency injection in Angular.',
      'What are Angular directives? Provide examples.',
      'How do you create and use services in Angular?',
      'Explain two-way data binding in Angular.',
      'What is the difference between property binding and event binding?',
      'How do you handle HTTP requests in Angular?',
      'Explain the structure of an Angular module.'
    ],
    intermediate: [
      'Explain RxJS observables and how they work in Angular.',
      'How do you implement routing in a single-page application with Angular?',
      'What are Angular guards and when would you use them?',
      'Explain the difference between ChangeDetectionStrategy.OnPush and Default.',
      'How do you handle forms validation in Angular?',
      'What is interceptor and how does it work in Angular?',
      'How do you communicate between sibling components in Angular?',
      'Explain lazy loading in Angular and its benefits.'
    ],
    advanced: [
      'Design a complex Angular application with multiple feature modules.',
      'Explain Angular\'s change detection strategy and optimization techniques.',
      'How would you implement real-time updates using WebSockets in Angular?',
      'Discuss state management patterns in Angular applications.',
      'How do you optimize Angular application performance?',
      'Explain Angular Ivy and its advantages over View Engine.',
      'How would you implement custom form controls in Angular?',
      'Discuss testing strategies for Angular applications.'
    ]
  },

  'Vue Developer': {
    beginner: [
      'What is Vue.js and what are its advantages?',
      'Explain the structure of a Vue component.',
      'What is the difference between v-bind and v-on?',
      'How does two-way binding work in Vue?',
      'What are computed properties and watchers?',
      'Explain Vue lifecycle hooks.',
      'How do you handle forms in Vue?',
      'What is Vue Router and how do you use it?'
    ],
    intermediate: [
      'Explain the Vue 3 Composition API vs Options API.',
      'How do you manage global state in Vue with Pinia?',
      'What are slots and scoped slots in Vue?',
      'How do you handle animations and transitions in Vue?',
      'Explain mixins and composables in Vue.',
      'How do you optimize Vue application performance?',
      'What is teleport in Vue 3?',
      'How do you handle async operations in Vue?'
    ],
    advanced: [
      'Design a Vue application with complex state management using Pinia.',
      'How would you implement server-side rendering with Vue?',
      'Explain the Vue 3 reactivity system and proxy mechanism.',
      'How would you create a custom Vue plugin?',
      'Discuss performance optimization strategies for Vue applications.',
      'How would you implement real-time features in a Vue application?',
      'Explain render functions and JSX in Vue 3.',
      'How do you handle complex form validation in Vue?'
    ]
  },

  // Backend roles
  'Java Developer': {
    beginner: [
      'What is the difference between JDK, JRE, and JVM?',
      'Explain the concept of object-oriented programming in Java.',
      'What are the four pillars of OOP?',
      'Explain the difference between abstract classes and interfaces.',
      'What is exception handling and why is it important?',
      'Explain the concept of inheritance in Java.',
      'What is polymorphism and provide examples.',
      'How do collections work in Java?'
    ],
    intermediate: [
      'Explain the Java memory model and garbage collection.',
      'What are streams in Java 8 and how do they work?',
      'Explain lambda expressions and functional interfaces.',
      'What is the difference between checked and unchecked exceptions?',
      'How do you implement threading in Java?',
      'Explain the concept of synchronization in Java.',
      'What are design patterns and name a few?',
      'How do you handle file I/O in Java?'
    ],
    advanced: [
      'Design a scalable Java application with microservices architecture.',
      'Explain the Java memory model and volatile keyword.',
      'How would you implement a thread-safe singleton pattern?',
      'Discuss JVM optimization techniques.',
      'Explain reflection in Java and its applications.',
      'How do you implement custom annotations in Java?',
      'Discuss concurrency patterns and best practices.',
      'How would you implement a custom classloader?'
    ]
  },

  'Python Developer': {
    beginner: [
      'What are the key features of Python?',
      'Explain the difference between list, tuple, and dictionary.',
      'What is a virtual environment and why is it important?',
      'Explain the concept of decorators in Python.',
      'What are list comprehensions and why are they useful?',
      'How do you handle exceptions in Python?',
      'Explain the difference between args and kwargs.',
      'What is the GIL (Global Interpreter Lock)?'
    ],
    intermediate: [
      'Explain generators and iterators in Python.',
      'What are metaclasses and when would you use them?',
      'How do you implement design patterns in Python?',
      'Explain the difference between deep copy and shallow copy.',
      'What is the difference between __init__ and __new__?',
      'How do you handle async programming in Python?',
      'Explain context managers (with statement) in Python.',
      'What are monkey patches and how do you use them?'
    ],
    advanced: [
      'Design a scalable Python application with async/await.',
      'Explain Python\'s memory management and garbage collection.',
      'How would you optimize a CPU-bound Python application?',
      'Discuss multiprocessing vs multithreading in Python.',
      'How do you implement custom descriptors in Python?',
      'Explain metaclasses and class decorators in detail.',
      'How would you create a Python package and publish it?',
      'Discuss testing strategies and frameworks in Python.'
    ]
  },

  'Node.js Developer': {
    beginner: [
      'What is Node.js and why is it used for backend development?',
      'Explain the event loop in Node.js.',
      'What is npm and what are package.json files?',
      'Explain callbacks, promises, and async/await.',
      'What is the difference between synchronous and asynchronous code?',
      'How do you create a simple HTTP server in Node.js?',
      'Explain middleware in Express.js.',
      'What is the difference between require and import?'
    ],
    intermediate: [
      'How do you handle errors in asynchronous Node.js code?',
      'Explain the concept of streams in Node.js.',
      'What is middleware chaining in Express?',
      'How do you implement authentication in Node.js?',
      'Explain clustering in Node.js and when to use it.',
      'What is the difference between process and worker threads?',
      'How do you optimize Node.js application performance?',
      'Explain the concept of JWT and how it works.'
    ],
    advanced: [
      'Design a scalable Node.js application with microservices.',
      'Explain the event loop in detail and optimization strategies.',
      'How would you implement real-time features using WebSockets?',
      'Discuss database optimization strategies in Node.js.',
      'How do you implement caching strategies in Node.js?',
      'Explain worker threads and clustering for scalability.',
      'How would you implement rate limiting and security?',
      'Discuss deployment and DevOps considerations for Node.js.'
    ]
  },

  // Full Stack roles
  'Full Stack Developer': {
    beginner: [
      'What is the difference between frontend and backend development?',
      'Explain the MVC (Model-View-Controller) architecture.',
      'What is REST API and how does it work?',
      'Explain the concept of databases and SQL.',
      'What is authentication and authorization?',
      'How do you handle forms between frontend and backend?',
      'Explain the concept of APIs.',
      'What is JSON and why is it important?'
    ],
    intermediate: [
      'How do you design a scalable application architecture?',
      'Explain database normalization and indexing.',
      'What are the security best practices for web applications?',
      'How do you implement pagination and filtering?',
      'Explain the concept of caching and its benefits.',
      'How do you handle file uploads in web applications?',
      'What is load balancing and when do you need it?',
      'Explain the difference between SQL and NoSQL databases.'
    ],
    advanced: [
      'Design a complete full-stack application with complex features.',
      'Explain microservices architecture and its benefits.',
      'How do you implement real-time synchronization?',
      'Discuss database optimization and query tuning.',
      'How do you implement distributed systems and caching?',
      'Explain DevOps practices and CI/CD pipelines.',
      'How would you scale an application for millions of users?',
      'Discuss security best practices at scale.'
    ]
  },

  // DevOps/Infrastructure
  'DevOps Engineer': {
    beginner: [
      'What is DevOps and its core principles?',
      'Explain containerization and Docker.',
      'What is version control and why is it important?',
      'Explain the concept of CI/CD pipelines.',
      'What is the difference between VMs and containers?',
      'Explain IaC (Infrastructure as Code).',
      'What is load balancing and its importance?',
      'Explain the basics of Kubernetes.'
    ],
    intermediate: [
      'How do you design a robust CI/CD pipeline?',
      'Explain Kubernetes architecture and components.',
      'What are monitoring and logging best practices?',
      'Explain the concept of blue-green deployments.',
      'How do you implement security in cloud environments?',
      'Explain horizontal vs vertical scaling.',
      'What is a service mesh and why would you use it?',
      'How do you handle secrets management?'
    ],
    advanced: [
      'Design a highly available Kubernetes cluster at scale.',
      'Explain advanced networking in Kubernetes.',
      'How do you implement disaster recovery strategies?',
      'Discuss cost optimization for cloud infrastructure.',
      'Explain advanced monitoring and observability.',
      'How would you implement GitOps workflows?',
      'Discuss security hardening at infrastructure level.',
      'How do you manage multi-region deployments?'
    ]
  }
};

// Get all available roles
const getAllRoles = () => {
  return Object.keys(questionBank);
};

const SET_COUNT = 3;

const hashSeed = (value) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const seededShuffle = (arr, seed) => {
  const result = [...arr];
  let state = seed >>> 0;
  for (let i = result.length - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const chunkQuestions = (questions) => {
  const chunkSize = Math.max(1, Math.ceil(questions.length / SET_COUNT));
  const chunks = [];
  for (let i = 0; i < questions.length; i += chunkSize) {
    chunks.push(questions.slice(i, i + chunkSize));
  }
  while (chunks.length < SET_COUNT) {
    chunks.push([]);
  }
  return chunks.slice(0, SET_COUNT);
};

const buildQuestionSet = ({
  questions,
  count,
  setIndex,
  shuffle,
  excludedQuestions
}) => {
  const safeSetIndex = Math.min(Math.max(setIndex, 1), SET_COUNT);
  const chunks = chunkQuestions(questions);
  const basePool = chunks[safeSetIndex - 1].length > 0 ? chunks[safeSetIndex - 1] : questions;
  const excludedSet = new Set(excludedQuestions || []);
  const filteredPool = basePool.filter((q) => !excludedSet.has(q));
  const pool = filteredPool.length >= Math.min(count, basePool.length) ? filteredPool : basePool;

  const prepared = shuffle
    ? seededShuffle(pool, hashSeed(`${setIndex}:${count}:${pool.length}`))
    : [...pool];

  const result = [];
  let index = 0;
  while (result.length < count && prepared.length > 0) {
    result.push(prepared[index % prepared.length]);
    index += 1;
  }

  return result;
};

// Get questions for a specific role and difficulty
const getQuestions = (role, difficulty, options = {}) => {
  const { count = 10, setIndex = 1, shuffle = true, excludedQuestions = [] } = options;
  const roleQuestions = questionBank[role];

  if (!roleQuestions) {
    throw new Error(`Role "${role}" not found`);
  }

  const difficultyQuestions = roleQuestions[difficulty];

  if (!difficultyQuestions) {
    throw new Error(`Difficulty "${difficulty}" not found for role "${role}"`);
  }

  return buildQuestionSet({
    questions: difficultyQuestions,
    count,
    setIndex,
    shuffle,
    excludedQuestions
  });
};

// Get all difficulties
const getAllDifficulties = () => {
  return ['beginner', 'intermediate', 'advanced'];
};

// Generate feedback based on answer quality (local scoring)
const generateFeedback = (question, answer) => {
  const answerLength = answer.trim().split(' ').length;
  const answerLower = answer.toLowerCase();
  
  let score = 50; // Base score
  let feedback = '';
  
  // Scoring criteria
  if (answerLength < 5) {
    feedback = 'Your answer is too brief. Try to provide more detail and examples.';
    score -= 20;
  } else if (answerLength > 200) {
    feedback = 'Your answer is good but could be more concise.';
    score += 10;
  } else if (answerLength >= 20) {
    feedback = 'Good answer length. Good job!';
    score += 15;
  }
  
  // Check for technical depth
  const technicalTerms = [
    'algorithm', 'optimization', 'architecture', 'pattern', 'design',
    'implementation', 'framework', 'library', 'api', 'interface',
    'abstraction', 'encapsulation', 'inheritance', 'polymorphism'
  ];
  
  const hasTechnicalTerms = technicalTerms.some(term => answerLower.includes(term));
  
  if (hasTechnicalTerms) {
    score += 15;
    feedback = (feedback || '') + ' Good use of technical terminology! ';
  } else {
    score -= 10;
    feedback = (feedback || '') + ' Try to use more technical terms. ';
  }
  
  // Check for examples or explanations
  if (answerLower.includes('example') || answerLower.includes('e.g.') || answerLower.includes('such as')) {
    score += 10;
    feedback += 'Great! You provided examples.';
  }
  
  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));
  
  return {
    score,
    feedback: feedback.trim() || 'Your answer shows understanding of the topic.'
  };
};

module.exports = {
  getAllRoles,
  getQuestions,
  getAllDifficulties,
  generateFeedback
};
