// Question bank organized by role and difficulty
const makeOptions = (correctText, distractors, seed) => {
  const rawOptions = [
    { text: correctText, isCorrect: true },
    ...distractors.map((text) => ({ text, isCorrect: false }))
  ];

  // Deterministic shuffle so correct answers do not always map to the same option ID.
  const options = [...rawOptions];
  let state = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    state ^= seed.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }
  for (let i = options.length - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [options[i], options[j]] = [options[j], options[i]];
  }

  const optionIds = ['A', 'B', 'C', 'D'];
  return options.map((option, index) => ({
    id: optionIds[index],
    text: option.text,
    isCorrect: option.isCorrect
  }));
};

const mcq = (questionText, correctText, distractors) => {
  const options = makeOptions(correctText, distractors, questionText);
  const correctOption = options.find((option) => option.isCorrect);
  return {
    questionText,
    options: options.map(({ id, text }) => ({ id, text })),
    correctOptionId: correctOption ? correctOption.id : 'A'
  };
};

const questionBank = {
  // Frontend roles
  'React Developer': {
    beginner: [
      mcq(
        'What is JSX and how does it work?',
        'A syntax extension for JavaScript that compiles to React element calls.',
        [
          'A CSS framework that styles React components.',
          'A template language that runs only on the server.',
          'A browser API that directly updates the DOM.'
        ]
      ),
      mcq(
        'Explain the difference between state and props in React.',
        'State is internal mutable data; props are external read-only inputs.',
        [
          'State comes from parents while props are local to a component.',
          'Props are mutable and state is immutable.',
          'State is only for class components and props are only for hooks.'
        ]
      ),
      mcq(
        'How do React hooks improve component logic?',
        'They let function components use state and effects and reuse logic.',
        [
          'They replace JSX with template strings.',
          'They are required only for class components.',
          'They eliminate the need for the virtual DOM.'
        ]
      ),
      mcq(
        'What is the virtual DOM and why is it important?',
        'It is an in-memory UI tree used to compute efficient DOM updates.',
        [
          'It is a browser API for animations.',
          'It stores CSS variables for components.',
          'It replaces the actual DOM with a server-rendered HTML string.'
        ]
      ),
      mcq(
        'How do you handle forms in React?',
        'Use controlled components with state and onChange handlers.',
        [
          'Manipulate the DOM directly with document.querySelector.',
          'Use only uncontrolled inputs without any state.',
          'Store form values in localStorage only.'
        ]
      ),
      mcq(
        'Explain the lifecycle of a React component.',
        'Components mount, update, and unmount with effects for side work.',
        [
          'Components only mount once and never update.',
          'Lifecycle exists only in React Native.',
          'Lifecycle means CSS load, render, and paint phases.'
        ]
      ),
      mcq(
        'What is the difference between functional and class components?',
        'Function components use hooks; class components use this and lifecycle methods.',
        [
          'Class components cannot receive props.',
          'Function components must be stateful.',
          'Class components are required for routing.'
        ]
      ),
      mcq(
        'How do you pass data between components in React?',
        'Pass props down and lift state up with callbacks for child to parent.',
        [
          'Mutate global variables from child components.',
          'Use setTimeout to share data between components.',
          'Only use context and never props.'
        ]
      )
    ],
    intermediate: [
      mcq(
        'Explain React Context API and when to use it.',
        'It shares data across the tree without prop drilling for app-wide state.',
        [
          'It replaces useState for local component state.',
          'It is a server-side rendering tool.',
          'It is used to compile JSX.'
        ]
      ),
      mcq(
        'How would you optimize a slow React application?',
        'Memoize components, avoid unnecessary renders, and split code.',
        [
          'Disable the virtual DOM and render manually.',
          'Remove all keys from list rendering.',
          'Always use inline functions in JSX.'
        ]
      ),
      mcq(
        'What are controlled vs uncontrolled components?',
        'Controlled inputs are driven by React state; uncontrolled rely on the DOM.',
        [
          'Controlled inputs cannot be edited by users.',
          'Uncontrolled inputs must use Redux.',
          'There is no difference in React.'
        ]
      ),
      mcq(
        'Explain the difference between useEffect and useLayoutEffect.',
        'useEffect runs after paint; useLayoutEffect runs before paint.',
        [
          'useLayoutEffect runs only on the server.',
          'useEffect blocks rendering while useLayoutEffect is async.',
          'They are identical with no timing differences.'
        ]
      ),
      mcq(
        'How do you implement error boundaries in React?',
        'Use class components with componentDidCatch and getDerivedStateFromError.',
        [
          'Use try/catch around JSX in render.',
          'Use useEffect to catch all errors.',
          'Use only window.onerror events.'
        ]
      ),
      mcq(
        'What is React.memo and when should you use it?',
        'It memoizes a component to prevent re-rendering when props do not change.',
        [
          'It memoizes hooks so they run once.',
          'It replaces useMemo and useCallback.',
          'It is only for class components.'
        ]
      ),
      mcq(
        'How do you handle side effects in functional components?',
        'Use useEffect to manage side effects like data fetching.',
        [
          'Use useState because it handles side effects automatically.',
          'Only use componentDidMount in function components.',
          'Avoid side effects entirely in React.'
        ]
      ),
      mcq(
        'Explain the concept of custom hooks and provide an example.',
        'Custom hooks encapsulate reusable logic like useFetch for API calls.',
        [
          'They are only for styling components.',
          'They are required for class components.',
          'They replace context providers.'
        ]
      )
    ],
    advanced: [
      mcq(
        'Design a scalable state management solution for a large React application.',
        'Combine feature-based state, context for shared data, and a store like Redux.',
        [
          'Store everything in local component state only.',
          'Use global variables in window to share data.',
          'Avoid any state management and fetch on every render.'
        ]
      ),
      mcq(
        'Explain the reconciliation algorithm (diffing) in React.',
        'React compares virtual DOM trees and updates only changed nodes.',
        [
          'React always re-renders the entire DOM tree.',
          'React diffing compares CSS classes only.',
          'React uses server-side rendering for reconciliation.'
        ]
      ),
      mcq(
        'How would you implement server-side rendering with React?',
        'Render components to HTML on the server and hydrate on the client.',
        [
          'Run React only in the browser and export HTML at build time.',
          'Use iframe embeds to render React.',
          'Disable hydration and re-render from scratch on every request.'
        ]
      ),
      mcq(
        'Discuss performance optimization strategies for React applications.',
        'Use memoization, code splitting, virtualization, and profiling.',
        [
          'Always disable strict mode to speed up rendering.',
          'Remove keys from lists to reduce work.',
          'Use inline styles for all components.'
        ]
      ),
      mcq(
        'How do you handle concurrent rendering and Suspense in React 18?',
        'Use concurrent features like startTransition and Suspense for async UI.',
        [
          'Concurrent rendering replaces hooks entirely.',
          'Suspense only works with class components.',
          'React 18 does not support Suspense.'
        ]
      ),
      mcq(
        'Explain the principles behind React Fiber architecture.',
        'Fiber breaks rendering into units of work for better scheduling.',
        [
          'Fiber is a CSS layout engine.',
          'Fiber removes the need for the virtual DOM.',
          'Fiber only affects server-side rendering.'
        ]
      ),
      mcq(
        'How would you implement a custom hook for data fetching with caching?',
        'Store results in state or cache and return data, loading, and error.',
        [
          'Fetch data in render and ignore caching.',
          'Use setInterval to fetch every millisecond.',
          'Only use class components for fetching.'
        ]
      ),
      mcq(
        'Discuss testing strategies for complex React components.',
        'Use unit tests, integration tests with React Testing Library, and mocks.',
        [
          'Only use end-to-end tests and skip unit tests.',
          'Avoid tests and rely on manual checks.',
          'Only snapshot test every component.'
        ]
      )
    ]
  },

  'Angular Developer': {
    beginner: [
      mcq(
        'What is Angular and how does it differ from React?',
        'Angular is a full framework with DI and templates; React is a UI library.',
        [
          'Angular is only for mobile while React is only for desktop.',
          'Angular runs on the server and React runs only in browsers.',
          'Angular does not use TypeScript while React must use TypeScript.'
        ]
      ),
      mcq(
        'Explain the concept of dependency injection in Angular.',
        'DI provides instances via injectors instead of manual construction.',
        [
          'DI is a database pattern for Angular services.',
          'DI is only used for components, not services.',
          'DI means copying dependencies into each component.'
        ]
      ),
      mcq(
        'What are Angular directives? Provide examples.',
        'Directives add behavior to DOM, such as *ngIf and *ngFor.',
        [
          'Directives are CSS variables used by Angular.',
          'Directives are required only for routing.',
          'Directives are Angular CLI commands.'
        ]
      ),
      mcq(
        'How do you create and use services in Angular?',
        'Create injectable classes and provide them via modules or providers.',
        [
          'Services must be global variables in window.',
          'Services can only be created inside components.',
          'Services are created by templates using HTML tags.'
        ]
      ),
      mcq(
        'Explain two-way data binding in Angular.',
        '[(ngModel)] syncs data between the view and component.',
        [
          'It sends data only from component to view.',
          'It sends data only from view to component.',
          'It is only available in AngularJS.'
        ]
      ),
      mcq(
        'What is the difference between property binding and event binding?',
        'Property binding sets DOM properties; event binding listens to events.',
        [
          'Property binding listens to events; event binding sets DOM properties.',
          'They are identical features with different syntax.',
          'Both only work in services.'
        ]
      ),
      mcq(
        'How do you handle HTTP requests in Angular?',
        'Use HttpClient with observables for GET/POST requests.',
        [
          'Use jQuery AJAX in every component.',
          'Use localStorage only for network calls.',
          'Use DOM fetch without any Angular module.'
        ]
      ),
      mcq(
        'Explain the structure of an Angular module.',
        'Modules declare components, import dependencies, and provide services.',
        [
          'Modules only hold CSS files.',
          'Modules are optional and never used in Angular.',
          'Modules only define routes.'
        ]
      )
    ],
    intermediate: [
      mcq(
        'Explain RxJS observables and how they work in Angular.',
        'Observables represent async streams and can be subscribed to.',
        [
          'Observables are only for storing JSON data.',
          'Observables replace Angular templates.',
          'Observables are synchronous by default.'
        ]
      ),
      mcq(
        'How do you implement routing in a single-page application with Angular?',
        'Configure RouterModule with routes and use router-outlet.',
        [
          'Use window.location for every navigation.',
          'Use only hash fragments without RouterModule.',
          'Routing is done only with services and no templates.'
        ]
      ),
      mcq(
        'What are Angular guards and when would you use them?',
        'Guards control route access based on auth or conditions.',
        [
          'Guards style components with CSS.',
          'Guards are used only for HTTP requests.',
          'Guards run only on the server.'
        ]
      ),
      mcq(
        'Explain the difference between ChangeDetectionStrategy.OnPush and Default.',
        'OnPush checks on input changes; Default checks every cycle.',
        [
          'OnPush disables change detection entirely.',
          'Default only runs on manual triggers.',
          'They are identical strategies.'
        ]
      ),
      mcq(
        'How do you handle forms validation in Angular?',
        'Use reactive forms or template-driven validators.',
        [
          'Only validate in the backend and never in the UI.',
          'Validation is not supported in Angular.',
          'Use DOM APIs directly without Angular forms.'
        ]
      ),
      mcq(
        'What is interceptor and how does it work in Angular?',
        'HTTP interceptors modify requests or responses in a chain.',
        [
          'Interceptors are used for routing guards.',
          'Interceptors are CSS preprocessors.',
          'Interceptors are only for components.'
        ]
      ),
      mcq(
        'How do you communicate between sibling components in Angular?',
        'Use a shared service with observables or a state store.',
        [
          'Use global variables in window only.',
          'Directly call sibling component methods via DOM.',
          'Use only input bindings and avoid services.'
        ]
      ),
      mcq(
        'Explain lazy loading in Angular and its benefits.',
        'Load feature modules on demand to reduce initial bundle size.',
        [
          'Load all modules at startup for faster performance.',
          'Lazy loading is only for CSS.',
          'Lazy loading disables code splitting.'
        ]
      )
    ],
    advanced: [
      mcq(
        'Design a complex Angular application with multiple feature modules.',
        'Use core, shared, and feature modules with lazy-loaded routes.',
        [
          'Put every component into AppModule only.',
          'Avoid routing to keep it simple.',
          'Use modules only for CSS.'
        ]
      ),
      mcq(
        'Explain Angular\'s change detection strategy and optimization techniques.',
        'Use OnPush, trackBy, and avoid heavy bindings for performance.',
        [
          'Disable change detection permanently.',
          'Use setInterval to trigger updates continuously.',
          'Avoid templates and render with string concat.'
        ]
      ),
      mcq(
        'How would you implement real-time updates using WebSockets in Angular?',
        'Use a WebSocket service with RxJS to stream updates.',
        [
          'Use HTTP polling every millisecond.',
          'Use localStorage events as the primary real-time channel.',
          'Use Angular pipes only.'
        ]
      ),
      mcq(
        'Discuss state management patterns in Angular applications.',
        'Use services or NgRx for predictable state and actions.',
        [
          'Store all state in DOM elements.',
          'Use only global variables.',
          'Avoid state management entirely.'
        ]
      ),
      mcq(
        'How do you optimize Angular application performance?',
        'Use lazy loading, OnPush, and bundle optimization.',
        [
          'Remove all TypeScript types.',
          'Disable AOT compilation.',
          'Use sync XHR for all data.'
        ]
      ),
      mcq(
        'Explain Angular Ivy and its advantages over View Engine.',
        'Ivy improves build size and incremental compilation.',
        [
          'Ivy is a CSS framework.',
          'Ivy removes templates from Angular.',
          'Ivy is only for AngularJS.'
        ]
      ),
      mcq(
        'How would you implement custom form controls in Angular?',
        'Use ControlValueAccessor to integrate with Angular forms.',
        [
          'Create custom HTML tags without any API.',
          'Use only template variables and no TS.',
          'Use RxJS operators instead of form controls.'
        ]
      ),
      mcq(
        'Discuss testing strategies for Angular applications.',
        'Use unit tests with TestBed and integration/E2E tests.',
        [
          'Only test manually in production.',
          'Skip tests and rely on build logs.',
          'Only use snapshot tests for everything.'
        ]
      )
    ]
  },

  'Vue Developer': {
    beginner: [
      mcq(
        'What is Vue.js and what are its advantages?',
        'Vue is a progressive framework with approachable APIs and reactivity.',
        [
          'Vue is only a CSS library.',
          'Vue runs only on the server.',
          'Vue is a database engine.'
        ]
      ),
      mcq(
        'Explain the structure of a Vue component.',
        'It has template, script, and style sections.',
        [
          'It only contains HTML and no logic.',
          'It uses only a JSON file.',
          'It must be split into multiple files.'
        ]
      ),
      mcq(
        'What is the difference between v-bind and v-on?',
        'v-bind binds data to attributes; v-on listens to events.',
        [
          'v-bind is for events and v-on is for styles.',
          'They are identical directives.',
          'v-bind is only for routing.'
        ]
      ),
      mcq(
        'How does two-way binding work in Vue?',
        'Use v-model to sync input value with component state.',
        [
          'Use v-on only and no data binding.',
          'Use v-html for all inputs.',
          'Two-way binding is not available in Vue.'
        ]
      ),
      mcq(
        'What are computed properties and watchers?',
        'Computed derives values; watchers react to changes for side effects.',
        [
          'Watchers are used only for styling.',
          'Computed properties are always async.',
          'They are identical features.'
        ]
      ),
      mcq(
        'Explain Vue lifecycle hooks.',
        'Hooks like mounted and unmounted run at component lifecycle stages.',
        [
          'Hooks run only in Vuex.',
          'Hooks are CSS animations.',
          'Hooks are only for router navigation.'
        ]
      ),
      mcq(
        'How do you handle forms in Vue?',
        'Use v-model and validate input with computed or watchers.',
        [
          'Use only direct DOM manipulation.',
          'Store values in cookies only.',
          'Forms are not supported in Vue.'
        ]
      ),
      mcq(
        'What is Vue Router and how do you use it?',
        'Vue Router provides SPA navigation with routes and <router-view>.',
        [
          'Vue Router is a CSS framework.',
          'Vue Router is used for state management only.',
          'Vue Router replaces Vue components.'
        ]
      )
    ],
    intermediate: [
      mcq(
        'Explain the Vue 3 Composition API vs Options API.',
        'Composition API groups logic by feature; Options groups by option.',
        [
          'Options API is only for TypeScript.',
          'Composition API only works in Vue 2.',
          'They produce different rendering engines.'
        ]
      ),
      mcq(
        'How do you manage global state in Vue with Pinia?',
        'Create Pinia stores and use them across components.',
        [
          'Use global variables in window.',
          'Use only local component state.',
          'Pinia is a routing library.'
        ]
      ),
      mcq(
        'What are slots and scoped slots in Vue?',
        'Slots allow content projection; scoped slots pass data to slot content.',
        [
          'Slots are only for CSS.',
          'Scoped slots are deprecated in Vue 3.',
          'Slots are used only for routing.'
        ]
      ),
      mcq(
        'How do you handle animations and transitions in Vue?',
        'Use the <transition> component and CSS or JS hooks.',
        [
          'Use only inline styles with no components.',
          'Animations are not supported in Vue.',
          'Use v-bind for animations.'
        ]
      ),
      mcq(
        'Explain mixins and composables in Vue.',
        'Mixins share options; composables share logic via functions.',
        [
          'Mixins are required for templates.',
          'Composables are CSS utilities.',
          'Mixins replace Vue Router.'
        ]
      ),
      mcq(
        'How do you optimize Vue application performance?',
        'Use lazy loading, keep components small, and cache computed results.',
        [
          'Disable reactivity to improve performance.',
          'Always render everything on every update.',
          'Avoid using keys in lists.'
        ]
      ),
      mcq(
        'What is teleport in Vue 3?',
        'Teleport renders content in a different DOM location.',
        [
          'Teleport replaces Vuex for state.',
          'Teleport is a build tool.',
          'Teleport is a router feature.'
        ]
      ),
      mcq(
        'How do you handle async operations in Vue?',
        'Use async/await in methods and manage loading/error state.',
        [
          'Use only computed properties for async.',
          'Async operations are not supported.',
          'Only use synchronous XHR.'
        ]
      )
    ],
    advanced: [
      mcq(
        'Design a Vue application with complex state management using Pinia.',
        'Split stores by domain and use actions/getters for shared logic.',
        [
          'Store everything in a single global variable.',
          'Avoid stores and pass props across the entire tree.',
          'Use only localStorage for state.'
        ]
      ),
      mcq(
        'How would you implement server-side rendering with Vue?',
        'Render on the server and hydrate on the client.',
        [
          'Use iframes to render Vue.',
          'Disable hydration and render twice.',
          'Only use client-side rendering.'
        ]
      ),
      mcq(
        'Explain the Vue 3 reactivity system and proxy mechanism.',
        'Vue 3 uses ES Proxy to track dependencies and trigger updates.',
        [
          'Vue 3 stores data in the DOM.',
          'Vue 3 uses only getters/setters for arrays.',
          'Vue 3 does not track reactivity.'
        ]
      ),
      mcq(
        'How would you create a custom Vue plugin?',
        'Expose an install method to add global features.',
        [
          'Write a CSS file and call it a plugin.',
          'Only use mixins to create plugins.',
          'Plugins are not supported in Vue 3.'
        ]
      ),
      mcq(
        'Discuss performance optimization strategies for Vue applications.',
        'Use code splitting, memoization, and component caching.',
        [
          'Disable reactivity entirely.',
          'Remove keys in list rendering.',
          'Always use watchers for everything.'
        ]
      ),
      mcq(
        'How would you implement real-time features in a Vue application?',
        'Use WebSockets or SSE with reactive state updates.',
        [
          'Use only localStorage events.',
          'Use setInterval every millisecond.',
          'Disable reactivity for real-time.'
        ]
      ),
      mcq(
        'Explain render functions and JSX in Vue 3.',
        'Render functions allow programmatic VNode creation; JSX is optional syntax.',
        [
          'Render functions replace components entirely.',
          'JSX is required to use Vue 3.',
          'Render functions only run on the server.'
        ]
      ),
      mcq(
        'How do you handle complex form validation in Vue?',
        'Use validation libraries or custom rules with reactive state.',
        [
          'Only validate on the backend.',
          'Use watchers only and no form state.',
          'Disable validation for performance.'
        ]
      )
    ]
  },

  // Backend roles
  'Java Developer': {
    beginner: [
      mcq(
        'What is the difference between JDK, JRE, and JVM?',
        'JDK includes tools, JRE runs apps, JVM executes bytecode.',
        [
          'JVM includes the compiler while JDK is only for runtime.',
          'JRE is a programming language, JDK is the VM.',
          'They are all the same thing.'
        ]
      ),
      mcq(
        'Explain the concept of object-oriented programming in Java.',
        'OOP models real-world entities using objects with data and behavior.',
        [
          'OOP is only about functional programming.',
          'OOP avoids classes and objects.',
          'OOP is only about databases.'
        ]
      ),
      mcq(
        'What are the four pillars of OOP?',
        'Encapsulation, inheritance, polymorphism, abstraction.',
        [
          'Compilation, interpretation, linking, execution.',
          'Threads, processes, sockets, files.',
          'Arrays, lists, maps, sets.'
        ]
      ),
      mcq(
        'Explain the difference between abstract classes and interfaces.',
        'Abstract classes can have state; interfaces define contracts.',
        [
          'Interfaces can have constructors and fields only.',
          'Abstract classes cannot have methods.',
          'Interfaces are only for data models.'
        ]
      ),
      mcq(
        'What is exception handling and why is it important?',
        'It handles runtime errors safely using try/catch to avoid crashes.',
        [
          'It prevents compilation errors.',
          'It is used only for logging.',
          'It is optional and never needed.'
        ]
      ),
      mcq(
        'Explain the concept of inheritance in Java.',
        'Inheritance lets a class reuse and extend another class.',
        [
          'Inheritance copies objects at runtime.',
          'Inheritance is only for interfaces.',
          'Inheritance removes code reuse.'
        ]
      ),
      mcq(
        'What is polymorphism and provide examples.',
        'Polymorphism allows different implementations via the same interface.',
        [
          'Polymorphism is only overloading variables.',
          'Polymorphism means only one method per class.',
          'Polymorphism is a database concept.'
        ]
      ),
      mcq(
        'How do collections work in Java?',
        'Collections are data structures like List, Set, and Map.',
        [
          'Collections store only primitive types.',
          'Collections are only arrays.',
          'Collections are used only for IO.'
        ]
      )
    ],
    intermediate: [
      mcq(
        'Explain the Java memory model and garbage collection.',
        'The JVM manages heap memory and GC reclaims unused objects.',
        [
          'Memory is managed manually with free calls.',
          'GC is only for stack memory.',
          'JMM only applies to IO.'
        ]
      ),
      mcq(
        'What are streams in Java 8 and how do they work?',
        'Streams process collections with lazy, functional operations.',
        [
          'Streams are only for file IO.',
          'Streams mutate the original collection by default.',
          'Streams are the same as threads.'
        ]
      ),
      mcq(
        'Explain lambda expressions and functional interfaces.',
        'Lambdas implement single-abstract-method interfaces concisely.',
        [
          'Lambdas replace classes entirely.',
          'Functional interfaces have multiple abstract methods.',
          'Lambdas are only for primitives.'
        ]
      ),
      mcq(
        'What is the difference between checked and unchecked exceptions?',
        'Checked are compile-time enforced; unchecked are runtime exceptions.',
        [
          'Unchecked are required to be declared.',
          'Checked exceptions are thrown only by JVM.',
          'There is no difference.'
        ]
      ),
      mcq(
        'How do you implement threading in Java?',
        'Use Thread, Runnable, or ExecutorService for concurrency.',
        [
          'Use only static methods.',
          'Java does not support threading.',
          'Use Thread for IO only.'
        ]
      ),
      mcq(
        'Explain the concept of synchronization in Java.',
        'Synchronization controls access to shared resources with locks.',
        [
          'Synchronization speeds up every program.',
          'Synchronization means using only async code.',
          'Synchronization is only for databases.'
        ]
      ),
      mcq(
        'What are design patterns and name a few?',
        'Reusable solutions like Singleton, Factory, Observer.',
        [
          'Patterns are only UI templates.',
          'Patterns are compiler flags.',
          'Patterns replace testing.'
        ]
      ),
      mcq(
        'How do you handle file I/O in Java?',
        'Use java.io or java.nio classes for reading and writing files.',
        [
          'Use only System.out for file IO.',
          'Java cannot read files.',
          'File IO is done only in the JVM config.'
        ]
      )
    ],
    advanced: [
      mcq(
        'Design a scalable Java application with microservices architecture.',
        'Decompose services by domain with APIs, discovery, and resilience.',
        [
          'Use a single monolith with all concerns in one class.',
          'Avoid APIs and use shared databases only.',
          'Only use client-side logic for scaling.'
        ]
      ),
      mcq(
        'Explain the Java memory model and volatile keyword.',
        'Volatile ensures visibility of changes across threads.',
        [
          'Volatile makes variables immutable.',
          'Volatile prevents all race conditions.',
          'Volatile only works on arrays.'
        ]
      ),
      mcq(
        'How would you implement a thread-safe singleton pattern?',
        'Use enum singleton or double-checked locking with volatile.',
        [
          'Use a public static variable only.',
          'Use no synchronization.',
          'Create a new instance per call.'
        ]
      ),
      mcq(
        'Discuss JVM optimization techniques.',
        'Tune GC, use profiling, and adjust heap settings.',
        [
          'Disable GC entirely.',
          'Use only default settings for all workloads.',
          'Avoid profiling tools.'
        ]
      ),
      mcq(
        'Explain reflection in Java and its applications.',
        'Reflection inspects classes at runtime for frameworks and tooling.',
        [
          'Reflection is used only for file IO.',
          'Reflection is a JVM error state.',
          'Reflection is required for primitives.'
        ]
      ),
      mcq(
        'How do you implement custom annotations in Java?',
        'Define @interface with retention and target meta-annotations.',
        [
          'Use only XML for annotations.',
          'Annotations cannot be custom.',
          'Only use annotations in tests.'
        ]
      ),
      mcq(
        'Discuss concurrency patterns and best practices.',
        'Use thread pools, immutability, and avoid shared mutable state.',
        [
          'Use a single thread for all workloads.',
          'Share all state without locks.',
          'Avoid synchronization in all cases.'
        ]
      ),
      mcq(
        'How would you implement a custom classloader?',
        'Extend ClassLoader and override findClass to load bytes.',
        [
          'Use reflection to create classes.',
          'Modify the JVM source code.',
          'Only use the system classloader.'
        ]
      )
    ]
  },

  'Python Developer': {
    beginner: [
      mcq(
        'What are the key features of Python?',
        'Readable syntax, dynamic typing, and rich standard library.',
        [
          'Python requires manual memory management.',
          'Python is statically typed only.',
          'Python cannot run on servers.'
        ]
      ),
      mcq(
        'Explain the difference between list, tuple, and dictionary.',
        'Lists are mutable, tuples are immutable, dicts map keys to values.',
        [
          'Lists are immutable and tuples are mutable.',
          'Dictionaries store only indexed arrays.',
          'Tuples are only for strings.'
        ]
      ),
      mcq(
        'What is a virtual environment and why is it important?',
        'It isolates project dependencies and Python versions.',
        [
          'It is a Docker container only.',
          'It speeds up CPU performance.',
          'It replaces pip.'
        ]
      ),
      mcq(
        'Explain the concept of decorators in Python.',
        'Decorators wrap functions to add behavior without changing code.',
        [
          'Decorators are used only for UI styling.',
          'Decorators remove functions at runtime.',
          'Decorators are only for classes.'
        ]
      ),
      mcq(
        'What are list comprehensions and why are they useful?',
        'They provide concise syntax to create lists from iterables.',
        [
          'They replace functions entirely.',
          'They are only for tuples.',
          'They are slower than for-loops always.'
        ]
      ),
      mcq(
        'How do you handle exceptions in Python?',
        'Use try/except/finally to catch and handle errors.',
        [
          'Use if statements only.',
          'Exceptions are ignored by default.',
          'Exceptions must be declared in function signatures.'
        ]
      ),
      mcq(
        'Explain the difference between args and kwargs.',
        '*args captures positional args; **kwargs captures keyword args.',
        [
          '*args is only for strings.',
          '**kwargs is required for class methods.',
          'They are identical.'
        ]
      ),
      mcq(
        'What is the GIL (Global Interpreter Lock)?',
        'It allows only one thread to execute Python bytecode at a time.',
        [
          'It is a garbage collector.',
          'It locks files only.',
          'It is a network protocol.'
        ]
      )
    ],
    intermediate: [
      mcq(
        'Explain generators and iterators in Python.',
        'Iterators provide __next__, generators yield values lazily.',
        [
          'Generators are only for lists.',
          'Iterators always store all items in memory.',
          'Generators cannot be iterated.'
        ]
      ),
      mcq(
        'What are metaclasses and when would you use them?',
        'Metaclasses define class creation behavior for advanced use cases.',
        [
          'Metaclasses are only for JSON parsing.',
          'Metaclasses replace instances.',
          'Metaclasses are deprecated.'
        ]
      ),
      mcq(
        'How do you implement design patterns in Python?',
        'Use classes, functions, and duck typing to model patterns.',
        [
          'Patterns are not possible in Python.',
          'Only use inheritance for all patterns.',
          'Use global variables for patterns.'
        ]
      ),
      mcq(
        'Explain the difference between deep copy and shallow copy.',
        'Shallow copies references; deep copies duplicate nested objects.',
        [
          'Deep copy is only for strings.',
          'Shallow copy duplicates everything.',
          'They are identical.'
        ]
      ),
      mcq(
        'What is the difference between __init__ and __new__?',
        '__new__ creates instances; __init__ initializes them.',
        [
          '__init__ is called before class creation.',
          '__new__ is only for lists.',
          'They are identical.'
        ]
      ),
      mcq(
        'How do you handle async programming in Python?',
        'Use async/await with asyncio event loop.',
        [
          'Use only threads and no async.',
          'Async is not supported in Python.',
          'Use time.sleep for async.'
        ]
      ),
      mcq(
        'Explain context managers (with statement) in Python.',
        'They manage setup/cleanup with __enter__ and __exit__.',
        [
          'They are only for logging.',
          'They replace functions.',
          'They are only for classes.'
        ]
      ),
      mcq(
        'What are monkey patches and how do you use them?',
        'They modify or replace functions at runtime.',
        [
          'They are a testing framework.',
          'They are Python syntax errors.',
          'They only apply to C extensions.'
        ]
      )
    ],
    advanced: [
      mcq(
        'Design a scalable Python application with async/await.',
        'Use asyncio, async IO, and decouple services for scale.',
        [
          'Use blocking IO everywhere.',
          'Use only threads for network tasks.',
          'Avoid event loops entirely.'
        ]
      ),
      mcq(
        'Explain Python\'s memory management and garbage collection.',
        'Python uses reference counting plus cyclic GC.',
        [
          'Python uses manual free calls.',
          'Python does not use garbage collection.',
          'Python only uses stack memory.'
        ]
      ),
      mcq(
        'How would you optimize a CPU-bound Python application?',
        'Use multiprocessing or native extensions to bypass the GIL.',
        [
          'Use more threads for CPU work.',
          'Use async IO for CPU work.',
          'Use only a single thread.'
        ]
      ),
      mcq(
        'Discuss multiprocessing vs multithreading in Python.',
        'Multiprocessing uses separate processes; threads share memory.',
        [
          'Threads are faster for CPU-bound tasks in Python.',
          'Processes share the same GIL.',
          'They are identical.'
        ]
      ),
      mcq(
        'How do you implement custom descriptors in Python?',
        'Define __get__, __set__, and __delete__ methods.',
        [
          'Use only properties and no special methods.',
          'Descriptors are for async only.',
          'Descriptors replace classes.'
        ]
      ),
      mcq(
        'Explain metaclasses and class decorators in detail.',
        'Metaclasses control class creation; decorators wrap class definitions.',
        [
          'Decorators only work on functions.',
          'Metaclasses are only for Python 2.',
          'They are the same feature.'
        ]
      ),
      mcq(
        'How would you create a Python package and publish it?',
        'Create setup/pyproject, build a wheel, and upload to PyPI.',
        [
          'Zip files and email them.',
          'Only use a requirements.txt file.',
          'Packages can only be installed from GitHub.'
        ]
      ),
      mcq(
        'Discuss testing strategies and frameworks in Python.',
        'Use pytest/unittest with unit and integration tests.',
        [
          'Only test manually in production.',
          'Avoid tests entirely.',
          'Use only print statements.'
        ]
      )
    ]
  },

  'Node.js Developer': {
    beginner: [
      mcq(
        'What is Node.js and why is it used for backend development?',
        'It is a JS runtime on V8 enabling non-blocking server apps.',
        [
          'It is a browser-only library.',
          'It is a CSS framework.',
          'It is a database engine.'
        ]
      ),
      mcq(
        'Explain the event loop in Node.js.',
        'It handles async callbacks and non-blocking IO.',
        [
          'It is a UI rendering engine.',
          'It runs only once per process and stops.',
          'It replaces HTTP servers.'
        ]
      ),
      mcq(
        'What is npm and what are package.json files?',
        'npm manages packages; package.json defines dependencies and scripts.',
        [
          'npm is only for frontend CSS.',
          'package.json stores database data.',
          'npm is a file system.'
        ]
      ),
      mcq(
        'Explain callbacks, promises, and async/await.',
        'They are async patterns: callbacks, thenable promises, and await syntax.',
        [
          'They are different names for the same sync API.',
          'Promises replace HTTP servers.',
          'Async/await only works in browsers.'
        ]
      ),
      mcq(
        'What is the difference between synchronous and asynchronous code?',
        'Sync blocks execution; async allows other work while waiting.',
        [
          'Async always runs faster than sync.',
          'Sync uses only callbacks.',
          'They are identical in Node.js.'
        ]
      ),
      mcq(
        'How do you create a simple HTTP server in Node.js?',
        'Use the http module and listen on a port.',
        [
          'Use only the fs module.',
          'Use the browser fetch API.',
          'Use CSS to create servers.'
        ]
      ),
      mcq(
        'Explain middleware in Express.js.',
        'Middleware are functions that process requests in a chain.',
        [
          'Middleware is only for database queries.',
          'Middleware runs only on the client.',
          'Middleware is a type of database.'
        ]
      ),
      mcq(
        'What is the difference between require and import?',
        'require is CommonJS; import is ES module syntax.',
        [
          'import only works in Node 6.',
          'require is only for CSS files.',
          'They are identical and interchangeable always.'
        ]
      )
    ],
    intermediate: [
      mcq(
        'How do you handle errors in asynchronous Node.js code?',
        'Use try/catch with async/await or handle promise rejections.',
        [
          'Ignore errors in async code.',
          'Use only console.log.',
          'Errors cannot happen in async code.'
        ]
      ),
      mcq(
        'Explain the concept of streams in Node.js.',
        'Streams process data in chunks for efficient IO.',
        [
          'Streams are only for CSS files.',
          'Streams store all data in memory first.',
          'Streams are synchronous only.'
        ]
      ),
      mcq(
        'What is middleware chaining in Express?',
        'Multiple middleware run in order via next().',
        [
          'Only one middleware can run per route.',
          'Chaining is used only for error handlers.',
          'Chaining is not supported in Express.'
        ]
      ),
      mcq(
        'How do you implement authentication in Node.js?',
        'Use sessions or JWT with hashed passwords.',
        [
          'Store passwords in plain text.',
          'Use query strings for passwords.',
          'Avoid authentication for APIs.'
        ]
      ),
      mcq(
        'Explain clustering in Node.js and when to use it.',
        'Clustering uses multiple processes to utilize CPU cores.',
        [
          'Clustering is only for databases.',
          'Clustering is used to compress assets.',
          'Clustering only runs on the client.'
        ]
      ),
      mcq(
        'What is the difference between process and worker threads?',
        'Processes have separate memory; worker threads share memory.',
        [
          'Worker threads are slower for IO.',
          'Processes share the same memory space.',
          'They are the same feature.'
        ]
      ),
      mcq(
        'How do you optimize Node.js application performance?',
        'Use caching, avoid blocking IO, and profile hotspots.',
        [
          'Use sync IO everywhere.',
          'Disable caching and use only fresh queries.',
          'Use setTimeout for all operations.'
        ]
      ),
      mcq(
        'Explain the concept of JWT and how it works.',
        'JWT is a signed token containing claims for auth.',
        [
          'JWT stores passwords in plain text.',
          'JWT is an encryption algorithm only.',
          'JWT is a database protocol.'
        ]
      )
    ],
    advanced: [
      mcq(
        'Design a scalable Node.js application with microservices.',
        'Split services by domain and use APIs, queues, and discovery.',
        [
          'Use one huge service with no boundaries.',
          'Avoid APIs and use shared files.',
          'Only scale the database and ignore services.'
        ]
      ),
      mcq(
        'Explain the event loop in detail and optimization strategies.',
        'Avoid blocking, use worker threads, and monitor event loop lag.',
        [
          'Use sync code to avoid callbacks.',
          'Block the loop for heavy CPU tasks.',
          'Event loop cannot be optimized.'
        ]
      ),
      mcq(
        'How would you implement real-time features using WebSockets?',
        'Use a WebSocket server and broadcast updates to clients.',
        [
          'Use only HTTP GET requests.',
          'Use database triggers as sockets.',
          'Use cron jobs for real-time UI.'
        ]
      ),
      mcq(
        'Discuss database optimization strategies in Node.js.',
        'Use indexes, query optimization, and connection pooling.',
        [
          'Use only full table scans.',
          'Disable caching entirely.',
          'Avoid indexes to simplify queries.'
        ]
      ),
      mcq(
        'How do you implement caching strategies in Node.js?',
        'Use in-memory or Redis caches with TTL and invalidation.',
        [
          'Store cache in source files.',
          'Never invalidate cache.',
          'Use only cookies for caching.'
        ]
      ),
      mcq(
        'Explain worker threads and clustering for scalability.',
        'Worker threads handle CPU tasks; clustering scales processes.',
        [
          'Worker threads replace the event loop.',
          'Clustering is only for front-end apps.',
          'Neither helps scalability.'
        ]
      ),
      mcq(
        'How would you implement rate limiting and security?',
        'Use middleware with token buckets and apply security headers.',
        [
          'Store limits in cookies only.',
          'Disable authentication for rate limiting.',
          'Use a single IP allowlist for all users.'
        ]
      ),
      mcq(
        'Discuss deployment and DevOps considerations for Node.js.',
        'Use CI/CD, monitoring, and containerized deployments.',
        [
          'Deploy by copying files manually every time.',
          'Avoid logging to reduce overhead.',
          'Skip health checks entirely.'
        ]
      )
    ]
  },

  // Full Stack roles
  'Full Stack Developer': {
    beginner: [
      mcq(
        'What is the difference between frontend and backend development?',
        'Frontend builds UI; backend handles data, logic, and APIs.',
        [
          'Frontend is only for databases.',
          'Backend is only for CSS.',
          'There is no difference.'
        ]
      ),
      mcq(
        'Explain the MVC (Model-View-Controller) architecture.',
        'Model handles data, View UI, Controller logic/requests.',
        [
          'MVC stands for Model-Value-Class.',
          'MVC is only for database design.',
          'MVC replaces APIs.'
        ]
      ),
      mcq(
        'What is REST API and how does it work?',
        'REST uses HTTP methods to operate on resources.',
        [
          'REST is a database query language.',
          'REST only works with WebSockets.',
          'REST is a UI pattern.'
        ]
      ),
      mcq(
        'Explain the concept of databases and SQL.',
        'Databases store data; SQL queries relational tables.',
        [
          'SQL is only for NoSQL databases.',
          'Databases are only in memory.',
          'SQL replaces APIs.'
        ]
      ),
      mcq(
        'What is authentication and authorization?',
        'Authentication verifies identity; authorization controls access.',
        [
          'Authorization verifies identity.',
          'They are identical concepts.',
          'Authentication only works for admins.'
        ]
      ),
      mcq(
        'How do you handle forms between frontend and backend?',
        'Validate on client and server and submit via API.',
        [
          'Send forms by email only.',
          'Avoid validation entirely.',
          'Store form data in HTML only.'
        ]
      ),
      mcq(
        'Explain the concept of APIs.',
        'APIs define how clients interact with services or data.',
        [
          'APIs are only used for databases.',
          'APIs are CSS frameworks.',
          'APIs are only for mobile.'
        ]
      ),
      mcq(
        'What is JSON and why is it important?',
        'JSON is a lightweight data format for APIs and config.',
        [
          'JSON is a database engine.',
          'JSON is only for HTML.',
          'JSON cannot be parsed by JS.'
        ]
      )
    ],
    intermediate: [
      mcq(
        'How do you design a scalable application architecture?',
        'Use layered design, caching, and stateless services.',
        [
          'Put all logic in one server.',
          'Avoid caching and queues.',
          'Store all state in the UI only.'
        ]
      ),
      mcq(
        'Explain database normalization and indexing.',
        'Normalization reduces redundancy; indexing speeds queries.',
        [
          'Normalization increases duplication.',
          'Indexes slow down every query.',
          'They are only for NoSQL.'
        ]
      ),
      mcq(
        'What are the security best practices for web applications?',
        'Use input validation, auth, HTTPS, and least privilege.',
        [
          'Store secrets in client-side code.',
          'Disable HTTPS for performance.',
          'Ignore OWASP guidance.'
        ]
      ),
      mcq(
        'How do you implement pagination and filtering?',
        'Use limit/offset or cursor-based pagination with query filters.',
        [
          'Return all data always.',
          'Paginate only on the client without server support.',
          'Use only random sampling.'
        ]
      ),
      mcq(
        'Explain the concept of caching and its benefits.',
        'Caching stores frequent data to reduce latency and load.',
        [
          'Caching increases latency.',
          'Caching is only for databases.',
          'Caching is the same as logging.'
        ]
      ),
      mcq(
        'How do you handle file uploads in web applications?',
        'Use multipart forms, validate files, and store securely.',
        [
          'Allow any file without validation.',
          'Store uploads in cookies only.',
          'Disable file size limits.'
        ]
      ),
      mcq(
        'What is load balancing and when do you need it?',
        'It distributes traffic across servers for reliability and scale.',
        [
          'It stores data in multiple formats.',
          'It is only for databases.',
          'It is unnecessary for any app.'
        ]
      ),
      mcq(
        'Explain the difference between SQL and NoSQL databases.',
        'SQL is relational with schemas; NoSQL is flexible and varied models.',
        [
          'NoSQL always uses SQL queries.',
          'SQL cannot scale horizontally.',
          'They are identical.'
        ]
      )
    ],
    advanced: [
      mcq(
        'Design a complete full-stack application with complex features.',
        'Use modular services, APIs, and a robust frontend with state management.',
        [
          'Use a single HTML file for everything.',
          'Avoid any backend and store data in localStorage.',
          'Skip authentication for complex apps.'
        ]
      ),
      mcq(
        'Explain microservices architecture and its benefits.',
        'Microservices split domains into independent deployable services.',
        [
          'Microservices means one big monolith.',
          'Microservices only work in the browser.',
          'Microservices remove the need for APIs.'
        ]
      ),
      mcq(
        'How do you implement real-time synchronization?',
        'Use WebSockets/SSE and consistent state updates.',
        [
          'Use only periodic full page reloads.',
          'Store updates in cookies only.',
          'Avoid synchronization entirely.'
        ]
      ),
      mcq(
        'Discuss database optimization and query tuning.',
        'Use indexes, analyze queries, and optimize schema.',
        [
          'Avoid indexes to keep queries simple.',
          'Use full table scans always.',
          'Never monitor query performance.'
        ]
      ),
      mcq(
        'How do you implement distributed systems and caching?',
        'Use shared caches like Redis and consistent hashing.',
        [
          'Use local variables for cache across servers.',
          'Disable caching to avoid inconsistencies.',
          'Store cache in source code.'
        ]
      ),
      mcq(
        'Explain DevOps practices and CI/CD pipelines.',
        'Automate build, test, and deploy with pipelines.',
        [
          'Deploy manually without tests.',
          'Skip monitoring and alerts.',
          'Avoid version control.'
        ]
      ),
      mcq(
        'How would you scale an application for millions of users?',
        'Scale horizontally, use caching, and optimize databases.',
        [
          'Buy a single larger server only.',
          'Disable caching to keep data fresh.',
          'Avoid load balancing.'
        ]
      ),
      mcq(
        'Discuss security best practices at scale.',
        'Use layered security, monitoring, and least privilege.',
        [
          'Store secrets in client-side code.',
          'Disable logging to hide errors.',
          'Use a single admin account for all.'
        ]
      )
    ]
  },

  // DevOps/Infrastructure
  'DevOps Engineer': {
    beginner: [
      mcq(
        'What is DevOps and its core principles?',
        'DevOps blends dev and ops for collaboration, automation, and CI/CD.',
        [
          'DevOps is only a tool.',
          'DevOps replaces developers with admins.',
          'DevOps means avoiding automation.'
        ]
      ),
      mcq(
        'Explain containerization and Docker.',
        'Containers package apps with dependencies using Docker images.',
        [
          'Containers are the same as virtual machines.',
          'Docker is a programming language.',
          'Containers only store databases.'
        ]
      ),
      mcq(
        'What is version control and why is it important?',
        'It tracks code changes and enables collaboration.',
        [
          'It is only for backups.',
          'It slows down development.',
          'It is optional for teams.'
        ]
      ),
      mcq(
        'Explain the concept of CI/CD pipelines.',
        'Automated build, test, and deploy stages for software delivery.',
        [
          'Manual release notes only.',
          'CI/CD means only deployment without tests.',
          'CI/CD replaces version control.'
        ]
      ),
      mcq(
        'What is the difference between VMs and containers?',
        'VMs virtualize hardware; containers share host OS kernel.',
        [
          'Containers are heavier than VMs.',
          'VMs cannot run Linux.',
          'They are identical.'
        ]
      ),
      mcq(
        'Explain IaC (Infrastructure as Code).',
        'IaC manages infra with declarative code like Terraform.',
        [
          'IaC is a manual checklist.',
          'IaC is only for UI.',
          'IaC replaces monitoring.'
        ]
      ),
      mcq(
        'What is load balancing and its importance?',
        'It distributes traffic for reliability and performance.',
        [
          'It stores logs only.',
          'It is only for databases.',
          'It is never needed.'
        ]
      ),
      mcq(
        'Explain the basics of Kubernetes.',
        'Kubernetes orchestrates containers with pods, services, and deployments.',
        [
          'Kubernetes is a CI tool only.',
          'Kubernetes replaces Docker.',
          'Kubernetes is a database engine.'
        ]
      )
    ],
    intermediate: [
      mcq(
        'How do you design a robust CI/CD pipeline?',
        'Include build, tests, security checks, and staged deployments.',
        [
          'Deploy directly to production always.',
          'Skip tests for faster releases.',
          'Use manual scripts only.'
        ]
      ),
      mcq(
        'Explain Kubernetes architecture and components.',
        'Control plane manages nodes; pods run workloads.',
        [
          'Kubernetes only runs on a single machine.',
          'Pods are databases.',
          'Nodes are unused in Kubernetes.'
        ]
      ),
      mcq(
        'What are monitoring and logging best practices?',
        'Use centralized logs, metrics, and alerting dashboards.',
        [
          'Store logs only on local disks.',
          'Avoid alerts to reduce noise.',
          'Disable metrics collection.'
        ]
      ),
      mcq(
        'Explain the concept of blue-green deployments.',
        'Run two environments and switch traffic to the new version.',
        [
          'Deploy only at night with no testing.',
          'Use one environment and overwrite in place.',
          'Blue-green is a CSS theme.'
        ]
      ),
      mcq(
        'How do you implement security in cloud environments?',
        'Use least privilege, network controls, and encryption.',
        [
          'Store secrets in code.',
          'Disable MFA.',
          'Open all ports for simplicity.'
        ]
      ),
      mcq(
        'Explain horizontal vs vertical scaling.',
        'Horizontal adds instances; vertical adds resources to one instance.',
        [
          'Horizontal means adding RAM only.',
          'Vertical means adding more servers.',
          'They are identical.'
        ]
      ),
      mcq(
        'What is a service mesh and why would you use it?',
        'It manages service-to-service traffic with observability and security.',
        [
          'It is a database schema.',
          'It is only for UI components.',
          'It replaces container orchestration.'
        ]
      ),
      mcq(
        'How do you handle secrets management?',
        'Use vaults or secret managers with rotation and access control.',
        [
          'Store secrets in Git.',
          'Share secrets over email.',
          'Use plain text files in the repo.'
        ]
      )
    ],
    advanced: [
      mcq(
        'Design a highly available Kubernetes cluster at scale.',
        'Use multiple control plane nodes, autoscaling, and multi-zone setup.',
        [
          'Use a single node cluster only.',
          'Disable health checks.',
          'Avoid redundancy to reduce cost.'
        ]
      ),
      mcq(
        'Explain advanced networking in Kubernetes.',
        'Use CNI plugins, network policies, and ingress/egress controls.',
        [
          'Use only host networking for all pods.',
          'Disable network policies.',
          'Use SSH for all service routing.'
        ]
      ),
      mcq(
        'How do you implement disaster recovery strategies?',
        'Use backups, multi-region setups, and recovery drills.',
        [
          'Only keep backups on a single server.',
          'Skip recovery testing.',
          'Avoid documentation.'
        ]
      ),
      mcq(
        'Discuss cost optimization for cloud infrastructure.',
        'Use autoscaling, right-sizing, and reserved instances.',
        [
          'Overprovision for safety only.',
          'Avoid monitoring costs.',
          'Use largest instances always.'
        ]
      ),
      mcq(
        'Explain advanced monitoring and observability.',
        'Combine metrics, logs, traces, and SLOs for insights.',
        [
          'Only use logs and ignore metrics.',
          'Disable tracing to reduce overhead.',
          'Avoid alerting for stability.'
        ]
      ),
      mcq(
        'How would you implement GitOps workflows?',
        'Use Git as source of truth with automated reconciliations.',
        [
          'Deploy manually on each server.',
          'Store configs on local machines only.',
          'Avoid version control for ops.'
        ]
      ),
      mcq(
        'Discuss security hardening at infrastructure level.',
        'Use patching, segmentation, and least privilege controls.',
        [
          'Disable firewalls to avoid conflicts.',
          'Use default passwords.',
          'Allow all inbound traffic.'
        ]
      ),
      mcq(
        'How do you manage multi-region deployments?',
        'Use global traffic routing and replicate data strategically.',
        [
          'Use one region only and ignore latency.',
          'Disable replication to save costs.',
          'Manually sync files with email.'
        ]
      )
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

const normalizeQuestionText = (question) => {
  if (!question) {
    return '';
  }
  return typeof question === 'string' ? question : question.questionText;
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
  const excludedSet = new Set((excludedQuestions || []).map((q) => normalizeQuestionText(q)));
  const filteredPool = basePool.filter((q) => !excludedSet.has(normalizeQuestionText(q)));
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

module.exports = {
  getAllRoles,
  getQuestions,
  getAllDifficulties
};
