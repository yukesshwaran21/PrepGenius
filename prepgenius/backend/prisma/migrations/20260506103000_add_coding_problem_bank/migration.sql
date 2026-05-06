UPDATE "coding_problems"
SET "difficulty" = 'easy'
WHERE "slug" = 'sum-two-numbers';

UPDATE "coding_problems"
SET "referenceSolutions" = $json$
{
  "c": "#include <stdio.h>\n\nint main() {\n    long long a, b;\n    if (scanf(\"%lld %lld\", &a, &b) != 2) {\n        return 0;\n    }\n    printf(\"%lld\", a + b);\n    return 0;\n}\n",
  "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) {\n            return;\n        }\n        long a = sc.nextLong();\n        long b = sc.nextLong();\n        System.out.print(a + b);\n    }\n}\n",
  "python": "def main():\n    import sys\n    data = sys.stdin.read().strip().split()\n    if len(data) < 2:\n        return\n    a = int(data[0])\n    b = int(data[1])\n    print(a + b)\n\nif __name__ == \"__main__\":\n    main()\n"
}
$json$::jsonb
WHERE "slug" = 'sum-two-numbers';