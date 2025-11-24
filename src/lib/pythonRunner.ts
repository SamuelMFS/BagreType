import { loadPyodide, PyodideInterface } from 'pyodide';

/**
 * Python Runner for Genetic Algorithm Keyboard Layout Generation
 * 
 * NOTE: This currently uses a simplified GA implementation for browser execution.
 * To use your actual script from ~/dev/ML/ga_keyboard/main.py:
 * 1. Copy the Python modules to a public directory or bundle them
 * 2. Load them using pyodide's file system or fetch API
 * 3. Replace the createPythonScript() function to import and call your actual module
 * 
 * Example:
 *   const script = await fetch('/path/to/ga_keyboard/main.py').then(r => r.text());
 *   pyodide.FS.writeFile('/ga_keyboard/main.py', script);
 *   pyodide.runPython('import sys; sys.path.append("/"); from ga_keyboard.main import main');
 */

export interface PythonRunOptions {
  corpus: string;
  onProgress?: (message: string, progress?: number) => void;
  onError?: (error: string) => void;
  onInitProgress?: (message: string, progress?: number) => void;
}

export interface PythonRunResult {
  success: boolean;
  layout?: string;
  output?: string;
  error?: string;
}

// Cache for Pyodide instance
let pyodideInstance: PyodideInterface | null = null;

/**
 * Initialize Pyodide (only once)
 */
export async function initPyodide(
  onProgress?: (message: string, progress?: number) => void
): Promise<PyodideInterface> {
  if (pyodideInstance) {
    console.log('[Pyodide] Using cached Pyodide instance');
    return pyodideInstance;
  }

  console.log('[Pyodide] Starting initialization...');
  if (onProgress) {
    onProgress('Loading Pyodide runtime...', 5);
  }

  console.log('[Pyodide] Loading Pyodide from CDN...');
  const startTime = Date.now();
  const pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/',
  });
  const loadTime = Date.now() - startTime;
  console.log(`[Pyodide] Loaded in ${loadTime}ms`);

  if (onProgress) {
    onProgress('Python environment ready', 30);
  }

  // We don't need any additional packages for the genetic algorithm
  // The standard library (random) is sufficient
  console.log('[Pyodide] Initialization complete - no additional packages needed');

  pyodideInstance = pyodide;
  return pyodide;
}

/**
 * Create the Python genetic algorithm script
 */
