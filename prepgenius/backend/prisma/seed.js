const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const problems = [
  {
    title: 'Sum of Two Numbers',
    slug: 'sum-two-numbers',
    difficulty: 'easy',
    description: 'Given two integers on one line, return their sum.\n\nInput: Two integers separated by space.\nOutput: A single integer representing their sum.',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>

int main() {
    long long a, b;
    if (scanf("%lld %lld", &a, &b) != 2) {
        return 0;
    }
    printf("%lld", a + b);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLong()) {
            return;
        }
        long a = sc.nextLong();
        long b = sc.nextLong();
        System.out.print(a + b);
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if len(data) < 2:
        return
    a = int(data[0])
    b = int(data[1])
    print(a + b)

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>

int main() {
    long long a, b;
    if (scanf("%lld %lld", &a, &b) != 2) {
        return 0;
    }
    printf("%lld", a + b);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLong()) {
            return;
        }
        long a = sc.nextLong();
        long b = sc.nextLong();
        System.out.print(a + b);
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if len(data) < 2:
        return
    a = int(data[0])
    b = int(data[1])
    print(a + b)

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: '2 5', expectedOutput: '7', isHidden: false, weight: 1 },
      { input: '100 250', expectedOutput: '350', isHidden: false, weight: 1 },
      { input: '-5 10', expectedOutput: '5', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'Max of Three Numbers',
    slug: 'max-of-three',
    difficulty: 'easy',
    description: 'Given three integers on one line, output the maximum value.\n\nInput: a b c\nOutput: max(a, b, c)',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>

int main() {
    long long a, b, c;
    if (scanf("%lld %lld %lld", &a, &b, &c) != 3) {
        return 0;
    }
    long long max = a;
    if (b > max) max = b;
    if (c > max) max = c;
    printf("%lld", max);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLong()) return;
        long a = sc.nextLong();
        long b = sc.nextLong();
        long c = sc.nextLong();
        long max = Math.max(a, Math.max(b, c));
        System.out.print(max);
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if len(data) < 3:
        return
    a, b, c = map(int, data[:3])
    print(max(a, b, c))

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>

int main() {
    long long a, b, c;
    if (scanf("%lld %lld %lld", &a, &b, &c) != 3) {
        return 0;
    }
    long long max = a;
    if (b > max) max = b;
    if (c > max) max = c;
    printf("%lld", max);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLong()) return;
        long a = sc.nextLong();
        long b = sc.nextLong();
        long c = sc.nextLong();
        long max = Math.max(a, Math.max(b, c));
        System.out.print(max);
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if len(data) < 3:
        return
    a, b, c = map(int, data[:3])
    print(max(a, b, c))

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: '3 9 7', expectedOutput: '9', isHidden: false, weight: 1 },
      { input: '-1 -5 -3', expectedOutput: '-1', isHidden: false, weight: 1 },
      { input: '100 100 99', expectedOutput: '100', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'Count Vowels',
    slug: 'count-vowels',
    difficulty: 'easy',
    description: 'Given a line of text, count the vowels (a, e, i, o, u) case-insensitively.\n\nInput: a single line of text\nOutput: total vowel count',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>
#include <ctype.h>

int main() {
    char buffer[2048];
    if (!fgets(buffer, sizeof(buffer), stdin)) {
        return 0;
    }
    int count = 0;
    for (int i = 0; buffer[i] != '\\0'; i++) {
        char ch = tolower((unsigned char)buffer[i]);
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
            count++;
        }
    }
    printf("%d", count);
    return 0;
}
`,
      java: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        int count = 0;
        for (int i = 0; i < line.length(); i++) {
            char ch = Character.toLowerCase(line.charAt(i));
            if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
                count++;
            }
        }
        System.out.print(count);
    }
}
`,
      python: `def main():
    import sys
    line = sys.stdin.read()
    if not line:
        return
    count = sum(1 for ch in line.lower() if ch in "aeiou")
    print(count)

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>
#include <ctype.h>

int main() {
    char buffer[2048];
    if (!fgets(buffer, sizeof(buffer), stdin)) {
        return 0;
    }
    int count = 0;
    for (int i = 0; buffer[i] != '\\0'; i++) {
        char ch = tolower((unsigned char)buffer[i]);
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
            count++;
        }
    }
    printf("%d", count);
    return 0;
}
`,
      java: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        int count = 0;
        for (int i = 0; i < line.length(); i++) {
            char ch = Character.toLowerCase(line.charAt(i));
            if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
                count++;
            }
        }
        System.out.print(count);
    }
}
`,
      python: `def main():
    import sys
    line = sys.stdin.read()
    if not line:
        return
    count = sum(1 for ch in line.lower() if ch in "aeiou")
    print(count)

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: 'Interview Prep', expectedOutput: '4', isHidden: false, weight: 1 },
      { input: 'Sky', expectedOutput: '0', isHidden: false, weight: 1 },
      { input: 'AEIOU', expectedOutput: '5', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'Factorial',
    slug: 'factorial',
    difficulty: 'easy',
    description: 'Given an integer n (0 <= n <= 12), output n! (factorial).\n\nInput: n\nOutput: n!',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    long long result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    printf("%lld", result);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        long result = 1;
        for (int i = 2; i <= n; i++) result *= i;
        System.out.print(result);
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip()
    if not data:
        return
    n = int(data)
    result = 1
    for i in range(2, n + 1):
        result *= i
    print(result)

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    long long result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    printf("%lld", result);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        long result = 1;
        for (int i = 2; i <= n; i++) result *= i;
        System.out.print(result);
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip()
    if not data:
        return
    n = int(data)
    result = 1
    for i in range(2, n + 1):
        result *= i
    print(result)

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: '5', expectedOutput: '120', isHidden: false, weight: 1 },
      { input: '0', expectedOutput: '1', isHidden: false, weight: 1 },
      { input: '10', expectedOutput: '3628800', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'Reverse String',
    slug: 'reverse-string',
    difficulty: 'easy',
    description: 'Given a line of text, output the reversed string.\n\nInput: a single line\nOutput: reversed line',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char buffer[2048];
    if (!fgets(buffer, sizeof(buffer), stdin)) return 0;
    size_t len = strlen(buffer);
    if (len > 0 && buffer[len - 1] == '\n') {
        buffer[len - 1] = '\\0';
        len--;
    }
    for (int i = (int)len - 1; i >= 0; i--) {
        putchar(buffer[i]);
    }
    return 0;
}
`,
      java: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        StringBuilder sb = new StringBuilder(line);
        System.out.print(sb.reverse());
    }
}
`,
      python: `def main():
    import sys
    line = sys.stdin.read()
    if not line:
        return
    line = line.rstrip("\n")
    print(line[::-1])

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char buffer[2048];
    if (!fgets(buffer, sizeof(buffer), stdin)) return 0;
    size_t len = strlen(buffer);
    if (len > 0 && buffer[len - 1] == '\n') {
        buffer[len - 1] = '\\0';
        len--;
    }
    for (int i = (int)len - 1; i >= 0; i--) {
        putchar(buffer[i]);
    }
    return 0;
}
`,
      java: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        StringBuilder sb = new StringBuilder(line);
        System.out.print(sb.reverse());
    }
}
`,
      python: `def main():
    import sys
    line = sys.stdin.read()
    if not line:
        return
    line = line.rstrip("\n")
    print(line[::-1])

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: 'hello', expectedOutput: 'olleh', isHidden: false, weight: 1 },
      { input: 'Prep Genius', expectedOutput: 'suneG perP', isHidden: false, weight: 1 },
      { input: 'A', expectedOutput: 'A', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'Two Sum Indices',
    slug: 'two-sum-indices',
    difficulty: 'medium',
    description: 'Given n, an array of n integers, and a target, return the 0-based indices of two numbers that add up to target. If none, output "-1 -1".\n\nInput: n\narray values\ntarget\nOutput: i j',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    long long *arr = (long long*)malloc(sizeof(long long) * n);
    for (int i = 0; i < n; i++) scanf("%lld", &arr[i]);
    long long target;
    scanf("%lld", &target);
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (arr[i] + arr[j] == target) {
                printf("%d %d", i, j);
                free(arr);
                return 0;
            }
        }
    }
    printf("-1 -1");
    free(arr);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        long[] arr = new long[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextLong();
        long target = sc.nextLong();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (arr[i] + arr[j] == target) {
                    System.out.print(i + " " + j);
                    return;
                }
            }
        }
        System.out.print("-1 -1");
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if not data:
        return
    n = int(data[0])
    values = list(map(int, data[1:1 + n]))
    target = int(data[1 + n])
    for i in range(n):
        for j in range(i + 1, n):
            if values[i] + values[j] == target:
                print(i, j)
                return
    print("-1 -1")

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    long long *arr = (long long*)malloc(sizeof(long long) * n);
    for (int i = 0; i < n; i++) scanf("%lld", &arr[i]);
    long long target;
    scanf("%lld", &target);
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (arr[i] + arr[j] == target) {
                printf("%d %d", i, j);
                free(arr);
                return 0;
            }
        }
    }
    printf("-1 -1");
    free(arr);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        long[] arr = new long[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextLong();
        long target = sc.nextLong();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (arr[i] + arr[j] == target) {
                    System.out.print(i + " " + j);
                    return;
                }
            }
        }
        System.out.print("-1 -1");
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if not data:
        return
    n = int(data[0])
    values = list(map(int, data[1:1 + n]))
    target = int(data[1 + n])
    for i in range(n):
        for j in range(i + 1, n):
            if values[i] + values[j] == target:
                print(i, j)
                return
    print("-1 -1")

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isHidden: false, weight: 1 },
      { input: '3\n1 2 3\n7', expectedOutput: '-1 -1', isHidden: false, weight: 1 },
      { input: '5\n3 3 4 5 6\n6', expectedOutput: '0 1', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'medium',
    description: 'Given a string containing only parentheses ()[]{} determine if the string is valid. Output "true" or "false".\n\nInput: string\nOutput: true/false',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[2048];
    if (!fgets(s, sizeof(s), stdin)) return 0;
    int n = (int)strlen(s);
    if (n > 0 && s[n - 1] == '\n') s[n - 1] = '\\0';
    char stack[2048];
    int top = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') {
            stack[top++] = c;
        } else {
            if (top == 0) {
                printf("false");
                return 0;
            }
            char last = stack[--top];
            if ((c == ')' && last != '(') || (c == ']' && last != '[') || (c == '}' && last != '{')) {
                printf("false");
                return 0;
            }
        }
    }
    printf(top == 0 ? "true" : "false");
    return 0;
}
`,
      java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) return;
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') stack.push(c);
            else {
                if (stack.isEmpty()) {
                    System.out.print("false");
                    return;
                }
                char last = stack.pop();
                if ((c == ')' && last != '(') || (c == ']' && last != '[') || (c == '}' && last != '{')) {
                    System.out.print("false");
                    return;
                }
            }
        }
        System.out.print(stack.isEmpty() ? "true" : "false");
    }
}
`,
      python: `def main():
    import sys
    s = sys.stdin.read().strip()
    if not s:
        return
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        else:
            if not stack or stack[-1] != pairs.get(ch):
                print("false")
                return
            stack.pop()
    print("true" if not stack else "false")

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[2048];
    if (!fgets(s, sizeof(s), stdin)) return 0;
    int n = (int)strlen(s);
    if (n > 0 && s[n - 1] == '\n') s[n - 1] = '\\0';
    char stack[2048];
    int top = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') {
            stack[top++] = c;
        } else {
            if (top == 0) {
                printf("false");
                return 0;
            }
            char last = stack[--top];
            if ((c == ')' && last != '(') || (c == ']' && last != '[') || (c == '}' && last != '{')) {
                printf("false");
                return 0;
            }
        }
    }
    printf(top == 0 ? "true" : "false");
    return 0;
}
`,
      java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) return;
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') stack.push(c);
            else {
                if (stack.isEmpty()) {
                    System.out.print("false");
                    return;
                }
                char last = stack.pop();
                if ((c == ')' && last != '(') || (c == ']' && last != '[') || (c == '}' && last != '{')) {
                    System.out.print("false");
                    return;
                }
            }
        }
        System.out.print(stack.isEmpty() ? "true" : "false");
    }
}
`,
      python: `def main():
    import sys
    s = sys.stdin.read().strip()
    if not s:
        return
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        else:
            if not stack or stack[-1] != pairs.get(ch):
                print("false")
                return
            stack.pop()
    print("true" if not stack else "false")

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: '()[]{}', expectedOutput: 'true', isHidden: false, weight: 1 },
      { input: '(]', expectedOutput: 'false', isHidden: false, weight: 1 },
      { input: '({[]})', expectedOutput: 'true', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'Merge Sorted Arrays',
    slug: 'merge-sorted-arrays',
    difficulty: 'medium',
    description: 'Given two sorted arrays, merge them into a single sorted array.\n\nInput: n m\narray A values\narray B values\nOutput: merged array values',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, m;
    if (scanf("%d %d", &n, &m) != 2) return 0;
    long long *a = (long long*)malloc(sizeof(long long) * n);
    long long *b = (long long*)malloc(sizeof(long long) * m);
    for (int i = 0; i < n; i++) scanf("%lld", &a[i]);
    for (int j = 0; j < m; j++) scanf("%lld", &b[j]);
    int i = 0, j = 0;
    int first = 1;
    while (i < n && j < m) {
        long long val = (a[i] <= b[j]) ? a[i++] : b[j++];
        if (!first) printf(" ");
        printf("%lld", val);
        first = 0;
    }
    while (i < n) {
        if (!first) printf(" ");
        printf("%lld", a[i++]);
        first = 0;
    }
    while (j < m) {
        if (!first) printf(" ");
        printf("%lld", b[j++]);
        first = 0;
    }
    free(a);
    free(b);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int m = sc.nextInt();
        long[] a = new long[n];
        long[] b = new long[m];
        for (int i = 0; i < n; i++) a[i] = sc.nextLong();
        for (int i = 0; i < m; i++) b[i] = sc.nextLong();
        int i = 0, j = 0;
        StringBuilder out = new StringBuilder();
        while (i < n && j < m) {
            long val = (a[i] <= b[j]) ? a[i++] : b[j++];
            if (out.length() > 0) out.append(' ');
            out.append(val);
        }
        while (i < n) {
            if (out.length() > 0) out.append(' ');
            out.append(a[i++]);
        }
        while (j < m) {
            if (out.length() > 0) out.append(' ');
            out.append(b[j++]);
        }
        System.out.print(out.toString());
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    a = list(map(int, data[2:2 + n]))
    b = list(map(int, data[2 + n:2 + n + m]))
    i = j = 0
    merged = []
    while i < n and j < m:
        if a[i] <= b[j]:
            merged.append(a[i])
            i += 1
        else:
            merged.append(b[j])
            j += 1
    merged.extend(a[i:])
    merged.extend(b[j:])
    print(" ".join(str(x) for x in merged))

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, m;
    if (scanf("%d %d", &n, &m) != 2) return 0;
    long long *a = (long long*)malloc(sizeof(long long) * n);
    long long *b = (long long*)malloc(sizeof(long long) * m);
    for (int i = 0; i < n; i++) scanf("%lld", &a[i]);
    for (int j = 0; j < m; j++) scanf("%lld", &b[j]);
    int i = 0, j = 0;
    int first = 1;
    while (i < n && j < m) {
        long long val = (a[i] <= b[j]) ? a[i++] : b[j++];
        if (!first) printf(" ");
        printf("%lld", val);
        first = 0;
    }
    while (i < n) {
        if (!first) printf(" ");
        printf("%lld", a[i++]);
        first = 0;
    }
    while (j < m) {
        if (!first) printf(" ");
        printf("%lld", b[j++]);
        first = 0;
    }
    free(a);
    free(b);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int m = sc.nextInt();
        long[] a = new long[n];
        long[] b = new long[m];
        for (int i = 0; i < n; i++) a[i] = sc.nextLong();
        for (int i = 0; i < m; i++) b[i] = sc.nextLong();
        int i = 0, j = 0;
        StringBuilder out = new StringBuilder();
        while (i < n && j < m) {
            long val = (a[i] <= b[j]) ? a[i++] : b[j++];
            if (out.length() > 0) out.append(' ');
            out.append(val);
        }
        while (i < n) {
            if (out.length() > 0) out.append(' ');
            out.append(a[i++]);
        }
        while (j < m) {
            if (out.length() > 0) out.append(' ');
            out.append(b[j++]);
        }
        System.out.print(out.toString());
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    a = list(map(int, data[2:2 + n]))
    b = list(map(int, data[2 + n:2 + n + m]))
    i = j = 0
    merged = []
    while i < n and j < m:
        if a[i] <= b[j]:
            merged.append(a[i])
            i += 1
        else:
            merged.append(b[j])
            j += 1
    merged.extend(a[i:])
    merged.extend(b[j:])
    print(" ".join(str(x) for x in merged))

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: '3 3\n1 4 7\n2 3 8', expectedOutput: '1 2 3 4 7 8', isHidden: false, weight: 1 },
      { input: '2 4\n5 9\n1 2 3 10', expectedOutput: '1 2 3 5 9 10', isHidden: false, weight: 1 },
      { input: '1 1\n-1\n-2', expectedOutput: '-2 -1', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'Rotate Array',
    slug: 'rotate-array',
    difficulty: 'medium',
    description: 'Rotate the array to the right by k steps.\n\nInput: n\narray values\nk\nOutput: rotated array values',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    if (n <= 0) return 0;
    long long *arr = (long long*)malloc(sizeof(long long) * n);
    for (int i = 0; i < n; i++) scanf("%lld", &arr[i]);
    long long k;
    scanf("%lld", &k);
    k %= n;
    int start = (int)(n - k);
    int first = 1;
    for (int i = start; i < n; i++) {
        if (!first) printf(" ");
        printf("%lld", arr[i]);
        first = 0;
    }
    for (int i = 0; i < start; i++) {
        if (!first) printf(" ");
        printf("%lld", arr[i]);
        first = 0;
    }
    free(arr);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        if (n <= 0) return;
        long[] arr = new long[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextLong();
        long k = sc.nextLong();
        k %= n;
        int start = (int)(n - k);
        StringBuilder out = new StringBuilder();
        for (int i = start; i < n; i++) {
            if (out.length() > 0) out.append(' ');
            out.append(arr[i]);
        }
        for (int i = 0; i < start; i++) {
            if (out.length() > 0) out.append(' ');
            out.append(arr[i]);
        }
        System.out.print(out.toString());
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if not data:
        return
    n = int(data[0])
    if n <= 0:
        return
    arr = list(map(int, data[1:1 + n]))
    k = int(data[1 + n]) % n
    rotated = arr[-k:] + arr[:-k] if k else arr
    print(" ".join(str(x) for x in rotated))

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    if (n <= 0) return 0;
    long long *arr = (long long*)malloc(sizeof(long long) * n);
    for (int i = 0; i < n; i++) scanf("%lld", &arr[i]);
    long long k;
    scanf("%lld", &k);
    k %= n;
    int start = (int)(n - k);
    int first = 1;
    for (int i = start; i < n; i++) {
        if (!first) printf(" ");
        printf("%lld", arr[i]);
        first = 0;
    }
    for (int i = 0; i < start; i++) {
        if (!first) printf(" ");
        printf("%lld", arr[i]);
        first = 0;
    }
    free(arr);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        if (n <= 0) return;
        long[] arr = new long[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextLong();
        long k = sc.nextLong();
        k %= n;
        int start = (int)(n - k);
        StringBuilder out = new StringBuilder();
        for (int i = start; i < n; i++) {
            if (out.length() > 0) out.append(' ');
            out.append(arr[i]);
        }
        for (int i = 0; i < start; i++) {
            if (out.length() > 0) out.append(' ');
            out.append(arr[i]);
        }
        System.out.print(out.toString());
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if not data:
        return
    n = int(data[0])
    if n <= 0:
        return
    arr = list(map(int, data[1:1 + n]))
    k = int(data[1 + n]) % n
    rotated = arr[-k:] + arr[:-k] if k else arr
    print(" ".join(str(x) for x in rotated))

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: '5\n1 2 3 4 5\n2', expectedOutput: '4 5 1 2 3', isHidden: false, weight: 1 },
      { input: '3\n10 20 30\n1', expectedOutput: '30 10 20', isHidden: false, weight: 1 },
      { input: '4\n7 8 9 10\n4', expectedOutput: '7 8 9 10', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'Longest Word',
    slug: 'longest-word',
    difficulty: 'medium',
    description: 'Given a line of text, output the longest word (split by whitespace). If there is a tie, output the first longest word.\n\nInput: a single line\nOutput: longest word',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char line[2048];
    if (!fgets(line, sizeof(line), stdin)) return 0;
    char *token = strtok(line, " \t\r\n");
    char *best = NULL;
    while (token) {
        if (!best || strlen(token) > strlen(best)) {
            best = token;
        }
        token = strtok(NULL, " \t\r\n");
    }
    if (best) printf("%s", best);
    return 0;
}
`,
      java: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        String[] parts = line.trim().split("\\s+");
        String best = "";
        for (String part : parts) {
            if (part.length() > best.length()) {
                best = part;
            }
        }
        System.out.print(best);
    }
}
`,
      python: `def main():
    import sys
    line = sys.stdin.read().strip()
    if not line:
        return
    parts = line.split()
    best = ""
    for part in parts:
        if len(part) > len(best):
            best = part
    print(best)

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char line[2048];
    if (!fgets(line, sizeof(line), stdin)) return 0;
    char *token = strtok(line, " \t\r\n");
    char *best = NULL;
    while (token) {
        if (!best || strlen(token) > strlen(best)) {
            best = token;
        }
        token = strtok(NULL, " \t\r\n");
    }
    if (best) printf("%s", best);
    return 0;
}
`,
      java: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        String[] parts = line.trim().split("\\s+");
        String best = "";
        for (String part : parts) {
            if (part.length() > best.length()) {
                best = part;
            }
        }
        System.out.print(best);
    }
}
`,
      python: `def main():
    import sys
    line = sys.stdin.read().strip()
    if not line:
        return
    parts = line.split()
    best = ""
    for part in parts:
        if len(part) > len(best):
            best = part
    print(best)

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: 'learn to code fast', expectedOutput: 'learn', isHidden: false, weight: 1 },
      { input: 'equal size word', expectedOutput: 'equal', isHidden: false, weight: 1 },
      { input: 'single', expectedOutput: 'single', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'Longest Unique Substring',
    slug: 'longest-unique-substring',
    difficulty: 'hard',
    description: 'Given a string, output the length of the longest substring without repeating characters.\n\nInput: string\nOutput: length',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[4096];
    if (!fgets(s, sizeof(s), stdin)) return 0;
    int n = (int)strlen(s);
    if (n > 0 && s[n - 1] == '\n') s[n - 1] = '\\0';
    int last[256];
    for (int i = 0; i < 256; i++) last[i] = -1;
    int best = 0;
    int start = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        unsigned char c = (unsigned char)s[i];
        if (last[c] >= start) start = last[c] + 1;
        last[c] = i;
        int len = i - start + 1;
        if (len > best) best = len;
    }
    printf("%d", best);
    return 0;
}
`,
      java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) return;
        int[] last = new int[256];
        Arrays.fill(last, -1);
        int best = 0;
        int start = 0;
        for (int i = 0; i < s.length(); i++) {
            int c = s.charAt(i);
            if (last[c] >= start) start = last[c] + 1;
            last[c] = i;
            int len = i - start + 1;
            if (len > best) best = len;
        }
        System.out.print(best);
    }
}
`,
      python: `def main():
    import sys
    s = sys.stdin.read().strip()
    if not s:
        return
    last = {}
    start = 0
    best = 0
    for i, ch in enumerate(s):
        if ch in last and last[ch] >= start:
            start = last[ch] + 1
        last[ch] = i
        best = max(best, i - start + 1)
    print(best)

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[4096];
    if (!fgets(s, sizeof(s), stdin)) return 0;
    int n = (int)strlen(s);
    if (n > 0 && s[n - 1] == '\n') s[n - 1] = '\\0';
    int last[256];
    for (int i = 0; i < 256; i++) last[i] = -1;
    int best = 0;
    int start = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        unsigned char c = (unsigned char)s[i];
        if (last[c] >= start) start = last[c] + 1;
        last[c] = i;
        int len = i - start + 1;
        if (len > best) best = len;
    }
    printf("%d", best);
    return 0;
}
`,
      java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s == null) return;
        int[] last = new int[256];
        Arrays.fill(last, -1);
        int best = 0;
        int start = 0;
        for (int i = 0; i < s.length(); i++) {
            int c = s.charAt(i);
            if (last[c] >= start) start = last[c] + 1;
            last[c] = i;
            int len = i - start + 1;
            if (len > best) best = len;
        }
        System.out.print(best);
    }
}
`,
      python: `def main():
    import sys
    s = sys.stdin.read().strip()
    if not s:
        return
    last = {}
    start = 0
    best = 0
    for i, ch in enumerate(s):
        if ch in last and last[ch] >= start:
            start = last[ch] + 1
        last[ch] = i
        best = max(best, i - start + 1)
    print(best)

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: 'abcabcbb', expectedOutput: '3', isHidden: false, weight: 1 },
      { input: 'bbbbb', expectedOutput: '1', isHidden: false, weight: 1 },
      { input: 'pwwkew', expectedOutput: '3', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'Min Coin Change',
    slug: 'min-coin-change',
    difficulty: 'hard',
    description: 'Given coin denominations and an amount, output the minimum number of coins needed to make the amount. If impossible, output -1.\n\nInput: n\ncoin values\namount\nOutput: minimum coin count',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *coins = (int*)malloc(sizeof(int) * n);
    for (int i = 0; i < n; i++) scanf("%d", &coins[i]);
    int amount;
    scanf("%d", &amount);
    int *dp = (int*)malloc(sizeof(int) * (amount + 1));
    int inf = amount + 1;
    for (int i = 0; i <= amount; i++) dp[i] = inf;
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int j = 0; j < n; j++) {
            int c = coins[j];
            if (c <= i && dp[i - c] + 1 < dp[i]) dp[i] = dp[i - c] + 1;
        }
    }
    if (dp[amount] == inf) printf("-1");
    else printf("%d", dp[amount]);
    free(dp);
    free(coins);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] coins = new int[n];
        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();
        int amount = sc.nextInt();
        int inf = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, inf);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (c <= i && dp[i - c] + 1 < dp[i]) dp[i] = dp[i - c] + 1;
            }
        }
        System.out.print(dp[amount] == inf ? "-1" : Integer.toString(dp[amount]));
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if not data:
        return
    n = int(data[0])
    coins = list(map(int, data[1:1 + n]))
    amount = int(data[1 + n])
    inf = amount + 1
    dp = [inf] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if c <= i and dp[i - c] + 1 < dp[i]:
                dp[i] = dp[i - c] + 1
    print(-1 if dp[amount] == inf else dp[amount])

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *coins = (int*)malloc(sizeof(int) * n);
    for (int i = 0; i < n; i++) scanf("%d", &coins[i]);
    int amount;
    scanf("%d", &amount);
    int *dp = (int*)malloc(sizeof(int) * (amount + 1));
    int inf = amount + 1;
    for (int i = 0; i <= amount; i++) dp[i] = inf;
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int j = 0; j < n; j++) {
            int c = coins[j];
            if (c <= i && dp[i - c] + 1 < dp[i]) dp[i] = dp[i - c] + 1;
        }
    }
    if (dp[amount] == inf) printf("-1");
    else printf("%d", dp[amount]);
    free(dp);
    free(coins);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] coins = new int[n];
        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();
        int amount = sc.nextInt();
        int inf = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, inf);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (c <= i && dp[i - c] + 1 < dp[i]) dp[i] = dp[i - c] + 1;
            }
        }
        System.out.print(dp[amount] == inf ? "-1" : Integer.toString(dp[amount]));
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if not data:
        return
    n = int(data[0])
    coins = list(map(int, data[1:1 + n]))
    amount = int(data[1 + n])
    inf = amount + 1
    dp = [inf] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if c <= i and dp[i - c] + 1 < dp[i]:
                dp[i] = dp[i - c] + 1
    print(-1 if dp[amount] == inf else dp[amount])

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: '3\n1 2 5\n11', expectedOutput: '3', isHidden: false, weight: 1 },
      { input: '2\n2 4\n3', expectedOutput: '-1', isHidden: false, weight: 1 },
      { input: '3\n2 3 7\n14', expectedOutput: '2', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'Min Path Sum',
    slug: 'min-path-sum',
    difficulty: 'hard',
    description: 'Given a grid of non-negative integers, find the minimum path sum from top-left to bottom-right, moving only right or down.\n\nInput: r c\nrows of grid\nOutput: minimum sum',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int r, c;
    if (scanf("%d %d", &r, &c) != 2) return 0;
    long long *dp = (long long*)malloc(sizeof(long long) * c);
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            long long val;
            scanf("%lld", &val);
            if (i == 0 && j == 0) dp[j] = val;
            else if (i == 0) dp[j] = dp[j - 1] + val;
            else if (j == 0) dp[j] = dp[j] + val;
            else dp[j] = (dp[j] < dp[j - 1] ? dp[j] : dp[j - 1]) + val;
        }
    }
    printf("%lld", dp[c - 1]);
    free(dp);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int r = sc.nextInt();
        int c = sc.nextInt();
        long[] dp = new long[c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                long val = sc.nextLong();
                if (i == 0 && j == 0) dp[j] = val;
                else if (i == 0) dp[j] = dp[j - 1] + val;
                else if (j == 0) dp[j] = dp[j] + val;
                else dp[j] = Math.min(dp[j], dp[j - 1]) + val;
            }
        }
        System.out.print(dp[c - 1]);
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if not data:
        return
    r = int(data[0])
    c = int(data[1])
    idx = 2
    dp = [0] * c
    for i in range(r):
        for j in range(c):
            val = int(data[idx])
            idx += 1
            if i == 0 and j == 0:
                dp[j] = val
            elif i == 0:
                dp[j] = dp[j - 1] + val
            elif j == 0:
                dp[j] = dp[j] + val
            else:
                dp[j] = min(dp[j], dp[j - 1]) + val
    print(dp[c - 1])

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int r, c;
    if (scanf("%d %d", &r, &c) != 2) return 0;
    long long *dp = (long long*)malloc(sizeof(long long) * c);
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            long long val;
            scanf("%lld", &val);
            if (i == 0 && j == 0) dp[j] = val;
            else if (i == 0) dp[j] = dp[j - 1] + val;
            else if (j == 0) dp[j] = dp[j] + val;
            else dp[j] = (dp[j] < dp[j - 1] ? dp[j] : dp[j - 1]) + val;
        }
    }
    printf("%lld", dp[c - 1]);
    free(dp);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int r = sc.nextInt();
        int c = sc.nextInt();
        long[] dp = new long[c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                long val = sc.nextLong();
                if (i == 0 && j == 0) dp[j] = val;
                else if (i == 0) dp[j] = dp[j - 1] + val;
                else if (j == 0) dp[j] = dp[j] + val;
                else dp[j] = Math.min(dp[j], dp[j - 1]) + val;
            }
        }
        System.out.print(dp[c - 1]);
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if not data:
        return
    r = int(data[0])
    c = int(data[1])
    idx = 2
    dp = [0] * c
    for i in range(r):
        for j in range(c):
            val = int(data[idx])
            idx += 1
            if i == 0 and j == 0:
                dp[j] = val
            elif i == 0:
                dp[j] = dp[j - 1] + val
            elif j == 0:
                dp[j] = dp[j] + val
            else:
                dp[j] = min(dp[j], dp[j - 1]) + val
    print(dp[c - 1])

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: '2 3\n1 3 1\n1 5 1', expectedOutput: '6', isHidden: false, weight: 1 },
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '21', isHidden: false, weight: 1 },
      { input: '1 4\n5 4 3 2', expectedOutput: '14', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'Shortest Path (Unweighted)',
    slug: 'shortest-path-unweighted',
    difficulty: 'hard',
    description: 'Given an unweighted graph, compute the shortest distance between two nodes. Nodes are 0-based. If unreachable, output -1.\n\nInput: n m\nedges (u v)\nstart end\nOutput: distance',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, m;
    if (scanf("%d %d", &n, &m) != 2) return 0;
    int *head = (int*)malloc(sizeof(int) * n);
    int *to = (int*)malloc(sizeof(int) * (2 * m));
    int *next = (int*)malloc(sizeof(int) * (2 * m));
    for (int i = 0; i < n; i++) head[i] = -1;
    int idx = 0;
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        to[idx] = v; next[idx] = head[u]; head[u] = idx++;
        to[idx] = u; next[idx] = head[v]; head[v] = idx++;
    }
    int start, end;
    scanf("%d %d", &start, &end);
    int *dist = (int*)malloc(sizeof(int) * n);
    for (int i = 0; i < n; i++) dist[i] = -1;
    int *queue = (int*)malloc(sizeof(int) * n);
    int qh = 0, qt = 0;
    queue[qt++] = start;
    dist[start] = 0;
    while (qh < qt) {
        int cur = queue[qh++];
        for (int e = head[cur]; e != -1; e = next[e]) {
            int v = to[e];
            if (dist[v] == -1) {
                dist[v] = dist[cur] + 1;
                queue[qt++] = v;
            }
        }
    }
    printf("%d", dist[end]);
    free(head);
    free(to);
    free(next);
    free(dist);
    free(queue);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int m = sc.nextInt();
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt();
            int v = sc.nextInt();
            graph.get(u).add(v);
            graph.get(v).add(u);
        }
        int start = sc.nextInt();
        int end = sc.nextInt();
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        queue.add(start);
        dist[start] = 0;
        while (!queue.isEmpty()) {
            int cur = queue.poll();
            for (int v : graph.get(cur)) {
                if (dist[v] == -1) {
                    dist[v] = dist[cur] + 1;
                    queue.add(v);
                }
            }
        }
        System.out.print(dist[end]);
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    graph = [[] for _ in range(n)]
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        graph[u].append(v)
        graph[v].append(u)
    start = int(next(it))
    end = int(next(it))
    dist = [-1] * n
    from collections import deque
    q = deque([start])
    dist[start] = 0
    while q:
        cur = q.popleft()
        for v in graph[cur]:
            if dist[v] == -1:
                dist[v] = dist[cur] + 1
                q.append(v)
    print(dist[end])

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, m;
    if (scanf("%d %d", &n, &m) != 2) return 0;
    int *head = (int*)malloc(sizeof(int) * n);
    int *to = (int*)malloc(sizeof(int) * (2 * m));
    int *next = (int*)malloc(sizeof(int) * (2 * m));
    for (int i = 0; i < n; i++) head[i] = -1;
    int idx = 0;
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        to[idx] = v; next[idx] = head[u]; head[u] = idx++;
        to[idx] = u; next[idx] = head[v]; head[v] = idx++;
    }
    int start, end;
    scanf("%d %d", &start, &end);
    int *dist = (int*)malloc(sizeof(int) * n);
    for (int i = 0; i < n; i++) dist[i] = -1;
    int *queue = (int*)malloc(sizeof(int) * n);
    int qh = 0, qt = 0;
    queue[qt++] = start;
    dist[start] = 0;
    while (qh < qt) {
        int cur = queue[qh++];
        for (int e = head[cur]; e != -1; e = next[e]) {
            int v = to[e];
            if (dist[v] == -1) {
                dist[v] = dist[cur] + 1;
                queue[qt++] = v;
            }
        }
    }
    printf("%d", dist[end]);
    free(head);
    free(to);
    free(next);
    free(dist);
    free(queue);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int m = sc.nextInt();
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt();
            int v = sc.nextInt();
            graph.get(u).add(v);
            graph.get(v).add(u);
        }
        int start = sc.nextInt();
        int end = sc.nextInt();
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        queue.add(start);
        dist[start] = 0;
        while (!queue.isEmpty()) {
            int cur = queue.poll();
            for (int v : graph.get(cur)) {
                if (dist[v] == -1) {
                    dist[v] = dist[cur] + 1;
                    queue.add(v);
                }
            }
        }
        System.out.print(dist[end]);
    }
}
`,
      python: `def main():
    import sys
    data = sys.stdin.read().strip().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    graph = [[] for _ in range(n)]
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        graph[u].append(v)
        graph[v].append(u)
    start = int(next(it))
    end = int(next(it))
    dist = [-1] * n
    from collections import deque
    q = deque([start])
    dist[start] = 0
    while q:
        cur = q.popleft()
        for v in graph[cur]:
            if dist[v] == -1:
                dist[v] = dist[cur] + 1
                q.append(v)
    print(dist[end])

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: '5 4\n0 1\n1 2\n2 3\n3 4\n0 4', expectedOutput: '4', isHidden: false, weight: 1 },
      { input: '4 1\n0 1\n2 3', expectedOutput: '-1', isHidden: false, weight: 1 },
      { input: '6 6\n0 1\n0 2\n1 3\n2 3\n3 4\n4 5\n0 5', expectedOutput: '4', isHidden: true, weight: 1 }
    ]
  },
  {
    title: 'LCS Length',
    slug: 'lcs-length',
    difficulty: 'hard',
    description: 'Given two strings, output the length of their longest common subsequence (LCS).\n\nInput: string s\nstring t\nOutput: LCS length',
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    supportedLanguages: ['c', 'java', 'python'],
    starterCode: {
      c: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main() {
    char s[4096];
    char t[4096];
    if (!fgets(s, sizeof(s), stdin)) return 0;
    if (!fgets(t, sizeof(t), stdin)) return 0;
    int ns = (int)strlen(s);
    int nt = (int)strlen(t);
    if (ns > 0 && s[ns - 1] == '\n') s[--ns] = '\\0';
    if (nt > 0 && t[nt - 1] == '\n') t[--nt] = '\\0';
    int *prev = (int*)calloc(nt + 1, sizeof(int));
    int *cur = (int*)calloc(nt + 1, sizeof(int));
    for (int i = 1; i <= ns; i++) {
        for (int j = 1; j <= nt; j++) {
            if (s[i - 1] == t[j - 1]) cur[j] = prev[j - 1] + 1;
            else cur[j] = (prev[j] > cur[j - 1]) ? prev[j] : cur[j - 1];
        }
        int *tmp = prev;
        prev = cur;
        cur = tmp;
    }
    printf("%d", prev[nt]);
    free(prev);
    free(cur);
    return 0;
}
`,
      java: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        String t = br.readLine();
        if (s == null || t == null) return;
        int ns = s.length();
        int nt = t.length();
        int[] prev = new int[nt + 1];
        int[] cur = new int[nt + 1];
        for (int i = 1; i <= ns; i++) {
            for (int j = 1; j <= nt; j++) {
                if (s.charAt(i - 1) == t.charAt(j - 1)) cur[j] = prev[j - 1] + 1;
                else cur[j] = Math.max(prev[j], cur[j - 1]);
            }
            int[] tmp = prev;
            prev = cur;
            cur = tmp;
        }
        System.out.print(prev[nt]);
    }
}
`,
      python: `def main():
    import sys
    lines = sys.stdin.read().splitlines()
    if len(lines) < 2:
        return
    s = lines[0]
    t = lines[1]
    nt = len(t)
    prev = [0] * (nt + 1)
    cur = [0] * (nt + 1)
    for ch in s:
        for j in range(1, nt + 1):
            if ch == t[j - 1]:
                cur[j] = prev[j - 1] + 1
            else:
                cur[j] = max(prev[j], cur[j - 1])
        prev, cur = cur, prev
    print(prev[nt])

if __name__ == "__main__":
    main()
`
    },
    referenceSolutions: {
      c: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main() {
    char s[4096];
    char t[4096];
    if (!fgets(s, sizeof(s), stdin)) return 0;
    if (!fgets(t, sizeof(t), stdin)) return 0;
    int ns = (int)strlen(s);
    int nt = (int)strlen(t);
    if (ns > 0 && s[ns - 1] == '\n') s[--ns] = '\\0';
    if (nt > 0 && t[nt - 1] == '\n') t[--nt] = '\\0';
    int *prev = (int*)calloc(nt + 1, sizeof(int));
    int *cur = (int*)calloc(nt + 1, sizeof(int));
    for (int i = 1; i <= ns; i++) {
        for (int j = 1; j <= nt; j++) {
            if (s[i - 1] == t[j - 1]) cur[j] = prev[j - 1] + 1;
            else cur[j] = (prev[j] > cur[j - 1]) ? prev[j] : cur[j - 1];
        }
        int *tmp = prev;
        prev = cur;
        cur = tmp;
    }
    printf("%d", prev[nt]);
    free(prev);
    free(cur);
    return 0;
}
`,
      java: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        String t = br.readLine();
        if (s == null || t == null) return;
        int ns = s.length();
        int nt = t.length();
        int[] prev = new int[nt + 1];
        int[] cur = new int[nt + 1];
        for (int i = 1; i <= ns; i++) {
            for (int j = 1; j <= nt; j++) {
                if (s.charAt(i - 1) == t.charAt(j - 1)) cur[j] = prev[j - 1] + 1;
                else cur[j] = Math.max(prev[j], cur[j - 1]);
            }
            int[] tmp = prev;
            prev = cur;
            cur = tmp;
        }
        System.out.print(prev[nt]);
    }
}
`,
      python: `def main():
    import sys
    lines = sys.stdin.read().splitlines()
    if len(lines) < 2:
        return
    s = lines[0]
    t = lines[1]
    nt = len(t)
    prev = [0] * (nt + 1)
    cur = [0] * (nt + 1)
    for ch in s:
        for j in range(1, nt + 1):
            if ch == t[j - 1]:
                cur[j] = prev[j - 1] + 1
            else:
                cur[j] = max(prev[j], cur[j - 1])
        prev, cur = cur, prev
    print(prev[nt])

if __name__ == "__main__":
    main()
`
    },
    testCases: [
      { input: 'abcde\nace', expectedOutput: '3', isHidden: false, weight: 1 },
      { input: 'abc\nabc', expectedOutput: '3', isHidden: false, weight: 1 },
      { input: 'abc\ndef', expectedOutput: '0', isHidden: true, weight: 1 }
    ]
  }
];

const seed = async () => {
  for (const problem of problems) {
    const existing = await prisma.codingProblem.findUnique({
      where: { slug: problem.slug }
    });

    if (existing) {
      await prisma.codingTestCase.deleteMany({
        where: { problemId: existing.id }
      });

      await prisma.codingProblem.update({
        where: { id: existing.id },
        data: {
          title: problem.title,
          difficulty: problem.difficulty,
          description: problem.description,
          timeLimitMs: problem.timeLimitMs,
          memoryLimitMb: problem.memoryLimitMb,
          supportedLanguages: problem.supportedLanguages,
          starterCode: problem.starterCode,
          referenceSolutions: problem.referenceSolutions
        }
      });

      await prisma.codingTestCase.createMany({
        data: problem.testCases.map((testCase) => ({
          problemId: existing.id,
          ...testCase
        }))
      });

      continue;
    }

    await prisma.codingProblem.create({
      data: {
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        description: problem.description,
        timeLimitMs: problem.timeLimitMs,
        memoryLimitMb: problem.memoryLimitMb,
        supportedLanguages: problem.supportedLanguages,
        starterCode: problem.starterCode,
        referenceSolutions: problem.referenceSolutions,
        testCases: {
          create: problem.testCases
        }
      }
    });
  }
};

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