function createPythonScript(): string {
  return `
import random

# Standard QWERTY positions (45 characters)
QWERTY_POSITIONS = "1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./"

# Letters-only mode: only rearrange letters, keep numbers/symbols fixed
LETTERS_ONLY = True

# Identify letter positions (indices where letters are in QWERTY)
LETTER_INDICES = [i for i, char in enumerate(QWERTY_POSITIONS) if char.isalpha()]
# Numbers and symbols stay in their original positions
FIXED_CHARS = {i: char for i, char in enumerate(QWERTY_POSITIONS) if not char.isalpha()}

# Pre-compute bigram counts once (outside function for efficiency)
_bigram_cache = None
_corpus_hash = None

def calculate_fitness(layout, corpus_text, bigram_counts=None):
    """Calculate fitness score for a layout based on corpus"""
    if not corpus_text:
        return 0
    
    # Use pre-computed bigram counts if provided, otherwise compute
    if bigram_counts is None:
        bigram_counts = {}
        corpus_lower = corpus_text.lower()
        for i in range(len(corpus_lower) - 1):
            bigram = corpus_lower[i:i+2]
            if len(bigram) == 2 and bigram[0].isalnum() and bigram[1].isalnum():
                bigram_counts[bigram] = bigram_counts.get(bigram, 0) + 1
    
    # Home row indices (a-s-d-f-g-h-j-k-l positions in QWERTY)
    home_row_indices = set([16, 17, 18, 19, 20, 21, 22, 23, 24])
    score = 0
    
    # Create layout index map for faster lookups
    layout_map = {char: idx for idx, char in enumerate(layout)}
    
    for bigram, count in bigram_counts.items():
        if len(bigram) == 2 and bigram[0].isalnum() and bigram[1].isalnum():
            idx1 = layout_map.get(bigram[0])
            idx2 = layout_map.get(bigram[1])
            
            if idx1 is not None and idx2 is not None:
                # Prefer home row
                if idx1 in home_row_indices:
                    score += count * 2
                if idx2 in home_row_indices:
                    score += count * 2
                
                # Penalize long distances
                row1 = idx1 // 13
                row2 = idx2 // 13
                col1 = idx1 % 13
                col2 = idx2 % 13
                distance = abs(row1 - row2) + abs(col1 - col2)
                score -= count * distance * 0.1
    
    return max(score, 0)

def mutate(layout):
    """Mutate layout by swapping two random keys (letters only in letters-only mode)"""
    layout_list = list(layout)
    
    if LETTERS_ONLY:
        # Only swap letters, keep numbers/symbols fixed
        letter_positions = [i for i, char in enumerate(layout_list) if char.isalpha()]
        if len(letter_positions) < 2:
            return layout
        i, j = random.sample(letter_positions, 2)
    else:
        # Can swap any characters
        i, j = random.sample(range(len(layout_list)), 2)
    
    layout_list[i], layout_list[j] = layout_list[j], layout_list[i]
    return ''.join(layout_list)

def crossover(parent1, parent2):
    """Single point crossover with duplicate fixing (letters-only mode aware)"""
    if LETTERS_ONLY:
        # Only crossover letters, keep numbers/symbols from parent1
        child1_list = list(parent1)
        child2_list = list(parent2)
        
        # Extract letters from both parents
        letters1 = [char for char in parent1 if char.isalpha()]
        letters2 = [char for char in parent2 if char.isalpha()]
        
        # Crossover point for letters only
        if len(letters1) < 2:
            return parent1, parent2
        point = random.randint(1, len(letters1) - 1)
        
        # Create crossed-over letter sequences
        child1_letters = letters1[:point] + letters2[point:]
        child2_letters = letters2[:point] + letters1[point:]
        
        # Fix duplicates in letter sequences
        def fix_letter_duplicates(letters, source):
            used = set(letters[:point])
            available = [c for c in source if c not in used]
            for i in range(point, len(letters)):
                if letters[i] in used:
                    if available:
                        letters[i] = available.pop(0)
                        used.add(letters[i])
            return letters
        
        child1_letters = fix_letter_duplicates(child1_letters, letters2)
        child2_letters = fix_letter_duplicates(child2_letters, letters1)
        
        # Place letters back into positions, keeping numbers/symbols fixed
        letter_idx1 = 0
        letter_idx2 = 0
        for i in range(len(child1_list)):
            if child1_list[i].isalpha():
                child1_list[i] = child1_letters[letter_idx1]
                child2_list[i] = child2_letters[letter_idx2]
                letter_idx1 += 1
                letter_idx2 += 1
        
        return ''.join(child1_list), ''.join(child2_list)
    else:
        # Original crossover for non-letters-only mode
        point = random.randint(1, len(parent1) - 1)
        child1 = list(parent1[:point] + parent2[point:])
        child2 = list(parent2[:point] + parent1[point:])
        
        def fix_duplicates(child, parent):
            used = set(child[:point])
            for i in range(point, len(child)):
                if child[i] in used:
                    for char in parent:
                        if char not in used:
                            child[i] = char
                            used.add(char)
                            break
            return ''.join(child)
        
        child1 = fix_duplicates(child1, parent2)
        child2 = fix_duplicates(child2, parent1)
        return child1, child2

def initialize_population(size, seed):
    """Initialize population with shuffled layouts"""
    random.seed(seed)
    population = []
    base_layout = QWERTY_POSITIONS
    
    # Extract only letters for shuffling
    letters = [char for char in base_layout if char.isalpha()]
    
    for _ in range(size):
        # Create new layout with fixed positions for numbers/symbols
        layout_list = list(base_layout)
        
        # Shuffle only the letters
        shuffled_letters = letters.copy()
        random.shuffle(shuffled_letters)
        
        # Place shuffled letters back in letter positions
        letter_idx = 0
        for i in range(len(layout_list)):
            if layout_list[i].isalpha():
                layout_list[i] = shuffled_letters[letter_idx]
                letter_idx += 1
        
        population.append(''.join(layout_list))
    
    return population

def run_genetic_algorithm(corpus, generations, population_size, mutation_rate, crossover_rate, elitism, seed, progress_callback):
    """Main genetic algorithm loop"""
    random.seed(seed)
    progress_callback("Pre-computing bigram frequencies...", 0)
    
    # Pre-compute bigram counts once for efficiency
    bigram_counts = {}
    corpus_lower = corpus.lower()
    for i in range(len(corpus_lower) - 1):
        bigram = corpus_lower[i:i+2]
        if len(bigram) == 2 and bigram[0].isalnum() and bigram[1].isalnum():
            bigram_counts[bigram] = bigram_counts.get(bigram, 0) + 1
    
    progress_callback(f"Found {len(bigram_counts)} unique bigrams", 1)
    progress_callback("Initializing population...", 2)
    pop = initialize_population(population_size, seed)
    best_layout = None
    best_fitness = -1
    
    progress_callback(f"Starting evolution with {population_size} individuals...", 3)
    
    for generation in range(generations):
        # Evaluate fitness
        fitness_scores = []
        for i, layout in enumerate(pop):
            fitness = calculate_fitness(layout, corpus, bigram_counts)
            fitness_scores.append((fitness, layout))
            if fitness > best_fitness:
                best_fitness = fitness
                best_layout = layout
        
        # Sort by fitness
        fitness_scores.sort(reverse=True)
        
        # Elitism - keep top N
        elite_count = elitism
        new_pop = [layout for _, layout in fitness_scores[:elite_count]]
        
        # Generate new population
        children_count = 0
        # Pre-compute fitness for all parents to avoid recalculating
        parent_fitness = {layout: fit for fit, layout in fitness_scores}
        
        while len(new_pop) < population_size:
            # Tournament selection using pre-computed fitness
            parent1 = max(random.sample(pop, 3), key=lambda x: parent_fitness.get(x, 0))
            parent2 = max(random.sample(pop, 3), key=lambda x: parent_fitness.get(x, 0))
            
            # Crossover
            if random.random() < crossover_rate:
                child1, child2 = crossover(parent1, parent2)
            else:
                child1, child2 = parent1, parent2
            
            # Mutation
            if random.random() < mutation_rate:
                child1 = mutate(child1)
            if random.random() < mutation_rate:
                child2 = mutate(child2)
            
            new_pop.extend([child1, child2])
            children_count += 2
        
        pop = new_pop[:population_size]
        
        # Progress callback - more frequent updates for better feedback
        if generation % 5 == 0 or generation == generations - 1:
            progress = ((generation + 1) / generations) * 100
            progress_callback(f"Generation {generation + 1}/{generations}, Best fitness: {best_fitness:.2f}", progress)
    
    progress_callback("Completed! Best layout found.", 100)
    return best_layout or QWERTY_POSITIONS

# Execute using global variables
# Full parameters matching command line: --generations 300 --population 200
print("Starting genetic algorithm execution...")
print(f"Corpus length: {len(CORPUS)} characters")
result = run_genetic_algorithm(
    corpus=CORPUS,
    generations=300,  # Full generations for better results
    population_size=200,  # Full population size
    mutation_rate=0.1,
    crossover_rate=0.7,
    elitism=5,
    seed=1234,
    progress_callback=progress_wrapper
)
print(f"Algorithm completed. Result length: {len(result)}")
result
`;
}

/**
 * Run the Python genetic algorithm script
 */
export async function runPythonGA(
  options: PythonRunOptions
): Promise<PythonRunResult> {
  try {
    console.log('[PythonGA] Starting genetic algorithm execution');
    console.log(`[PythonGA] Corpus length: ${options.corpus.length} characters`);
    
    // Use init progress callback if provided, otherwise use main progress
    const initProgress = options.onInitProgress || options.onProgress;
    
    if (initProgress) {
      initProgress('Loading Pyodide (this may take a minute on first run)...', 5);
    }
    
    console.log('[PythonGA] Initializing Pyodide...');
    const initStartTime = Date.now();
    const pyodide = await initPyodide(initProgress);
    const initTime = Date.now() - initStartTime;
    console.log(`[PythonGA] Pyodide initialized in ${initTime}ms`);
    
    if (options.onProgress) {
      options.onProgress('Initializing genetic algorithm...', 35);
    }
    
    console.log('[PythonGA] Setting up Python environment...');
    
    // Create progress callback wrapper
    const progressCallback = (message: string, progress?: number) => {
      console.log(`[PythonGA Progress] ${message}${progress !== undefined ? ` (${progress.toFixed(1)}%)` : ''}`);
      if (options.onProgress) {
        options.onProgress(message, progress);
      }
    };

    // Create a Python-callable function using toPy
    console.log('[PythonGA] Creating Python-callable progress callback...');
    const pyProgressCallback = pyodide.toPy((message: string, progress?: number) => {
      progressCallback(message, progress);
    });
    
    // Set up Python environment with corpus and progress callback
    console.log('[PythonGA] Setting up Python globals...');
    pyodide.runPython(`
# Set up corpus and progress callback
CORPUS = None
PROGRESS = None
    `);
    
    // Assign values using Python's globals
    pyodide.globals.set('CORPUS', options.corpus);
    pyodide.globals.set('PROGRESS', pyProgressCallback);
    console.log('[PythonGA] Corpus and progress callback set in Python globals');
    
    // Create a Python wrapper function
    console.log('[PythonGA] Creating Python progress wrapper function...');
    pyodide.runPython(`
def progress_wrapper(message, progress=None):
    PROGRESS(message, progress)
    `);

    // Get and run the Python script
    console.log('[PythonGA] Generating Python script...');
    const script = createPythonScript();
    console.log(`[PythonGA] Python script length: ${script.length} characters`);
    
    console.log('[PythonGA] Executing genetic algorithm...');
    const execStartTime = Date.now();
    const result = pyodide.runPython(script);
    const execTime = Date.now() - execStartTime;
    console.log(`[PythonGA] Execution completed in ${execTime}ms`);
    
    // Extract the layout string
    const layout = result?.toString() || '';
    console.log(`[PythonGA] Result layout length: ${layout.length}`);
    
    if (layout && layout.length === 45) {
      console.log('[PythonGA] Success! Generated valid 45-character layout');
      return {
        success: true,
        layout,
        output: `Layout generated successfully after processing corpus.`,
      };
    } else {
      console.error(`[PythonGA] Error: Layout length mismatch. Expected 45, got ${layout.length}`);
      return {
        success: false,
        error: `Generated layout is not 45 characters long (got ${layout.length})`,
      };
    }
  } catch (error: any) {
    console.error('[PythonGA] Error during execution:', error);
    const errorMessage = error?.message || String(error);
    if (options.onError) {
      options.onError(errorMessage);
    }
    return {
      success: false,
      error: errorMessage,
    };
  }
}

